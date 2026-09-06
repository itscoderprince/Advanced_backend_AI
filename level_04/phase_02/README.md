# Level 04 — Phase 02: Advanced AI & Agent Architecture 🚀

Welcome to **Phase 02** of Level 04!

In Phase 01, we mastered the core foundations:
- Native Google GenAI SDK (`@google/genai`)
- LangChain Abstraction (`@langchain/google-genai`, `@langchain/groq`)
- Prompt Engineering (System, User, Few-Shot)
- LangGraph Custom State (`Annotation.Root`)
- LangGraph Prebuilt State (`MessagesAnnotation`)
- Tool Calling (`ToolNode` + `TavilySearch`)
- Conversational Memory (`MemorySaver` + `thread_id`)

---

## 🎯 Phase 02 Learning Goals

- [ ] **Structured Outputs (Zod):** Enforce strict JSON output schemas via `llm.withStructuredOutput()`
- [ ] **Token Streaming & SSE:** Real-time token streaming to clients using Server-Sent Events
- [ ] **Persistent Memory:** Production session storage in Redis / PostgreSQL (moving beyond in-memory checkpointers)
- [ ] **Custom Tools:** Writing domain-specific tools with Zod input validation schemas
- [ ] **RAG (Retrieval-Augmented Generation):** Vector databases (Pinecone / Chroma / pgvector) + Embeddings
- [ ] **Multi-Agent Systems:** Specialized subagents collaborating under a supervisor agent
