import React, { useState } from "react";
import { Box, Card, CardContent, TextField, Typography, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const ExerciseSubcard = ({ exercise, index, removeExercise }) => {
  const [sets, setSets] = useState([{ weight: '', reps: '' }]);

  const handleAddSet = () => {
    setSets([...sets, { weight: '', reps: '' }]);
  };

  const handleSetChange = (setIndex, field, value) => {
    const updatedSets = sets.map((set, i) => 
      i === setIndex ? { ...set, [field]: value } : set
    );
    setSets(updatedSets);
  };

  const handleRemoveSet = (setIndex) => {
    const updatedSets = sets.filter((_, i) => i !== setIndex);
    setSets(updatedSets);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            {exercise.label} - {exercise.bodyPart}
          </Typography>
          <IconButton edge='end' onClick={handleAddSet} sx={{ color: 'primary.main' }}>
            <AddIcon />
            <Typography variant="body2" sx={{ marginLeft: 0.5 }}>Add Set</Typography>
          </IconButton>
        </Box>

        {sets.map((set, setIndex) => (
          <Box key={setIndex} sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Typography>
            Set {setIndex + 1}

            </Typography>
            <TextField
              name="weight"
              label="Weight"
              variant="outlined"
              value={set.weight}
              onChange={(e) => handleSetChange(setIndex, 'weight', e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              name="reps"
              label="Reps"
              variant="outlined"
              value={set.reps}
              onChange={(e) => handleSetChange(setIndex, 'reps', e.target.value)}
              sx={{ flex: 1 }}
            />
            <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveSet(setIndex)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <IconButton edge="end" aria-label="delete" onClick={() => removeExercise(index)} sx={{ mt: 2 }}>
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default ExerciseSubcard;
