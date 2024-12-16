const express = require("express");
const {
  createResidency,
  getAllResidencies,
  getResidencyById,
} = require("../controllers/residencyControlleur");

const router = express.Router();

router.post("/create", createResidency);
router.get("/allresd", getAllResidencies);
router.get("/:id", getResidencyById);

module.exports = router;
