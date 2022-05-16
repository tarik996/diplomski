import axios from 'axios';

const checkIn = async (user) => {
    try {
        return await axios.post("http://localhost:5000/api/statusRecord/checkIn", user);
    } catch (error) {
        console.log(error);
    }
}

const isCheckIn = async () => {
    try {
        return await axios.get("http://localhost:5000/api/statusRecord/isCheckIn");
    } catch (error) {
        console.log(error);
    }
}

export { checkIn, isCheckIn };