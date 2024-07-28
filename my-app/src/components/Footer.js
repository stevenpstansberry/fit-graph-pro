import React from 'react';
import { Box, Typography, Container } from '@mui/material';

function Footer() {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom>
          FitGraphPro
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Stay fit, stay healthy!
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
