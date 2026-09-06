# Level 04: AI, LLM & Agent Engineering Notes 🤖

A comprehensive production guide covering **Direct SDKs (@google/genai)**, **LangChain abstraction (@langchain/google-genai, @langchain/groq)**, and **LangGraph cyclic agent workflows with tool calling (@langchain/langgraph, @langchain/tavily)** integrated into an Express.js backend.

---

## ✅ Completed Topics & Progress Checklist

- [x] **Environment & Project Setup:** `dotenv`, `.gitignore`, `"type": "module"`, `node --watch`
- [x] **Express.js Architecture:** Modular routes & controllers, JSON body parsing, proper HTTP status codes (`200`, `400`, `500`), input validation, `try / catch` handling
- [x] **Method 1 — Native Google GenAI SDK (`@google/genai`):** Direct SDK initialization, `ai.models.generateContent()`, `systemInstruction`, extracting `.text`
- [x] **Method 2 — LangChain with Gemini (`@langchain/google-genai`):** Unified interface, `ChatGoogleGenerativeAI`, `.invoke()`, extracting `.content`
- [x] **Method 3 — LangChain with Groq (`@langchain/groq`):** Ultra-fast LPU inference (500+ tok/s), 1-line provider swapping
- [x] **Multi-Message Prompt Engineering:** Structured roles (`system`, `user`, `assistant`), developer instructions, few-shot prompting for strict translations
- [x] **Method 4 — LangGraph Custom State (`Annotation.Root`):** Custom state channels (`prompt`, `aiMsg`), `StateGraph`, node registration, linear edge flow
- [x] **Method 5 — LangGraph Prebuilt State (`MessagesAnnotation`):** Chat-native state with automatic message history reducer, multi-turn state preservation
- [x] **Tool Calling & Agent Loop (`ToolNode` + `TavilySearch`):** `llm.bindTools()`, prebuilt `ToolNode`, real-time web search with Tavily
- [x] **Dynamic Routing (`shouldContinue`):** Conditional edge checking `lastMessage.tool_calls` (`agent → tools` or `agent → __end__`)
- [x] **Full Agent Cycle:** `START → agent → shouldContinue → tools → agent → END`
- [x] **Multi-Turn Conversational Memory (`MemorySaver` + `thread_id`):** Automatic checkpointing preserving chat history across requests via `{ configurable: { thread_id } }`
- [x] **Production Rate-Limit & TPM Optimization:** Overcoming Groq free-tier 8k TPM rate limits using `openai/gpt-oss-20b` and search result trimming (`maxResults: 2`)

---

## 📑 Table of Contents
1. [Completed Topics Checklist](#-completed-topics--progress-checklist)
2. [Architecture Overview](#1-architecture-overview)
3. [API Endpoints Reference](#2-api-endpoints-reference)
4. [Method 1: Native Google GenAI SDK](#3-method-1-native-google-genai-sdk-googlegenai)
5. [Method 2: LangChain with Gemini](#4-method-2-langchain-with-gemini-langchaingoogle-genai)
6. [Method 3: LangChain with Groq](#5-method-3-langchain-with-groq-langchaingroq)
7. [Method 4: LangGraph — Custom State](#6-method-4-langgraph--custom-state-annotationroot)
8. [Method 5: LangGraph — Prebuilt State & Tool Calling](#7-method-5-langgraph--prebuilt-state--tool-calling-agent)
9. [Express API Integration & Best Practices](#8-express-api-integration--best-practices)
10. [Common Pitfalls & How to Avoid Them](#9-common-pitfalls--how-to-avoid-them)
11. [SDK vs LangChain vs LangGraph Comparison](#10-sdk-vs-langchain-vs-langgraph-comparison)

---

## 1. Architecture Overview

```
                              ┌────────────────────────────────────────┐
                              │           Express Web Server           │
                              │               (Port 5000)              │
                              └───────────────────┬────────────────────┘
                                                  │
                 ┌────────────────────────────────┼───────────────────────────────┐
                 │                                │                               │
                 ▼                                ▼                               ▼
      [ Path A: Direct SDK ]            [ Path B: LangChain ]           [ Path C: LangGraph Agent ]
         `@google/genai`                  `@langchain/core`                 `@langchain/langgraph`
                 │                                │                               │
                 ▼                        ┌───────┴───────┐                       ▼
         Google Gemini API                ▼               ▼              StateGraph + ToolNode
        (gemini-3.7-flash)         ChatGoogleGenAI     ChatGroq                   │
                                          │               │               ┌───────┴───────┐
                                          ▼               ▼               ▼               ▼
                                     Gemini API       Groq LPU         ChatGroq      TavilySearch
                                                                    (gpt-oss-20b)     (Web Tool)
```

---

## 2. API Endpoints Reference

| Step | Method & Route | Controller File | Purpose | Sample Request Body |
| :--- | :--- | :--- | :--- | :--- |
| **1** | `POST /ai/raw` | `rawAi.controller.js` | Direct Google GenAI SDK | `{"input": "Explain Docker in one sentence"}` |
| **2** | `POST /ai/gemini` | `gemini.controller.js` | LangChain + Gemini | `{"input": "Explain Docker in one sentence"}` |
| **3** | `POST /ai` | `groq.controller.js` | LangChain + Groq LPU | `{"input": "What is Docker?"}` |
| **4** | `POST /ai/translate` | `groq.controller.js` | Multi-Message System Translation | `{"text": "I love coding", "targetLanguage": "Hindi"}` |
| **5** | `POST /ai/graph/custom` | `langGraph.customState.controller.js` | LangGraph Custom State (`Annotation.Root`) | `{"prompt": "What is Node.js?"}` |
| **6** | `POST /ai/graph/prebuilt` | `langGraph.prebuilt.controller.js` | LangGraph Prebuilt State + Tools + Memory | `{"prompt": "What is the weather in Delhi?", "thread_id": "user_1"}` |

---

## 3. Method 1: Native Google GenAI SDK (`@google/genai`)

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

// Prompt with system persona
const response = await ai.models.generateContent({
  model: "gemini-3.7-flash",
  contents: input,
  config: {
    systemInstruction: "You are an assistant and your name is Krishna 🦚",
  },
});

console.log(response.text);
```

---

## 4. Method 2: LangChain with Gemini (`@langchain/google-genai`)

LangChain provides a **unified interface** across LLM providers.

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

const response = await llm.invoke("Hello, who are you?");
console.log(response.content);
```

---

## 5. Method 3: LangChain with Groq (`@langchain/groq`)

Groq runs open-source models on LPUs (Language Processing Units) at ultra-fast speeds (500+ tokens/sec).

### Installation:
```bash
npm install @langchain/groq @langchain/core
```

### Implementation:
```javascript
import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0,
  maxRetries: 2,
});

const response = await llm.invoke("What is an API Gateway?");
console.log(response.content);
```

> 💡 **Why LangChain is powerful:** Switching between Gemini and Groq only requires changing the constructor (`new ChatGroq` vs `new ChatGoogleGenerativeAI`). The rest of your code (`llm.invoke(...)`) remains 100% identical!

---

## 6. Method 4: LangGraph — Custom State (`Annotation.Root`)

Use when you need fine-grained control over your state shape and custom channels.

```
FLOW: START ──► callLLM ──► END
```

```javascript
import { Annotation, StateGraph, END } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";

// 1. Define custom state schema
const State = Annotation.Root({
  prompt: Annotation,
  aiMsg: Annotation,
});

// 2. Define node
const callLLM = async (state) => {
  const response = await llm.invoke([
    { role: "system", content: "You are Krishna 🦚. Speak truth." },
    { role: "user", content: state.prompt },
  ]);
  return { aiMsg: response.content };
};

// 3. Assemble and compile graph
const graph = new StateGraph(State)
  .addNode("agent", callLLM)
  .addEdge("__start__", "agent")
  .addEdge("agent", END)
  .compile();

// 4. Run
const finalState = await graph.invoke({ prompt: "Explain LangGraph" });
console.log(finalState.aiMsg);
```

---

## 7. Method 5: LangGraph — Prebuilt State & Tool Calling (Agent)

Combines `MessagesAnnotation` with `ToolNode` and `TavilySearch` to build a cyclic ReAct agent that searches the web when it lacks real-time facts.

```
                   ┌──────────────┐
                   │  __start__   │
                   └──────┬───────┘
                          │
                          ▼
                   ┌──────────────┐
         ┌────────►│    agent     │◄────────┐
         │         └──────┬───────┘         │
         │                │                 │
         │         shouldContinue()         │
         │         (tool_calls?)            │
         │           /          \           │
       tools       yes           no       __end__
         │         /              \         │
         │        ▼                ▼        ▼
         │   ┌─────────┐      ┌───────────────┐
         └───│  tools  │      │    __end__    │
             └─────────┘      └───────────────┘
```

### Installation:
```bash
npm install @langchain/langgraph @langchain/tavily
```

### Implementation:
```javascript
import { StateGraph, MessagesAnnotation, MemorySaver } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { ChatGroq } from "@langchain/groq";

// 1. Tools setup
const tavilyTool = new TavilySearch({ maxResults: 2, topic: "general" });
const tools = [tavilyTool];
const toolNode = new ToolNode(tools);

// 2. LLM with tools bound
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-20b", // optimal for free-tier TPM limits
  temperature: 0.7,
}).bindTools(tools);

// 3. Node passes message history
const callLLM = async (state) => {
  const response = await llm.invoke([
    {
      role: "system",
      content:
        "You are Krishna 🦚, a knowledgeable assistant. " +
        "If you are unsure or lack real-time data, use the available tools.",
    },
    ...state.messages,
  ]);
  return { messages: response };
};

// 4. Conditional Edge: Tools vs Finish
const shouldContinue = (state) => {
  const lastMessage = state.messages[state.messages.length - 1];
  return lastMessage.tool_calls?.length > 0 ? "tools" : "__end__";
};

// 5. Memory Checkpointer (persists conversation across requests)
const checkpointer = new MemorySaver();

// 6. Build Graph
const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callLLM)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addEdge("tools", "agent") // Tool output loops back to agent!
  .addConditionalEdges("agent", shouldContinue)
  .compile({ checkpointer });

// 7. Invoke with thread_id for multi-turn chat memory
const finalState = await graph.invoke(
  { messages: [{ role: "user", content: prompt }] },
  { configurable: { thread_id: "user_123" } }
);
```

---

## 8. Express API Integration & Best Practices

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
      answer: aiResponse.content,
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

## 9. Common Pitfalls & How to Avoid Them

| Mistake | What Happens | The Fix |
| :--- | :--- | :--- |
| **`role: "system"` in `contents`** | `Role 'system' is not supported` (400) | In Gemini native SDK, pass system prompts via `config: { systemInstruction: "..." }`. |
| **Shadowing `res` variable** | `Identifier 'res' has already been declared` | Express route has `(req, res)`. Name your AI output `aiResponse` or `result`, never `res`. |
| **Passing only `state.messages[0]`** | Agent loses tool search results on loop 2 | Spread the whole array: `[systemMsg, ...state.messages]`. |
| **Groq 429 Rate Limit (TPM exceeded)** | `Rate limit reached on tokens per minute` | Switch model from `gpt-oss-120b` (8k TPM) to `gpt-oss-20b` and set Tavily `maxResults: 2`. |
| **Missing `TAVILY_API_KEY` in `.env`** | `500 Server Error` on prebuilt route | Add free Tavily API key from [app.tavily.com](https://app.tavily.com). |
| **`response.text` vs `response.content`** | Returns `undefined` | Native `@google/genai` returns `.text`. LangChain returns `.content`. |

---

## 10. SDK vs LangChain vs LangGraph Comparison

| Feature | Native SDK (`@google/genai`) | LangChain (`@langchain/*`) | LangGraph (`@langchain/langgraph`) |
| :--- | :--- | :--- | :--- |
| **Architecture** | Single-call script | Chains & sequential pipelines | Stateful cyclic graphs with loops |
| **State Management** | Manual variables | Memory buffers | State channels (`Annotation`, `MessagesAnnotation`) |
| **Tool Calling** | Manual parsing & dispatch | `.bindTools()` support | First-class `ToolNode` + conditional edge loops |
| **Vendor Portability** | Locked to Google | Provider-agnostic | Provider-agnostic |
| **Best Used For** | Lightweight scripts | Simple prompt & response | Production autonomous agents & workflows |
