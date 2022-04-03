import { useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { Box, Drawer, List, Divider, Avatar, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { blue } from '@mui/material/colors';

//Icons
import GroupIcon from '@mui/icons-material/Group';

//Constants
import { ROLES } from '../../constants/Authorization';

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
                    </List>
                    <Divider variant='middle'/>
                </Box>
            )}
            <Divider />
        </LeftDrawer>
    );
}

export default SideDrawerScreen;
