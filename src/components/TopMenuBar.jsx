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
import { GOLFING_MODE, PROFILE_MODE, HISTORY_MODE } from '../state/AppContext';

export default function TopMenuBar({ auth, mode, signOut, setMode }) {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [golfGame, setGolfGame] = React.useState(true);
    const [profile, setProfile] = React.useState(false);
    const [history, setHistory] = React.useState(false);
    const [lastMode, setLastMode] = React.useState(mode);
  
    const toggleGame = (event) => {
      setAnchorEl(event.currentTarget);
      if(!golfGame){
        setLastMode(mode);
        setMode(GOLFING_MODE);
      }
      else{
        setMode(lastMode);
      }
      setGolfGame(!golfGame);
      handleClose();
    };

    const toggleProfile = (event) => {
      setAnchorEl(event.currentTarget);
      if(!profile){
        setLastMode(mode);
        setMode(PROFILE_MODE);
      }
      else{
        setMode(lastMode);
      }
      setProfile(!profile);
      handleClose();
    };

    const toggleHistory = (event) => {
      setAnchorEl(event.currentTarget);
      if(!history){
        setLastMode(mode);
        setMode(HISTORY_MODE);
      }
      else{
        setMode(lastMode);
      }
      setHistory(!history);
      handleClose();
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
                <MenuItem onClick={toggleGame}>{"Show Golfgame"}</MenuItem>
                <MenuItem onClick={toggleProfile}>{"Profile"}</MenuItem>
                <MenuItem onClick={toggleHistory}>{"Scores History"}</MenuItem>
                <MenuItem onClick={signOut}>{"Sign Out"}</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    )
  }