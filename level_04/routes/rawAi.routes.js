import { Router } from "express";
import { handleRawGemini } from "../controllers/rawAi.controller.js";

const router = Router();

// POST /ai/raw
router.post("/", handleRawGemini);

export default router;
