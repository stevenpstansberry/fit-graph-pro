// src/components/Features.js
import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BarChartIcon from '@mui/icons-material/BarChart';
import FlagIcon from '@mui/icons-material/Flag';
import PeopleIcon from '@mui/icons-material/People';

const featureItems = [
  { title: 'Track Activities', description: 'Log your workouts and activities to keep track of your progress.', icon: <FitnessCenterIcon /> },
  { title: 'Visualize Progress', description: 'Use dynamic graphs to visualize your fitness journey.', icon: <BarChartIcon /> },
  { title: 'Set Goals', description: 'Define your fitness goals and track your progress towards achieving them.', icon: <FlagIcon /> },
  { title: 'Social Features', description: 'Connect with friends and join challenges to stay motivated.', icon: <PeopleIcon /> },
];

function Features() {
  return (
    <Grid container spacing={3}>
      {featureItems.map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            sx={{
              padding: 2,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#333',
            }}
            elevation={4}
          >
            {item.icon}
            <Typography variant="h6" component="h3" sx={{ mt: 1, mb: 1 }}>
              {item.title}
            </Typography>
            <Typography variant="body2">
              {item.description}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default Features;
