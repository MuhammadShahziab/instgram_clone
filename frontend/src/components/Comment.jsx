import { MoreHorizontal } from "lucide-react";
import moment from "moment";
import React from "react";
import { FaRegHeart } from "react-icons/fa";

const Comment = ({ comment }) => {
  return (
    <div className="flex gap-x-2 items-center ">
      <div className="w-11 h-11 rounded-full aspect-square  instagram-gradient p-0.5">
        {comment?.author?.profilePic ? (
          <img
            src={comment?.author?.profilePic}
            alt="Profile"
            className="roundful w-full h-full rounded-full bg-white p-0.5 object-cover"
          />
        ) : (
          <img
            src="/img/noavatar.jpg"
            alt="avatar"
            className="roundful w-full h-full rounded-full bg-white p-0.5 object-cover"
          />
        )}
      </div>
      <div className="flex flex-col gap-1  w-full">
        <div>
          <p className="text-[14px]">
            <span className="font-semibold text-sm text-nowrap ">
              {comment?.author?.username}
            </span>{" "}
            {comment?.text}
          </p>
        </div>
        <div className="flex items-center justify-between w-[80%] lg:max-w-[55%]  ">
          <span className="text-xs text-gray-600">
            {moment(comment?.createdAt).fromNow()}
          </span>{" "}
          {/* <span className="text-xs text-gray-600 font-bold">2 Likes</span> */}
          <span className="text-sm cursor-pointer">Reply</span>
          <MoreHorizontal
            size={18}
            className="text-gray-600 cursor-pointer "
          ></MoreHorizontal>
        </div>
      </div>
      <div className="pt-1 cursor-pointer">
        <FaRegHeart size={12}></FaRegHeart>
      </div>
    </div>
  );
};

export default Comment;
