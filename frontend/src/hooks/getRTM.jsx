import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const getRTM = () => {
  const { socket, messages } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!socket) return;
    socket?.on("newMessage", (newMessage) => {
      dispatch(setMessages([...messages, newMessage]));
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [messages, socket, setMessages]);
};

export default getRTM;
