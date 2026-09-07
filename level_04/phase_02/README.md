# Level 04 — Phase 02: Advanced AI, RAG & Vector Databases 🚀

Welcome to **Phase 02** of Level 04!

In this phase, we build a production-grade **RAG (Retrieval-Augmented Generation)** pipeline backed by **Qdrant Cloud Vector Database**, Google Gemini Embeddings, and Groq LPUs.

---

## 🧠 Complete RAG Architecture

```
                          [ 20-Page Grocery Store PDF ]
                                       │
                                       ▼ (pdf-parse)
                               Raw Text Stream
                                       │
                                       ▼ (RecursiveCharacterTextSplitter)
                           50 Document Chunks
                         (chunkSize: 1000, overlap: 200)
                                       │
                                       ▼ (GoogleGenerativeAIEmbeddings: gemini-embedding-001)
                           3072-Dimensional Vectors
                                       │
                                       ▼
                       [ Qdrant Cloud Vector Database ]
                       (Collection: 'grocery_store')
                                       │
                                       │ similaritySearch(prompt, 5)
                                       ▼
User Prompt ──────────► Top 5 Retrieved Document Chunks
                                       │
                                       ▼
                           Augmented System Prompt
                  ("Answer strictly using ONLY this context...")
                                       │
                                       ▼
                             ChatGroq (gpt-oss-20b)
                                       │
                                       ▼
                            100% Grounded AI Answer!
```

---

## 📡 API Endpoints

| Method & Route | Purpose | Sample Request Body | Sample Response |
| :--- | :--- | :--- | :--- |
| `GET /` | Health check & Server Status | *None* | `{"message": "🚀 Level 04 — Phase 02 Server is Live!"}` |
| `POST /ai` | Production RAG Endpoint | `{"prompt": "Which snacks are available and what are their prices?"}` | `{"success": true, "answer": "Salted Peanuts (Rs 69), Potato Chips (Rs 30)..."}` |

---

## 🎯 Phase 02 Progress Checklist

- [x] **PDF Document Parsing (`pdf-parse`):** Extracting raw text from complex multi-page PDF catalogs
- [x] **Recursive Text Splitting (`@langchain/textsplitters`):** Dividing documents into 1000-character chunks with 200-character overlap
- [x] **Dense Vector Embeddings (`@langchain/google-genai`):** Generating 3072-dim embeddings via `gemini-embedding-001`
- [x] **Cloud Vector Database (`@langchain/qdrant`):** Connected to remote Qdrant cluster for persistent vector indexing
- [x] **Vector Similarity Search:** Querying Qdrant for top-K matching chunks
- [x] **Production Anti-Hallucination Guardrail:** `<context>` isolation + strict negative response rules
- [x] **Grounded LLM Generation:** Ultra-fast sub-second answers using Groq LPU (`openai/gpt-oss-20b`)
- [ ] **Structured Outputs (Zod):** Enforcing strict JSON output schemas via `llm.withStructuredOutput()`
- [ ] **Token Streaming & SSE:** Real-time token streaming to clients using Server-Sent Events
- [ ] **Multi-Agent Systems:** Specialized subagents collaborating under a supervisor agent
