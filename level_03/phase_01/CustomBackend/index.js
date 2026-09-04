import express from "express";

const app = express();
const PORT = process.env.PORT || 2000;

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Request handled successfully",
    server: "Server 4 (CustomBackend)",
    port: PORT,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 server is running on PORT: ${PORT}`);
});
