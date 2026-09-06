# Advanced Backend & AI Engineering Series 🚀

This repository contains practical implementations and learning phases covering modern backend architecture, containerization, caching, and background job processing.

---

## 📂 Project Structure

### 🔹 Level 01: Docker & Containerization
- **Phase 01:** Single service containerization with Node.js & Express using lightweight Alpine images.
- **Phase 02:** Multi-container orchestration using **Docker Compose**:
  - `backend` (Express.js)
  - `frontend` (React + Vite)
  - `redis` container

### 🔹 Level 02: Redis & Background Workers
- **MongoDB Atlas Integration:** Direct replica set connections bypassing DNS SRV network constraints.
- **Redis Caching (`ioredis`):**
  - Cache-aside pattern (`redis.get` / `redis.set` with TTL `EX`).
  - Cache invalidation (`redis.del`) on database mutations.
- **Redis OTP Service:**
  - Fast, temporary storage of one-time passwords (`otp:<email>`) with 60s auto-expiration.
- **Redis Rate Limiter:**
  - IP-based sliding window rate limiter middleware (`redis.incr` & `redis.expire`).
### 🔹 Level 03: System Design & Scaling
- **Phase 01:** Nginx Reverse Proxy & Round-Robin Load Balancing across multiple Node.js backend instances.
- **Phase 02:** API Gateway & Microservices architecture.

### 🔹 Level 04: AI, LLM & Agent Engineering
- **Phase 01:**
  - Direct SDK vs. LangChain abstraction (`@google/genai`, `@langchain/google-genai`, `@langchain/groq`).
  - Multi-message prompt engineering (system persona, user input, few-shot translation).
  - LangGraph Cyclic Agents: Custom state (`Annotation.Root`) & Prebuilt chat state (`MessagesAnnotation`).
  - Tool Calling (`ToolNode` + `TavilySearch`) and dynamic routing (`shouldContinue`).
  - Conversational memory & checkpointing (`MemorySaver` + `thread_id`).
- **Phase 02:** Advanced Agent Architecture, Structured Outputs (Zod), Streaming (SSE), Persistent Storage & Multi-Agent systems.

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+)
- [Docker Desktop](https://www.docker.com/)

### Running Redis locally with Docker
```bash
cd level_02
docker compose up -d
```

### Starting the Level 02 Server & Worker
```bash
cd level_02/phase_1

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Fill in your MONGO_URI in .env

# Terminal 1: Run Express API Server
npm run dev

# Terminal 2: Run BullMQ Background Worker
npm run worker
```
