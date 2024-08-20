// src/components/Features.js
import React from 'react';
import { Grid, Paper, Typography, ButtonBase } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BarChartIcon from '@mui/icons-material/BarChart';
import FlagIcon from '@mui/icons-material/Flag';
import PeopleIcon from '@mui/icons-material/People';
import { Link } from 'react-router-dom';

const featureItems = [
  { title: 'Track Activities', description: 'Log your workouts and activities to keep track of your progress.', icon: <FitnessCenterIcon sx={{ fontSize: 40 }} />, link: '/workouts' },
  { title: 'Visualize Progress', description: 'Use dynamic graphs to visualize your fitness journey.', icon: <BarChartIcon sx={{ fontSize: 40 }} />, link: '#' },
  { title: 'Set Goals', description: 'Define your fitness goals and track your progress towards achieving them.', icon: <FlagIcon sx={{ fontSize: 40 }} />, link: '#' },
  { title: 'Social Features', description: 'Connect with friends and join challenges to stay motivated.', icon: <PeopleIcon sx={{ fontSize: 40 }} />, link: '#' },
];

function Features() {
  return (
    <Grid container spacing={3} justifyContent="center">
      {featureItems.map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <ButtonBase
            component={Link} 
            to={item.link} 
            sx={{
              width: '100%',
              display: 'block',
              textAlign: 'inherit',
              borderRadius: 2,
              overflow: 'hidden', 
            }}
            TouchRippleProps={{
              sx: {
                color: 'rgba(255, 0, 0, 0.5)', 
              },
              timeout: 50,
            }}
          >
            <Paper
              sx={{
                padding: 2,
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#333',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
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
          </ButtonBase>
        </Grid>
      ))}
    </Grid>
  );
}

export default Features;
