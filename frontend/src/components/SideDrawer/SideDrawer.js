import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, CssBaseline, useMediaQuery } from '@mui/material';
import axios from 'axios';

//Components
import SideDrawerScreen from './SideDrawerScreen';
import SideDrawerMobile from './SideDrawerMobile';

const SideDrawer = (props) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    const [name, setName] = useState("");

    useEffect(() => {
        let isSubscribed = true;

        const getUserName = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/yourProfile');
                
                if(isSubscribed) 
                    setName(response.data.user.firstName + " " + response.data.user.lastName);
                    
            } catch (error) {
                console.log(error);
            }
        };

        getUserName();
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
