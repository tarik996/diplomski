const express = require('express');
const router = express.Router();
const calendarFunction = require('../helpers/calendarFunction');

//Routes for screen 

router.get('/getDaysInCurrentMonth', async (req, res) => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    var currentMonthName = calendarFunction.nameOfMonths(currentMonth);
    var daysInCurrentMonth = calendarFunction.daysInMonth(currentYear, currentMonth+1);
    
    return res.json({daysInCurrentMonth: daysInCurrentMonth, currentDay: currentDay, currentMonthName: currentMonthName, month: currentMonth, currentYear: currentYear});
});

router.post('/getNextMonth', async (req, res) => {
    const nextMonth = req.body.month;
    const year = req.body.year;

    var nextMonthName = calendarFunction.nameOfMonths(nextMonth);
    var daysInNextMonth = calendarFunction.daysInMonth(year, nextMonth+1);
    var today = calendarFunction.today(year, nextMonth);

    return res.json({daysInNextMonth: daysInNextMonth, nextMonthName: nextMonthName, month: nextMonth, year: year, today: today});
});

router.post('/getPreviousMonth', async (req, res) => {
    const previousMonth = req.body.month;
    const year = req.body.year;

    var previousMonthName = calendarFunction.nameOfMonths(previousMonth);
    var daysInPreviousMonth = calendarFunction.daysInMonth(year, previousMonth+1);
    var today = calendarFunction.today(year, previousMonth);

    return res.json({daysInPreviousMonth: daysInPreviousMonth, previousMonthName: previousMonthName, month: previousMonth, year: year, today: today});
});

//Routes for mobile 

router.get('/getDaysInCurrentWeek', async (req, res) => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth()+1;
    const currentYear = currentDate.getFullYear();
    const daysInCurrentMonth = calendarFunction.daysInMonthMobile(currentYear, currentMonth);
    
    var daysInCurrentWeekDefault = calendarFunction.currentWeekValue(daysInCurrentMonth, currentDate)[0];
    var daysInCurrentWeek = calendarFunction.currentWeekValue(daysInCurrentMonth, currentDate)[1];
    var startOfWeek = calendarFunction.currentWeekValue(daysInCurrentMonth, currentDate)[2];
    var endOfWeek = calendarFunction.currentWeekValue(daysInCurrentMonth, currentDate)[3];
    
    return res.json({currentDay: currentDay, startOfWeek: startOfWeek, endOfWeek: endOfWeek, daysInCurrentWeek: daysInCurrentWeek, daysInCurrentWeekDefault: daysInCurrentWeekDefault ,currentYear: currentYear})
});

router.post('/getDaysInNextWeek', async (req, res) => {
    var currentYear = parseInt(req.body.currentYear);
    var calendar = calendarFunction.calendarForYear(currentYear);
    const week = [...(req.body.daysInCurrentWeek)].toString();
    const newCalendar = [];

    for (var i = 0; i < calendar.length; i++) 
        newCalendar.push(calendar[i].toString());

    var indexOfNextWeek = newCalendar.indexOf(week);
    var nextWeek = [];

    if(indexOfNextWeek === calendar.length - 1) {
        currentYear = currentYear + 1;
        indexOfNextWeek = 0;
        nextWeek = [...calendarFunction.calendarForYear(currentYear)][indexOfNextWeek];
    } else {
        indexOfNextWeek = indexOfNextWeek + 1;
        nextWeek = calendar[indexOfNextWeek];
    }

    if(nextWeek.toString() === week) {
        indexOfNextWeek = indexOfNextWeek + 1;
        nextWeek = [...calendarFunction.calendarForYear(currentYear)][indexOfNextWeek]
    }

    var today = calendarFunction.weekValue(nextWeek)[0];
    var startOfWeek = calendarFunction.weekValue(nextWeek)[1];
    var endOfWeek = calendarFunction.weekValue(nextWeek)[2];
    var daysInCurrentWeek = calendarFunction.weekValue(nextWeek)[3];

    return res.json({nextWeek: nextWeek, daysInCurrentWeek: daysInCurrentWeek, currentYear: currentYear, today: today, startOfWeek: startOfWeek, endOfWeek: endOfWeek});
});

router.post('/getDaysInPreviousWeek', async (req, res) => {
    var currentYear = parseInt(req.body.currentYear);
    var calendar = calendarFunction.calendarForYear(currentYear);
    const week = [...(req.body.daysInCurrentWeek)].toString();
    const newCalendar = [];

    for (var i = 0; i < calendar.length; i++) 
        newCalendar.push(calendar[i].toString());

    var indexOfNextWeek = newCalendar.indexOf(week);
    var nextWeek = [];

    if(indexOfNextWeek === 0) {
        currentYear = currentYear - 1;
        indexOfNextWeek = [...calendarFunction.calendarForYear(currentYear)].length-1;
        nextWeek = [...calendarFunction.calendarForYear(currentYear)][indexOfNextWeek];
    } else {
        indexOfNextWeek = indexOfNextWeek - 1;
        nextWeek = calendar[indexOfNextWeek];
    }

    if(nextWeek.toString() === week) {
        indexOfNextWeek = indexOfNextWeek - 1;
        nextWeek = [...calendarFunction.calendarForYear(currentYear)][indexOfNextWeek]
    }

    var today = calendarFunction.weekValue(nextWeek)[0];
    var startOfWeek = calendarFunction.weekValue(nextWeek)[1];
    var endOfWeek = calendarFunction.weekValue(nextWeek)[2];
    var daysInCurrentWeek = calendarFunction.weekValue(nextWeek)[3];

    return res.json({nextWeek: nextWeek, daysInCurrentWeek: daysInCurrentWeek, currentYear: currentYear, today: today, startOfWeek: startOfWeek, endOfWeek: endOfWeek});
});

module.exports = router;