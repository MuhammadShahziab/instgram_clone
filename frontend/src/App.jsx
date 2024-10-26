import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EditePage from "./pages/EditePage";
import Chats from "./pages/Chats";
import Explore from "./pages/Explore";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers, setSocket } from "./redux/chatSlice";
import ChatLayout from "./components/ChatLayout";
import { addFollower, addRequest, removeFollower } from "./redux/authSlice";
import { addNotification } from "./redux/notification.slice";
import NotificationPage from "./pages/NotificationPage";
import Comments from "./pages/Comments";
import ProtectedRoutes from "./components/ProtectedRoutes";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout></MainLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/profile/:id",
        element: <Profile></Profile>,
      },
      {
        path: "/accounts/edit",
        element: <EditePage></EditePage>,
      },
      {
        path: "/notifications",
        element: <NotificationPage></NotificationPage>,
      },
      {
        path: "/direct",
        element: <ChatLayout></ChatLayout>,
        children: [
          {
            path: ":id", // dynamic chat route
            element: <Chats></Chats>,
          },
        ],
      },
      {
        path: "/explore",
        element: <Explore></Explore>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/signup",
    element: <Signup></Signup>,
  },
  {
    path: "/p/:id",
    element: <Comments></Comments>,
  },
]);

const App = () => {
  const { user, userProfile } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    let socketio; // Define socketio outside the condition

    if (user) {
      socketio = io("http://localhost:8000", {
        query: {
          userId: user._id,
        },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      // Listen for Set Online Users

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      // Listen for Follow User

      socketio.on("userFollowed", (currentUser) => {
        // Dispatch the addFollower action instead of manually updating the state
        dispatch(addFollower(currentUser));
      });
      // request send to user followed

      socketio.on("followRequestSent", (data) => {
        if (user._id === userProfile?._id) {
          // Update user profile with the follow request
          dispatch(addRequest(data)); // Add the request in Redux
        }
      });
      // Listen for Unfollow

      socketio.on("userUnfollowed", (currentUserId) => {
        // Dispatch the removeFollower action
        console.log(currentUserId, "check current user-----------unfoloow");
        dispatch(removeFollower(currentUserId));
      });
      // Listen for new notifications

      socketio.on("newNotification", (data) => {
        dispatch(addNotification(data));
      });

      return () => {
        if (socketio) {
          socketio.disconnect();
          dispatch(setSocket(null));
        }
      };
    }
  }, [user, dispatch, userProfile]);

  return (
    <div>
      <RouterProvider router={browserRouter}></RouterProvider>
    </div>
  );
};

export default App;
