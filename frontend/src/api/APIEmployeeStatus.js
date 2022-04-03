import axios from "axios";

const getEmployeeStatus = async (params) => {
    try {
        return await axios.get(`http://localhost:5000/api/employeeStatus/getEmployeeStatus/${params.userId}`);
    } catch (error) {
        console.log(error);
    }
}

const createEmployeeStatus = async (params, employeeStatus) => {
    try {
        return await axios.post(`http://localhost:5000/api/employeeStatus/editEmployeeStatus/${params.userId}`, employeeStatus);
    } catch (error) {
        console.log(error);
    }
}

export { getEmployeeStatus, createEmployeeStatus };