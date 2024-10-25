import Notification from "../models/notification.model.js";
import Message from "../models/message.model.js";
import { io } from "../socket/socket.js";
import { getReceverSocketId } from "../socket/socket.js";
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    if (notifications.length === 0) {
      return res.status(200).json({ success: true, notifications: [] });
    }

    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const readNotification = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const notification = await Notification.findById(notificationId).populate({
      path: "userId",
    });
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }
    if (notification.isRead === false) {
      notification.isRead = true;
      await notification.save();
      const targetUser = notification.userId._id;
      const targetUserSocketId = getReceverSocketId(targetUser);
      if (targetUserSocketId) {
        io.to(targetUserSocketId).emit("notificationRead", notificationId);
      }

      return res.status(200).json({ success: true, notification });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating notification", error });
    console.log(error);
  }
};
