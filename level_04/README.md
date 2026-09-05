# Level 04: AI & LLM Engineering Notes 🤖

A comprehensive guide covering **Direct SDKs (@google/genai)** vs **LangChain abstraction (@langchain/google-genai, @langchain/groq)** integrated with an Express.js backend.

---

## 📑 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Method 1: Native Google GenAI SDK](#2-method-1-native-google-genai-sdk-googlegenai)
3. [Method 2: LangChain with Gemini](#3-method-2-langchain-with-gemini-langchaingoogle-genai)
4. [Method 3: LangChain with Groq](#4-method-3-langchain-with-groq-langchaingroq)
5. [Express API Integration & Best Practices](#5-express-api-integration--best-practices)
6. [Common Pitfalls & How to Avoid Them](#6-common-pitfalls--how-to-avoid-them)
7. [SDK vs LangChain Comparison](#7-sdk-vs-langchain-comparison)

---

## 1. Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │           Express Web Server           │
                      │               (Port 5000)              │
                      └───────────────────┬────────────────────┘
                                          │
                               POST /ai { "input": "..." }
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   ▼                                             ▼
        [ Path A: Direct SDK ]                       [ Path B: LangChain ]
         `@google/genai`                             `@langchain/core`
                   │                                             │
                   ▼                                      ┌──────┴──────┐
           Google Gemini API                              ▼             ▼
         (gemini-3.7-flash)                          ChatGoogleGenAI  ChatGroq
                                                          │             │
                                                          ▼             ▼
                                                     Gemini API      Groq LPU
```

---

## 2. Method 1: Native Google GenAI SDK (`@google/genai`)

Use this when you only need Google models without external framework overhead.

### Installation:
```bash
npm install @google/genai
```

### Implementation:
```javascript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Basic prompt
const response = await ai.models.generateContent({
  model: "gemini-3.7-flash",
  contents: "Explain Docker in one sentence",
});

console.log(response.text);
```

### Adding System Instructions (Persona):
```javascript
const response = await ai.models.generateContent({
  model: "gemini-3.7-flash",
  contents: input,
  config: {
    // Defines AI personality / behavior
    systemInstruction: "You are an assistant and your name is Krishna 🦚",
  },
});

console.log(response.text);
```

---

## 3. Method 2: LangChain with Gemini (`@langchain/google-genai`)

LangChain provides a **unified interface** across 50+ LLM providers.

### Installation:
```bash
npm install @langchain/google-genai @langchain/core
```

### Implementation:
```javascript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-3.7-flash",
  temperature: 0,   // 0 = strict & deterministic, 1 = creative
  maxRetries: 2,    // Automatically retries failed network calls
});

// Invoke the model
const response = await llm.invoke("Hello, who are you?");

console.log(response.content);
```

---

## 4. Method 3: LangChain with Groq (`@langchain/groq`)

Groq runs open-source models (Llama, Gemma, DeepSeek) on LPUs (Language Processing Units) at ultra-fast speeds (500+ tokens/sec).

### Installation:
```bash
npm install @langchain/groq @langchain/core
```

### Implementation:
```javascript
import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile", // or "openai/gpt-oss-120b"
  temperature: 0,
  maxRetries: 2,
});

// Exact same .invoke() method!
const response = await llm.invoke("What is an API Gateway?");

console.log(response.content);
```

> 💡 **Why LangChain is powerful:** Notice how switching between Google and Groq only required changing the constructor (`new ChatGroq` vs `new ChatGoogleGenerativeAI`). The rest of your code (`llm.invoke(...)`) stayed 100% identical!

---

## 5. Express API Integration & Best Practices

Wrapping LLMs inside an HTTP endpoint:

```javascript
app.post("/ai", async (req, res) => {
  const { input } = req.body;

  // 1. Input Validation
  if (!input) {
    return res.status(400).json({
      success: false,
      message: "Please provide an 'input' field in the body",
    });
  }

  try {
    // 2. Call LLM
    const aiResponse = await llm.invoke(input);

    // 3. Return JSON Response
    return res.status(200).json({
      success: true,
      answer: aiResponse.content, // or response.text for GoogleGenAI SDK
    });
  } catch (error) {
    console.error("❌ AI Error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
```

---

## 6. Common Pitfalls & How to Avoid Them

| Mistake | What Happens | The Fix |
| :--- | :--- | :--- |
| **`role: "system"` in `contents`** | `Role 'system' is not supported` (400) | In Gemini, pass system prompts via `config: { systemInstruction: "..." }`. |
| **Shadowing `res` variable** | `Identifier 'res' has already been declared` | Express route has `(req, res)`. Name your AI output `aiResponse` or `result`, never `res`. |
| **`contents` vs `input`** | `400 Bad Request` | `@google/genai` uses `contents`. `interactions.create` uses `input`. |
| **`response.text` vs `response.content`** | Returns `undefined` | Native `@google/genai` returns `.text`. LangChain returns `.content`. |
| **Missing API Key in LangChain** | `GOOGLE_API_KEY not found` | If your `.env` has `GEMINI_API_KEY`, pass `apiKey: process.env.GEMINI_API_KEY` explicitly. |

---

## 7. SDK vs LangChain Comparison

| Feature | Native SDK (`@google/genai`) | LangChain (`@langchain/*`) |
| :--- | :--- | :--- |
| **Speed & Overhead** | Ultra-lightweight, zero abstraction | Slightly heavier, feature-rich |
| **Vendor Lock-in** | Locked to Google Gemini | Provider-agnostic (Switch Gemini ➔ Groq ➔ OpenAI in 1 line) |
| **Chains & Memory** | Must build manually | Built-in (PromptTemplates, ChatHistory, Agents, RAG) |
| **Best Used For** | Simple Gemini-only scripts / microservices | Production AI apps, multi-model fallback, Agents & RAG |
