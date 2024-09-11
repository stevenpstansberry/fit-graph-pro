/**
 * @fileoverview Component for visualizing the user's workout history in a heat map format.
 * 
 * @file src/components/workout-components/HeatMap.js
 * 
 * Provides a user interface to visualize workout frequency and intensity over time using a heat map.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {Array} props.workoutHistory - The complete workout history of the user.
 * @returns {React.Element} - The rendered HeatMap component.
 * 
 * @version 1.0.0
 * @updated By Steven Stansberry
 * 
 * The HeatMap component is designed to give users a visual overview of their workout habits
 * and trends over a selected period. It uses color intensity to represent the frequency or
 * intensity of workouts, helping users quickly identify periods of high or low activity.
 */

import React, { useMemo, useState } from 'react';
import { Box, Typography, Container, Snackbar, Alert, Tooltip, IconButton } from '@mui/material';
import Model from 'react-body-highlighter';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';


/**
 * Converts workout history data into the format required by react-body-highlighter.
 *
 * @param {Array} workoutHistory - The workout history array.
 * @returns {Array} - The formatted exercise data for the heat map.
 */
const convertWorkoutHistoryToHeatmapData = (workoutHistory) => {
  const exerciseDataMap = {};

  workoutHistory.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const { label, muscles } = exercise;

      if (!exerciseDataMap[label]) {
        exerciseDataMap[label] = { name: label, muscles: [], frequency: 0 };
      }

      // Increment frequency for each occurrence
      exerciseDataMap[label].frequency += 1;

      // Directly use the muscles array from exercise data or provide a default empty array if undefined
      exerciseDataMap[label].muscles = muscles || [];
    });
  });

  return Object.values(exerciseDataMap); // Convert the map to an array
};

/**
 * Calculates the percentage of workout frequency for each muscle group.
 *
 * @param {Array} workoutHistory - The workout history array.
 * @returns {Object} - The percentage data for each muscle group.
 */
const calculateMuscleGroupPercentages = (workoutHistory) => {
  const muscleFrequency = {
    Chest: 0,
    Shoulders: 0,
    Arms: 0,
    Core: 0,
    Legs: 0,
    Back: 0,
  };

  let totalExercises = 0;

  workoutHistory.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const { bodyPart } = exercise;
      if (muscleFrequency[bodyPart] !== undefined) {
        muscleFrequency[bodyPart] += 1;
        totalExercises += 1;
      }
    });
  });

  const musclePercentages = {};
  Object.keys(muscleFrequency).forEach((muscle) => {
    // Handle the case when there are no workouts to avoid NaN
    musclePercentages[muscle] = totalExercises > 0 ? ((muscleFrequency[muscle] / totalExercises) * 100).toFixed(2) : "0.00";
  });

  return musclePercentages;
};

/**
 * Component to render the gradient legend for the workout heat map.
 *
 * @component
 * @returns {React.Element} - The rendered GradientLegend component.
 */
const GradientLegend = () => {
  return (
    <Box sx={{ mt: 4, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Workout Intensity Legend
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 1,
          position: 'relative',
        }}
      >
        {/* Gradient Slider */}
        <Box
          sx={{
            height: 20,
            width: '100%',
            background: `linear-gradient(to right, #81d4fa, #4fc3f7, #29b6f6, #03a9f4, #039be5, #0288d1, #0277bd, #e57373, #ef5350, #f44336, #e53935, #d32f2f, #c62828, #b71c1c, #e65a5a)`,
            borderRadius: 10,
          }}
        />

        {/* Labels for Gradient */}
        <Typography variant="body2" sx={{ position: 'absolute', left: 0, transform: 'translateY(30px)' }}>
          Least Worked
        </Typography>
        <Typography variant="body2" sx={{ position: 'absolute', right: 0, transform: 'translateY(30px)' }}>
          Highly Worked
        </Typography>
      </Box>
    </Box>
  );
};

/**
 * HeatMap component for displaying a heat map of workout history.
 * Allows users to visualize their workout activity intensity and frequency over time.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {Array} props.workoutHistory - Full workout data of the user.
 * @returns {React.Element} - The rendered HeatMap component.
 */
const HeatMap = ({ workoutHistory }) => {
  const data = useMemo(() => convertWorkoutHistoryToHeatmapData(workoutHistory), [workoutHistory]);
  const musclePercentages = useMemo(() => calculateMuscleGroupPercentages(workoutHistory), [workoutHistory]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleClick = React.useCallback(
    ({ muscle, data }) => {
      const { exercises, frequency } = data;
  
      const message =
        frequency > 0
          ? `You clicked the ${muscle}! You've worked out this muscle ${frequency} times through the following exercises: ${JSON.stringify(exercises)}`
          : `You clicked the ${muscle}, but you haven't worked out this muscle yet.`;
  
      setSnackbarMessage(message);
      setSnackbarOpen(true);
    },
    [data]
  );
  

  // Handle closing the snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', 
        flexGrow: 1,
        minHeight: '100vh', 
        padding: 4,
      }}
    >
      {/* Main Content Container */}
      <Container sx={{ flexGrow: 1, display: 'flex' }}>
        {/* Heat Map Model Container */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Workout Heat Map
            </Typography>
            {/* Tooltip to explain the features */}
            <Tooltip
              title="This heatmap shows the intensity and frequency of your workouts. Click on a muscle group to see how often it was worked out."
              placement="right"
              arrow
              componentsProps={{
                  tooltip: {
                      sx: {
                          bgcolor: 'rgba(2, 136, 209, 0.8)', 
                      },
                  },
              }}
            >
              <IconButton>
                <HelpOutlineIcon sx={{ color: '#4fc3f7' }} /> {/* Light blue color for the tooltip icon */}
              </IconButton>
            </Tooltip>
          </Box>

          {/* Front and Posterior Models Side by Side */}
          <Box sx={{ display: 'flex', gap: 4 }}>
            {/* Front View Model */}
            <Model
              data={data}
              style={{ width: '20rem', padding: '2rem' }}
              onClick={handleClick}
              highlightedColors={highlightedColors}
            />

            {/* Posterior View Model */}
            <Model
              type='posterior'
              data={data}
              style={{ width: '20rem', padding: '2rem' }}
              onClick={handleClick}
              highlightedColors={highlightedColors}
            />
          </Box>

          {/* Message to prompt user to add workouts if none exist */}
          {workoutHistory.length === 0 && (
            <Typography variant="body1" sx={{ mt: 4 }}>
              No workouts found. Get started by adding one!
            </Typography>
          )}
          <GradientLegend />
        </Box>
  
        {/* Workout Statistics */}
        <Box sx={{ flex: 1, paddingLeft: 4 }}>
          <Typography variant="h5" gutterBottom>
            Workout Statistics (% by Muscle Group)
          </Typography>
          {Object.entries(musclePercentages).map(([muscle, percentage]) => (
            <Typography key={muscle} variant="body1">
              {muscle}: {percentage}%
            </Typography>
          ))}
        </Box>
      </Container>

      {/* Snackbar for Muscle Click Information */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const highlightedColors = [
  "#4fc3f7", // Light Sky Blue
  "#29b6f6", // Sky Blue
  "#03a9f4", // Medium Blue
  "#039be5", // Light Blue-Gray
  "#0288d1", // Medium Blue-Gray
  "#0277bd", // Darker Blue
  "#e57373", // Light Red
  "#ef5350", // Medium Light Red
  "#f44336", // Medium Red
  "#e53935", // Medium Dark Red
  "#d32f2f", // Dark Red
  "#c62828", // Darker Red
  "#b71c1c", // Very Dark Red
  "#e65a5a", // Intense Red - Highly worked (interpolated value)
  "#db2f2f", // Passionate Red - Most worked
];

export default HeatMap;
