import { Box, Paper, Typography } from '@mui/material';

const Mobile = (props) => {
    
    return (
        <Box>
            <Box sx={{paddingTop: 3, ...(props.open && {marginLeft: 5}), ...(!props.open && {marginLeft: 5})}}>
                <Typography variant='h4'>
                    {props.page}
                </Typography>
            </Box>
            <Box sx={{...(props.open && {marginLeft: 5}), ...(!props.open && {marginLeft: 5}),
                      marginRight: '40px', marginTop: '15px', marginBottom: '40px'}}>
                <Paper elevation={24} sx={{ width: '100%', padding: '20px', borderRadius: '10px'}}> 
                    {props.children}
                </Paper>
            </Box>
        </Box>
    );
}

export default Mobile;
