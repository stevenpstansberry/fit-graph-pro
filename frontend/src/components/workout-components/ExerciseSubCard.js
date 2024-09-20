/**
 * @fileoverview Component for managing and displaying a specific exercise's details within a workout, including sets, weights, and reps.
 *
 * @file src/components/workout-components/ExerciseSubCard.js
 *
 * Provides the `ExerciseSubcard` component, which is responsible for displaying the exercise label, body part, sets, and inputs for weights and reps.
 * Allows users to add, update, and remove sets, and conditionally display fields based on mode and props.
 *
 * @version 1.0.0
 * @author Steven Stansberry
 */

import React, { useState } from "react";
import { Card, CardContent, Box, TextField, Button, Typography, IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ExerciseInfoCard from "./ExerciseInfoCard";

/**
 * Component for rendering and managing an exercise card within a workout.
 * 
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.exercise - The exercise object containing label, bodyPart, and sets.
 * @param {number} props.index - The index of the exercise in the parent component's state.
 * @param {function} props.removeExercise - Function to remove the exercise from the parent component's state.
 * @param {function} props.updateExerciseSets - Function to update the sets of an exercise in the parent component's state.
 * @param {boolean} props.allowWeightAndReps - Flag indicating whether to show weight and reps input fields.
 * @param {string} props.mode - Mode indicating how the component should behave (e.g., "addSplit").
 * @param {function} props.showSnackbar - Function to display a snackbar message in Workout Page.
 * @returns {React.Element} - The rendered ExerciseSubcard component.
 */
function ExerciseSubCard({ exercise, index, removeExercise, updateExerciseSets, allowWeightAndReps, mode, showSnackbar }) {

  const [isInfoCardOpen, setIsInfoCardOpen] = useState(false);
  

  /**
   * Closes the exercise info card modal.
   */
    const handleClose = () => {
      setIsInfoCardOpen(false);
    };

  /**
   * Opens the exercise info card modal.
   * 
   **/
    const handleOpen = () => {
      console.log("EXERCISE:", exercise)
      setIsInfoCardOpen(true);
    }


  /**
   * Handles the change in input for weight or reps in a specific set.
   * Prevents negative and zero values and limits input to 4 digits.
   * 
   * @function handleSetChange
   * @param {number} setIndex - The index of the set being modified.
   * @param {string} key - The key ('weight' or 'reps') being modified.
   * @param {string} value - The new value for the specified key.
   */
  const handleSetChange = (setIndex, key, value) => {
    // Validate to ensure only positive numbers up to 4 digits are accepted
    if (value === '' || (Number(value) > 0 && !value.startsWith('0') && value.length <= 4)) {
      const newSets = exercise.sets.map((set, i) =>
        i === setIndex ? { ...set, [key]: value } : set
      );
      updateExerciseSets(index, newSets); // Update sets in the parent component
    } else {
      // Set specific error messages based on the validation failure
      if (value.length > 4) {
        showSnackbar('No more than 4 digits allowed.', 'error');
      } else {
        showSnackbar('Only positive values greater than 0 are accepted.', 'error');
        }
    }
  };


  /**
   * Adds a new set to the exercise.
   * Ensures that no more than 9 sets can be added.
   */
  const addSet = () => {
    if (exercise.sets.length >= 9) {
      showSnackbar('You cannot add more than 9 sets.', 'error');
      return;
    }
    const newSets = [...exercise.sets, { weight: "", reps: "" }];
    updateExerciseSets(index, newSets); // Add new set to the sets array
    showSnackbar('Set added successfully.', 'success');
  };

  /**
   * Removes a specific set from the exercise.
   * 
   * @function handleRemoveSet
   * @param {number} setIndex - The index of the set to be removed.
   */
  const handleRemoveSet = (setIndex) => {
    const newSets = exercise.sets.filter((_, i) => i !== setIndex);
    updateExerciseSets(index, newSets); // Remove the set from the sets array
    showSnackbar('Set removed successfully.', 'success');
  };


  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Display the exercise label and body part */}
          <Typography variant="h6" component="div">
            {exercise.displayLabel} - {exercise.displayBodyPart} - <Button onClick={handleOpen}>Info</Button>
          </Typography>

          {/* Button for adding sets and icon for deleting the exercise */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button onClick={addSet} startIcon={<AddIcon />} variant="outlined">
              Add Set
            </Button>
            {/* Trash can icon for deleting the entire exercise */}
            <IconButton edge="end" aria-label="delete" onClick={() => removeExercise(index)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Display each set with input fields for weight and reps */}
        {exercise.sets.map((set, setIndex) => (
          <Box key={setIndex} sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
            <Typography>Set {setIndex + 1}</Typography>

            {/* Conditionally render the weight field */}
            {allowWeightAndReps && (
              <TextField
                name="weight"
                label="Weight"
                variant="outlined"
                value={set.weight}
                onChange={(e) => handleSetChange(setIndex, "weight", e.target.value)}
                type='number'
                inputProps={{ min: 1, maxLength: 4 }} // Ensure minimum value of 1 and maximum of 4 digits
                sx={{ flex: 1 }}
              />
            )}

            {/* Conditionally render the reps field */}
            {allowWeightAndReps && (
              <TextField
                name="reps"
                label="Reps"
                variant="outlined"
                value={set.reps}
                onChange={(e) => handleSetChange(setIndex, "reps", e.target.value)}
                type='number'
                inputProps={{ min: 1, maxLength: 4 }} // Ensure minimum value of 1 and maximum of 4 digits
                sx={{ flex: 1 }}
              />
            )}

            {/* Position the trash can icon conditionally based on the mode */}
            <IconButton 
              edge={mode === "addSplit" ? "start" : "end"} 
              aria-label="delete" 
              onClick={() => handleRemoveSet(setIndex)} 
              sx={{ ml: mode === "addSplit" ? "auto" : 0 }} // Align to the inner side if in addSplit mode
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </CardContent>
      <ExerciseInfoCard open={isInfoCardOpen} onClose={handleClose} exercise={exercise} />
    </Card>
  );
}

export default ExerciseSubCard;
