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
            Human clipart PNG designed by 
            <Link
              href="https://pngtree.com/hublot90_6148860?type=1"
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ ml: 0.5 }}
            >
              <strong>hublot90</strong> 
            </Link> 
            from 
            <Link 
              href="https://pngtree.com/freepng/physical-fitness-sport-gym-logo-bodybuilder-with-big-muscles-posing-isolated-vector-silhouette-front-view_5172932.html?sol=downref&id=bef" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ ml: 0.5 }}
            >
              PNGTree
            </Link>.
          </Typography>

          <Typography variant="body1" color="textSecondary">
            Home Background sourced from 
            <Link
              href="https://www.kccompletefighter.com/weight-gain/"
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ ml: 0.5 }}
            >
              <strong>KC Complete Fitness</strong> 
            </Link>.
          </Typography>

          <Typography variant="body1" color="textSecondary">
            About page photo by 
            <Link
              href="https://www.pexels.com/photo/woman-holding-exercise-equipment-416809/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ ml: 0.5 }}
            >
              <strong>Pixabay</strong>
            </Link> 
            from 
            <Link
              href="https://www.pexels.com/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ ml: 0.5 }}
            >
              Pexels
            </Link>.
          </Typography>
        </Box>

        {/* Library Attribution Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Library Credits
          </Typography>
          <Typography variant="body1" color="textSecondary">
            This application utilizes the 
            <Link
              href="https://github.com/giavinh79/react-body-highlighter"
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ ml: 0.5 }}
            >
              react-body-highlighter
            </Link> 
            library, created by 
            <Link
              href="https://github.com/giavinh79"
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ ml: 0.5 }}
            >
              <strong>Giavinh</strong>
            </Link>. This library is licensed under the MIT License and provides functionality to highlight muscle groups on body diagrams.
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
