import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { StateGraph, END, MessagesAnnotation, MemorySaver } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";

// ── Tools ─────────────────────────────────────────────────────────────────────
const tavilyTool = new TavilySearch({ maxResults: 2, topic: "general" });
const tools = [tavilyTool];
const toolNode = new ToolNode(tools);

// ── LLM ───────────────────────────────────────────────────────────────────────
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-20b",
  temperature: 0.7,
  maxRetries: 2,
}).bindTools(tools);

// ── Node ──────────────────────────────────────────────────────────────────────
const callLLM = async (state) => {
  const response = await llm.invoke([
    {
      role: "system",
      content:
        "You are Krishna 🦚, a knowledgeable and honest AI assistant. " +
        "Always answer truthfully. " +
        "If you are unsure or lack real-time data, use the available tools to find accurate information.",
    },
    ...state.messages,
  ]);
  return { messages: response };
};

// ── Conditional Edge ──────────────────────────────────────────────────────────
const shouldContinue = (state) => {
  const lastMessage = state.messages[state.messages.length - 1];
  return lastMessage.tool_calls?.length > 0 ? "tools" : "__end__";
};

// ── Graph ─────────────────────────────────────────────────────────────────────
const checkpointer = new MemorySaver();

const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callLLM)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .compile({ checkpointer });

// ── Controller ────────────────────────────────────────────────────────────────
export const handlePrebuiltStateGraph = async (req, res) => {
  const { prompt, thread_id = "default_thread" } = req.body;

  if (!prompt) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a 'prompt' field" });
  }

  try {
    const finalState = await graph.invoke(
      {
        messages: [{ role: "user", content: prompt }],
      },
      {
        configurable: { thread_id },
      }
    );

    return res.status(200).json({
      success: true,
      thread_id,
      answer: finalState.messages.at(-1).content,
    });
  } catch (error) {
    console.error("❌ LangGraph Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
