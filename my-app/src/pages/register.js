import React from 'react';
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

import { Container, Typography, Box } from '@mui/material';


function Register() {
    return (
      <Container>
          <Navbar></Navbar>
          <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to Register
              </Typography>
              <Typography variant="h5" component="p" gutterBottom>
              Your ultimate fitness tracking and graphing app!
              </Typography>
            </Box>
          </Container>
        <Footer></Footer>
    
      </Container>
    );
  }
  
  export default Register;