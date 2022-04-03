import axios from "axios";

const getDaysInNextWeek = async (currentYear, daysInCurrentWeekDefault) => {
    try {
        return await axios.post("http://localhost:5000/api/calendar/getDaysInNextWeek", {currentYear: currentYear, daysInCurrentWeek: daysInCurrentWeekDefault});
    } catch (error) {
        console.log(error);
    }
}

const getDaysInPreviousWeek = async (currentYear, daysInCurrentWeekDefault) => {
    try {
        return await axios.post("http://localhost:5000/api/calendar/getDaysInPreviousWeek", {currentYear: currentYear, daysInCurrentWeek: daysInCurrentWeekDefault});
    } catch (error) {
        console.log(error);
    }
}

const getDaysInCurrentWeek = async () => {
    try {
        return await axios.get("http://localhost:5000/api/calendar/getDaysInCurrentWeek");
    } catch (error) {
        console.log(error);
    }
} 

export { getDaysInNextWeek, getDaysInPreviousWeek, getDaysInCurrentWeek }; 