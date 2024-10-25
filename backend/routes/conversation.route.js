import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createConversation,
  getConversation,
  getConversations,
} from "../controllers/conversation.controller.js";
const router = express.Router();

router.route("/create").post(isAuthenticated, createConversation);
router.route("/all").get(isAuthenticated, getConversations);
router.route("/:conversationId").get(isAuthenticated, getConversation);

export default router;
