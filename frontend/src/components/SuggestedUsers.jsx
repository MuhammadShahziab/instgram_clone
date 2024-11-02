import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "./ui/button";
import HoverProfile from "./HoverProfile";
import axios from "axios";
import { setAuthUser } from "@/redux/authSlice";
import { toast } from "sonner";

const SuggestedUsers = () => {
  const { suggestedUsers, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleFollowOrUnfollow = async (targetId) => {
    try {
      const res = await axios.post(
        `https://instgram-clone-3yhc.onrender.com/api/user/follow/${targetId}`,
        {},
        { withCredentials: true }
      );
      if (res?.data?.success) {
        toast.success("Followed successfully");
        const updateUser = {
          ...user,
          following: res?.data?.userId,
        };

        dispatch(setAuthUser(updateUser));
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to follow or unfollow user"
      );
    }
  };

  return (
    <div className="my-10">
      <div className="flex items-center justify-between">
        <h1 className="text-sm text-gray-400 font-medium">Suggested Users</h1>
        <span className="text-[13px] font-semibold cursor-pointer">
          See All
        </span>
      </div>
      <div className="mt-7 flex flex-col gap-y-2">
        {suggestedUsers?.map((userr) => (
          <div className="flex justify-between items-center" key={userr?._id}>
            <HoverCard className="min-w-[600px]">
              <HoverCardTrigger>
                <div className="flex items-center gap-x-2">
                  <div className="w-11 h-11 aspect-square rounded-full instagram-gradient p-0.5">
                    {userr?.profilePic ? (
                      <Link to={`/profile/${userr?._id}`}>
                        <img
                          src={userr?.profilePic}
                          alt="profile_pic"
                          className="w-full h-full rounded-full object-cover bg-white p-0.5"
                        />
                      </Link>
                    ) : (
                      <Link to={`/profile/${userr?._id}`}>
                        <img
                          src="/img/noavatar.jpg"
                          alt="profile"
                          className="w-full h-full rounded-full object-cover bg-white p-0.5"
                        />
                      </Link>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium   cursor-pointer p-0 m-0">
                      {userr?.username}
                    </span>
                    <span className="text-sm text-gray-600 ">
                      {userr?.fullName}
                    </span>
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="min-w-[350px]   p-0 pb-4">
                <HoverProfile user={userr}></HoverProfile>
              </HoverCardContent>
            </HoverCard>
            {user?.following.includes(userr?._id) ? (
              <div
                className="text-sm text-[#0095f6] font-medium cursor-pointer"
                onClick={() => handleFollowOrUnfollow(userr?._id)}
              >
                Following
              </div>
            ) : (
              <div
                className="text-sm text-[#0095f6] font-medium cursor-pointer"
                onClick={() => handleFollowOrUnfollow(userr?._id)}
              >
                Follow
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
