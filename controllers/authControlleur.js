const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  apiInstance = require ('../config/brevoConfig')






// register user
exports.registre = async (req, res) => {
    const { username, email, password, phone} = req.body;
    // validation :
    if (!email || !password || !username || !phone ){
      return res.status(400).json({ message: "All fields are required" });
    }
    // checking if the user exsiste in the database :
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    try {
      // hashing password :
      const hashedPassword = await bcrypt.hash(password, 8);
      // creating the user with hashed password :
      // new user is a const that will be used to return the user created
      // User is the model
      const newuser = await User.create({
        username,
        email,
        password: hashedPassword,
        role: 'user',
        phone
      });
      // returning the user and status code :
      res.status(201).json(newuser);
    } catch (err) {
      // returning a status code and error message :
      res.status(500).json({ message: err.message });
    }
  };






  
  exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User does not exist. Please register." });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect password." });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d", 
      });
  
      // Set the cookie
      const cookieOptions = {
        httpOnly: true, 
        maxAge: 1000 * 60 * 60 * 24 * 7, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict",
      };
  
      res
        .cookie("token", token, cookieOptions)
        .status(200)
        .json({ message: "Login successful", user: user.username });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  


  exports.logout = (req, res) => {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({ message: "Logout successful" });
  };
  




//forgot password
  const crypto = require("crypto");
  const { sendPasswordResetEmail } = require("../config/emailConfig");
  
  exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }
  
      // Check if a valid token already exists
      if (user.resetPasswordToken && user.resetPasswordExpires > Date.now()) {
        const resetUrl = `http://localhost:5173/reset-password?token=${user.resetPasswordToken}&id=${user._id}`;
  
        try {
          await sendPasswordResetEmail(user, resetUrl);
          return res
            .status(200)
            .json({ message: "Password reset email re-sent successfully" });
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          return res
            .status(500)
            .json({ message: "Failed to send password reset email" });
        }
      }
  
      // Generate a new token if no valid one exists
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();
  
      const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}&id=${user._id}`;
  
      try {
        await sendPasswordResetEmail(user, resetUrl);
        res.status(200).json({ message: "Password reset email sent" });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        res.status(500).json({ message: "Failed to send password reset email" });
      }
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ message: error.message });
    }
  };
  





//reset password
exports.resetPassword = async (req, res) => {
  const { token, id, newPassword } = req.body;

  try {
    // Find the user with the given ID
    const user = await User.findById(id);

    if (!user) {
      console.error("User not found with ID:", id);
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Check if the token is valid and not expired
    const isTokenValid = user.resetPasswordToken === token;
    const isTokenExpired = Date.now() > user.resetPasswordExpires;

    if (!isTokenValid || isTokenExpired) {
      console.error("Token validation failed:", {
        isTokenValid,
        isTokenExpired,
      });
      return res.status(400).json({ message: "Invalid or expired token" });
    }


    // Hash the new password and update the user
    user.password = await bcrypt.hash(newPassword, 8);
    user.resetPasswordToken = undefined; // Clear the token
    user.resetPasswordExpires = undefined; // Clear the expiration
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ message: error.message });
  }
};

