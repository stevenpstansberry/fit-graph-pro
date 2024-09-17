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
import { Modal, Card, CardContent, Typography, Box } from '@mui/material';

/**
 * WorkoutCongratsCard component for displaying a congratulatory message after a workout is created.
 * Shows a personalized message with the workout date and type.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.workout - The workout object containing date and type to personalize the message.
 * @returns {React.Element} - The rendered WorkoutCongratsCard component.
 */
const WorkoutCongratsCard = ({open, onClose, workout }) => {
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
            maxWidth: 500,
            minWidth: 500,
            maxHeight: 300,
            minHeight: 300,
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
        <CardContent sx={{ padding: '16px' }}>
            <Typography variant="h5" component="div" sx={{ fontSize: '1.2rem', color: '#388e3c', mb: 1 }}>
            Congratulations!
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ fontSize: '0.95rem', mb: 2 }}> 
            You've completed a {(workout.type) + " workout" || "workout"} on {new Date(workout.date).toDateString()}!
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#2e7d32' }}>
            Keep up the great work and stay strong!
            </Typography>
            <Box sx={{ mt: 2 }}>
            🎉🏋️‍♂️💪
            </Box>
        </CardContent>
        </Card>
    </Modal>
  );
};

export default WorkoutCongratsCard;
