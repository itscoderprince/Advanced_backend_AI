import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";

dotenv.config({ quiet: true });
const PORT = process.env.PORT || 8000;
const GATEWAY_NAME = process.env.GATEWAY_NAME || "API Gateway";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    service: `🌐 ${GATEWAY_NAME}`,
    status: "active",
    port: PORT,
  });
});

// Forward to microservices using Docker container service names
app.use("/auth", proxy("http://auth:1000"));
app.use("/products", proxy("http://products:2000"));
app.use("/orders", proxy("http://orders:3000"));
app.use("/payments", proxy("http://payments:4000"));

app.listen(PORT, () => {
  console.log(`🌐 ${GATEWAY_NAME} is running on http://localhost:${PORT}`);
});
