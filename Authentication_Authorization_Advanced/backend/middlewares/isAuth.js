import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis.js";
import User from "../models/user.model.js";
import tryCatch from "./try_catch.js";
import { verifyRefreshToken, generateAccessToken } from "../config/generateToken.js";

export const isAuth = tryCatch(async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    // No access token — try to refresh using refresh token
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(403).json({
        message: "Please login. No token found",
      });
    }
    const decodedToken = await verifyRefreshToken(refreshToken);
    if (!decodedToken) {
      return res.status(403).json({
        message: "Please login. Invalid token",
      });
    }

    // Generate a new access token
    await generateAccessToken(decodedToken.id, res);

    const user = await User.findById(decodedToken.id).select("-password");
    if (!user) {
      return res.status(400).json({
        message: "No user with this id",
      });
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
      return res.status(403).json({
        message: "Please login. Token expired",
      });
    }
    const refreshDecoded = await verifyRefreshToken(refreshToken);
    if (!refreshDecoded) {
      return res.status(403).json({
        message: "Please login. Invalid token",
      });
    }

    await generateAccessToken(refreshDecoded.id, res);

    const user = await User.findById(refreshDecoded.id).select("-password");
    if (!user) {
      return res.status(400).json({
        message: "No user with this id",
      });
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
    return res.status(400).json({
      message: "No user with this id",
    });
  }
  await redisClient.setEx(
    `user:${decodedToken.id}`,
    7 * 24 * 60 * 60,
    JSON.stringify(user),
  );

  req.user = user;
  next();
});
