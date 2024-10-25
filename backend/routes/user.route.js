import express from "express";
import {
  acceptFollowRequest,
  declineFollowRequest,
  followUser,
  search,
  suggestedUsers,
  unFollowUser,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/suggested").get(isAuthenticated, suggestedUsers);
router.route("/search").get(search);

router.route("/follow/:userId").post(isAuthenticated, followUser);
router.route("/unfollow/:userId").post(isAuthenticated, unFollowUser);
router
  .route("/acceptRequest/:userId")
  .post(isAuthenticated, acceptFollowRequest);
router
  .route("/declineRequest/:userId")
  .post(isAuthenticated, declineFollowRequest);

export default router;
