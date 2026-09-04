const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// GET /api/products -> saare products (MongoDB se)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().lean();
    return res.status(200).json(products || []);
  } catch (err) {
    console.error("Products fetch notice:", err.message);
    // Return empty array with 200 OK so frontend never crashes or gets 500
    return res.status(200).json([]);
  }
});

// GET /api/products/:id -> ek product detail
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (err) {
    return res.status(404).json({ error: "Invalid product id" });
  }
});

module.exports = router;