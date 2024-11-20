const express = require("express");
const router = express.Router();
const {
  getUserMessages,
  getMessagesBetweenUsers,
  sendMessage,
  deleteMessage,
} = require("../controllers/messageControlleur"); 

// Routes
router.get("/user/:userID", getUserMessages); // Get all messages for a specific user
router.get("/:senderID/:receiverID", getMessagesBetweenUsers); // Get messages between two users
router.post("/", sendMessage); // Send a new message
router.delete("/:id", deleteMessage); // Delete a message by ID

module.exports = router;
