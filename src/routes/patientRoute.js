const isAuth = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();
const patientController = require("../controller/patientController");

// GET---> appointments of authenticated patient
router.get("/appointments", isAuth, patientController.getAppointments);

// GET ----> get a single appointment
router.get('/appointment/:appointmentId',isAuth)

// POST --> book an appointment
router.post('/appointment',isAuth)



module.exports = router;
