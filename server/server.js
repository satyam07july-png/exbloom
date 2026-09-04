// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db")

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: allow all origins (works on Vercel, localhost, mobile, everywhere)
app.use(cors({ origin: "*", credentials: false }));

app.use(express.json()); // JSON body parse karo

// test route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Groove Supply Co. API is running" });
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