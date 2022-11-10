import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Link, useNavigate } from "react-router-dom";
import logo from '../PBOT-logo-transparent.png';
import { Button } from '@mui/material';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Drawer from '@mui/material/Drawer';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { useAuth } from './AuthContext';

const PBOTIcon = ({rotatePBOT}) => {
    const rotate = rotatePBOT ? "rotateY(180deg)" : "rotateY(0)";
    return (
             <img src={logo} style={{ transform: rotate, transition: "all 0.2s linear", height: "50px" }}  />
      )
}

export default function NavBar() {

    const [rotatePBOT, setRotatePBOT] = React.useState(true);
    const navigate = useNavigate();

    //const [auth, setAuth] = React.useState(true);
    const [token, setToken] = useAuth();
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    /*
    const handleChange = (event) => {
      setAuth(event.target.checked);
    };
    */

    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('PBOTMutationToken');
        setToken(localStorage.getItem('PBOTMutationToken'));
        localStorage.removeItem('PBOTMe');
        navigate("/");
    }
   
  
    //const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const drawerWidth = 240;
    //const container = window !== undefined ? () => window().document.body : undefined;
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const secondaryNavTitles = ['About', 'How to use PBot', 'Resources', 'Go to Education & Outreach Hub'];
    const secondaryNavDests = ["about", "howto", "resources", "education"]
    const drawer = (
        <div>
          <Toolbar />
          <Divider />
          <List>
                <ListItem key="Query" disablePadding>
                    <ListItemButton onClick={() => {handleDrawerToggle(); navigate(`/query`);}}>
                        <ListItemIcon>
                            <ManageSearchIcon/>
                        </ListItemIcon>
                    <ListItemText primary="Query" />
                </ListItemButton>
              </ListItem>
              <ListItem key="Workbench" disablePadding>
                    <ListItemButton onClick={() => {handleDrawerToggle(); navigate(`/mutate`);}}>
                        <ListItemIcon>
                            <EngineeringIcon/>
                        </ListItemIcon>
                    <ListItemText primary="Workbench" />
                </ListItemButton>
              </ListItem>
          </List>
          <Divider />
          <List>
            {secondaryNavTitles.map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => {handleDrawerToggle(); navigate(secondaryNavDests[index]);}}>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
      );
        
    return (
        <>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{marginBottom: "20px"}}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={handleDrawerToggle}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Link to="/">
                            <PBOTIcon rotatePBOT={rotatePBOT} />
                        </Link>
                        PBot
                    </Typography>
                    {!token && (
                        <Button variant="contained" color="secondary" onClick={() => {navigate(`/login`);}}>
                            Login
                        </Button>
                    )}
                    {token && (
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                >
                                <MenuItem onClick={() => {handleClose(); navigate(`/profile`);}}>Profile</MenuItem>
                                <MenuItem onClick={() => {handleClose(); navigate(`/account`);}}>My account</MenuItem>
                                <MenuItem onClick={() => {handleClose(); handleLogout(); /*navigate(`/logout`);*/}}>Logout</MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
        <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
        >
            {drawer}
        </Drawer>
        </>

    );
}