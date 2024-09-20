/**
 * @fileoverview Component for user registration functionality.
 * 
 * @file src/components/auth-components/SignUp.js
 * 
 * Provides a user interface for registering a new user account. 
 * Allows users to input their name, username, email, and password to create a new account. 
 * Handles registration by communicating with the backend API and setting up a new user session upon successful registration.
 * 
 * @component
 * @returns {React.Element} - The rendered SignUp component.
 * 
 * @version 1.0.0
 * @author Steven Stansberry
 */

import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Grid, Button, Snackbar, Alert, Link } from '@mui/material';
import { setUserSession } from "../../services/AuthService";
import { useNavigate } from 'react-router-dom';
import { registerUser } from "../../services/FitGraphAPIServices"; 

/**
 * 
 * Renders the sign-up form for new users to register. The form collects user details like first name,
 * username, email, and password, and communicates with the backend API to create a new account. It includes
 * validation for empty fields, spaces, and password matching.
 * 
 * @component
 * @returns {React.Element} - The rendered SignUp component.
 */
function SignUp() {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' }); // State to handle Snackbar
  const navigate = useNavigate(); 

  /**
   * Handles the form submission for registering a new user.
   * 
   * @function handleSubmit
   * @param {Object} event - The form submission event object.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = data.get("first-name");
    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password");
    const confirmPassword = data.get("confirm-password");

    // Check if all fields are filled
    if (!firstName.trim() || !username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      showSnackbar('All fields must be filled', 'warning');
      return;
    }

    // Check for valid email format
    if (!isValidEmail(email)) {
      showSnackbar('Please enter a valid email address', 'warning');
      return;
    }

    // Check for spaces in fields
    if (hasSpaces(firstName) || hasSpaces(username) || hasSpaces(email) || hasSpaces(password)) {
      showSnackbar('No spaces allowed', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showSnackbar('Passwords do not match', 'warning');
      return;
    }

    const requestBody = {
      username,
      email,
      name: firstName,
      password
    };

    try {
      const response = await registerUser(requestBody);  // Use the registerUser function
      console.log('Registration response:', response); // Debugging line to check API response

      // Ensure the response contains both user and token
      if (response.user && response.token) {
        setUserSession(response.user, response.token); // Set the user session
        showSnackbar('Registration successful!', 'success'); // Show success message
        navigate('/workouts'); // Redirect to workouts page
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration error:', error.response.status); // Log the error
      
      let errorMSG;

      switch(error.response.status) {
        case 401:
          errorMSG = 'Username already exists, please select a different username';
          break;

        case 503:
          errorMSG = 'Server is offline, please try again later.';
          break;

        default:
          errorMSG = 'Unknown error occurred, please try again later.';
          break;
      }

      showSnackbar(`Registration failed. ${errorMSG}`, 'error'); // Show error message on registration failure
    }
  };

  /**
   * Checks if a string contains spaces.
   * 
   * @function hasSpaces
   * @param {string} value - The input value to check for spaces.
   * @returns {boolean} - True if spaces are found, otherwise false.
   */
  const hasSpaces = (value) => {
    return /\s/.test(value);
  };

  /**
   * Validates if the provided email has a proper format.
   * 
   * @function isValidEmail
   * @param {string} email - The email address to validate.
   * @returns {boolean} - True if the email is valid, otherwise false.
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="first-name"
            label="First Name"
            name="first-name"
            autoComplete="given-name"
            autoFocus
            onInput={(e) => {
              if (hasSpaces(e.target.value)) {
                e.target.value = e.target.value.replace(/\s/g, ''); // Remove spaces immediately
                showSnackbar('No spaces allowed', 'warning');
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            onInput={(e) => {
              if (hasSpaces(e.target.value)) {
                e.target.value = e.target.value.replace(/\s/g, ''); // Remove spaces immediately
                showSnackbar('No spaces allowed', 'warning');
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onInput={(e) => {
              if (hasSpaces(e.target.value)) {
                e.target.value = e.target.value.replace(/\s/g, ''); // Remove spaces immediately
                showSnackbar('No spaces allowed', 'warning');
              }
            }}
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
            onInput={(e) => {
              if (hasSpaces(e.target.value)) {
                e.target.value = e.target.value.replace(/\s/g, ''); // Remove spaces immediately
                showSnackbar('No spaces allowed', 'warning');
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirm-password"
            label="Confirm Password"
            type="password"
            id="confirm-password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/login" variant="body2">
                {"Already have an account? Login"}
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

export default SignUp;
