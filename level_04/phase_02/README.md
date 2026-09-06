# Level 04 — Phase 02: Advanced AI, RAG & Agent Architecture 🚀

Welcome to **Phase 02** of Level 04!

In this phase, we build **RAG (Retrieval-Augmented Generation)**, structured outputs, streaming, and advanced multi-agent workflows.

---

## 🧠 RAG (Retrieval-Augmented Generation) Architecture

```
                                  [ KNOWLEDGE BASE ]
                                           │
                                ┌──────────┴──────────┐
                                ▼                     ▼
                       Seed Company Docs        POST /rag/add
                                │                     │
                                └──────────┬──────────┘
                                           │
                                           ▼
                            GoogleGenerativeAIEmbeddings
                             (models/gemini-embedding-001)
                                           │
                                           ▼
                                 [ In-Memory Vector Store ]
                                  (Docs + 3072-dim Vectors)
                                           │
                                           │ Cosine Similarity
                                           ▼
   User Question ──► Embed Query ──► Top Matching Context
                                           │
                                           ▼
                              Augmented System Prompt
                        ("Answer using ONLY this context...")
                                           │
                                           ▼
                                  ChatGroq (gpt-oss-20b)
                                           │
                                           ▼
                                Grounded, Factual Answer!
```

---

## 📡 API Endpoints

| Method & Route | Purpose | Sample Request Body | Sample Response |
| :--- | :--- | :--- | :--- |
| `GET /` | Health check & Vector Store status | *None* | `{"message": "...", "documentsInVectorStore": 4}` |
| `POST /ai` | Standard LLM (Without RAG) | `{"prompt": "How much does Antigravity AI Pro cost?"}` | Generic/hallucinated answer |
| `POST /rag/ask` | RAG Query with retrieved context | `{"question": "How much does Antigravity AI Pro cost?"}` | `{"answer": "Antigravity AI Pro costs $49/month", "similarityScore": "0.8182"}` |
| `POST /rag/add` | Ingest new document into Vector Store | `{"text": "Office Wi-Fi password is FalconSecure99."}` | `{"success": true, "documentId": 5}` |

---

## 🎯 Phase 02 Progress Checklist

- [x] **Embeddings Generation:** Google `models/gemini-embedding-001` converting text into 3072-dimensional vector arrays
- [x] **In-Memory Vector Store:** Document storage with pre-computed vector embeddings
- [x] **Cosine Similarity Engine:** Mathematical vector similarity matching
- [x] **RAG Retrieval & Prompt Augmentation (`POST /rag/ask`):** Finding top context and injecting into LLM
- [x] **Dynamic Document Ingestion (`POST /rag/add`):** Real-time embedding and vector store updates
- [ ] **Document Chunking & Text Splitters:** Handling large files and PDFs (`RecursiveCharacterTextSplitter`)
- [ ] **Structured Outputs (Zod):** Enforcing strict JSON output schemas via `llm.withStructuredOutput()`
- [ ] **Token Streaming & SSE:** Real-time token streaming to clients using Server-Sent Events
- [ ] **Persistent Vector Database:** Pinecone / Chroma / pgvector storage
- [ ] **Multi-Agent Systems:** Specialized subagents collaborating under a supervisor agent
