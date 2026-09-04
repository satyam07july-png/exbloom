const express = require("express");
const router = express.Router();
const Product = require("../models/product");

const defaultFallbackProducts = [
  {
    _id: "65d8a1",
    name: "Nexbloom Premium Table Tissue Napkins",
    category: "Tissue Paper",
    price: 129,
    image: "/redefine-tissue-box.webp",
    tagline: "Soft, highly absorbent 2-ply dinner & table napkins.",
    description: "Crafted from 100% natural virgin wood pulp. Embossed texture for maximum absorbency, skin-friendly, and food-safe certified.",
    specs: ["2-Ply Ultra Soft", "100% Virgin Wood Pulp", "Food Contact Safe Certified", "Lint-Free & Hypoallergenic"],
    ply: "2-Ply",
    material: "Virgin Wood Pulp",
    stock: 120,
    variants: [
      { size: "Pack of 2 (200 Sheets)", price: 129, stock: 50, unitWeight: "100 Sheets / Pack" },
      { size: "Pack of 4 (400 Sheets)", price: 239, stock: 40, unitWeight: "100 Sheets / Pack" },
      { size: "Pack of 8 (800 Sheets)", price: 449, stock: 30, unitWeight: "100 Sheets / Pack" },
    ]
  },
  {
    _id: "65d8a2",
    name: "Nexbloom Ultra-Absorb Kitchen Towel Rolls",
    category: "Kitchen Roll",
    price: 179,
    image: "/redefine-kitchen-roll-wide.webp",
    tagline: "3x quick-absorb honeycomb embossed kitchen rolls.",
    description: "Tough when wet, wipes grease, oil, and liquid spills effortlessly. Safe for food wrapping, frying oil drainage, and countertop wiping.",
    specs: ["2-Ply Honeycomb Embossed", "3X Liquid & Oil Absorption", "Certified Food Grade"],
    ply: "2-Ply Extra Thick",
    material: "100% Cellulose Fiber",
    stock: 95,
    variants: [
      { size: "Pack of 2 Rolls (120 Pulls)", price: 179, stock: 40, unitWeight: "60 Pulls / Roll" },
      { size: "Pack of 4 Rolls (240 Pulls)", price: 329, stock: 35, unitWeight: "60 Pulls / Roll" },
    ]
  },
  {
    _id: "65d8a3",
    name: "Nexbloom CloudSoft Toilet Tissue Rolls",
    category: "Toilet Roll",
    price: 199,
    image: "/redefine-toilet-roll-wide.webp",
    tagline: "3-ply velvety soft, quick-dissolve & flushable bathroom rolls.",
    description: "Gentle on sensitive skin with micro-quilted cushioning. Dissolves rapidly in water, preventing pipe clogs in standard drainage & septic systems.",
    specs: ["3-Ply Micro-Quilted Softness", "100% Clog-Safe & Flushable"],
    ply: "3-Ply Luxury Cushion",
    material: "Organic Virgin Pulp",
    stock: 140,
    variants: [
      { size: "Pack of 4 Rolls", price: 199, stock: 50, unitWeight: "160 Sheets / Roll" },
      { size: "Pack of 6 Rolls", price: 289, stock: 45, unitWeight: "160 Sheets / Roll" },
    ]
  }
];

// GET /api/products -> fetch all products from MongoDB
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().lean();
    if (products && products.length > 0) {
      return res.json(products);
    }
    // If DB is empty, auto-seed or return fallback products
    return res.json(defaultFallbackProducts);
  } catch (err) {
    console.error("Products fetch notice:", err.message);
    // Return fallback instead of 500 error so frontend never breaks
    return res.json(defaultFallbackProducts);
  }
});

// GET /api/products/:id -> single product detail
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const fallback = defaultFallbackProducts.find(p => p._id === req.params.id);
      if (fallback) return res.json(fallback);
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    const fallback = defaultFallbackProducts.find(p => p._id === req.params.id);
    if (fallback) return res.json(fallback);
    res.status(404).json({ error: "Invalid product id" });
  }
});

module.exports = router;