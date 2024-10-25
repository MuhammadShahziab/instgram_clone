import User from "../models/user.model.js";

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "followRequests followers following",
        select: "_id username profilePic fullName",
      })
      .populate({
        path: "posts",

        populate: [
          {
            path: "author",
            select: " username profilePic fullName",
            model: "User",
          },
          {
            path: "comments",
            populate: {
              path: "author",
              select: " username profilePic fullName",
            },
          },
          {
            path: "likes",
            select: " username _id",
          },
        ],
      })
      .populate({
        path: "bookmarks",
        populate: [
          {
            path: "author",
            select: " username profilePic fullName",
            model: "User",
          },
          {
            path: "comments",
            populate: {
              path: "author",
              select: " username profilePic fullName",
            },
          },
          {
            path: "likes",
            select: " username _id",
          },
        ],
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const body = await req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: body,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
