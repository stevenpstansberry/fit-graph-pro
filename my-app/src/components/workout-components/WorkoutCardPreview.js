/**
 * @fileoverview Component for displaying a preview of a workout in a collapsible card format.
 * 
 * @file src/components/workout-components/WorkoutCardPreview.js
 * 
 * Provides a user interface to display a brief overview of a workout, including the date and type. 
 * Users can expand the card to view detailed information about exercises, sets, and reps. 
 * It also provides a delete option to remove the workout.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.workout - The workout object containing details such as date, type, and exercises.
 * @param {Function} props.onDelete - Callback function to handle the deletion of the workout.
 * @returns {React.Element} - The rendered WorkoutCardPreview component.
 * 
 * @version 1.0.0
 * @author Steven Stansberry
 */


import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, Collapse, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function WorkoutCardPreview({ workout, onDelete }) { // Accept onDelete as a prop
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        mb: 2,
        width: '300px',
        border: '1px solid #ccc',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'transform 0.2s ease-in-out',
        position: 'relative', // Ensure relative positioning for absolute positioning of delete icon
        '&:hover': {
          transform: 'scale(1.02)'
        }
      }}
    >
      <CardContent>
        <Typography variant="h6" component="div">
          {workout.date.toDateString()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {workout.type || "Default Workout"}
        </Typography>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 1 }}>
            {workout.exercises.map((exercise, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="subtitle1">
                  {exercise.label} - {exercise.bodyPart}
                </Typography>
                {exercise.sets.map((set, i) => (
                  <Typography key={i} variant="body2">
                    Set {i + 1}: {set.weight} lbs x {set.reps} reps
                  </Typography>
                ))}
              </Box>
            ))}
          </Box>
        </Collapse>
        <Button onClick={handleExpandClick} sx={{ mt: 1 }}>
          {expanded ? "Show Less" : "Show More"}
        </Button>
      </CardContent>

      {/* Trashcan Icon for Deletion */}
      <IconButton
        onClick={() => onDelete(workout.id)} // Call the onDelete prop with the workout id
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 8,
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Card>
  );
}

export default WorkoutCardPreview;
