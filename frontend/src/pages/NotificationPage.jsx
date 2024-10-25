import { Button } from "@/components/ui/button";
import { markAsRead, setNotifications } from "@/redux/notification.slice";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import moment from "moment";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { addFollowing } from "@/redux/authSlice";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const { notifications } = useSelector((state) => state.notification);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = React.useState(false);
  const allRequestsNotifications = notifications?.filter(
    (notification) => notification.type === "follow_request"
  );

  const handleRemoveRequest = async (notificationn) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/user/declineRequest/${notificationn.senderId}`,
        {
          notificationId: notificationn._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        const updatedNotifications = notifications.filter(
          (notification) => notification._id !== notificationn._id
        );
        dispatch(setNotifications(updatedNotifications));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const accpetFollowRequest = async (notification) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:8000/api/user/acceptRequest/${notification.senderId}`,
        { notificationId: notification._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        dispatch(addFollowing(notification.senderId));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRead = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/notification/read/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        dispatch(markAsRead(id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/notification/all/${user?._id}`,
          {
            withCredentials: true,
          }
        );
        dispatch(setNotifications(res.data.notifications));
      } catch (error) {
        console.log(error);
      }
    };
    getNotifications();
  }, [dispatch, user?._id]);

  return (
    <div className="flex">
      <div className="h-screen pt-8 w-full md:border-r md:w-[45%] lg:w-[35%] ">
        <h1 className="text-lg md:text-2xl px-6 max-md:mt-10 font-bold">
          Notifications
        </h1>
        <div
          onClick={() => setOpen(true)}
          className="flex items-center justify-between gap-x-4 cursor-pointer px-6 py-2 hover:bg-gray-100 mt-4"
        >
          <div className="flex items-center gap-x-4">
            <div className="w-14 h-14 rounded-full relative  flex justify-start items-center">
              <img
                src={
                  allRequestsNotifications[0]?.senderProfilePic ||
                  "/img/noavatar.jpg"
                }
                className="w-8 h-8 absolute rounded-full object-cover"
                alt="noavartar"
              />
              <img
                src={
                  allRequestsNotifications[1]?.senderProfilePic ||
                  "/img/noavatar.jpg"
                }
                className="w-8 h-8 absolute top-5 left-4 rounded-full object-cover"
                alt="noavartar"
              />
            </div>
            <div>
              <p className="text-sm font-bold">Follow requests</p>
              <p className="text-sm text-gray-500">ramshakhan + 1 other</p>
            </div>
          </div>

          <div className="flex items-center gap-x-3">
            {allRequestsNotifications?.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#1877F2]"></span>
            )}

            <span className="bg-red-500 text-white w-6 h-6 text-sm rounded-full flex items-center justify-center">
              {allRequestsNotifications?.length}
            </span>
            <ChevronRight></ChevronRight>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="px-0 min-h-[300px] max-h-[500px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="px-6 mb-5 flex items-center  gap-x-4">
                Follow requests{" "}
                <span className="bg-red-500 text-white w-6 h-6 text-sm rounded-full flex items-center justify-center">
                  {allRequestsNotifications?.length}
                </span>
              </DialogTitle>
              {allRequestsNotifications?.length > 0 ? (
                allRequestsNotifications?.map((notification) => (
                  <div
                    key={notification._id}
                    className="flex relative items-center cursor-pointer justify-between px-6 py-2 "
                  >
                    <div className="flex items-center gap-x-4">
                      <div className="w-11 h-11 rounded-full">
                        <img
                          src={
                            notification?.senderProfilePic ||
                            "/img/noavatar.jpg"
                          }
                          className="w-full h-full object-cover rounded-full"
                          alt="profile_pic"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold">
                          {notification?.senderUsername}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-x-3">
                          {notification?.message}{" "}
                          <span className="text-xs">
                            {moment(notification?.createdAt).fromNow()}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-x-2 mr-2">
                      {user?.followers.includes(notification?.senderId) ? (
                        <Button variant="secondary" className="h-9 ">
                          Friend
                        </Button>
                      ) : (
                        <>
                          <Button
                            disabled={loading}
                            onClick={() => accpetFollowRequest(notification)}
                            className="bg-[#1877F2] hover:bg-[#1877F2e8] h-9 flex items-center gap-x-2"
                          >
                            Confirm{" "}
                            {loading && <ClipLoader color="white" size={16} />}
                          </Button>
                          <Button
                            onClick={() => handleRemoveRequest(notification)}
                            variant="secondary"
                            className="h-9 "
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center">
                  <img
                    src="/img/empty.jpg"
                    className="object-contain w-[70%]"
                  ></img>
                </div>
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <hr />

        <div className="h-[73vh]  overflow-y-auto ">
          {notifications?.length > 0 ? (
            notifications
              ?.filter(
                (notification) => notification.type !== "follow_request" // Filter out follow_request type
              )
              ?.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleRead(notification._id)}
                  className={` ${
                    notification?.isRead ? "" : "bg-gray-100"
                  } flex relative items-center cursor-pointer justify-between px-6 py-2 hover:bg-gray-100`}
                >
                  <div className="flex items-center gap-x-4">
                    <div className="w-11 h-11 rounded-full">
                      <img
                        src={
                          notification?.senderProfilePic || "/img/noavatar.jpg"
                        }
                        className="w-full h-full object-cover bg-no-repeat rounded-full"
                        alt="profile_pic"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold">
                        {notification?.senderUsername}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-x-2">
                        {notification?.message}{" "}
                        <span className="text-xs text-gray-600 ">
                          {moment(notification?.createdAt).fromNow()}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Show the post image only for like, comment, or post types */}
                  {notification?.type === "like" ||
                  notification?.type === "comment" ||
                  notification?.type === "post" ? (
                    <div className="w-9 h-9 mr-2 rounded-full">
                      <img
                        className="w-full h-full object-cover rounded-full"
                        src={notification?.postImage}
                        alt="img"
                      />
                    </div>
                  ) : null}

                  <div className="absolute right-3 top-6">
                    {!notification?.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#1877F2] absolute top-1 right-0"></span>
                    )}
                  </div>
                </div>
              ))
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="flex-1 max-md:hidden flex items-center justify-center">
        <img
          src="/img/notification.gif"
          className=" md:w-[80%] lg:w-[60%]"
          alt="gif"
        />
      </div>
    </div>
  );
};

export default NotificationPage;
