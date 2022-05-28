import { useState } from 'react';
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Divider, TextField, Typography, IconButton, Stack, Snackbar, Alert } from '@mui/material';
import { blue } from '@mui/material/colors';
import { MobileDatePicker, LocalizationProvider } from "@mui/lab";
import DateAdapter from '@mui/lab/AdapterMoment'
import moment from "moment";
import "moment/locale/sr";

//Icons
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

//Api
import { getWorkingReportForAllUsers, getWholeWorkingReportForAllUsers } from '../../api/APIStatusRecord';

//PDF table 
import { exportPDF } from '../../helpers/ExportToPDF';

//Css
import './UserWorkingHours.css'

const WorkingHoursReport = () => {
    const [date, setDate] = useState(moment("01/01/2022", "DD/MM/YYYY"));

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

    const submitMonthReport = async (event) => {
        event.preventDefault();

        getWorkingReportForAllUsers(date.format('MM'), date.format('YYYY')).then(response => {
            if(response.data.isEdit)
                exportPDF(`Izvještaj za ${date.format('MMMM')}/${date.format('YYYY')}`, response.data.status, response.data.tableHeaders, response.data.statusJSON);

            setOpenAlert(true);
            setMessage(response.data.message);
            setIsEdit(response.data.isEdit);
            setDate(moment("01/01/2022", "DD/MM/YYYY"));
        });
    }

    const submitWholeReport = async (event) => {
        event.preventDefault();

        getWholeWorkingReportForAllUsers().then(response => {
            if(response.data.isEdit)
                exportPDF(`Kompletni izvještaj`, response.data.status, response.data.tableHeaders, response.data.statusJSON);

            setOpenAlert(true);
            setMessage(response.data.message);
            setIsEdit(response.data.isEdit);
            setDate(moment("01/01/2022", "DD/MM/YYYY"));
        });
    }

    return (
        <Box>
            <Card>
                <CardHeader 
                    avatar={
                        <Avatar sx={{ bgcolor: blue[600] }} aria-label="recipe">
                            <IconButton>
                                <PictureAsPdfIcon />
                            </IconButton>
                        </Avatar>
                    }
                    title={"Izvještaj"}
                    subheader={"Radni izvještaj za sve uposlenike."} 
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
                            Generiši izvještaj za ovaj mjesec
                        </Button>
                        <Button variant='contained' color='primary' fullWidth={true} onClick={submitWholeReport}>
                            Generiši izvještaj
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

export default WorkingHoursReport;