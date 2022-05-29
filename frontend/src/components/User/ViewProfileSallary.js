import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Divider, Stack, TextField } from '@mui/material';
import { blue } from '@mui/material/colors';

//Icons
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

//Api
import { getUserData } from '../../api/APIUsers';

const ViewProfileSallary = () => {
    const params = useParams();

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

    useEffect(() => {
        let isSubscribed = true;

        getUserData(params).then((response) => {
            if (isSubscribed) {
                setUser(response.data.user);
                setFirstLetter(JSON.stringify(response.data.user.firstName).charAt(1));
            }
        });

        return () => isSubscribed = false;
    }, [params]);
    
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
                <Divider variant='middle' />
                <CardContent>
                    <TextField sx={{ paddingBottom: 2 }} disabled fullWidth label="Ime" variant="standard" value={user.firstName} />
                    <TextField sx={{ paddingBottom: 2 }} disabled fullWidth label="Prezime" variant="standard" value={user.lastName} />
                    <TextField sx={{ paddingBottom: 2 }} disabled fullWidth label="Email" variant="standard" value={user.email} />
                    <TextField sx={{ paddingBottom: 2 }} disabled fullWidth label="JMBG" variant="standard" value={user.jmbg} />
                    <TextField sx={{ paddingBottom: 2 }} disabled fullWidth label="Adresa" variant="standard" value={user.address} />
                    <TextField sx={{ paddingBottom: 2 }} disabled fullWidth label="Radno mjesto" variant="standard" value={user.position} />
                    <TextField sx={{ paddingBottom: 2 }} disabled fullWidth label="Broj dana godišnjeg" variant="standard" value={user.vacation} />
                    <TextField sx={{ paddingBottom: 2 }} disabled fullWidth label="Lični odbici" variant="standard" value={`${user.personalDeductions} KM`} />
                    <TextField sx={{ paddingBottom: 2 }} disabled fullWidth label="Satnica" variant="standard" value={`${user.hourlyWage} KM`} />
                </CardContent>
                <CardActions disableSpacing sx={{ textAlign: 'end' }}>
                    <Stack direction='column' spacing={2} sx={{ width: "100%" }}>
                        <Link to={`/editUserSallary/${params.userId}`} style={{ textDecoration: 'none', width: '100%' }} >
                            <Button
                                variant="contained"
                                color="warning"
                                fullWidth={true}
                                startIcon={<ModeEditOutlineOutlinedIcon />}
                            >
                                Promjeni
                            </Button>
                        </Link>
                    </Stack>
                </CardActions>
            </Card>
        </Box>
    );
}

export default ViewProfileSallary;