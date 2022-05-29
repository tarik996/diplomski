import { useState, useEffect } from 'react';
import { Box, Toolbar, Typography, TextField, MenuItem, Button, Stack, Alert, Snackbar } from '@mui/material';

//API
import { getSallaryRange, getSallaryRangeReport, getAllSallaryReport } from '../../api/APISallary';

//PDF table 
import { exportPDF } from '../../helpers/ExportToPDF';

const SallaryReport = () => {
    const [sallaryRange, setSallaryRange] = useState([{_id: "", dateFrom: "Nema obračuna", dateTo: "Nema obračuna"}]);
    const [sallaryRangeId, setSallaryRangeId] = useState("1");

    //Da li je editovan 
    const [message, setMessage] = useState("");
    const [isEdit, setIsEdit] = useState(undefined);
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        let isSubscribed = true;

        getSallaryRange().then((response) => {
            if(isSubscribed) 
                setSallaryRange(response.data.calculation);
        }); 

        return () => isSubscribed = false;
    }, []);

    const getSallary = async (event) => {
        event.preventDefault();

        getSallaryRangeReport(sallaryRangeId).then((response) => {
            if(response.data.isEdit)
                exportPDF(`Izvještaj plata za period ${response.data.sallaryRange}`, response.data.sallaryReport, response.data.tableHeaders, response.data.sallaryReportJSON);
            setOpenAlert(true);
            setMessage(response.data.message);
            setIsEdit(response.data.isEdit);
        });
    }

    const getAllSallary = async (event) => {
        event.preventDefault();

        getAllSallaryReport().then((response) => {
            if(response.data.isEdit)
                exportPDF(`Izvještaj plata`, response.data.sallaryReport, response.data.tableHeaders, response.data.sallaryReportJSON);
            setOpenAlert(true);
            setMessage(response.data.message);
            setIsEdit(response.data.isEdit);
        });
    }

    const updateField = (event) => {
        setSallaryRangeId(event.target.value);
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Toolbar sx={{pl: { sm: 2 }, pr: { xs: 1, sm: 1 }}}>
                <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                    Izvještaj plate
                </Typography>
            </Toolbar>
            <Box 
                sx={{
                    width: '100%', 
                    paddingLeft: 1, 
                    paddingRight: 1
                }}
            >
                <TextField 
                    name="period" 
                    select 
                    value={sallaryRangeId}
                    label="Period za obračun" 
                    onChange={updateField} 
                    fullWidth
                >
                    {
                        sallaryRange.map((value) => {
                            if(value._id === "1") 
                                return (
                                    <MenuItem key="none" value={value._id}>
                                        {value.dateFrom}
                                    </MenuItem>
                                )
                            else 
                                return (
                                    <MenuItem key={value._id} value={value._id}>
                                        {new Date(value.dateFrom).getDate() + "/" + (new Date(value.dateFrom).getMonth() + 1) + "/" + new Date(value.dateFrom).getFullYear() + "-" +
                                        new Date(value.dateTo).getDate() + "/" + (new Date(value.dateTo).getMonth() + 1) + "/" + new Date(value.dateTo).getFullYear()}
                                    </MenuItem>
                                )
                        })
                    }
                </TextField>
            </Box>
            <Box sx={{
                    width: '100%', 
                    paddingLeft: 1, 
                    paddingRight: 1
                }}
            >
                <Button 
                    sx={{height: 55, marginTop: 2}} 
                    type="button" 
                    color="info" 
                    fullWidth 
                    variant="contained" 
                    onClick={getSallary}
                 >   
                    Generiši izvještaj za određeni mjesec
                </Button>
            </Box>
            <Box sx={{
                    width: '100%', 
                    paddingLeft: 1, 
                    paddingRight: 1
                }}
            >
                <Button 
                    sx={{height: 55, marginTop: 2}} 
                    type="button" 
                    color="info" 
                    fullWidth 
                    variant="contained" 
                    onClick={getAllSallary}
                 >   
                    Generiši izvještaj za čitav period
                </Button>
            </Box>
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
    )
};

export default SallaryReport;