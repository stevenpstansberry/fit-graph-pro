import React from 'react';
import Features from '../components/Features';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Container, Typography, Box } from '@mui/material';
import backgroundImage from '../assets/backgroundImage.jpg';

function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      <Box
        sx={{
          flex: 1, 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          textAlign: 'center',
          padding: 4,
          color: '#fff',
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontStyle: 'italic',
            color: '#3a3a3a', // Dark gray
          }}
        >
          FitGraphPro
        </Typography>
        <Typography 
          variant="h5" 
          component="p" 
          gutterBottom
          sx={{ 
            fontStyle: 'italic',
            color: '#3a3a3a', // Dark gray
          }}
        >
          Your ultimate fitness tracking and graphing app!
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Features />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default Home;
