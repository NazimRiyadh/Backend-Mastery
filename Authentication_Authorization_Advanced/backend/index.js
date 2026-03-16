import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { redisClient } from "./config/redis.js";
dotenv.config();

//MongoDB connection
await connectDB();

redisClient
  .connect()
  .then(() => {
    console.log("Redis Connected");
  })
  .catch(console.error);

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

//import routes
import userRoutes from "./routes/user.route.js";
import errorHandler from "./middlewares/errorHandler.js";

//using routes
app.use("/api/v1/user", userRoutes);

//global error handler (must be after all routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
