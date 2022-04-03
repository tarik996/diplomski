const USERBOOL = Object.freeze({
    firstNameBool: false, 
    lastNameBool: false, 
    jmbgBool: false, 
    addressBool: false,
    emailBool: false, 
    positionBool: false,
    personalDeductionsBool: false, 
    hourlyWageBool: false, 
    vacationBool: false
});

const USERMESSAGES = Object.freeze({
    firstNameError: "", 
    lastNameError: "", 
    jmbgError: "", 
    addressError: "",
    emailError: "", 
    positionError: "", 
    personalDeductionsError: "",
    hourlyWageError: "", 
    vacationError: ""
});

const DEFAULTUSER = Object.freeze({
    firstName: "", 
    lastName: "", 
    jmbg: "", 
    address: "",
    email: "", 
    position: "", 
    personalDeductions: 0,
    hourlyWage: 2.05, 
    vacation: 0,
    role: 'Zaposlenik'
});

exports.USERBOOL = USERBOOL;
exports.USERMESSAGES = USERMESSAGES;
exports.DEFAULTUSER = DEFAULTUSER;