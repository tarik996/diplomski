import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Divider, Typography, TextField, Stack, Snackbar, Alert } from '@mui/material';
import { blue } from '@mui/material/colors';
import { MobileDatePicker, LocalizationProvider } from "@mui/lab";
import DateAdapter from '@mui/lab/AdapterMoment'
import moment from "moment";
import "moment/locale/sr";

//Api
import { getUserData } from '../../api/APIUsers';
import { getWorkingReport, getWholeWorkingReport } from '../../api/APIStatusRecord';

//PDF table 
import { exportPDF } from '../../helpers/ExportToPDF';

//Css
import './UserWorkingHours.css'

const UserWorkingHoursReport = () => {
    const [date, setDate] = useState(moment("01/01/2022", "DD/MM/YYYY"));
    const [firstLetter, setFirstLetter] = useState("");
    const [user, setUser] = useState({
        firstName: '', 
        lastName: '', 
        jmbg: '', 
        address: '',
        email: '', 
        position: '', 
        personalDeductions: '',
        hourlyWage: '', 
        vacation: '',
        role: ''
    });

    //Alert
    const [openAlert, setOpenAlert] = useState(false);
    const [isEdit, setIsEdit] = useState(undefined);
    const [message, setMessage] = useState('');

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }

    //Parametri
    const params = useParams();

    const submitMonthReport = async (event) => {
        event.preventDefault();

        getWorkingReport(params.userId, date.format('MM'), date.format('YYYY')).then(response => {
            if(response.data.isEdit)
                exportPDF(`${user.firstName} ${user.lastName}-${date.format('MMMM')}/${date.format('YYYY')}`, response.data.status, response.data.tableHeaders, response.data.statusJSON);

            setOpenAlert(true);
            setMessage(response.data.message);
            setIsEdit(response.data.isEdit);
            setDate(moment("01/01/2022", "DD/MM/YYYY"));
        });
    }

    const submitWholeReport = async (event) => {
        event.preventDefault();

        getWholeWorkingReport(params.userId).then(response => {
            if(response.data.isEdit)
                exportPDF(`${user.firstName} ${user.lastName}`, response.data.status, response.data.tableHeaders, response.data.statusJSON);

            setOpenAlert(true);
            setMessage(response.data.message);
            setIsEdit(response.data.isEdit);
            setDate(moment("01/01/2022", "DD/MM/YYYY"));
        });
    }

    useEffect(() => {
        let isSubscribed = true;

        getUserData(params).then((response) => {
            if(isSubscribed) {
                setUser(response.data.user);
                setFirstLetter(JSON.stringify(response.data.user.firstName).charAt(1));
            }
        });

        return () => isSubscribed = false;
    }, [params]);

    return (
        <Box>
            <Card>
                <CardHeader 
                    avatar={
                        <Avatar sx={{ bgcolor: blue[600] }} aria-label="recipe">
                            {firstLetter}
                        </Avatar>
                    }
                    title={user.firstName + " " + user.lastName}
                    subheader={user.position} 
                />
                <Divider variant='middle'/>
                <CardContent>   
                    <LocalizationProvider dateAdapter={DateAdapter} locale={"sr"} >
                        <Box>
                            <Typography sx={{marginBottom: 1, marginTop: 1}}>Odaberite mjesec i godinu</Typography>
                            <MobileDatePicker 
                                minDate={moment("01/01/2022", "DD/MM/YYYY")}
                                maxDate={moment(new Date(), "DD/MM/YYYY")}
                                views={['year', 'month']}
                                toolbarTitle="Izaberite datum"
                                cancelText="Odustani"
                                inputFormat="DD/MM/YYYY"
                                value={date}
                                mask="__/__/____"
                                onChange={(dateChanged) => {
                                    return setDate(moment(dateChanged));
                                }}
                                renderInput={(params) => <TextField {...params} fullWidth/>}
                            />
                        </Box>
                    </LocalizationProvider>
                </CardContent>
                <CardActions>
                    <Stack direction="column" spacing={1} sx={{width: "100%"}}>
                        <Button variant='contained' color='primary' fullWidth={true} onClick={submitMonthReport}>
                            Generiši izvještaj za odabrani mjesec
                        </Button>
                        <Button variant='contained' color='primary' fullWidth={true} onClick={submitWholeReport}>
                            Generiši ukupni izvještaj za zaposlenika
                        </Button>
                    </Stack>
                </CardActions>
            </Card>
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

export default UserWorkingHoursReport;