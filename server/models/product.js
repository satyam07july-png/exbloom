const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true }, // e.g. "Pack of 2 (200 Sheets)", "Pack of 4"
  price: { type: Number, required: true }, // Selling / Discounted Price
  mrp: { type: Number, default: 0 }, // Original Price before discount
  stock: { type: Number, default: 20 },
  unitWeight: { type: String, default: "" }, // e.g. "100 Sheets / Pack"
  pulls: { type: String, default: "" }, // e.g. "100 Pulls"
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // "Tissue Paper", "Kitchen Roll", "Toilet Roll", "Face Tissue"
    price: { type: Number, required: true }, // Selling / Discounted Price (Discount ke baad ka amount)
    mrp: { type: Number, default: 0 }, // Original Price / MRP (Discount se pehle ka amount)
    image: { type: String, required: true }, // Primary / Main Image
    images: [{ type: String }], // Array of Multiple Images
    videos: [{ type: String }], // Array of Multiple Videos
    pullsCount: { type: String, default: "" }, // e.g. "100 Pulls / Box", "200 Sheets / Roll"
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    specs: [{ type: String }],
    ply: { type: String, default: "2-Ply" },
    material: { type: String, default: "100% Virgin Pulp" },
    variants: [variantSchema],
    stock: { type: Number, default: 50 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);