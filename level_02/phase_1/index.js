import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./lib/db.js";
import authRouter from "./features/auth/auth.route.js";
import otpRouter from "./features/otp/otp.route.js";
import Redis from "ioredis";

dotenv.config({ quiet: true });

export const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
redis.on("connect", () => console.log("✅ Redis connected successfully"));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/auth", authRouter);
app.use("/otp", otpRouter);

connectDB();
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
