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
        element: <App formClass="query" />,
    },
    {
        path: "/query/otu",
        element: <App formClass="query" form="OTU" />,
    }, 
    {
        path: "/query/specimen",
        element: <App  formClass="query" form="Specimen" />,
    },
    {
        path: "/query/reference",
        element: <App  formClass="query" form="Reference" />,
    },
    {
        path: "/query/schema",
        element: <App  formClass="query" form="Schema" />,
    },
    {
        path: "/query/person",
        element: <App  formClass="query" form="Person" />,
    },
    {
        path: "/mutate",
        element: <App formClass="mutate" />,
    },
    {
        path: "/mutate/otu",
        element: <App formClass="mutate" form="OTU-mutate" />,
    }, 
    {
        path: "/mutate/synonym",
        element: <App formClass="mutate" form="Synonym-mutate" />,
    }, 
    {
        path: "/mutate/comment",
        element: <App formClass="mutate" form="Comment-mutate" />,
    }, 
    {
        path: "/mutate/description",
        element: <App formClass="mutate" form="Description-mutate" />,
    }, 
    {
        path: "/mutate/characterinstance",
        element: <App formClass="mutate" form="CharacterInstance-mutate" />,
    }, 
    {
        path: "/mutate/specimen",
        element: <App formClass="mutate" form="Specimen-mutate" />,
    },
    {
        path: "/mutate/collection",
        element: <App formClass="mutate" form="Collection-mutate" />,
    },
    {
        path: "/mutate/reference",
        element: <App formClass="mutate" form="Reference-mutate" />,
    },
    {
        path: "/mutate/schema",
        element: <App formClass="mutate" form="Schema-mutate" />,
    },
    {
        path: "/mutate/character",
        element: <App formClass="mutate" form="Character-mutate" />,
    },
    {
        path: "/mutate/state",
        element: <App formClass="mutate" form="State-mutate" />,
    },
    {
        path: "/mutate/group",
        element: <App formClass="mutate" form="Group-mutate" />,
    },
    {
        path: "/mutate/person",
        element: <App formClass="mutate" form="Person-mutate" />,
    },
    {
        path: "/mutate/image",
        element: <App formClass="mutate" form="Image-mutate" />,
    },
    {
        //path: "/query/otu/:otuid",
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
