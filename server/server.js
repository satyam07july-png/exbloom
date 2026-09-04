// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: allow all origins & methods (Vercel, localhost, mobile, everywhere)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json()); // JSON body parser

// test route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "NexBloom API is live & running" });
});

app.use("/api/products", require("./routes/product"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/upload", require("./routes/upload"));

app.listen(PORT, () => {
  console.log(`Backend chal raha hai: http://localhost:${PORT}`);
  connectDB();
});