import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSideBar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="my-10 pr-16 ">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <div className="w-11 h-11 rounded-full instagram-gradient p-0.5">
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
            <span className="text-sm font-bold p-0 m-0">{user?.username}</span>
            <span className="text-sm text-gray-600 ">{user?.fullName}</span>
          </div>
        </div>

        <span className="text-sm text-[#0095f6] font-medium cursor-pointer">
          Swtich
        </span>
      </div>

      <SuggestedUsers></SuggestedUsers>
    </div>
  );
};

export default RightSideBar;
