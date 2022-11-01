const mongoose = require('mongoose')

const AppointmentSchema = new mongoose.Schema({
    date:{
        type:Date,
        required:true,
    },
    startTime:{
        type: String,
        required:true,
    },
    doctorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
        required:true,
    },
    patientId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})


module.exports = mongoose.model('Appointment',AppointmentSchema);