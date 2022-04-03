import { useState , useRef , useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { AppBar, Box, Toolbar, IconButton, MenuList, MenuItem, ClickAwayListener, Popper, Grow, Paper} from '@mui/material';

//Context
import AuthContext from '../context/AuthContext';

//Icons
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';

//Api
import { getLogOut } from '../api/APIAuthentication';

const StyledBox = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })(({theme, open}) => ({
    [theme.breakpoints.down('md')]: {
        ...(!open && { marginLeft: 0}),
    },
    [theme.breakpoints.up('md')]: {
        ...(!open && {marginLeft: 73}),
        ...(open && {marginLeft: 240}),
    }
}));

const Navbar = (props) => {
    const anchorRef = useRef(null);

    const { getLoggedIn, getAuthorization } = useContext(AuthContext);

    const [open, setOpen] = useState(false);

    const logOut = async (event) => {
        event.preventDefault();

        getLogOut().then((response) => {
            getLoggedIn();
            getAuthorization();
            props.callBack(response.data.message, response.data.isLogOut);
        });
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) 
            return;
        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const renderMobileMenu = (
        <Popper style={{zIndex: '100'}} 
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
        >
            {({ TransitionProps, placement }) => (
                <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom-start' ? 'right top' : 'right top' }}>
                    <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                            <MenuList autoFocus={open} id='composition-menu' onKeyDown={handleListKeyDown} >
                                <Link to="/yourProfile" style={{textDecoration: 'none', width: '100%', color: 'black'}} >
                                    <MenuItem>
                                        <IconButton size="large" color="inherit">
                                            <AccountCircle />
                                        </IconButton>
                                        <p>Profile</p>
                                    </MenuItem>
                                </Link> 
                                <MenuItem onClick={logOut}>
                                    <IconButton size="large" color="inherit">
                                        <LogoutIcon />
                                    </IconButton>
                                    <p>Odjavi se</p>
                                </MenuItem>
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper>
    );

    return (
        <StyledBox sx={[{ flexGrow: 1 }]} open={props.open}>
            <AppBar position='static'>
                <Toolbar>
                    <IconButton size="large" color="inherit" sx={{ ml: 0,  ...(!props.open && {marginLeft: 1})}} onClick={props.toggleSideDrawer}>
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' }}}>
                        <Link to="/yourProfile" style={{textDecoration: 'none', width: '100%', color: 'white'}} >
                            <IconButton size="large" color="inherit">
                                <AccountCircle />
                            </IconButton>
                        </Link>
                        <IconButton size="large" color="inherit" onClick={logOut}>
                            <LogoutIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            ref={anchorRef}
                            id='composition-button'
                            size="large"
                            aria-label="show more"
                            aria-controls={open ? 'composition-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleToggle}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
        </StyledBox>
    );   
}

export default Navbar;
