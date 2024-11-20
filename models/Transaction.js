const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    propertyID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Property",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    transactionType: {
      type: String,
      required: true,
      enum: ["buy", "rent", "deposit", "refund"], 
    },
    status: {
      type: String,
      required: true,
      enum: ["completed", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
