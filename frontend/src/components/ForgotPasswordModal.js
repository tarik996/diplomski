import { useState } from 'react';
import { Dialog , DialogTitle , DialogContent , DialogContentText , DialogActions , Button , TextField} from '@mui/material';

//Api
import { forgotPassword } from '../api/APIPassword';

const ForgotPasswordModal = (props) => {

    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        forgotPassword(email).then((response) => {
            props.resetPassword(response.data);
            props.handleCloseModal();
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
                    Unesite vaš email i nova lozinka će vam doći na vašu email adresu.
                </DialogContentText>
                <TextField 
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit}>Pošalji</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ForgotPasswordModal;
