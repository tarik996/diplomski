import { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Card, CardContent, CardActions, TextField, Button, Box, Alert, Snackbar, Stack } from '@mui/material';
import { MobileDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from "moment";
import "moment/locale/sr";

//Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//API
import { setHolidays, setOtherStatus, getHolidayDayLeft } from '../../api/APIStatusRecord';

//Constants
import { STATUSRECORD } from '../../constants/EmployeeStatusRecordConstants';

const OtherStatus = () => {
    const [dateFrom, setDateFrom] = useState(moment());
    const [dateTo, setDateTo] = useState(moment());
    const [vacationDay, setVacationDay] = useState(0);
    const [vacationDayLeft, setVacationDayLeft] = useState(0);

    //Alerti
    const [openAlert, setOpenAlert] = useState(false);
    const [isEdit, setIsEdit] = useState(undefined);
    const [message, setMessage] = useState("");

    const submitVacation = async (event) => {
        event.preventDefault();

        setHolidays(dateFrom, dateTo, vacationDayLeft).then(response => {
            if(response.data.isEdit)
                setVacationDayLeft(response.data.vacationDayLeft);
            
            setOpenAlert(true);
            setIsEdit(response.data.isEdit);
            setMessage(response.data.message);
            setDateFrom(moment());
            setDateTo(moment());
        });
    }

    const submitOtherStatus = async (event, status) => {
        event.preventDefault();

        setOtherStatus(dateFrom, dateTo, status).then(response => {
            setOpenAlert(true);
            setIsEdit(response.data.isEdit);
            setMessage(response.data.message);
            setDateFrom(moment());
            setDateTo(moment());
        });
    }

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }

    useEffect(() => {
        let isSubscribed = true;

        getHolidayDayLeft().then(response => {
            if(isSubscribed) {
                setVacationDay(response.data.vacationDay);
                setVacationDayLeft(response.data.vacationDayLeft);
            }
        });

        return () => isSubscribed = false;
    }, []);

    return (
        <Box>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>{STATUSRECORD.VACATION}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Card>
                        <CardContent>
                            <TextField sx={{paddingBottom: 2}} disabled fullWidth label="Ukupan broj dana godišnjeg" variant="standard" value={vacationDay}/>
                            <TextField sx={{paddingBottom: 2}} disabled fullWidth label="Preostali broj dana godišnjeg" variant="standard" value={vacationDayLeft}/>
                            <LocalizationProvider dateAdapter={AdapterMoment} locale={"sr"} >
                                <Box>
                                    <Typography sx={{marginBottom: 1, marginTop: 1}}>Datum od</Typography>
                                    <MobileDatePicker
                                        disablePast
                                        toolbarTitle="Izaberite datum"
                                        cancelText="Odustani"
                                        inputFormat="DD/MM/YYYY"
                                        value={dateFrom}
                                        mask="__/__/____"
                                        onChange={(dateChanged) => {
                                            return setDateFrom(moment(dateChanged));
                                        }}
                                        renderInput={(params) => <TextField {...params} fullWidth/>}
                                    />
                                </Box>
                                <Box>
                                    <Typography sx={{marginBottom: 1, marginTop: 1}}>Datum do</Typography>
                                    <MobileDatePicker
                                        disablePast
                                        toolbarTitle="Izaberite datum"
                                        cancelText="Odustani"
                                        inputFormat="DD/MM/YYYY"
                                        value={dateTo}
                                        mask="__/__/____"
                                        onChange={(dateChanged) => {
                                            return setDateTo(moment(dateChanged));
                                        }}
                                        renderInput={(params) => <TextField {...params} fullWidth/>}
                                    />
                                </Box>
                            </LocalizationProvider>
                        </CardContent>
                        <CardActions>
                            <Button variant='contained' color='primary' fullWidth={true} onClick={submitVacation}>
                                Zapiši godišnji    
                            </Button>
                        </CardActions>
                    </Card>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography>{STATUSRECORD.SICKLEAVE}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Card>
                        <CardContent>
                            <LocalizationProvider dateAdapter={AdapterMoment} locale={"sr"} >
                                <Box>
                                    <Typography sx={{marginBottom: 1, marginTop: 1}}>Datum od</Typography>
                                    <MobileDatePicker
                                        disablePast
                                        toolbarTitle="Izaberite datum"
                                        cancelText="Odustani"
                                        inputFormat="DD/MM/YYYY"
                                        value={dateFrom}
                                        mask="__/__/____"
                                        onChange={(dateChanged) => {
                                            return setDateFrom(moment(dateChanged));
                                        }}
                                        renderInput={(params) => <TextField {...params} fullWidth/>}
                                    />
                                </Box>
                                <Box>
                                    <Typography sx={{marginBottom: 1, marginTop: 1}}>Datum do</Typography>
                                    <MobileDatePicker
                                        disablePast
                                        toolbarTitle="Izaberite datum"
                                        cancelText="Odustani"
                                        inputFormat="DD/MM/YYYY"
                                        value={dateTo}
                                        mask="__/__/____"
                                        onChange={(dateChanged) => {
                                            return setDateTo(moment(dateChanged));
                                        }}
                                        renderInput={(params) => <TextField {...params} fullWidth/>}
                                    />
                                </Box>
                            </LocalizationProvider>
                        </CardContent>
                        <CardActions>
                            <Button variant='contained' color='primary' fullWidth={true} onClick={(event) => { submitOtherStatus(event, STATUSRECORD.SICKLEAVE) }}>
                                Zapiši bolovanje   
                            </Button>
                        </CardActions>
                    </Card>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Typography>{STATUSRECORD.BUSINESSVISIT}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Card>
                        <CardContent>
                            <LocalizationProvider dateAdapter={AdapterMoment} locale={"sr"} >
                            <Box>
                                <Typography sx={{marginBottom: 1, marginTop: 1}}>Datum od</Typography>
                                <MobileDatePicker
                                    disablePast
                                    toolbarTitle="Izaberite datum"
                                    cancelText="Odustani"
                                    inputFormat="DD/MM/YYYY"
                                    value={dateFrom}
                                    mask="__/__/____"
                                    onChange={(dateChanged) => {
                                        return setDateFrom(moment(dateChanged));
                                    }}
                                    renderInput={(params) => <TextField {...params} fullWidth/>}
                                />
                            </Box>
                            <Box>
                                <Typography sx={{marginBottom: 1, marginTop: 1}}>Datum do</Typography>
                                <MobileDatePicker
                                    disablePast
                                    toolbarTitle="Izaberite datum"
                                    cancelText="Odustani"
                                    inputFormat="DD/MM/YYYY"
                                    value={dateTo}
                                    mask="__/__/____"
                                    onChange={(dateChanged) => {
                                        return setDateTo(moment(dateChanged));
                                    }}
                                    renderInput={(params) => <TextField {...params} fullWidth/>}
                                />
                            </Box>
                        </LocalizationProvider>
                        </CardContent>
                        <CardActions>
                            <Button variant='contained' color='primary' fullWidth={true} onClick={(event) => { submitOtherStatus(event, STATUSRECORD.BUSINESSVISIT) }}>
                                Zapiši službeni put   
                            </Button>
                        </CardActions>
                    </Card>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Typography>{STATUSRECORD.PAIDINDEMNITY}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Card>
                        <CardContent>
                            <LocalizationProvider dateAdapter={AdapterMoment} locale={"sr"} >
                            <Box>
                                <Typography sx={{marginBottom: 1, marginTop: 1}}>Datum od</Typography>
                                <MobileDatePicker
                                    disablePast
                                    toolbarTitle="Izaberite datum"
                                    cancelText="Odustani"
                                    inputFormat="DD/MM/YYYY"
                                    value={dateFrom}
                                    mask="__/__/____"
                                    onChange={(dateChanged) => {
                                        return setDateFrom(moment(dateChanged));
                                    }}
                                    renderInput={(params) => <TextField {...params} fullWidth/>}
                                />
                            </Box>
                            <Box>
                                <Typography sx={{marginBottom: 1, marginTop: 1}}>Datum do</Typography>
                                <MobileDatePicker
                                    disablePast
                                    toolbarTitle="Izaberite datum"
                                    cancelText="Odustani"
                                    inputFormat="DD/MM/YYYY"
                                    value={dateTo}
                                    mask="__/__/____"
                                    onChange={(dateChanged) => {
                                        return setDateTo(moment(dateChanged));
                                    }}
                                    renderInput={(params) => <TextField {...params} fullWidth/>}
                                />
                            </Box>
                        </LocalizationProvider>
                        </CardContent>
                        <CardActions>
                            <Button variant='contained' color='primary' fullWidth={true} onClick={(event) => { submitOtherStatus(event, STATUSRECORD.PAIDINDEMNITY) }} >
                                Zapiši plaćeno odsustvo  
                            </Button>
                        </CardActions>
                    </Card>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Typography>{STATUSRECORD.NOPAIDINDEMNITY}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Card>
                        <CardContent>
                            <LocalizationProvider dateAdapter={AdapterMoment} locale={"sr"} >
                            <Box>
                                <Typography sx={{marginBottom: 1, marginTop: 1}}>Datum od</Typography>
                                <MobileDatePicker
                                    disablePast
                                    toolbarTitle="Izaberite datum"
                                    cancelText="Odustani"
                                    inputFormat="DD/MM/YYYY"
                                    value={dateFrom}
                                    mask="__/__/____"
                                    onChange={(dateChanged) => {
                                        return setDateFrom(moment(dateChanged));
                                    }}
                                    renderInput={(params) => <TextField {...params} fullWidth/>}
                                />
                            </Box>
                            <Box>
                                <Typography sx={{marginBottom: 1, marginTop: 1}}>Datum do</Typography>
                                <MobileDatePicker
                                    disablePast
                                    toolbarTitle="Izaberite datum"
                                    cancelText="Odustani"
                                    inputFormat="DD/MM/YYYY"
                                    value={dateTo}
                                    mask="__/__/____"
                                    onChange={(dateChanged) => {
                                        return setDateTo(moment(dateChanged));
                                    }}
                                    renderInput={(params) => <TextField {...params} fullWidth/>}
                                />
                            </Box>
                        </LocalizationProvider>
                        </CardContent>
                        <CardActions>
                            <Button variant='contained' color='primary' fullWidth={true} onClick={(event) => { submitOtherStatus(event, STATUSRECORD.NOPAIDINDEMNITY) }}>
                                Zapiši neplaćeno odsustvo   
                            </Button>
                        </CardActions>
                    </Card>
                </AccordionDetails>
            </Accordion>
            { isEdit ? (
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleCloseAlert}>
                        <Alert variant="filled" severity="success">
                            {message}
                        </Alert>
                    </Snackbar>
                </Stack>
            ) : (
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleCloseAlert}>
                        <Alert variant="filled" severity="error">
                            {message}
                        </Alert>
                    </Snackbar>
                </Stack>
            )}
        </Box>
    );
}

export default OtherStatus;