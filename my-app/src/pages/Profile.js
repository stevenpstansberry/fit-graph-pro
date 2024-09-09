/**
 * @fileoverview Profile page component for displaying user information, managing profile-related actions, 
 * and visualizing workout data such as recent workouts and workouts per week.
 * 
 * @file src/components/Profile.js
 * 
 * This component provides a user interface for managing the user's profile picture, 
 * logging out, and displaying recent workouts and statistics in the user's profile.
 * It integrates sub-components for charts and profile picture upload.
 * 
 * @component
 * @returns {React.Element} - The rendered Profile page component.
 * 
 * @version 1.0.0
 * @updated By Steven Stansberry
 */

import React, { useState, useEffect, useCallback } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { getUser, resetUserSession, getProfileImageUrlFromSession, setProfileImageUrlToSession } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Avatar, Divider, CircularProgress } from '@mui/material';
import WorkoutsPerWeekChart from '../components/profile-components/WorkoutsPerWeekChart';
import ProfilePictureUpload from '../components/profile-components/ProfilePictureUpload'; 
import RecentWorkouts from '../components/profile-components/RecentWorkouts'; 
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
  const [uploadModalOpen, setUploadModalOpen] = useState(false); 
  const [profileImageUrl, setProfileImageUrl] = useState(getProfileImageUrlFromSession()); 
  const [loadingWorkouts, setLoadingWorkouts] = useState(true); 
  const [expandedWorkout, setExpandedWorkout] = useState(null); // Track which workout is expanded

  const fetchProfilePicture = useCallback(async () => {
    console.log('Fetching profile picture for user:', user.username);

    const storedProfileImageUrl = getProfileImageUrlFromSession();
    if (storedProfileImageUrl) {
      setProfileImageUrl(storedProfileImageUrl);
      console.log('Profile picture URL loaded from session storage:', storedProfileImageUrl);
      return;
    }

    try {
      const response = await getProfilePicture(user.username);
      if (response && response.profilePictureUrl) {
        const cacheBustedUrl = `${response.profilePictureUrl}?t=${new Date().getTime()}`;
        setProfileImageUrl(cacheBustedUrl);
        setProfileImageUrlToSession(cacheBustedUrl);
        console.log('Profile picture URL fetched and stored in session storage:', cacheBustedUrl);
      } else {
        setProfileImageUrl(null);
        setProfileImageUrlToSession(null);
        console.log('No profile picture found for user:', user.username);
      }
    } catch (error) {
      setProfileImageUrl(null);
      setProfileImageUrlToSession(null);
      console.log('No profile picture found for user:', user.username);

    }
  }, [user.username]);

  useEffect(() => {
    fetchProfilePicture();

    const fetchWorkouts = async () => {
      try {
        setLoadingWorkouts(true);
        const recent4Workouts = await getAllWorkouts(user.username, { count: 4 });
        const last5WeeksWorkouts = await getAllWorkouts(user.username, { days: 35 });

        setRecentWorkouts(recent4Workouts);
        setWorkoutsPerWeek(last5WeeksWorkouts);
        console.log('Recent 4 Workouts:', recent4Workouts);
        console.log('Last 5 Weeks Workouts:', last5WeeksWorkouts);
        
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoadingWorkouts(false);
      }
    };

    fetchWorkouts();
  }, [user.name, fetchProfilePicture]);

  const logoutHandler = () => {
    resetUserSession();
    navigate('/Login');
  };

  const handleOpenUploadModal = () => {
    setUploadModalOpen(true);
    console.log('Profile picture upload modal opened');
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    console.log('Profile picture upload modal closed');
  };

  const handleProfilePictureUpdate = (newProfileImageUrl) => {
    const cacheBustedUrl = `${newProfileImageUrl}?t=${new Date().getTime()}`;
    console.log('Profile picture uploaded. New URL:', cacheBustedUrl);
    setProfileImageUrl(cacheBustedUrl);
    setProfileImageUrlToSession(cacheBustedUrl);
    fetchProfilePicture();
  };

  // Toggle expand/collapse for workout details
  const handleExpandClick = (workoutId) => {
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Ensure vertical stacking
        minHeight: '100vh', // Ensure the height covers the entire viewport
        justifyContent: 'space-between', // Space between the header and footer
      }}
    >
      {/* Navbar */}
      <Navbar profileImageUrl={profileImageUrl} />

      {/* Main Content Container */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
        {/* Profile Picture and Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar
            sx={{ width: 100, height: 100, mb: 2, cursor: 'pointer' }}
            src={profileImageUrl ? profileImageUrl : undefined}
            onClick={handleOpenUploadModal}
          >
            {!profileImageUrl && name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h4" component="h1" gutterBottom>
            {name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            {email}
          </Typography>

          <Divider sx={{ width: '100%', mb: 4 }} />
        </Box>

        {/* Workouts and Stats */}
        {loadingWorkouts ? (
          <CircularProgress />
        ) : (
          <>
            {workoutsPerWeek.length > 0 ? (
              <>
                <Typography variant="h5" gutterBottom>
                  Workouts Per Week
                </Typography>
                <WorkoutsPerWeekChart recentWorkouts={workoutsPerWeek} />
                <Divider sx={{ width: '100%', my: 4 }} />
              </>
            ) : (
              <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="h6" color="textSecondary">
                  No workouts found yet.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }} 
                  onClick={() => navigate('/workouts')}
                >
                  Start Your First Workout
                </Button>
              </Box>
            )}

            {recentWorkouts.length > 0 && <RecentWorkouts recentWorkouts={recentWorkouts} />}
          </>
        )}

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
      </Container>

      {/* Profile Picture Upload Modal */}
      <ProfilePictureUpload 
        open={uploadModalOpen} 
        handleClose={handleCloseUploadModal} 
        onUploadSuccess={handleProfilePictureUpdate} 
      />

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default Profile;
