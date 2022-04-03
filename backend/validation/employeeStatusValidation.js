const Joi = require('@hapi/joi');

const employeeStatusValidation = (data) => { 
    const employeeStatusSchemaValidation = Joi.object({
        status: Joi.string().required().valid('Radi', 'Ne radi', 'Plaćeno odsustvo', 'Neplaćeno odsustvo').messages({
            "any.only": `"status" Ovaj status ne postoji`,
            "string.empty": `"status" Status je obavezan`,
            "any.required": `"status" Status je obavezan`
        }),
        description: Joi.string().allow(''),
        dateStatusChange: Joi.date().required().messages({
            "date.base": `"dateStatusChange" Datum nije validan!`,
            "date.empty": `"dateStatusChange" Datum promjene statusa je obavezan!`,
            "date.required": `"dateStatusChange" Datum promjene statusa je obavezan!`
        })
    }).options({ abortEarly: false });

    return employeeStatusSchemaValidation.validate(data);
}

module.exports.employeeStatusValidation = employeeStatusValidation;