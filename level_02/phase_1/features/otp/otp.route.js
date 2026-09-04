import express from "express";
import { otpSend, otpVerify } from "./otp.controller.js";

const router = express.Router();

router.post("/send", otpSend);
router.post("/verify", otpVerify);

export default router;
