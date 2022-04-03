import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
    Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Divider, TableContainer, Table,
    useMediaQuery, TableHead, TableRow, TextField, TableCell, TableBody, Stack
} from '@mui/material';
import { blue } from '@mui/material/colors';

//Icons
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

//Api
import { getUserData } from '../../api/APIUsers';
import { getEmployeeStatus } from '../../api/APIEmployeeStatus';

const ViewProfile = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    const params = useParams();

    const [firstLetter, setFirstLetter] = useState("");
    const [employeeStatus, setEmployeeStatus] = useState([]);
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

        getEmployeeStatus(params).then((response) => {
            if (isSubscribed)
                setEmployeeStatus(response.data.employeeStatus);
        });

        return () => isSubscribed = false;
    }, [params]);

    return (
        <Box
            sx={{
                ...(!matches && ({ '& .MuiCard-root': { width: '49%' }, display: 'flex', justifyContent: 'space-between' })),
                ...(matches && ({ '& .MuiCard-root': { width: '100%' }, display: 'grid', gridTemplateRows: 'auto' })),
            }}
        >
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
                    <TextField sx={{ paddingBottom: 2 }} disabled fullWidth label="Rola" variant="standard" value={user.role} />
                </CardContent>
                <CardActions disableSpacing sx={{ textAlign: 'end' }}>
                    <Stack direction='column' spacing={2} sx={{ width: "100%" }}>
                        <Link to={`/editUser/${params.userId}`} style={{ textDecoration: 'none', width: '100%' }} >
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
            <Box sx={{
                ...(matches && ({ paddingTop: 5, width: '100%' })),
                ...(!matches && ({ paddingTop: 2, width: '49%' }))
            }}
            >
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align='center' colSpan={3}>
                                    Status zaposlenika
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='center'>
                                    Id
                                </TableCell>
                                <TableCell align='center'>
                                    Status
                                </TableCell>
                                <TableCell align='center'>
                                    Datum
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employeeStatus.map((value, index) => (
                                <TableRow key={index}>
                                    <TableCell align='center'>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {value.status}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {`
                                                ${new Date(value.dateStatusChange).toLocaleDateString()}
                                            `}
                                    </TableCell>
                                </TableRow>
                            ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{
                    width: '100%',
                    paddingTop: 3
                }}
                >
                    <Link to={`/profile/`} style={{ textDecoration: 'none' }}>
                        <Button variant="contained" sx={{
                            ...(matches && ({ width: '100%' })),
                            ...(!matches && ({ marginRight: 0.5, width: '49%' }))
                        }}
                        >
                            Vidi sve
                        </Button>
                    </Link>
                    <Link to={`/createEmployeeStatus/${params.userId}`} style={{ textDecoration: 'none' }}>
                        <Button variant="contained" color="success" sx={{
                            ...(matches && ({ width: '100%', marginTop: 1 })),
                            ...(!matches && ({ width: '49%' }))
                        }}
                        >
                            Dodaj
                        </Button>
                    </Link>
                </Box>
            </Box>
        </Box>
    )
}

export default ViewProfile;
