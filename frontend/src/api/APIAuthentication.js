import axios from "axios";

const getLogOut = async () => {
    try {
        return await axios.delete("https://tarik-diplomski.herokuapp.com/api/auth/logout");
    } catch (error) {
        console.log(error);
    }
}

const isLoggedIn = async () => {
    try {
        return await axios.get("https://tarik-diplomski.herokuapp.com/api/auth/loggedIn");
    } catch (error) {
        console.log(error);
    }
}

const getUserRole = async () => {
    try {
        return await axios.get("https://tarik-diplomski.herokuapp.com/api/auth/roleAuthorization");
    } catch (error) {
        console.log(error);
    }
}

const getLogIn = async (email, password) => {
    try {
        return await axios.post("https://tarik-diplomski.herokuapp.com/api/auth/login", { email: email, password: password });
    } catch (error) {
        console.log(error);
    }
}

export { getLogOut, isLoggedIn, getUserRole, getLogIn };