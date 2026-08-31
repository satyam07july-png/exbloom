require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/product");

const sampleProducts = [
  {
    name: "Nexbloom Premium Table Tissue Napkins",
    category: "Tissue Paper",
    price: 129,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=80",
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
      { size: "Bulk Pack of 12 (1200 Sheets)", price: 629, stock: 20, unitWeight: "100 Sheets / Pack" }
    ]
  },
  {
    name: "Nexbloom Ultra-Absorb Kitchen Towel Rolls",
    category: "Kitchen Roll",
    price: 179,
    image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=900&q=80",
    tagline: "3x quick-absorb honeycomb embossed kitchen rolls.",
    description: "Tough when wet, wipes grease, oil, and liquid spills effortlessly. Safe for food wrapping, frying oil drainage, and countertop wiping.",
    specs: ["2-Ply Honeycomb Embossed", "3X Liquid & Oil Absorption", "Certified Food Grade", "Fits all standard roll dispensers"],
    ply: "2-Ply Extra Thick",
    material: "100% Cellulose Fiber",
    stock: 95,
    variants: [
      { size: "Pack of 2 Rolls (120 Pulls)", price: 179, stock: 40, unitWeight: "60 Pulls / Roll" },
      { size: "Pack of 4 Rolls (240 Pulls)", price: 329, stock: 35, unitWeight: "60 Pulls / Roll" },
      { size: "Pack of 6 Rolls (360 Pulls)", price: 469, stock: 25, unitWeight: "60 Pulls / Roll" },
      { size: "Mega Pack of 12 Rolls", price: 879, stock: 15, unitWeight: "60 Pulls / Roll" }
    ]
  },
  {
    name: "Nexbloom CloudSoft Toilet Tissue Rolls",
    category: "Toilet Roll",
    price: 199,
    image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=900&q=80",
    tagline: "3-ply velvety soft, quick-dissolve & flushable bathroom rolls.",
    description: "Gentle on sensitive skin with micro-quilted cushioning. Dissolves rapidly in water, preventing pipe clogs in standard drainage & septic systems.",
    specs: ["3-Ply Micro-Quilted Softness", "100% Clog-Safe & Flushable", "No Bleach & Chemical Free", "Dermatologically Tested"],
    ply: "3-Ply Luxury Cushion",
    material: "Organic Virgin Pulp",
    stock: 140,
    variants: [
      { size: "Pack of 4 Rolls", price: 199, stock: 50, unitWeight: "160 Sheets / Roll" },
      { size: "Pack of 6 Rolls", price: 289, stock: 45, unitWeight: "160 Sheets / Roll" },
      { size: "Pack of 12 Rolls (Value Pack)", price: 549, stock: 30, unitWeight: "160 Sheets / Roll" },
      { size: "Family Box of 24 Rolls", price: 999, stock: 20, unitWeight: "160 Sheets / Roll" }
    ]
  },
  {
    name: "Nexbloom SilkTouch Facial Tissue Boxes",
    category: "Face Tissue",
    price: 149,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80",
    tagline: "Dermatologist-approved featherlight soft facial pulls.",
    description: "Enriched with gentle natural fibers for everyday skincare, makeup removal, and refreshing hygiene. Completely lint-free and irritation-free.",
    specs: ["2-Ply Feather-Soft Sheets", "Dermatologically Tested", "Decorative Modern Box Design", "Odorless & Hypoallergenic"],
    ply: "2-Ply Silk Weave",
    material: "100% Pure Virgin Fibers",
    stock: 110,
    variants: [
      { size: "Pack of 2 Boxes (200 Pulls)", price: 149, stock: 45, unitWeight: "100 Pulls / Box" },
      { size: "Pack of 4 Boxes (400 Pulls)", price: 279, stock: 35, unitWeight: "100 Pulls / Box" },
      { size: "Pack of 6 Boxes (600 Pulls)", price: 399, stock: 25, unitWeight: "100 Pulls / Box" },
      { size: "Cuboid Car Pack of 4 (Cute Boxes)", price: 319, stock: 30, unitWeight: "80 Pulls / Box" }
    ]
  },
  {
    name: "Nexbloom Organic Bamboo Face Wipes & Tissues",
    category: "Face Tissue",
    price: 199,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=80",
    tagline: "100% unbleached natural bamboo fiber facial wipes.",
    description: "Eco-friendly, naturally antibacterial bamboo facial tissue. Tree-free, chlorine-free, and ideal for sensitive and allergy-prone skin.",
    specs: ["100% Organic Bamboo Fiber", "Naturally Antibacterial", "Zero Chlorine / Unbleached", "Plastic-Free Packaging"],
    ply: "3-Ply Bamboo Fiber",
    material: "100% Bamboo",
    stock: 80,
    variants: [
      { size: "Pack of 2 Boxes (200 Sheets)", price: 199, stock: 35, unitWeight: "100 Sheets / Box" },
      { size: "Pack of 4 Boxes (400 Sheets)", price: 369, stock: 25, unitWeight: "100 Sheets / Box" },
      { size: "Pack of 8 Boxes (800 Sheets)", price: 689, stock: 15, unitWeight: "100 Sheets / Box" }
    ]
  },
  {
    name: "Nexbloom Heavy-Duty Multipurpose Kitchen Towels",
    category: "Kitchen Roll",
    price: 219,
    image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=900&q=80",
    tagline: "Extra thick 3-ply heavy spills & kitchen hygiene rolls.",
    description: "High tensile strength wet-wipe kitchen towel designed for tough greasy chimney cleans, stove wiping, and soaking oil from deep-fried snacks.",
    specs: ["3-Ply Ultra Absorbent", "Tear-Resistant When Wet", "Reusable up to 2 times for wiping", "Food Safe Certified"],
    ply: "3-Ply Extra Thick",
    material: "Virgin Cellulose",
    stock: 75,
    variants: [
      { size: "Pack of 2 Jumbo Rolls (160 Pulls)", price: 219, stock: 30, unitWeight: "80 Pulls / Roll" },
      { size: "Pack of 4 Jumbo Rolls (320 Pulls)", price: 399, stock: 25, unitWeight: "80 Pulls / Roll" },
      { size: "Pack of 8 Jumbo Rolls (640 Pulls)", price: 749, stock: 20, unitWeight: "80 Pulls / Roll" }
    ]
  }
];

async function seed() {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);
  console.log("✅ Seed complete! Updated 4 core products with quantity variants in MongoDB.");
  mongoose.connection.close();
}

seed();