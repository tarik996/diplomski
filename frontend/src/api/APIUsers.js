import axios from 'axios';

const getAllUsers = async () => {
    try {
        return await axios.get("https://tarik-diplomski.herokuapp.com/api/users/getAllUsers");
    } catch (error) {
        console.log(error);
    }
}

const createUser = async (user) => {
    try {
        return await axios.post("https://tarik-diplomski.herokuapp.com/api/users/create", user);
    } catch (error) {
        console.log(error);
    }
}

const getUserData = async (params) => {
    try {
        return await axios.get(`https://tarik-diplomski.herokuapp.com/api/users/profile/${params.userId}`);
    } catch (error) {
        console.log(error);
    }
}

const getYourProfileData = async () => {
    try {
        return await axios.get('https://tarik-diplomski.herokuapp.com/api/users/yourProfile');
    } catch (error) {
        console.log(error);
    }
}

const changeUser = async (user, params) => {
    try {
        return await axios.put(`https://tarik-diplomski.herokuapp.com/api/users/edit/${params.userId}`, user);
    } catch (error) {
        console.log(error);
    }
}

//Radno vrijeme

const getAllUsersWorkingHours = async () => {
    try {
        return await axios.get("https://tarik-diplomski.herokuapp.com/api/users/getAllUsersWorkingHours");
    } catch (error) {
        console.log(error);
    }
}

const changeUserWorkingHours = async (workingHour) => {
    try {
        return await axios.put(`https://tarik-diplomski.herokuapp.com/api/users/editUserWorkingHours`, workingHour);
    } catch (error) {
        console.log(error);
    }
}

const getYourWorkingHours = async () => {
    try {
        return await axios.get('https://tarik-diplomski.herokuapp.com/api/users/yourWorkingHours');
    } catch (error) {
        console.log(error);
    }
}

export { getAllUsers, createUser, getUserData, changeUser, getYourProfileData, getAllUsersWorkingHours, changeUserWorkingHours, getYourWorkingHours };