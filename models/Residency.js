const mongoose = require("mongoose");

const ResidencySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    facilities: {
      type: Object, // JSON-equivalent structure
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      ref: "User", // Reference to the User model
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Ensure unique combination of address and userEmail
ResidencySchema.index({ address: 1, userEmail: 1 }, { unique: true });

module.exports = mongoose.model("Residency", ResidencySchema);
