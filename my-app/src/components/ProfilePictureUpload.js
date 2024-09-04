// src/components/ProfilePictureUpload.js

import React, { useState } from 'react';
import { Box, Button, Modal, Typography, Card, CardContent, CardActions, TextField } from '@mui/material';
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

    // Function to handle the upload click
    const handleUploadClick = () => {
        if (selectedFile) {
            handleUpload(selectedFile);
            handleClose(); // Close modal after upload
        }
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
        console.log("base64 image: " + base64Image)
      // Upload the Base64 image to the backend
      try {
        await uploadProfilePicture({
          username: user.username, 
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
    <Modal open={open} onClose={handleClose} aria-labelledby="upload-profile-picture-modal">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          outline: 'none', 
        }}
      >
        <Card
          sx={{
            width: '400px', 
            borderRadius: '12px', 
            boxShadow: 3,
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upload Profile Picture
            </Typography>

            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ marginBottom: 2 }}
            >
              Choose File
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="image/*" // Accept only image files
              />
            </Button>
            {selectedFile && (
              <Typography variant="body2" color="textSecondary">
                {selectedFile.name}
              </Typography>
            )}
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', padding: '16px' }}>
          <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleUploadClick} disabled={!selectedFile}>
              Upload
            </Button>

          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
};

export default ProfilePictureUpload;
