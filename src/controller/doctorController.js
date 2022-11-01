const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

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
      };
    });
  } catch (error) {}
};


exports.getProfile = async(req,res,next) => {
    
}