const mongoose = require('mongoose');

const employeeStatusSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        enum: ['Radi', 'Ne radi', 'Plaćeno odsustvo', 'Neplaćeno odsustvo'],
        required: true
    },
    description: {
        type: String
    },
    dateStatusChange: {
        type: Date,
        required: true
    }
});

const EmployeeStatus = mongoose.model('EmployeeStatus', employeeStatusSchema);

module.exports = EmployeeStatus;