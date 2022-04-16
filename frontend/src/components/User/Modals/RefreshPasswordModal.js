import { Dialog , DialogTitle , DialogContent , DialogContentText , DialogActions , Button } from '@mui/material';

//Api
import { resetPassword } from '../../../api/APIPassword';

const RefreshPasswordModal = (props) => {

    const handleSubmit = async (event) => {
        event.preventDefault();

        const id = props._id;
        const email = {
            email: props.email
        };

        resetPassword(id, email).then((response) => {
            props.handleCloseModal(response.data.message);
            props.changePassword(response.data);
        });
    };

    const handleClose = () => {
        props.handleCloseModal("");
    }

    return (
        <Dialog open={props.openModal} onClose={handleClose}>
            <DialogTitle>Promjena lozinke</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Da li ste sigurni da želite da restartujete lozinku korisniku {props.firstName} {props.lastName}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color='error'>Odustani</Button>
                <Button onClick={handleSubmit}>Resetuj</Button>
            </DialogActions>
        </Dialog>
    );
}

export default RefreshPasswordModal;
