const express = require("express");
const router = express.Router();
const { register, create_post } = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/post", create_post)

module.exports = router; 