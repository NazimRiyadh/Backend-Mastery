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

module.exports = { register_user };
