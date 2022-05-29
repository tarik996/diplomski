import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, TextField, Button, Typography, Stack, Snackbar, Alert, useMediaQuery } from '@mui/material';

//Api
import { getUserData, changeUserSallary } from '../../api/APIUsers';

const EditUserFormSallary = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const params = useParams();

    //Da li je editovan 
    const [message, setMessage] = useState("");
    const [isEdit, setIsEdit] = useState(undefined);
    const [openAlert, setOpenAlert] = useState(false);


    //Podaci sa forme
    const [user, setUser] = useState({
        firstName: '', 
        lastName: '',
        jmbg: '',
        address: '',
        email: '',
        position: '',
        personalDeductions: 0,
        hourlyWage: 2.05,
        vacation: 0,
        role: 'Zaposlenik'
    });

    //Da li postoji greška u podacima
    const [bool, setBool] = useState({
        firstNameBool: false, 
        lastNameBool: false, 
        jmbgBool: false, 
        addressBool: false,
        emailBool: false, 
        positionBool: false,
        personalDeductions: false, 
        hourlyWageBool: false, 
        vacationBool: false
    }); 
    
    //Poruke o greškama
    const [messages, setMessages] = useState({
        firstNameError: "", 
        lastNameError: "", 
        jmbgError: "", 
        addressError: "",
        emailError: "", 
        positionError: "", 
        hourlyWageError: "",
        personalDeductionsError: "", 
        vacationError: ""
    });

    useEffect(() => {
        let isSubscribed = true;

        getUserData(params).then((userData) => {
            if(isSubscribed) 
                setUser(userData.data.user);
        });
        
        return () => isSubscribed = false;
    }, [params]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        changeUserSallary(user, params).then((response) => {
            if(response.data.message !== '')
                setOpenAlert(true);
            
            if(response.data.isEdit === false) 
                setUser(response.data.user);
            
            setMessage(response.data.message);
            setIsEdit(response.data.isEdit);
            setMessages(response.data.messages);
            setBool(response.data.bool);
        })
    };

    const updateField = (event) => {
        setUser({
            ...user,
            [event.target.name]: event.target.value
        });
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <Box
            component="form"
            sx={{
                ...(!matches && ({'& .MuiTextField-root': { width: '49%', paddingBottom: 3}})), 
                ...(matches && ({'& .MuiTextField-root': { width: '100%', paddingBottom: 2}})) 
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <Box 
                sx={{
                    width: '100%', 
                    paddingLeft: 1, 
                    paddingRight: 1, 
                    paddingTop: 1, 
                    paddingBottom: 3
                }}
            >
                <Typography variant="h5">
                    Promjeni korisnika
                </Typography>
            </Box>
            <Box 
                sx={{
                    width: '100%', 
                    paddingLeft: 1, 
                    paddingRight: 1, 
                    paddingTop: 1, 
                    ...(!matches && { display: 'flex', justifyContent: 'space-between'})
                }}
            >
                <TextField 
                    name="firstName" 
                    error={bool.firstNameBool} 
                    value={user.firstName} 
                    label="Ime" 
                    disabled
                    helperText={messages.firstNameError} 
                    onChange={updateField}
                />
                <TextField 
                    name="lastName" 
                    error={bool.lastNameBool}  
                    value={user.lastName} 
                    label="Prezime" 
                    disabled
                    helperText={messages.lastNameError} 
                    onChange={updateField}
                />
            </Box>
            <Box 
                sx={{
                    width: '100%', 
                    paddingLeft: 1, 
                    paddingRight: 1, 
                    ...(!matches && { display: 'flex', justifyContent: 'space-between'})
                }}
            >
                <TextField 
                    label="Satnica"
                    error={bool.hourlyWageBool} 
                    type="number" 
                    name="hourlyWage"
                    value={user.hourlyWage} 
                    inputProps={{min: 2.05, step: 0.01}} 
                    helperText={messages.hourlyWageError} 
                    onChange={updateField}
                />
                <TextField 
                    label="Lični odbici"
                    error={bool.personalDeductionsBool} 
                    type="number" 
                    name="personalDeductions"
                    value={user.personalDeductions} 
                    inputProps={{min: 0, step: 0.01}} 
                    helperText={messages.personalDeductionsError} 
                    onChange={updateField}
                />
            </Box>
            <Box 
                sx={{
                    width: "100%",
                    paddingLeft: 1, 
                    paddingRight: 1
                }}
            >
                <Button 
                    fullWidth
                    type="submit" 
                    color="primary" 
                    variant="contained"
                >
                    Promjeni
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
    );
}

export default EditUserFormSallary;