const isAuth = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();
const patientController = require("../controller/patientController");

// GET---> appointments of authenticated patient
router.get("/appointments", isAuth, patientController.getAppointments);

// GET ----> get a single appointment
router.get('/appointment/:appointmentId',isAuth,patientController.getAppointment)

// GET ---> all doctors
router.get('/doctors',isAuth,patientController.getDoctors);

// GET ---> profile
router.get('/profile',isAuth,patientController.getProfile)

// POST --> book an appointment
router.post('/appointment',isAuth)



module.exports = router;
