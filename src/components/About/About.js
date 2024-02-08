import React from 'react';
import HowToCite from './HowToCite';
import Overview from './Overview';
import Contact from './Contact';
import OurTeam from './OurTeam';
import { useNavigate, Link } from "react-router-dom";
import { Tabs, Tab, Box } from '@mui/material';

/*
const About = () => (
    <>
    <Link to={"overview"}>Overview</Link>
    <br />
    <Link to={"howtocite"}>How to Cite</Link>
    </>
);
*/

const About = () => {
    const [selectedTab, setSelectedTab] = React.useState(0);
    const navigate = useNavigate();

    const handleTabChange = (event, newTab) => {
        setSelectedTab(newTab);
    };

    const style = {textAlign: "left"}
    //Note: The use of hidden for display of result is critical for avoiding repeat executions of that code.
    return (
        <>
        <div style={style}>
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
                    <Overview />
                </div>
                <div hidden={selectedTab !== 1}>
                    <OurTeam />
                </div>
                <div hidden={selectedTab !== 2}>
                    <HowToCite />
                </div>
                <div hidden={selectedTab !== 3}>
                    <Contact />
                </div>
            </div>
        </div>
        </>
    )
};

export default About;
