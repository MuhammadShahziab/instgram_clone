import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  addComment,
  bookmarkPost,
  createPost,
  createStoryHighlight,
  deletePost,
  disLikePost,
  getCommentsParticularPost,
  getPosts,
  getUserPosts,
  likePost,
  updateStoryHighLight,
} from "../controllers/post.controller.js";
const router = express.Router();

router.route("/create").post(isAuthenticated, createPost);
router.route("/all").get(isAuthenticated, getPosts);
router.route("/userposts/:userId").get(isAuthenticated, getUserPosts);
router.route("/like/:postId").post(isAuthenticated, likePost);
router.route("/dislike/:postId").post(isAuthenticated, disLikePost);
router.route("/comment/:postId").post(isAuthenticated, addComment);
router
  .route("/comment/:postId")
  .get(isAuthenticated, getCommentsParticularPost);
router.route("/storyhighlight").post(isAuthenticated, createStoryHighlight);
router
  .route("/updateStoryhighlight/:id")
  .post(isAuthenticated, updateStoryHighLight);

router.route("/delete/:postId").delete(isAuthenticated, deletePost);
router.route("/bookmark/:postId").post(isAuthenticated, bookmarkPost);

export default router;
