import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Tabs, Tab, Box } from '@mui/material';
//import MDElement from '../MDElement';

const About = () => {
    const [selectedTab, setSelectedTab] = React.useState(0);
    const navigate = useNavigate();

    const handleTabChange = (event, newTab) => {
        setSelectedTab(newTab);
    };

    const style = {textAlign: "center"}
    //Note: The use of hidden for display of result is critical for avoiding repeat executions of that code.
    return (
        <>
        <div style={style}>
            About not yet implemented.
            {/*
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={selectedTab} onChange={handleTabChange} textColor="secondary" indicatorColor="secondary">
                <Tab label="Overview" />
                <Tab label="Our team"/>
                <Tab label="How to cite"/>
                <Tab label="Contact us"/>
            </Tabs>
            </Box>

            <div style={{margin: "10px"}}>
                <div hidden={selectedTab !== 0}>
                    <MDElement path="About/Overview/Overview.md" />
                </div>
                <div hidden={selectedTab !== 1}>
                    <MDElement path="About/OurTeam/OurTeam.md" />
                </div>
                <div hidden={selectedTab !== 2}>
                    <MDElement path="About/HowToCite/HowToCite.md" />
                </div>
                <div hidden={selectedTab !== 3}>
                    <MDElement path="About/Contact/Contact.md" />
                </div>
            </div>
            */}
        </div>
        </>
    )
};

export default About;
