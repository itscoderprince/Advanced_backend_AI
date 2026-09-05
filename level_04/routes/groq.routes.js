import { Router } from "express";
import {
  handleGroqChat,
  handleGroqTranslate,
} from "../controllers/groq.controller.js";

const router = Router();

// POST /ai (General Groq Query)
router.post("/", handleGroqChat);

// POST /ai/translate (Multi-message System + User Translation)
router.post("/translate", handleGroqTranslate);

export default router;
