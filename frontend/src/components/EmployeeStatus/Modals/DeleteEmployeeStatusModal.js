import { Dialog , DialogTitle , DialogContent , DialogContentText , DialogActions , Button } from '@mui/material';

import { deleteEmployeeStatus } from '../../../api/APIEmployeeStatus';

const DeleteEmployeeStatusModal = (props) => {
    const handleSubmit = async (event) => {
        event.preventDefault();

        deleteEmployeeStatus(props._id).then((response) => {
            props.handleCloseModal(response.data.message);
        });
    };

    const handleClose = () => {
        props.handleCloseModal("");
    }

    return (
        <Dialog open={props.openModal} onClose={handleClose}>
            <DialogTitle>Brisanje statusa</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Da li ste sigurni da želite obrisati status!
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color='error'>Odustani</Button>
                <Button onClick={handleSubmit}>Obriši</Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteEmployeeStatusModal;