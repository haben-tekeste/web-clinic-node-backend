const isAuth = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();
const patientController = require("../controller/patientController");

// GET---> appointments of authenticated patient
router.get("/appointments", isAuth, patientController.getAppointments);

// GET ----> get a single appointment
router.get(
  "/appointment/:appointmentId",
  isAuth,
  patientController.getAppointment
);

// GET ---> all doctors
router.get("/doctors", isAuth, patientController.getDoctors);

// GET ---> profile
router.get("/profile", isAuth, patientController.getProfile);

// GET ---> top doctors
router.get("/top-doctors", isAuth, patientController.getTopDoctors);

// POST --> book an appointment
router.post("/appointment", isAuth, patientController.postAppointement);

// Update --> cancel an appointment
router.put("/cancel-appointment", isAuth, patientController.cancelAppointment);

//UPDATE  --> profile
router.put("/profile", isAuth, patientController.updateProfile);

// GET ---> prescription
router.get("/prescription/:id", isAuth, patientController.getPrescription);

// PUT ---> review
router.put("/review/:id",isAuth,patientController.writeReview)
module.exports = router;
