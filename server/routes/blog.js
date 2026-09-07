const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");

// GET /api/blogs -> list of blogs
router.get("/", async (req, res) => {
  try {
    const { all } = req.query;
    const filter = all === "true" ? {} : { published: true };
    const blogs = await Blog.find(filter).sort({ createdAt: -1 }).lean();
    return res.status(200).json(blogs || []);
  } catch (err) {
    console.error("Blogs fetch notice:", err.message);
    return res.status(200).json([]);
  }
});

// GET /api/blogs/:id -> single blog
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    return res.status(200).json(blog);
  } catch (err) {
    return res.status(404).json({ error: "Invalid blog id" });
  }
});

// POST /api/blogs -> create new blog
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const now = new Date();
    const day = req.body.day || now.getDate().toString().padStart(2, "0");
    const month = req.body.month || now.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const date = req.body.date || `${day} ${month} ${now.getFullYear()}`;

    // Calculate approximate read time if not provided
    const words = content.trim().split(/\s+/).length;
    const computedReadTime = req.body.readTime || `${Math.max(1, Math.ceil(words / 200))} min read`;

    const newBlog = new Blog({
      title: req.body.title.trim(),
      category: req.body.category || "Daily Hygiene",
      summary: req.body.summary ? req.body.summary.trim() : content.substring(0, 160).trim() + "...",
      content: req.body.content.trim(),
      author: req.body.author ? req.body.author.trim() : "NexBloom Team",
      image: req.body.image || "/nexbloom-living-room-tissue.webp",
      readTime: computedReadTime,
      published: req.body.published !== undefined ? req.body.published : true,
      day,
      month,
      date,
      commentsCount: 0,
    });

    const saved = await newBlog.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error("Create blog error:", err.message);
    return res.status(500).json({ error: err.message || "Failed to create blog" });
  }
});

// PUT /api/blogs/:id -> update blog
router.put("/:id", async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Blog not found" });
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Update blog error:", err.message);
    return res.status(500).json({ error: err.message || "Failed to update blog" });
  }
});

// DELETE /api/blogs/:id -> delete blog
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Blog not found" });
    return res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Delete blog error:", err.message);
    return res.status(500).json({ error: err.message || "Failed to delete blog" });
  }
});

module.exports = router;
