const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        min: 1
    },
    firstName: {
        type: String,
        required: true,
        min: 3
    },
    lastName: {
        type: String,
        required: true,
        min: 3
    },
    jmbg: {
        type: String,
        required: true,
        min: 13,
        max: 13
    },
    address: {
        type: String,
        required: true,
        min: 5  
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 35
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 1024
    },
    position: {
        type: String,
        required: true,
    },
    personalDeductions: {
        type: Number,
        required: true,
        min: 0
    },
    hourlyWage: {
        type: Number,
        required: true,
        min: 2.05
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
    },
    vacation: {
        type: Number,
        required: true,
        min: 0
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;