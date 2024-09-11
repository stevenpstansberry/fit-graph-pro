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

import React, { useMemo } from 'react';
import { Box, Typography, Container, Stack  } from '@mui/material';
import Model from 'react-body-highlighter';

//TODO revise workout statisitcs
/**
 * Maps body parts to muscles in the format expected by react-body-highlighter.
 */
const muscleMap = {
  Chest: ['chest'],
  Shoulders: ['front-deltoids', 'back-deltoids'],
  Arms: ['biceps', 'triceps', 'forearm'],
  Abs: ['abs', 'obliques'],
  Legs: ['quadriceps', 'hamstring', 'calves', 'adductor', 'abductors', 'gluteal'],
  Back: ['trapezius', 'upper-back', 'lower-back'],
  Forearms: ['forearm'],
};

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
      const { label, bodyPart } = exercise;

      if (!exerciseDataMap[label]) {
        exerciseDataMap[label] = { name: label, muscles: [], frequency: 0 };
      }

      // Increment frequency for each occurrence
      exerciseDataMap[label].frequency += 1;

      // Map body part to muscles
      if (muscleMap[bodyPart]) {
        exerciseDataMap[label].muscles = muscleMap[bodyPart];
      }
    });
  });

  return Object.values(exerciseDataMap); // Convert the map to an array
};

/**
 * Calculates the percentage of workout frequency for each body part.
 *
 * @param {Array} workoutHistory - The workout history array.
 * @returns {Object} - The percentage data for each muscle group.
 */
const calculateMuscleGroupPercentages = (workoutHistory) => {
  const muscleFrequency = {
    Chest: 0,
    Shoulders: 0,
    Arms: 0,
    Abs: 0,
    Legs: 0,
    Back: 0,
    Forearms: 0,
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
            background: `linear-gradient(to right, #b3e5fc, #81d4fa, #4fc3f7, #29b6f6, #03a9f4, #039be5, #0288d1, #0277bd, #e57373, #ef5350, #f44336, #e53935, #d32f2f, #c62828, #b71c1c, #e65a5a, #db2f2f)`,
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

  const handleClick = React.useCallback(({ muscle, data }) => {
    const { exercises, frequency } = data;

    alert(`You clicked the ${muscle}! You've worked out this muscle ${frequency} times through the following exercises: ${JSON.stringify(exercises)}`);
  }, [data]);

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
          <Typography variant="h4" gutterBottom>
            Workout Heat Map
          </Typography>
          
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
    </Box>
  );
};


const highlightedColors = [
  "#b3e5fc", // Light Blue - Least worked
  "#81d4fa", // Slightly more blue
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
