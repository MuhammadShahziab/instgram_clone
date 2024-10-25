import expess from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getNotifications,
  readNotification,
} from "../controllers/notification.controller.js";

const router = expess.Router();

router.route("/all/:userId").get(isAuthenticated, getNotifications);
router.route("/read/:notificationId").post(isAuthenticated, readNotification);

export default router;
