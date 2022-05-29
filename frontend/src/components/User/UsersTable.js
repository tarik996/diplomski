import { useEffect, useState, useContext } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography, IconButton, Tooltip, Button, Stack, TablePagination} from '@mui/material';
import { Link } from 'react-router-dom';

//Icons
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

//Constants
import { ROLES } from '../../constants/AuthorizationConstants';

//API
import { getAllUsers } from '../../api/APIUsers';

//Componenets
import Search from '../Search';

//PDF table of users
import { exportPDF } from '../../helpers/ExportToPDF';

//Context
import AuthContext from '../../context/AuthContext';

const UsersTable = () => {
    const { authorization } = useContext(AuthContext);

    //Svi korisnici
    const [allUsers, setAllUsers] = useState([]);

    //Pretraživanje
    const [search, setSearch] = useState('');
    const [searchUsers, setSearchUsers] = useState([]);

    //Za kreiranje tabele u pdfu
    const [tableHeaders, setTableHeaders] = useState([[]]);
    const [userJSON, setUserJSON] = useState([]);

    //Broj redova u tabeli po stranici
    const [page, setPage] = useState(0);
    const [rowLength, setRowLength] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    };

    const requestSearch = (searchedVal) => {
        setSearch(searchedVal.target.value)
        
        const filteredUsers = allUsers.filter((user) => {
            return user.userName.toLowerCase().includes(searchedVal.target.value.toLowerCase()) ? user : null;
        });
        
        setSearchUsers(filteredUsers);
        setRowLength(filteredUsers.length);
    };
    
    const cancelSearch = () => {
        setSearch('');
        setSearchUsers(allUsers);
        setRowLength(allUsers.length);
    };

    useEffect(() => {
        let isSubscribed = true;

        getAllUsers().then(response => {
            if(isSubscribed) {
                setAllUsers(response.data.usersNames);
                setSearchUsers(response.data.usersNames);
                setRowLength(response.data.usersNames.length);
                setTableHeaders(response.data.tableHeaders);
                setUserJSON(response.data.userJSON);
            }  
        });

        return () => isSubscribed = false;  
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <Toolbar sx={{pl: { sm: 2 }, pr: { xs: 1, sm: 1 }}}>
                <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                    Zaposlenici
                </Typography>
                {
                    ( authorization === ROLES.ADMINISTRATOR ) && (
                        <Box>
                            <Tooltip title="PDF">
                                <IconButton onClick={() => exportPDF('Zaposlenici', allUsers, tableHeaders, userJSON)}>
                                    <PictureAsPdfIcon />
                                </IconButton>
                            </Tooltip>
                            <Link to="/createUser">
                                <Tooltip title="Dodaj">
                                    <IconButton>
                                        <AddCircleOutlineRoundedIcon />
                                    </IconButton>
                                </Tooltip>
                            </Link>
                        </Box>
                    )
                }
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
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {searchUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                            <TableRow key={row.index} hover >
                                <TableCell align="left">{row.index}</TableCell>
                                <TableCell align="left">{row.userName}</TableCell>
                                <TableCell align="right">
                                    {
                                        ( authorization === ROLES.ADMINISTRATOR ) && (
                                            <Stack direction="row" spacing={1} sx={{justifyContent: 'end'}}>
                                                <Link to={`/profile/${row._id}`} style={{textDecoration: 'none'}}>
                                                    <Button variant="contained" startIcon={<RemoveRedEyeOutlinedIcon/>}>
                                                        Profil
                                                    </Button>
                                                </Link>
                                                <Link to={`/editUser/${row._id}`} style={{textDecoration: 'none'}}>
                                                    <Button variant="contained" color="warning" startIcon={<ModeEditOutlineOutlinedIcon/>}>
                                                        Promjeni
                                                    </Button>
                                                </Link>
                                            </Stack>
                                        ) 
                                    }
                                    {
                                        ( authorization === ROLES.ACCOUNTANT ) && (
                                            <Stack direction="row" spacing={1} sx={{justifyContent: 'end'}}>
                                                <Link to={`/profileSallary/${row._id}`} style={{textDecoration: 'none'}}>
                                                    <Button variant="contained" startIcon={<RemoveRedEyeOutlinedIcon/>}>
                                                        Profil
                                                    </Button>
                                                </Link>
                                                <Link to={`/editUserSallary/${row._id}`} style={{textDecoration: 'none'}}>
                                                    <Button variant="contained" color="warning" startIcon={<ModeEditOutlineOutlinedIcon/>}>
                                                        Promjeni
                                                    </Button>
                                                </Link>
                                            </Stack>
                                        )
                                    }
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
        </Box>
    );
}

export default UsersTable;