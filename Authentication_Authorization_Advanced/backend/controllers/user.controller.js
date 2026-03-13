import tryCatch from "../middlewares/try_catch.js";
import {
  formatZodError,
  register_schema,
  login_schema,
} from "../config/zod.js";
import sanitize from "mongo-sanitize";
import { redisClient } from "../index.js";
import mongoose, { mongo } from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendMail from "../config/sendMail.js";
import { getVerifyEmailHtml, getOtpHtml } from "../config/html.js";
import { generateToken } from "../config/generateToken.js";

export const registerUser = tryCatch(async (req, res) => {
  //sanitize to prevent Nosql Injection
  const sanitizedData = sanitize(req.body);

  //zod validation
  const validation = register_schema.safeParse(sanitizedData);
  if (!validation.success) {
    const zodError = validation.error;

    const formatError = formatZodError(zodError);
    return res.status(400).json(formatError);
  }

  //email sending to verify
  const { username, email, password } = validation.data;

  const rateLimitKey = `register_rate_limit:${req.ip}:${email}`;

  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Too many requests, try again later",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const verifyToken = crypto.randomBytes(32).toString("hex");

  const verifyKey = `verify:${verifyToken}`;

  const dataStore = JSON.stringify({
    username,
    email,
    password: hashPassword,
  });

  await redisClient.set(verifyKey, dataStore, { EX: 300 });

  const subject = "Verify your email for account creation";

  const html = getVerifyEmailHtml({ email, token: verifyToken });

  await sendMail({ email, subject, html });
  await redisClient.set(rateLimitKey, "true", { EX: 60 });
  res.status(200).json({
    message: "If you email is valid, a verification link has been sent",
    username,
    email,
  });
});

export const verifyUser = tryCatch(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      message: "Verification token is required",
    });
  }

  const verifyKey = `verify:${token}`;

  const userDataJson = await redisClient.get(verifyKey);

  if (!userDataJson) {
    return res.status(400).json({
      message: "Verification Link is Expired",
    });
  }

  const userData = JSON.parse(userDataJson);

  const newUser = await User.create({
    username: userData.username,
    email: userData.email,
    password: userData.password,
  });

  res.status(200).json({
    message: "Email Verified successfully! Your account has been created",
    user: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
  });
  await redisClient.del(verifyKey);
});

export const loginUser = tryCatch(async (req, res) => {
  //sanitize to prevent Nosql Injection
  const sanitizedData = sanitize(req.body);

  //zod validation
  const validation = login_schema.safeParse(sanitizedData);
  if (!validation.success) {
    const zodError = validation.error;

    const formatError = formatZodError(zodError);
    return res.status(400).json(formatError);
  }

  //email sending to verify
  const { email, password } = validation.data;

  const rateLimitKey = `login_rate_limit:${req.ip}:${email}`;

  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Too many requests, try again later",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid Credentials",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid Credentials",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpKey = `otp:${email}`;

  await redisClient.set(otpKey, JSON.stringify({ otp }), { EX: 300 });

  const subject = "Login Verification Code";

  const html = getOtpHtml({ email, otp });

  await sendMail({ email, subject, html });

  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  res.status(200).json({
    message: "If your email is valid, a verification code has been sent",
    email,
  });
});

export const verifyOtp = tryCatch(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: "Email and OTP are required",
    });
  }

  const otpKey = `otp:${email}`;

  const otpDataJson = await redisClient.get(otpKey);

  if (!otpDataJson) {
    return res.status(400).json({
      message: "OTP is Expired",
    });
  }

  const otpData = JSON.parse(otpDataJson);

  if (otpData.otp !== otp.toString()) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  await redisClient.del(otpKey);

  const user = await User.findOne({ email });

  await generateToken(user._id, res, redisClient);

  res.status(200).json({
    message: "Login Successful",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});
