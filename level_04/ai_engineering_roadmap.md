# 🤖 AI Engineering Roadmap — Your Progress Checklist

> Based on your actual codebase: [`level_04/phase_01/index.js`](file:///w:/AI%20Projects/level_04/phase_01/index.js)
> ✅ = Learned & Coded it | ⬜ = Next to Learn

---

## 🟢 BASIC — Foundation (Level 04 Complete)

### Environment & Project Setup
- [x] `dotenv` — Load secrets from `.env` (`process.env.GROQ_API_KEY`)
- [x] `.gitignore` — Prevent `.env` and `node_modules/` from being pushed to GitHub
- [x] `"type": "module"` in `package.json` — Use `import` instead of `require` (ESM)
- [x] `nodemon` — Auto-restart server on file change (`npm run dev`)

### Express.js Backend
- [x] `express()` — Creating an HTTP server
- [x] `app.use(express.json())` — Parse JSON request bodies
- [x] `app.post("/route", async (req, res) => {})` — Create POST API endpoints
- [x] `req.body` — Read data sent by the client
- [x] `res.status(200).json({})` — Send structured JSON responses
- [x] `res.status(400)` / `res.status(500)` — Proper HTTP error codes
- [x] Input validation (`if (!input) return res.status(400)...`)
- [x] `try / catch` — Error handling to prevent server crashes
- [x] `app.listen(PORT, () => {})` — Start the server on a port

### AI Fundamentals
- [x] What is an LLM (Large Language Model)?
- [x] What is an API Key and why it must be secret
- [x] What is a `temperature` parameter? (0 = strict, 0.7 = balanced, 1+ = creative)
- [x] What is `maxRetries`? (auto-retry on network failures)

### Direct SDK — `@google/genai` (Step 1)
- [x] `new GoogleGenAI({ apiKey })` — Initialize the client
- [x] `ai.models.generateContent({ model, contents })` — Call the model
- [x] `response.text` — Read the AI output
- [x] `config: { systemInstruction: "..." }` — Set AI persona/rules
- [x] Why `role: "system"` does NOT work inside `contents[]` in the raw Google SDK

---

## 🟡 INTERMEDIATE — LangChain & Prompt Engineering

### LangChain Abstraction (Steps 2 & 3)
- [x] Why use LangChain? (swap any model in 1 line — Gemini → Groq → OpenAI)
- [x] `new ChatGoogleGenerativeAI({ apiKey, model })` — LangChain + Gemini
- [x] `new ChatGroq({ apiKey, model })` — LangChain + Groq
- [x] `llm.invoke(input)` — The universal call method (same for all providers)
- [x] `response.content` — Read output from LangChain (NOT `.text`)
- [x] Variable shadowing bug — Never name AI response `res` (shadows Express `res`)

### Multi-Message Architecture (Step 4) ← Core Production Pattern
- [x] `role: "system"` — Developer-written rules & AI persona (hidden from users)
- [x] `role: "user"` — Dynamic end-user input from `req.body`
- [x] `role: "assistant"` — What it is (past AI responses for chat memory)
- [x] Passing an ARRAY `[{ role, content }, ...]` instead of a plain string
- [x] How `system` prompt controls AI behavior (your translate-to-French vs Hindi experiment)
- [x] Few-Shot Prompting (giving examples inside the system prompt to guide the model)

### Prompt Engineering Basics
- [x] Writing multi-line system prompts with backtick template strings
- [x] Using numbered rules inside system prompt for strict AI behavior
- [x] Understanding that system prompt is hardcoded in backend — users never see it

### Groq / LPU Concept
- [x] What is Groq? (LPU — Language Processing Unit, 500+ tokens/sec)
- [x] Open-source models via Groq (`openai/gpt-oss-120b`, Llama, etc.)
- [x] When to prefer Groq over Gemini (speed vs. quality trade-off)

---

## 🔴 ADVANCED — Next Topics to Learn

### Structured Outputs (Most Important Next Step)
- [x] `zod` schema library — Define exact data validation shapes (`z.object({...})`) & backend validation
- [ ] `llm.withStructuredOutput(schema)` — Force the model to always return valid JSON matching Zod schema
- [ ] No more manually parsing strings — AI returns a real typed JS object
- [ ] Real use case: Save AI response directly to a database

### Streaming (How ChatGPT types word-by-word)
- [ ] `llm.stream(input)` — Stream tokens as they are generated
- [ ] Server-Sent Events (SSE) — Push tokens to the frontend in real-time
- [ ] `res.setHeader("Content-Type", "text/event-stream")` — SSE endpoint in Express

### Memory & Chat History (Multi-Turn Conversations)
- [x] Session management — Associate chat history with a `thread_id` via `configurable: { thread_id }`
- [x] In-Memory Checkpointing — `MemorySaver` in LangGraph auto-saves & restores message history per thread
- [ ] Storing `[{ role, content }]` arrays in an external database (Redis / PostgreSQL)
- [ ] `ConversationBufferMemory` in legacy LangChain

### RAG — Retrieval-Augmented Generation (Teach AI Your Own Data)
- [x] What is a Vector Database? (Connected and queried cloud Qdrant vector database via `@langchain/qdrant`)
- [x] What is an Embedding? (Converting text chunks into 3072-dimensional dense vector numbers)
- [x] `GoogleGenerativeAIEmbeddings` — Generated embeddings via Gemini (`gemini-embedding-001`)
- [x] Parsing & Chunking PDFs (`pdf-parse` + `RecursiveCharacterTextSplitter` with `chunkOverlap`)
- [x] Full Production RAG Pipeline: Embed → Store in Qdrant → Similarity Search → Context Injection → Grounded Generation

### Tool Calling / Function Calling (This Makes It an "AGENT")
- [x] `llm.bindTools([tool1, tool2])` — Give the AI "hands" to call external/backend tools (Groq + TavilySearch)
- [x] `ToolNode` from `@langchain/langgraph/prebuilt` — Prebuilt node to auto-execute tool calls
- [x] Web Search Tool Integration — Real-time web retrieval via `@langchain/tavily` (`TavilySearch`)
- [x] AI decides WHEN to call a tool vs. when to answer directly (Dynamic routing based on `tool_calls`)
- [x] Rate Limit & Token Tuning for Tools — Optimized Groq TPM limits via model selection & `maxResults`
- [ ] Defining a custom `tool()` in LangChain with a schema, name, and custom async function
- [ ] Real use case: AI calls custom database / business logic tool (`checkOrderStatus()` or `searchDatabase()`)

### LangChain Agents & Chains
- [x] What is an Agent? (LLM that loops: Think → Act → Observe → Repeat)
- [x] LangGraph — Build cyclic multi-step agent workflows as a graph (`StateGraph`, `addNode`, `addEdge`, `compile`)
- [x] LangGraph Custom State — Defining custom state channels with `Annotation.Root()`
- [x] LangGraph Prebuilt State — Chat-driven flow with `MessagesAnnotation` and automatic message reducer
- [x] Conditional Edges — Dynamic routing with `addConditionalEdges("agent", shouldContinue)`
- [ ] What is a Chain? (sequence of LLM calls via LCEL / RunnableSequence)
- [ ] `createReactAgent()` — ReAct pattern (Reason + Act)
- [ ] Multi-Agent systems (one AI calls another AI)

### Security & Production Hardening
- [ ] Prompt Injection attacks — Users trying to override system prompts
- [ ] Rate limiting with `express-rate-limit` — Prevent API abuse
- [ ] Input sanitization before sending to AI
- [ ] Token usage tracking — Know how much each request costs

### Observability & Monitoring
- [ ] LangSmith — Trace every LLM call, see inputs/outputs, debug failures
- [ ] Token cost tracking (`usage.promptTokens`, `usage.completionTokens`)
- [ ] Logging middleware in Express for every AI request

### Deployment
- [ ] Dockerizing your Node.js AI server
- [ ] Deploying to Railway / Render / AWS
- [ ] Environment variable management in cloud (not `.env` files)
- [ ] CI/CD pipeline — Auto-deploy when you push to GitHub

---

## 📊 Overall Progress

| Level | Topics | Done | Remaining |
| :--- | :---: | :---: | :---: |
| 🟢 **Basic** | 23 | **23** | 0 |
| 🟡 **Intermediate** | 19 | **19** | 0 |
| 🔴 **Advanced** | 42 | **18** | 24 |
| **Total** | **84** | **60** | **24** |

```
Progress: ████████████████████████░░░░░░  60 / 84 topics (71%)
```

> [!TIP]
> **Recommended Next Step:** Start with **Structured Outputs (Zod)** — it is the most immediately useful advanced skill and pairs naturally with your LangGraph agents to enforce structured JSON responses.

> [!NOTE]
> **Then move to:** Streaming → Persistent Memory (Redis / DB) → Custom Tools → RAG → Multi-Agent
> This builds directly upon the LangGraph foundation you now have running.
