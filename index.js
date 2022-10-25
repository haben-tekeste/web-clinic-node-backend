require("./src/models/User");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoute = require("./src/routes/authRoute");
const homeRoute = require("./src/routes/homeRoute");
const app = express();
const cors = require("cors");

//
require("dotenv").config();

app.use(cors());

app.use(bodyParser.json());

app.use(authRoute);
// app.use(homeRoute);

app.use((error, req, res, next) => {
  console.log("error",error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message : message });
});

// creating a connection functions
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_SECRET_KEY.toString());
    app.listen(process.env.PORT, () => {
      console.log("Started");
    });
  } catch (err) {
    console.log(err);
  }
};

//connect to database and server
connect();
