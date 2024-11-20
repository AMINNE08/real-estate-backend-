const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      ref: "User",
    },
    propertyID: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Property",
      default: null,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["sent", "received"], 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
