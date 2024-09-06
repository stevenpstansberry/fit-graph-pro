/**
 * @fileoverview Component for requesting a password reset.
 * 
 * @file src/components/ForgotPassword.js
 * 
 * Provides a user interface for users to request a password reset link by entering their email address.
 * 
 * @component
 * @returns {React.Element} - The rendered ForgotPassword component.
 * 
 * @version 1.0.0
 * 
 * @author Steven Stansberry
 */

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Snackbar, Alert } from '@mui/material';
import { requestPasswordReset } from '../services/APIServices';  // Import the password reset function

/**
 * ForgotPassword component for requesting a password reset link.
 * 
 * @component
 * @returns {React.Element} - The rendered ForgotPassword component.
 */
function ForgotPassword() {
  const [email, setEmail] = useState(''); // State to manage the email input
  const [message, setMessage] = useState(null); // State to handle messages (success/error)
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State to manage Snackbar visibility

  /**
   * Handles the form submission for requesting a password reset.
   * 
   * @function handleSubmit
   * @param {Object} event - The form submission event object.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (email.trim() === '') {
      setMessage({ type: 'error', text: 'Email is required.' });
      setSnackbarOpen(true);
      return;
    }

    try {
      await requestPasswordReset({ email });  // Call the requestPasswordReset function
      setMessage({ type: 'success', text: 'Password reset link sent! Please check your email.' });
      setSnackbarOpen(true);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send password reset link. Please try again.' });
      setSnackbarOpen(true);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 6,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Reset Link
          </Button>
        </Box>
      </Box>
      {/* Snackbar Alert for Success or Error Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={message?.type} sx={{ width: '100%' }}>
          {message?.text}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ForgotPassword;
