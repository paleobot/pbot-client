//import logo from './logo.svg';
import logo from './PBOT-logo-transparent.png';
import './App.css';
import Query from './components/Query';
import ApolloQuery from './components/ApolloQuery';
import OTUQueryForm from './components/OTUQueryForm';
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
function App() {
  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
       <OTUQueryForm />
       <br />
       <br />
   </div>
   </ThemeProvider>
  );
}

export default App;
