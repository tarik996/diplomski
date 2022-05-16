import { useState, useEffect, useRef, useContext } from 'react';
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Divider, TextField, Stack, Snackbar, Alert } from '@mui/material';
import { blue } from '@mui/material/colors';

//Context
import AuthContext from '../../context/AuthContext';

//Api
import { getYourWorkingHours } from '../../api/APIUsers';
import { checkIn, isCheckIn } from '../../api/APIStatusRecord';

const UserCheckInForm = () => {
    const { flagCheckIn, setFlagCheckIn } = useContext(AuthContext);

    const today = useRef(new Date());
    const status = useRef('Radio');

    const [firstLetter, setFirstLetter] = useState("");
    const [user, setUser] = useState({
        _id: "", 
        firstName: "",
        lastName: "",
        workingHourFrom: "",
        workingHourTo: "",
        position: ""
    });

    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    //const [flagCheckIn, setFlagCheckIn] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userCheckIn = {status: status, date: today};

        checkIn(userCheckIn).then(response => {
            setMessage(response.data.message);
            setIsSuccess(true);
            isCheckIn().then((response) => {
                setFlagCheckIn(response.data.flagCheckIn);
            });
        });
    }

    const handleCloseAlert = () => {
        setIsSuccess(false);
    }

    useEffect(() => {
        let isSubscribed = true;

        getYourWorkingHours().then((response) => {
            if(isSubscribed) {
                setUser(response.data.user);
                setFirstLetter(JSON.stringify(response.data.user.firstName).charAt(1));
            }
        });

        return () => isSubscribed = false;
    }, []);

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
                    <TextField sx={{paddingBottom: 2}} disabled fullWidth label="Datum" variant="standard" value={today.current.getDate()+"/"+(today.current.getMonth()+1)+"/"+today.current.getFullYear()} />
                    <TextField sx={{paddingBottom: 2}} disabled fullWidth label="Radno vrijeme od" variant="standard" value={user.workingHourFrom} />
                    <TextField sx={{paddingBottom: 2}} disabled fullWidth label="Radno vrijeme do" variant="standard" value={user.workingHourTo} /> 
                </CardContent>
                <CardActions>
                    { today.current.getDay() === 0 || today.current.getDay() === 6 || flagCheckIn ? (
                        <Button variant='contained' color='primary' disabled fullWidth={true} >
                            Zabranjen unos!
                        </Button>
                    ) : (
                        <Button variant='contained' color='primary' fullWidth={true} onClick={handleSubmit}>
                            Prijavi se
                        </Button>
                    )}
                </CardActions>
            </Card>
            {isSuccess === true && (
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Snackbar open={isSuccess} autoHideDuration={4000} onClose={handleCloseAlert}>
                        <Alert variant="filled" severity="success">
                            {message}
                        </Alert>
                    </Snackbar>
                </Stack>
            )}
        </Box>
    );
}

export default UserCheckInForm;