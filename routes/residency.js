const express = require("express");
const {
  createResidency,
  getAllResidencies,
  getResidencyById,
  updateResidencyStatus,
} = require("../controllers/residencyControlleur");
const { authorizeRole } = require("../middlewares/authorizeRole");

const router = express.Router();

router.post("/create", authorizeRole ,createResidency);
router.get("/allresd", getAllResidencies);
router.get("/:id", getResidencyById);
router.put("/:id/status", updateResidencyStatus);


module.exports = router;
