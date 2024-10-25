import React from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

const HoverProfile = ({ user }) => {
  console.log(user, "check user");
  return (
    <div className="flex flex-col ">
      <div className="flex gap-x-3 items-center p-4 ">
        <div className="w-11 h-11 rounded-full">
          <img
            src={user?.profilePic || "/img/noavatar.jpg"}
            alt="IMAGE"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col ">
          <span className="text-[19px] font-semibold">{user?.username}</span>
          <span className="text-sm text-gray-500">{user?.fullName}</span>
        </div>
      </div>
      <div className="flex items-center px-4 mb-4 justify-around">
        <div className="flex flex-col items-center">
          <p className="font-bold">{user?.posts?.length}</p>
          <p className="text-sm">posts</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="font-bold">{user?.followers?.length}</p>
          <p className="text-sm">followers</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="font-bold">{user?.following?.length}</p>
          <p className="text-sm">following</p>
        </div>
      </div>

      {user?.posts?.length > 0 ? (
        <div className="grid grid-cols-3 gap-1">
          {user?.posts?.slice(0, 3).map((post) => (
            <div className="w-full h-full" key={post?._id}>
              <img
                src={post?.images}
                alt="postImage"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 py-8 flex justify-center items-center">
          <img
            src="/img/nopost.jpg"
            className="w-32 object-contain h-24"
            alt="No_Posts"
          />
        </div>
      )}

      <div className="px-4 mt-4">
        <Button className="w-full  flex items-center gap-x-1 bg-[#0095f6] hover:bg-[#358cc5]  text-white">
          Follow <Plus size={18}></Plus>
        </Button>
      </div>
    </div>
  );
};

export default HoverProfile;
