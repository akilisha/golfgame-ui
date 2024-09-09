import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import { GOLFING_MODE, PROFILE_MODE, QR_CODE_MODE } from '../state/AppContext';

export default function TopMenuBar({ auth, mode, signOut, setMode }) {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [profile, setProfile] = React.useState(false);
    const [demo, setDemo] = React.useState(false);
    const [lastMode, setLastMode] = React.useState(mode);
  
    const toggleProfile = (event) => {
      setAnchorEl(event.currentTarget);
      setMode(profile ? GOLFING_MODE : PROFILE_MODE)
      setProfile(!profile);
    };

    const toggleQrCode = () => {
        setAnchorEl(event.currentTarget);
        if(!demo){
          setLastMode(mode);
          setMode(QR_CODE_MODE);
        }
        else{
          setMode(lastMode);
        }
        setDemo(!demo);
    }
  
    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    }
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <AppBar position="static" >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Golfgame <GolfCourseIcon sx={{ position: "absolute", top: "20px", ml: 1 }} />
          </Typography>
          {auth && (
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
                <MenuItem onClick={toggleProfile}>{profile ? "Golfgame" : "Profile"}</MenuItem>
                <MenuItem onClick={toggleQrCode}>{demo? 'Hide QR Code' : 'Show QR Code'}</MenuItem>
                <MenuItem onClick={signOut}>Sign Out</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    )
  }