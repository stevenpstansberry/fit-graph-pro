/**
 * @fileoverview Page component for user login.
 * 
 * @file src/pages/Login.js
 * 
 * This page provides the user interface for logging into the application.
 * It includes the Navbar, SignIn component for user authentication, and a Footer.
 * The SignIn component handles the actual login logic, while this page component provides the layout.
 * 
 * @component
 * @returns {React.Element} - The rendered Login page component.
 * 
 * @version 1.0.0
 * @author Steven Stansberry
 */

import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Box } from '@mui/material';
import SignIn from '../components/auth-components/SignIn';
import fitGraphLogo from '../assets/fit-graph-logo.png';

/**
 * Login page component that renders the login form along with the navbar and footer.
 * 
 * @component
 * @returns {React.Element} - The rendered component for the login page.
 */
function Login() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar Section */}
      <Box sx={{ width: '100%' }}>
        <Navbar />
      </Box>

      {/* SignIn Form Section with Logo */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: 3,
        }}
      >
        {/* Logo Section */}
        <img src={fitGraphLogo} alt="Fit Graph Logo" style={{ width: '200px', height: 'auto' }} />

        {/* SignIn Component */}
        <SignIn />
      </Box>

      {/* Footer Section */}
      <Box sx={{ width: '100%' }}>
        <Footer />
      </Box>
    </Box>
  );
}

export default Login;
