

import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Box } from '@mui/material';
import ForgotPassword from '../components/auth-components/ForgotPassword';


function ResetPassword() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar Section */}
      <Box sx={{ width: '100%' }}>
        <Navbar />
      </Box>

      {/* Reset Password Section */}
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 3 }}>
        <ForgotPassword />
      </Box>

      {/* Footer Section */}
      <Box sx={{ width: '100%' }}>
        <Footer />
      </Box>
    </Box>
  );
}

export default ResetPassword;
