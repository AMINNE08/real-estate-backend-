const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const  apiInstance = require ('../config/brevoConfig')

// register user
exports.registre = async (req, res) => {
    const { userID, username, email, password, role} = req.body;
    // validation :
    if (!userID || !email || !password || !username || !role) {
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
        userID,
        username,
        email,
        password: hashedPassword,
        role,
      });
      // returning the user and status code :
      res.status(201).json(newuser);
    } catch (err) {
      // returning a status code and error message :
      res.status(500).json({ message: err.message });
    }
  };






  
// Login function
exports.login = async (req, res) => {
    const { email, password } = req.body;
    // checking if the user exsiste in the database :
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist please register" });
    }
  
    // checking if the password is correct :
    const correctPassword = await bcrypt.compare(password, user.password);
    // we have a choice between ux and security depending on the project we are working on
    if (!correctPassword) {
      return res.status(400).json({ message: "Wrong password" });
    }
    try {
      // generate the token for the succefuly loged user and send it back with a status and the user
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      });
      // dont send the user password back
      res.status(200).json({ user: user.username, token: token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// Forgot Password function
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email) {
   
    return res.status(400).json({ message: "Email is required" });
  }
  console.log("Email provided:", email);

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: "User does not exist" });
    }

    

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    

    // Set token expiration time (optional, e.g., 1 hour from now)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour in milliseconds
    await user.save();
    

    // Generate reset URL
const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}&id=${user._id}`;
    

    // Prepare the email data
const emailData = {
  sender: { name: 'Amine', email: 'saddedineaminetahar@gmail.com' },
  to: [{ email: user.email }],
  subject: "Password Reset Request",
  htmlContent: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #e74c3c;">Hello ${user.name},</h2>
      <p style="line-height: 1.6;">
        You requested a password reset. Please click the link below to reset your password:
      </p>
      <p style="text-align: center; margin: 20px 0;">
        <a href="${resetUrl}" style="background-color: #e74c3c; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>
      <p style="color: #666;">
        If you did not request this, please ignore this email.
      </p>
      <p style="margin-top: 30px; font-size: 12px; color: #999;">
        Best regards, <br/> Amine
      </p>
    </div>
  `
};

   

    try {
      await apiInstance.sendTransacEmail(emailData);
      console.log("Password reset email sent to:", user.email);
      return res.status(200).json({ message: "Password reset email sent" });
    } catch (emailError) {
      console.error("Error sending email:", emailError.response ? emailError.response.body : emailError);
      return res.status(500).json({ message: "Failed to send password reset email" });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: error.message });
  }
};




// Reset Password function
exports.resetPassword = async (req, res) => {
  const { token, id, newPassword } = req.body;

  try {
      // Find the user with the given ID
      const user = await User.findById(id);

      // Check if the token is valid and not expired
      if (!user || user.resetPasswordToken !== token || Date.now() > user.resetPasswordExpires) {
          return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Hash the new password and update the user
      user.password = await bcrypt.hash(newPassword, 8);
      user.resetPasswordToken = undefined; // Clear the token
      user.resetPasswordExpires = undefined; // Clear the expiration
      await user.save();

      res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
