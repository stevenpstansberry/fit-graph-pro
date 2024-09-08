/**
 * @fileoverview Component for user sign-in functionality.
 * 
 * @file src/components/auth-components/SignIn.js
 * 
 * Provides a user interface for logging into the application. Allows users to input their username and password, and handles authentication with the backend API.
 * Upon successful login, the user session is set, and the user is redirected to their profile page.
 * 
 * @component
 * @returns {React.Element} - The rendered SignIn component.
 * 
 * @version 1.0.0
 * @author Steven Stansberry
 */

import { Alert, Button, TextField, Link, Grid, Box, Typography, Container, Snackbar } from "@mui/material";
import React, { useState } from 'react';
import { setUserSession } from "../../services/AuthService";
import { useNavigate } from 'react-router-dom';
import { loginUser } from "../../services/APIServices";  // Import the loginUser function from APIServices

function SignIn() {
  const navigate = useNavigate(); // React Router hook for navigation
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' }); // State to handle Snackbar

  /**
   * Handles the form submission for signing in the user.
   * 
   * @function handleSubmit
   * @param {Object} event - The form submission event object.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const username = data.get('username');
    const password = data.get('password');

    if (username.trim() === '' || password.trim() === '') {
      showSnackbar('Fields must be filled', 'warning');
      return;
    }

    const credentials = {
      username: username,
      password: password
    };

    try {
      const response = await loginUser(credentials);  // Use the loginUser function
      setUserSession(response.user, response.token); // Set the user session
      showSnackbar('Login successful!', 'success');  // Show success message
      navigate('/profile'); // Redirect to profile page
    } catch (error) {
      showSnackbar('Login failed. Please check your credentials.', 'error');  // Show error message on login failure
    }
  };

  /**
   * Displays a Snackbar message.
   * 
   * @function showSnackbar
   * @param {string} message - The message to display.
   * @param {string} severity - The severity level of the message ('success', 'error', 'warning', 'info').
   */
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  /**
   * Closes the Snackbar message.
   * 
   * @function handleCloseSnackbar
   */
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Snackbar for showing messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}  // Automatically close after 3 seconds
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default SignIn;
