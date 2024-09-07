// src/components/ExerciseSubCard.js


import React from "react";
import { Card, CardContent, Box, TextField, Button, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function ExerciseSubcard({ exercise, index, removeExercise, updateExerciseSets, allowWeightAndReps, mode }) {
  const handleSetChange = (setIndex, key, value) => {
    const newSets = exercise.sets.map((set, i) =>
      i === setIndex ? { ...set, [key]: value } : set
    );
    updateExerciseSets(index, newSets); // Update sets in the parent component
  };

  const addSet = () => {
    const newSets = [...exercise.sets, { weight: "", reps: "" }];
    updateExerciseSets(index, newSets); // Add new set to the sets array
  };

  const handleRemoveSet = (setIndex) => {
    const newSets = exercise.sets.filter((_, i) => i !== setIndex);
    updateExerciseSets(index, newSets); // Remove the set from the sets array
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            {exercise.label} - {exercise.bodyPart}
          </Typography>
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
    </Card>
  );
}

export default ExerciseSubcard;