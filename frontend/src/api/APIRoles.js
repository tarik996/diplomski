import axios from 'axios';

const getRoles = async () => {
    try {
        return await axios.get('https://tarik-diplomski.herokuapp.com/api/roles/getRoles');
    } catch (error) {
        console.log(error);
    }
}

export { getRoles };