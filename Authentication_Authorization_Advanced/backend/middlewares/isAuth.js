import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis.js";
import User from "../models/user.model.js";
import tryCatch from "./try_catch.js";
import AppError from "../utils/AppError.js";
import { verifyRefreshToken, generateAccessToken } from "../config/generateToken.js";

export const isAuth = tryCatch(async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    // No access token — try to refresh using refresh token
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError("Please login. No token found", 403);
    }
    const decodedToken = await verifyRefreshToken(refreshToken);
    if (!decodedToken) {
      throw new AppError("Please login. Invalid token", 403);
    }

    // Generate a new access token
    await generateAccessToken(decodedToken.id, res);

    const user = await User.findById(decodedToken.id).select("-password");
    if (!user) {
      throw new AppError("No user with this id", 400);
    }
    await redisClient.setEx(
      `user:${decodedToken.id}`,
      7 * 24 * 60 * 60,
      JSON.stringify(user),
    );
    req.user = user;
    return next();
  }

  // Access token exists — verify it
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // Access token expired/invalid — try refresh flow
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError("Please login. Token expired", 403);
    }
    const refreshDecoded = await verifyRefreshToken(refreshToken);
    if (!refreshDecoded) {
      throw new AppError("Please login. Invalid token", 403);
    }

    await generateAccessToken(refreshDecoded.id, res);

    const user = await User.findById(refreshDecoded.id).select("-password");
    if (!user) {
      throw new AppError("No user with this id", 400);
    }
    await redisClient.setEx(
      `user:${refreshDecoded.id}`,
      7 * 24 * 60 * 60,
      JSON.stringify(user),
    );
    req.user = user;
    return next();
  }

  const cacheUser = await redisClient.get(`user:${decodedToken.id}`);
  if (cacheUser) {
    req.user = JSON.parse(cacheUser);
    return next();
  }

  const user = await User.findById(decodedToken.id).select("-password");
  if (!user) {
    throw new AppError("No user with this id", 400);
  }
  await redisClient.setEx(
    `user:${decodedToken.id}`,
    7 * 24 * 60 * 60,
    JSON.stringify(user),
  );

  req.user = user;
  next();
});
