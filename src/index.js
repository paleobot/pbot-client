import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import OTUDirectQueryResults from './components/OTU/OTUDirectQueryResults';
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import PBOTInterface from './components/PBOTInterface';
import Action from './components/Action';
import About from './components/About';
import HowToUsePbot from './components/HowToUsePbot';
import Resources from './components/Resources';
import GoToEducationOutreachHub from './components/GoToEducationOutreachHub';
import Profile from './components/Profile';
import Account from './components/Account';
import Logout from './components/Logout';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Home from './components/Home';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { 
                index: true, 
                element: <Home /> 
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
                path: "about",
                element: <About/>
            },
            {
                path: "howto",
                element: <HowToUsePbot/>
            },
            {
                path: "resources",
                element: <Resources/>
            },
            {
                path: "education",
                element: <GoToEducationOutreachHub/>
            },
            {
                path: "profile",
                element: <Profile/>
            },
            {
                path: "account",
                element: <Account/>
            },
            {
                path: "logout",
                element: <Logout/>
            },
             {
                path: "query",
                element: <PBOTInterface formClass="query" />,
                children: [
                    { 
                        index: true, 
                        element: <Action /> 
                    },
                    {
                        path: "otu",
                        element: <Action  selectedForm="otu"/>,
                    },
                    {
                        path: "specimen",
                        element: <Action  selectedForm="specimen" />,
                    },
                    {
                        path: "reference",
                        element: <Action selectedForm="reference" />,
                    },
                    {
                        path: "schema",
                        element: <Action selectedForm="schema" />,
                    },
                    {
                        path: "person",
                        element: <Action selectedForm="person" />,
                    },
                ]
            },
            {
                path: "mutate",
                element: <PBOTInterface formClass="mutate" />,
                children: [
                    { 
                        index: true, 
                        element: <Action /> 
                    },
                    {
                        path: "otu",
                        element: <Action selectedForm="otu" />,
                    }, 
                    {
                        path: "synonym",
                        element: <Action selectedForm="synonym" />,
                    }, 
                    {
                        path: "comment",
                        element: <Action selectedForm="comment" />,
                    }, 
                    {
                        path: "description",
                        element: <Action selectedForm="description" />,
                    }, 
                    {
                        path: "characterinstance",
                        element: <Action selectedForm="characterinstance" />,
                    }, 
                    {
                        path: "specimen",
                        element: <Action selectedForm="specimen" />,
                    },
                    {
                        path: "collection",
                        element: <Action selectedForm="collection" />,
                    },
                    {
                        path: "reference",
                        element: <Action selectedForm="reference" />,
                    },
                    {
                        path: "schema",
                        element: <Action selectedForm="schema" />,
                    },
                    {
                        path: "character",
                        element: <Action selectedForm="character" />,
                    },
                    {
                        path: "state",
                        element: <Action selectedForm="state" />,
                    },
                    {
                        path: "group",
                        element: <Action selectedForm="group" />,
                    },
                    {
                        path: "person",
                        element: <Action selectedForm="person" />,
                    },
                    {
                        path: "image",
                        element: <Action selectedForm="image" />,
                    }
                ]
            }
        ]
    },
    //Note: In React Router, nesting of routes reflects embedded presentation, not api functionality. Since direct query pages are not embedded in any other component, this route must exist at the top level.
    {
        path: "/query/otu/:otuid",
        //path: "/otu/:otuid",
        element: <OTUDirectQueryResults/>
    },
    
]);

const theme = createTheme({
    palette: {
        primary: {
            main: "#bdbdbd"
        },
        secondary: {
            main: "#66bb6a"
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
      }
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
