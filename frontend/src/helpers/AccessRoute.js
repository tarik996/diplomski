import { useContext } from 'react'; 
import { Navigate } from 'react-router-dom';

//Constants
import { ROLES } from '../constants/AuthorizationConstants';

//Context
import AuthContext from '../context/AuthContext';

function PrivateRoute({ children }) { 
    const { loggedIn } = useContext(AuthContext);

    return loggedIn === true ? children : <Navigate to='/' />;
}

function PublicRoute({ children }) {
    const { loggedIn } = useContext(AuthContext);

    return loggedIn === false ? children : <Navigate to='/home' />; 
}

function AdminRoute({ children }) {
    const { loggedIn, authorization } = useContext(AuthContext);

    if(loggedIn === true && authorization === ROLES.ADMINISTRATOR)
        return children;
    else if(loggedIn === true && authorization.a === false)
        return <Navigate to='/home' />

    return <Navigate to='/' />
}

function AccountantRoute({ children }) {
    const { loggedIn, authorization } = useContext(AuthContext);

    if(loggedIn === true && authorization === ROLES.ACCOUNTANT)
        return children;
    else if(loggedIn === true && authorization.a === false)
        return <Navigate to='/home' />

    return <Navigate to='/' />
}

function AdminAccountantRoute({ children }) {
    const { loggedIn, authorization } = useContext(AuthContext);

    if(loggedIn === true && (authorization === ROLES.ADMINISTRATOR || authorization === ROLES.ACCOUNTANT))
        return children;
    else if(loggedIn === true && authorization.a === false)
        return <Navigate to='/home' />

    return <Navigate to='/' />
}

export { PublicRoute, PrivateRoute, AdminRoute, AccountantRoute, AdminAccountantRoute };