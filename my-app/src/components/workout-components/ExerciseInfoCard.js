/**
 * @fileoverview Component the includes a description of the exercise, a how to guide, and an animation of the exercise.
 *
 * @file src/components/workout-components/ExerciseInfoCard.js
 *
 * Utulizes the ExerciseDB API for information
 *
 * @version 1.0.0
 * @author Steven Stansberry
 */

import React, { useState, useEffect } from "react";
import { Card, Modal } from "@mui/material";


/**
 * Component for rendering and managing an exercise card within a workout.
 * 
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.open - Flag indicating whether the modal is open.
 * @param {function} props.onClose - Function to close the modal.
 * @param {Object} props.exercise - The exercise object containing label, bodyPart, and sets. 
 * @returns {React.Element} - The rendered ExerciseInfoCard component.
 */
function ExerciseInfoCard({ open, onClose, exercise }) {
 

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
          maxWidth: 850,
          minWidth: 850,
          maxHeight: 500,
          minHeight: 500,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 12,
          p: 4,
          overflowY: 'auto',
        }}
      >
      </Card>
    </Modal>
  );
}

export default ExerciseInfoCard;

