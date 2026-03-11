// src/routes/music.routes.js
const express = require("express");
const multer = require("multer");
const { create_music } = require("../controller/music.controller");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// upload.fields() accepts an array of { name, maxCount } objects
router.post(
  "/create",
  upload.fields([
    { name: "music_file", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
  ]),
  create_music,
);

module.exports = router;
