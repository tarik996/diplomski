import { useEffect, createContext, useCallback, useRef } from 'react';
import useLocalStorage from '../hooks/UseLocalStorage';

//Api
import { getUserRole, isLoggedIn } from '../api/APIAuthentication';
import { isCheckIn } from '../api/APIStatusRecord';

const AuthContext = createContext();

function AuthContextProvider(props) {
    const isSubscribed = useRef(true);
    
    const [loggedIn, setLoggedIn] = useLocalStorage(props.authKey1);
    const [authorization, setAuthorization] = useLocalStorage(props.authKey2);
    const [flagCheckIn, setFlagCheckIn] = useLocalStorage(props.isCheckIn);

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

    const getIsCheckIn = useCallback ( async () => {
        isCheckIn().then((response) => {
            setFlagCheckIn(response.data);
        });
    }, [setFlagCheckIn])

    useEffect(() => {
        if(isSubscribed.current) {     
            getLoggedIn();
            getAuthorization();
            if(loggedIn)
                getIsCheckIn();
            else 
                setFlagCheckIn(false);
        }
        
        return () => isSubscribed.current = false;
    }, [getLoggedIn, getAuthorization, getIsCheckIn, loggedIn, setFlagCheckIn]);

    return (
        <AuthContext.Provider value={{loggedIn, getLoggedIn, authorization, getAuthorization, flagCheckIn, getIsCheckIn, setFlagCheckIn}}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };
