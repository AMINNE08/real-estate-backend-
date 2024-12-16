const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phone: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    favResidenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Residency",
    },
    bookedVisits: [
      {
        type: Object, // JSON-equivalent structure
      },
    ],
    ownedResidencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Residency",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
