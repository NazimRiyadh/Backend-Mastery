import { redisClient } from "../config/redis.js";
import AppError from "../utils/AppError.js";
import { TTL, SALT_ROUNDS } from "../utils/constants.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendMail from "../config/sendMail.js";
import { getVerifyEmailHtml, getOtpHtml } from "../config/html.js";

export const register = async ({ username, email, password, ip }) => {
  const rateLimitKey = `register_rate_limit:${ip}:${email}`;

  if (await redisClient.get(rateLimitKey)) {
    throw new AppError("Too many requests, try again later", 429);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const verifyToken = crypto.randomBytes(32).toString("hex");

  const verifyKey = `verify:${verifyToken}`;

  const dataStore = JSON.stringify({
    username,
    email,
    password: hashPassword,
  });

  await redisClient.set(verifyKey, dataStore, { EX: TTL.VERIFY_EMAIL });

  const subject = "Verify your email for account creation";
  const html = getVerifyEmailHtml({ email, token: verifyToken });

  await sendMail({ email, subject, html });
  await redisClient.set(rateLimitKey, "true", { EX: TTL.RATE_LIMIT });

  return { username, email };
};

export const verify = async (token) => {
  if (!token) {
    throw new AppError("Verification token is required", 400);
  }

  const verifyKey = `verify:${token}`;

  const userDataJson = await redisClient.get(verifyKey);

  if (!userDataJson) {
    throw new AppError("Verification Link is Expired", 400);
  }

  const userData = JSON.parse(userDataJson);

  const newUser = await User.create({
    username: userData.username,
    email: userData.email,
    password: userData.password,
  });

  await redisClient.del(verifyKey);

  return {
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
  };
};

export const login = async ({ email, password, ip }) => {
  const rateLimitKey = `login_rate_limit:${ip}:${email}`;

  if (await redisClient.get(rateLimitKey)) {
    throw new AppError("Too many requests, try again later", 429);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Invalid Credentials", 400);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid Credentials", 400);
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpKey = `otp:${email}`;

  await redisClient.set(otpKey, JSON.stringify({ otp }), { EX: TTL.OTP });

  const subject = "Login Verification Code";
  const html = getOtpHtml({ email, otp });

  await sendMail({ email, subject, html });

  await redisClient.set(rateLimitKey, "true", { EX: TTL.RATE_LIMIT });

  return { email };
};

export const verifyOtp = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new AppError("Email and OTP are required", 400);
  }

  const otpKey = `otp:${email}`;

  const otpDataJson = await redisClient.get(otpKey);

  if (!otpDataJson) {
    throw new AppError("OTP is Expired", 400);
  }

  const otpData = JSON.parse(otpDataJson);

  if (otpData.otp !== otp.toString()) {
    throw new AppError("Invalid OTP", 400);
  }

  await redisClient.del(otpKey);

  const user = await User.findOne({ email });

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
  };
};

export const logout = async (userId) => {
  await redisClient.del(`refresh_token:${userId}`);
  await redisClient.del(`user:${userId}`);
};
