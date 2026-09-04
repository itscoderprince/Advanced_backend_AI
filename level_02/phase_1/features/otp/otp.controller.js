import { redis } from "../../index.js";
import User from "../auth/auth.model.js";

// ==========================================
// 1. Send OTP (Generates & stores in Redis)
// ==========================================
export const otpSend = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please provide email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate random 4-digit OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000);

    // Save in Redis with 60 seconds expiration
    await redis.set(`otp:${email}`, otpCode, "EX", 60);

    console.log(`📩 OTP for ${email}: ${otpCode}`);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ==========================================
// 2. Verify OTP (Reads & validates from Redis)
// ==========================================
export const otpVerify = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    if (!email || !otpCode) {
      return res.status(400).json({ message: "Please provide email and OTP" });
    }

    // Check Redis for the OTP
    const cachedOtpCode = await redis.get(`otp:${email}`);
    if (!cachedOtpCode) {
      return res.status(404).json({ message: "OTP not found or expired" });
    }

    if (cachedOtpCode != otpCode) {
      return res.status(400).json({ message: "Invalid OTP code!" });
    }

    // Delete OTP from Redis once verified (prevent reuse)
    await redis.del(`otp:${email}`);

    return res.status(200).json({ message: "OTP verified successfully ✅" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
