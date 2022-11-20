const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Util = require("../utils/util");

exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.doctor._id })
      .populate("patientId")
      .exec();
    const result = appointments.map((appt) => {
      return {
        date: appt.date,
        time: appt.startTime,
        patientName: appt.patientId.name,
        status: appt.status,
      };
    });
    res.status(200).json(result);
  } catch (error) {
    Util.errorStatment("Appointments not found", next);
  }
};

exports.getTodayAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({
      date: {
        $gte: new Date(new Date().setHours(00, 00, 00)),
        $lte: new Date(new Date().setHours(23, 59, 59)),
      },
      doctorId: req.doctor._id,
    })
      .populate("patientId")
      .exec();
    const result = appointments.map((appt) => {
      return {
        date: appt.date,
        time: appt.startTime,
        patientName: appt.patientId.name,
        status: appt.status,
      };
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error)
    Util.errorStatment("Could not query appointments", next);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) Util.errorStatment("Doctor not found", next);
    const { name, email } = doctor;
    res.status(200).json({ name: name, email: email });
  } catch (error) {
    Util.errorStatment("Profile not found", next);
  }
};
