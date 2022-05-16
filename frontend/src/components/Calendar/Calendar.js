import { useEffect, useState } from 'react';
import { Box , Button } from '@mui/material';

//CSS
import './calendar.css';

//Icons
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

//Constants
import { DAYS } from '../../constants/CalendarConstants';

//Api
import { getDaysInCurrentMonth, getNextMonth, getPreviousMonth } from '../../api/APIScreenCalendar';


const ScreenCalendar = () => {
    const [today, setToday] = useState(0);
    const [month, setMonth] = useState(0);
    const [monthName, setMonthName] = useState('');
    const [year, setYear] = useState(0);
    const [daysInMonth, setDaysInMonth] = useState([]);

    const handleNext = async () => {
        getNextMonth(month, year).then((calendar) => {
            setToday(calendar.data.today);
            setMonth(calendar.data.month);
            setMonthName(calendar.data.nextMonthName);
            setYear(calendar.data.year);
            setDaysInMonth(calendar.data.daysInNextMonth);
        });
    }

    const handlePrevious = async () => {
        getPreviousMonth(month, year).then((calendar) => {
            setToday(calendar.data.today);
            setMonth(calendar.data.month);
            setMonthName(calendar.data.previousMonthName);
            setYear(calendar.data.year);
            setDaysInMonth(calendar.data.daysInPreviousMonth);
        });
    }

    useEffect(() => {
        let isSubscribed = true;
        
        getDaysInCurrentMonth().then((calendar) => {
            if(isSubscribed) {
                setToday(calendar.data.currentDay);
                setMonth(calendar.data.month);
                setMonthName(calendar.data.currentMonthName);
                setYear(calendar.data.currentYear);
                setDaysInMonth(calendar.data.daysInCurrentMonth);
            }
        });

        return () => isSubscribed = false
    }, []);

    return (
        <Box>
            <table id="calendar">
                <tbody>
                    <tr className="header">
                        <th>
                            <Button variant="contained" onClick={handlePrevious}>
                                <ArrowBackIosIcon />
                            </Button>
                            {monthName.toString().concat('  ' + year.toString())}
                            <Button variant="contained" onClick={handleNext}>
                                <ArrowForwardIosIcon />
                            </Button>
                        </th>
                    </tr>   
                    <tr className="weekdays">
                        {
                            DAYS.map((day, index) => {
                                return (
                                    <th key={index}>{day}</th>
                                )
                            })
                        }
                    </tr>
                    {
                        daysInMonth.map((week, indexRow) => {
                            if ((month === new Date().getMonth() && year === new Date().getFullYear())) 
                                return (
                                    <tr className='days' key={indexRow}>
                                    {
                                        week.map((day, indexCell) => {
                                            if(indexRow === 0 && day > 7 && indexCell !== 5 && indexCell !== 6)
                                                return (
                                                    <td key={indexCell} className='day other-month'>
                                                        <div className='date'>{day}</div>
                                                    </td>
                                                )
                                            else if(daysInMonth.length -1 === indexRow && day < 7 && indexCell !== 5 && indexCell !== 6)
                                                return (
                                                    <td key={indexCell} className='day other-month'>
                                                        <div className='date'>{day}</div>
                                                    </td>
                                                )
                                            else if(day === today && indexCell !== 5 && indexCell !== 6) 
                                                return (    
                                                    <td key={indexCell} className='day today'>
                                                        <div className='date'>{day}</div>
                                                    </td>
                                                )
                                            else if (indexCell !== 5 && indexCell !== 6)
                                                return (
                                                    <td key={indexCell} className='day'>
                                                        <div className='date'>{day}</div>
                                                    </td>
                                                )
                                            else if(indexRow === 0 && day > 7 && (indexCell === 5 || indexCell === 6))
                                                return (
                                                    <td key={indexCell} className='day other-month-weekend'>
                                                        <div className='date'>{day}</div>
                                                    </td>
                                                )
                                            else if(daysInMonth.length -1 === indexRow && day < 7 && (indexCell === 5 || indexCell === 6))
                                                return (
                                                    <td key={indexCell} className='day other-month-weekend'>
                                                        <div className='date'>{day}</div>
                                                    </td>
                                                )
                                            else if(day === today && (indexCell === 5 || indexCell === 6)) 
                                                return (    
                                                    <td key={indexCell} className='day today-weekend'>
                                                        <div className='date'>{day}</div>
                                                    </td>
                                                )
                                            else 
                                                return (
                                                    <td key={indexCell} className='day weekend'>
                                                        <div className='date'>{day}</div>
                                                    </td>
                                                )
                                        })
                                    }
                                    </tr>
                                )
                            else 
                                return (
                                    <tr className='days' key={indexRow}>
                                    {
                                        week.map((day, indexCell) => {
                                            if(indexRow === 0 && day > 7 && indexCell !== 5 && indexCell !== 6)
                                                return (
                                                    <td key={indexCell} className='day other-month'>
                                                        <div className='date'>{day}</div>
                                                    </td>
                                                )
                                            else if(daysInMonth.length -1 === indexRow && day < 7 && indexCell !== 5 && indexCell !== 6)
                                                return (
                                                    <td key={indexCell} className='day other-month'>
                                                        <div className='date'>{day}</div>
                                                    </td>
                                                )
                                            else if (indexCell !== 5 && indexCell !== 6)
                                                return (
                                                    <td key={indexCell} className='day'>
                                                        <div className='date'>{day}</div>
                                                    </td>
                                                )
                                            else if(indexRow === 0 && day > 7 && (indexCell === 5 || indexCell === 6))
                                                return (
                                                    <td key={indexCell} className='day other-month-weekend'>
                                                        <div className='date'>{day}</div>
                                                    </td>
                                                )
                                            else if(daysInMonth.length -1 === indexRow && day < 7 && (indexCell === 5 || indexCell === 6))
                                                return (
                                                    <td key={indexCell} className='day other-month-weekend'>
                                                        <div className='date'>{day}</div>
                                                    </td>
                                                )
                                            else 
                                                return (
                                                    <td key={indexCell} className='day weekend'>
                                                        <div className='date'>{day}</div>
                                                    </td>
                                                )
                                        })
                                    }
                                    </tr>
                                )
                        })
                    }
                </tbody>
            </table>
        </Box>
    );
}

export default ScreenCalendar;
