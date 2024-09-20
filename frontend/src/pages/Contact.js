/**
 * @fileoverview Contact form page for user inquiries.
 * 
 * @file src/pages/Contact.js
 * 
 * Provides a contact form that users can fill out to send messages. The form
 * collects a name, email, and message, and submits this data to the backend API.
 * 
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Typography, Box, TextField, Button, Alert } from '@mui/material'; 
import { submitContactForm } from '../services/FitGraphAPIServices';

/**
 * Contact page component for handling user inquiries.
 * 
 * This component renders a form for users to submit their name, email, and message.
 * On form submission, the data is sent to the backend API using an Axios POST request.
 * 
 * @component
 * @example
 * return (
 *   <Contact />
 * )
 */
function Contact() {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  // State for managing success message
  const [successMessage, setSuccessMessage] = useState(''); 
  // State for managing error message
  const [errorMessage, setErrorMessage] = useState(''); 

  /**
   * Handles changes to form input fields.
   * 
   * Updates the corresponding field in the formData state when a user types in the form.
   * 
   * @function handleChange
   * @param {Object} e - The event object from the input field change.
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  /**
   * Handles form submission.
   * 
   * Submits the form data to the backend API. If the submission is successful,
   * displays a success message. If it fails, displays an error message.
   * 
   * @async
   * @function handleSubmit
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    //e.preventDefault(); // Prevent the default form submission behavior
    setSuccessMessage(''); // Clear previous messages
    setErrorMessage(''); // Clear previous messages
    console.log('Form Data:', formData); // Debugging: Log the form data
  
    try {
      // Make the asynchronous request to submit form data
      const response = await submitContactForm(formData);
  
      // Check for HTTP 2xx response status to determine success
      if (response.status >= 200 && response.status < 300) {
        console.log("Successfully submitted contact form!"); 
        setSuccessMessage('Your message has been successfully submitted!'); // Set success message
      } else {
        // Handle non-2xx responses (e.g., 4xx, 5xx)
        setErrorMessage('Failed to submit your message. Please check your input and try again.'); // Set error message
      }
    } catch (error) {
      console.error("Error in submitting contact form:", error); 
  
      // Check if there is a specific response error
      if (error.response) {
        setErrorMessage(`Error: ${error.response.data.message || 'An error occurred while submitting your message. Please try again later.'}`);
      } else {
        setErrorMessage('Network error. Please check your internet connection or try again later.');
      }
    }
  };


  /**
   * Effect to prompt the user when they attempt to leave the page with unsaved changes.
   * 
   * Listens for the `beforeunload` event and checks if any of the form fields have text.
   * If they do, it prompts the user for confirmation before leaving.
   * 
   * @function useEffect
   */
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (formData.name || formData.email || formData.message) {
        event.returnValue = ''; // For older browsers
      }
    };

    // Add event listener for beforeunload event
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formData]); // Effect dependencies on formData

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar Component */}
      <Box sx={{ width: '100%' }}>
        <Navbar />
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, textAlign: 'center', mt: 4 }}>
        {/* Page Title */}
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Contact Us
        </Typography>
        {/* Description */}
        <Typography variant="body1" sx={{ mb: 4, maxWidth: '800px', margin: '0 auto' }}>
          Have any questions, feedback, or just want to get in touch? Fill out the form below and we'll get back to you as soon as possible!
        </Typography>
        
        {/* Display Success or Error Message */}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

        {/* Contact Form */}
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          {/* Name Input */}
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
          />
          {/* Email Input */}
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            type="email"
          />
          {/* Message Input */}
          <TextField
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            multiline
            rows={4}
          />
          {/* Submit Button */}
          <Button type="submit" variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
            Submit
          </Button>
        </Box>
      </Box>

      {/* Footer Component */}
      <Box sx={{ width: '100%' }}>
        <Footer />
      </Box>
    </Box>
  );
}

export default Contact;
