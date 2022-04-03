import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, CssBaseline, useMediaQuery } from '@mui/material';

//Components
import SideDrawerScreen from './SideDrawerScreen';
import SideDrawerMobile from './SideDrawerMobile';

//Api
import { getYourProfileData } from '../../api/APIUsers';

const SideDrawer = (props) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    const [name, setName] = useState("");

    useEffect(() => {
        let isSubscribed = true;

        getYourProfileData().then((response) => {
            if(isSubscribed) 
                setName(response.data.user.firstName + " " + response.data.user.lastName);
        });

        return () => isSubscribed = false;
    }, []);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {
                matches && (
                    <SideDrawerMobile open={props.open} setOpen={props.setOpen} name={name}/>
                )
            } 
            { 
                !matches && (
                    <SideDrawerScreen open={props.open} name={name}/>
                )
            }
        </Box>
    );
}

export default SideDrawer;
