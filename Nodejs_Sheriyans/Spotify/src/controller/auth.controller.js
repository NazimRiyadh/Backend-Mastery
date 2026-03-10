const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register_user(req, res) {
  const { username, email, password, role } = req.body;

  const user_exists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (user_exists) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hash,
    role,
  });

  const jwt_secret = process.env.JWT_SECRET;
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    jwt_secret,
  );

  res.cookie("token", token);
  res.status(201).json({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  });
}

async function login_user(req, res) {
  const { username, email, password } = req.body;

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const is_password_valid = await bcrypt.compare(password, user.password);
  if (!is_password_valid) {
    return res.status(401).json("Invalid Credentials");
  }

  const jwt_secret = process.env.JWT_SECRET;
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    jwt_secret,
  );

  return res.status(200).json({
    message: "Logged in successfully",
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
}

module.exports = { register_user, login_user };
