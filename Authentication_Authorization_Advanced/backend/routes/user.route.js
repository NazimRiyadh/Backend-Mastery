import express from "express";
import {
  registerUser,
  verifyUser,
  loginUser,
  verifyOtp,
  getProfile,
} from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify/:token", verifyUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.get("/profile", isAuth, getProfile);

export default router;
