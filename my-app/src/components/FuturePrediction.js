/**
 * @fileoverview Component for predicting future performance based on user goals.
 * 
 * @file src/components/FuturePrediction.js
 * 
 * Provides a user interface to input target goals for weight and timeline and predict future workout performance.
 * 
 * @component
 * @returns {React.Element} - The rendered FuturePrediction component.
 * 
 * @version 1.0.0
 * @author Steven Stansberry
 */

import React, { useState } from 'react';
import {
  Box, FormControl, InputLabel, Select, MenuItem, TextField, Button, Typography, Container
} from '@mui/material';

const FuturePrediction = ({ exerciseLabels, onPredict }) => {
  const [selectedExercise, setSelectedExercise] = useState(''); // Selected exercise for prediction
  const [goalWeight, setGoalWeight] = useState(''); // User input for goal weight
  const [goalTimeline, setGoalTimeline] = useState(''); // User input for timeline

  /**
   * Handles form submission to predict future performance.
   * 
   * @function handlePredictionSubmit
   */
  const handlePredictionSubmit = () => {
    console.log(`Predicting for goal weight: ${goalWeight} lbs in ${goalTimeline} days.`);
    if (onPredict) onPredict(selectedExercise, goalWeight, goalTimeline);
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Predict Future Performance
      </Typography>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="exercise-select-label">Exercise</InputLabel>
        <Select
          labelId="exercise-select-label"
          id="exercise-select"
          value={selectedExercise}
          label="Exercise"
          onChange={(e) => setSelectedExercise(e.target.value)}
        >
          {exerciseLabels.map((label) => (
            <MenuItem key={label} value={label}>{label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Goal Weight (lbs)"
        type="number"
        value={goalWeight}
        onChange={(e) => setGoalWeight(e.target.value)}
        sx={{ m: 1 }}
      />
      <TextField
        label="Timeline (days)"
        type="number"
        value={goalTimeline}
        onChange={(e) => setGoalTimeline(e.target.value)}
        sx={{ m: 1 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handlePredictionSubmit}
        sx={{ m: 1 }}
      >
        Predict
      </Button>
    </Container>
  );
};

export default FuturePrediction;
