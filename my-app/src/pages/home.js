//src/pages/Home.js
import React from 'react';
import Features from '../components/Features'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

import { Container, Typography, Box } from '@mui/material';

function Home() {
  return (
    <Container>
        <Navbar></Navbar>
        <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
              <Typography variant="h2" component="h1" gutterBottom>
              Welcome to FitGraphPro
              </Typography>
              <Typography variant="h5" component="p" gutterBottom>
              Your ultimate fitness tracking and graphing app!
              </Typography>
          </Box>
        </Container>
      <Features></Features>
      <Footer></Footer>
  
    </Container>
  );
}

export default Home;
