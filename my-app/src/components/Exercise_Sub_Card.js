import React from "react";
import { Card, CardContent, Typography, IconButton, TextField, Box } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const ExerciseSubcard = ({ exercise, index, removeExercise, updateExercise }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateExercise(index, { ...exercise, [name]: value });
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {exercise.label} - {exercise.bodyPart}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            name="sets"
            label="Sets"
            variant="outlined"
            value={exercise.sets}
            onChange={handleChange}
          />
          <TextField
            name="weight"
            label="Weight"
            variant="outlined"
            value={exercise.weight}
            onChange={handleChange}
          />
          <TextField
            name="time"
            label="Time"
            variant="outlined"
            value={exercise.time}
            onChange={handleChange}
          />
        </Box>
        <IconButton edge="end" aria-label="delete" onClick={() => removeExercise(index)} sx={{ mt: 2 }}>
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default ExerciseSubcard;
