import User from "../models/user.model.js";
import { io } from "../socket/socket.js";
import { getReceverSocketId } from "../socket/socket.js";
import Notification from "../models/notification.model.js";
export const suggestedUsers = async (req, res) => {
  try {
    // Login user ko dhoondhna taake uski following list mile
    const loggedInUser = await User.findById(req.userId).select("following");

    if (!loggedInUser) {
      return res.status(404).json({
        success: false,
        message: "Logged-in user not found",
      });
    }
    // $nin means "not in."
    // loggedInUser.following is assumed to be an array of user IDs representing the people the logged-in user is already following.

    //     $ne means "not equal."
    // This part of the query excludes the currently logged-in user (req.userId) from the results.

    const suggestedUsers = await User.find({
      _id: { $ne: req.userId, $nin: loggedInUser.following },
    })
      .limit(5)
      .select("-password")
      .populate({
        path: "posts",
        populate: {
          path: "author",
          select: "-password",
        },
      });

    if (!suggestedUsers.length) {
      return res.status(404).json({
        success: false,
        message: "Users not found",
      });
    }

    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const followUser = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const targetUserId = req.params.userId;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if already folowing

    if (targetUser.followers.includes(currentUserId)) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    if (targetUser.isPrivate) {
      // For a private accounts,send a follow request
      if (!targetUser.followRequests.includes(currentUserId)) {
        targetUser.followRequests.push(currentUserId);
        await targetUser.save();

        const followRequestNotification = new Notification({
          userId: targetUserId,
          senderId: currentUserId,
          type: "follow_request",
          message: `Send a request`,
          senderProfilePic: currentUser.profilePic,
          senderUsername: currentUser.username,
        });
        await followRequestNotification.save();

        // implementing Real-time notification for follow request

        const targetUserSocketId = getReceverSocketId(targetUserId);
        if (targetUserSocketId) {
          io.to(targetUserSocketId).emit(
            "newNotification",
            followRequestNotification
          );

          io.to(targetUserSocketId).emit("followRequestSent", currentUser);
        }

        res.status(200).json({
          success: true,
          userId: targetUserId,
          message: "Follow request sent",
        });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Follow request already sent !" });
      }
    } else {
      targetUser.followers.push(currentUserId);
      currentUser.following.push(targetUserId);

      // Save both users simultaneously
      await Promise.all([targetUser.save(), currentUser.save()]);
      // Emit follow event to the target user

      const newFollowerNotification = new Notification({
        userId: targetUserId,
        senderId: currentUserId,
        type: "follow",
        isRead: false,
        message: `${currentUser.username} followed you`,
        senderProfilePic: currentUser.profilePic,
        senderUsername: currentUser.username,
      });
      await newFollowerNotification.save();
      const targetUserSocketId = getReceverSocketId(targetUserId);

      if (targetUserSocketId) {
        io.to(targetUserSocketId).emit("userFollowed", targetUser);
        io.to(targetUserSocketId).emit(
          "newNotification",
          newFollowerNotification
        );
      }

      return res.status(201).json({
        message: "Follow Successfully",
        success: true,
        userId: targetUserId,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const unFollowUser = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const targetUserId = req.params.userId;

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);
    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!targetUser.followers.includes(currentUserId)) {
      return res
        .status(400)
        .json({ message: "You are not following this user" });
    }

    targetUser.followers.pull(currentUserId);
    currentUser.following.pull(targetUserId);

    Promise.all([targetUser.save(), currentUser.save()]);

    // Emit unfollow event to the target user
    const targetUserSocketId = getReceverSocketId(targetUserId);
    if (targetUserSocketId) {
      io.to(targetUserSocketId).emit("userUnfollowed", currentUserId);
    }

    return res.status(201).json({
      message: "UnFollow Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const acceptFollowRequest = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const requesterUserId = req.params.userId;
    const { notificationId } = req.body;
    const currentUser = await User.findById(currentUserId);
    const requesterUser = await User.findById(requesterUserId);

    if (!currentUser || !requesterUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.followRequests.includes(requesterUserId)) {
      return res.status(400).json({ message: "Request not found" });
    }

    currentUser.followers.push(requesterUserId);
    requesterUser.following.push(currentUserId);

    currentUser.followRequests = currentUser.followRequests.filter(
      (id) => id.toString() != requesterUserId.toString()
    );
    await currentUser.save();
    await requesterUser.save();

    if (notificationId) {
      await Notification.findByIdAndDelete(notificationId);
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Notification ID is required" });
    }

    // Send notification to the requester
    const notification = new Notification({
      userId: requesterUserId,
      senderId: currentUserId,
      type: "follow_accept",
      isRead: false,
      message: `Accepted your follow request.`,
      senderProfilePic: currentUser.profilePic,
      senderUsername: currentUser.username,
    });
    await notification.save();

    const requesterSocketId = getReceverSocketId(requesterUserId);
    if (requesterSocketId) {
      io.to(requesterSocketId).emit("newNotification", notification);
      io.to(requesterSocketId).emit("userFollowed", requesterUser);
    }

    return res
      .status(200)
      .json({ success: true, message: "Follow Request Accepted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const declineFollowRequest = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const requesterUserId = req.params.userId;
    const { notificationId } = req.body;
    const currentUser = await User.findById(currentUserId);
    const requesterUser = await User.findById(requesterUserId);
    if (!currentUser || !requesterUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!currentUser.followRequests.includes(requesterUserId)) {
      return res
        .status(400)
        .json({ success: false, message: "Request not found" });
    }
    currentUser.followRequests = currentUser.followRequests.filter(
      (id) => id.toString() != requesterUserId.toString()
    );
    await currentUser.save();

    if (notificationId) {
      await Notification.findByIdAndDelete(notificationId);
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Notification ID is required!" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Follow request Rejected" });
  } catch (error) {
    console.log(error);
  }
};

export const search = async (req, res) => {
  const { search } = req.query;

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
      ],
    }).limit(5);
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
  }
};
