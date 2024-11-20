const Transaction = require("../models/Transaction");
const Property = require("../models/Propertie");
const User = require("../models/User");

// Get all transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("userID")
      .populate("propertyID"); 
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ transactionID: req.params.id })
      .populate("userID")
      .populate("propertyID");
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new transaction
const createTransaction = async (req, res) => {
  try {
    const { userID, propertyID, amount } = req.body;

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

    const newTransaction = new Transaction({
      transactionID: Date.now(),
      userID,
      propertyID,
      amount,
      status: "pending",
    });
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update transaction status by ID
const updateTransactionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["completed", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { transactionID: req.params.id },
      { status },
      { new: true }
    );

    if (!updatedTransaction) return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json(updatedTransaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a transaction by ID
const deleteTransaction = async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findOneAndDelete({ transactionID: req.params.id });
    if (!deletedTransaction) return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionStatus,
  deleteTransaction,
};
