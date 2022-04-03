const errorMessage = (errorMessage, bool, messages) => {
    for(var i = 0; i < errorMessage.length; i++) {
        if(errorMessage[i].includes(`"firstName"`)){
            messages.firstNameError = errorMessage[i].replace(`"firstName"`,"").trim();
            bool.firstNameBool = true;
        }
        if(errorMessage[i].includes(`"lastName"`)) {
            messages.lastNameError = errorMessage[i].replace(`"lastName"`,"").trim();
            bool.lastNameBool = true;
        }
        if(errorMessage[i].includes(`"address"`)) {
            messages.addressError = errorMessage[i].replace(`"address"`,"").trim();
            bool.addressBool = true;
        }
        if(errorMessage[i].includes(`"email"`)) {
            messages.emailError = errorMessage[i].replace(`"email"`,"").trim();
            bool.emailBool = true;
        }
        if(errorMessage[i].includes(`"position"`)) {
            messages.positionError = errorMessage[i].replace(`"position"`,"").trim();
            bool.positionBool = true;
        }
        if(errorMessage[i].includes(`"personalDeductions"`)) {
            messages.personalDeductionsError = errorMessage[i].replace(`"personalDeductions"`,"").trim();
            bool.personalDeductionsBool = true;
        }
        if(errorMessage[i].includes(`"hourlyWage"`)) {
            messages.hourlyWageError = errorMessage[i].replace(`"hourlyWage"`,"").trim();
            bool.hourlyWageBool = true;
        }
        if(errorMessage[i].includes(`"vacation"`)) {
            messages.vacationError = errorMessage[i].replace(`"vacation"`,"").trim();
            bool.vacationBool = true;
        }
        if(errorMessage[i].includes(`"jmbg"`)) {
            messages.jmbgError = errorMessage[i].replace(`"jmbg"`,"").trim();
            bool.jmbgBool = true
        }
    }

    return [ messages, bool ];
}

const errorEmployeeStatusMessage = (errorMessage, bool, messages) => {
    for(var i = 0; i < errorMessage.length; i++) {
        if(errorMessage[i].includes(`"status"`)){
            messages.statusError = errorMessage[i].replace(`"status"`,"").trim();
            bool.statusBool = true;
        }
        if(errorMessage[i].includes(`"dateStatusChange"`)) {
            messages.dateStatusChangeError = errorMessage[i].replace(`"dateStatusChange"`,"").trim();
            bool.dateStatusChangeBool = true;
        }
    }

    return [ messages, bool ];
}

module.exports.errorMessage = errorMessage; 
module.exports.errorEmployeeStatusMessage = errorEmployeeStatusMessage;