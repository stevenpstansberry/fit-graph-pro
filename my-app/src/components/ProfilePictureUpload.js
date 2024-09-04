// src/components/ProfilePictureUpload.js

import React, { useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import { uploadProfilePicture } from '../services/APIServices'; 
import { getUser} from '../services/AuthService';


/**
 * ProfilePictureUpload component for uploading a profile picture.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.open - If the modal is open.
 * @param {Function} props.handleClose - Function to close the modal.
 * @returns {React.Element} - The rendered ProfilePictureUpload component.
 */
const ProfilePictureUpload = ({ open, handleClose }) => {
  const user = getUser();

  const [selectedFile, setSelectedFile] = useState(null);

  /**
   * Handles file selection.
   *
   * @function handleFileChange
   * @param {Object} event - The file input change event.
   */
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  /**
   * Converts the selected image to Base64 and uploads it.
   *
   * @function handleUpload
   */
  const handleUpload = async () => {
    if (!selectedFile) return;

    // Convert the image to a Base64 string
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1]; // Remove data URL scheme part

      // Upload the Base64 image to the backend
      try {
        await uploadProfilePicture({
          username: user.username, // Replace with the authenticated user's username
          base64Image: base64Image,
          fileType: selectedFile.type.split('/')[1], // Get the file extension
        });
        alert('Profile picture uploaded successfully!');
        handleClose(); // Close the modal after upload
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Failed to upload profile picture.');
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ width: 400, padding: 4, margin: 'auto', marginTop: '15%' }}>
        <Typography variant="h6" gutterBottom>
          Upload Profile Picture
        </Typography>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!selectedFile}
          sx={{ mt: 2 }}
        >
          Upload
        </Button>
      </Box>
    </Modal>
  );
};

export default ProfilePictureUpload;
