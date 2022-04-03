const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const generatePassword = require('../helpers/generatePassword');
const sendEmail = require('../helpers/sendEmail');
const { passwordValidation } = require('../validation/userValidation');
const { verifyAccessToken } = require('../middlewares/verifyTokenMiddleware');
const { adminRoleAuth } = require('../middlewares/roleAuthMiddleware');

router.put('/forgotpassword', async (req, res) => {
    //Provjerava da li postoji korisnik sa unešenim emailom
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.json({ message: 'Ne postoji korisnik sa unešenom email adresom!' , success: false });
    
    try {
        //Generisanje nove lozinke i hesiranje te lozinke
        const newPassword = generatePassword();
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);

        //Promjena lozinke u bazi
        await User.updateOne({ email: req.body.email }, { password: hashPassword});

        //Slanje emaila sa novom lozinkom
        await sendEmail(req.body.email, 'Promjena lozinke', `Uspješno ste promjenili lozinku i ona glasi ${newPassword}`);

        return res.json({ message: 'Uspješno ste promjenili password!', success: true});   
    } catch (error) {
        res.send(error);
    }
});

router.put('/adminChangePassword/:_id', verifyAccessToken, adminRoleAuth, async (req, res) => {
    try {
        //Nova lozinka za korisnika
        const password = generatePassword();
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        //Promjena lozinke u bazi
        await User.updateOne({ _id: req.params._id }, { password: hashPassword});

        //Slanje emaila sa novom lozinkom
        await sendEmail(req.body.email, 'Resetovanje lozinke', `Admin vam je uspješno resetova lozinku i ona glasi ${password}`);

        return res.json({ message: 'Uspješno ste promjenili password!', success: true});   
    } catch (error) {
        res.send(error);
    }
});

router.put('/changePassword', verifyAccessToken, async (req, res) => {
    //Validacija nove lozinke i provjera tačnosti stare lozinke
    const user = await User.findById(req.body._id);
    const passwordCompare = await bcrypt.compare(req.body.oldPassword, user.password);
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    const { error } = passwordValidation({password: req.body.newPassword});

    var errorMessage = req.body.errorMessage;
    var errorBool = req.body.errorBool;

    if (!passwordCompare) {
        req.body.oldPassword === "" ? errorMessage.messageOldPassword = 'Stara lozinka je obavezna!' :
                             errorMessage.messageOldPassword = 'Unešena lozinka se ne poklapa sa trenutnom!';
        errorBool.errorOldPassword = true;

        return res.json({errorBool: errorBool, errorMessage: errorMessage, success: false, message: ""});
    }  
    else if (newPassword !== confirmPassword) {
        errorMessage.messageConfirmPassword = 'Nove lozinke nisu jednake!';
        errorBool.errorConfirmPassword = true;
        
        return res.json({errorBool: errorBool, errorMessage: errorMessage, success: false, message: ""});
    }
    else if (error) {
        errorMessage.messageConfirmPassword = error.stack.replace("ValidationError:","").split('.')[0].trim();
        errorBool.errorConfirmPassword = true;

        return res.json({errorBool: errorBool, errorMessage: errorMessage, success: false, message: ""});
    }

    try {
        //Heširanje lozinke
        const salt = await bcrypt.genSalt(10);
        const hashNewPassword = await bcrypt.hash(newPassword, salt);

        //Ažuriranje podataka u bazi
        const passwordUpdate = { password: hashNewPassword };
        await User.findOneAndUpdate({_id: user._id}, passwordUpdate, { new: true });
        
        return res.json({
            errorBool: {errorOldPassword: false, errorNewPassword: false, errorConfirmPassword: false}, 
            errorMessage: {messageOldPassword: "", messageNewPassword: "", messageConfirmPassword: ""},
            success: true, 
            message: "Lozinka je uspješno promjenjena"
        });
    } catch (error) {
        res.json(error);
    }
});

module.exports = router;