import axios from 'axios';
import { useState,  useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Button , Container , TextField , Box , Alert , Stack , Snackbar} from '@mui/material';

//Icons
import LoginIcon from '@mui/icons-material/Login';

//Components
import ForgotPasswordModal from '../components/ForgotPasswordModal';

const boxForm = {
    position: 'absolute',
    width: {
        xs: 250,
        sm: 400, 
        md: 500,
        lg: 600,
        xl: 700 
    },
    margin: 'auto',
    paddingTop: 20,
    left: 0,
    right: 0,
    backgroundColor: '#cfe8fc'
};

const Login = (props) => {
    const { getLoggedIn, getAuthorization } = useContext(AuthContext); 

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [validation, setValidation] = useState(false);
    const [resetPasswordMessage, setResetPasswordMessage] = useState("");
    const [success, setSuccess] = useState(undefined);
    const [openModal, setOpenModal] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    
    const handleOpenModal = () => {
        setOpenModal(true);
    }

    const handleCloseModal = (message) => {
        if(message === "") {
            setResetPasswordMessage("");
            setOpenAlert(false);
        }
        else 
            setOpenAlert(true)
        setOpenModal(false);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { email: email, password: password })
            await getLoggedIn();
            await getAuthorization();
            if(!response.data.validation) {
                setMessage(response.data.message);
                setValidation(response.data.validation);
                setSuccess(undefined);
                setOpenAlert(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        props.setIsLogOut(false);
        setOpenAlert(false);
    }

    const resetPassword = (data) => {
        setResetPasswordMessage(data.message);
        setSuccess(data.success);
    }

    return (
        <Container disableGutters={true} maxWidth="100%">
            <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}>
                <Box sx={boxForm}>  
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <LoginIcon color="success" fontSize="large"/>
                    </Box>
                    <Box 
                        sx={{
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            fontSize: '1.5rem'
                        }} 
                        component="span" 
                        color="secondary" 
                    >
                        Prijavi se
                    </Box>
                    <Box 
                        sx={{
                            height: '70%', 
                            display: 'flex',
                            flexDirection: 'column'
                        }} 
                        component="form"
                        noValidate 
                        autoComplete="off" 
                        onSubmit={handleSubmit}
                    >
                        <TextField 
                            sx={{marginBottom: 5, marginTop: 5}} 
                            label="Email" 
                            type="email" 
                            fullWidth={true} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField 
                            sx={{marginBottom: 5}} 
                            label="Lozinka" 
                            type="password" 
                            fullWidth={true}  
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button 
                            sx={{marginBottom: 2}} 
                            type="submit" 
                            color="secondary" 
                            fullWidth={true} 
                            variant="outlined"
                        >
                            Prijavi se
                        </Button>  
                        { !validation && (
                            <Stack sx={{ width: '100%' }} spacing={2}>
                                <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleCloseAlert}>
                                    <Alert variant="filled" severity="error">
                                        {message}
                                    </Alert>
                                </Snackbar>
                            </Stack>
                        )}
                        { success === false && (
                            <Stack sx={{ width: '100%' }} spacing={2}>
                                <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleCloseAlert}>
                                    <Alert variant="filled" severity="error">
                                        {resetPasswordMessage}
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
                        { props.isLogOut === true && (
                            <Stack sx={{ width: '100%' }} spacing={2}>
                                <Snackbar open={props.isLogOut} autoHideDuration={4000} onClose={handleCloseAlert}>
                                    <Alert variant="filled" severity="success">
                                        {props.message}
                                    </Alert>
                                </Snackbar>
                            </Stack>
                        )}
                    </Box>
                    <Link onClick={handleOpenModal} to="/">Zaboravili ste lozinku?</Link>
                    <ForgotPasswordModal 
                        openModal={openModal} 
                        handleCloseModal={handleCloseModal} 
                        resetPassword={resetPassword} 
                    />
                </Box>
            </Box>
        </Container>
    );
}

export default Login;
