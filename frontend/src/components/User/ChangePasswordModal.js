import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material';

//Api
import { changePassword } from '../../api/APIPassword';

const ChangePasswordModal = (props) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPssword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState({messageOldPassword: "", messageNewPassword: "", messageConfirmPassword: ""});
    const [errorBool, setErrorBool] = useState({errorOldPassword: false, errorNewPassword: false, errorConfirmPassword: false});

    const handleSubmit = async (event) => {
        event.preventDefault();
        const password = {
            _id: props._id, 
            oldPassword: oldPassword, 
            newPassword: newPassword, 
            confirmPassword: confirmPassword, 
            errorMessage: errorMessage, 
            errorBool: errorBool
        }

        changePassword(password).then((response) => {
            if(response.data.success === true) {
                setOldPassword("");
                setNewPssword("");
                setConfirmPassword("");
                setErrorMessage({messageOldPassword: "", messageNewPassword: "", messageConfirmPassword: ""});
                setErrorBool({errorOldPassword: false, errorNewPassword: false, errorConfirmPassword: false});
                props.handleCloseModal(response.data.message);
                props.changePassword(response.data);
            } else {
                setErrorMessage(response.data.errorMessage);
                setErrorBool(response.data.errorBool);
            }
        });
    }

    const handleClose = () => {
        setOldPassword("");
        setNewPssword("");
        setConfirmPassword("");
        setErrorMessage({messageOldPassword: "", messageNewPassword: "", messageConfirmPassword: ""});
        setErrorBool({errorOldPassword: false, errorNewPassword: false, errorConfirmPassword: false});
        props.handleCloseModal("");
    }

    return (
        <Dialog open={props.openModal} fullWidth={true} onClose={handleClose}>
            <DialogTitle>Promjena lozinke</DialogTitle>
            <DialogContent>
                <TextField 
                    onChange={(e) => {
                        errorBool.errorOldPassword = false
                        errorMessage.messageOldPassword = ""
                        setOldPassword(e.target.value)
                    }}
                    autoFocus
                    focused
                    error={errorBool.errorOldPassword}
                    margin='dense'
                    label="Stara lozinka"
                    type="password"
                    helperText={errorMessage.messageOldPassword}
                    fullWidth
                    variant="standard"
                />
                 <TextField 
                    onChange={(e) => setNewPssword(e.target.value)}
                    focused
                    error={errorBool.errorNewPassword}
                    margin='dense'
                    label="Nova lozinka"
                    type="password"
                    helperText={errorMessage.messageNewPassword}
                    fullWidth
                    variant="standard"
                />
                 <TextField 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    focused
                    error={errorBool.errorConfirmPassword}
                    margin="dense"
                    label="Potvrda lozinke"
                    type="password"
                    helperText={errorMessage.messageConfirmPassword}
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

export default ChangePasswordModal;
