// src/components/Home.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function Home() {
  return (
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
  );
}

export default Home;
