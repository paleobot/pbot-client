import { Button, Grid, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../PBOT-logo-transparent.png';

const PBOTIcon = ({rotatePBOT}) => {
    const rotate = rotatePBOT ? "rotateY(180deg)" : "rotateY(0)";
    return (
             <img src={logo} style={{ transform: rotate, transition: "all 0.2s linear", height: "150px" }}  />
      )
}


const Home = () => {
    const navigate = useNavigate();
    return (
        <Grid container alignItems="center" justifyContent="center">
            <Grid item>
                <PBOTIcon />
            </Grid>
            <Grid item alignContent="left">
                <span style={{fontSize: "4rem", textAlign:"left"}}>PBot </span><span style={{fontSize: "2rem", textAlign:"left"}}>Integrative Paleobotany Portal</span>
                <br />
                <span style={{fontSize: "1.35rem", textAlign:"left", fontStyle: 'italic'}}>The community gateway to fossil plant research and education</span>
            </Grid>
            <Grid container item alignItems="center" justifyContent="center" spacing={10}>
                <Grid item>
                    <Button variant="contained" size="large" color="success" onClick={() => {navigate(`/query`);}}>Explore<br/>fossil plants</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" size="large" color="success" onClick={() => {navigate(`/mutate`);}}>Go to<br />Workbench</Button>
                </Grid>
            </Grid>
        </Grid>
    )
};

export default Home;
