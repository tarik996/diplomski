import { useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { Box, Drawer, List, Divider, Avatar, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { blue } from '@mui/material/colors';

//Icons
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DoneIcon from '@mui/icons-material/Done';
import ReadMoreIcon from '@mui/icons-material/ReadMore';

//Constants
import { ROLES } from '../../constants/AuthorizationConstants';

//Context
import AuthContext from '../../context/AuthContext';

//Image
import googlecalendar from '../../image/googlecalendar.png';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    paddingTop: '5px',
    ...theme.mixins.toolbar,
}));

const LeftDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const SideDrawerScreen = (props) => {
    const { authorization } = useContext(AuthContext);

    return (
        <LeftDrawer variant="permanent" open={props.open}>
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
                    <Link to="/otherStatus" style={{textDecoration: 'none', color:'black'}}>
                        <ListItem button key="Ostali statusi">
                            <ListItemIcon sx={{paddingLeft: 1}}>
                                <ReadMoreIcon />
                            </ListItemIcon>
                            <ListItemText primary="Ostali statusi" />
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
        </LeftDrawer>
    );
}

export default SideDrawerScreen;
