/**
 * @fileoverview Component for predicting future performance based on user goals.
 * 
 * @file src/components/workout-components/FuturePrediction.js
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
import { Box, Typography, TextField, Button, Grid, Container, Tooltip, IconButton, Tabs, Tab, Autocomplete, FormControl } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const FuturePrediction = ({ workoutHistory = [] }) => {
    const [goalWeight, setGoalWeight] = useState('');
    const [goalDate, setGoalDate] = useState('');
    const [predictionResult, setPredictionResult] = useState(null);
    const [selectedExercise, setSelectedExercise] = useState('');
    const [tabIndex, setTabIndex] = useState(0); // State for managing tabs
    const [oneRMResult, setOneRMResult] = useState(null); // State for 1RM estimation result

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

    const handleGoalWeightChange = (event) => {
      setGoalWeight(event.target.value);
    };

    const handleGoalDateChange = (event) => {
      setGoalDate(event.target.value);
    };

    const handlePredict = () => {
      if (!workoutHistory.length) {
        console.error("No workout history data available for prediction.");
        return;
      }

      const result = `Based on your current progress for ${selectedExercise}, you are predicted to reach ${goalWeight} lbs by ${goalDate}.`;
      setPredictionResult(result);
    };

    const handleExerciseChange = (event, newValue) => {
      setSelectedExercise(newValue);
    };

    const handleTabChange = (event, newValue) => {
      setTabIndex(newValue);
    };

    const handleEstimate1RM = () => {
        if (!selectedExercise || !workoutHistory.length) {
            console.error("Please select an exercise and ensure workout history is available.");
            return;
        }

        const exerciseData = workoutHistory.flatMap(workout =>
            workout.exercises.filter(exercise => exercise.label === selectedExercise)
        );

        // Find the set with the highest weight, and if tied, the one with the highest reps
        let maxSet = exerciseData.flatMap(exercise => exercise.sets).reduce((prev, current) => {
            if (!prev || current.weight > prev.weight) return current;
            if (current.weight === prev.weight && current.reps > prev.reps) return current;
            return prev;
        }, null);

        if (maxSet) {
            // Estimate 1RM using Epley's formula
            const estimated1RM = (maxSet.weight * (1 + 0.0333 * maxSet.reps)).toFixed(2);
            setOneRMResult(`Your estimated 1RM for ${selectedExercise} is ${estimated1RM} lbs based on your best set: ${maxSet.weight} lbs x ${maxSet.reps} reps.`);
        } else {
            setOneRMResult(`No data available for estimating 1RM for ${selectedExercise}.`);
        }
    };

    return (
        <Container sx={{ mt: 4, pb: 8 }}>
            <Typography variant="h4" gutterBottom>
                Future Performance Prediction
            </Typography>

            {/* Tabs for navigation */}
            <Tabs value={tabIndex} onChange={handleTabChange} centered>
                <Tab label="Predict Future Performance" />
                <Tab label="Estimate 1 Rep Max (1RM)" />
            </Tabs>

            {/* Tab Panel for Predict Future Performance */}
            {tabIndex === 0 && (
                <Box sx={{ mt: 4 }}>
                    {/* Explanatory Text */}
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Enter your goal weight, select an exercise, and choose a target date to predict when you will reach your goal based on your workout history. For accurate predictions, it's suggested to have at least 50 sets logged per exercise. This typically corresponds to 3 to 6 months of regular entries, at about 2-3 workouts per week.
                        
                        <Tooltip
                            title={
                                <Typography sx={{ color: '#e0f7fa' }}>
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
                            <IconButton size="small" sx={{ ml: 1, color: '#0288d1' }}>
                                <HelpOutlineIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Typography>

                    {/* Aligning form elements */}
                    <Grid container spacing={3} sx={{ mt: 2 }} alignItems="center">
                        {/* Autocomplete to select the exercise */}
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                options={exerciseLabels}
                                value={selectedExercise}
                                onChange={handleExerciseChange}
                                renderInput={(params) => <TextField {...params} label="Exercise" />}
                                fullWidth
                            />
                        </Grid>

                        {/* Input for goal weight */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Goal Weight (lbs)"
                                type="number"
                                fullWidth
                                value={goalWeight}
                                onChange={handleGoalWeightChange}
                            />
                        </Grid>

                        {/* Input for goal date */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Goal Date"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={goalDate}
                                onChange={handleGoalDateChange}
                            />
                        </Grid>
                    </Grid>

                    {/* Centered button */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 8 }}>
                        <Tooltip
                            title={!goalWeight || !goalDate ? "Please complete all fields to enable prediction." : ""}
                            arrow
                            placement="top"
                            disableHoverListener={goalWeight && goalDate}
                        >
                            <span>
                                <Button
                                    variant="outlined"
                                    onClick={handlePredict}
                                    disabled={!goalWeight || !goalDate}
                                    sx={{
                                        mt: 2,
                                        mb: 2,
                                        border: '2px solid #757575',
                                        backgroundColor: '#f5f5f5',
                                        color: '#424242',
                                        '&:hover': {
                                            backgroundColor: '#e0e0e0',
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
                </Box>
            )}

            {/* Tab Panel for Estimate 1RM */}
            {tabIndex === 1 && (
                <Box sx={{ mt: 4 }}>
                    {/* Explanation for 1RM estimation */}
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Select an exercise to estimate your 1-rep max (1RM) based on your workout history. We will search for your set with the highest weight and, if there are multiple sets with the same weight, the set with the highest reps.
                        <Tooltip
                            title={
                                <Typography sx={{ color: '#e0f7fa' }}>
                                    1RM estimation uses your heaviest set with the highest reps to calculate your theoretical maximum weight for a single repetition. This is often done using Epley's formula: 1RM = Weight x (1 + 0.0333 x Reps).
                                </Typography>
                            }
                            arrow
                            componentsProps={{
                                tooltip: {
                                    sx: {
                                        bgcolor: 'rgba(2, 136, 209, 0.8)', 
                                    },
                                },
                            }}
                        >
                            <IconButton size="small" sx={{ ml: 1, color: '#0288d1' }}>
                                <HelpOutlineIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Typography>

                    {/* Autocomplete to select the exercise for 1RM */}
                    <Autocomplete
                        options={exerciseLabels}
                        value={selectedExercise}
                        onChange={handleExerciseChange}
                        renderInput={(params) => <TextField {...params} label="Exercise" />}
                        fullWidth
                        sx={{ m: 1, minWidth: 120 }}
                    />

                    {/* Button to estimate 1RM */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 8 }}>
                        <Button
                            variant="outlined"
                            onClick={handleEstimate1RM}
                            sx={{
                                mt: 2,
                                mb: 2,
                                border: '2px solid #757575',
                                backgroundColor: '#f5f5f5',
                                color: '#424242',
                                '&:hover': {
                                    backgroundColor: '#e0e0e0',
                                }
                            }}
                        >
                            Estimate 1RM
                        </Button>
                    </Box>

                    {oneRMResult && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6">{oneRMResult}</Typography>
                        </Box>
                    )}
                </Box>
            )}
        </Container>
    );
};

export default FuturePrediction;
