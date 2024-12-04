const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authmiddleware");
const { authorizeRole } = require("../middlewares/authorizeRole");

const adminMiddleware = [authenticate,authorizeRole("admin")];

router.post("/admin", adminMiddleware, (req, res) => {
  res.send("Admin action performed!");
});


module.exports = router;
