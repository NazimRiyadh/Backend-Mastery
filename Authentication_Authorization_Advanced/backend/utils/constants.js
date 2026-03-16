// All TTL/expiry values in one place
// Seconds for Redis, milliseconds for cookies, string for JWT

export const TTL = {
  // OTP & Email Verification
  OTP: 300, // 5 minutes
  VERIFY_EMAIL: 300, // 5 minutes

  // Rate Limiting
  RATE_LIMIT: 60, // 1 minute

  // Access Token
  ACCESS_TOKEN: "1m",
  ACCESS_TOKEN_MS: 1 * 60 * 1000,

  // Refresh Token
  REFRESH_TOKEN: "7d",
  REFRESH_TOKEN_SECONDS: 7 * 24 * 60 * 60,
  REFRESH_TOKEN_MS: 7 * 24 * 60 * 60 * 1000,

  // User Cache
  USER_CACHE: 7 * 24 * 60 * 60,
};

// Bcrypt
export const SALT_ROUNDS = 10;
