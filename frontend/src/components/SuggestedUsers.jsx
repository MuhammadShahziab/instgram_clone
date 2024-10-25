import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "./ui/button";
import HoverProfile from "./HoverProfile";

const SuggestedUsers = () => {
  const { suggestedUsers, user } = useSelector((state) => state.auth);
  console.log(suggestedUsers, "check suggested users ");
  return (
    <div className="my-10">
      <div className="flex items-center justify-between">
        <h1 className="text-sm text-gray-400 font-medium">Suggested Users</h1>
        <span className="text-[13px] font-semibold cursor-pointer">
          See All
        </span>
      </div>
      <div className="mt-7 flex flex-col gap-y-2">
        {suggestedUsers?.map((user) => (
          <div className="flex justify-between items-center" key={user?._id}>
            <HoverCard className="min-w-[600px]">
              <HoverCardTrigger>
                <div className="flex items-center gap-x-2">
                  <div className="w-11 h-11 aspect-square rounded-full instagram-gradient p-0.5">
                    {user?.profilePic ? (
                      <Link to={`/profile/${user?._id}`}>
                        <img
                          src={user?.profilePic}
                          alt="profile_pic"
                          className="w-full h-full rounded-full object-cover bg-white p-0.5"
                        />
                      </Link>
                    ) : (
                      <Link to={`/profile/${user?._id}`}>
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
                      {user?.username}
                    </span>
                    <span className="text-sm text-gray-600 ">
                      {user?.fullName}
                    </span>
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="min-w-[350px]   p-0 pb-4">
                <HoverProfile user={user}></HoverProfile>
              </HoverCardContent>
            </HoverCard>

            <span className="text-sm text-[#0095f6] font-medium cursor-pointer">
              Follow
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
