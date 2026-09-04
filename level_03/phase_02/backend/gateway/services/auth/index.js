import express from "express";
import dotenv from "dotenv";

dotenv.config({quiet:true});
const PORT = process.env.PORT || 1000;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    service: "🔒 Auth Service",
    status: "active",
    port: PORT,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Auth Server is running on http://localhost:${PORT}`);
});
