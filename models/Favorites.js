const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema(
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
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Favorite", FavoriteSchema);
