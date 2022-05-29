const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Role = require('../models/Role');
const generatePassword = require('../helpers/generatePassword');
const sendEmail = require('../helpers/sendEmail');
const { jmbgValidation } = require('../validation/userValidation');
const { verifyAccessToken } = require('../middlewares/verifyTokenMiddleware');
const { adminRoleAuth, adminAccountantRoleAuth, accountantRoleAuth } = require('../middlewares/roleAuthMiddleware');
const { createUserValidation } = require('../validation/userValidation');
const { errorMessage } = require('../helpers/errorMessage');

//Constants
const { USERBOOL, USERMESSAGES, DEFAULTUSER } = require('../constants/userConstants');

//Ruta za kreiranje korisnika
router.put('/edit/:_id', verifyAccessToken, adminRoleAuth, async (req, res) => {
    //Validacija podataka
    const { error } = createUserValidation(req.body);

    var bool = JSON.parse(JSON.stringify(USERBOOL));
    var messages = JSON.parse(JSON.stringify(USERMESSAGES));
    
    if(error) {
        const errorMessages = error.stack.replace("ValidationError:","").split('.');
        const returnValue = errorMessage(errorMessages, bool, messages);

        messages = returnValue[0]
        bool = returnValue[1]; 

        if(!jmbgValidation(req.body.jmbg) && messages.jmbgError !== "JMBG je obavezan!") {
            bool.jmbgBool = true;
            messages.jmbgError = "Jmbg nije validan!";
        }

        return res.json({message: '', bool: bool, messages: messages, isEdit: undefined});
    }

    if(!jmbgValidation(req.body.jmbg)) {
        bool.jmbgBool = true;
        messages.jmbgError = "Jmbg nije validan!";

        return res.json({message: '', bool: bool, messages: messages, isEdit: undefined});
    }

    //Provjera da li postoji drugi korisnik sa istim jmbg u bazi
    const editUser = await User.findById({ _id: req.params._id }, {_id: 0, password: 0, __v: 0});
    const sameJMBG = await User.find({_id: { $nin: req.params._id}, jmbg: req.body.jmbg});
    const sameEmail = await User.find({_id: { $nin: req.params._id}, email: req.body.email});

    if(sameJMBG.length === 1) 
        return res.json({message: 'Postoji drugi korisnik sa istim jmbg!', bool: bool, messages: messages, user: editUser, isEdit: false});
    if(sameEmail.length === 1) 
        return res.json({message: 'Postoji drugi korisnik sa istim emailom!', bool: bool, messages: messages, user: editUser, isEdit: false});

    //Pronalazi id role korisnika koji se edituje
    const editUserRoleID = await Role.findOne({roleName: req.body.role});

    try {
        //Ažuriranje podataka
        const update = { 
            firstName: req.body.firstName, 
            lastName: req.body.lastName, 
            jmbg: req.body.jmbg, 
            address: req.body.address,
            email: req.body.email, 
            position: req.body.position, 
            personalDeductions: req.body.personalDeductions,
            hourlyWage: req.body.hourlyWage, 
            vacation: req.body.vacation, 
            roleId: editUserRoleID
        }

        await User.findOneAndUpdate({_id: req.params._id}, update, { new: true });

        return res.json({message: 'Informacije o korisniku su uspješno ažurirane!', bool: bool, messages: messages, isEdit: true});
    } catch (error) {
        res.send(error);
    }
});

//Za računovođe da mogu mjenjati plate i lične odbitke
router.put('/editSallary/:_id', verifyAccessToken, accountantRoleAuth, async (req, res) => {
    //Validacija podataka
    const { error } = createUserValidation(req.body);

    var bool = JSON.parse(JSON.stringify(USERBOOL));
    var messages = JSON.parse(JSON.stringify(USERMESSAGES));
    
    if(error) {
        const errorMessages = error.stack.replace("ValidationError:","").split('.');
        const returnValue = errorMessage(errorMessages, bool, messages);

        messages = returnValue[0]
        bool = returnValue[1]; 

        if(!jmbgValidation(req.body.jmbg) && messages.jmbgError !== "JMBG je obavezan!") {
            bool.jmbgBool = true;
            messages.jmbgError = "Jmbg nije validan!";
        }

        return res.json({message: '', bool: bool, messages: messages, isEdit: undefined});
    }

    if(!jmbgValidation(req.body.jmbg)) {
        bool.jmbgBool = true;
        messages.jmbgError = "Jmbg nije validan!";

        return res.json({message: '', bool: bool, messages: messages, isEdit: undefined});
    }

    //Provjera da li postoji drugi korisnik sa istim jmbg u bazi
    const editUser = await User.findById({ _id: req.params._id }, {_id: 0, password: 0, __v: 0});
    const sameJMBG = await User.find({_id: { $nin: req.params._id}, jmbg: req.body.jmbg});
    const sameEmail = await User.find({_id: { $nin: req.params._id}, email: req.body.email});

    if(sameJMBG.length === 1) 
        return res.json({message: 'Postoji drugi korisnik sa istim jmbg!', bool: bool, messages: messages, user: editUser, isEdit: false});
    if(sameEmail.length === 1) 
        return res.json({message: 'Postoji drugi korisnik sa istim emailom!', bool: bool, messages: messages, user: editUser, isEdit: false});

    try {
        //Ažuriranje podataka
        const update = {  
            personalDeductions: req.body.personalDeductions,
            hourlyWage: req.body.hourlyWage,
        }

        await User.findOneAndUpdate({_id: req.params._id}, update, { new: true });

        return res.json({message: 'Informacije o korisniku su uspješno ažurirane!', bool: bool, messages: messages, isEdit: true});
    } catch (error) {
        res.send(error);
    }
});

router.post('/create', verifyAccessToken, adminRoleAuth, async (req, res) => {
    //Validacija podataka
    const { error } = createUserValidation(req.body);

    var defaultUser = JSON.parse(JSON.stringify(DEFAULTUSER));
    var bool = JSON.parse(JSON.stringify(USERBOOL));
    var messages = JSON.parse(JSON.stringify(USERMESSAGES));
    
    if(error) { 
        const errorMessages = error.stack.replace("ValidationError:","").split('.');
        const returnValue = errorMessage(errorMessages, bool, messages);

        messages = returnValue[0];
        bool = returnValue[1];

        if(!jmbgValidation(req.body.jmbg) && messages.jmbgError !== "JMBG je obavezan!") {
            bool.jmbgBool = true;
            messages.jmbgError = "Jmbg nije validan!";
        }

        return res.json({message: '', bool: bool, messages: messages, isCreated: undefined});
    }

    if(!jmbgValidation(req.body.jmbg)) {
        bool.jmbgBool = true;
        messages.jmbgError = "Jmbg nije validan!";

        return res.json({message: '', bool: bool, messages: messages, isCreated: undefined});
    }

    //Provjera da li korisnik vec postoji u bazi
    const jmbgExist = await User.findOne({ jmbg: req.body.jmbg });
    if(jmbgExist) return res.json({message: 'Korisnik već postoji!', bool: bool, messages: messages, isCreated: false});

    //Provjera da li email vec postoji u bazi
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) return res.json({message: 'Korisnik već postoji!', bool: bool, messages: messages, isCreated: false});

    //Pronalazi id role korisnika koji se kreira
    const createUserRoleID = await Role.findOne({roleName: req.body.role});

    try { 
        //Kreiranje i hesiranje lozinke 
        const password = generatePassword();
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        //Kreiranje korisnika
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            jmbg: req.body.jmbg,
            email: req.body.email,
            password: hashPassword,
            position: req.body.position,
            personalDeductions: req.body.personalDeductions,
            hourlyWage: req.body.hourlyWage,
            workingHourFrom: "08:00",
            workingHourTo: "16:00",
            vacation: req.body.vacation,
            roleId: createUserRoleID,
        });
        await user.save();

        //Slanje maila zaposlenom da mu je račun za aplikaciju kreiran 
        await sendEmail(req.body.email, 'Obavještenje', `Kreiran vam je račun za našu internu stranicu, gdje za pristup stranici koristite email ${req.body.email} i lozinku ${password}`);
        
        return res.json({message: 'Korisnik je uspješno registrovan!', bool: bool, user: defaultUser, messages: messages, isCreated: true});
    } catch (error) {
        res.send(error);
    }
});

router.get('/getAllUsers', verifyAccessToken, adminAccountantRoleAuth, async (req, res) => {
    try {
        const allUsers = await User.find();
        const tableHeaders = [['Id', 'Ime i prezime', 'JMBG', 'Adresa', 'Email', 'Radno mjesto', 'Lični odbici', 'Satnica', 'Ukupni godišnji']];
        const userJSON = ['index', 'userName', 'jmbg', 'address', 'email', 'position', 'personalDeductions', 'hourlyWage', 'vacation'];

        var name = "";
        var usersNames = [];

        for(var i = 0; i < allUsers.length; i++) {
            name = (allUsers[i].firstName + " " + allUsers[i].lastName).toString();
            usersNames.push({
                _id: allUsers[i]._id, 
                index: i + 1, 
                userName: name, 
                jmbg: allUsers[i].jmbg, 
                address: allUsers[i].address,
                email: allUsers[i].email, 
                position: allUsers[i].position,
                personalDeductions: allUsers[i].personalDeductions, 
                hourlyWage: allUsers[i].hourlyWage, 
                vacation: allUsers[i].vacation
            });
        }

        return res.json({usersNames: usersNames, tableHeaders: tableHeaders, userJSON: userJSON});
    } catch (error) {
        res.send(error)
    }
});

router.get('/profile/:_id', verifyAccessToken, adminAccountantRoleAuth, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params._id }, { id: 0, password: 0, __v: 0 });
        const userRole = await Role.findById({_id: user.roleId});

        const response = {
            firstName: user.firstName, 
            lastName: user.lastName, 
            jmbg: user.jmbg, 
            address: user.address,
            email: user.email, 
            position: user.position, 
            personalDeductions: user.personalDeductions,
            hourlyWage: user.hourlyWage, 
            vacation: user.vacation,
            role: userRole.roleName
        };
        
        return res.json({user: response});
    } catch (error) {
        res.send(error);
    }
});

router.get('/yourProfile', verifyAccessToken, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user._id }, { id: 0, password: 0, __v: 0 });
        const userRole = await Role.findById({_id: user.roleId});

        const response = {
            _id: user._id,
            firstName: user.firstName, 
            lastName: user.lastName, 
            jmbg: user.jmbg, 
            address: user.address,
            email: user.email, 
            position: user.position, 
            personalDeductions: user.personalDeductions,
            hourlyWage: user.hourlyWage, 
            vacation: user.vacation,
            role: userRole.roleName
        };
        
        return res.json({user: response});
    } catch (error) {   
        res.send(error);
    }
});

//Radno vrijeme uposlenika

//Vraća radno vrijeme za svakog korisnika
router.get('/getAllUsersWorkingHours', verifyAccessToken, adminAccountantRoleAuth, async (req, res) => {
    try {
        const allUsers = await User.find();
        const tableHeaders = [['Id', 'Ime i prezime', 'Radno vrijeme od', 'Radvno vrijeme do']];
        const userJSON = ['index', 'userName', 'workingHourFrom', 'workingHourTo'];

        var name = "";
        var usersNames = [];

        for(var i = 0; i < allUsers.length; i++) {
            name = (allUsers[i].firstName + " " + allUsers[i].lastName).toString();
            usersNames.push({
                _id: allUsers[i]._id, 
                index: i + 1, 
                userName: name, 
                workingHourFrom: allUsers[i].workingHourFrom,
                workingHourTo: allUsers[i].workingHourTo
            });
        }

        return res.json({usersNames: usersNames, tableHeaders: tableHeaders, userJSON: userJSON});
    } catch (error) {
        res.send(error)
    }
});


//Promjena radnog vremena za korisnike
router.put('/editUserWorkingHours', verifyAccessToken, adminAccountantRoleAuth, async (req, res) => {
    //Validacija podataka
    const workingHourFrom = (req.body.workingHourFrom).split(":");
    const workingHourTo = (req.body.workingHourTo).split(":");
    const regex = /^([0,1][0-9]|2[0-3]):[0,3][0]$/;

    if(!(req.body.workingHourFrom).match(regex)) {
        if(!(req.body.workingHourTo).match(regex))
            return res.json({messageFrom: 'Radno vrijeme od neispravno!', isEditFrom: true, messageTo: 'Radno vrijeme do neispravno!', isEditTo: true});
        
        return res.json({messageFrom: 'Radno vrijeme od neispravno', isEditFrom: true, messageTo: 'Minuti mogu biti samo na pola sata, tipa 08:30 ili 09:00', isEditTo: false});
    } 

    if(!(req.body.workingHourTo).match(regex))
        return res.json({messageFrom: 'Minuti mogu biti samo na pola sata, tipa 08:30 ili 09:00', isEditFrom: false, messageTo: 'Radno vrijeme do neispravno!', isEditTo: true});
       
    
    if(parseInt(workingHourFrom[0]) >= parseInt(workingHourTo[0])) 
        return res.json({messageFrom: 'Radno vrijeme od ne može biti veće ili jednako od radnog vremena do!', isEditFrom: true, messageTo: 'Minuti mogu biti samo na pola sata, tipa 08:30 ili 09:00', isEditTo: false});

    try {
        const update = { 
            workingHourFrom: req.body.workingHourFrom, 
            workingHourTo: req.body.workingHourTo
        }

        await User.findOneAndUpdate({_id: req.body._id}, update, { new: true });

        return res.json({message: 'Radno vrijeme je uspješno promjenjeno', isEdit: true});
    } catch (error) {
        res.send(error);
    }
});

//Vraća radno vrijeme za jednog korisnika
router.get('/yourWorkingHours', verifyAccessToken, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user._id }, { id: 0, password: 0, __v: 0 });

        const response = {
            _id: user._id,
            firstName: user.firstName, 
            lastName: user.lastName, 
            workingHourFrom: user.workingHourFrom,
            workingHourTo: user.workingHourTo,
            position: user.position
        };
        
        return res.json({user: response});
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;