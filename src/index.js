import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import {createRoot} from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider, 
    Navigate
} from "react-router-dom";
import App from './App';
import Action from './components/Action';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import AZlibAdminInterface from './components/AZlibAdminInterface';
import './index.css';
import About from './components/About/About';
import HowToUseAzlibAdmin from './components/HowToUseAzlibAdmin/HowToUseAzlibAdmin';

//import '@fontsource/roboto/300.css';
//import '@fontsource/roboto/400.css';
//import '@fontsource/roboto/500.css';
//import '@fontsource/roboto/700.css';

/*
//This approach is from https://stackoverflow.com/a/74411049
let consoleDisabled = true; //TODO: figure out how to allow other components to change this
const nullFunc = function(){};
console = new Proxy(console, {
    get(target, prop, receiver){
        if(prop==='log' && consoleDisabled){
            return nullFunc;
        }
        return Reflect.get(...arguments)
    }
});
*/
//I used the above approach with the intent to have the ability to turn logging on/off per file.
//But something weird is happening with the Reflect. It returns a null function even when I turn 
//logging on. I've spent too much time trying to figure it out, so poop on the whole thing. 
//I'm just gonna do:
//console.log = function() {}

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { 
                index: true, 
                //element: <Home /> Don't really need a home for azlib
                element: <Navigate to="/mutate" replace />
            },
            {
                path: "login",
                element: <LoginForm/>
            },
            {
                path: "about",
                element: <About/>
            },
            {
                path: "howto",
                element: <HowToUseAzlibAdmin/>
            },
            {
                path: "query",
                element: <AZlibAdminInterface formClass="query" />,
                children: [
                    { 
                        index: true, 
                        element: <Action /> 
                    },
                    {
                        path: "change",
                        element: <Action selectedForm="change" />,
                    },
                ]
            },
            {
                path: "mutate",
                element: <AZlibAdminInterface formClass="mutate" />,
                children: [
                    { 
                        index: true, 
                        element: <Action /> 
                    },
                    {
                        path: "collection",
                        element: <Action selectedForm="collection" />,
                    },
                    {
                        path: "collectiongroup",
                        element: <Action selectedForm="collectionGroup" />,
                    },
                    {
                        path: "user",
                        element: <Action selectedForm="user" />,
                    },
                ]
            }
        ]
    },
    
]);

const theme = createTheme({
    palette: {
        primary: {
            main: "#0c234b"
        },
        secondary: {
            main: "#ab0520"
        }
    },
    components : {
        MuiTextField: {
            defaultProps: {
                variant: "standard"
            },
            styleOverrides: {
                root: {
                    width: "400px"
                }
            }
      },
      MuiCheckbox: {
          defaultProps: {
              color: "secondary"
          }
      },
      MuiRadio: {
          defaultProps: {
              color: "secondary"
          }
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: "0.9em",
          }
        }
      },
      MuiMenuItem: {
        styleOverrides: {
            root: {
                "&.Mui-selected": {
                  backgroundColor: "#dddddd",
                } 
            }
            
        }
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: "#ab0520", //For some reason, I can't use "secondary" here
            fontWeight: "bold"
          },
        },
      },

    }
});

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

//ReactDOM.render(
root.render(
    //<React.StrictMode>
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </StyledEngineProvider>
  //</React.StrictMode>
  //,
  //document.getElementById('root')
);

