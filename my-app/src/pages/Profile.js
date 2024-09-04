import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { getUser, resetUserSession } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Avatar, Card, CardContent, CardActions, Grid, Divider } from '@mui/material';
import WorkoutsPerWeekChart from '../components/WorkoutsPerWeekChart'; 
import { getAllWorkouts } from '../services/APIServices';

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

  useEffect(() => {
    // Fetch the last 4 workouts and the last 5 weeks of workouts for the authenticated user
    const fetchWorkouts = async () => {
      try {
        const recent4Workouts = await getAllWorkouts(user.name, { count: 4 }); // Fetch last 4 workouts
        const last5WeeksWorkouts = await getAllWorkouts(user.name, { days: 35 }); // Fetch workouts from the last 5 weeks

        setRecentWorkouts(recent4Workouts);
        setWorkoutsPerWeek(last5WeeksWorkouts);

        console.log('Recent 4 Workouts:', recent4Workouts);
        console.log('Last 5 Weeks Workouts:', last5WeeksWorkouts);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, [user.name]);

  /**
   * Logs the user out and navigates to the login page.
   * 
   * @function logoutHandler
   */
  const logoutHandler = () => {
    resetUserSession();
    navigate('/Login');
  };

    // Extract S3 profile picture url for user, if it is associated with the user in DynamoDB
    let profileImageUrl = null;
    if (user && user.s3ProfileURI) {
      profileImageUrl = user.s3ProfileURI;
    }

  // TODO: add function responsible for uploading photo

  return (
    <Container maxWidth="lg">
      {/* Navbar Component */}
      <Navbar />

      {/* Profile Section */}
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Avatar and User Info */}
        <Avatar 
          sx={{ width: 100, height: 100, mb: 2 }}
          src={profileImageUrl ? profileImageUrl : undefined} // If profileImageUrl exists, use it
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
                  {/* Add more workout details if needed */}
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
