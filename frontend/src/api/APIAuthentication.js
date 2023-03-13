import axios from "axios";
import { api } from './config';

const getLogOut = async () => {
    try {
        return await axios.delete(api + "/api/auth/logout");
    } catch (error) {
        console.log(error);
    }
}

const isLoggedIn = async () => {
    try {
        return await axios.get(api + "/api/auth/loggedIn");
    } catch (error) {
        console.log(error);
    }
}

const getUserRole = async () => {
    try {
        return await axios.get(api + "/api/auth/roleAuthorization");
    } catch (error) {
        console.log(error);
    }
}

const getLogIn = async (email, password) => {
    try {
        return await axios.post(api + "/api/auth/login", { email: email, password: password });
    } catch (error) {
        console.log(error);
    }
}

export { getLogOut, isLoggedIn, getUserRole, getLogIn };