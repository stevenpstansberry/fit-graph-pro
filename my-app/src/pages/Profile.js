import React, { useState, useEffect, useCallback } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { getUser, resetUserSession, getProfileImageUrlFromSession, setProfileImageUrlToSession } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Avatar, Card, CardContent, CardActions, Grid, Divider, CircularProgress, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Import icon for expanding workout details
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
        console.log('No profile picture found for user:', user.username);
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  }, [user.username]);

  useEffect(() => {
    fetchProfilePicture();

    const fetchWorkouts = async () => {
      try {
        setLoadingWorkouts(true);
        const recent4Workouts = await getAllWorkouts(user.name, { count: 4 });
        const last5WeeksWorkouts = await getAllWorkouts(user.name, { days: 35 });

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
    <Container maxWidth="lg">
      {/* Navbar Component with profileImageUrl prop */}
      <Navbar profileImageUrl={profileImageUrl} />

      {/* Profile Section */}
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Avatar and User Info */}
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

        {/* Divider */}
        <Divider sx={{ width: '100%', mb: 4 }} />

        {/* Workouts Per Week Chart and Recent Workouts Section */}
        {loadingWorkouts ? (
          <CircularProgress />
        ) : (
          <>
            {workoutsPerWeek.length > 0 ? (
              <>
                {/* Workouts Per Week Chart */}
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

            {recentWorkouts.length > 0 ? (
              <>
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
                          <Button size="small" color="primary" onClick={() => handleExpandClick(workout.workoutId)}>
                            {expandedWorkout === workout.workoutId ? 'Hide Details' : 'View Details'}
                          </Button>
                          <IconButton
                            onClick={() => handleExpandClick(workout.workoutId)}
                            aria-expanded={expandedWorkout === workout.workoutId}
                            aria-label="show more"
                          >
                            <ExpandMoreIcon />
                          </IconButton>
                        </CardActions>
                        <Collapse in={expandedWorkout === workout.workoutId} timeout="auto" unmountOnExit>
                          <CardContent>
                            {workout.exercises.map((exercise, index) => (
                              <Box key={index} sx={{ mb: 2 }}>
                                <Typography variant="subtitle1">{exercise.label} ({exercise.bodyPart})</Typography>
                                {exercise.sets.map((set, setIndex) => (
                                  <Typography key={setIndex} variant="body2" color="textSecondary">
                                    Set {setIndex + 1}: {set.weight} lbs x {set.reps} reps
                                  </Typography>
                                ))}
                              </Box>
                            ))}
                          </CardContent>
                        </Collapse>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : null}
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
