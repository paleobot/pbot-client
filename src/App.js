import React, { useState } from 'react';
import logo from './PBOT-logo-transparent.png';
import './App.css';
import PBOTInterface from './components/PBOTInterface';
import Footer from "./components/Footer";
import OTUDirectQueryResults from './components/OTU/OTUDirectQueryResults';
import { FormControlUnstyledContext } from '@mui/base';
import { Outlet } from "react-router-dom";

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

    //localStorage.removeItem('PBOTMutationToken');
    return (
        <div className="App">
            <header className="App-header">
            <PBOTIcon rotatePBOT={rotatePBOT} />
            </header>
            <Outlet />
            <br />
            <br />
           <Footer />
        </div>
    );
}

export default App;
