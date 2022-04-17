const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const EmployeeStatus = require('../models/EmployeeStatus');
const { verifyAccessToken } = require('../middlewares/verifyTokenMiddleware');
const { createAccessToken } = require('../helpers/JWT');

//Constants
const { EMPLOYEESTATUS } = require('../constants/statusConstants');

router.get('/loggedIn', async (req, res) => {
    try {
        const accessToken = req.cookies["access-token"];
        if(!accessToken) return res.json(false);

        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        return res.json(true);
    } catch (error) {
        res.json(false);
    }
});

router.get('/roleAuthorization', async (req, res) => {
    try {
        const accessToken = req.cookies["access-token"];
        var authorization = 0;

        if(!accessToken) return res.json(authorization);

        const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const role = await Role.findById({_id: user.roleId}, {roleName: 0, __v: 0});
        authorization = role.type;

        return res.json(authorization);  
    } catch (error) {
        res.json(error);
    }
});

router.post('/login', async (req, res) => {
    //Provjera da li postoji korisnik sa unešenim emailom
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.json({ message: 'Pogrešna lozinka ili email!', validation: false });

    //Provjera da li je lozinka tačna
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.json({ message: 'Pogrešna lozinka ili email!', validation: false });

    //Provjerava da li ima uopšte status zaposlenik
    const employeeStatus = await EmployeeStatus.find({userId: user._id}, { _id: 0, userId: 0, description: 0, __v: 0 });
    if(employeeStatus.length === 0)
        return res.json({ message: 'Vaš status još nije ažuriran!', validation: false });
    
    const lastStatus = employeeStatus.pop();
    //Provjerava da li je status različit od "Ne radi", ako jeste dozvoliti ulazak na aplikaciju, ako nije onemogućiti
    if(lastStatus.status === EMPLOYEESTATUS.status2 && new Date(new Date(lastStatus.dateStatusChange).setUTCHours(0,0,0,0)) <= new Date()) 
        return res.json({ message: 'Više niste zaposlenik firme!', validation: false });
        
    //Provjerava da li je radni odnos stupio na snagu, ako jeste omogućiti ulazak na stranicu
    if(lastStatus.status === EMPLOYEESTATUS.status1 && new Date(new Date(lastStatus.dateStatusChange).setUTCHours(0,0,0,0)) > new Date(new Date().setUTCHours(0,0,0,0))) 
        return res.json({ message: 'Radni odnos još nije stupio na snagu!', validation: false });
    
    //Kreiranje i dodjela tokena
    const accessToken = await createAccessToken(user);

    try{
        return res.cookie("access-token", accessToken, {
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 30 * 1000,
            httpOnly: true,
            secure: true
        }).json({ message: 'Uspješno ste se prijavili!', validation: true });

    }catch(error){
        res.send(error);
    }
});

router.delete('/logout', verifyAccessToken , async (req, res) => {

    try{
        return res.cookie("access-token", "", {
            sameSite: 'strict',
            path: '/',
            expires: new Date(0),
            httpOnly: true,
            secure: true
        }).json({message: 'Uspješno ste se odjavili!', isLogOut: true});

    }catch(error){
        res.send(error);
    }
});

module.exports = router;