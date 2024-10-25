import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { io } from "../socket/socket.js";

import { getReceverSocketId } from "../socket/socket.js";
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    const newMessage = new Message({
      conversationId,
      text,
      senderId: req.userId,
    });

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found" });
    }

    const recevierId = conversation.participants.find(
      (id) => id.toString() !== req.userId
    );

    await newMessage.save();
    const populatedMessage = await Message.findById(newMessage._id).populate({
      path: "senderId",
      select: "fullName profilePic username",
    });
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMessage._id,
      updatedAt: Date.now(),
    });

    // Implement the socket io for the real time messages

    const recevierSocketId = getReceverSocketId(recevierId.toString());

    if (recevierSocketId) {
      io.to(recevierSocketId).emit("newMessage", populatedMessage);
    }

    return res
      .status(200)
      .json({ success: true, newMessage: populatedMessage });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({
      conversationId,
    })
      .sort({ createdAt: 1 })
      .populate({
        path: "senderId",
        select: "fullName profilePic username",
      });
    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
