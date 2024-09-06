/**
 * @fileoverview Page component for user registration.
 * 
 * @file src/pages/Register.js
 * 
 * This page provides the user interface for registering a new account.
 * It includes the Navbar, SignUp component for user registration, and a Footer.
 * The SignUp component handles the actual registration logic, while this page component provides the layout.
 * 
 * @component
 * @returns {React.Element} - The rendered Register page component.
 * 
 * @version 1.0.0
 * 
 * @author Steven Stansberry
 */

import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import SignUp from '../components/SignUp';
import { Box } from '@mui/material';

/**
 * Register page component that renders the registration form along with the navbar and footer.
 * 
 * @component
 * @returns {React.Element} - The rendered component for the register page.
 */
function Register() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar Section */}
      <Box sx={{ width: '100%' }}>
        <Navbar />
      </Box>

      {/* SignUp Form Section */}
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 3 }}>
        <SignUp />
      </Box>

      {/* Footer Section */}
      <Box sx={{ width: '100%' }}>
        <Footer />
      </Box>
    </Box>
  );
}
  
export default Register;
