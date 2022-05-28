const express = require('express');
const router = express.Router();
const EmployeeStatus = require('../models/EmployeeStatus');
const { verifyAccessToken } = require('../middlewares/verifyTokenMiddleware');
const { adminRoleAuth } = require('../middlewares/roleAuthMiddleware');
const { employeeStatusValidation } = require('../validation/employeeStatusValidation');

//Rute za ažuriranje stanja zaposlenika

router.post('/createEmployeeStatus/:_id', verifyAccessToken, adminRoleAuth, async (req, res) => {
    //Validacija podataka
    const { error } = employeeStatusValidation(req.body);

    if(error) return res.json({message: 'Status zaposlenika nije ažuriran!', isEdit: false});
    
    const employeeStatusLast = await EmployeeStatus.find({userId: req.params._id}, { _id: 0, userId: 0, description: 0, __v: 0 }).sort({dateStatusChange: 1});
    const lastStatus = employeeStatusLast.pop();

    if(lastStatus === undefined) {
        try { 
            //Kreiranje statusa zaposlenika
            const employeeStatus = new EmployeeStatus({
                userId: req.params._id,
                status: req.body.status, 
                dateStatusChange: new Date(new Date(new Date(req.body.dateStatusChange).getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0)),  
                description: req.body.description
            });
            await employeeStatus.save();
            
            return res.json({message: 'Status zaposlenika je ažuriran!', isEdit: true});
        } catch (error) {
            res.send(error);
        }
    }
    else if(lastStatus.status === req.body.status) 
            return res.json({message: 'Zaposlenik ima već taj status!', isEdit: false});

    try { 
        //Kreiranje statusa zaposlenika
        const employeeStatus = new EmployeeStatus({
            userId: req.params._id,
            status: req.body.status, 
            dateStatusChange: new Date(new Date(new Date(req.body.dateStatusChange).getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0)),  
            description: req.body.description
        });
        await employeeStatus.save();
        
        return res.json({message: 'Status zaposlenika je ažuriran!', isEdit: true});
    } catch (error) {
        res.send(error);
    }
});

router.put('/updateEmployeeStatus/:_id', verifyAccessToken, adminRoleAuth, async (req, res) => {
    //Validacija podataka
    const { error } = employeeStatusValidation(req.body);
    
    if(error) return res.json({message: 'Status zaposlenika nije ažuriran!', isEdit: false});

    try { 
        //Kreiranje statusa zaposlenika
        await EmployeeStatus.updateOne({ _id: req.params._id }, {
            status: req.body.status, 
            dateStatusChange: new Date(new Date(new Date(req.body.dateStatusChange).getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0)), 
            description: req.body.description
        });
        
        return res.json({message: 'Status zaposlenika je ažuriran!', isEdit: true});
    } catch (error) {
        res.send(error);
    }
});

router.get('/getEmployeeStatus/:_id', verifyAccessToken, adminRoleAuth, async (req, res) => {
    const employeeStatus = await EmployeeStatus.find({userId: req.params._id}, { userId: 0, __v: 0 }).sort({dateStatusChange: 1});
    
    return res.json({employeeStatus: employeeStatus});
});

router.get('/getStatusWithId/:statusId', verifyAccessToken, adminRoleAuth, async (req, res) => {
    const employeeStatus = await EmployeeStatus.findById({_id: req.params.statusId}, { userId: 0, __v: 0 });
    
    return res.json({employeeStatus: employeeStatus});
});

router.delete('/deleteEmployeeStatus/:_id', verifyAccessToken, adminRoleAuth, async (req, res) => {
    try {
        await EmployeeStatus.deleteOne({_id: req.params._id});
        
        return res.json({message: 'Status je uspješno obrisan!', success: true});
    } catch (error) {
        res.send(error)
    }
});

module.exports = router;