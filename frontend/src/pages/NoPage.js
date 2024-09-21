/**
 * @fileoverview Component for displaying a "404 - Page Not Found" message.
 *
 * @file src/pages/NoPage.js
 *
 * This component is used to display a message indicating that the requested page does not exist.
 *
 * @component
 * @returns {React.Element} - The rendered NoPage component with a "404 - Page Not Found" message.
 *
 * @version 1.0.0
 *
 * @author Steven Stansberry
 */

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

/**
 * NoPage component to display a "404 - Page Not Found" message along with a navbar and footer.
 *
 * This component is displayed when a user tries to access a non-existent route.
 * It provides a message to inform the user that the page they are looking for does not exist,
 * and includes a button to navigate back to the homepage.
 *
 * @component
 * @returns {React.Element} - The rendered NoPage component.
 */
function NoPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Content: 404 Message */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h1" sx={{ mb: 2 }}>
          404 - Page Not Found
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          The page you are looking for doesn't exist or has been moved.
        </Typography>

        {/* Button to navigate back to the homepage */}
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          sx={{
            padding: "10px 20px",
            textTransform: "uppercase",
            fontSize: "1rem",
          }}
        >
          Go Back to Home
        </Button>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default NoPage;
