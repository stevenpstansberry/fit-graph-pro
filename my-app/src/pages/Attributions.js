/**
 * @fileoverview Attributions page for the application.
 *
 * @file src/pages/Attributions.js
 *
 * This component provides attributions for the images, icons, and other assets used
 * throughout the application. Proper attribution is provided in accordance with the
 * licensing terms of the respective content providers.
 *
 * @version 1.0.0
 * @author Steven Stansberry
 */

import React from 'react';
import { Container, Typography, Box, Link } from '@mui/material';
import Navbar from '../components/Navbar';  
import Footer from '../components/Footer';  

/**
 * Component to display attributions for assets used in the application.
 *
 * @component
 * @returns {React.Element} - The rendered Attributions page component.
 */
const Attributions = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar Component */}
      <Navbar />

      {/* Main Content */}
      <Container maxWidth="md" sx={{ flexGrow: 1, my: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Attributions
          </Typography>
          <Typography variant="body1" color="textSecondary">
            We would like to express our sincere gratitude to the creators who have made their work available for use. Your contributions have greatly enhanced the quality of our application.
          </Typography>
        </Box>

        {/* Attribution Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Image Credits
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Human clipart PNG designed by <strong>hublot90</strong> from 
            <Link 
              href="https://pngtree.com/freepng/physical-fitness-sport-gym-logo-bodybuilder-with-big-muscles-posing-isolated-vector-silhouette-front-view_5172932.html?sol=downref&id=bef" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ ml: 0.5 }}
            >
              PNGTree
            </Link>.
          </Typography>
        </Box>

        {/* Thank You Section */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            Thank You!
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Thank you for your support and to all the creators who have contributed their works for use in our application.
          </Typography>
        </Box>
      </Container>

      {/* Footer Component */}
      <Footer />
    </Box>
  );
};

export default Attributions;
