import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
//import Redis from "ioredis";
import { createClient } from "redis";
dotenv.config();

//MongoDB connection
await connectDB();

//Redis Connection
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  console.log("Missing Redis url!");
  process.exit(1);
}

export const redisClient = createClient({
  url: redisUrl,
});

redisClient
  .connect()
  .then(() => {
    console.log("Redis Connected");
  })
  .catch(console.error);

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

//import routes
import userRoutes from "./routes/user.route.js";

//using routes
app.use("/api/v1/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
