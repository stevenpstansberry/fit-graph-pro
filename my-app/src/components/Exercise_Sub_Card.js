import React from "react";
import { Card, CardContent, Box, TextField, Button, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function ExerciseSubcard({ exercise, index, removeExercise, updateExerciseSets }) {
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

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            {exercise.label} - {exercise.bodyPart}
          </Typography>
          <Button onClick={addSet} startIcon={<AddIcon />} variant="outlined">
            Add Set
          </Button>
        </Box>

        {exercise.sets.map((set, setIndex) => (
          <Box key={setIndex} sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Typography>Set {setIndex + 1}</Typography>
            <TextField
              name="weight"
              label="Weight"
              variant="outlined"
              value={set.weight}
              onChange={(e) => handleSetChange(setIndex, "weight", e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              name="reps"
              label="Reps"
              variant="outlined"
              value={set.reps}
              onChange={(e) => handleSetChange(setIndex, "reps", e.target.value)}
              sx={{ flex: 1 }}
            />
          </Box>
        ))}
        <IconButton edge="end" aria-label="delete" onClick={() => removeExercise(index)} sx={{ mt: 2 }}>
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
}

export default ExerciseSubcard;
