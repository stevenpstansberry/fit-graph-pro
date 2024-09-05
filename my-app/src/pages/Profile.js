/**
 * @fileoverview Profile page component for users to view and manage their personal information,
 * workout history, and view their workout progress graph.
 * 
 * @file src/pages/Profile.js
 * 
 * Provides a user interface for managing profile details, uploading a profile picture,
 * and viewing recent workouts and workouts per week statistics.
 * 
 * @component
 * @returns {React.Element} - The rendered Profile page component.
 * 
 * @version 1.0.0
 * @author Steven Stansberry
 */

import React, { useState, useEffect, useCallback } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { getUser, resetUserSession, getProfileImageUrlFromSession, setProfileImageUrlToSession } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Avatar, Card, CardContent, CardActions, Grid, Divider, CircularProgress } from '@mui/material';
import WorkoutsPerWeekChart from '../components/WorkoutsPerWeekChart';
import ProfilePictureUpload from '../components/ProfilePictureUpload'; 
import { getAllWorkouts, getProfilePicture } from '../services/APIServices';

/**
 * Profile page component for displaying user information and managing profile-related actions.
 * 
 * @component
 * @returns {React.Element} - The rendered Profile page component.
 */
function Profile() {
  const navigate = useNavigate();
  const user = getUser();
  const name = user !== 'undefined' && user ? user.name : '';
  const email = user !== 'undefined' && user ? user.email : '';
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false); // State to manage the modal open/close
  const [profileImageUrl, setProfileImageUrl] = useState(getProfileImageUrlFromSession()); // Initialize with URL from session storage if available
  const [loadingWorkouts, setLoadingWorkouts] = useState(true); // Consolidated loading state

  // Fetch the profile picture URL from the backend if not in session storage
  const fetchProfilePicture = useCallback(async () => {
    console.log('Fetching profile picture for user:', user.username); // Log fetch attempt

    // Check if the profile picture URL is already in session storage
    const storedProfileImageUrl = getProfileImageUrlFromSession();
    if (storedProfileImageUrl) {
      setProfileImageUrl(storedProfileImageUrl);
      console.log('Profile picture URL loaded from session storage:', storedProfileImageUrl); // Log session storage URL
      return; // Return early to avoid unnecessary API call
    }

    try {
      const response = await getProfilePicture(user.username); // Fetch profile picture from API
      if (response && response.profilePictureUrl) {
        // Add a timestamp to the URL to bust cache
        const cacheBustedUrl = `${response.profilePictureUrl}?t=${new Date().getTime()}`;
        setProfileImageUrl(cacheBustedUrl);
        setProfileImageUrlToSession(cacheBustedUrl); // Store the profile picture URL in session storage
        console.log('Profile picture URL fetched and stored in session storage:', cacheBustedUrl); // Log fetched URL with cache-busting
      } else {
        setProfileImageUrl(null); // Set to null if no profile picture is found
        console.log('No profile picture found for user:', user.username); // Log absence of profile picture
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  }, [user.username]);

  useEffect(() => {
    fetchProfilePicture(); // Fetch profile picture on mount

    // Fetch the last 4 workouts and the last 5 weeks of workouts for the authenticated user
    const fetchWorkouts = async () => {
      try {
        setLoadingWorkouts(true); // Set loading state to true
        const recent4Workouts = await getAllWorkouts(user.name, { count: 4 }); // Fetch last 4 workouts
        const last5WeeksWorkouts = await getAllWorkouts(user.name, { days: 35 }); // Fetch workouts from the last 5 weeks

        setRecentWorkouts(recent4Workouts);
        setWorkoutsPerWeek(last5WeeksWorkouts);
        console.log('Recent 4 Workouts:', recent4Workouts);
        console.log('Last 5 Weeks Workouts:', last5WeeksWorkouts);
        
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoadingWorkouts(false); // Set loading state back to false
      }
    };

    fetchWorkouts(); // Fetch workouts on mount
  }, [user.name, fetchProfilePicture]); // Re-fetch profile picture when username changes or after an upload

  /**
   * Logs the user out and navigates to the login page.
   * 
   * @function logoutHandler
   */
  const logoutHandler = () => {
    resetUserSession();
    navigate('/Login');
  };

  // Handle opening the modal
  const handleOpenUploadModal = () => {
    setUploadModalOpen(true);
    console.log('Profile picture upload modal opened'); // Log modal open
  };

  // Handle closing the modal
  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    console.log('Profile picture upload modal closed'); // Log modal close
  };

  // Handle successful profile picture upload
  const handleProfilePictureUpdate = (newProfileImageUrl) => {
    // Append a timestamp to force browser to reload the image
    const cacheBustedUrl = `${newProfileImageUrl}?t=${new Date().getTime()}`;
    console.log('Profile picture uploaded. New URL:', cacheBustedUrl); // Log new URL after upload
    setProfileImageUrl(cacheBustedUrl); // Update the state with the new URL
    setProfileImageUrlToSession(cacheBustedUrl); // Update session storage with the new URL
    fetchProfilePicture(); // Re-fetch the profile picture after successful upload
  };

  return (
    <Container maxWidth="lg">
      {/* Navbar Component with profileImageUrl prop */}
      <Navbar profileImageUrl={profileImageUrl} />

      {/* Profile Section */}
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Avatar and User Info */}
        <Avatar
          sx={{ width: 100, height: 100, mb: 2, cursor: 'pointer' }} // Add cursor pointer to indicate clickability
          src={profileImageUrl ? profileImageUrl : undefined} // If profileImageUrl exists, use it
          onClick={handleOpenUploadModal} // Open modal on click
        >
          {!profileImageUrl && name.charAt(0).toUpperCase()} {/* If no profile image, show initial */}
        </Avatar>
        <Typography variant="h4" component="h1" gutterBottom>
          {name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {email}
        </Typography>

        {/* Divider */}
        <Divider sx={{ width: '100%', mb: 4 }} />

        {/* Workouts Per Week Chart and Recent Workouts Section */}
        {loadingWorkouts ? (
          <CircularProgress /> // Single loading spinner for both sections
        ) : (
          <>
            {/* Workouts Per Week Chart */}
            <Typography variant="h5" gutterBottom>
              Workouts Per Week
            </Typography>
            <WorkoutsPerWeekChart recentWorkouts={workoutsPerWeek} /> {/* Chart component to display workouts per week */}

            {/* Divider */}
            <Divider sx={{ width: '100%', my: 4 }} />

            {/* Recent Workouts Section */}
            <Typography variant="h5" gutterBottom>
              Recent Workouts
            </Typography>
            <Grid container spacing={3}>
              {recentWorkouts.map((workout) => (
                <Grid item xs={12} md={6} key={workout.workoutId}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{workout.type}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Date: {new Date(workout.date).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary">
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Divider */}
        <Divider sx={{ width: '100%', my: 4 }} />

        {/* Logout Button */}
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 4 }}
          onClick={logoutHandler}
        >
          Logout
        </Button>
      </Box>

      {/* Profile Picture Upload Modal */}
      <ProfilePictureUpload 
        open={uploadModalOpen} 
        handleClose={handleCloseUploadModal} 
        onUploadSuccess={handleProfilePictureUpdate} 
      />

      {/* Footer Component */}
      <Footer />
    </Container>
  );
}

export default Profile;
