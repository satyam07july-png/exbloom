const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: "Daily Hygiene" },
    summary: { type: String, default: "" },
    content: { type: String, required: true },
    author: { type: String, default: "NexBloom Team" },
    image: { type: String, default: "/nexbloom-living-room-tissue.webp" },
    readTime: { type: String, default: "3 min read" },
    published: { type: Boolean, default: true },
    day: { type: String, default: () => new Date().getDate().toString().padStart(2, "0") },
    month: { type: String, default: () => new Date().toLocaleString("en-US", { month: "short" }).toUpperCase() },
    date: { type: String, default: () => {
      const now = new Date();
      return `${now.getDate().toString().padStart(2, "0")} ${now.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${now.getFullYear()}`;
    }},
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
