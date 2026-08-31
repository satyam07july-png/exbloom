// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db")

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: allow Vercel frontend in prod, localhost in dev
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.CLIENT_URL, // e.g. https://nexbloom.vercel.app
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS: Origin not allowed — " + origin));
  },
  credentials: true,
}));

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