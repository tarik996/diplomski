import { useState } from 'react';
import axios from 'axios';
import { Dialog , DialogTitle , DialogContent , DialogContentText , DialogActions , Button , TextField} from '@mui/material';

const ForgotPasswordModal = (props) => {

    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put("http://localhost:5000/api/password/forgotpassword", { email: email });
            props.resetPassword(response.data);
            props.handleCloseModal();
        } catch (error) {
            console.log(error);
        }
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
