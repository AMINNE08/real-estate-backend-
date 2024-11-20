const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authmiddleware");
const { authorizeRole } = require("../middlewares/authorizeRole");

router.post("/admin-only", authenticate, authorizeRole("admin"), (req, res) => {
  res.send("Admin action performed!");
});

router.get("/user-page", authenticate, authorizeRole("user"), (req, res) => {
  res.send("Welcome, user!");
});

module.exports = router;
