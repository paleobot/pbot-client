import React, { useState } from 'react';
//import logo from './logo.svg';
import logo from './PBOT-logo-transparent.png';
import './App.css';
//import Query from './components/Query';
//import ApolloQuery from './components/ApolloQuery';
//import OTUQueryForm from './components/OTUQueryForm';
import PBOTInterface from './components/PBOTInterface';
import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material';
import Footer from "./components/Footer";

const theme = createTheme(adaptV4Theme({
    palette: {
        primary: {
        main: "#bdbdbd"
        },
        secondary: {
        main: "#66bb6a"
        }
    },
    props: {
        MuiTextField: {
            variant: "standard",
        },
        MuiCheckbox: {
            color: "secondary"
        },
        MuiRadio: {
            color: "secondary"
        }
    }
}));

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
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
        <div className="App">
            <header className="App-header">
            <PBOTIcon rotatePBOT={rotatePBOT} />
            </header>
            <PBOTInterface setRotatePBOT={setRotatePBOT}/>
            <br />
            <br />
           <Footer />
        </div>
        </ThemeProvider>
      </StyledEngineProvider>
    );
}

export default App;
