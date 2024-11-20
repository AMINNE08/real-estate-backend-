const mongoose = require("mongoose");

const AgentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
      unique: true,
    },
    professionalCardNumber: {
      type: String, 
      required: true,
      unique: true,
    },
    phone: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^(\+213|0)(5|6|7)\d{8}$/.test(v);
          },
          message: (props) => `${props.value} is not a valid Algerian phone number!`,
        },
      },
    bio: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agent", AgentSchema);
