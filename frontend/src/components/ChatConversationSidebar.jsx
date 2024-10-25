import { setSelectedUser } from "@/redux/chatSlice";
import axios from "axios";
import { Edit } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const ChatConversationSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  const { onlineUsers } = useSelector((store) => store.chat);
  const [conversations, setConversations] = useState([]);
  const dispatch = useDispatch();
  const { id } = useParams();

  const getConversations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/conversation/all",
        {
          withCredentials: true,
        }
      );
      console.log(res, "check conversation res ");
      if (res?.data?.success) {
        setConversations(res?.data?.conversations);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setUserProfileHandle = (user) => {
    console.log(user, "check user profile");
    dispatch(setSelectedUser(user));
  };

  useEffect(() => {
    getConversations();
  }, []);

  return (
    <section
      className={`w-full ${
        id ? "max-md:hidden" : ""
      } flex flex-col gap-y-6 md:max-w-[25%] py-9 border-r  border-x-gray-200`}
    >
      <div className="flex px-4 items-center justify-between">
        <h1 className="text-xl font-bold">{user?.username}</h1>
        <Edit size={23} className="cursor-pointer"></Edit>
      </div>
      <div>
        <div className="flex max-md:hidden px-4 items-center justify-between">
          <h1 className="text-lg font-bold">Messages</h1>
          <h1 className="text-gray-400 cursor-pointer">Requests</h1>
        </div>
        <div className="overflow-y-auto h-[77vh] lg:mt-5">
          {conversations?.map((conversation) => {
            const otherUserProfile = conversation?.participants.find(
              (participant) => participant._id !== user?._id
            );
            return (
              <Link to={`/direct/${conversation?._id}`}>
                <div
                  key={conversation._id}
                  onClick={() => setUserProfileHandle(otherUserProfile)}
                  className={`flex items-center gap-x-2 px-4 py-2  cursor-pointer ${
                    conversation?._id === id && "bg-gray-100"
                  } hover:bg-gray-100`}
                >
                  <div className="w-[52px] h-[52px] rounded-full instagram-gradient p-0.5 relative">
                    {otherUserProfile?.profilePic ? (
                      <img
                        src={otherUserProfile.profilePic}
                        alt="profile_pic"
                        className="w-full h-full rounded-full aspect-square object-cover bg-white p-0.5"
                      />
                    ) : (
                      <img
                        src="/img/noavatar.jpg"
                        alt="profile"
                        className="w-full h-full rounded-full object-cover bg-white p-0.5"
                      />
                    )}
                    {onlineUsers.includes(otherUserProfile?._id) && (
                      <span className="w-2 h-2 rounded-full l border-2 border-white bg-green-400 absolute bottom-1 right-1"></span>
                    )}
                  </div>
                  <div className="flex flex-col  flex-1 ">
                    <span className="p-0 m-0">
                      {otherUserProfile?.username}
                    </span>

                    <div className="flex items-center justify-between  w-full">
                      {conversation?.lastMessage && (
                        <span className="text-xs ">
                          {conversation?.lastMessage?.text.slice(0, 10)}...
                        </span>
                      )}

                      <span
                        className={`text-xs text-gray-600 ${
                          onlineUsers.includes(otherUserProfile?._id)
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {onlineUsers.includes(otherUserProfile?._id)
                          ? "Active now"
                          : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ChatConversationSidebar;
