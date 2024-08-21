import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Box } from '@mui/material';
import SignIn from '../components/SignIn';

function Login() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ width: '100%' }}>
        <Navbar />
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 3 }}>
        <SignIn />
      </Box>

      <Box sx={{ width: '100%' }}>
        <Footer />
      </Box>
    </Box>
  );
}

export default Login;
