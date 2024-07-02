import React, { useState } from 'react';
import logo from './PBOT-logo-transparent.png';
import './App.css';
import PBOTInterface from './components/PBOTInterface';
import Footer from "./components/Footer";
import { Button, Stack } from '@mui/material';
import OTUDirectQueryResults from './components/OTU/OTUDirectQueryResults';
//import { FormControlUnstyledContext } from '@mui/base';
import { Link, Outlet, useNavigate } from "react-router-dom";
import NavBar from './components/NavBar';
import { AuthProvider } from './components/AuthContext';
import { GlobalProvider } from './components/GlobalContext';

const PBOTIcon = ({rotatePBOT}) => {
    const rotate = rotatePBOT ? "rotateY(180deg)" : "rotateY(0)";
    return (
             <img src={logo} style={{ transform: rotate, transition: "all 0.2s linear", height: "30vmin" }}  />
      )
}

function App(props) {
    console.log("----------------App-------------------------");
    console.log(props);
    console.log(window.location.pathname)
    //console.log(formClass);
    //console.log(form)
    
    const [rotatePBOT, setRotatePBOT] = useState(true);
    const navigate = useNavigate();

    const me = localStorage.getItem('PBOTMe');

    if (!me || !me.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
        localStorage.removeItem('PBOTMe');
        localStorage.removeItem('PBOTMutationToken');
    }

    //localStorage.removeItem('PBOTMutationToken');
    return (
        <div className="App">
            <GlobalProvider>
            <AuthProvider>
                <NavBar />
                <Outlet />
                <br />
                <Stack direction="row" spacing={5} justifyContent="center" sx={{marginTop: "30px"}}>
                    <Button color="secondary" variant="contained" onClick={() => {navigate(`/about`);}}>About</Button>
                    <Button color="secondary" variant="contained" onClick={() => {navigate(`/howto`);}}>How to use Pbot</Button>
                    <Button color="secondary" variant="contained" onClick={() => {navigate(`/resources`);}}>Resources</Button>
                    <Button color="secondary" variant="contained" onClick={() => {navigate(`/education`);}}>Go to Education & Outreach Hub</Button>
                </Stack>
                <br />
                <br />
            <Footer />
           </AuthProvider>
           </GlobalProvider>
        </div>
    );
}

export default App;
