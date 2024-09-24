/**
 * @fileoverview Page component for resetting a user's password if they have forgotten it.
 *
 * @file src/pages/ResetPasswordFromEmail.js
 *
 * This page is uniquely generated via a link sent to the user's email address when they request a password reset.
 * The user must provide a new password and confirm it to complete the password reset process.
 *
 *
 * @component
 * @returns {React.Element} - The rendered ResetPassword page component.
 *
 * @version 1.0.0
 *
 * @author Steven Stansberry
 */
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { requestPasswordReset } from "../services/FitGraphAPIServices";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import fitGraphLogo from "../assets/fit-graph-logo.png";

function ResetPasswordFromEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Get the token from the URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const token = queryParams.get("token");

  // Function to handle the password reset form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setSnackbarMessage("Passwords do not match!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      // Make an API call to your backend to reset the password
      await requestPasswordReset(
        { email: email, token: token, newPassword: password },
        "ResetPassword"
      );

      setSnackbarMessage(
        "Password reset successful. Redirecting to login page..."
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate("/login"); // Redirect to login page after successful password reset
      }, 2000);
    } catch (error) {
      let errorMSG;

      console.log("error status: ", error.response.status);

      switch (error.response.status) {
        case 404:
          errorMSG =
            "User not found. Please request a new password reset link.";
          break;

        case 405:
          errorMSG = "Invalid token. Please request a new password reset link.";
          break;

        default:
          errorMSG = "Failed to reset password. Please try again.";
          break;
      }

      console.error("Error resetting password:", error);
      setSnackbarMessage(errorMSG);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar Section */}
      <Box sx={{ width: "100%" }}>
        <Navbar />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 3,
        }}
      >
        {/* Logo Section */}
        <img
          src={fitGraphLogo}
          alt="Fit Graph Logo"
          style={{ width: "200px", height: "auto" }}
        />

        <Typography variant="h5" gutterBottom>
          Reset Your Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Reset Password
          </Button>
        </form>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
      {/* Footer Section */}
      <Box sx={{ width: "100%" }}>
        <Footer />
      </Box>
    </Box>
  );
}

export default ResetPasswordFromEmail;
