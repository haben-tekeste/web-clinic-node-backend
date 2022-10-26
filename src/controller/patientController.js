const Appointments = require("../models/Appointment");
const User = require("../models/User");

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
    }).populate("doctorId").exec();
    const result = userAppointments.map(appt => {
        return {
            date:appt.date,
            time:appt.startTime,
            doctorName: appt.doctorId.name,
            speciality:appt.doctorId.speciality,
            gender:appt.doctorId.gender,

        }
    })
    res.status(201).json({ success: true, data: result }); 
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
