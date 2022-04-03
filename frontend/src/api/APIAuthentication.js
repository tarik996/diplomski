import axios from "axios";

const getLogOut = async () => {
    try {
        return await axios.delete("http://localhost:5000/api/auth/logout");
    } catch (error) {
        console.log(error);
    }
}

const isLoggedIn = async () => {
    try {
        return await axios.get("http://localhost:5000/api/auth/loggedIn");
    } catch (error) {
        console.log(error);
    }
}

const getUserRole = async () => {
    try {
        return await axios.get("http://localhost:5000/api/auth/roleAuthorization");
    } catch (error) {
        console.log(error);
    }
}

const getLogIn = async (email, password) => {
    try {
        return await axios.post("http://localhost:5000/api/auth/login", { email: email, password: password });
    } catch (error) {
        console.log(error);
    }
}

export { getLogOut, isLoggedIn, getUserRole, getLogIn };