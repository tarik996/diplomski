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

router.post('/editEmployeeStatus/:_id', verifyAccessToken, adminRoleAuth, async (req, res) => {
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

router.get('/getEmployeeStatus/:_id', verifyAccessToken, adminRoleAuth, async (req, res) => {
    const employeeStatus = await EmployeeStatus.find({userId: req.params._id}, { _id: 0, userId: 0, description: 0, __v: 0 });
    
    return res.json({employeeStatus: employeeStatus});
});

module.exports = router;