import {
  Bolt,
  Bookmark,
  Heart,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  PlusSquare,
  Search,
  Settings,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setUserProfile } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts } from "@/redux/postSlice";
import { setSelectedUser } from "@/redux/chatSlice";
import SearchDialoge from "./SearchDialoge";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { notifications } = useSelector((state) => state.notification);
  const [notificationCount, setNotificationCount] = useState(null);
  const [unReadCount, setUnReadCount] = useState(null);
  const [openSearch, setOpenSearch] = useState(false);
  const path = useLocation();
  const currentPath = location.pathname.split("/")[1];
  const dispatch = useDispatch();
  const sidebarItems = [
    {
      icon: <Home className="max-lg:w-[30px] max-lg:h-[30px]" />,
      text: "Home",
    },
    {
      icon: <Search className="max-lg:w-[30px] max-lg:h-[30px]" />,
      text: "search",
    },
    {
      icon: <TrendingUp className="max-lg:w-[30px] max-lg:h-[30px]" />,
      text: "explore",
    },
    {
      icon: <MessageCircle className="max-lg:w-[30px] max-lg:h-[30px]" />,
      text: "messages",
    },
    {
      icon: <Heart className="max-lg:w-[30px] max-lg:h-[30px]" />,
      text: "notifications",
    },
    {
      icon: <PlusSquare className="max-lg:w-[30px] max-lg:h-[30px]" />,
      text: "create",
    },
    {
      icon: (
        <Avatar className="max-lg:w-[30px] max-lg:h-[30px] w-6 h-6">
          <AvatarImage className="object-cover" src={user?.profilePic} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "profile",
    },
  ];

  useEffect(() => {
    const unReadCount = notifications?.filter(
      (notification) => !notification?.isRead
    )?.length;
    setUnReadCount(unReadCount);
  }, [user, notifications, dispatch]);

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        "https://instgram-clone-3yhc.onrender.com/api/auth/logout",
        {
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        dispatch(setAuthUser(null));
        dispatch(setPosts([]));
        dispatch(setUserProfile(null));
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const sidebarRouteHandler = (text) => {
    if (text === "Home") {
      navigate("/");
    } else if (text === "search") {
      setOpenSearch(true);
    } else if (text === "explore") {
      navigate("/explore");
    } else if (text === "messages") {
      navigate("/direct");
      // dispatch(setSelectedUser(null));
    } else if (text === "notifications") {
      navigate("/notifications");
    } else if (text === "create") {
      setOpen(true);
    } else if (text === "profile") {
      navigate(`/profile/${user?._id}`);
    }
  };

  return (
    <div>
      <div className="fixed hidden md:block left-0 top-0 z-10 h-screen md:w-[8%] lg:w-[18%]  border-r  border-gray-200  p-2">
        <div className="mt-5">
          <Link to="/">
            <img
              src="/img/logo.png"
              alt="logo"
              className="w-32 hidden lg:block object-contain relative left-2"
            />
          </Link>
          <Link to="/">
            <img
              src="/img/instagram.png"
              alt="logo"
              className="w-20 max-lg:block lg:hidden object-contain relative "
            />
          </Link>
        </div>
        <div className="flex flex-col mt-7 gap-y-2">
          {sidebarItems.map((item) => (
            <div
              key={item.text}
              onClick={() => sidebarRouteHandler(item.text)}
              className={`relative ${
                currentPath === item.text ? "bg-gray-100" : ""
              } capitalize flex items-center gap-x-4 group hover:cursor-pointer hover:bg-gray-100 p-3 rounded-lg`}
            >
              <span className="group-hover:scale-110 ">{item.icon}</span>
              {item.text === "notifications" && unReadCount > 0 ? (
                <span className="bg-red-500 border-2 border-white text-white absolute left-7 top-2 w-5 h-5 flex items-center justify-center rounded-full text-sm">
                  {unReadCount}
                </span>
              ) : null}
              <span className="hidden lg:block">{item.text}</span>
            </div>
          ))}

          {/* Popover for More Button */}
          <Popover>
            <PopoverTrigger asChild>
              <div
                className="flex items-center gap-x-4 group hover:cursor-pointer hover:bg-gray-100 p-3 rounded-lg"
                onClick={() => {}}
              >
                <span className="group-hover:scale-110">
                  <Menu className="max-lg:w-[30px] max-lg:h-[30px]" />
                </span>
                <span className="hidden lg:block">More</span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-3 ml-4">
              <div className="flex flex-col gap-y-2">
                <div className=" group flex items-center gap-x-4 hover:cursor-pointer max-lg:text-xl hover:bg-gray-100 p-3 rounded-lg">
                  <Bolt className="group-hover:scale-110"></Bolt> Settings
                </div>
                <div className=" group flex items-center gap-x-4 hover:cursor-pointer max-lg:text-xl hover:bg-gray-100 p-3 rounded-lg">
                  <Bookmark className="group-hover:scale-110"></Bookmark> Saved
                </div>
                <div
                  onClick={handleLogout}
                  className="group flex items-center gap-x-4 p-3 hover:bg-gray-100 max-lg:text-xl rounded-lg cursor-pointer text-red-500"
                >
                  <LogOut className="group-hover:scale-110"></LogOut> Logout
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* search dialog */}

          <SearchDialoge
            open={openSearch}
            setOpen={setOpenSearch}
          ></SearchDialoge>

          <CreatePost open={open} setOpen={setOpen}></CreatePost>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
