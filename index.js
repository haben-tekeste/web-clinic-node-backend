require("./src/models/User");
require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const multer = require("multer");

//
const authRoute = require("./src/routes/authRoute");
const patientRoute = require("./src/routes/patientRoute");
const doctorRoute = require("./src/routes/doctorRoute");
//
require("dotenv").config();

// file storage for images
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

// file types filter for images
const fileFilter = (req, file, cb) => {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  // To accept the file pass `true`, like so:
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    // To reject this file pass `false`, like so:
    cb(null, false);
  }
};

app.use(cors());
app.use(bodyParser.json());
app.use("images", express.static(path.join(__dirname, "src", "images"))); //serving static images
app.use(
  multer({ storage: fileStorage, fileFilter }).single("image")
);

app.use(authRoute);
app.use("/patient", patientRoute);
app.use("/doctor", doctorRoute);

app.use((error, req, res, next) => {
  console.log("error", error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
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
