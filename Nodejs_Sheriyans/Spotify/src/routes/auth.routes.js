const express = require("express");
const { register_user } = require("../controller/auth.controller");

const router = express.Router();

router.post("/register", register_user);

module.exports = router;
