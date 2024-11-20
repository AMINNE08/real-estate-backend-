const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property", 
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true, 
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled"], 
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
