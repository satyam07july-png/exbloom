const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    inquiryType: { type: String, default: "Household / Personal Order" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "in_progress", "responded", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Query", querySchema);
