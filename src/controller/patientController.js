const Appointments = require("../models/Appointment");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Review = require("../models/Review");
const Util = require("../utils/util");
const { default: mongoose } = require("mongoose");

// cancell an appointement

exports.cancelAppointment = async (req, res, next) => {
  const userId = req.user._id;
  Util.userExistFromRequest(userId, next);
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId);
    const todaysDate = new Date().getTime();
    const appointmentDate = new Date(appointment.date).getTime();
    if (appointment.status !== "Cancelled") {
      if (appointmentDate - todaysDate > 0) {
        appointment.status = "Cancelled";
        await appointment.save();
        res.send({ success: true });
      } else {
        Util.errorStatment("You can't cancel an appointment now", next);
      }
    } else {
      Util.errorStatment("appointment already cancelled", next);
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//post an appointement
exports.postAppointement = async (req, res, next) => {
  const userId = req.user._id;
  Util.userExistFromRequest(userId, next);
  try {
    const { date, startTime, doctorId } = req.body;
    const patient = await User.findById(userId).populate("appointments");
    const doctor = await Doctor.findById(doctorId).populate("appointments");
    const booked = patient.appointments.filter((appointment) => {
      const date1 = new Date(date);
      const date2 = new Date(appointment.date);
      if (date1.getTime() === date2.getTime()) {
        return appointment;
      }
    });

    if (booked.length === 0) {
      const appointment = new Appointment({
        date,
        startTime,
        doctorId,
        patientId: userId,
      });
      patient.appointments = [...patient.appointments, appointment._id];
      doctor.appointments = [...doctor.appointments, appointment._id];
      await appointment.save();
      await patient.save();
      await doctor.save();
      res.send({ success: true, patient });
    } else {
      Util.errorStatment("Already booked for the day", next);
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get all appointments of specific user
exports.getAppointments = async (req, res, next) => {
  const userId = req.user._id;
  Util.userExistFromRequest(userId, next);
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
  } catch (err) {
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

exports.updateProfile = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      const error = new Error("No user found");
      error.statusCode = 404;
      throw error;
    }
    user.name = name;
    user.email = email;
    await user.save();
    res.status(201).json({ success: true });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getTopDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().populate("reviews");
    if (!doctors) {
      const error = new Error("Something went wrong");
      error.statusCode = 500;
      throw error;
    }

    const result = doctors
      .filter((doctor) => {
        if (Util.calculateTotalRatings(doctor.reviews) > 4.2) {
          return doctor;
        }
      })
      .map((results) => {
        return {
          speciality: results.speciality,
          name: results.name,
          img: results.imageUrl,
          numberOfVotes: results.reviews.length,
          rating: Util.calculateTotalRatings(results.reviews),
        };
      });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
