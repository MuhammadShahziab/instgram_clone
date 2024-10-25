import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Post from "../models/post.model.js";

export const register = async (req, res) => {
  try {
    const { email, username, password, fullName } = req.body;

    if (!email || !username || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      username,
      fullName,
      password: hashedPassword,
    });
    return res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = await jwt.sign(
      { userId: user?._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    const populatePosts = await Promise.all(
      user.posts.map(async (id) => {
        const post = await Post.findById(id);
        if (post?.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatePosts,
      isVerified: user.isVerified,
      bookmarks: user.bookmarks,
      isPrivate: user.isPrivate,
      hobbies: user.hobbies,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: `Wellcome ${user.username}`,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("accesstoken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};
