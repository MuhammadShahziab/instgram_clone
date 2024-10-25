import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const getAllMessages = (conversationId) => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.chat);
  useEffect(() => {
    const fetchMessages = async () => {
      if (conversationId) {
        try {
          const res = await axios.get(
            `http://localhost:8000/api/message/all/${conversationId}`,
            { withCredentials: true }
          );
          console.log(res, "fetch messages conversation id ");
          if (res?.data?.success) {
            dispatch(setMessages(res.data.messages));
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };
    fetchMessages();
  }, [selectedUser]);
};

export default getAllMessages;
