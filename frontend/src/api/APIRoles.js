import axios from 'axios';
import { api } from './config';

const getRoles = async () => {
    try {
        return await axios.get(api + '/api/roles/getRoles');
    } catch (error) {
        console.log(error);
    }
}

export { getRoles };