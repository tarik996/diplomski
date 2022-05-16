import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material';

//API
import { changeUserWorkingHours } from '../../../api/APIUsers';

const EditUsersWorkingHoursModal = (props) => {
    const [workingHourFrom, setWorkingHourFrom] = useState(props.workingHourFrom);
    const [workingHourTo, setWorkingHourTo] = useState(props.workingHourTo);
    const [messageFrom, setMessageFrom] = useState('Minuti mogu biti samo na pola sata, tipa 08:30 ili 09:00');
    const [errorFrom, setErrorFrom] = useState(false);
    const [messageTo, setMessageTo] = useState('Minuti mogu biti samo na pola sata, tipa 08:30 ili 09:00');
    const [errorTo, setErrorTo] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const workingHour = {
            _id: props._id, 
            workingHourFrom: workingHourFrom, 
            workingHourTo: workingHourTo,
        }

        changeUserWorkingHours(workingHour).then((response) => {
            if(response.data.isEdit === true) {
                props.handleCloseModal(response.data.message, response.data.isEdit, workingHourFrom, workingHourTo, props.index);
                setMessageFrom('Minuti mogu biti samo na pola sata, tipa 08:30 ili 09:00');
                setMessageTo('Minuti mogu biti samo na pola sata, tipa 08:30 ili 09:00');
                setErrorFrom(false);
                setErrorTo(false);
            }
                
            else {
                setMessageFrom(response.data.messageFrom);
                setMessageTo(response.data.messageTo);
                setErrorFrom(response.data.isEditFrom);
                setErrorTo(response.data.isEditTo);
                setWorkingHourFrom(props.workingHourFrom);
                setWorkingHourTo(props.workingHourTo);
            }
            
        });
    }

    useEffect(() => {
        setWorkingHourFrom(props.workingHourFrom);
        setWorkingHourTo(props.workingHourTo);
    }, [props.workingHourFrom, props.workingHourTo]);

    const handleClose = () => {
        setMessageFrom('Minuti mogu biti samo na pola sata, tipa 08:30 ili 09:00');
        setMessageTo('Minuti mogu biti samo na pola sata, tipa 08:30 ili 09:00');
        setErrorFrom(false);
        setErrorTo(false);
        props.handleCloseModal("", undefined, props.workingHourFrom, props.workingHourTo, props.index);
    }

    return (
        <Dialog open={props.openModal} fullWidth={true} onClose={handleClose}>
            <DialogTitle>Promjena radnog vremena</DialogTitle>
            <DialogContent>
                <TextField 
                    autoFocus
                    focused
                    disabled
                    margin='dense'
                    label="Ime i prezime"
                    value={props.userName}
                    fullWidth
                    variant="standard"
                />
                <TextField 
                    onChange={(e) => setWorkingHourFrom(e.target.value)}
                    focused
                    error={errorFrom}
                    helperText={messageFrom}
                    margin="dense"
                    label="Radno vrijeme od"
                    value={workingHourFrom}
                    fullWidth
                    variant="standard"
                />
                <TextField 
                    onChange={(e) => setWorkingHourTo(e.target.value)}
                    focused
                    error={errorTo}
                    helperText={messageTo}
                    margin="dense"
                    label="Radno vrijeme do"
                    value={workingHourTo}
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Stack direction="row" spacing={2}>
                    <Button onClick={handleClose} color='error'>Odustani</Button>
                    <Button onClick={handleSubmit}>Promjeni</Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
}

export default EditUsersWorkingHoursModal;