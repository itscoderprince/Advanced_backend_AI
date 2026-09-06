import { Router } from "express";
import { handleCustomStateGraph } from "../controllers/langGraph.customState.controller.js";
import { handlePrebuiltStateGraph } from "../controllers/langGraph.prebuilt.controller.js";

const router = Router();

// POST /ai/graph/custom   — Step 1: Custom State (Annotation.Root)
router.post("/custom", handleCustomStateGraph);

// POST /ai/graph/prebuilt — Step 2: Prebuilt State (MessagesAnnotation) + Tools
router.post("/prebuilt", handlePrebuiltStateGraph);

export default router;
