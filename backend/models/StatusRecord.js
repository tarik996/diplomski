const mongoose = require('mongoose');

const statusRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        enum: ['Radio', 'Odmor', 'Službeni put','Bolovanje', 'Plaćeno odsustvo', 'Neplaćeno odsustvo' ],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    flagSalary: {
        type: Boolean,
        required: true
    },
    flagCheckIn: {
        type: Boolean,
        required: true
    }
});

const StatusRecord = mongoose.model('StatusRecord', statusRecordSchema);

module.exports = StatusRecord;