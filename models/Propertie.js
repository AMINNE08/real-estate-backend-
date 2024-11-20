const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
      enum: ["apartment", "house", "villa", "land", "building", "studio", "store"], 
    },
    address: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, 
    },
    category: {
      type: String,
      required: true,
      enum: ["buy", "rent"], 
    },
    features: {
      type: [String], 
      default: [], 
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      required: true,
      enum: ["available", "sold", "rented"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", PropertySchema);
