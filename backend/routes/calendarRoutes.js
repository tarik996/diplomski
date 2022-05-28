const express = require('express');
const router = express.Router();
const calendarFunction = require('../helpers/calendarFunction');

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

module.exports = router;