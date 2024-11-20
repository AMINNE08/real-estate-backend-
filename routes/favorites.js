const express = require("express");
const router = express.Router();
const {
  getUserFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favoritesControlleur"); 

// Routes
router.get("/:userID", getUserFavorites); // Get all favorites for a specific user
router.post("/", addFavorite); // Add a new favorite
router.delete("/:id", removeFavorite); // Remove a favorite by ID

module.exports = router;
