import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { Annotation, StateGraph, END } from "@langchain/langgraph";

// ── LLM Client ───────────────────────────────────────────────────────────────
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0.7,
  maxRetries: 2,
});

// ════════════════════════════════════════════════════════════════════════
// STEP 1: LANGGRAPH — CUSTOM STATE (Annotation.Root)
// ════════════════════════════════════════════════════════════════════════
// Use this when you need full control over your own state shape.
// You define every field manually using Annotation.Root().
//
// FLOW: START → callLLM → END
//
// KEY RULES:
//   - State fields are plain values (not a messages array)
//   - Each node returns ONLY the fields it wants to update
//   - Read output via `state.aiMsg` (your custom field name)
// ────────────────────────────────────────────────────────────────────────

// Step 1: State — shared data object that flows through every node
const State = Annotation.Root({
  prompt: Annotation, // user input
  aiMsg: Annotation,  // AI response (filled after callLLM runs)
});

// Step 2: Node — receives state, does one job, returns updated fields
const callLLM = async (state) => {
  console.log("Input State:", state); // logs state ENTERING this node
  const response = await llm.invoke([
    {
      role: "system",
      content:
        "You are an assistant and your name is Krishna 🦚. If you don't know the answer, speak truth and say so.",
    },
    {
      role: "user",
      content: state.prompt,
    },
  ]);
  console.log("Updated State:", { prompt: state.prompt, aiMsg: response.content });
  return { aiMsg: response.content }; // LangGraph merges this into state for next node
};

// Step 3: Graph — wire nodes + edges, compile into runnable agent
const graph = new StateGraph(State)
  .addNode("agent", callLLM)      // register the node
  .addEdge("__start__", "agent")  // entry point → first node
  .addEdge("agent", END)          // last node → END
  .compile();                     // lock & build the runnable agent

// Controller: Handles POST /ai/graph/custom
export const handleCustomStateGraph = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "Please provide a 'prompt' field in the body",
    });
  }

  try {
    // Step 4: invoke — run graph, returns final state after all nodes finish
    const finalState = await graph.invoke({ prompt });

    return res.status(200).json({
      success: true,
      provider: "LangGraph — Custom State (Annotation.Root)",
      graphFlow: "START → callLLM → END",
      answer: finalState.aiMsg,
    });
  } catch (error) {
    console.error("❌ LangGraph Custom State Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
