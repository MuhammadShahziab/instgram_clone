import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { io } from "../socket/socket.js";
import { getReceverSocketId } from "../socket/socket.js";
import Notification from "../models/notification.model.js";
export const createPost = async (req, res) => {
  try {
    const { caption, images } = req.body;
    if (!images) {
      return res.status(400).json({ message: "image is required" });
    }

    const newPost = await Post.create({
      caption,
      images,
      author: req.userId,
    });

    const user = await User.findById(req.userId).populate("followers");
    if (user) {
      user.posts.push(newPost._id);
      await user.save();
    }

    await newPost.populate({ path: "author", select: "-password" });

    if (user && user.followers.length > 0) {
      const notifications = user.followers.map((follower) => ({
        userId: follower._id,
        senderId: req.userId,
        type: "post",
        message: `${user.username} has posted a new post.`,
        postImage: newPost.images[0],
        senderProfilePic: user.profilePic,
        senderUsername: user.username,
      }));

      await Notification.insertMany(notifications);

      user.followers.forEach((follower) => {
        const recevierSocketId = getReceverSocketId(follower._id);
        if (recevierSocketId) {
          io.to(recevierSocketId).emit("newNotification", {
            message: `${user.username} has posted a new post.`,
            postImage: newPost.images[0],
            isRead: false,
            senderId: req.userId,
            userId: follower._id,
            type: "post",
            senderProfilePic: user.profilePic,
            senderUsername: user.username,
          });
        }
      });
    }

    return res.status(201).json({
      message: "Post Created!",
      success: true,
      post: newPost,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "-password",
        populate: {
          path: "posts",
        },
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "fullName profilePic username ",
        },
      })
      .populate({ path: "likes", select: "fullName  profilePic username " });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "fullName  profilePic username ",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "fullName  profilePic username ",
        },
      });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const cuurentUser = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    const user = await User.findById(cuurentUser);

    await post.updateOne({ $addToSet: { likes: cuurentUser } });
    await post.save();

    if (post && post.author.toString() !== cuurentUser) {
      const newNotification = new Notification({
        userId: post.author.toString(),
        senderId: cuurentUser,
        type: "like",
        postImage: post.images[0],
        message: "Liked your post.",
        senderProfilePic: user.profilePic,
        senderUsername: user.username,
      });
      await newNotification.save();

      const recevierSocketId = getReceverSocketId(post.author);
      if (recevierSocketId) {
        io.to(recevierSocketId).emit("newNotification", {
          message: `Liked your post.`,
          postImage: post.images[0],
          isRead: false,
          senderId: cuurentUser,
          userId: post.author.toString(),
          type: "like",
          senderProfilePic: user.profilePic,
          senderUsername: user.username,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Post liked successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const disLikePost = async (req, res) => {
  try {
    const cuurentUser = req.userId;
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    await post.updateOne({ $pull: { likes: cuurentUser } });
    await post.save();
    return res.status(200).json({
      success: true,
      message: "Post Disliked successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
export const addComment = async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;
  const currentUser = req?.userId; // Corrected spelling here
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!text) {
      return res.status(400).json({ message: "text is required" });
    }

    const newcomment = await Comment.create({
      text,
      author: currentUser,
      postId,
    });
    post.comments.push(newcomment._id);
    await post.save();

    const populatedComment = await Comment.findById(newcomment._id).populate({
      path: "author",
      select: "username fullName profilePic",
    });

    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getCommentsParticularPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).populate({
      path: "author",
      select: "username  fullName profilePic",
    });

    if (!comments) {
      return res.status(404).json({
        success: false,
        message: "Comments not found",
      });
    }

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const currentUser = req.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.author.toString() !== currentUser.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Post.findByIdAndDelete(postId);

    let user = await User.findById(currentUser);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    await Comment.deleteMany({ post: postId });
    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const currentUser = req.userId;

    const user = await User.findById(currentUser);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.bookmarks.includes(postId)) {
      await user.updateOne({ $pull: { bookmarks: postId } });
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Post Unbookmarked successfully",
      });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: postId } });
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Post Bookmarked successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
export const createStoryHighlight = async (req, res) => {
  const { title, stories } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const createHighLight = {
      title,
      stories,
    };

    user.storyHighlights.push(createHighLight);

    await user.save();
    res.status(201).json({
      success: true,
      message: "Story created Successfully",
      storyHighlights: user.storyHighlights,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create story highlight" });
  }
};

export const updateStoryHighLight = async (req, res) => {
  const { title, stories } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const highLight = user.storyHighlights.find(
      (highLight) => highLight._id.toString() === id
    );

    if (!highLight) {
      return res
        .status(404)
        .json({ success: false, message: "Story highlight not found" });
    }

    if (title) {
      highLight.title = title;
    }

    if (stories && stories.length > 0) {
      highLight.stories = images;
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: "Updated !",
      storyHighlights: user.storyHighlights,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update story highlight" });
  }
};
