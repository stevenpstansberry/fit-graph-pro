import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, Collapse } from '@mui/material';

function WorkoutCard({ workout }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        mb: 2,
        width: '300px', // Fixed width for each card
        border: '1px solid #ccc', // Distinct outline
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Slight shadow for depth
        borderRadius: '8px', // Rounded corners
        overflow: 'hidden', // Ensure contents are contained
        transition: 'transform 0.2s ease-in-out', // Smooth transition on hover
        '&:hover': {
          transform: 'scale(1.02)' // Slightly scale up on hover
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
    </Card>
  );
}

export default WorkoutCard;
