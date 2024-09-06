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

import React, { useState, useEffect } from 'react';
import BodyHighlighter from 'react-body-highlighter'; 
import { Container, Typography, Box } from '@mui/material';

// Function to categorize exercises into muscle groups
const categorizeExercises = (workoutHistory) => {
    const muscleGroups = {
      chest: ['Chest'],
      back: ['Back'],
      arms: ['Arms'],
      shoulders: ['Shoulders'],
      abs: ['Abs'],
      legs: ['Legs'],
      forearms: ['Forearms'],
    };
  
    const muscleUsage = {
      chest: 0,
      back: 0,
      arms: 0,
      shoulders: 0,
      abs: 0,
      legs: 0,
      forearms: 0,
    };
  
    // Iterate through each workout in the workout history
    workoutHistory.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const bodyPart = exercise.bodyPart;
  
        // Match the exercise bodyPart to a muscle group and increment usage
        for (const [group, parts] of Object.entries(muscleGroups)) {
          if (parts.includes(bodyPart)) {
            muscleUsage[group] += 1; // Increment the frequency
          }
        }
      });
    });
  
    console.log('Muscle Usage Frequency:', muscleUsage); // Debugging: Log the muscle frequency counts
    return muscleUsage;
  };
  
  // HeatMap Component
  const HeatMap = ({ workoutHistory }) => {
    const [highlightedMuscles, setHighlightedMuscles] = useState({});
  
    useEffect(() => {
      if (workoutHistory && workoutHistory.length > 0) {
        const muscleUsage = calculateMuscleUsage(workoutHistory);
        setHighlightedMuscles(muscleUsage);
  
        // Print the muscle usage to the console
        console.log("Muscle Usage per Muscle Group (Normalized):", muscleUsage);
      }
    }, [workoutHistory]);
  
    // Function to calculate muscle usage from workout data
    const calculateMuscleUsage = (workouts) => {
      const muscleFrequency = categorizeExercises(workouts);
  
      const maxFrequency = Math.max(...Object.values(muscleFrequency), 1); // Default to 1 to prevent division by zero
      console.log('Max Frequency:', maxFrequency); // Debugging: Log max frequency
  
      const normalizedMuscles = {};
  
      for (const muscle in muscleFrequency) {
        const intensity = muscleFrequency[muscle] / maxFrequency;
        normalizedMuscles[muscle] = getColorFromIntensity(intensity);
      }
  
      return normalizedMuscles;
    };
  
    // Function to map intensity to color (blue to red)
    const getColorFromIntensity = (intensity) => {
      if (isNaN(intensity)) intensity = 0; // Ensure intensity is a number
      const r = Math.min(255, 50 + intensity * 200);
      const g = Math.max(0, 150 - intensity * 150);
      const b = Math.max(0, 255 - intensity * 255);
      return `rgb(${r},${g},${b})`; // Creates a color between blue (low intensity) and red (high intensity)
    };
  
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Muscle Group Heat Map
        </Typography>
        <Box sx={{ maxWidth: '500px', margin: '0 auto' }}>
          <BodyHighlighter
            highlighted={highlightedMuscles}
            colors={{
              arms: highlightedMuscles.arms || '#808080', // Default to gray if no data
              chest: highlightedMuscles.chest || '#808080',
              core: highlightedMuscles.core || '#808080',
              shoulders: highlightedMuscles.shoulders || '#808080',
              forearms: highlightedMuscles.forearms || '#808080',
              glutes: highlightedMuscles.glutes || '#808080',
              legs: highlightedMuscles.legs || '#808080',
              back: highlightedMuscles.back || '#808080',
              'lower-back': highlightedMuscles['lower-back'] || '#808080',
            }}
            style={{ width: '100%', height: 'auto' }}
          />
        </Box>
      </Container>
    );
  };
  
  export default HeatMap;