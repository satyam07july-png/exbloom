// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db")

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());          // React se requests allow karega
app.use(express.json());  // JSON body parse karega (POST requests ke liye)

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