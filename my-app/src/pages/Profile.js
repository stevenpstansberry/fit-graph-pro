/**
 * @fileoverview Profile page for users to view and manage their personal information,
 * workout history, and view their workout progress graph.
 * 
 * @file src/pages/Profile.js
 * 
 * Provides a user interface for managing profile details and viewing workout progress
 * 
 * @version 1.0.0
 * @author Steven Stansberry
 */

import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { getUser, resetUserSession } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Avatar, Card, CardContent, CardActions, Grid, Divider } from '@mui/material';
import WorkoutsPerWeekChart from '../components/WorkoutsPerWeekChart'; 

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

  useEffect(() => {
    // Fetch user's recent workouts
    // setRecentWorkouts(fetchedWorkouts);
    // dummy data:
    setRecentWorkouts([
      { id: 1, name: 'Upper Body Strength', date: new Date('2024-08-29'), duration: '45 mins' },
      { id: 2, name: 'Cardio Session', date: new Date('2024-08-28'), duration: '30 mins' },
      { id: 3, name: 'Leg Day', date: new Date('2024-08-22'), duration: '50 mins' },
      { id: 4, name: 'Full Body Workout', date: new Date('2024-08-15'), duration: '60 mins' },
    ]);
  }, []);

  /**
   * Logs the user out and navigates to the login page.
   * 
   * @function logoutHandler
   */
  const logoutHandler = () => {
    resetUserSession();
    navigate('/Login');
  };

  return (
    <Container maxWidth="lg">
      {/* Navbar Component */}
      <Navbar />

      {/* Profile Section */}
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Avatar and User Info */}
        <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
          {name.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h4" component="h1" gutterBottom>
          {name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {email}
        </Typography>

        {/* Divider */}
        <Divider sx={{ width: '100%', mb: 4 }} />

        {/* Workouts Per Week Chart */}
        <Typography variant="h5" gutterBottom>
          Workouts Per Week
        </Typography>
        <WorkoutsPerWeekChart recentWorkouts={recentWorkouts} /> {/* Chart component to display workouts per week */}

        {/* Divider */}
        <Divider sx={{ width: '100%', my: 4 }} />

        {/* Recent Workouts Section */}
        <Typography variant="h5" gutterBottom>
          Recent Workouts
        </Typography>
        <Grid container spacing={3}>
          {recentWorkouts.map((workout) => (
            <Grid item xs={12} md={6} key={workout.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{workout.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Date: {workout.date.toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Duration: {workout.duration}
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

      {/* Footer Component */}
      <Footer />
    </Container>
  );
}

export default Profile;
