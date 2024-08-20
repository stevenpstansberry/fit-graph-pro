// src/pages/Home.js
import React from 'react';
import Features from '../components/Features';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Container, Typography, Box, Grid } from '@mui/material';
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
          padding: 4,
          color: '#fff',
        }}
      >
        <Grid container sx={{ height: '100%', paddingTop: 20 }} alignItems="center">
          {/* Left Section with Text */}
          <Grid 
            item xs={12} md={6} 
            sx={{ 
              textAlign: 'left', 
              padding: 4, 
              animation: 'slideIn 1s ease-out' // Applying the slide-in animation
            }}
          >
            <Box>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontStyle: 'italic',
                  color: '#ffcc00', // Updated to a vibrant yellow color that contrasts more against the background
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
                  color: '#ffcc00', // Matching color for the subtext
                }}
              >
                Your ultimate fitness tracking and graphing app!
              </Typography>
            </Box>
          </Grid>
          
          {/* Right Section with Features Tiles */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Features />
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
}



export default Home;
