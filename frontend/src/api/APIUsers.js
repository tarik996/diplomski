import axios from 'axios';

const getAllUsers = async () => {
    try {
        return await axios.get("http://localhost:5000/api/users/getAllUsers");
    } catch (error) {
        console.log(error);
    }
}

const createUser = async (user) => {
    try {
        return await axios.post("http://localhost:5000/api/users/create", user);
    } catch (error) {
        console.log(error);
    }
}

const getUserData = async (params) => {
    try {
        return await axios.get(`http://localhost:5000/api/users/profile/${params.userId}`);
    } catch (error) {
        console.log(error);
    }
}

const getYourProfileData = async () => {
    try {
        return await axios.get('http://localhost:5000/api/users/yourProfile');
    } catch (error) {
        console.log(error);
    }
}

const changeUser = async (user, params) => {
    try {
        return await axios.put(`http://localhost:5000/api/users/edit/${params.userId}`, user);
    } catch (error) {
        console.log(error);
    }
}

export { getAllUsers, createUser, getUserData, changeUser, getYourProfileData };