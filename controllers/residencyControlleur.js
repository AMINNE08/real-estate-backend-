const Residency = require("../models/Residency");
const asyncHandler = require("express-async-handler");

// Create Residency
exports.createResidency = asyncHandler(async (req, res) => {
  const { data } = req.body; // Extract the nested 'data' object

  if (!data) {
    return res.status(400).json({ message: "Missing 'data' in request body" });
  }

  const {
    title,
    description,
    price,
    address,
    city,
    country,
    facilities,
    image,
    userEmail,
  } = data;

  try {
    const residency = new Residency({
      title,
      description,
      price,
      address,
      city,
      country,
      facilities,
      image,
      userEmail,
    });
    await residency.save();
    res.status(201).json({
      message: "Residency created successfully",
      residency,
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: "A residency with this address already exists." });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
});


// Get All Residencies
exports.getAllResidencies = asyncHandler(async (req, res) => {
  try {
    const residencies = await Residency.find().sort({ createAt: -1 });
    res.status(200).json(residencies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Residency by ID
exports.getResidencyById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const residency = await Residency.findById(id);
    if (!residency) {
      res.status(404).json({ message: "Residency not found." });
      return;
    }
    res.status(200).json(residency);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
