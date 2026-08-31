const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true }, // e.g. "Pack of 2", "Pack of 4", "Pack of 6", "Pack of 12"
  price: { type: Number, required: true },
  stock: { type: Number, default: 20 },
  unitWeight: { type: String }, // e.g. "100 Pulls per box", "200 Sheets per roll"
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // "Tissue Paper", "Kitchen Roll", "Toilet Roll", "Face Tissue"
    price: { type: Number, required: true }, // base price for smallest pack
    image: { type: String, required: true },
    tagline: { type: String },
    description: { type: String },
    specs: [{ type: String }],
    ply: { type: String, default: "2-Ply" },
    material: { type: String, default: "100% Virgin Pulp" },
    variants: [variantSchema],
    stock: { type: Number, default: 50 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);