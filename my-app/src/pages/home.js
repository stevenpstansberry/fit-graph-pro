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
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Navbar />
      <Box
        sx={{
          flex: 1,
          padding: 4,
          color: '#fff',
          paddingTop: '250px', // Controls padding between navbar and tiles/title
        }}
      >
        <Grid container spacing={2} sx={{ height: '100%' }}>
          {/* Left side with text */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontStyle: 'italic',
                color: '#ffdd57', 
                mb: 2,
                animation: 'slideInFromLeft 1s ease-out', 
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
                color: '#ffdd57', 
                mb: 4,
                animation: 'slideInFromLeft 1s ease-out', 
                animationDelay: '0.2s',
              }}
            >
              Your ultimate fitness tracking and graphing app!
            </Typography>
          </Grid>

          {/* Right side with features */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ width: '100%' }}>
              <Features />
            </Box>
          </Grid>
        </Grid>

        {/* New motivational text, placed centrally below the other content */}
        <Typography
          variant="h4"
          component="p"
          className="fadeInFromCenter" 
          sx={{
            marginTop: 6, 
            fontStyle: 'italic',
            color: 'orange', 
            textAlign: 'center',
          }}
        >
          "Fitness is not about being better than someone else. It’s about being better than you used to be."
        </Typography>
      </Box>
      <Footer />
    </Box>
  );
}

export default Home;
