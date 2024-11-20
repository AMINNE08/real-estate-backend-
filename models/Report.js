const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    reportedPropertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property", 
      required: true,
    },
    description: {
      type: String,
      required: true, 
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"], 
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);
