require("./src/models/User");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoute = require("./src/routes/authRoute");
const homeRoute = require("./src/routes/homeRoute");
const app = express();

app.use(bodyParser.json());

app.use(authRoute);
app.use(homeRoute);

app.use((error, req, res, next) => {
  res.send({ success: false, error: error.message });
});

// creating a connection functions
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_SECRET_KEY);
    app.listen(process.env.PORT, () => {
      console.log("Started");
    });
  } catch (err) {
    console.log(err);
  }
};

//connect to database and server
connect();
