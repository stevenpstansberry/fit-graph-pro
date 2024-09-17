/**
 * @fileoverview Component for displaying a congratulatory message after workout creation.
 *
 * @file src/components/workout-components/WorkoutCongratsCard.js
 *
 * Provides a user interface to show a congratulatory message to the user upon successfully creating a workout.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.workout - The workout object containing date and type to personalize the message.
 * @returns {React.Element} - The rendered WorkoutCongratsCard component.
 *
 * @version 1.0.0
 * @created By Steven Stansberry
 */

import React from 'react';
import { Modal, Card, CardContent, Typography, Box, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * WorkoutCongratsCard component for displaying a congratulatory message after a workout is created.
 * Shows a personalized message with the workout date and type.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.open - The state of the modal to display the card.
 * @param {Function} props.onClose - The function to close the modal and hide the card.
 * @param {Object} props.workout - The workout object containing date and type to personalize the message.
 * @param {Object} props.user - The user object containing user details like workoutCount.
 * @returns {React.Element} - The rendered WorkoutCongratsCard component.
 */
const WorkoutCongratsCard = ({open, onClose, workout, user }) => {

    if (workout) {
    // Calculate total weight lifted
  const totalWeightLifted = workout.exercises.reduce((total, exercise) => {
    return total + exercise.sets.reduce((setTotal, set) => setTotal + parseFloat(set.weight || 0) * parseInt(set.reps || 0), 0);
  }, 0);

  // Calculate total number of sets and reps
  const totalSets = workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  const totalReps = workout.exercises.reduce((total, exercise) => {
    return total + exercise.sets.reduce((setTotal, set) => setTotal + parseInt(set.reps || 0), 0);
  }, 0);

  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{
        style: { backgroundColor: 'rgba(0,0,0,0.5)' },
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          minWidth: 600,
          maxHeight: 450,
          minHeight: 450,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 12,
          p: 4,
          overflowY: 'auto',
          textAlign: 'center',
        }}
      >
        {/* Close Button at the top left corner */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <CardContent sx={{ padding: '16px' }}>
          <Typography variant="h5" component="div" sx={{ fontSize: '1.2rem', color: '#388e3c', mb: 1 }}>
            Congratulations!
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ fontSize: '0.95rem', mb: 2 }}>
            You've completed a {(workout.type) + " workout" || "workout"} on {new Date(workout.date).toDateString()}!
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#2e7d32', mb: 2 }}>
            Keep up the great work and stay strong!
          </Typography>
          {/* Display Workout Count */}
          {user && user.workoutCount !== undefined && (
            <Typography variant="body2" sx={{ fontSize: '0.9rem', color: '#2e7d32', mb: 2 }}>
              Total Workouts Completed: {user.workoutCount}
            </Typography>
          )}
          <Divider sx={{ my: 2 }} />

          {/* Workout Statistics */}
          <Typography variant="h6" component="div" sx={{ fontSize: '1rem', color: '#388e3c', mb: 1 }}>
            Workout Summary
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.9rem', mb: 1 }}>
            Total Weight Lifted: {totalWeightLifted} lbs
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.9rem', mb: 1 }}>
            Total Sets: {totalSets}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.9rem', mb: 1 }}>
            Total Reps: {totalReps}
          </Typography>

          {/* List of Exercises */}
          <Box sx={{ mt: 2, textAlign: 'left' }}>
            <Typography variant="subtitle1" sx={{ fontSize: '1rem', color: '#2e7d32', mb: 1 }}>
              Exercises:
            </Typography>
            {workout.exercises.map((exercise, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                  {exercise.displayLabel} - {exercise.displayBodyPart}
                </Typography>
                {exercise.sets.map((set, i) => (
                  <Typography key={i} variant="body2" sx={{ fontSize: '0.8rem' }}>
                    Set {i + 1}: {set.weight} lbs x {set.reps} reps
                  </Typography>
                ))}
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 2 }}>
            🎉🏋️‍♂️💪
          </Box>
        </CardContent>
      </Card>
    </Modal>
  );
}
};

export default WorkoutCongratsCard;
