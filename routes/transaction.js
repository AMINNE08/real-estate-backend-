const express = require("express");
const router = express.Router();
const {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionStatus,
  deleteTransaction,
} = require("../controllers/transactionControlleur"); // Adjust path as needed

// Routes
router.get("/", getAllTransactions); // Get all transactions
router.get("/:id", getTransactionById); // Get a transaction by ID
router.post("/", createTransaction); // Create a new transaction
router.put("/:id", updateTransactionStatus); // Update transaction status
router.delete("/:id", deleteTransaction); // Delete a transaction by ID

module.exports = router;
