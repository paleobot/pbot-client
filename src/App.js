import React, { useState } from 'react';
//import logo from './logo.svg';
import logo from './PBOT-logo-transparent.png';
import './App.css';
//import Query from './components/Query';
//import ApolloQuery from './components/ApolloQuery';
//import OTUQueryForm from './components/OTUQueryForm';
import QueryInterface from './components/QueryInterface';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#bdbdbd"
    },
    secondary: {
      main: "#66bb6a"
    }
  }
});

const PBOTIcon = ({rotatePBOT}) => {
    const rotate = rotatePBOT ? "rotateY(180deg)" : "rotateY(0)";
    return (
             <img src={logo} style={{ transform: rotate, transition: "all 0.2s linear", height: "30vmin" }}  />
      )
}

function App() {
    const [rotatePBOT, setRotatePBOT] = useState(true);
    localStorage.removeItem('PBOTMutationToken');
    return (
    <ThemeProvider theme={theme}>
    <div className="App">
        <header className="App-header">
        <PBOTIcon rotatePBOT={rotatePBOT} />
        </header>
        <QueryInterface setRotatePBOT={setRotatePBOT}/>
        <br />
        <br />
    </div>
    </ThemeProvider>
    );
}

export default App;
