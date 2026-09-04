import express from "express";

const app = express();
const PORT = 3000;
const SERVER_NAME = process.env.SERVER_NAME || "Default-Server";

app.get("/", (req, res) => {
  console.log(`[REQUEST RECEIVED] Handled by ${SERVER_NAME}`);
  return res.status(200).json({
    message: "Request handled successfully",
    server: SERVER_NAME,
    port: PORT,
  });
});

app.listen(PORT, () => {
  console.log(`⚡ ${SERVER_NAME} is active on internal port ${PORT}`);
});
