import express from "express";
import { getProfile, editProfile } from "../controllers/profile.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/:userId").get(isAuthenticated, getProfile);
router.route("/edit").post(isAuthenticated, editProfile);

export default router;
