const mongoose = require('mongoose');

const caluculationSchema = new mongoose.Schema({
    dateFrom: {
        type: Date,
        required: true
    },
    dateTo: {
        type: Date,
        required: true
    }
});

const Calculation = mongoose.model('Calculation', caluculationSchema);

module.exports = Calculation;