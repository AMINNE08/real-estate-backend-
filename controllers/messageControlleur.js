const Message = require("../models/Message");
const User = require("../models/User");
const Property = require("../models/Propertie");

// Get all messages for a user (sent or received)
const getUserMessages = async (req, res) => {
  try {
    const { userID } = req.params;
    const messages = await Message.find({
      $or: [{ senderID: userID }, { receiverID: userID }],
    })
      .populate("senderID", "username") 
      .populate("receiverID", "username") 
      .populate("propertyID", "title"); 
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get messages between two users (optionally filter by property)
const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { senderID, receiverID } = req.params;
    const { propertyID } = req.query;

    const query = {
      $or: [
        { senderID, receiverID },
        { senderID: receiverID, receiverID: senderID },
      ],
    };

    if (propertyID) query.propertyID = propertyID;

    const messages = await Message.find(query)
      .sort({ created_at: 1 }) // Sort by oldest to newest
      .populate("senderID", "username")
      .populate("receiverID", "username")
      .populate("propertyID", "title");
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { senderID, receiverID, propertyID, content } = req.body;

    // Ensure sender exists
    const senderExists = await User.findOne({ userID: senderID });
    if (!senderExists) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // Ensure receiver exists
    const receiverExists = await User.findOne({ userID: receiverID });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Ensure property exists if provided
    if (propertyID) {
      const propertyExists = await Property.findOne({ propertyID });
      if (!propertyExists) {
        return res.status(404).json({ message: "Property not found" });
      }
    }

    const newMessage = new Message({
      messageID: Date.now(),
      senderID,
      receiverID,
      propertyID,
      content,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a message by ID
const deleteMessage = async (req, res) => {
  try {
    const deletedMessage = await Message.findOneAndDelete({ messageID: req.params.id });
    if (!deletedMessage) return res.status(404).json({ message: "Message not found" });
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUserMessages,
  getMessagesBetweenUsers,
  sendMessage,
  deleteMessage,
};
