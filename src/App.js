import React, { useState } from 'react';
import logo from './PBOT-logo-transparent.png';
import './App.css';
import PBOTInterface from './components/PBOTInterface';
import Footer from "./components/Footer";
import OTUDirectQueryResults from './components/OTU/OTUDirectQueryResults';

const PBOTIcon = ({rotatePBOT}) => {
    const rotate = rotatePBOT ? "rotateY(180deg)" : "rotateY(0)";
    return (
             <img src={logo} style={{ transform: rotate, transition: "all 0.2s linear", height: "30vmin" }}  />
      )
}

function App() {
    const [rotatePBOT, setRotatePBOT] = useState(true);

    //localStorage.removeItem('PBOTMutationToken');
    return (
        <div className="App">
            <header className="App-header">
            <PBOTIcon rotatePBOT={rotatePBOT} />
            </header>
            <PBOTInterface setRotatePBOT={setRotatePBOT}/>
            <br />
            <br />
           <Footer />
        </div>
    );
}

export default App;
