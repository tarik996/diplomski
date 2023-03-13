import axios from "axios";
import { api } from './config';

const resetPassword = async (id, email) => {
    try {
        return await axios.put(`${api}/api/password/adminChangePassword/${id}`, email);
    } catch (error) {
        console.log(error);
    }
}

const changePassword = async (password) => {
    try {
        return await axios.put(api + '/api/password/changePassword', password);
    } catch (error) {
        console.log(error);
    }
}

const forgotPassword = async (email) => {
    try {
        return await axios.put(api + "/api/password/forgotpassword", { email: email });
    } catch (error) {
        console.log(error);
    }
}

export { resetPassword, changePassword, forgotPassword };