import axios from "axios";

const calculateSallary = async (dateFrom, dateTo) => {
    try {
        return await axios.post('https://tarik-diplomski.herokuapp.com/api/sallary/calculateSallary', {dateFrom: dateFrom, dateTo: dateTo});
    } catch (error) {
        console.log(error);
    }
}

const getSallaryRange = async () => {
    try {
        return await axios.get('https://tarik-diplomski.herokuapp.com/api/sallary/sallaryReportRange');
    } catch (error) {
        console.log(error);
    }
}

const getSallaryRangeReport = async (_id) => {
    try {
        return await axios.get(`https://tarik-diplomski.herokuapp.com/api/sallary/getSallaryRangeReport/${_id}`);
    } catch (error) {
        console.log(error);
    }
}

const getUserSallaryRangeReport = async(_id) => {
    try {
        return await axios.get(`https://tarik-diplomski.herokuapp.com/api/sallary/getAllSallaryRangeReport/${_id}`);
    } catch (error) {
        console.log(error);
    }
}

const getAllSallaryReport = async () => {
    try {
        return await axios.get(`https://tarik-diplomski.herokuapp.com/api/sallary/getAllSallaryReport`);
    } catch (error) {
        console.log(error);
    }
}

const getUserAllSallaryReport = async () => {
    try {
        return await axios.get(`https://tarik-diplomski.herokuapp.com/api/sallary/getUserAllSallaryReport`);
    } catch (error) {
        console.log(error);
    }
}

export { calculateSallary, getSallaryRange, getSallaryRangeReport, getAllSallaryReport, getUserSallaryRangeReport, getUserAllSallaryReport };