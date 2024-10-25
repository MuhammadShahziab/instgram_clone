import React from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import getAllMessages from "@/hooks/getAllMessages";
import { useSelector } from "react-redux";
import getRTM from "@/hooks/getRTM";

const Messages = ({ selectedUser }) => {
  const { id } = useParams();
  getAllMessages(id);
  getRTM();
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="flex flex-col items-center mt-3">
        <div className="w-20 h-20 rounded-full instagram-gradient p-0.5">
          {selectedUser?.profilePic ? (
            <img
              src={selectedUser?.profilePic}
              alt="profile_pic"
              className="w-full h-full rounded-full object-cover bg-white p-0.5"
            />
          ) : (
            <img
              src="/img/noavatar.jpg"
              alt="profile"
              className="w-full h-full rounded-full object-cover bg-white p-0.5"
            />
          )}
        </div>
        <span className="text-xl mt-3 font-semibold">
          {selectedUser?.fullName}
        </span>
        <p className="flex gap-x-2 text-gray-500 text-sm">
          {selectedUser?.username} <span>Instagram</span>
        </p>
        <Link to={`/profile/${selectedUser?._id}`}>
          <Button variant="secondary" className="mt-3">
            View Profile
          </Button>
        </Link>
      </div>
      <div>
        {messages?.map((msg) => (
          <div
            key={msg?._id}
            className={`flex ${
              msg?.senderId._id === user?._id ? "justify-end " : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-xl max-w-xs break-words my-1 ${
                msg?.senderId._id === user?._id
                  ? "bg-[#0095f6] text-white "
                  : "bg-gray-200"
              }  `}
            >
              {msg?.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
