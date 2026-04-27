import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import React from 'react';
import { useAuth } from './AuthContext';

const Account = () => {
    const [token] = useAuth();
    const username = localStorage.getItem('PBOTMeUsername');

    const headerText = !token
        ? "You are not logged in"
        : username
            ? `You are logged in as ${username}`
            : "You are logged in";

    return (
        <Box sx={{mt:"30px", width:"50%", margin:'auto'}}>

            <Typography variant="h5" gutterBottom>{headerText}</Typography>

            Full user-directed account functionality has not been implemented yet. Please contact <a href="mailto:azaffos@arizona.edu">Andrew Zaffos</a> for any needed changes to your account such as resetting your password or changing your email.

        </Box>
    );
};

export default Account;
