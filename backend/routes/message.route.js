import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, sendMessage);
router.route("/all/:conversationId").get(isAuthenticated, getMessages);
export default router;
