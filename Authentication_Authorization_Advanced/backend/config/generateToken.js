import jwt from "jsonwebtoken";
import { redisClient } from "./redis.js";
import { TTL } from "../utils/constants.js";

export const verifyRefreshToken = async (refreshToken) => {
  try {
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const storedToken = await redisClient.get(`refresh_token:${decodedToken.id}`);
    if (storedToken === refreshToken) {
      return decodedToken;
    }
    return null;
  } catch {
    return null;
  }
};

export const generateToken = async (id, res) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: TTL.ACCESS_TOKEN,
  });
  const refreshToken = jwt.sign({ id }, process.env.REFRESH_SECRET, {
    expiresIn: TTL.REFRESH_TOKEN,
  });

  const refreshTokenKey = `refresh_token:${id}`;
  await redisClient.set(refreshTokenKey, refreshToken, {
    EX: TTL.REFRESH_TOKEN_SECONDS,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    //secure: true,
    sameSite: "strict",
    maxAge: TTL.ACCESS_TOKEN_MS,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    //secure: true,
    sameSite: "strict",
    maxAge: TTL.REFRESH_TOKEN_MS,
  });

  return { accessToken, refreshToken };
};

export const generateAccessToken = async (id, res) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: TTL.ACCESS_TOKEN,
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    //secure: true,
    sameSite: "strict",
    maxAge: TTL.ACCESS_TOKEN_MS,
  });
};
