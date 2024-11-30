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
      enum: ["user", "admin"], // Limit the roles to "user" or "admin"
      default: "user", // Default role is "user"
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^(\+213|0)(5|6|7)\d{8}$/.test(v); // Algerian phone number validation
        },
        message: (props) => `${props.value} is not a valid Algerian phone number!`,
      },
    },
    profilePicture: {
      type: String,
      default: null, // Optional, default to null if not provided
    },
    // Add the fields for password reset functionality
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
