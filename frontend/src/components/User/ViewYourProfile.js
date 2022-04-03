import { useState, useEffect } from 'react';
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Divider, 
         TextField, Stack, Snackbar, Alert } from '@mui/material';
import { blue } from '@mui/material/colors';

//Component
import ChangePasswordModal from './ChangePasswordModal';

//Api
import { getYourProfileData } from '../../api/APIUsers';

const ViewYourProfile = () => {
    const [firstLetter, setFirstLetter] = useState("");
    const [user, setUser] = useState({
        _id: "", 
        firstName: "", 
        lastName: "", 
        jmbg: "", 
        address: "",
        email: "", 
        position: "", 
        hourlyWage: 2.05, 
        personalDeductions: 0,
        role: "", 
        vacation: 0
    });
  
    const [success, setSuccess] = useState(undefined);
    const [openModal, setOpenModal] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [changePasswordMessage, setChangePasswordMessage] = useState("");
    
    const handleOpenModal = () => {
        setOpenModal(true);
    }

    const handleCloseModal = (message) => {
        if(message === "") {
            setChangePasswordMessage("");
            setOpenAlert(false);
        }
        else 
            setOpenAlert(true);
        
        setOpenModal(false);
    }

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }

    const changePassword = (data) => {
        setChangePasswordMessage(data.message);
        setSuccess(data.success);
    }

    useEffect(() => {
        let isSubscribed = true;

        getYourProfileData().then((response) => {
            if(isSubscribed) {
                setUser(response.data.user);
                setFirstLetter(JSON.stringify(response.data.user.firstName).charAt(1));
            }
        });

        return () => isSubscribed = false;
    }, []);

    return (
        <Box>
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
                        <TextField sx={{paddingBottom: 2}} disabled fullWidth label="Ime" variant="standard" value={user.firstName} />
                        <TextField sx={{paddingBottom: 2}} disabled fullWidth label="Prezime" variant="standard" value={user.lastName} />
                        <TextField sx={{paddingBottom: 2}} disabled fullWidth label="Email" variant="standard" value={user.email} />
                        <TextField sx={{paddingBottom: 2}} disabled fullWidth label="JMBG" variant="standard" value={user.jmbg} />
                        <TextField sx={{paddingBottom: 2}} disabled fullWidth label="Adresa" variant="standard" value={user.address} />
                        <TextField sx={{paddingBottom: 2}} disabled fullWidth label="Radno mjesto" variant="standard" value={user.position} />
                        <TextField sx={{paddingBottom: 2}} disabled fullWidth label="Broj dana godišnjeg" variant="standard" value={user.vacation} />
                        <TextField sx={{paddingBottom: 2}} disabled fullWidth label="Lični odbici" variant="standard" value={`${user.personalDeductions} KM`} />
                        <TextField sx={{paddingBottom: 2}} disabled fullWidth label="Satnica" variant="standard" value={`${user.hourlyWage} KM`} />
                        <TextField sx={{paddingBottom: 2}} disabled fullWidth label="Rola" variant="standard" value={user.role} />
                    </CardContent>
                    <CardActions>
                        <Button variant='contained' color='primary' fullWidth={true} onClick={handleOpenModal}>
                            Nova lozinka
                        </Button>
                    </CardActions>
                </Card>
            </Box>
            <Box>
                { success === true && (
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleCloseAlert}>
                            <Alert variant="filled" severity="success">
                                {changePasswordMessage}
                            </Alert>
                        </Snackbar>
                    </Stack>
                )}
                <ChangePasswordModal 
                    _id={user._id} 
                    openModal={openModal} 
                    handleCloseModal={handleCloseModal} 
                    changePassword={changePassword} 
                />
            </Box>
        </Box>
    );
}

export default ViewYourProfile;
