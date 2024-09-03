// src/pages/Contact.js

import React, { useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Typography, Box, TextField, Button, Alert } from '@mui/material'; 
import { submitContactForm } from '../services/APIServices';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    //e.preventDefault();
    setSuccessMessage(''); // Clear previous messages
    setErrorMessage(''); // Clear previous messages
    console.log('Form Data:', formData);
    
    try {
      await submitContactForm(formData);
      console.log("Successfully submitted contact form!");
      setSuccessMessage('Your message has been successfully submitted!'); // Set success message
    } catch (error) {
      console.error("Failed to submit contact form", error);
      setErrorMessage('Failed to submit your message. Please try again later.'); // Set error message
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ width: '100%' }}>
        <Navbar />
      </Box>

      <Box sx={{ flexGrow: 1, textAlign: 'center', mt: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Contact Us
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: '800px', margin: '0 auto' }}>
          Have any questions, feedback, or just want to get in touch? Fill out the form below and we'll get back to you as soon as possible!
        </Typography>
        
        {/* Display Success or Error Message */}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

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
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
          />
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
          <Button type="submit" variant="contained" color="primary" onClick= {handleSubmit} sx={{ mt: 2 }}>
            Submit
          </Button>
        </Box>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Footer />
      </Box>
    </Box>
  );
}

export default Contact;
