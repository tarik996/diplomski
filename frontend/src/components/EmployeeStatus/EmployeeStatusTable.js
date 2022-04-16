import { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography, Button, Stack, TablePagination, Snackbar, Alert } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

//Icons
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

//API
import { getEmployeeStatus } from '../../api/APIEmployeeStatus';

//Components
import DeleteEmployeeStatusModal from './Modals/DeleteEmployeeStatusModal';


const EmployeeStatusTable = () => {
    //Statusi korisnika
    const [employeeStatus, setEmployeeStatus] = useState([]);

    const params = useParams();

    //Status id
    const [statusId, setStatusId] = useState('');
    const [idOfDeletedStatus, setIdOfDeletedStatus] = useState(-1);

    //Broj redova u tabeli po stranici
    const [page, setPage] = useState(0);
    const [rowLength, setRowLength] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    
    //Da li je obrisan status
    const [openAlert, setOpenAlert] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [deleteEmployeeStatusMessage, setEmployeeStatusMessage] = useState("");

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    const handleOpenModal = (id, index) => {
        setStatusId(id);
        setIdOfDeletedStatus(index);
        setOpenModal(true);
    };

    const handleCloseModal = (message) => {
        if(message === "") {
            setOpenAlert(false);
            setIdOfDeletedStatus(-1);
        }
        else {
            setOpenAlert(true);
            setEmployeeStatusMessage(message);
            employeeStatus.splice(idOfDeletedStatus, 1);
        }
        
        setOpenModal(false);
    };

    useEffect(() => {
        let isSubscribed = true;

        getEmployeeStatus(params).then((response) => {
            if (isSubscribed) {
                setEmployeeStatus(response.data.employeeStatus);
                setRowLength(response.data.employeeStatus.length);
            }
        });

        return () => isSubscribed = false;
    }, [params]);

    return (
        <Box sx={{ width: '100%' }}>
            <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
                <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                    Statusi
                </Typography>
            </Toolbar>

            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Status</TableCell>
                            <TableCell align="left">Datum</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            employeeStatus.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                <TableRow key={index} hover >
                                    <TableCell align="left">{index + 1}</TableCell>
                                    <TableCell align="left">{row.status}</TableCell>
                                    <TableCell align="left">{`${new Date(row.dateStatusChange).toLocaleDateString()}`}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} sx={{ justifyContent: 'end' }}>
                                            <Link to={`/editEmployeeStatus/${row._id}`} style={{ textDecoration: 'none' }}>
                                                <Button variant="contained" color="warning" startIcon={<ModeEditOutlineOutlinedIcon />}>
                                                    Promjeni
                                                </Button>
                                            </Link>
                                            <Button variant="contained" onClick={() => handleOpenModal(row._id, index)} color="error" startIcon={<DeleteForeverIcon />}>
                                                Izbriši
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
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
                rowsPerPageOptions={[5, 10]}
                labelRowsPerPage={'Broj redova: '}
                labelDisplayedRows={() => {
                    return `${rowLength === 0 ? 0 : page * rowsPerPage + 1} - ${rowLength < rowsPerPage ? rowLength : page * rowsPerPage + rowsPerPage} od ${rowLength}`;
                }}
            />
            {  
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleCloseAlert}>
                        <Alert variant="filled" severity="success">
                            {deleteEmployeeStatusMessage}
                        </Alert>
                    </Snackbar>
                </Stack>
            }
            <DeleteEmployeeStatusModal 
                _id={statusId} 
                openModal={openModal} 
                handleCloseModal={handleCloseModal} 
            />
        </Box>
    );
}

export default EmployeeStatusTable;