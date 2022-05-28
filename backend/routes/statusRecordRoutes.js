const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const StatusRecord = require('../models/StatusRecord');
const EmployeeStatus = require('../models/EmployeeStatus');
const User = require('../models/User');
const { verifyAccessToken } = require('../middlewares/verifyTokenMiddleware');
const { adminRoleAuth } = require('../middlewares/roleAuthMiddleware');

//Constants
const { STATUSRECORD } = require('../constants/employeeStatusRecordConstants');

router.post('/checkIn', verifyAccessToken, async (req, res) => {
    try {
        const statusRecord = new StatusRecord({
            userId: req.user._id,
            status: req.body.status.current,
            date: new Date(new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0)),
            flagSalary: false,
            flagCheckIn: true
        });
        await statusRecord.save();
    
        return res.json({message: 'Uspješna prijava!'});
    } catch (error) {
        res.send(error);
    }
});

router.get('/isCheckIn', verifyAccessToken, async (req, res) => {
    try {
        const statusRecord = await StatusRecord.find({userId: req.user._id}, { _id: 0, userId: 0, flagSalary: 0, __v: 0}).sort({date: 1});
        const today = new Date(new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000));
        const day = statusRecord.filter(x => {return new Date(new Date(x.date).setUTCHours(0,0,0,0)).toString() == new Date(new Date(today).setUTCHours(0,0,0,0)).toString()});

        if (today.getDay() === 6 || today.getDay() === 0) 
            return res.json(true);//testirati ovo ispod da li radi kada je prazno 
        else if(statusRecord.length === 0) 
            return res.json(false);
        else if(day.length === 0) 
            return res.json(false);
        
        return res.json(true);
    } catch (error) {
        res.json(false);
    }
});

router.get('/getStatusInCurrentMonth/:month/:year', verifyAccessToken, async (req, res) => {
    try {
        const status = [];
        const statusRecord = await StatusRecord.find({userId: req.user._id}, { _id: 0, userId: 0, flagSalary: 0, __v: 0});

        for(var i = 0; i < statusRecord.length; i++) 
            if(statusRecord[i].date.getMonth().toString() === req.params.month.toString() && statusRecord[i].date.getFullYear().toString() === req.params.year.toString() )
                status.push({day: statusRecord[i].date.getDate(), status: statusRecord[i].status});

        res.json({status: status});
    } catch (error) {
        res.send(error);
    }
});

router.get('/getHolidayDayLeft', verifyAccessToken, async (req, res) => {
    const user = await User.findById({_id: req.user._id});
    const userStatus = await StatusRecord.find({userId: req.user._id}, { _id: 0, userId: 0, flagSalary: 0, __v: 0});
    
    //Ako nema unešenih dnevnih statusa
    if(userStatus[0] === undefined)
        return res.json({vacationDay: user.vacation, vacationDayLeft: user.vacation});
    
    const userVacationStatus = userStatus.filter(status => status.status === STATUSRECORD.VACATION);
    const vacationDay = user.vacation;
    const vacationDayLeft = user.vacation - userVacationStatus.length;

    return res.json({vacationDay: vacationDay, vacationDayLeft: vacationDayLeft});
});

router.post('/setHoliday', verifyAccessToken, async (req, res) => {
    const user = await User.findById({_id: req.user._id});
    const dateFrom = new Date(new Date(new Date(req.body.dateFrom).getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0));
    const dateTo = new Date(new Date(new Date(req.body.dateTo).getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0));
    var vacationDayLeft = req.body.vacationDayLeft;
    const userStatus = await StatusRecord.find({userId: req.user._id}, { _id: 0, userId: 0, flagSalary: 0, __v: 0}).sort({date: 1});
    
    //Provjerava da li je datum od i datum od različit od vikenda
    if(dateFrom.getDay() === 0 || dateFrom.getDay() === 6 || dateTo.getDay() === 0 || dateTo.getDay() === 6)
        return res.json({message: "Odmor ne može početi ili završiti za dane vikenda!", isEditi: false});

    //Provjerava da li ima već neki status za taj dan
    var lastStatusDate = new Date(new Date(new Date(userStatus.pop().date).getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0));
    if(lastStatusDate !== undefined)
        if(lastStatusDate >= dateFrom)
            return res.json({message: "Postoji drugi status za taj period!", isEdit: false});

    //Provjerava da li je datum od manji od datuma do
    if(dateFrom > dateTo)
        return res.json({message: "Početak odmora ne može biti posle kraja odmora", isEdit: false});

    //Računa trajanje godišnjeg
    var durationOfVacation = 0;
    var date = new Date(new Date(new Date(req.body.dateFrom).getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0));
    var daysOfVacation = [];

    while (date <= dateTo) {
        if(date.getDay() !== 0 && date.getDay() !== 6) {
            durationOfVacation++;
            daysOfVacation.push(new Date(new Date(new Date(date).getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0)));
        }
        date.setDate(date.getDate() + 1);
    }

    //Provjerava da li ima ostalog godišnjeg odmora
    if(vacationDayLeft === 0) 
        return res.json({message: "Iskoristli ste sve dane godišnjeg odmora!", isEditi: false});
    else if(durationOfVacation > user.vacation || durationOfVacation > vacationDayLeft)
        return res.json({message: "Broj dana godišnjeg kojeg ste uzeli je veći od broja kojih imate!", isEdit: false});

    //Računa koliko ostaje godišnjeg
    vacationDayLeft = vacationDayLeft - daysOfVacation.length;
    
    try {
        daysOfVacation.forEach(async (day) => {
            const statusRecord = new StatusRecord({
                userId: req.user._id,
                status: STATUSRECORD.VACATION,
                date: new Date(new Date(new Date(day).getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0)),
                flagSalary: false,
                flagCheckIn: true
            });
            await statusRecord.save();
        });
        
        return res.json({message: "Odmor uspješno registrovan!", isEdit: true, vacationDayLeft: vacationDayLeft});    
    } catch (error) {
        res.send(error);
    }
});

router.post('/setOtherStatus', verifyAccessToken, async (req, res) => {
    const dateFrom = new Date(new Date(new Date(req.body.dateFrom).getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0));
    const dateTo = new Date(new Date(new Date(req.body.dateTo).getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0));
    const userStatus = await StatusRecord.find({userId: req.user._id}, { _id: 0, userId: 0, flagSalary: 0, __v: 0}).sort({date: 1});
    
    //Provjerava da li je datum od i datum od različit od vikenda
    if(dateFrom.getDay() === 0 || dateFrom.getDay() === 6 || dateTo.getDay() === 0 || dateTo.getDay() === 6)
        return res.json({message: `${req.body.status} ne može početi ili završiti za dane vikenda!`, isEditi: false});

    //Provjerava da li ima već neki status za taj dan
    var lastStatus = userStatus.pop();
    if(lastStatus !== undefined)
        if(lastStatus.date >= dateFrom)
            return res.json({message: "Postoji drugi status za taj period!", isEdit: false});

    //Provjerava da li je datum od manji od datuma do
    if(dateFrom > dateTo)
        return res.json({message: `Datum početka ne može biti prije datuma kraja!`, isEdit: false});

    //Izbacuje vikende
    var date = new Date(new Date(new Date(req.body.dateFrom).getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0));
    var daysOfVacation = [];

    while (date <= dateTo) {
        if(date.getDay() !== 0 && date.getDay() !== 6) 
            daysOfVacation.push(new Date(new Date(new Date(date).getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0)));
        
        date.setDate(date.getDate() + 1);
    }
    
    try {
        daysOfVacation.forEach(async (day) => {
            const statusRecord = new StatusRecord({
                userId: req.user._id,
                status: req.body.status,
                date: new Date(new Date(new Date(day).getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0)),
                flagSalary: false,
                flagCheckIn: true
            });
            await statusRecord.save();
        });
        
        return res.json({message: `${req.body.status} uspješno registrovan!`, isEdit: true});    
    } catch (error) {
        res.send(error);
    }
});

router.get('/getWorkingReport/:_id/:month/:year', verifyAccessToken, adminRoleAuth, async (req, res) => {
    const userEmployeeStatus = await EmployeeStatus.find({userId: req.params._id}, {_id: 0, userId: 0, status: 0, description: 0, __v: 0}).sort({dateStatusChange: 1});
    const userReportStatus = await StatusRecord.aggregate([
        {$match:
            {$expr: 
                {$or: [
                    {
                        $and: [
                            { $eq: [{ $month: "$date" }, parseInt(req.params.month)] },
                            { $eq: [{ $year: "$date" }, parseInt(req.params.year)] },
                        ]
                    }
                ]},
             userId: mongoose.Types.ObjectId(req.params._id)
            }
        }
    ]).sort({date: 1});

    //Provjerava da li ima uposlenik status i da li ima unešenih dnevnih statusa
    if(userEmployeeStatus.length === 0)
        return res.json({message: "Zaposlenik još nema radni status!", isEdit: false});
    if(userReportStatus.length === 0)
        return res.json({message: "Ne postoji izvještaj za ovaj mjesec, jer uposlenik nije bio zaposlen u tom periodu!", isEdit: false});
    
    try {
        const tableHeaders = [['Id', 'Datum', 'Status']];
        const statusJSON = ['index', 'date', 'status'];
        var status = [];

        userReportStatus.forEach((dayStatus, index) => {
            status.push({
                index: index + 1,
                date: dayStatus.date.getDate() + "/" + (dayStatus.date.getMonth() + 1) + "/" + dayStatus.date.getFullYear(),
                status: dayStatus.status
            });
        });

        return res.json({message: 'Izvještaj uspješno generisan!', isEdit: true, tableHeaders: tableHeaders, statusJSON: statusJSON, status: status});
    } catch(error) {
        res.send(error);
    }
});

router.get('/getWholeWorkingReport/:_id', verifyAccessToken, adminRoleAuth, async (req, res) => { 
    const userEmployeeStatus = await EmployeeStatus.find({userId: req.params._id}, {_id: 0, userId: 0, status: 0, description: 0, __v: 0}).sort({dateStatusChange: 1});
    const userReportStatus = await StatusRecord.find({userId: req.params._id}).sort({date: 1});

    //Provjerava da li ima uposlenik status i da li ima unešenih dnevnih statusa
    if(userEmployeeStatus.length === 0)
        return res.json({message: "Zaposlenik još nema radni status!", isEdit: false});
    if(userReportStatus.length === 0)
        return res.json({message: "Zaposlenik još uvijek nije unio nijedan dnevni status!", isEdit: false});

    try {
        const tableHeaders = [['Id', 'Datum', 'Status']];
        const statusJSON = ['index', 'date', 'status'];
        var status = [];
        var i = 1;

        userReportStatus.forEach(dayStatus => {
            status.push({
                index: i,
                date: dayStatus.date.getDate() + "/" + (dayStatus.date.getMonth() + 1) + "/" + dayStatus.date.getFullYear(),
                status: dayStatus.status
            });
            i++;
        });

        return res.json({message: 'Izvještaj uspješno generisan!', isEdit: true, tableHeaders: tableHeaders, statusJSON: statusJSON, status: status});
    } catch(error) {
        res.send(error);
    }
});


router.get('/getWorkingReportForAllUsers/:month/:year', verifyAccessToken, adminRoleAuth, async (req, res) => {
    const userReportStatus = await StatusRecord.aggregate([
        {$match:
            {$expr: 
                {$or: [
                    {
                        $and: [
                            { $eq: [{ $month: "$date" }, parseInt(req.params.month)] },
                            { $eq: [{ $year: "$date" }, parseInt(req.params.year)] },
                        ]
                    }
                ]}
            }
        },
        {$lookup: 
            {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'UserAndStatus'
            }
        }
    ]).sort({userId: 1, date: 1});

    //Provjerava da li uposlenici imaju status i da li ima unešenih dnevnih statusa
    if(userReportStatus.length === 0)
        return res.json({message: "Ne postoji ukupni izvještaj za ovaj mjesec!", isEdit: false});
    
    try {
        const tableHeaders = [['Id', 'Ime i prezime','Datum', 'Status']];
        const statusJSON = ['index', 'name','date', 'status'];
        var status = [];
        
        userReportStatus.forEach((dayStatus, index) => {
                status.push({
                    index: index + 1,
                    name: dayStatus.UserAndStatus[0].firstName + " " + dayStatus.UserAndStatus[0].lastName,
                    date: dayStatus.date.getDate() + "/" + (dayStatus.date.getMonth() + 1) + "/" + dayStatus.date.getFullYear(),
                    status: dayStatus.status
                });
            }
        );

        return res.json({message: 'Izvještaj uspješno generisan!', isEdit: true, tableHeaders: tableHeaders, statusJSON: statusJSON, status: status});
    } catch(error) {
        res.send(error);
    }
});

router.get('/getWholeWorkingReportForAllUsers', verifyAccessToken, adminRoleAuth, async (req, res) => { 
    const userEmployeeStatus = await EmployeeStatus.find({}, {_id: 0, userId: 0, status: 0, description: 0, __v: 0}).sort({dateStatusChange: 1});
    const userReportStatus = await StatusRecord.aggregate([
        {$lookup: 
            {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'UserAndStatus'
            }
        }
    ]).sort({userId: 1, date: 1});

    //Provjerava da li ima uposlenik status i da li ima unešenih dnevnih statusa
    if(userEmployeeStatus.length === 0)
        return res.json({message: "Zaposleni još nemaju radni status!", isEdit: false});
    if(userReportStatus.length === 0)
        return res.json({message: "Zaposlenici još nisu unjeli  nijedan dnevni status!", isEdit: false});

    try {
        const tableHeaders = [['Id', 'Ime i prezime','Datum', 'Status']];
        const statusJSON = ['index', 'name','date', 'status'];
        var status = [];
        
        userReportStatus.forEach((dayStatus, index) => {
                status.push({
                    index: index + 1,
                    name: dayStatus.UserAndStatus[0].firstName + " " + dayStatus.UserAndStatus[0].lastName,
                    date: dayStatus.date.getDate() + "/" + (dayStatus.date.getMonth() + 1) + "/" + dayStatus.date.getFullYear(),
                    status: dayStatus.status
                });
            }
        );

        return res.json({message: 'Izvještaj uspješno generisan!', isEdit: true, tableHeaders: tableHeaders, statusJSON: statusJSON, status: status});
    } catch(error) {
        res.send(error);
    }
});

module.exports = router;