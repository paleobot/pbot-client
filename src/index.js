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

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { 
                index: true, 
                element: <PBOTInterface formClass="query" /> 
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
                path: "query",
                element: <PBOTInterface formClass="query" />,
                children: [
                    { 
                        index: true, 
                        element: <Action /> 
                    },
                    {
                        path: "otu",
                        element: <Action  selectedForm="OTU"/>,
                    },
                    {
                        path: "specimen",
                        element: <Action  selectedForm="Specimen" />,
                    },
                    {
                        path: "reference",
                        element: <Action selectedForm="Reference" />,
                    },
                    {
                        path: "schema",
                        element: <Action selectedForm="Schema" />,
                    },
                    {
                        path: "person",
                        element: <Action selectedForm="Person" />,
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
                        element: <Action selectedForm="OTU-mutate" />,
                    }, 
                    {
                        path: "synonym",
                        element: <Action selectedForm="Synonym-mutate" />,
                    }, 
                    {
                        path: "comment",
                        element: <Action selectedForm="Comment-mutate" />,
                    }, 
                    {
                        path: "description",
                        element: <Action selectedForm="Description-mutate" />,
                    }, 
                    {
                        path: "characterinstance",
                        element: <Action selectedForm="CharacterInstance-mutate" />,
                    }, 
                    {
                        path: "specimen",
                        element: <Action selectedForm="Specimen-mutate" />,
                    },
                    {
                        path: "collection",
                        element: <Action selectedForm="Collection-mutate" />,
                    },
                    {
                        path: "reference",
                        element: <Action selectedForm="Reference-mutate" />,
                    },
                    {
                        path: "schema",
                        element: <Action selectedForm="Schema-mutate" />,
                    },
                    {
                        path: "character",
                        element: <Action selectedForm="Character-mutate" />,
                    },
                    {
                        path: "state",
                        element: <Action selectedForm="State-mutate" />,
                    },
                    {
                        path: "group",
                        element: <Action selectedForm="Group-mutate" />,
                    },
                    {
                        path: "person",
                        element: <Action selectedForm="Person-mutate" />,
                    },
                    {
                        path: "image",
                        element: <Action selectedForm="Image-mutate" />,
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
