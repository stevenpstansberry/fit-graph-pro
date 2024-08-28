// src/components/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: '#333',
        color: '#fff',
        opacity: 0.8, 
        padding: '10px',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} FitGraphPro. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
