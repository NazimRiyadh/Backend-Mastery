// src/controller/music.controller.js
const jwt = require("jsonwebtoken");
const MusicModel = require("../models/music.model");
const uploadFile = require("../services/storage.service");

async function create_music(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (user.role !== "artist") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // req.files is populated by multer's upload.fields()
    const musicFile = req.files["music_file"]?.[0]; // the audio file
    const coverImage = req.files["cover_image"]?.[0]; // the cover image

    if (!musicFile || !coverImage) {
      return res.status(400).json({
        message: "Both music file and cover image are required",
      });
    }

    const { title } = req.body;

    // Upload both files to ImageKit in parallel
    const [musicUrl, coverImageUrl] = await Promise.all([
      uploadFile(musicFile),
      uploadFile(coverImage),
    ]);

    const music = await MusicModel.create({
      uri: musicUrl,
      cover_image: coverImageUrl,
      title,
      artist: user.id,
    });

    return res.status(201).json({
      message: "Music created successfully",
      music,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { create_music };
