const Joi = require('@hapi/joi');
const jmbg = require('jmbg');

//Validacija za kreiranje korisnika
const createUserValidation = (data) => {
    const userSchemaValidaion = Joi.object({
        firstName: Joi.string().regex(/^[a-zA-ZšŠđĐžŽčČćĆ]*$/).min(3).required().messages({
            "string.pattern.base": `"firstName" Ime bi trebalo da bude od slova!`, 
            "string.min": `"firstName" Ime bi trebalo da ima minimalno 3 karaktera!`,
            "string.empty": `"firstName" Ime je obavezno!`,
            "any.required": `"firstName" Ime je obavezno!`
        }),
        lastName: Joi.string().regex(/^[a-zA-ZšŠđĐžŽčČćĆ]*$/).min(3).required().messages({
            "string.pattern.base": `"lastName" Prezime bi trebalo da bude od slova!`,
            "string.min": `"lastName" Prezime bi trebalo da ima minimalno 3 karaktera!`,
            "string.empty": `"lastName" Prezime je obavezno!`,
            "any.required": `"lastName" Prezime je obavezno!`
        }),
        address: Joi.string().min(5).required().messages({
            "string.min": `"address" Adresa bi trebala da ima minamalno 5 karaktera!`,
            "string.empty": `"address" Adresa je obavezna!`,
            "any.required": `"address" Adresa je obavezna!`
        }),
        jmbg: Joi.string().required().messages({
            "string.empty": `"jmbg" JMBG je obavezan!`,
            "any.required": `"jmbg" JMBG je obavezan!`
        }),
        email: Joi.string().email().required().messages({
            "string.email": `"email" Email nije validan!`,
            "string.empty": `"email" Email je obavezan!`,
            "any.required": `"email" Email je obavezan!`
        }),
        position: Joi.string().regex(/^[a-zA-ZšŠđĐžŽčČćĆ ]*$/).required().messages({
            "string.pattern.base": `"position" Pozicija bi trebala da bude od slova!`,
            "string.empty": `"position" Pozicija je obavezna!`,
            "any.required": `"position" Pozicija je obavezna!`
        }),
        personalDeductions: Joi.number().min(0).required().messages({
            "number.min": `"personalDeductions" Lični odbitak ne može biti manji od nule!`,
            "number.empty": `"personalDeductions" Lični odbitak je obavezan!`,
            "any.required": `"personalDeductions" Lični odbitak je obavezan!`
        }),
        hourlyWage: Joi.number().min(2.05).required().messages({
            "number.min": `"hourlyWage" Satnica bi trebala da bude minimalno 2,05 KM!`,
            "number.empty": `"hourlyWage" Satnica je obavezna!`,
            "any.required": `"hourlyWage" Satnica je obavezna!`
        }),
        vacation: Joi.number().min(0).required().messages({
            "number.min": `"vacation" Broj dana godišnjeg ne može biti negativan!`,
            "number.empty": `"vacation" Broj dana godišnjeg je obavezan!`,
            "any.required": `"vacation" Broj dana godišnjeg je obavezan!`
        }),
        role: Joi.string().required()
    }).options({ abortEarly: false });
    return userSchemaValidaion.validate(data);
}

//Validacija lozinke
const passwordValidation = (data) => {
    const passwordSchemaValidation = Joi.object({
        password: Joi.string().min(8).required().messages({
            "string.min": `Lozinka bi trebala da ima minimalno 8 karaktera!`,
            "string.empty": `Lozinka je obavezna!`,
            "any.required": `Lozinka je obavezna!`
        })
    }).options({ abortEarly: false });
    
    return passwordSchemaValidation.validate(data);
}

//Validacija JMBG
const jmbgValidation = (data) => {
    return jmbg.isValid(data);
}

module.exports.createUserValidation = createUserValidation;
module.exports.jmbgValidation = jmbgValidation;
module.exports.passwordValidation = passwordValidation;