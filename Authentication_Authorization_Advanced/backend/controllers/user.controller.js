import tryCatch from "../middlewares/try_catch.js";
import * as authService from "../services/auth.service.js";
import { generateToken } from "../services/token.service.js";

export const registerUser = tryCatch(async (req, res) => {
  const { username, email, password } = req.validated;

  const result = await authService.register({
    username,
    email,
    password,
    ip: req.ip,
  });

  res.status(200).json({
    message: "If you email is valid, a verification link has been sent",
    ...result,
  });
});

export const verifyUser = tryCatch(async (req, res) => {
  const { token } = req.params;

  const user = await authService.verify(token);

  res.status(200).json({
    message: "Email Verified successfully! Your account has been created",
    user,
  });
});

export const loginUser = tryCatch(async (req, res) => {
  const { email, password } = req.validated;

  const result = await authService.login({ email, password, ip: req.ip });

  res.status(200).json({
    message: "If your email is valid, a verification code has been sent",
    ...result,
  });
});

export const verifyOtp = tryCatch(async (req, res) => {
  const { email, otp } = req.body;

  const user = await authService.verifyOtp({ email, otp });

  // Set auth cookies (HTTP concern — belongs in controller, not service)
  await generateToken(user._id, res);

  res.status(200).json({
    message: "Login Successful",
    user,
  });
});

export const getProfile = tryCatch(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    message: "Profile fetched successfully",
    user,
  });
});

export const logoutUser = tryCatch(async (req, res) => {
  const user = req.user;

  // Invalidate tokens in Redis
  await authService.logout(user._id);

  // Clear cookies from browser
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({
    message: "Logged out successfully",
  });
});
