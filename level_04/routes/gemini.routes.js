import { Router } from "express";
import { handleLangChainGemini } from "../controllers/gemini.controller.js";

const router = Router();

// POST /ai/gemini
router.post("/", handleLangChainGemini);

export default router;
