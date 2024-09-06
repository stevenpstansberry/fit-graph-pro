/**
 * @fileoverview Component for visualizing the user's workout history in a heat map format.
 * 
 * @file src/components/HeatMap.js
 * 
 * Provides a user interface to visualize workout frequency and intensity over time using a heat map.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {Array} props.workoutHistory - The complete workout history of the user.
 * @returns {React.Element} - The rendered HeatMap component.
 * 
 * @version 1.0.0
 * @author Steven Stansberry
 * 
 * The HeatMap component is designed to give users a visual overview of their workout habits
 * and trends over a selected period. It uses color intensity to represent the frequency or
 * intensity of workouts, helping users quickly identify periods of high or low activity.
 */

import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import Model from 'react-body-highlighter';

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

  const handleClick = React.useCallback(({ muscle, data }) => {
    const { exercises, frequency } = data;

    alert(`You clicked the ${muscle}! You've worked out this muscle ${frequency} times through the following exercises: ${JSON.stringify(exercises)}`);
  }, [data]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Workout Heat Map
      </Typography>
      <Model
        data={data}
        style={{ width: '20rem', padding: '5rem' }}
        onClick={handleClick}
      />
    </Box>
  );
};

export default HeatMap;
