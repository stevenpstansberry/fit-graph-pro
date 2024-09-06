/**
 * @fileoverview Page component for the Home section.
 * 
 * @file src/pages/Home.js
 * 
 * This page serves as the landing page of the application.
 * 
 * @component
 * @returns {React.Element} - The rendered Home page component.
 * 
 * @version 1.0.0
 * 
 * @author Steven Stansberry
 */

import React from 'react';
import Features from '../components/Features';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Container, Typography, Box, Grid } from '@mui/material';
import backgroundImage from '../assets/backgroundImage.jpg';

/**
 * Home page component that serves as the landing page for the Fit Graph Pro application.
 * Renders a Navbar, a hero section with the app's title and introduction, a list of features, 
 * a motivational quote, and a Footer.
 * 
 * @component
 * @returns {React.Element} - The rendered component for the home page.
 */
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
          paddingTop: '250px', 
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
