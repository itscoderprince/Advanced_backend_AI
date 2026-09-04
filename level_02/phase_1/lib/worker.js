import dotenv from "dotenv";
dotenv.config({ quiet: true });

import { Worker } from "bullmq";
import Redis from "ioredis";
import sendEmail from "./sendEmail.js";

const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log(`\n⚙️ [Worker] Job #${job.id} started for: ${job.data.email}`);
    await sendEmail(job.data.email);
    console.log(`✅ [Worker] Job #${job.id} completed! Email sent.\n`);
  },
  { connection }
);

worker.on("ready", () => {
  console.log("👷 Worker is listening for jobs on 'emailQueue'...");
});

worker.on("failed", (job, err) => {
  console.error(`❌ [Worker] Job #${job.id} failed:`, err.message);
});