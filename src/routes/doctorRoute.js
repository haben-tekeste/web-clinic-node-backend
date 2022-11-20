const express = require('express');
const router = express.Router();
const doctorController = require('../controller/doctorController')
const isAuth = require('../middlewares/doctroAuthMiddleware')


// GET ---> appointments for a specific doctor
router.get('/appointments',isAuth,doctorController.getAppointments)

// GET ---> appointments for today
router.get('/today',isAuth,doctorController.getTodayAppointments)

// Update ---> appointment status
router.put('/appointment/:id',isAuth)

// GET ---> profile
router.get('/profile',isAuth,doctorController.getProfile)

// GET ---> reviews
router.get('/reviews',isAuth)

// POST ---> prescription
router.post('/prescription',isAuth)


module.exports = router;