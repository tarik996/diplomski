import axios from 'axios';

const getRoles = async () => {
    try {
        return await axios.get('http://localhost:5000/api/roles/getRoles');
    } catch (error) {
        console.log(error);
    }
}

export { getRoles };