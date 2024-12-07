const User = require("../models/User");
const bcrypt = require('bcryptjs');


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getUserById = async (req, res) => {
  try {
    // Check if the userId is 'me', and if so, use the ID from the token
    let userId = req.params.userId;

    if (userId === "me") {
      // If it's 'me', get the userId from the token
      const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided, please login." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id; // Use the userId from the decoded token
    }

    // Now use the correct userId (either from route or decoded token)
    const user = await User.findById(userId).select("-password"); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(user); // Return the user's info
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
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};