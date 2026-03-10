const cookieParser = require("cookie-parser");
const express = require("express");
const connectDB = require("./db/db");
const { mongo } = require("mongoose");
const authRoutes = require("./routes/auth.routes");
const dotenv = require("dotenv").config();

const app = express();
mongo_uri = process.env.MONGO_URI;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

connectDB(mongo_uri);

module.exports = app;
