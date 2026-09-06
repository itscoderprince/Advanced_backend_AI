import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Initialize LangChain Gemini client
const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-3.7-flash",
  temperature: 0,     // 0 = strict/deterministic, 1 = creative
  maxRetries: 2,      // Auto-retry on network errors
});

/**
 * Service function: LangChain + Gemini call
 * 
 * KEY RULES for LangChain:
 * - Use `llm.invoke(prompt)`
 * - Read output via `response.content` (NOT `.text`)
 */
export async function askLangChainGemini(prompt) {
  const response = await llm.invoke(prompt);
  return response.content;
}

/**
 * Controller: Handles POST /ai/gemini
 */
export async function handleLangChainGemini(req, res) {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({
      success: false,
      message: "Please provide an 'input' field in the body",
    });
  }

  try {
    const answer = await askLangChainGemini(input);

    return res.status(200).json({
      success: true,
      provider: "LangChain + Gemini",
      model: "gemini-3.7-flash",
      answer,
    });
  } catch (error) {
    console.error("❌ LangChain Gemini Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
