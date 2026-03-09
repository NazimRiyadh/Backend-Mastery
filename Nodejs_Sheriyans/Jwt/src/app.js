const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/db");
const authRoutes = require("./auth/auth.routes");

connectDB();
const app = express();


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

;

module.exports = app;