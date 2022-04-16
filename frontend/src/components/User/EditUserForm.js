import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, TextField, Button, Typography, MenuItem, Stack, Snackbar, Alert, useMediaQuery } from '@mui/material';

//Api
import { getRoles } from '../../api/APIRoles';
import { getUserData, changeUser } from '../../api/APIUsers';

//Components
import RefreshPasswordModal from './Modals/RefreshPasswordModal';

const EditUserForm = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const params = useParams();

    //Role 
    const [roles, setRoles] = useState([{roleName: 'Zaposlenik'}]);

    //Da li je editovan 
    const [message, setMessage] = useState("");
    const [isEdit, setIsEdit] = useState(undefined);
    const [openAlert, setOpenAlert] = useState(false);

    //Da li je resetovana lozinka
    const [success, setSuccess] = useState(undefined);
    const [openModal, setOpenModal] = useState(false);
    const [resetPasswordMessage, setResetPasswordMessage] = useState("");

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

        getRoles().then((response) => {
            if(isSubscribed) {
                setRoles(response.data.roles);
                getUserData(params).then((userData) => {
                    if(isSubscribed) 
                        setUser(userData.data.user);
                })
            }
        }); 

        return () => isSubscribed = false;
    }, [params]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        changeUser(user, params).then((response) => {
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

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = (message) => {
        if(message === "") {
            setResetPasswordMessage("");
            setOpenAlert(false);
        }
        else 
            setOpenAlert(true);
        
        setOpenModal(false);
    };

    const changePassword = (data) => {
        setResetPasswordMessage(data.message);
        setSuccess(data.success);
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
                    label="Broj dana godišnjeg"
                    error={bool.vacationBool} 
                    type="number" 
                    name="vacation" 
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
                    width: '100%', 
                    paddingLeft: 1, 
                    paddingRight: 1, 
                    ...(!matches && { display: 'flex', justifyContent: 'space-between'})
                }}
            >
                <Button 
                    sx={{
                        ...(!matches && ({width: '49%'})), 
                        ...(matches && ({width: '100%', marginBottom: 1})), 
                        height: 55
                    }} 
                    type="button" 
                    color="error" 
                    fullWidth={false} 
                    variant="contained" 
                    onClick={handleOpenModal}
                >
                    Restartuj lozinku
                </Button>
                <Button 
                    sx={{
                        ...(!matches && ({width: '49%'})), 
                        ...(matches && ({width: '100%'})), 
                        height: 55
                    }} 
                    type="submit" 
                    color="primary" 
                    fullWidth={false} 
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
            { success === true && (
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleCloseAlert}>
                        <Alert variant="filled" severity="success">
                            {resetPasswordMessage}
                        </Alert>
                    </Snackbar>
                </Stack>
            )}
            <RefreshPasswordModal 
                _id={params.userId} 
                email={user.email}
                firstName={user.firstName}
                lastName={user.lastName}
                openModal={openModal} 
                handleCloseModal={handleCloseModal} 
                changePassword={changePassword}
            />
        </Box>
    );
}

export default EditUserForm;