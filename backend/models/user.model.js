import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    dob: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    hobbies: {
      type: [String],
      default: [],
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // only for private accounts
    isPrivate: {
      type: Boolean,
      default: false, // false means public, true means private account
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

    storyHighlights: [{ title: String, stories: [String] }],

    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
