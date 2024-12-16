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
  origin: ['http://localhost:5174', 'http://127.0.0.1:3000' , 'http://localhost:5173'], 
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
app.get('/api/v1/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile'],
}));

app.get('/api/v1/auth/google/redirect', passport.authenticate('google', {
    failureRedirect: '/login',
}), (req, res) => {
    res.redirect('/welcome_page');
});

// other routes
app.get('/welcome_page', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Welcome to the welcome page!');
    } else {
        res.redirect('/login');
    }
});

app.use("/api/v1", routes);

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found!",
  });
});