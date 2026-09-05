import "dotenv/config";
import { ChatGroq } from "@langchain/groq";

// Initialize LangChain Groq client (500+ tokens/sec on LPUs)
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0.7,
  maxRetries: 2,
});

/**
 * Service function: Single prompt Groq call
 */
export async function askGroq(prompt) {
  const response = await llm.invoke(prompt);
  return response.content;
}

/**
 * Service function: Multi-message prompt with system & user roles
 */
export async function translateWithGroq(text, targetLanguage = "Hindi") {
  const response = await llm.invoke([
    {
      role: "system",
      content: `You are a helpful assistant that translates English to ${targetLanguage}. Translate the user sentence strictly.`,
    },
    {
      role: "user",
      content: text,
    },
  ]);

  return response.content;
}

/**
 * Controller: Handles POST /ai (General Groq query)
 */
export async function handleGroqChat(req, res) {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({
      success: false,
      message: "Please provide an 'input' field in the body",
    });
  }

  try {
    const answer = await askGroq(input);

    return res.status(200).json({
      success: true,
      provider: "LangChain + Groq",
      model: "openai/gpt-oss-120b",
      answer,
    });
  } catch (error) {
    console.error("❌ LangChain Groq Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Controller: Handles POST /ai/translate (Multi-message Translation)
 */
export async function handleGroqTranslate(req, res) {
  const { text, targetLanguage = "Hindi" } = req.body;

  if (!text) {
    return res.status(400).json({
      success: false,
      message: "Please provide a 'text' field to translate",
    });
  }

  try {
    const translated = await translateWithGroq(text, targetLanguage);

    return res.status(200).json({
      success: true,
      provider: "LangChain + Groq (Multi-Message Prompt)",
      targetLanguage,
      original: text,
      translated,
    });
  } catch (error) {
    console.error("❌ Translation Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
