/**
 * @fileoverview Component for confirming user actions by verifying their password through a dialog interface.
 * 
 * @file src/components/auth-components/ConfirmPassword.js
 * 
 * This component provides a dialog (modal) interface for users to confirm a sensitive action by verifying their password.
 * 
 * @component
 * @param {Object} props - The props for the ConfirmPassword component.
 * @param {boolean} props.open - Determines whether the dialog is open.
 * @param {Function} props.onClose - Function to close the dialog.
 * @param {Object} props.user - The user object containing the user's email and username.
 * @param {String} props.mode - The mode of the confirm password dialog. Can be 'ResetPassword' or 'DeleteUser'.
 * @returns {React.Element} The rendered ConfirmPassword component.
 * 
 * @version 1.0.0
 * @author Steven
 */
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Alert, Snackbar } from '@mui/material';
import { verifyPassword, UserPasswordReset, deleteUser } from '../../services/APIServices';
import { resetUserSession } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';


function ConfirmPassword({ open, onClose, user, mode }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState('info'); // 'info', 'error', 'success'
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar visibility

  const navigate = useNavigate(); 


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
        if (mode === 'ResetPassword') {
          setStep(2);  // Move to the next step for password reset
          setMessage('');
        } else if (mode === 'DeleteUser') {
          handleDeleteUser();  // Proceed with user deletion
        }
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
   * Handles the password reset action by calling the UserPasswordReset API.
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

  const handleDeleteUser = async () => {
    try {
      const response = await deleteUser({ username: user.username, password: currentPassword });

      if (response.message === 'Account successfully deleted.') {
        setMessage('User deleted successfully.');
        setAlertType('success');
        setSnackbarOpen(true); // Show Snackbar on success
        onClose();
        resetState();
        navigate('/');
        resetUserSession(); // Clear the user session
      } else {
        setMessage('Failed to delete the user.');
        setAlertType('error');
      }
    } catch (error) {
      setMessage('An error occurred while deleting the user.');
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
      <DialogTitle>{mode === 'ResetPassword' ? 'Reset Password' : 'Confirm Account Deletion'}</DialogTitle>
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
        {mode === 'ResetPassword' && step === 2 ? (
          <Button variant="contained" color="primary" onClick={handlePasswordReset}>
            Reset Password
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleNextStep}>
            {mode === 'ResetPassword' ? 'Next' : 'Confirm'}
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
        message={mode === 'ResetPassword' ? 'Password reset successful!' : 'User deleted successfully!'}
        action={
          <Button color="inherit" size="small" onClick={handleSnackbarClose}>
            Close
          </Button>
        }
      />
    </Dialog>
  );
}

export default ConfirmPassword;