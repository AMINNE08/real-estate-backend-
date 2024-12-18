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
    propertyType,
    status = "available", // Default to available
  } = data;


  if (!["Rent", "Buy"].includes(propertyType)) {
    return res.status(400).json({ message: "Invalid propertyType. Use 'Rent' or 'Buy'." });
  }

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
      propertyType,
      status ,
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
    const residencies = await Residency.find().sort({ createdAt: -1 });

    // Ensure the structure matches the expected format
    const sanitizedResidencies = residencies.map((residency) => ({
      ...residency._doc, // Spread the original object
      propertyType: residency.propertyType?.trim(), // Trim any stray spaces
    }));

    res.status(200).json(sanitizedResidencies);
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


exports.updateResidencyStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["available", "sold"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    const residency = await Residency.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!residency) {
      return res.status(404).json({ message: "Residency not found." });
    }

    res.status(200).json({ message: "Status updated successfully", residency });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
