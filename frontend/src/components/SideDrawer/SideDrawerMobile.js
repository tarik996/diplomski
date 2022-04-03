import { useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { Box, Drawer, List, Divider, Avatar, ListItem, ListItemIcon, ListItemText, ListSubheader} from '@mui/material';
import { blue } from '@mui/material/colors';

//Icons
import GroupIcon from '@mui/icons-material/Group';

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
                        </List>
                        <Divider variant='middle'/>
                    </Box>
                )}
                <Divider />    
            </Box>
        </Drawer>  
    );
}

export default SideDrawerMobile;
