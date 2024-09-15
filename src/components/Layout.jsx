import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import { AppContext, GOLFING_MODE, PROFILE_MODE } from '../state/AppContext';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        joyinscrum
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function TopMenuBar({ auth, signOut, setMode }) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [profile, setProfile] = React.useState(false);

  const toggleProfile = (event) => {
    setAnchorEl(event.currentTarget);
    setMode(profile ? GOLFING_MODE : PROFILE_MODE)
    setProfile(!profile);
  };

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
          18 Hole Game <GolfCourseIcon sx={{ position: "absolute", top: "20px", ml: 1 }} />
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
              <MenuItem onClick={signOut}>Sign Out</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default function Layout({ children }) {

  const { supabase, session, setMode } = React.useContext(AppContext);

  const greenTheme = createTheme({
    palette: {
      primary: {
        light: '#a2cf6e',
        main: '#8bc34a',
        dark: '#618833',
        contrastText: '#000',
      },
      secondary: {
        light: '#f73378',
        main: '#f50057',
        dark: '#ab003c',
        contrastText: '#000',
      },
    },
  });

  return (
    <ThemeProvider theme={greenTheme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: "100vw"
        }}
      >
        <CssBaseline />
        <TopMenuBar auth={session?.user} signOut={() => supabase.auth.signOut()} setMode={setMode} />
        <Container component="main" sx={{ mb: 2 }} maxWidth="md">
          {children}
        </Container>
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.primary.main
                : theme.palette.secondary.main,
          }}
        >
          <Container maxWidth="sm">
            <Typography variant="body1">
              Golf Game Companion
            </Typography>
            <Copyright />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}