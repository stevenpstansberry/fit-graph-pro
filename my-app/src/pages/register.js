// src/pages/Register.js

import React from 'react';
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import SignUp from '../components/SignUp';

import { Container, Typography, Box , FormControl, InputLabel, Input, FormHelperText} from '@mui/material';


function Register() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ width: '100%' }}>
        <Navbar />
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 3 }}>
        <SignUp />
      </Box>

      <Box sx={{ width: '100%' }}>
        <Footer />
      </Box>
    </Box>
  );
}
  
  export default Register;