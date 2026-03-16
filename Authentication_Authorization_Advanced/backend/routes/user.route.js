import express from "express";
import {
  registerUser,
  verifyUser,
  loginUser,
  verifyOtp,
  getProfile,
} from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/isAuth.js";
import validate from "../middlewares/validate.js";
import { register_schema, login_schema } from "../config/zod.js";

const router = express.Router();

router.post("/register", validate(register_schema), registerUser);
router.post("/verify/:token", verifyUser);
router.post("/login", validate(login_schema), loginUser);
router.post("/verify-otp", verifyOtp);
router.get("/profile", isAuth, getProfile);

export default router;
