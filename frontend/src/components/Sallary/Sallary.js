import { useState } from 'react';
import { Box, Card, CardContent, CardActions, TextField, Typography, Button, Stack, Snackbar, Alert, CardHeader, Avatar, Divider, IconButton } from "@mui/material";
import { MobileDatePicker, LocalizationProvider } from "@mui/lab";
import { blue } from '@mui/material/colors';
import DateAdapter from '@mui/lab/AdapterMoment'
import moment from "moment";
import "moment/locale/sr";

//Icons
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

//API
import { calculateSallary } from '../../api/APISallary';

const Sallary = () => {
    const [dateFrom, setDateFrom] = useState(moment(new Date(), "DD/MM/YYYY"));
    const [dateTo, setDateTo] = useState(moment(new Date(), "DD/MM/YYYY"));

    //Alerti
    const [openAlert, setOpenAlert] = useState(false);
    const [isEdit, setIsEdit] = useState(undefined);
    const [message, setMessage] = useState("");

    const submitCalculateSallary = async (event) => {
        event.preventDefault();

        calculateSallary(dateFrom, dateTo).then(response => {
            setOpenAlert(true);
            setIsEdit(response.data.isEdit);
            setMessage(response.data.message);
            setDateFrom(moment(new Date(), "DD/MM/YYYY"));
            setDateTo(moment(new Date(), "DD/MM/YYYY"));
        });
    }

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }

    return (
        <Box>
            <Card>
                <CardHeader 
                    avatar={
                        <Avatar sx={{ bgcolor: blue[600] }} aria-label="recipe">
                            <IconButton>
                                <AttachMoneyIcon />
                            </IconButton>
                        </Avatar>
                    }
                    title={"Plate"}
                    subheader={"Obračun plate za određeni period"} 
                />
                <Divider variant='middle'/>
                <CardContent>   
                    <LocalizationProvider dateAdapter={DateAdapter} locale={"sr"} >
                        <Box>
                            <Typography sx={{marginBottom: 1, marginTop: 1}}>Odaberite početak obračuna</Typography>
                            <MobileDatePicker 
                                minDate={moment("01/01/2022", "DD/MM/YYYY")}
                                toolbarTitle="Izaberite datum do"
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
                            <Typography sx={{marginBottom: 1, marginTop: 1}}>Odaberite kraj obračuna</Typography>
                            <MobileDatePicker 
                                minDate={moment("01/01/2022", "DD/MM/YYYY")}
                                toolbarTitle="Izaberite datum od"
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
                    <Stack direction="column" spacing={1} sx={{width: "100%"}}>
                        <Button variant='contained' color='primary' fullWidth={true} onClick={submitCalculateSallary}>
                            Obračunaj platu za unešeni period
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

export default Sallary;