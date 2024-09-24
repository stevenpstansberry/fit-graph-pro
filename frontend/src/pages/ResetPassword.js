/**
 * @fileoverview Page component for resetting a user's password.
 *
 * @file src/pages/ResetPassword.js
 *
 * This page provides the user interface for resetting a within the account settings.
 * The ForgotPassword component handles the actual password reset logic, while this page component provides the layout and structure.
 *
 * @component
 * @returns {React.Element} - The rendered ResetPassword page component.
 *
 * @version 1.0.0
 *
 * @author Steven Stansberry
 */

import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Box } from "@mui/material";
import ForgotPassword from "../components/auth-components/ForgotPassword";

function ResetPassword() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar Section */}
      <Box sx={{ width: "100%" }}>
        <Navbar />
      </Box>

      {/* Reset Password Section */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 3,
        }}
      >
        <ForgotPassword />
      </Box>

      {/* Footer Section */}
      <Box sx={{ width: "100%" }}>
        <Footer />
      </Box>
    </Box>
  );
}

export default ResetPassword;
