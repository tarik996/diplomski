import { useEffect, createContext, useCallback, useRef } from 'react';
import useLocalStorage from '../hooks/UseLocalStorage';

//Api
import { getUserRole, isLoggedIn } from '../api/APIAuthentication';

const AuthContext = createContext();

function AuthContextProvider(props) {
    const isSubscribed = useRef(true);
    
    const [loggedIn, setLoggedIn] = useLocalStorage(props.authKey1);
    const [authorization, setAuthorization] = useLocalStorage(props.authKey2);

    const getLoggedIn = useCallback ( async () => {
        isLoggedIn().then((loggedInRes) => {
            setLoggedIn(loggedInRes.data); 
        });
    }, [setLoggedIn]);

    const getAuthorization = useCallback ( async () => {
        getUserRole().then((response) => {
            setAuthorization(response.data);
        });
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
