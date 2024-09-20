/**
 * @fileoverview Component for displaying the user's account information and providing account-related actions.
 * 
 * @file src/pages/AccountPage.js
 * 
 * This component is responsible for rendering the user's account information, such as their username and email,
 * and providing actions such as resetting their password. It integrates with `PasswordResetDialog` to allow users
 * to reset their passwords securely. The component uses Material-UI components for layout and styling.
 * 
 * @component
 * @returns {React.Element} The rendered AccountPage component.
 * 
 * @version 1.0.0
 * @author Steven Stansberry
 */

import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConfirmPassword from '../components/auth-components/ConfirmPassword';
import { getUser } from '../services/AuthService';

function Account() {
  const user = getUser();
  const [confirmPasswordOpen, setConfirmPasswordOpen] = useState(false);
  const [mode, setMode] = useState('ResetPassword');

  /**
   * Opens the password reset dialog.
   * @function handleOpenResetPassword
   */
  const handleOpenResetPassword = () => {
    setMode('ResetPassword');
    setConfirmPasswordOpen(true);
  };

  /**
   * Opens the delete account dialog.
   * @function handleOpenDeleteAccount
   */
  const handleOpenDeleteAccount = () => {
    setMode('DeleteUser');
    setConfirmPasswordOpen(true);
  };

  /**
   * Closes the confirmation dialog.
   * @function handleCloseConfirmPassword
   */
  const handleCloseConfirmPassword = () => {
    setConfirmPasswordOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar Section */}
      <Navbar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 4, display: 'flex', justifyContent: 'left' }}>
        <Paper sx={{ p: 4, width: '600px' }}>
          {/* Account Information Section */}
          <Typography variant="h5" gutterBottom>
            Account Information
          </Typography>
          <Typography variant="body1">
            Username: {user.username}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Email: {user.email}
          </Typography>

          <Box sx={{ borderBottom: '1px solid #ccc', my: 2 }} /> {/* Divider */}

          {/* Account Actions Section */}
          <Typography variant="h5" gutterBottom>
            Account Actions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, alignItems: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenResetPassword}
              sx={{ mb: 2, width: '200px' }}
            >
              Reset Password
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleOpenDeleteAccount}
              sx={{ width: '200px' }}
            >
              Delete Account
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* ConfirmPassword Dialog */}
      <ConfirmPassword open={confirmPasswordOpen} onClose={handleCloseConfirmPassword} user={user} mode={mode} />

      {/* Footer Section */}
      <Footer />
    </Box>
  );
}

export default Account;
