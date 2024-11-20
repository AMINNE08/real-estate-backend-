const express = require("express");
const router = express.Router();
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertieControlleur"); 

// Routes
router.get("/", getAllProperties); // Get all properties
router.get("/:id", getPropertyById); // Get property by ID
router.post("/", createProperty); // Create a new property
router.put("/:id", updateProperty); // Update property by ID
router.delete("/:id", deleteProperty); // Delete property by ID

module.exports = router;
