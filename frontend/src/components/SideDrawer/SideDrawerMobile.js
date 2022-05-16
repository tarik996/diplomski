import { useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { Box, Drawer, List, Divider, Avatar, ListItem, ListItemIcon, ListItemText, ListSubheader} from '@mui/material';
import { blue } from '@mui/material/colors';

//Icons
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DoneIcon from '@mui/icons-material/Done';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

//Constants
import { ROLES } from '../../constants/AuthorizationConstants';

//Context
import AuthContext from '../../context/AuthContext';

//Image
import googlecalendar from '../../image/googlecalendar.png';

const DrawerHeader = styled('div')(({ theme }) => ({
    paddingTop: '5px',
    ...theme.mixins.toolbar,
}));

const SideDrawerMobile = (props) => {
    const { authorization } = useContext(AuthContext);

    const toggleDrawer = (open) => (event) => {
        if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
        }
        props.setOpen(open);
    };

    return (
        <Drawer open={props.open} onClose={toggleDrawer(false)}>
            <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                <DrawerHeader>
                    <Link to="/home" style={{textDecoration: 'none', color:'black'}}>
                        <ListItem button key="Kalendar">
                            <ListItemIcon>
                                <Avatar src={googlecalendar}/>
                            </ListItemIcon>
                            <ListItemText primary="Kalendar"/>
                        </ListItem>
                    </Link>
                </DrawerHeader>
                <Divider />
                <DrawerHeader>
                    <Link to="/yourProfile" style={{textDecoration: 'none', color:'black'}}>
                        <ListItem button key="fullName">
                            <ListItemIcon>
                                <Avatar sx={{ bgcolor: blue[600] }} aria-label="recipe">
                                    {props.name.at(0)}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText primary={props.name}/>
                        </ListItem>
                    </Link>
                </DrawerHeader>
                <Divider variant='middle' />
                { ( authorization === ROLES.ADMINISTRATOR ) && (
                    <Box>
                        <List> 
                            { props.open && (
                                <ListSubheader >
                                    ADMIN OPCIJE
                                </ListSubheader>
                            )}
                            <Link to="/allUsers" style={{textDecoration: 'none', color:'black'}}>
                                <ListItem button key="Zaposlenici">
                                    <ListItemIcon sx={{paddingLeft: 1}}>
                                        <GroupIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Zaposlenici" />
                                </ListItem >
                            </Link>
                            <Link to="/employeesWorkingHours" style={{textDecoration: 'none', color:'black'}}>
                                <ListItem button key="RadnoVrijeme">
                                    <ListItemIcon sx={{paddingLeft: 1}}>
                                        <AccessTimeIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Radno vrijeme" />
                                </ListItem >
                            </Link>
                            <Link to="#" style={{textDecoration: 'none', color:'black'}}>
                                <ListItem button key="PlateIzvjestaj">
                                    <ListItemIcon sx={{paddingLeft: 1}}>
                                        <PictureAsPdfIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Plate izvještaj" />
                                </ListItem >
                            </Link>
                        </List>
                        <Divider variant='middle'/>
                    </Box>
                )}
                { ( authorization === ROLES.ACCOUNTANT ) && (
                    <Box>
                        <List> 
                            { props.open && (
                                <ListSubheader >
                                    KNJIGOVOĐA OPCIJE
                                </ListSubheader>
                            )}
                            <Link to="/allUsers" style={{textDecoration: 'none', color:'black'}}>
                                <ListItem button key="Zaposlenici">
                                    <ListItemIcon sx={{paddingLeft: 1}}>
                                        <GroupIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Zaposlenici" />
                                </ListItem >
                            </Link>
                            <Link to="#" style={{textDecoration: 'none', color:'black'}}>
                                <ListItem button key="PlateIzvjestaj">
                                    <ListItemIcon sx={{paddingLeft: 1}}>
                                        <PictureAsPdfIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Plate izvještaj" />
                                </ListItem >
                            </Link>
                        </List>
                        <Divider variant='middle'/>
                    </Box>
                )}
                <Box>
                    <List> 
                        { props.open && (
                            <ListSubheader >
                                ZAPOSLENIK OPCIJE
                            </ListSubheader>
                        )}
                        <Link to="/dailyCheckIn" style={{textDecoration: 'none', color:'black'}}>
                            <ListItem button key="Prijava">
                                <ListItemIcon sx={{paddingLeft: 1}}>
                                    <DoneIcon />
                                </ListItemIcon>
                                <ListItemText primary="Prijava" />
                            </ListItem >
                        </Link>
                        <Link to="#" style={{textDecoration: 'none', color:'black'}}>
                            <ListItem button key="Odmori">
                                <ListItemIcon sx={{paddingLeft: 1}}>
                                    <WbSunnyIcon />
                                </ListItemIcon>
                                <ListItemText primary="Odmori" />
                            </ListItem >
                        </Link>
                        <Link to="#" style={{textDecoration: 'none', color:'black'}}>
                            <ListItem button key="PlateIzvjestaj">
                                <ListItemIcon sx={{paddingLeft: 1}}>
                                    <PictureAsPdfIcon />
                                </ListItemIcon>
                                <ListItemText primary="Plate izvještaj" />
                            </ListItem >
                        </Link>
                    </List>
                </Box>  
            </Box>
        </Drawer>  
    );
}

export default SideDrawerMobile;
