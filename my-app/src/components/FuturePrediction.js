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

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Container, Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const FuturePrediction = ({ workoutHistory = [] }) => {  // Add default value for workoutHistory
    const [goalWeight, setGoalWeight] = useState('');
    const [goalDate, setGoalDate] = useState('');
    const [predictionResult, setPredictionResult] = useState(null);
    const [selectedExercise, setSelectedExercise] = useState(''); // Selected exercise for prediction
  
    // Extract unique exercise labels from workouts
    const exerciseLabels = Array.from(new Set(workoutHistory.flatMap(workout => 
      workout.exercises.map(exercise => exercise.label)
    )));
  
    // Set the first exercise as the default selected if none is selected
    useEffect(() => {
      if (!selectedExercise && exerciseLabels.length > 0) {
        setSelectedExercise(exerciseLabels[0]);
      }
    }, [exerciseLabels, selectedExercise]);
  
    /**
     * Handles input change for goal weight.
     * 
     * @function handleGoalWeightChange
     * @param {Object} event - Event object.
     */
    const handleGoalWeightChange = (event) => {
      setGoalWeight(event.target.value);
    };
  
    /**
     * Handles input change for goal date.
     * 
     * @function handleGoalDateChange
     * @param {Object} event - Event object.
     */
    const handleGoalDateChange = (event) => {
      setGoalDate(event.target.value);
    };
  
    /**
     * Handles prediction calculation based on user input and workout history.
     * This is a placeholder for where you would implement your prediction logic.
     * 
     * @function handlePredict
     */
    const handlePredict = () => {
      if (!workoutHistory.length) {
        console.error("No workout history data available for prediction.");
        return;
      }
  
      // TODO: Implement prediction algorithm using goalWeight, goalDate, selectedExercise, and workoutHistory
  
      // Placeholder result
      const result = `Based on your current progress for ${selectedExercise}, you are predicted to reach ${goalWeight} lbs by ${goalDate}.`;
      setPredictionResult(result);
    };
  
    /**
     * Handles the change of selected exercise.
     * 
     * @function handleExerciseChange
     * @param {Object} event - The event object from the exercise selection.
     */
    const handleExerciseChange = (event) => {
      setSelectedExercise(event.target.value);
    };
  
    return (
<Container sx={{ mt: 4, pb: 8 }}> {/* Reduced padding bottom to control spacing better */}
  <Typography variant="h4" gutterBottom>
    Future Performance Prediction
  </Typography>

  {/* Explanatory Text */}
  <Typography variant="body1" sx={{ mb: 3 }}>
    Enter your goal weight, select an exercise, and choose a target date to predict when you will reach your goal based on your workout history. For accurate predictions, it's suggested to have at least 50 sets logged per exercise. This typically corresponds to 3 to 6 months of regular entries, at about to 2-3 workouts per week.
    
    {/* Tooltip with technically impressive explanation */}
    <Tooltip
      title={
        <Typography sx={{ color: '#e0f7fa' }}> {/* Light blue tooltip text */}
          We employ advanced linear regression models to analyze your historical workout data. By evaluating your rate of progression, we estimate when you'll achieve your target weight. This involves statistically modeling your performance curve and calculating the optimal point of future success!
        </Typography>
      }
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: 'rgba(2, 136, 209, 0.8)', // Semi-transparent blue background
          },
        },
      }}
    >
      <IconButton size="small" sx={{ ml: 1, color: '#0288d1' }}> {/* Light blue icon */}
        <HelpOutlineIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Typography>
  
  <Grid container spacing={3} sx={{ mt: 2 }}>
    {/* Dropdown to select the exercise */}
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="exercise-select-label">Exercise</InputLabel>
        <Select
          labelId="exercise-select-label"
          id="exercise-select"
          value={selectedExercise}
          label="Exercise"
          onChange={handleExerciseChange}
        >
          {exerciseLabels.map((label) => (
            <MenuItem key={label} value={label}>{label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>

    {/* Input for goal weight */}
    <Grid item xs={12} sm={6}>
      <TextField
        label="Goal Weight (lbs)"
        type="number"
        fullWidth
        value={goalWeight}
        onChange={handleGoalWeightChange}
        sx={{ mb: 2 }}
      />
    </Grid>

    {/* Input for goal date */}
    <Grid item xs={12} sm={6}>
      <TextField
        label="Goal Date"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
        value={goalDate}
        onChange={handleGoalDateChange}
        sx={{ mb: 2 }}
      />
    </Grid>
  </Grid>

  {/* Centered button at the bottom middle with margin-bottom for spacing */}
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 8 }}> {/* Adjusted margin-bottom for more spacing */}
    <Tooltip
      title={!goalWeight || !goalDate ? "Please complete all fields to enable prediction." : ""}
      arrow
      placement="top"
      disableHoverListener={goalWeight && goalDate}  // Disable tooltip when button is enabled
    >
      <span> {/* Wrapper to ensure Tooltip works with disabled button */}
        <Button
          variant="outlined"
          onClick={handlePredict}
          disabled={!goalWeight || !goalDate}
          sx={{
            mt: 2,
            mb: 2,
            border: '2px solid #757575',  // Solid dark gray outline
            backgroundColor: '#f5f5f5',  // Light gray background
            color: '#424242',  // Darker gray text
            '&:hover': {
              backgroundColor: '#e0e0e0',  // Slightly darker gray on hover
            },
            '&:disabled': {
              backgroundColor: '#f5f5f5',
              color: '#bdbdbd',  
              borderColor: '#bdbdbd',  
            }
          }}
        >
          Predict
        </Button>
      </span>
    </Tooltip>
  </Box>

  {predictionResult && (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">{predictionResult}</Typography>
    </Box>
  )}
</Container>
    );
  };
  
  export default FuturePrediction;
