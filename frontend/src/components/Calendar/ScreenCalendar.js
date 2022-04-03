import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box , TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, Button } from '@mui/material';

//Icons
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const calendarTable = {
    width: '100%',
    height: '85vh'
};
const calendarTableHeadCell = {
    border: '1px groove',
    padding: '3px',
    textAlign: 'center'
};
const calendarTableCell = {
    width: 'calc(100%/7)',
    padding: '4px',
    border: '1px groove',
    verticalAlign: 'text-top',
    textAlign: 'right'
};
const calendarControls = {
    width: '100%',
    height: '15vh',
    borderTop: '1px groove',
    borderLeft: '1px groove',
    borderRight: '1px groove',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'  
};
const calendarToday = {
    width: 'calc(100%/7)',
    padding: '0',
    border: '1px groove',
    background: 'rgba(255, 255, 0, 0.2)'
};
const calendarButton = {
    display: 'inline-flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: '4px',
    width: '100%',
    height: '100%'
};
const calendarPreviousMonth = {
    width: 'calc(100%/7)',
    padding: '4px',
    border: '1px groove',
    verticalAlign: 'text-top',
    textAlign: 'right',
    color: 'black',
    opacity: '0.3'
}; 

const ScreenCalendar = () => {
    const [today, setToday] = useState(0);
    const [month, setMonth] = useState(0);
    const [monthName, setMonthName] = useState('');
    const [year, setYear] = useState(0);
    const [daysInMonth, setDaysInMonth] = useState([]);

    const handleNext = async () => {
        try {
            var nextMonth = month;
            var nextYear = year;

            if(month === 11) {
                nextMonth = 0;
                nextYear = nextYear + 1;
            } else
                nextMonth = nextMonth + 1;
            
            const calendar = await axios.post("http://localhost:5000/api/calendar/getNextMonth", {month: nextMonth, year: nextYear});
            setToday(calendar.data.today);
            setMonth(calendar.data.month);
            setMonthName(calendar.data.nextMonthName);
            setYear(calendar.data.year);
            setDaysInMonth(calendar.data.daysInNextMonth);
        } catch (error) {
            console.log(error);
        }
    }

    const handlePrevious = async () => {
        try {
            var previousMonth = month;
            var previousYear = year;

            if(month === 0) {
                previousMonth = 11;
                previousYear = previousYear - 1;
            } else
                previousMonth = previousMonth - 1;
            
            const calendar = await axios.post("http://localhost:5000/api/calendar/getPreviousMonth", {month: previousMonth, year: previousYear});
            setToday(calendar.data.today);
            setMonth(calendar.data.month);
            setMonthName(calendar.data.previousMonthName);
            setYear(calendar.data.year);
            setDaysInMonth(calendar.data.daysInPreviousMonth);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        let isSubscribed = true;
        
        const calendar = async () => {
            try {
                const calendar = await axios.get("http://localhost:5000/api/calendar/getDaysInCurrentMonth");
                if(isSubscribed) {
                    setToday(calendar.data.currentDay);
                    setMonth(calendar.data.month);
                    setMonthName(calendar.data.currentMonthName);
                    setYear(calendar.data.currentYear);
                    setDaysInMonth(calendar.data.daysInCurrentMonth);
                }
            } catch (error) {
                console.log(error);
            }   
        }
        
        calendar();
        return () => isSubscribed = false
    }, []);

    return (
        <Box>
            <Box sx={calendarControls}>
                <Button variant="contained" onClick={handlePrevious}>
                    <ArrowBackIosIcon />
                </Button>
                <Typography variant="h4">
                    {monthName.toString().concat('  ' + year.toString())}
                </Typography>
                <Button variant="contained" onClick={handleNext}>
                    <ArrowForwardIosIcon />
                </Button>
            </Box>
            <TableContainer>
                <Table sx={calendarTable}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={calendarTableHeadCell}>Pon</TableCell>
                            <TableCell sx={calendarTableHeadCell}>Uto</TableCell>
                            <TableCell sx={calendarTableHeadCell}>Sri</TableCell>
                            <TableCell sx={calendarTableHeadCell}>Čet</TableCell>
                            <TableCell sx={calendarTableHeadCell}>Pet</TableCell>
                            <TableCell sx={calendarTableHeadCell}>Sub</TableCell>
                            <TableCell sx={calendarTableHeadCell}>Ned</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            daysInMonth.map((week, indexRow) => {
                                return (
                                    <TableRow key={indexRow}>
                                        {
                                            week.map((day, indexCell) => {
                                                if(indexRow === 0 && day > 7)
                                                    return <TableCell key={indexCell} sx={calendarPreviousMonth}>{day}</TableCell>
                                                else if(daysInMonth.length -1 === indexRow && day < 7)
                                                    return <TableCell key={indexCell} sx={calendarPreviousMonth}>{day}</TableCell>
                                                else if(day === today) 
                                                    return (    
                                                        <TableCell key={indexCell} sx={calendarToday}>
                                                            <Button sx={calendarButton}>
                                                                {day}
                                                            </Button>
                                                        </TableCell>
                                                    )
                                                else
                                                    return <TableCell key={indexCell} sx={calendarTableCell}>{day}</TableCell>
                                            })
                                        }
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default ScreenCalendar;
