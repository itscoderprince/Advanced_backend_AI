import express from "express";
import dotenv from "dotenv";

// ─── AI SDK Imports ──────────────────────────────────────────────────────────
import { GoogleGenAI } from "@google/genai"; // Direct Google SDK
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"; // LangChain + Gemini
import { ChatGroq } from "@langchain/groq"; // LangChain + Groq

dotenv.config({ quiet: true });

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ════════════════════════════════════════════════════════════════
// STEP 1: RAW AI SDK (Direct Google GenAI — No LangChain)
// ════════════════════════════════════════════════════════════════
// Use this when you want a simple, lightweight integration
// directly with Google's own SDK. No extra abstraction.
//
// KEY RULES:
//   - Use `contents:` (NOT `input:`) for the prompt
//   - Use `response.text` to read the output
//   - System prompt goes inside `config.systemInstruction`
//   - Role "system" is NOT supported inside `contents[]`
// ────────────────────────────────────────────────────────────────

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// app.post("/ai/raw", async (req, res) => {
//   const { input } = req.body;
//   if (!input) return res.status(400).json({ error: "input is required" });

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-3.7-flash",
//       contents: input,                        // ✅ use 'contents'
//       config: {
//         systemInstruction: "You are Krishna 🦚, a helpful AI assistant.",
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       answer: response.text,                  // ✅ use .text
//     });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

// ════════════════════════════════════════════════════════════════
// STEP 2: LANGCHAIN + GEMINI
// ════════════════════════════════════════════════════════════════
// LangChain wraps Google's SDK with a common interface.
// Advantage: You can swap Gemini for Groq/OpenAI in 1 line.
//
// KEY RULES:
//   - Pass `apiKey` explicitly (LangChain expects GOOGLE_API_KEY by default)
//   - Use `llm.invoke(input)` to call the model
//   - Use `response.content` (NOT `.text`) to read output
// ────────────────────────────────────────────────────────────────

// const llm = new ChatGoogleGenerativeAI({
//   apiKey: process.env.GEMINI_API_KEY,
//   model: "gemini-3.7-flash",
//   temperature: 0,     // 0 = strict/deterministic, 1 = creative
//   maxRetries: 2,      // auto-retry on network errors
// });

// app.post("/ai/gemini", async (req, res) => {
//   const { input } = req.body;
//   if (!input) return res.status(400).json({ error: "input is required" });

//   try {
//     const aiResponse = await llm.invoke(input);    // ✅ llm.invoke()

//     return res.status(200).json({
//       success: true,
//       answer: aiResponse.content,                  // ✅ use .content
//     });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

// ════════════════════════════════════════════════════════════════
// STEP 3: LANGCHAIN + GROQ (ACTIVE)
// ════════════════════════════════════════════════════════════════
// Groq runs open-source models (Llama, GPT-OSS) on LPUs.
// Speed: 500+ tokens/sec (10x faster than normal APIs).
//
// SAME LangChain interface — only the constructor changes!
// llm.invoke(input) works identically here as in Step 2.
// ────────────────────────────────────────────────────────────────

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0.7,
  maxRetries: 2,
});

app.post("/ai", async (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({
      success: false,
      message: "Please provide an 'input' field in the body",
    });
  }

  try {
    const aiResponse = await llm.invoke(input);

    return res.status(200).json({
      success: true,
      answer: aiResponse.content,
    });
  } catch (error) {
    console.error("❌ LangChain Error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


// ════════════════════════════════════════════════════════════════
// STEP 4: LANGCHAIN — MULTI-MESSAGE FORMAT (System + User)
// ════════════════════════════════════════════════════════════════
// Instead of passing a plain string, you pass an ARRAY of messages.
// LangChain supports role: "system" — unlike the raw Google SDK!
//
// This is the STANDARD production pattern for:
//   ✅ Setting an AI persona (system message)
//   ✅ Multi-turn conversations (alternating user/assistant)
//   ✅ Translation, classification, and structured tasks
//
// Message Roles:
//   "system"    → sets AI personality/instructions (sent once, at the start)
//   "user"      → the user's message
//   "assistant" → a previous AI response (used for chat history)
// ────────────────────────────────────────────────────────────────

app.post("/ai/translate", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      success: false,
      message: "Please provide a 'text' field to translate",
    });
  }

  try {
    // ✅ Multi-message format: array of { role, content }
    const aiMsg = await llm.invoke([
      {
        role: "system",
        content: "You are a helpful assistant that translates English to French. Translate the user sentence.",
      },
      {
        role: "user",
        content: text,
      },
    ]);

    return res.status(200).json({
      success: true,
      original: text,
      translated: aiMsg.content,
    });
  } catch (error) {
    console.error("❌ LangChain Error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


// ════════════════════════════════════════════════════════════════
// START SERVER
// ════════════════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`🚀 AI Server is running on http://localhost:${PORT}`);
});
