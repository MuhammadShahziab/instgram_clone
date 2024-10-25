import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom"; // Import useParams
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Messages from "@/components/Messages";
import axios from "axios";
import { setMessages, setSelectedUser } from "@/redux/chatSlice";

const Chats = () => {
  const dispatch = useDispatch();
  const { selectedUser, messages, onlineUsers } = useSelector(
    (store) => store.chat
  );
  const { user } = useSelector((store) => store.auth);
  const { id: conversationId } = useParams(); // Get conversationId from URL parameters
  const [message, setMessage] = useState("");
  const handleSendMessage = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/message/create",
        {
          conversationId,
          text: message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        dispatch(setMessages([...messages, res?.data?.newMessage]));
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/conversation/${conversationId}`,
          {
            withCredentials: true,
          }
        );

        const otherProfile = res?.data?.conversation?.participants?.find(
          (participant) => participant?._id !== user?._id
        );
        console.log(otherProfile, "other profile");
        if (res?.data?.success) {
          dispatch(setSelectedUser(otherProfile));
        }
      } catch (error) {
        console.log(error);
      }
    };

    getConversation();
  }, [conversationId, dispatch, user?._id]);

  return (
    <div className="h-screen flex ">
      <section className="flex flex-col h-full w-full  flex-1">
        {/* Selected User Info */}
        <div className="flex items-center gap-x-2 border-b border-gray-200 p-3">
          <Link to={`/profile/${selectedUser?._id}`}>
            <div className="w-11 h-11 rounded-full instagram-gradient p-0.5">
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
          </Link>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold">
              {selectedUser?.username}
            </span>
            <span className="text-sm text-gray-400">
              {onlineUsers.includes(selectedUser?._id)
                ? "Active now"
                : "Offline"}
            </span>
          </div>
        </div>

        {/* Messages Section */}
        <Messages selectedUser={selectedUser}></Messages>

        {/* Input Field */}
        <div className="flex items-center gap-x-2 p-4 border-t border-gray-200">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..."
            className="focus-visible:ring-transparent h-11 rounded-lg"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-[#0095f6] hover:bg-[#0094f6e8] text-white"
          >
            Send
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Chats;
