import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';

function Features() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" component="h3">
                Track Activities
              </Typography>
              <Typography component="p">
                Log your workouts and activities to keep track of your progress.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" component="h3">
                Visualize Progress
              </Typography>
              <Typography component="p">
                Use dynamic graphs to visualize your fitness journey.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" component="h3">
                Set Goals
              </Typography>
              <Typography component="p">
                Define your fitness goals and track your progress towards achieving them.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" component="h3">
                Social Features
              </Typography>
              <Typography component="p">
                Connect with friends and join challenges to stay motivated.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Features;
