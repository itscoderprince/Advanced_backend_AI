import express from "express";
import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";

dotenv.config({ quiet: true });

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

// ─── LLM Client ─────────────────────────
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-20b",
  temperature: 0.7,
  maxRetries: 2,
});

// ─── Health Check ────────────────────────
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "🚀 Level 04 — Phase 02 Server is Live!",
  });
});

// ─── LLM Invoke Endpoint ──────────────────
app.post("/ai", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "Please provide a 'prompt' field",
    });
  }

  try {
    const response = await llm.invoke(prompt);

    return res.status(200).json({
      success: true,
      answer: response.content,
    });
  } catch (error) {
    console.error("❌ LLM Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server is running on: http://localhost:${PORT}`);
});
