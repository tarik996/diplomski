const mongoose = require('mongoose');

const sallarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    calculationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Calculation"
    },
    brutoSallary: {
        type: Number,
        required: true
    }, 
    netoSallary: {
        type: Number,
        required: true
    }
});

const Sallary = mongoose.model('Sallary', sallarySchema);

module.exports = Sallary;