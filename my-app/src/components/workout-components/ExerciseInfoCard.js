/**
 * @fileoverview Component that includes a description of the exercise, a how-to guide, and an animation of the exercise.
 *
 * @file src/components/workout-components/ExerciseInfoCard.js
 *
 * Utilizes the ExerciseDB API for information.
 *
 * @version 1.0.0
 * @author Steven Stansberry
 */

import React, { useState, useEffect } from "react";
import { Card, Modal, Typography, CircularProgress, Box, List, ListItem, ListItemText } from "@mui/material";
import { getExerciseInfo } from "../../services/ExerciseDBAPIServices";
import { toTitleCase } from "./common/util";

/**
 * Component for rendering and managing an exercise card within a workout.
 * 
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.open - Flag indicating whether the modal is open.
 * @param {function} props.onClose - Function to close the modal.
 * @param {Object} props.exercise - The exercise object containing label, body part, and muscles worked.
 * @returns {React.Element} - The rendered ExerciseInfoCard component.
 */
function ExerciseInfoCard({ open, onClose, exercise }) {
  const [exerciseData, setExerciseData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch exercise information when the modal is opened
  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        setLoading(true); // Ensure loading state is set
        const data = await getExerciseInfo(exercise.label.toLowerCase());
        if (data && data.length > 0) {
          setExerciseData(data[0]); // Use the first result from the array
        } else {
          setExerciseData(null); // No data found, set to null
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch exercise info:", error);
        setLoading(false);
      }
    };

    if (open) {
      fetchExerciseData();
    }
  }, [open, exercise.label]);

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
          maxWidth: 750,
          minWidth: 750,
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
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : exerciseData ? (
          <>
            <Typography variant="h4" gutterBottom>
              {toTitleCase(exerciseData.name)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Body Part:</strong> {toTitleCase(exerciseData.bodyPart)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Target Muscle:</strong> {toTitleCase(exerciseData.target)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Equipment:</strong> {toTitleCase(exerciseData.equipment)}
            </Typography>
            {exerciseData.secondaryMuscles && exerciseData.secondaryMuscles.length > 0 && (
              <Typography variant="body1" gutterBottom>
                <strong>Secondary Muscles:</strong> {exerciseData.secondaryMuscles.map(toTitleCase).join(', ')}
              </Typography>
            )}
            <img
              src={exerciseData.gifUrl}
              alt={exerciseData.name}
              style={{ maxWidth: '100%', height: 'auto', marginTop: '20px', marginBottom: '20px' }}
            />
            {exerciseData.instructions && exerciseData.instructions.length > 0 ? (
              <>
                <Typography variant="h6" gutterBottom>
                  How to Perform:
                </Typography>
                <List>
                  {exerciseData.instructions.map((step, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={`${index + 1}. ${step}`} />
                    </ListItem>
                  ))}
                </List>
              </>
            ) : (
              <Typography variant="body1" gutterBottom>
                No instructions available.
              </Typography>
            )}
          </>
        ) : (
          <Typography variant="body1" color="error">
            Failed to load exercise information.
          </Typography>
        )}
      </Card>
    </Modal>
  );
}

export default ExerciseInfoCard;