import { useEffect, useState } from 'react';
import { Box , TableContainer, Table, TableRow, TableCell, TableBody, Typography, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

//Icons
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

//Api
import { getDaysInCurrentWeek, getDaysInNextWeek, getDaysInPreviousWeek } from '../../api/APIMobileCalendar';

//Constants
import { DAYS } from '../../constants/CalendarConstants';

const calendarTable = {
    width: '100%',
    height: '85vh'
};
const calendarTableCellDays = {
    width: '20%',
    padding: '4px',
    border: '1px groove',
    verticalAlign: 'vertical',
    textAlign: 'center'
};
const calendarControls = {
    width: '100%',
    height: '15vh',
    padding: '4px',
    borderTop: '1px groove',
    borderLeft: '1px groove',
    borderRight: '1px groove',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
};
const calendarTableCell = {
    width: '80%',
    padding: '8px',
    border: '1px groove',
    verticalAlign: 'text-top',
    textAlign: 'right'
};
const calendarToday = {
    width: '80%',
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

const MobileCalendar = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [today, setToday] = useState(0);
    const [startOfWeek, setStartOfWeek] = useState('');
    const [endOfWeek, setEndOfWeek] = useState('');
    const [daysInCurrentWeek, setDaysInCurrentWeek] = useState([]);
    const [daysInCurrentWeekDefault, setDaysInCurrentWeekDefault] = useState([]);
    const [currentYear, setCurrentYear] = useState(0);

    const handleNext = async () => {
        getDaysInNextWeek(currentYear, daysInCurrentWeekDefault).then((week) => {
            setDaysInCurrentWeekDefault(week.data.nextWeek);
            setDaysInCurrentWeek(week.data.daysInCurrentWeek);
            setCurrentYear(week.data.currentYear);
            setToday(week.data.today);
            setStartOfWeek(week.data.startOfWeek);
            setEndOfWeek(week.data.endOfWeek);
        });
    }

    const handlePrevious = async () => {
        getDaysInPreviousWeek(currentYear, daysInCurrentWeekDefault).then((week) => {
            setDaysInCurrentWeekDefault(week.data.nextWeek);
            setDaysInCurrentWeek(week.data.daysInCurrentWeek);
            setCurrentYear(week.data.currentYear);
            setToday(week.data.today);
            setStartOfWeek(week.data.startOfWeek);
            setEndOfWeek(week.data.endOfWeek);
        });
    }

    useEffect(() => {    
        let isSubscribed = true;

        getDaysInCurrentWeek().then((calendar) => {
            if(isSubscribed) {
                setToday(calendar.data.currentDay);
                setStartOfWeek(calendar.data.startOfWeek);
                setEndOfWeek(calendar.data.endOfWeek);
                setDaysInCurrentWeek(calendar.data.daysInCurrentWeek);
                setDaysInCurrentWeekDefault(calendar.data.daysInCurrentWeekDefault);
                setCurrentYear(calendar.data.currentYear);
            }
        });

        return () => isSubscribed = false;
    }, []);

    return (
        <Box>
            {
                matches ? (
                    <Box sx={calendarControls}>
                        <ArrowBackIosRoundedIcon onClick={handlePrevious} fontSize="large" color="primary" />
                        <Typography sx={{textAlign: 'center'}}>
                            {startOfWeek.toString()+' '+ endOfWeek.toString()}
                        </Typography>
                        <ArrowForwardIosRoundedIcon onClick={handleNext} fontSize="large" color="primary"/>
                    </Box>
                ) : (
                    <Box sx={calendarControls}>
                        <Button variant="contained" onClick={handlePrevious}>
                            <ArrowBackIosIcon />
                        </Button>
                        <Typography variant="h6">
                            {startOfWeek.toString()+'-'+ endOfWeek.toString()}
                        </Typography>
                        <Button variant="contained" onClick={handleNext}>
                            <ArrowForwardIosIcon />
                        </Button>
                    </Box>
                )
            }
            <TableContainer>
                <Table sx={calendarTable}>
                    <TableBody>
                        {
                            DAYS.map((day,index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell key={index} sx={calendarTableCellDays}>{day}</TableCell>
                                        {
                                            daysInCurrentWeek[index] === today ? (
                                                <TableCell sx={calendarToday}>
                                                    <Button sx={calendarButton}>
                                                        {daysInCurrentWeek[index]}
                                                    </Button>
                                                </TableCell>
                                            ) : (
                                                <TableCell sx={calendarTableCell}>{daysInCurrentWeek[index]}</TableCell>
                                            )
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

export default MobileCalendar
