const express = require('express');
const router = express.Router();
const doctorController = require('../controller/doctorController')
const isAuth = require('../middlewares/doctroAuthMiddleware')


// GET ---> appointments for a specific doctor
router.get('/appointments',isAuth,doctorController.getAppointments)

// GET ---> profile
router.get('/profile',isAuth,doctorController.getProfile)
