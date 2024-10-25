import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "like",
      "comment",
      "follow",
      "post",
      "follow_request",
      "follow_accept",
    ],
    required: true,
  },
  postImage: {
    type: String,
    default: "",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: true,
  },
  senderProfilePic: {
    type: String,
    default: "",
  },
  senderUsername: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
