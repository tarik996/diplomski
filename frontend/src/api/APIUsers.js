import axios from 'axios';
import { api } from './config';

const getAllUsers = async () => {
    try {
        return await axios.get(api + "/api/users/getAllUsers");
    } catch (error) {
        console.log(error);
    }
}

const createUser = async (user) => {
    try {
        return await axios.post(api + "/api/users/create", user);
    } catch (error) {
        console.log(error);
    }
}

const getUserData = async (params) => {
    try {
        return await axios.get(`${api}/api/users/profile/${params.userId}`);
    } catch (error) {
        console.log(error);
    }
}

const getYourProfileData = async () => {
    try {
        return await axios.get(api + '/api/users/yourProfile');
    } catch (error) {
        console.log(error);
    }
}

const changeUser = async (user, params) => {
    try {
        return await axios.put(`${api}/api/users/edit/${params.userId}`, user);
    } catch (error) {
        console.log(error);
    }
}

const changeUserSallary = async (user, params) => {
    try {
        return await axios.put(`${api}/api/users/editSallary/${params.userId}`, user);
    } catch (error) {
        console.log(error)
    }
}

//Radno vrijeme

const getAllUsersWorkingHours = async () => {
    try {
        return await axios.get(api + "/api/users/getAllUsersWorkingHours");
    } catch (error) {
        console.log(error);
    }
}

const changeUserWorkingHours = async (workingHour) => {
    try {
        return await axios.put(`${api}/api/users/editUserWorkingHours`, workingHour);
    } catch (error) {
        console.log(error);
    }
}

const getYourWorkingHours = async () => {
    try {
        return await axios.get( api + '/api/users/yourWorkingHours');
    } catch (error) {
        console.log(error);
    }
}

export { getAllUsers, createUser, getUserData, changeUser, getYourProfileData, getAllUsersWorkingHours, changeUserWorkingHours, getYourWorkingHours, changeUserSallary };