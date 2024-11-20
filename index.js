const express = require('express')
const app = express()
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require('./middlewares/errorHandler');
const routes= require ('./routes/allroutes.js')
app.use(express.json());
app.use(cors());

// Global error handler
app.use(errorHandler);

app.use("/api/v1", routes);


// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found!",
  });
});


mongoose
  .connect(process.env.DBHOST)
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("failed to connect to mongodb:" ,err));

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


