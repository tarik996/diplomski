import { useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useMediaQuery, Box } from '@mui/material';
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
import ScreenCalendar from '../components/Calendar/Calendar';

//User
import ViewYourProfile from '../components/User/ViewYourProfile';
import UsersTable from '../components/User/UsersTable';
import CreateUserForm from '../components/User/CreateUserForm';
import ViewProfile from '../components/User/ViewProfile';
import ViewProfileSallary from '../components/User/ViewProfileSallary';
import EditUserForm from '../components/User/EditUserForm';
import EditUserFormSallary from '../components/User/EditUserFormSallary';

//EmployeesWorkingHours
import UsersWorkingHoursTable from '../components/UsersWorkingHours/UsersWorkingHoursTable';
import WorkingHoursReport from '../components/UsersWorkingHours/WorkingHoursReport';
import UserWorkingHoursReport from '../components/UsersWorkingHours/UserWorkingHoursReport';

//Sallary
import Sallary from '../components/Sallary/Sallary';
import SallaryReport from '../components/Sallary/SallaryReport';
import UserSallaryReport from '../components/Sallary/UserSallaryReport';

//UserCheckIn
import UserCheckInForm from '../components/UserCkeckIn/UserCheckInForm';

//OtherStatus
import OtherStatus from '../components/OtherStatus/OtherStatus';

//Status
import EmployeeStatusForm from '../components/EmployeeStatus/EmployeeStatusForm';
import EmployeeStatusTable from '../components/EmployeeStatus/EmployeeStatusTable';
import EditEmployeeStatus from '../components/EmployeeStatus/EditEmployeeStatus';

//Context
import AuthContext from '../context/AuthContext';

//Route access
import { PrivateRoute , PublicRoute, AdminRoute, AdminAccountantRoute, AccountantRoute } from '../helpers/AccessRoute';

const Router = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));
    
    const [message, setMessage] = useState("");
    const [isLogOut, setIsLogOut] = useState(false);

    const { loggedIn, getIsCheckIn, setFlagCheckIn } = useContext(AuthContext);

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
        if(loggedIn === true)
            getIsCheckIn();
        else 
            setFlagCheckIn(false);
        if(isSubscribed) {
            if(!matches) setOpen(true);
            else setOpen(false);  
        }
        return () => isSubscribed = false;
    }, [matches, getIsCheckIn, loggedIn, setFlagCheckIn]);

    return (
        <BrowserRouter>
            { loggedIn === true && (
                <Box>
                    <SideDrawer open={open} setOpen={setOpen} />
                    <Navbar toggleSideDrawer={toggleSideDrawer} open={open} callBack={callBack}/>
                </Box>
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
                                    <ScreenCalendar page={'Kalendar'} />
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
                <Route path="/userSallaryReport" element={
                    <PrivateRoute>
                        { matches ? (
                                <Mobile open={open} >
                                    <UserSallaryReport page={'Profil'} />
                                </Mobile>
                            ) : (
                                <Screen open={open} >
                                    <UserSallaryReport page={'Profil'} />
                                </Screen>
                            )
                        }
                    </PrivateRoute>
                } />
                <Route path="/allUsers" element={
                    <AdminAccountantRoute>
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
                    </AdminAccountantRoute>
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
                <Route path="/editUserSallary/:userId" element={
                    <AccountantRoute>
                        { matches ? (
                                <Mobile open={open} >
                                    <EditUserFormSallary page={'Promjeni korisnika'} />
                                </Mobile>
                            ) : (
                                <Screen open={open} >
                                    <EditUserFormSallary page={'Promjeni korisnika'} />
                                </Screen>
                            )
                        }
                    </AccountantRoute>
                } />
                <Route path="/profileSallary/:userId" element={
                    <AccountantRoute>
                        { matches ? (
                                <Mobile open={open} >
                                    <ViewProfileSallary page={'Profil'} />
                                </Mobile>
                            ) : (
                                <Screen open={open} >
                                    <ViewProfileSallary page={'Profil'} />
                                </Screen>
                            )
                        }
                    </AccountantRoute>
                } />
                <Route path="/calculateSallary" element={
                    <AccountantRoute>
                        { matches ? (
                                <Mobile open={open} >
                                    <Sallary page={'Obračun plata'} />
                                </Mobile>
                            ) : (
                                <Screen open={open} >
                                    <Sallary page={'Obračun plata'} />
                                </Screen>
                            )
                        }
                    </AccountantRoute>
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
                <Route path="/employeeStatus/:userId" element={
                    <AdminRoute>
                        { matches ? (
                                <Mobile open={open} >
                                    <EmployeeStatusTable page={'Statusi'} />
                                </Mobile>
                            ) : (
                                <Screen open={open} >
                                    <EmployeeStatusTable page={'Statusi'} />
                                </Screen>
                            )
                        }
                    </AdminRoute>
                } />
                <Route path="/editEmployeeStatus/:statusId" element={
                    <AdminRoute>
                        { matches ? (
                                <Mobile open={open} >
                                    <EditEmployeeStatus page={'Promjeni status'} />
                                </Mobile>
                            ) : (
                                <Screen open={open} >
                                    <EditEmployeeStatus page={'Promjeni status'} />
                                </Screen>
                            )
                        }
                    </AdminRoute>
                } />
                <Route path="/employeesWorkingHours" element={
                    <AdminAccountantRoute>
                        { matches ? (
                                <Mobile open={open} >
                                    <UsersWorkingHoursTable page={'Radno vrijeme'} />
                                </Mobile>
                            ) : (
                                <Screen open={open} >
                                    <UsersWorkingHoursTable page={'Radno vrijeme'} />
                                </Screen>
                            )
                        }
                    </AdminAccountantRoute>
                } />
                <Route path="/sallaryReport" element={
                    <AdminAccountantRoute>
                        { matches ? (
                                <Mobile open={open} >
                                    <SallaryReport page={'Plate izvještaj'} />
                                </Mobile>
                            ) : (
                                <Screen open={open} >
                                    <SallaryReport page={'Plate izvještaj'} />
                                </Screen>
                            )
                        }
                    </AdminAccountantRoute>
                } />
                <Route path='/workingReport' element={
                    <AdminAccountantRoute>
                        { matches ? (
                                <Mobile open={open} >
                                    <WorkingHoursReport page={'Radno vrijeme izvještaji'} />
                                </Mobile>
                            ) : (
                                <Screen open={open} >
                                    <WorkingHoursReport page={'Radno vrijeme izvještaji'} />
                                </Screen>
                            )
                        }
                    </AdminAccountantRoute>
                } />
                <Route path='/userWorkingHours/:userId' element={
                    <AdminAccountantRoute>
                        { matches ? (
                                <Mobile open={open} >
                                    <UserWorkingHoursReport page={'Radno vrijeme izvještaji'} />
                                </Mobile>
                            ) : (
                                <Screen open={open} >
                                    <UserWorkingHoursReport page={'Radno vrijeme izvještaji'} />
                                </Screen>
                            )
                        }
                    </AdminAccountantRoute>
                } />
                <Route path="/dailyCheckIn" element={
                    <PrivateRoute>
                        { matches ? (
                                <Mobile open={open} page={'Prijava'} >
                                    <UserCheckInForm page={'Prijava'} />
                                </Mobile>
                            ) : (
                                <Screen open={open} page={'Prijava'} >
                                    <UserCheckInForm page={'Prijava'} />
                                </Screen>
                            )
                        }
                    </PrivateRoute>
                } />
                <Route path="/otherStatus" element={
                    <PrivateRoute>
                        { matches ? (
                                <Mobile open={open}  page={'Ostali statusi'} >
                                    <OtherStatus page={'Ostali statusi'} />
                                </Mobile>
                            ) : (
                                <Screen open={open}  page={'Ostali statusi'} >
                                    <OtherStatus page={'Ostali statusi'} />
                                </Screen>
                            )
                        }
                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;