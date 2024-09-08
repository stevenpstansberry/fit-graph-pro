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
import { Box, Typography, Container } from '@mui/material';
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
    musclePercentages[muscle] = ((muscleFrequency[muscle] / totalExercises) * 100).toFixed(2);
  });

  return musclePercentages;
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
        flexDirection: 'column', // Ensure vertical stacking
        flexGrow: 1,
        minHeight: '100vh', // Ensure the height covers the entire viewport
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
            />
  
            {/* Posterior View Model */}
            <Model
              type='posterior'
              data={data}
              style={{ width: '20rem', padding: '2rem' }}
              onClick={handleClick}
            />
          </Box>
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

export default HeatMap;
