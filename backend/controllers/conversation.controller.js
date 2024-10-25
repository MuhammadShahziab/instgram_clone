import Conversation from "../models/conversation.model.js";

export const createConversation = async (req, res) => {
  const { recipientId } = req.body; //recipientId is the id of the user you want to send the message to
  try {
    let conversation = await Conversation.findOne({
      participants: {
        $all: [req.userId, recipientId],
      },
    });
    if (!conversation) {
      conversation = new Conversation({
        participants: [req.userId, recipientId],
        unreadCount: 0,
      });
      await conversation.save();
    }
    return res.status(200).json({ success: true, conversation });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.userId,
    })
      .populate({
        path: "participants",
        select: "_id username profilePic fullName",
      })
      .populate({
        path: "lastMessage",
      });
    return res.status(200).json({ success: true, conversations });
  } catch (error) {
    console.log(error);
  }
};
export const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId).populate({
      path: "participants",
      select: "_id username profilePic fullName",
    });

    return res.status(200).json({ success: true, conversation });
  } catch (error) {
    console.log(error);
  }
};
