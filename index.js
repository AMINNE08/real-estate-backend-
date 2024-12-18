const express = require('express')
const app = express()
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require('passport');
const session = require('express-session');
const errorHandler = require('./middlewares/errorHandler');
const routes= require ('./routes/allroutes.js')
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:3000'], 
  credentials: true,
}));

// Global error handler
app.use(errorHandler);



mongoose
  .connect(process.env.DBHOST)
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("failed to connect to mongodb:" ,err));

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// Middleware setup
app.use(session({ secret: process.env.SESSION_SECRET , resave: true, saveUninitialized: true }));
require('./config/passport-config.js');
app.use(passport.initialize());
app.use(passport.session());

// Google Authentication Routes
app.get('/api/v1/auth/google', (req, res, next) => {
  console.log("Redirecting to Google OAuth...");
  next();
}, passport.authenticate('google', {
  scope: ['email', 'profile'],
}));

app.get('/api/v1/auth/google/redirect', passport.authenticate('google', {
  failureRedirect: '/login',
}), (req, res) => {
  // Redirect the user to the frontend with some user info as a query parameter or a token
  const user = req.user; // Assuming `req.user` holds the authenticated user data

  // Redirect to frontend with the user data or token (you can use JWT here for security)
  res.redirect(`http://localhost:5173?username=${user.username}&email=${user.email}`);
});



app.use("/api/v1", routes);

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found!",
  });
});