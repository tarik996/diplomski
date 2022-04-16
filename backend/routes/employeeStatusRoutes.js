const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Role = require('../models/Role');
const EmployeeStatus = require('../models/EmployeeStatus');
const { verifyAccessToken } = require('../middlewares/verifyTokenMiddleware');
const { adminRoleAuth } = require('../middlewares/roleAuthMiddleware');
const { employeeStatusValidation } = require('../validation/employeeStatusValidation');

//Constants
const { EMPLOYEESTATUS } = require('../constants/statusConstants');

//Rute za ažuriranje stanja zaposlenika

router.post('/createEmployeeStatus/:_id', verifyAccessToken, adminRoleAuth, async (req, res) => {
    //Validacija podataka
    const { error } = employeeStatusValidation(req.body);
    
    if(error) return res.json({message: 'Status zaposlenika nije ažuriran!', isEdit: false});
    
    const employeeStatus = await EmployeeStatus.find({userId: req.params._id}, { _id: 0, userId: 0, description: 0, __v: 0 });
    if(employeeStatus.length === 0) console.log('nesta');
    else if(employeeStatus.pop().status === EMPLOYEESTATUS.status2) console.log('dobar')

    try { 
        //Kreiranje statusa zaposlenika
        const employeeStatus = new EmployeeStatus({
            userId: req.params._id,
            status: req.body.status, 
            dateStatusChange: req.body.dateStatusChange, 
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
    
    /*const employeeStatus = await EmployeeStatus.find({userId: req.params._id}, { _id: 0, userId: 0, description: 0, __v: 0 });
    if(employeeStatus.length === 0) console.log('nesta');
    else if(employeeStatus.pop().status === EMPLOYEESTATUS.status2) console.log('dobar')*/

    try { 
        //Kreiranje statusa zaposlenika
        await EmployeeStatus.updateOne({ _id: req.params._id }, {
            userId: req.params._id,
            status: req.body.status, 
            dateStatusChange: req.body.dateStatusChange, 
            description: req.body.description
        });
        
        return res.json({message: 'Status zaposlenika je ažuriran!', isEdit: true});
    } catch (error) {
        res.send(error);
    }
});

router.get('/getEmployeeStatus/:_id', verifyAccessToken, adminRoleAuth, async (req, res) => {
    const employeeStatus = await EmployeeStatus.find({userId: req.params._id}, { userId: 0, __v: 0 });
    
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