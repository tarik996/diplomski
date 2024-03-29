import axios from 'axios';
import { api } from './config';

const checkIn = async (user) => {
    try {
        return await axios.post(api + "/api/statusRecord/checkIn", user);
    } catch (error) {
        console.log(error);
    }
}

const isCheckIn = async () => {
    try {
        return await axios.get(api + "/api/statusRecord/isCheckIn");
    } catch (error) {
        console.log(error);
    }
}

const getStatusInCurrentMonth = async (month, year) => {
    try {
        return await axios.get(`${api}/api/statusRecord/getStatusInCurrentMonth/${month}/${year}`);
    } catch (error) {
        console.log(error);
    }
}

const setHolidays = async (dateFrom, dateTo, vacationDayLeft) => {
    try {
        return await axios.post(api + "/api/statusRecord/setHoliday", {dateFrom: dateFrom, dateTo: dateTo, vacationDayLeft: vacationDayLeft});
    } catch (error) {
        console.log(error);
    }
}

const setOtherStatus = async (dateFrom, dateTo, status) => {
    try {
        return await axios.post(api + "/api/statusRecord/setOtherStatus", {dateFrom: dateFrom, dateTo: dateTo, status: status});
    } catch (error) {
        console.log(error);
    }
}

const getHolidayDayLeft = async () => {
    try {
        return await axios.get(api + "/api/statusRecord/getHolidayDayLeft");
    } catch (error) {
        console.log(error);
    }
}

const getWorkingReport = async (_id, month, year) => {
    try {
        return await axios.get(`${api}/api/statusRecord/getWorkingReport/${_id}/${month}/${year}`);
    } catch (error) {
        console.log(error);
    }
}
const getWholeWorkingReport = async (_id) => {
    try {
        return await axios.get(`${api}/api/statusRecord/getWholeWorkingReport/${_id}`);
    } catch (error) {
        console.log(error);
    }
}

const getWorkingReportForAllUsers = async (month, year) => {
    try {
        return await axios.get(`${api}/api/statusRecord/getWorkingReportForAllUsers/${month}/${year}`);
    } catch (error) {
        console.log(error);
    }
}
const getWholeWorkingReportForAllUsers = async () => {
    try {
        return await axios.get(`${api}/api/statusRecord/getWholeWorkingReportForAllUsers`);
    } catch (error) {
        console.log(error);
    }
}

export { checkIn, isCheckIn, getStatusInCurrentMonth, setHolidays, setOtherStatus, getHolidayDayLeft, getWorkingReport, getWholeWorkingReport, getWorkingReportForAllUsers, getWholeWorkingReportForAllUsers };