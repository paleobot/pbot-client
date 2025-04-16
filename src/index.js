import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
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
import RegisterForm from './components/RegisterForm';
import './index.css';
import reportWebVitals from './reportWebVitals';

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
                path: "register",
                element: <RegisterForm/>
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
                        path: "dictionary",
                        element: <Action selectedForm="specimen" />,
                    },
                    {
                        path: "person",
                        element: <Action selectedForm="person" />,
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

ReactDOM.render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </StyledEngineProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
