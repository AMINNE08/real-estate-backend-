const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  messageID: {
    type: Number,
    required: true,
    unique: true,
  },
  senderID: {
    type: mongoose.Schema.Types.Number, 
    required: true,
    ref: "User", 
  },
  receiverID: {
    type: mongoose.Schema.Types.Number, 
    required: true,
    ref: "User", 
  },
  propertyID: {
    type: mongoose.Schema.Types.Number, 
    ref: "Property", 
    default: null,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
