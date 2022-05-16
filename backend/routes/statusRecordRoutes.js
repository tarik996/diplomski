const express = require('express');
const router = express.Router();
const StatusRecord = require('../models/StatusRecord');
const { verifyAccessToken } = require('../middlewares/verifyTokenMiddleware');

router.post('/checkIn', verifyAccessToken, async (req, res) => {
    try {
        const statusRecord = new StatusRecord({
            userId: req.user._id,
            status: req.body.status.current,
            date: new Date(new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0)),
            flagSalary: false,
            flagCheckIn: true
        });
        await statusRecord.save();
    
        return res.json({message: 'Uspješna prijava!'});
    } catch (error) {
        res.send(error);
    }
});

router.get('/isCheckIn', verifyAccessToken, async (req, res) => {
    try {
        const statusRecord = await StatusRecord.find({userId: req.user._id}, { _id: 0, userId: 0, status: 0, flagSalary: 0, __v: 0});
        const lastStatusRecord = statusRecord.pop();
        
        if(lastStatusRecord === undefined) 
            return res.json(false);
        
        else if(new Date(new Date(lastStatusRecord.date).setUTCHours(0,0,0,0)).toString() !== new Date(new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0)).toString()) 
            return res.json(false);
        
        return res.json(true);
    } catch (error) {
        res.json(false);
    }
});

module.exports = router;