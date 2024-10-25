import React from "react";
import { Outlet, useParams } from "react-router-dom";
import ChatConversationSidebar from "./ChatConversationSidebar";

const ChatLayout = () => {
  const { id } = useParams();
  return (
    <div className="h-screen flex ">
      <ChatConversationSidebar></ChatConversationSidebar>
      <section className="flex flex-col h-full w-full flex-1">
        {id ? (
          <Outlet />
        ) : (
          // Default message to show when no chat is selected
          <div className="h-full md:flex justify-center items-center hidden">
            <div className="flex items-center flex-col gap-y-2">
              <img
                src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTjfOfHm528KFEJ-krCI0PbfcagfgRlEt1l_knciLc5xeMXJcWZ"
                alt="message"
                className="w-[100px] h-[100px] object-cover"
              />
              <p>Your messages</p>
              <p className="text-sm text-gray-500">
                Send a message to start a chat.
              </p>
              <button className="bg-[#0095f6] hover:bg-[#0094f6e8] text-white px-4 py-2 rounded">
                Send a message
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ChatLayout;
