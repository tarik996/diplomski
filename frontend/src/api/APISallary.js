import axios from "axios";
import { api } from './config';

const calculateSallary = async (dateFrom, dateTo) => {
    try {
        return await axios.post(api + '/api/sallary/calculateSallary', {dateFrom: dateFrom, dateTo: dateTo});
    } catch (error) {
        console.log(error);
    }
}

const getSallaryRange = async () => {
    try {
        return await axios.get(api + '/api/sallary/sallaryReportRange');
    } catch (error) {
        console.log(error);
    }
}

const getSallaryRangeReport = async (_id) => {
    try {
        return await axios.get(`${api}/api/sallary/getSallaryRangeReport/${_id}`);
    } catch (error) {
        console.log(error);
    }
}

const getUserSallaryRangeReport = async(_id) => {
    try {
        return await axios.get(`${api}/api/sallary/getAllSallaryRangeReport/${_id}`);
    } catch (error) {
        console.log(error);
    }
}

const getAllSallaryReport = async () => {
    try {
        return await axios.get(`${api}/api/sallary/getAllSallaryReport`);
    } catch (error) {
        console.log(error);
    }
}

const getUserAllSallaryReport = async () => {
    try {
        return await axios.get(`${api}/api/sallary/getUserAllSallaryReport`);
    } catch (error) {
        console.log(error);
    }
}

export { calculateSallary, getSallaryRange, getSallaryRangeReport, getAllSallaryReport, getUserSallaryRangeReport, getUserAllSallaryReport };