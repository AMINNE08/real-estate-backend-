const Favorite = require("../models/Favorites");
const Property = require("../models/Propertie");
const User = require("../models/User");

// Get all favorites for a user
const getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userID: req.params.userID })
      .populate("propertyID") // Optionally fetch property details
      .populate("userID"); // Optionally fetch user details
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a property to favorites
const addFavorite = async (req, res) => {
  try {
    const { userID, propertyID } = req.body;

    // Ensure the property exists
    const propertyExists = await Property.findOne({ propertyID });
    if (!propertyExists) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Ensure the user exists
    const userExists = await User.findOne({ userID });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the favorite already exists
    const favoriteExists = await Favorite.findOne({ userID, propertyID });
    if (favoriteExists) {
      return res.status(400).json({ message: "Favorite already exists" });
    }

    const newFavorite = new Favorite({ favoriteID: Date.now(), userID, propertyID });
    const savedFavorite = await newFavorite.save();
    res.status(201).json(savedFavorite);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remove a favorite by ID
const removeFavorite = async (req, res) => {
  try {
    const deletedFavorite = await Favorite.findOneAndDelete({ favoriteID: req.params.id });
    if (!deletedFavorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }
    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUserFavorites,
  addFavorite,
  removeFavorite,
};
