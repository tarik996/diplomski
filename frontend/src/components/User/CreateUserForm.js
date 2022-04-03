import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, TextField, Button, Typography, MenuItem, Stack, Snackbar, Alert, useMediaQuery } from '@mui/material';

//APIv
import { getRoles } from '../../api/APIRoles';
import { createUser } from '../../api/APIUsers';

const CreateUserForm = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    //Role
    const [roles, setRoles] = useState([{roleName: 'Zaposlenik'}]);

    //Da li je kreiran 
    const [message, setMessage] = useState("");
    const [isCreated, setIsCreated] = useState(undefined);
    const [openAlert, setOpenAlert] = useState(false);

    //Podaci sa forme
    const [user, setUser] = useState({
        firstName: '', 
        lastName: '',
        jmbg: '',
        address: '',
        email: '',
        position: '',
        hourlyWage: 2.05,
        personalDeductions: 0,
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
        personalDeductionsBool: false, 
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
        personalDeductionsError: "",
        hourlyWageError: "", 
        vacationError: ""
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        createUser(user).then((response) => {
            if(response.data.isCreated === true) 
                setUser(response.data.user);

            if(response.data.message !== '')
                setOpenAlert(true);
            
            setMessage(response.data.message);
            setIsCreated(response.data.isCreated);
            setMessages(response.data.messages);
            setBool(response.data.bool);
        });
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
    }

    useEffect(() => {
        var isSubscribed = true;

        getRoles().then((response) => {
            if(isSubscribed)
                    setRoles(response.data.roles);
        });

        return () => isSubscribed = false;
    }, []);

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
                    Dodaj korisnika
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
                    helperText={messages.firstNameError} 
                    onChange={updateField}
                />
                <TextField 
                    name="lastName"
                    error={bool.lastNameBool} 
                    value={user.lastName} 
                    label="Prezime" 
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
                    name="jmbg" 
                    error={bool.jmbgBool} 
                    value={user.jmbg} 
                    label="JMBG" 
                    helperText={messages.jmbgError} 
                    onChange={updateField}
                />
                <TextField
                    name="email" 
                    error={bool.emailBool} 
                    value={user.email} 
                    label="Email" 
                    helperText={messages.emailError} 
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
                    name="position"
                    error={bool.positionBool} 
                    value={user.position} 
                    label="Pozicija" 
                    helperText={messages.positionError} 
                    onChange={updateField}
                />
                <TextField 
                    name="role" 
                    select 
                    label="Rola" 
                    value={user.role} 
                    onChange={updateField} 
                >
                    {
                        roles.map((value) => {
                            return (
                                <MenuItem key={value.roleName} value={value.roleName}>
                                    {value.roleName}
                                </MenuItem>
                            )
                        })
                    }
                </TextField>
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
                    name="hourlyWage" 
                    error={bool.hourlyWageBool} 
                    label="Satnica" 
                    type="number" 
                    value={user.hourlyWage} 
                    inputProps={{min: 2.05, step: 0.01}} 
                    helperText={messages.hourlyWageError} 
                    onChange={updateField}
                />
                <TextField 
                    name="vacation"
                    error={bool.vacationBool} 
                    label="Broj dana godišnjeg" 
                    type="number" 
                    value={user.vacation} 
                    inputProps={{min: 0, step: 1}} 
                    helperText={messages.vacationError} 
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
                    name="address" 
                    error={bool.addressBool} 
                    value={user.address} 
                    label="Adresa" 
                    helperText={messages.addressError} 
                    onChange={updateField}
                />
                <TextField
                    name="personalDeductions" 
                    error={bool.personalDeductionsBool} 
                    label="Lični odbici" 
                    type="number" 
                    value={user.personalDeductions} 
                    inputProps={{min: 0, step: 0.01}} 
                    helperText={messages.personalDeductionsError} 
                    onChange={updateField}
                />
            </Box>
            <Box 
                sx={{
                    paddingLeft: 1, 
                    paddingRight: 1, 
                    paddingTop: 5, 
                    width: '100%'
                }}
            >
                <Button type="submit" color="primary" fullWidth={true} variant="contained">
                    Kreiraj
                </Button>
            </Box>
            { isCreated ? (
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

export default CreateUserForm;
