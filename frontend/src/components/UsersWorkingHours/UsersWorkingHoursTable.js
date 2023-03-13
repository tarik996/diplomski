import { useEffect, useState, useRef } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography, IconButton, Tooltip, Button, Stack, TablePagination, Snackbar, Alert, } from '@mui/material';
import { Link } from 'react-router-dom';

//Icons
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddCircleOutlineRounded from '@mui/icons-material/AddCircleOutlineRounded';

//Componenets
import Search from '../Search';

//API
import { getAllUsersWorkingHours } from '../../api/APIUsers';

//PDF table of users
import { exportPDF } from '../../helpers/ExportToPDF';

//Modals
import EditUsersWorkingHoursModal from './Modals/EditUsersWorkingHoursModal';

const UsersWorkingHoursTable = () => {
    //Svi korisnici
    const [allUsersWorkingHours, setAllUsersWorkingHours] = useState([]);
    const userData = useRef({_id: "", index: 0, userName: "", workingHourFrom: 0, workingHourTo: 0});

    //Za kreiranje tabele u pdfu
    const [tableHeaders, setTableHeaders] = useState([[]]);
    const [userJSON, setUserJSON] = useState([]);

    //Pretraživanje
    const [search, setSearch] = useState('');
    const [searchUsers, setSearchUsers] = useState([]);

    //Broj redova u tabeli po stranici
    const [page, setPage] = useState(0);
    const [rowLength, setRowLength] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    //Modal
    const [openAlert, setOpenAlert] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [message, setMessage] = useState('');
    const [isEdit, setIsEdit] = useState(undefined);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    };

    const requestSearch = (searchedVal) => {
        setSearch(searchedVal.target.value)
        
        const filteredUsers = allUsersWorkingHours.filter((user) => {
            return user.userName.toLowerCase().includes(searchedVal.target.value.toLowerCase()) ? user : null;
        });
        
        setSearchUsers(filteredUsers);
        setRowLength(filteredUsers.length);
    };
    
    const cancelSearch = () => {
        setSearch('');
        setSearchUsers(allUsersWorkingHours);
        setRowLength(allUsersWorkingHours.length);
    };
    
    const handleOpenModal = (row) => {
        userData.current = row;
        setOpenModal(true);
    };

    useEffect(() => {
        let isSubscribed = true;

        getAllUsersWorkingHours().then(response => {
            if(isSubscribed) {
                setAllUsersWorkingHours(response.data.usersNames);
                setSearchUsers(response.data.usersNames);
                setRowLength(response.data.usersNames.length);
                setTableHeaders(response.data.tableHeaders);
                setUserJSON(response.data.userJSON);
            }  
        });

        return () => isSubscribed = false;  
    }, []);

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    const handleCloseModal = (message, isEdit, workingHourFrom, workingHourTo, index) => {     
        setMessage(message);
        setIsEdit(isEdit);   
        setOpenAlert(true);
        setOpenModal(false);
        allUsersWorkingHours.forEach((user) => {
            if(user.index === index) {
                user.workingHourFrom = workingHourFrom;
                user.workingHourTo = workingHourTo;
            }   
        })
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Toolbar sx={{pl: { sm: 2 }, pr: { xs: 1, sm: 1 }}}>
                <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                    Radno vrijeme
                </Typography>
                <Link to="/workingReport">
                    <Tooltip title="Lista">
                        <IconButton>
                            <AddCircleOutlineRounded />
                        </IconButton>
                    </Tooltip>
                </Link>
                <Tooltip title="PDF">
                    <IconButton onClick={() => exportPDF('Radno vrijeme', allUsersWorkingHours, tableHeaders, userJSON)}>
                        <PictureAsPdfIcon />
                    </IconButton>
                </Tooltip>
            </Toolbar>
            <Box sx={{pl: { sm: 2 }, pr: { xs: 1, sm: 1 }}}>
                <Search search={search} requestSearch={requestSearch} cancelSearch={cancelSearch}/>
            </Box>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Ime i prezime</TableCell>
                            <TableCell align="left">Radno vrijeme od</TableCell>
                            <TableCell align="left">Radno vrijeme do</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {searchUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                            <TableRow key={row.index} hover >
                                <TableCell align="left">{row.index}</TableCell>
                                <TableCell align="left">{row.userName}</TableCell>
                                <TableCell align="left">{row.workingHourFrom}</TableCell>
                                <TableCell align="left">{row.workingHourTo}</TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} sx={{justifyContent: 'end'}}>
                                        <Link to={`/userWorkingHours/${row._id}`} style={{textDecoration: 'none'}}>
                                            <Button variant="contained" color="primary" startIcon={<PictureAsPdfIcon/>} >
                                                Izvještaji
                                            </Button>
                                        </Link>
                                        <Button variant="contained" color="warning" startIcon={<ModeEditOutlineOutlinedIcon/>} onClick={() => {
                                            handleOpenModal(row)
                                        }}>
                                            Promjeni
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={rowLength}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5,10]}
                labelRowsPerPage={'Broj redova: '}
                labelDisplayedRows={() => {
                    return `${rowLength === 0 ? 0 : page * rowsPerPage + 1} - ${rowLength < rowsPerPage ? rowLength : page * rowsPerPage + rowsPerPage} od ${rowLength}`;
                }}
            />
            { isEdit === true && (
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleCloseAlert}>
                        <Alert variant="filled" severity="success">
                            {message}
                        </Alert>
                    </Snackbar>
                </Stack>
            )}
            <EditUsersWorkingHoursModal 
                index={userData.current.index}
                _id={userData.current._id} 
                userName={userData.current.userName}
                workingHourFrom={userData.current.workingHourFrom}
                workingHourTo={userData.current.workingHourTo}
                openModal={openModal} 
                handleCloseModal={handleCloseModal} 
            />
        </Box>
    );
}

export default UsersWorkingHoursTable;