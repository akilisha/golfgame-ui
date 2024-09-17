import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import TopMenuBar from './TopMenuBar';
import { AppContext, } from '../state/AppContext';
import { Outlet } from "react-router-dom";

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

export default function Layout() {

  const { supabase, session } = React.useContext(AppContext);

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
        <TopMenuBar auth={session?.user} signOut={() => supabase.auth.signOut()}/>
        <Container component="main" sx={{ mb: 2, bottom: '10px' }} maxWidth="md">
          <Outlet />
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
              Golfing Companion
            </Typography>
            <Copyright />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}