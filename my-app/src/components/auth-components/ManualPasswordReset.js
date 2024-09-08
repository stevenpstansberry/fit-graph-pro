/**
 * @fileoverview Component for resetting the user's password through a dialog interface.
 * 
 * @file src/components/auth-components/ManualPasswordReset.js
 * 
 * This component provides a dialog (modal) interface for users to reset their password. The process is divided into
 * two steps: confirming the current password by entering it twice, and then entering a new password. Validation is 
 * performed on the client side to ensure that the passwords match and meet the required criteria.
 * 
 * @component
 * @param {Object} props - The props for the PasswordResetDialog component.
 * @param {boolean} props.open - Determines whether the dialog is open.
 * @param {Function} props.onClose - Function to close the dialog.
 * @returns {React.Element} The rendered PasswordResetDialog component.
 * 
 * @version 1.0.0
 * @author Steven Stansberry
 */
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, Alert, Snackbar } from '@mui/material';
import { verifyPassword, UserPasswordReset } from '../../services/APIServices';

function ManualPasswordReset({ open, onClose, user }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState('info'); // 'info', 'error', 'success'
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar visibility

  /**
   * Handles changes to the current password input field.
   * @function handleCurrentPasswordChange
   * @param {Object} e - The event object from the input field.
   */
  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  /**
   * Handles changes to the confirm password input field.
   * @function handleConfirmPasswordChange
   * @param {Object} e - The event object from the input field.
   */
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  /**
   * Handles changes to the new password input field.
   * @function handleNewPasswordChange
   * @param {Object} e - The event object from the input field.
   */
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  /**
   * Handles verification of the current password by calling the verifyPassword API.
   */
  const verifyCurrentPassword = async () => {
    try {
      const response = await verifyPassword({
        email: user.email,
        username: user.username,
        password: currentPassword,
      });

      if (response.message === 'Password verified successfully') {
        setStep(2);  // Move to the next step
        setMessage('');
      } else {
        setMessage('Incorrect current password.');
        setAlertType('error');
      }
    } catch (error) {
      setMessage('An error occurred while verifying the password.');
      setAlertType('error');
    }
  };

  /**
   * Handles the user clicking "Next" to verify the current password.
   */
  const handleNextStep = () => {
    if (currentPassword !== confirmPassword) {
      setMessage('Current passwords do not match!');
      setAlertType('error');
      return;
    }

    verifyCurrentPassword();
  };

  /**
   * Handles the password reset action by calling the ManualPasswordReset API.
   * @function handlePasswordReset
   */
  const handlePasswordReset = async () => {
    if (newPassword.trim().length < 8) {
      setMessage('Password must be at least 8 characters long.');
      setAlertType('error');
      return;
    }

    try {
      const response = await UserPasswordReset({
        email: user.email,
        username: user.username,
        password: newPassword,
      });

      if (response.message === 'Password reset successful') {
        setMessage('Password reset successful.');
        setAlertType('success');
        setSnackbarOpen(true); // Show Snackbar on success
        onClose();
        resetState();
      } else {
        setMessage('Failed to reset the password.');
        setAlertType('error');
      }
    } catch (error) {
      setMessage('An error occurred while resetting the password.');
      setAlertType('error');
    }
  };

  /**
   * Resets the component state to initial values.
   * @function resetState
   */
  const resetState = () => {
    setStep(1);
    setMessage('');
    setCurrentPassword('');
    setConfirmPassword('');
    setNewPassword('');
  };

  /**
   * Handles closing the Snackbar.
   * @function handleSnackbarClose
   */
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent>
        {step === 1 ? (
          <>
            <Typography variant="body1" gutterBottom>
              Please enter your current password twice for confirmation:
            </Typography>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              margin="normal"
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
            />
            <TextField
              fullWidth
              label="Confirm Current Password"
              type="password"
              margin="normal"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {message && <Alert severity={alertType} sx={{ mt: 2 }}>{message}</Alert>}
          </>
        ) : (
          <>
            <Typography variant="body1" gutterBottom>
              Please enter your new password:
            </Typography>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              margin="normal"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            {message && <Alert severity={alertType} sx={{ mt: 2 }}>{message}</Alert>}
          </>
        )}
      </DialogContent>
      <DialogActions>
        {step === 1 ? (
          <Button variant="contained" color="primary" onClick={handleNextStep}>
            Next
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handlePasswordReset}>
            Reset Password
          </Button>
        )}
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>

      {/* Snackbar for Success Message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Password reset successful!"
        action={
          <Button color="inherit" size="small" onClick={handleSnackbarClose}>
            Close
          </Button>
        }
      />
    </Dialog>
  );
}

export default ManualPasswordReset;
