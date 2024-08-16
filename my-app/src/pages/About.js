import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Container, Typography, Box } from '@mui/material';

function About() {
  return (
    <Container sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Navbar />

      <Box sx={{ flexGrow: 1, textAlign: 'center', mt: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          About Fit Graph Pro
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: '800px', margin: '0 auto', lineHeight: 1.7 }}>
          Fit Graph Pro is your go-to app for tracking your fitness progress in a visually appealing and efficient way.
          Whether you’re a beginner or an experienced athlete, Fit Graph Pro provides all the tools you need to monitor
          your workouts, set goals, and visualize your progression over time.
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: '800px', margin: '0 auto', lineHeight: 1.7 }}>
          With customizable workout splits, dynamic charts, and a user-friendly interface, you can seamlessly integrate
          Fit Graph Pro into your daily routine and stay motivated as you work towards your fitness goals. Track your
          strength, endurance, and overall performance, and see how far you’ve come in your fitness journey.
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '800px', margin: '0 auto', lineHeight: 1.7 }}>
          Join the Fit Graph Pro community and take your fitness tracking to the next level!
        </Typography>
      </Box>

      <Footer />
    </Container>
  );
}

export default About;
