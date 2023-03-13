import axios from "axios";
import { api } from './config';

const getNextMonth = async (month, year) => {
    try {
        var nextMonth = month;
        var nextYear = year;

        if(month === 11) {
            nextMonth = 0;
            nextYear = nextYear + 1;
        } else
            nextMonth = nextMonth + 1;
        
        return await axios.post(api + "/api/calendar/getNextMonth", {month: nextMonth, year: nextYear});
    } catch (error) {
        console.log(error);
    }
}

const getPreviousMonth = async (month, year) => {
    try {
        var previousMonth = month;
        var previousYear = year;

        if(month === 0) {
            previousMonth = 11;
            previousYear = previousYear - 1;
        } else
            previousMonth = previousMonth - 1;
        
        return await axios.post(api + "/api/calendar/getPreviousMonth", {month: previousMonth, year: previousYear});
    } catch (error) {
        console.log(error);
    }
}

const getDaysInCurrentMonth = async () => {
    try {
        return await axios.get(api + "/api/calendar/getDaysInCurrentMonth");
    } catch (error) {
        console.log(error);
    }
}

export { getNextMonth, getPreviousMonth, getDaysInCurrentMonth };