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

//TODO: This is a dumb way to use react-router (sending every path to App and using all those state variables in there). This is just a transitional approach.
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/query",
        element: <App />,
        children: [
            {
                path: "OTU",
                element: <App />,
            }, 
            {
                path: "Specimen",
                element: <App />,
            },
            {
                path: "Reference",
                element: <App />,
            },
            {
                path: "Schema",
                element: <App />,
            },
            {
                path: "Person",
                element: <App />,
            },
        ],
    },
    {
        path: "/mutate",
        element: <App />,
        children: [
            {
                path: "OTU-mutate",
                element: <App />,
            }, 
            {
                path: "Synonym-mutate",
                element: <App />,
            }, 
            {
                path: "Comment-mutate",
                element: <App />,
            }, 
            {
                path: "Description-mutate",
                element: <App />,
            }, 
            {
                path: "CharacterInstance-mutate",
                element: <App />,
            }, 
            {
                path: "Specimen-mutate",
                element: <App />,
            },
            {
                path: "Collection-mutate",
                element: <App />,
            },
           {
                path: "Reference-mutate",
                element: <App />,
            },
            {
                path: "Schema-mutate",
                element: <App />,
            },
            {
                path: "Character-mutate",
                element: <App />,
            },
            {
                path: "State-mutate",
                element: <App />,
            },
            {
                path: "Group-mutate",
                element: <App />,
            },
            {
                path: "Person-mutate",
                element: <App />,
            },
            {
                path: "Image-mutate",
                element: <App />,
            },
        ],
    },
    {
        path: "/otu/:otuid",
        element: < OTUDirectQueryResults/>
    }
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
