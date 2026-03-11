import tryCatch from "../middlewares/try_catch.js";
import { formatZodError, register_schema } from "../config/zod.js";
import sanitize from "mongo-sanitize";
import { redisClient } from "../index.js";
import mongoose, { mongo } from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendMail from "../config/sendMail.js";
import { getVerifyEmailHtml } from "../config/html.js";

export const registerUser = tryCatch(async (req, res) => {
  //sanitize to prevent Nosql Injection
  const sanitizedData = sanitize(req.body);

  //zod validation
  const validation = register_schema.safeParse(sanitizedData);
  if (!validation.success) {
    const zodError = validation.error;

    const formatError = formatZodError(zodError);
    res.status(400).json(formatError);
  }

  //email sending to verify
  const { username, email, password } = validation.data;

  const reateLimitKey = `register_rate_limit:${req.ip}:${email}`;

  if (await redisClient.get(reateLimitKey)) {
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
  await redisClient.set(reateLimitKey, "true", { EX: 60 });
  res.status(200).json({
    message: "If you email is valid, a verification link has been sent",
    username,
    email,
    password,
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
