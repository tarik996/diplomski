const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const StatusRecord = require('../models/StatusRecord');
const Sallary = require('../models/Sallary');
const User = require('../models/User');
const Calculation = require('../models/Calculation')
const { verifyAccessToken } = require('../middlewares/verifyTokenMiddleware');
const { adminRoleAuth, adminAccountantRoleAuth, accountantRoleAuth } = require('../middlewares/roleAuthMiddleware');

router.post('/calculateSallary', verifyAccessToken, accountantRoleAuth, async (req, res) => {
    const dateFrom = new Date(new Date(new Date(req.body.dateFrom).getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0));
    const dateTo = new Date(new Date(new Date(req.body.dateTo).getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0));

    //Provjerava da li je datuom do manji od datuma od
    if(dateFrom >= dateTo) 
        return res.json({message: "Datum od ne može biti veći od datuma do!", isEdit: false});
    
    //Maksimalno 35 dana moze obračun plate
    if(Math.ceil((dateTo - dateFrom) / (1000 * 60 * 60 * 24)) > 35)
        return res.json({message: "Ne možete obračunati platu za period veći od 35 dana", isEdit: false});
    
    //Minimalno 28 dana može obračun plate
    if(Math.ceil((dateTo - dateFrom) / (1000 * 60 * 60 * 24)) < 26)
        return res.json({message: "Ne možete obračunati platu za period manji od 28 dana", isEdit: false});
    
    //Provjerava da li postoji već obračun za taj period
    const calculations = await Calculation.find();
    
    for(var i = 0; i < calculations.length; i++) {
        const calculationDateFrom = new Date(new Date(new Date(calculations[i].dateFrom).getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0));
        const calculationDateTo = new Date(new Date(new Date(calculations[i].dateTo).getTime() - new Date().getTimezoneOffset() * 60 * 1000).setUTCHours(0,0,0,0));
        
        if(calculationDateFrom >= dateFrom || calculationDateTo >= dateFrom)
            return res.json({message: "Postoji obračun koji se poklapa sa datumom od!", isEdit: false});
        
        if(calculationDateFrom >= dateTo || calculationDateTo >= dateTo)
            return res.json({message: "Postoji obračun koji se poklapa sa datumom od!", isEdit: false});
    }

    //Provjerava da li je firma imala zaposlenih za taj period i izvlači uposlenike koji su radili taj mjesec
    const userReportStatus = await StatusRecord.aggregate([
        {$match:
            {
                date: {
                    $gte: dateFrom,
                    $lte: dateTo
                },
                status: {
                    $ne: 'Neplaćeno odsustvo'
                },
                flagSalary: {
                    $eq: false
                }
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

    if(userReportStatus.length === 0)
        return res.json({message: "Ne postoji obračun za taj period!", isEdit: false});

    try  {
        const users = await User.find();

        //Kreiranje obračuna 
        const calculation = new Calculation({
            dateFrom: dateFrom,
            dateTo: dateTo
        });

        await calculation.save();

        //Obračun plate za svakog uposlenika
        users.forEach(async user => {
            var userDaysOfWork = 0;
            var netoSallary = 0; 
            var brutoSallary = 0;
            var workingHours = parseInt(user.workingHourTo) - parseInt(user.workingHourFrom);
        
            userReportStatus.filter(element => {
                if(element.userId.toString() == user._id.toString()) 
                    userDaysOfWork++;
            });

            if(userDaysOfWork !== 0) {
                netoSallary = userDaysOfWork * user.hourlyWage * workingHours - user.personalDeductions;
                brutoSallary = netoSallary + netoSallary * 0.7;

                console.log(user.firstName + " " + netoSallary + " " + brutoSallary)

                const sallary = new Sallary({
                    userId: user._id,
                    calculationId: calculation._id,
                    brutoSallary: brutoSallary,
                    netoSallary: netoSallary
                });

                await sallary.save();
            }
        });

        return res.json({message: "Uspješno urađen obračun!", isEdit: true});
    } catch (error) {
        console.log(error);
    }
});

router.get('/sallaryReportRange', verifyAccessToken, async (req, res) => {
    const calculation = await Calculation.find({}, { __v: 0 });
    
    return res.json({calculation: calculation});
});

router.get('/getSallaryRangeReport/:_id', verifyAccessToken, adminAccountantRoleAuth, async (req, res) => {
    if(req.params._id === "1")
        return res.json({message: "Ne postoji nijedan izvještaj!", isEdit: false});

    const sallary = await Sallary.aggregate([
        {$match:
            {
                calculationId: mongoose.Types.ObjectId(req.params._id)
            }
        },
        {$lookup: 
            {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'User'
            },
        },
        {$lookup:   
            {
                from: 'calculations',
                localField: 'calculationId',
                foreignField: '_id',
                as: 'Calculation'
            }
        }
    ]);
    
    const tableHeaders = [['Id', 'Ime i prezime','Datum', 'Bruto', 'Neto']];
    const sallaryReportJSON = ['index', 'name','date', 'bruto', 'neto'];
    const sallaryRange = sallary[0].Calculation[0].dateFrom.getDate() + "/" + (sallary[0].Calculation[0].dateFrom.getMonth() + 1) + "/" + sallary[0].Calculation[0].dateFrom.getFullYear() + "-" +
                         sallary[0].Calculation[0].dateTo.getDate() + "/" + (sallary[0].Calculation[0].dateTo.getMonth() + 1) + "/" + sallary[0].Calculation[0].dateTo.getFullYear()
    const sallaryReport = [];

    sallary.forEach((userSallary, index) => {
        sallaryReport.push({
            index: index + 1,
            name: userSallary.User[0].firstName + " " + userSallary.User[0].lastName,
            date: sallaryRange,
            bruto: Math.ceil(userSallary.brutoSallary),
            neto: Math.ceil(userSallary.netoSallary)
        });
    })

    return res.json({message: "Uspješno generisan izvještaj", sallaryRange: sallaryRange, sallaryReport: sallaryReport, tableHeaders: tableHeaders, sallaryReportJSON: sallaryReportJSON, isEdit: true});
});

router.get('/getAllSallaryRangeReport/:_id', verifyAccessToken, async (req, res) => {
    if(req.params._id === "1")
        return res.json({message: "Izaberite jedan od izvještaja!", isEdit: false});

    const sallary = await Sallary.aggregate([
        {$match:
            {
                calculationId: mongoose.Types.ObjectId(req.params._id),
                userId: mongoose.Types.ObjectId(req.user._id)
            }
        },
        {$lookup: 
            {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'User'
            },
        },
        {$lookup:   
            {
                from: 'calculations',
                localField: 'calculationId',
                foreignField: '_id',
                as: 'Calculation'
            }
        }
    ]);

    if(sallary.length === 0)
        return res.json({message: "Ne postoji izvještaj za taj period!", isEdit: false});
    
    const tableHeaders = [['Id', 'Ime i prezime','Datum', 'Bruto', 'Neto']];
    const sallaryReportJSON = ['index', 'name','date', 'bruto', 'neto'];
    const sallaryRange = sallary[0].Calculation[0].dateFrom.getDate() + "/" + (sallary[0].Calculation[0].dateFrom.getMonth() + 1) + "/" + sallary[0].Calculation[0].dateFrom.getFullYear() + "-" +
                         sallary[0].Calculation[0].dateTo.getDate() + "/" + (sallary[0].Calculation[0].dateTo.getMonth() + 1) + "/" + sallary[0].Calculation[0].dateTo.getFullYear()
    const sallaryReport = [];

    sallary.forEach((userSallary, index) => {
        sallaryReport.push({
            index: index + 1,
            name: userSallary.User[0].firstName + " " + userSallary.User[0].lastName,
            date: sallaryRange,
            bruto: Math.ceil(userSallary.brutoSallary),
            neto: Math.ceil(userSallary.netoSallary)
        });
    })

    return res.json({message: "Uspješno generisan izvještaj", sallaryRange: sallaryRange, sallaryReport: sallaryReport, tableHeaders: tableHeaders, sallaryReportJSON: sallaryReportJSON, isEdit: true});
});

router.get('/getAllSallaryReport', verifyAccessToken, adminAccountantRoleAuth, async (req, res) => {
    const sallary = await Sallary.aggregate([
        {$lookup: 
            {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'User'
            },
        },
        {$lookup:   
            {
                from: 'calculations',
                localField: 'calculationId',
                foreignField: '_id',
                as: 'Calculation'
            }
        }
    ]).sort({userId: 1});

    if(sallary.length === 0)
        return res.json({message: "Ne postoji nijedan izvještaj!", isEdit: false});

    const tableHeaders = [['Id', 'Ime i prezime','Datum', 'Bruto', 'Neto']];
    const sallaryReportJSON = ['index', 'name','date', 'bruto', 'neto'];
    const sallaryReport = [];

    sallary.forEach((userSallary, index) => {
        sallaryReport.push({
            index: index + 1,
            name: userSallary.User[0].firstName + " " + userSallary.User[0].lastName,
            date: userSallary.Calculation[0].dateFrom.getDate() + "/" + (userSallary.Calculation[0].dateFrom.getMonth() + 1) + "/" + userSallary.Calculation[0].dateFrom.getFullYear() + "-" +
                  userSallary.Calculation[0].dateTo.getDate() + "/" + (userSallary.Calculation[0].dateTo.getMonth() + 1) + "/" + userSallary.Calculation[0].dateTo.getFullYear(),
            bruto: Math.ceil(userSallary.brutoSallary),
            neto: Math.ceil(userSallary.netoSallary)
        });
    })

    return res.json({message: "Uspješno generisan izvještaj", sallaryReport: sallaryReport, tableHeaders: tableHeaders, sallaryReportJSON: sallaryReportJSON, isEdit: true});
});

router.get('/getUserAllSallaryReport', verifyAccessToken, async (req, res) => {
    const sallary = await Sallary.aggregate([
        {$match:
            {
                userId: mongoose.Types.ObjectId(req.user._id)
            }
        },
        {$lookup: 
            {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'User'
            },
        },
        {$lookup:   
            {
                from: 'calculations',
                localField: 'calculationId',
                foreignField: '_id',
                as: 'Calculation'
            }
        }
    ]);

    if(sallary.length === 0)
        return res.json({message: "Ne postoji nijedan izvještaj!", isEdit: false});

    const tableHeaders = [['Id', 'Ime i prezime','Datum', 'Bruto', 'Neto']];
    const sallaryReportJSON = ['index', 'name','date', 'bruto', 'neto'];
    const sallaryReport = [];

    sallary.forEach((userSallary, index) => {
        sallaryReport.push({
            index: index + 1,
            name: userSallary.User[0].firstName + " " + userSallary.User[0].lastName,
            date: userSallary.Calculation[0].dateFrom.getDate() + "/" + (userSallary.Calculation[0].dateFrom.getMonth() + 1) + "/" + userSallary.Calculation[0].dateFrom.getFullYear() + "-" +
                  userSallary.Calculation[0].dateTo.getDate() + "/" + (userSallary.Calculation[0].dateTo.getMonth() + 1) + "/" + userSallary.Calculation[0].dateTo.getFullYear(),
            bruto: Math.ceil(userSallary.brutoSallary),
            neto: Math.ceil(userSallary.netoSallary)
        });
    })

    return res.json({message: "Uspješno generisan izvještaj", sallaryReport: sallaryReport, tableHeaders: tableHeaders, sallaryReportJSON: sallaryReportJSON, isEdit: true});
});

module.exports = router;