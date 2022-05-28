const calendar = require('node-calendar');

const nameOfMonths = (number) => {
    var month = '';

    switch(number) {
        case 0:
            month = 'Januar'
            break;
        case 1:
            month = 'Februar'
            break;
        case 2:
            month = 'Mart'
            break;
        case 3:
            month = 'April'
            break;
        case 4:
            month = 'Maj'
            break;
        case 5:
            month = 'Jun'
            break; 
        case 6:
            month = 'Jul'
            break;   
        case 7:
            month = 'Avgust'
            break;  
        case 8:
            month = 'Septembar'
            break;  
        case 9:
            month = 'Oktobar'
            break;
        case 10:
            month = 'Novembar'
            break;
        case 11:
            month = 'Decembar'
            break;
    }
    return month;
}

const daysInMonth = (year, month) => {
    const pattern = /[0-9]+/i;
    const daysInMonth = new calendar.Calendar().monthdatescalendar(year, month);

    for(var i = 0; i < daysInMonth.length; i++) {
        for(var j = 0; j < daysInMonth[i].length; j++)
            daysInMonth[i][j] = parseInt(((((daysInMonth[i][j].toLocaleString("en-GB")).split(','))[0]).match(pattern))[0]);
    }

    return daysInMonth;
}

const today = (year, month) => {
    const date = new Date();

    if(year === date.getFullYear() && month === date.getMonth()){
        var today = date.getDate();
        return today;
    }
        
    else return 0;
}

module.exports = { nameOfMonths, daysInMonth, today };