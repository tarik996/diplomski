import { useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

//Screens
import Screen from '../components/Screen/Screen';
import Mobile from '../components/Screen/Mobile';

//Pages
import Login from './Login';

//Components
import SideDrawer from '../components/SideDrawer/SideDrawer';
import Navbar from '../components/Navbar';

//Calendar
import MobileCalendar from '../components/Calendar/MobileCalendar';
import ScreenCalendar from '../components/Calendar/ScreenCalendar';

//User
import ViewYourProfile from '../components/User/ViewYourProfile';
import UsersTable from '../components/User/UsersTable';
import CreateUserForm from '../components/User/CreateUserForm';
import ViewProfile from '../components/User/ViewProfile';
import EditUserForm from '../components/User/EditUserForm';

//Status
import EmployeeStatusForm from '../components/EmployeeStatus/EmployeeStatusForm';

//Context
import AuthContext from '../context/AuthContext';

//Route access
import { PrivateRoute , PublicRoute, AdminRoute } from '../helpers/AccessRoute';

const Router = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));
    
    const [message, setMessage] = useState("");
    const [isLogOut, setIsLogOut] = useState(false);

    const { loggedIn } = useContext(AuthContext);

    const [open, setOpen] = useState(false);

    const callBack = (message, isLogOut) => {
        setMessage(message);
        setIsLogOut(isLogOut);
    }

    const toggleSideDrawer = () => {
        if(!open) {
            setOpen(true);
        }
        else {
            setOpen(false);
        }
    }

    useEffect(() => {
        let isSubscribed = true;
        if(isSubscribed) {
            if(!matches) setOpen(true);
            else setOpen(false);  
        }
        return () => isSubscribed = false;
    }, [matches]);

    return (
        <div>
            <BrowserRouter>
                { loggedIn === true && (
                    <div>
                        <SideDrawer open={open} setOpen={setOpen} />
                        <Navbar toggleSideDrawer={toggleSideDrawer} open={open} callBack={callBack}/>
                    </div>
                )}
                <Routes>
                    <Route path="/" element={
                        <PublicRoute>
                            <Login message={message} isLogOut={isLogOut} setIsLogOut={setIsLogOut}/>
                        </PublicRoute>
                    } />
                    <Route path="/home" element={
                        <PrivateRoute>
                            { matches ? (
                                    <Mobile open={open} >
                                        <MobileCalendar page={'Kalendar'} />
                                    </Mobile>
                                ) : (
                                    <Screen open={open} >
                                        <ScreenCalendar page={'Kalendar'} />
                                    </Screen>
                                )
                            }
                        </PrivateRoute>
                    } />
                    <Route path="/yourProfile" element={
                        <PrivateRoute>
                            { matches ? (
                                    <Mobile open={open} >
                                        <ViewYourProfile page={'Profil'} />
                                    </Mobile>
                                ) : (
                                    <Screen open={open} >
                                        <ViewYourProfile page={'Profil'} />
                                    </Screen>
                                )
                            }
                        </PrivateRoute>
                    } />
                    <Route path="/allUsers" element={
                        <AdminRoute>
                            { matches ? (
                                    <Mobile open={open} >
                                        <UsersTable page={'Zaposlenici'} />
                                    </Mobile>
                                ) : (
                                    <Screen open={open} >
                                        <UsersTable page={'Zaposlenici'} />
                                    </Screen>
                                )
                            }
                        </AdminRoute>
                    } />
                    <Route path="/createUser" element={
                        <AdminRoute>
                            { matches ? (
                                    <Mobile open={open} >
                                        <CreateUserForm page={'Dodaj korisnika'} />
                                    </Mobile>
                                ) : (
                                    <Screen open={open} >
                                        <CreateUserForm page={'Dodaj korisnika'} />
                                    </Screen>
                                )
                            }
                        </AdminRoute>
                    } />
                    <Route path="/profile/:userId" element={
                        <AdminRoute>
                            { matches ? (
                                    <Mobile open={open} >
                                        <ViewProfile page={'Profil'} />
                                    </Mobile>
                                ) : (
                                    <Screen open={open} >
                                        <ViewProfile page={'Profil'} />
                                    </Screen>
                                )
                            }
                        </AdminRoute>
                    } />
                    <Route path="/editUser/:userId" element={
                        <AdminRoute>
                            { matches ? (
                                    <Mobile open={open} >
                                        <EditUserForm page={'Promjeni korisnika'} />
                                    </Mobile>
                                ) : (
                                    <Screen open={open} >
                                        <EditUserForm page={'Promjeni korisnika'} />
                                    </Screen>
                                )
                            }
                        </AdminRoute>
                    } />
                    <Route path="/createEmployeeStatus/:userId" element={
                        <AdminRoute>
                            { matches ? (
                                    <Mobile open={open} >
                                        <EmployeeStatusForm page={'Dodaj status'} />
                                    </Mobile>
                                ) : (
                                    <Screen open={open} >
                                        <EmployeeStatusForm page={'Dodaj status'} />
                                    </Screen>
                                )
                            }
                        </AdminRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Router;