const cookieParser = require("cookie-parser");
const express = require("express");
const connectDB = require("./db/db");
const authRoutes = require("./routes/auth.routes");
const dotenv = require("dotenv").config();
const musicRoutes = require("./routes/music.routes");

const app = express();

const mongo_uri = process.env.MONGO_URI;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);

connectDB(mongo_uri);

module.exports = app;
