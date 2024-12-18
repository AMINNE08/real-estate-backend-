const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};











const getUserById = async (req, res) => {
  try {
    let userId = req.params.userId;

    if (userId === "me") {
      const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided, please login." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id; 
    }

    const user = await User.findById(userId).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(user); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to retrieve user data." });
  }
};











const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};












const updateUser = async (req, res) => {
  const  id  = req.params.id;
  const tokenUserId =req.userId;
  const {password, avatar, ...inputs}= req.body;
  let updatedPassword = null;
  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        ...inputs,
        ...(updatedPassword && {password: updatedPassword}),
        ...(avatar && {avatar}),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: userPassword, ...rest } = updatedUser.toObject();
    res.status(200).json(rest);

  } catch (err) {
    console.error("Error during updateUser:", err.message);
    res.status(500).json({ message: "Failed to update users!" });
  }
};









const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOneAndDelete({ _id: id });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};











// Book a Visit
const bookVisit = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const alreadyBooked = user.bookedVisits.some((visit) => visit.id === id);

    if (alreadyBooked) {
      return res.status(400).json({ message: "This residency is already booked by you" });
    }

    // Add the new visit to the user's booked visits
    user.bookedVisits.push({ id, date });
    await user.save();

    res.status(200).json({ message: "Your visit is booked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});








// Get All Bookings
const allBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }, { bookedVisits: 1, _id: 0 });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.bookedVisits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});














// Cancel a Booking
const cancelBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const index = user.bookedVisits.findIndex((visit) => visit.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Booking not found" });
    }

    user.bookedVisits.splice(index, 1);
    await user.save();

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});






module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  bookVisit,
  allBookings,
  cancelBookings
};