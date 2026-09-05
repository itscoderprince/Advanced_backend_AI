import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

// Initialize Google GenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Service function: Direct Google GenAI SDK call
 * 
 * KEY RULES for @google/genai:
 * - Use `contents:` (not `input:` or `prompt:`)
 * - System instructions go in `config: { systemInstruction: "..." }`
 * - Read output via `response.text` (not `.content`)
 */
export async function askRawGemini(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-3.7-flash",
    contents: prompt,
    config: {
      systemInstruction: "You are Krishna 🦚, a helpful and knowledgeable AI assistant.",
    },
  });

  return response.text;
}

/**
 * Controller: Handles POST /ai/raw
 */
export async function handleRawGemini(req, res) {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({
      success: false,
      message: "Please provide an 'input' field in the body",
    });
  }

  try {
    const answer = await askRawGemini(input);

    return res.status(200).json({
      success: true,
      provider: "Google GenAI SDK (Direct)",
      model: "gemini-3.7-flash",
      answer,
    });
  } catch (error) {
    console.error("❌ Raw Gemini Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
