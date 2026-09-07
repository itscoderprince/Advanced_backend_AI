import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import { PDFParse } from "pdf-parse";
import { ChatGroq } from "@langchain/groq";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

dotenv.config({ quiet: true });

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

// ─── 1. LLM Client ───────────────────────────────────────────────────────────
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-20b",
  temperature: 0.7,
  maxRetries: 2,
});

// ─── 2. Embeddings ───────────────────────────────────────────────────────────
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-embedding-001",
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
});

// ─── 3. Vector Store (Qdrant Cloud) ──────────────────────────────────────────
const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  collectionName: "grocery_store",
});

// ─── 4. PDF Ingestion & Text Chunking ────────────────────────────────────────
const loadAndSplitPDF = async (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: fileBuffer });
  const { text } = await parser.getText();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.createDocuments([text]);
  await vectorStore.addDocuments(docs);
  return docs;
};

// loadAndSplitPDF("./grocery_store.pdf");

// ─── 5. Health Check ─────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "🚀 Level 04 — Phase 02 Server is Live!",
  });
});

// ─── 6. LLM Invoke Endpoint ──────────────────────────────────────────────────
app.post("/ai", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "Please provide a 'prompt' field",
    });
  }

  try {
    const docs = await vectorStore.similaritySearch(prompt, 5);
    const context = docs.map((d) => d.pageContent).join("\n\n");

    const response = await llm.invoke([
      {
        role: "system",
        content:
          "You are a helpful and accurate assistant.\n" +
          "Answer the user's question using ONLY the provided context below.\n\n" +
          "Rules:\n" +
          "- Rely strictly on the facts in the context. Never invent or assume details.\n" +
          "- If the answer is not in the context, reply: 'I cannot find that information in the provided document.'\n" +
          "- Keep your answer factual, direct, and concise.\n\n" +
          `<context>\n${context}\n</context>`,
      },
      {
        role: "user",
        content: prompt,
      },
    ]);

    return res.status(200).json({
      success: true,
      answer: response.content,
    });

  } catch (error) {
    console.error("❌ LLM Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ─── 7. Start Server ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server is running on: http://localhost:${PORT}`);
});
