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

const daysInMonthMobile = (year, month) => {
    const daysInMonth = new calendar.Calendar().monthdatescalendar(year, month);
    
    for(var i = 0; i < daysInMonth.length; i++) {
        for(var j = 0; j < daysInMonth[i].length; j++)
            daysInMonth[i][j] = ((daysInMonth[i][j].toLocaleString("en-GB")).split(','))[0];
    }

    return daysInMonth;
}

const calendarForYear = (year) => {
    const calendarForYear = new calendar.Calendar().yeardatescalendar(year);
    var newCalendar = [];

    for(var i = 0; i < calendarForYear.length; i++)
        for(var j = 0; j < calendarForYear[i].length; j++)
            for(var k = 0; k < calendarForYear[i][j].length; k++) {
                for(var z = 0; z < calendarForYear[i][j][k].length; z++)
                    calendarForYear[i][j][k][z] = ((calendarForYear[i][j][k][z].toLocaleString("en-GB")).split(','))[0];
                newCalendar.push(calendarForYear[i][j][k]);
            }

    return newCalendar;
}

const currentWeekValue = (daysInCurrentMonth, currentDate) => {
    const currentDateNewPattern = (((currentDate).toLocaleString("en-GB")).split(','))[0];
    
    var daysInCurrentWeekDefault = [];
    var daysInCurrentWeek = [];
    var startOfWeek = '';
    var endOfWeek = '';
    
    for(var i = 0; i < daysInCurrentMonth.length; i++) 
        if(daysInCurrentMonth[i].includes(currentDateNewPattern)) {
            startOfWeek = daysInCurrentMonth[i][0];
            endOfWeek = daysInCurrentMonth[i][6];
            const pattern = /[0-9]+/i;
            for(var j = 0; j < daysInCurrentMonth[i].length; j++) {
                daysInCurrentWeek.push(parseInt(((daysInCurrentMonth[i][j].toString()).match(pattern))[0]));
                daysInCurrentWeekDefault.push(daysInCurrentMonth[i][j]);
            }
        }
    
    return [daysInCurrentWeekDefault, daysInCurrentWeek, startOfWeek, endOfWeek];
}

const weekValue = (week) => {
    const date = new Date();
    const pattern = /[0-9]+/i;
    var today = '';
    const currentDateNewPattern = (((date).toLocaleString("en-GB")).split(','))[0];

    if(week.includes(currentDateNewPattern)) {
        today = date.getDate();
    }

    var daysInCurrentWeek = [];
    var startOfWeek = week[0];
    var endOfWeek = week[6];

    for(var i = 0; i < week.length; i++) 
        daysInCurrentWeek.push(parseInt(((week[i].toString()).match(pattern))[0]));
    

    return [today, startOfWeek, endOfWeek, daysInCurrentWeek];
}

const today = (year, month) => {
    const date = new Date();

    if(year === date.getFullYear() && month === date.getMonth()){
        var today = date.getDate();
        return today;
    }
        
    else return 0;
}

module.exports = { nameOfMonths, daysInMonth, today, daysInMonthMobile, calendarForYear, currentWeekValue, weekValue };