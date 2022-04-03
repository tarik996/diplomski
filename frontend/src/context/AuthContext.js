import { useEffect, createContext, useCallback, useRef } from 'react';
import useLocalStorage from '../hooks/UseLocalStorage';
import axios from 'axios';

const AuthContext = createContext();

function AuthContextProvider(props) {
    const isSubscribed = useRef(true);
    
    const [loggedIn, setLoggedIn] = useLocalStorage(props.authKey1);
    const [authorization, setAuthorization] = useLocalStorage(props.authKey2);

    const getLoggedIn = useCallback ( async () => {
        try {
            const loggedInRes = await axios.get("http://localhost:5000/api/auth/loggedIn");
            setLoggedIn(loggedInRes.data); 
        } catch (error) {
            console.log(error);
        }
    }, [setLoggedIn]);

    const getAuthorization = useCallback ( async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/auth/roleAuthorization");
            setAuthorization(response.data);
        } catch (error) {
            console.log(error);
        }
    }, [setAuthorization]);

    useEffect(() => {
        if(isSubscribed.current) {     
            getLoggedIn();
            getAuthorization();
        }
        
        return () => isSubscribed.current = false;
    }, [getLoggedIn, getAuthorization]);

    return (
        <AuthContext.Provider value={{loggedIn, getLoggedIn, authorization, getAuthorization }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };
