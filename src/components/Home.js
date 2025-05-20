import { Button, Grid } from '@mui/material';
import React from 'react';
import { useNavigate, redirect } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    return (
        <Grid container alignItems="center" justifyContent="center">
            <Grid item alignContent="left">
                <span style={{fontSize: "4rem", textAlign:"left"}}>PBot </span><span style={{fontSize: "2rem", textAlign:"left"}}>Integrative Paleobotany Portal</span>
                <br />
                <span style={{fontSize: "1.35rem", textAlign:"left", fontStyle: 'italic'}}>The community gateway to fossil plant research and education</span>
            </Grid>

            <Grid container item sx={{mt:"0px", mb:"50px"}} alignItems="center" justifyContent="center" spacing={10}>
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={() => {navigate(`/query`);}}>Explore<br/>fossil plants</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={() => {navigate(`/mutate`);}}>Go to<br />Workbench</Button>
                </Grid>
            </Grid>
        </Grid>

    )
};

export default Home;
