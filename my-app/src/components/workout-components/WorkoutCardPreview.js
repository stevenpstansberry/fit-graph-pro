/**
 * @fileoverview Component for displaying a preview of a workout in a collapsible card format.
 * 
 * @file src/components/workout-components/WorkoutCardPreview.js
 * 
 * Provides a user interface to display a brief overview of a workout, including the date and type. 
 * Users can expand the card to view detailed information about exercises, sets, and reps. 
 * It also provides a delete option to remove the workout as well as an edit option
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
import {
  Card, CardContent, Typography, Box, Button, Collapse, IconButton, Menu, MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function WorkoutCardPreview({ workout, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget); // Set the anchor element for the menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleDeleteClick = () => {
    onDelete(workout.id); // Trigger the onDelete callback
    handleMenuClose(); // Close the menu after deleting
  };

  const handleEditClick = () => {
    onEdit(workout); // Trigger the onEdit callback
    handleMenuClose(); // Close the menu after editing
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
        position: 'relative', // Ensure relative positioning for absolute positioning of menu button
        '&:hover': {
          transform: 'scale(1.02)'
        }
      }}
    >
      <CardContent>
        {/* More Options Menu Button - Moved to Top Right */}
        <IconButton
          onClick={handleMenuClick} // Opens the menu
          sx={{
            position: 'absolute',
            top: 8,
            right: 8, // Place in the top right
          }}
        >
          <MoreVertIcon />
        </IconButton>

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
                  {exercise.displayLabel} - {exercise.displayBodyPart}
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

      {/* Menu for More Options */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>Edit Workout</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete Workout</MenuItem>
      </Menu>
    </Card>
  );
}

export default WorkoutCardPreview;