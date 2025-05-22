import AccountCircle from '@mui/icons-material/AccountCircle';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import MenuIcon from '@mui/icons-material/Menu';
import { Button, Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';

export default function NavBar() {

    const [rotatePBOT, setRotatePBOT] = React.useState(true);
    const navigate = useNavigate();

    const {token, setToken} = useAuth();
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
        localStorage.removeItem('AzlibAdminToken');
        setToken(localStorage.getItem('AzlibAdminToken'));
        //localStorage.removeItem('PBOTMe');
        navigate("/");
    }
   
  
    //const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const drawerWidth = 240;
    //const container = window !== undefined ? () => window().document.body : undefined;
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const secondaryNavTitles = ['About', 'How to use'];
    const secondaryNavDests = ["about", "howto"]
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
                        <ListItemText primary="Explore" />
                    </ListItemButton>
                </ListItem>                <ListItem key="Workbench" disablePadding>
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

    let location = useLocation().pathname.split('/')[1];
    location = location === "query" ? "Explore" :
        location === "mutate" ? "Workbench" :
        "";

        
    return (
        <>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color={"Workbench" === location ? "secondary":"primary"} sx={{marginBottom: "20px"}}>
                <Stack direction="column">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={handleDrawerToggle}
                    >
                        <MenuIcon fontSize='large'/>
                    </IconButton>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                       Azlibrary Admin
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
                                <AccountCircle fontSize='large' color='primary'/>
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
                {"" === location &&
                <></>
                }
                </Stack>
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