/**
 * @fileoverview Footer component for the Fit Graph application.
 * 
 * @file src/components/Footer.js
 * 
 * Provides a simple footer for the application with a copyright notice.
 * The footer is styled to have a semi-transparent dark background and centered text.
 * 
 * @version 1.0.0
 * 
 * @author Steven Stansberry
 */

import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Footer component that displays a copyright notice.
 * 
 * This component is styled to have a dark background with centered white text.
 * It is intended to be used at the bottom of every page in the application.
 * 
 * @component
 * @returns {React.Element} - The rendered Footer component.
 */
function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: '#333', // Dark background color
        color: '#fff', // White text color
        opacity: 0.8,  // Semi-transparent
        padding: '10px', // Padding around the text
        textAlign: 'center', // Centered text
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} FitGraphPro. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
