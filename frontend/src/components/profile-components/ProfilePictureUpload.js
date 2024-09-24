/**
 * @fileoverview Component to handle uploading a profile picture for the Fit Graph application.
 *
 * @file src/components/profile-components/ProfilePictureUpload.js
 *
 * Provides a modal interface for users to upload and update their profile picture.
 * Converts the selected image to a Base64 string and uploads it to the backend.
 * On successful upload, the parent component is updated with the new profile picture URL.
 *
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.open - If the modal is open.
 * @param {Function} props.handleClose - Function to close the modal.
 * @param {Function} props.onUploadSuccess - Callback function to handle successful upload.
 * @returns {React.Element} - The rendered ProfilePictureUpload component.
 *
 * @version 1.0.0
 * @author Steven Stansberry
 */

import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  uploadProfilePicture,
  getProfilePicture,
} from "../../services/FitGraphAPIServices";
import { getUser } from "../../services/AuthService";

/**
 * ProfilePictureUpload component for uploading a profile picture.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.open - If the modal is open.
 * @param {Function} props.handleClose - Function to close the modal.
 * @param {Function} props.onUploadSuccess - Callback function to handle successful upload.
 * @returns {React.Element} - The rendered ProfilePictureUpload component.
 */
const ProfilePictureUpload = ({ open, handleClose, onUploadSuccess }) => {
  const user = getUser();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false); // State to handle uploading status
  const [successMessageOpen, setSuccessMessageOpen] = useState(false); // State to manage Snackbar visibility

  /**
   * Handles file selection with size limit.
   *
   * @function handleFileChange
   * @param {Object} event - The file input change event.
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileSizeLimit = 5 * 1024 * 1024; // 5MB size limit

    if (file && file.size > fileSizeLimit) {
      alert("File size exceeds 5MB. Please select a smaller file.");
      setSelectedFile(null); // Reset selected file
    } else {
      setSelectedFile(file);
    }
  };

  /**
   * Converts the selected image to Base64 and uploads it.
   *
   * @function handleUpload
   */
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true); // Set uploading state to true

    // Convert the image to a Base64 string
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(",")[1]; // Remove data URL scheme part

      try {
        // Upload the Base64 image to the backend
        await uploadProfilePicture({
          username: user.username,
          base64Image: base64Image,
          fileType: selectedFile.type.split("/")[1], // Get the file extension
        });

        // Fetch the updated profile picture URL after successful upload
        const response = await getProfilePicture(user.username);
        if (response && response.profilePictureUrl) {
          onUploadSuccess(response.profilePictureUrl); // Update parent component with new URL
          console.log(
            "success! uploaded picture: " + response.profilePictureUrl
          );
        }

        setSuccessMessageOpen(true); // Show success message
        handleClose(); // Close modal after upload
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("Failed to upload profile picture.");
      } finally {
        setUploading(false); // Set uploading state back to false
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  /**
   * Handles closing of the success message Snackbar.
   *
   * @function handleCloseSuccessMessage
   */
  const handleCloseSuccessMessage = () => {
    setSuccessMessageOpen(false);
  };

  return (
    <>
      {/* Success message Snackbar */}
      <Snackbar
        open={successMessageOpen}
        autoHideDuration={3000} // Duration in milliseconds
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position at the top center
      >
        <Alert
          onClose={handleCloseSuccessMessage}
          severity="success"
          sx={{ width: "100%" }}
        >
          Profile picture uploaded successfully!
        </Alert>
      </Snackbar>

      {/* Modal for uploading profile picture */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="upload-profile-picture-modal"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            outline: "none",
          }}
        >
          <Card
            sx={{
              width: "400px",
              borderRadius: "12px",
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Profile Picture
              </Typography>

              {/* Show a linear progress bar when uploading */}
              {uploading ? (
                <LinearProgress /> // Uploading progress bar
              ) : (
                <>
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
                </>
              )}
            </CardContent>
            {/* Hide the actions if uploading */}
            {!uploading && (
              <CardActions sx={{ justifyContent: "flex-end", padding: "16px" }}>
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  disabled={!selectedFile}
                >
                  Upload
                </Button>
              </CardActions>
            )}
          </Card>
        </Box>
      </Modal>
    </>
  );
};

export default ProfilePictureUpload;
