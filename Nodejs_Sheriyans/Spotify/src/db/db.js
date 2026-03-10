const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

async function connectDB(mongo_uri) {
  try {
    await mongoose.connect(mongo_uri);
    console.log("Database Connected");
  } catch (err) {
    console.log("err", err);
  }
}

module.exports = connectDB;
