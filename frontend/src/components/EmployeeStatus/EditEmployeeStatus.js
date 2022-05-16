import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Box, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, TextareaAutosize, TextField, Typography, Button,
         Stack, Snackbar, Alert} from "@mui/material";
import { MobileDatePicker, LocalizationProvider } from "@mui/lab";
import DateAdapter from '@mui/lab/AdapterMoment';
import moment from "moment";
import "moment/locale/sr";

//Api
import { editEmployeeStatus, getStatusWithId } from "../../api/APIEmployeeStatus";

const EditEmployeeStatus = () => {
    const [date, setDate] = useState(moment());
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Radi");

    const params = useParams();

    //Da li je ažuriran status
    const [isEdit, setIsEdit] = useState(false);
    const [message, setMessage] = useState("");

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsEdit(false);
    };

    const handleChange = (event) => {
        setStatus(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const employeeStatus = { status: status, dateStatusChange: date.toString(), description: description };
        
        editEmployeeStatus(params, employeeStatus).then((response) => {
            setMessage(response.data.message);
            setIsEdit(response.data.isEdit);
        });
    };

    useEffect(() => {
        let isSubscribed = true;

        getStatusWithId(params).then((response) => {
            if(isSubscribed) {
                setDate(moment(response.data.employeeStatus.dateStatusChange));
                setDescription(response.data.employeeStatus.description);
                setStatus(response.data.employeeStatus.status);
            }
        });

        return () => isSubscribed = false;
    }, [params]);

    return (
        <Box sx={{width: '100%'}}> 
            <FormControl>
                <FormLabel id="employeeStatus">Status zaposlenika</FormLabel>
                <RadioGroup row value={status} onChange={handleChange}> 
                    <FormControlLabel value="Radi" control={<Radio />} label="Radi" />
                    <FormControlLabel value="Ne radi" control={<Radio />} label="Ne radi" />
                </RadioGroup>
            </FormControl>
            <LocalizationProvider dateAdapter={DateAdapter} locale={"sr"} >
                <Box>
                    <Typography sx={{marginBottom: 1, marginTop: 1}}>Datum promjene statusa zaposlenika</Typography>
                    <MobileDatePicker
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
            <TextareaAutosize
                aria-label="minimum height"
                placeholder="Napomena..."
                value={description}
                onChange={(description) => {
                    return setDescription(description.target.value)
                }}
                style={{ maxWidth: '100%', marginTop: 20 , minWidth: '100%', minHeight: '300px', maxHeight: '300px'}}
            />
            <Box sx={{marginTop: 1}}>
                <Button onClick={handleSubmit} type="submit" color="primary"  variant="contained" fullWidth>
                    Promjeni
                </Button>
            </Box>
            <Stack sx={{ width: '100%' }} spacing={2}>
                <Snackbar open={isEdit} autoHideDuration={4000} onClose={handleCloseAlert}>
                    <Alert variant="filled" severity="success">
                        {message}
                    </Alert>
                </Snackbar>
            </Stack>
        </Box>
    );
}

export default EditEmployeeStatus;