import axios from "axios";

const resetPassword = async (id, email) => {
    try {
        return await axios.put(`https://tarik-diplomski.herokuapp.com/api/password/adminChangePassword/${id}`, email);
    } catch (error) {
        console.log(error);
    }
}

const changePassword = async (password) => {
    try {
        return await axios.put('https://tarik-diplomski.herokuapp.com/api/password/changePassword', password);
    } catch (error) {
        console.log(error);
    }
}

const forgotPassword = async (email) => {
    try {
        return await axios.put("https://tarik-diplomski.herokuapp.com/api/password/forgotpassword", { email: email });
    } catch (error) {
        console.log(error);
    }
}

export { resetPassword, changePassword, forgotPassword };