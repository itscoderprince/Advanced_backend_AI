import "dotenv/config";
import express from "express";

// ─── Import Modular Routes ───────────────────────────────────────────────────
import rawAiRouter from "./routes/rawAi.routes.js";
import geminiRouter from "./routes/gemini.routes.js";
import groqRouter from "./routes/groq.routes.js";
import langGraphRouter from "./routes/langGraph.route.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ─── API Overview / Health Check ─────────────────────────────────────────────
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "🚀 Level 04: AI & LLM Backend is Live and Running!",
    endpoints: {
      "Step 1 - Direct Google GenAI SDK": {
        route: "POST /ai/raw",
        body: { input: "Explain Docker in one sentence" },
      },
      "Step 2 - LangChain + Gemini": {
        route: "POST /ai/gemini",
        body: { input: "Explain Docker in one sentence" },
      },
      "Step 3 - LangChain + Groq (Ultra-fast LPUs)": {
        route: "POST /ai",
        body: { input: "What is Docker?" },
      },
      "Step 4 - Multi-Message Prompt (System + User Translation)": {
        route: "POST /ai/translate",
        body: { text: "I love programming.", targetLanguage: "Hindi" },
      },
      "Step 5 - LangGraph — Custom State (Annotation.Root)": {
        route: "POST /ai/graph/custom",
        body: { prompt: "What is Node.js?" },
      },
      "Step 6 - LangGraph — Prebuilt State + Tools + Memory (MemorySaver)": {
        route: "POST /ai/graph/prebuilt",
        body: { prompt: "What is the weather in Delhi?", thread_id: "user_1" },
      },
    },
  });
});

// ─── Mount Modular AI Routes ─────────────────────────────────────────────────
// Step 1: Raw Google GenAI SDK (Direct)
app.use("/ai/raw", rawAiRouter);

// Step 2: LangChain + Google Gemini
app.use("/ai/gemini", geminiRouter);

// Step 5: LangGraph — must be mounted BEFORE /ai to avoid route conflict
app.use("/ai/graph", langGraphRouter);

// Step 3 & 4: LangChain + Groq (General AI & Multi-message Translation)
app.use("/ai", groqRouter);

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 AI Server is running on http://localhost:${PORT}`);
});
