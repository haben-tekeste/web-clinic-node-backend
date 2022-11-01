const Appointments = require("../models/Appointment");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Util = require("../utils/util");

// get all appointments of specific user
exports.getAppointments = async (req, res, next) => {
  const userId = req.user._id;
  if (!userId) {
    const error = new Error("User not found");
    error.statusCode = 422;
    return next(error);
  }
  try {
    const userAppointments = await Appointments.find({
      patientId: req.user._id,
    })
      .populate("doctorId")
      .exec();
    const result = userAppointments.map((appt) => {
      return {
        date: appt.date,
        time: appt.startTime,
        doctorName: appt.doctorId.name,
        speciality: appt.doctorId.speciality,
        gender: appt.doctorId.gender,
      };
    });
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get a single appointment of a specific user
exports.getAppointment = async (req, res, next) => {
  const appointmentId = req.params.appointmentId;

  if (!appointmentId) {
    // check this might have a bug (error throwed not next(error))
    const error = new Error("Appointment Number required");
    error.statusCode = 404;
    throw error;
  }

  try {
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patientId: req.user._id,
    }).populate("doctorId");
    if (!appointment) {
      const error = new Error("No appointment with such number");
      error.statusCode = 404;
      throw error;
    }

    const result = {
      ...appointment,
      doctorId: appointment.doctorId._id,
      doctorName: appointment.doctorId.name,
    };
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get all doctors
exports.getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().populate("reviews");
    if (!doctors) {
      const error = new Error("Something went wrong");
      error.statusCode = 500;
      throw error;
    }
    const result = doctors.map((doctor) => {
      return {
        speciality: doctor.speciality,
        availability: doctor.availability,
        name: doctor.name,
        img: doctor.imageUrl,
        numberOfVotes: doctor.reviews.length,
        rating: Util.calculateTotalRatings(doctor.reviews),
      };
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      const error = new Error("No user found");
      error.statusCode = 404;
      throw error;
    }
    const result = { name: user.name, email: user.email };
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};