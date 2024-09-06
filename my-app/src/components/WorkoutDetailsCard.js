/**
 * @fileoverview Component for displaying detailed information of a workout.
 *
 * @file src/components/WorkoutDetailsCard.js
 *
 * Provides a user interface to show detailed information about a workout, including exercises and sets.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.workout - The workout object containing date, type, exercises, etc.
 * @returns {React.Element} - The rendered WorkoutDetailsCard component.
 *
 * @version 1.0.0
 * @updated By Steven Stansberry
 */

// Import necessary components and hooks
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

/**
 * WorkoutDetailsCard component for displaying detailed information about a workout.
 * Shows the date, workout type, and exercises performed with their respective sets and reps.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.workout - The workout object containing date, type, exercises, etc.
 * @returns {React.Element} - The rendered WorkoutDetailsCard component.
 */
const WorkoutDetailsCard = ({ workout }) => {
  return (
    <Card
      sx={{
        mb: 2,
        width: '250px', // Reduced width
        border: '1px solid #ccc',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Lighter shadow
        borderRadius: '8px',
        overflow: 'hidden',
        padding: 1, // Reduced padding
      }}
    >
      <CardContent sx={{ padding: '8px' }}> {/* Reduced padding */}
        <Typography variant="h6" component="div" sx={{ fontSize: '1rem' }}> {/* Smaller font size */}
          {new Date(workout.date).toDateString()}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.85rem' }}> {/* Smaller font size */}
          {workout.type || "Default Workout"}
        </Typography>
        <Box sx={{ mt: 1 }}>
          {workout.exercises.map((exercise, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontSize: '0.9rem' }}> {/* Smaller font size */}
                {exercise.label} - {exercise.bodyPart}
              </Typography>
              {exercise.sets.map((set, i) => (
                <Typography key={i} variant="body2" sx={{ fontSize: '0.75rem' }}> {/* Smaller font size */}
                  Set {i + 1}: {set.weight} lbs x {set.reps} reps
                </Typography>
              ))}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default WorkoutDetailsCard;
