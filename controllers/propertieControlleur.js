const Property = require("../models/Propertie"); 

// Get all properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single property by ID
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findOne({ propertyID: req.params.id });
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new property
const createProperty = async (req, res) => {
  try {
    const newProperty = new Property(req.body);
    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a property by ID
const updateProperty = async (req, res) => {
  try {
    const updatedProperty = await Property.findOneAndUpdate(
      { propertyID: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedProperty) return res.status(404).json({ message: "Property not found" });
    res.status(200).json(updatedProperty);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a property by ID
const deleteProperty = async (req, res) => {
  try {
    const deletedProperty = await Property.findOneAndDelete({ propertyID: req.params.id });
    if (!deletedProperty) return res.status(404).json({ message: "Property not found" });
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
