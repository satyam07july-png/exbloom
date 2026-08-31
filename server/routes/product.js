const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// GET /api/products -> saare products (MongoDB se)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Products fetch karne mein error aaya" });
  }
});

// GET /api/products/:id -> ek product detail
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Invalid product id" });
  }
});

module.exports = router;