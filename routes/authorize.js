const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authmiddleware");
const { authorizeRole } = require("../middlewares/authorizeRole");

// Admin-only route (requires the user to be an admin)
router.post("/admin", authenticate, authorizeRole("admin"), (req, res) => {
  res.send("Admin action performed!");
});

module.exports = router;
