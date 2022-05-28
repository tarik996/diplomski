import axios from "axios";

const getEmployeeStatus = async (params) => {
    try {
        return await axios.get(`https://tarik-diplomski.herokuapp.com/api/employeeStatus/getEmployeeStatus/${params.userId}`);
    } catch (error) {
        console.log(error);
    }
}

const getStatusWithId = async (params) => {
    try {
        return await axios.get(`https://tarik-diplomski.herokuapp.com/api/employeeStatus/getStatusWithId/${params.statusId}`);
    } catch (error) {
        console.log(error);
    }
}

const createEmployeeStatus = async (params, employeeStatus) => {
    try {
        return await axios.post(`https://tarik-diplomski.herokuapp.com/api/employeeStatus/createEmployeeStatus/${params.userId}`, employeeStatus);
    } catch (error) {
        console.log(error);
    }
}

const editEmployeeStatus = async (params, employeeStatus) => {
    try {
        return await axios.put(`https://tarik-diplomski.herokuapp.com/api/employeeStatus/updateEmployeeStatus/${params.statusId}`, employeeStatus);
    } catch (error) {
        console.log(error);
    }
}

const deleteEmployeeStatus = async (_id) => {
    try {
        return await axios.delete(`https://tarik-diplomski.herokuapp.com/api/employeeStatus/deleteEmployeeStatus/${_id}`);
    } catch (error) {
        console.log(error);
    }
}

export { getEmployeeStatus, createEmployeeStatus, deleteEmployeeStatus, editEmployeeStatus, getStatusWithId };