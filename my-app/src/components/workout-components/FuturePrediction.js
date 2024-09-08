/**
 * @fileoverview Component for predicting future performance based on user goals.
 * 
 * @file src/components/workout-components/FuturePrediction.js
 * 
 * Provides a user interface to input target goals for weight and predict future workout performance.
 * 
 * @component
 * @returns {React.Element} - The rendered FuturePrediction component.
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Container, Tooltip, IconButton, Tabs, Tab, Autocomplete } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { calculateFuturePerformance } from '../../services/APIServices';

/**
 * FuturePrediction component
 * 
 * This component allows users to select an exercise, input a goal weight,
 * and predict when they will achieve that goal based on their workout history.
 * It also provides an option to estimate the user's 1-rep max for a given exercise.
 * 
 * @param {Array} workoutHistory - The user's workout history containing exercise data.
 */
const FuturePrediction = ({ workoutHistory = [] }) => {
    console.log("workout history: ", workoutHistory);

    // State variables
    const [goalWeight, setGoalWeight] = useState(''); // Goal weight input by user
    const [predictionResult, setPredictionResult] = useState(null); // Result of the prediction
    const [selectedExercise, setSelectedExercise] = useState(''); // Currently selected exercise for prediction
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

    /**
     * Handles the change event for the goal weight input field.
     * 
     * @param {Object} event - The event object from the input field.
     */
    const handleGoalWeightChange = (event) => {
      setGoalWeight(event.target.value);
    };

    /**
     * Handles the prediction logic by calling the API service and setting the prediction result.
     */
    const handlePredict = async () => {
        if (!selectedExercise || !goalWeight || !workoutHistory.length) {
            console.error("Please select an exercise, set a goal weight, and ensure workout history is available.");
            return;
        }

        const performanceData = {
            exercise: selectedExercise,
            goalWeight: parseFloat(goalWeight),
            workoutHistory,
        };

        try {
            // Call the API service function to calculate future performance
            const response = await calculateFuturePerformance(performanceData);

            // Check if the predicted date is in the past
            const today = new Date();
            const predictedDate = new Date(response.predictedDate);
            
            if (predictedDate < today) {
                setPredictionResult(`Predicted Date: ${response.predictedDate} (Note: This date is in the past. This may indicate a small or strange data distribution.)`);
            } else {
                setPredictionResult(`Predicted Achievement Date: ${response.predictedDate}`);
            }

        } catch (error) {
            console.error("Error predicting future performance:", error);
            setPredictionResult("An error occurred while predicting future performance.");
        }
    };

    /**
     * Handles the change event for the exercise selection autocomplete component.
     * 
     * @param {Object} event - The event object from the Autocomplete component.
     * @param {string} newValue - The new exercise value selected by the user.
     */
    const handleExerciseChange = (event, newValue) => {
      setSelectedExercise(newValue);
    };

    /**
     * Handles the change event for tab selection.
     * 
     * @param {Object} event - The event object from the Tab component.
     * @param {number} newValue - The index of the selected tab.
     */
    const handleTabChange = (event, newValue) => {
      setTabIndex(newValue);
    };

    /**
     * Handles the 1 Rep Max (1RM) estimation for the selected exercise.
     * Utilizes Epley's formula to estimate 1RM: 1RM = Weight x (1 + 0.0333 x Reps).
     */
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minHeight: '100vh', 
          }}
        >
            <Container sx={{ mt: 4, pb: 8, flexGrow: 1 }}>
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
                            Enter your goal weight and select an exercise to predict when you will reach your goal based on your workout history. For accurate predictions, it's suggested to have at least 50 sets logged per exercise. This typically corresponds to 3 to 6 months of regular entries, at about 2-3 workouts per week.
                            
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
                        </Grid>

                        {/* Centered button */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 8 }}>
                            <Tooltip
                                title={!goalWeight ? "Please enter a goal weight to enable prediction." : ""}
                                arrow
                                placement="top"
                                disableHoverListener={goalWeight}
                            >
                                <span>
                                    <Button
                                        variant="outlined"
                                        onClick={handlePredict}
                                        disabled={!goalWeight}
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

                        {/* Display Prediction Result */}
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
        </Box>
    );
};

export default FuturePrediction;
