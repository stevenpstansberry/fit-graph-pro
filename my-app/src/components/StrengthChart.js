/**
 * @fileoverview Component for visualizing the user's workout history in a line chart format.
 * 
 * @file src/components/StrengthChart.js
 * 
 * Provides a user interface to select different exercises and timeframes to display a 
 * graph of total weight lifted and reps performed over time.
 * Displays statistics like maximum weight lifted, average weight, maximum reps, total volume, 
 * and average volume per workout.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {Array} props.workoutHistory - The complete workout history of the user.
 * @param {Array} props.filteredWorkouts - Workouts filtered by the selected month and year.
 * @param {string} props.selectedMonth - The currently selected month for filtering workouts.
 * @param {number} props.selectedYear - The currently selected year for filtering workouts.
 * @returns {React.Element} - The rendered StrengthChart component.
 * 
 * @version 1.0.0
 * @author Steven Stansberry
 */

import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Select, MenuItem, FormControl, InputLabel, Box, Container,
  Typography, Grid
} from '@mui/material';

/**
 * StrengthChart component for displaying a line chart of workout history.
 * Allows users to select exercises and timeframes to filter and visualize workout data.
 * Displays additional statistics like max weight, average weight, max reps, total volume, and more.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {Array} props.workoutHistory - Full workout data of the user.
 * @param {Array} props.filteredWorkouts - Workouts filtered by the selected month and year.
 * @param {string} props.selectedMonth - The currently selected month for filtering workouts.
 * @param {number} props.selectedYear - The currently selected year for filtering workouts.
 * @returns {React.Element} - The rendered StrengthChart component.
 */
const StrengthChart = ({ workoutHistory, filteredWorkouts, selectedMonth, selectedYear }) => {
  const [selectedExercise, setSelectedExercise] = useState(''); // Selected exercise for filtering data
  const [timeframe, setTimeframe] = useState('currentMonth'); // Timeframe for filtering data (currentMonth, ytd, allTime)
  const [displayData, setDisplayData] = useState([]); // Data to display in the line chart
  const [stats, setStats] = useState({}); // Statistics for the selected exercise

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
   * Filters workout data based on the selected exercise.
   * 
   * @function getFilteredData
   * @param {Array} workouts - List of workouts to filter.
   * @returns {Array} - Filtered and formatted data for the line chart.
   */
  const getFilteredData = (workouts) => {
    return workouts.map((workout) => {
      const exercise = workout.exercises.find((ex) => ex.label === selectedExercise);
      if (exercise) {
        const totalWeight = exercise.sets.reduce((sum, set) => sum + parseInt(set.weight, 10), 0);
        const totalReps = exercise.sets.reduce((sum, set) => sum + parseInt(set.reps, 10), 0);
        return {
          date: workout.date.toLocaleDateString(), // Format the date for X-axis
          weight: totalWeight,
          reps: totalReps,
        };
      }
      return null;
    }).filter(Boolean); // Remove any null values
  };

  /**
   * Calculates various statistics for the selected exercise.
   * 
   * @function calculateStats
   * @param {Array} workouts - List of workouts to analyze.
   * @returns {Object} - Object containing calculated statistics.
   */
  const calculateStats = (workouts) => {
    let maxWeight = 0;
    let maxReps = 0;
    let totalVolume = 0;
    let totalWeight = 0;
    let totalSets = 0;
    let workoutCount = 0;

    workouts.forEach((workout) => {
      const exercise = workout.exercises.find((ex) => ex.label === selectedExercise);
      if (exercise) {
        workoutCount++;
        exercise.sets.forEach((set) => {
          const weight = parseInt(set.weight, 10);
          const reps = parseInt(set.reps, 10);
          maxWeight = Math.max(maxWeight, weight);
          maxReps = Math.max(maxReps, reps);
          totalVolume += weight * reps;
          totalWeight += weight;
          totalSets++;
        });
      }
    });

    const averageWeight = totalSets ? (totalWeight / totalSets).toFixed(2) : 0;
    const averageVolumePerWorkout = workoutCount ? (totalVolume / workoutCount).toFixed(2) : 0;

    return {
      maxWeight,
      maxReps,
      averageWeight,
      totalVolume,
      averageVolumePerWorkout,
      workoutCount,
    };
  };

  // Update display data and statistics based on timeframe and selected exercise
  useEffect(() => {
    let dataToDisplay;
    if (timeframe === 'currentMonth') {
      dataToDisplay = filteredWorkouts;
    } else if (timeframe === 'ytd') {
      dataToDisplay = workoutHistory.filter(workout => workout.date.getFullYear() === selectedYear);
    } else if (timeframe === 'allTime') {
      dataToDisplay = workoutHistory;
    }

    setDisplayData(getFilteredData(dataToDisplay));
    setStats(calculateStats(dataToDisplay));
  }, [filteredWorkouts, workoutHistory, timeframe, selectedExercise, selectedYear]);

  /**
   * Handles the change of selected exercise.
   * 
   * @function handleExerciseChange
   * @param {Object} event - The event object from the exercise selection.
   */
  const handleExerciseChange = (event) => {
    setSelectedExercise(event.target.value);
  };

  /**
   * Handles the change of selected timeframe.
   * 
   * @function handleTimeframeChange
   * @param {Object} event - The event object from the timeframe selection.
   */
  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  /**
   * Generates the title for the chart based on the selected timeframe and exercise.
   * 
   * @function getTitle
   * @returns {string} - The title for the chart.
   */
  const getTitle = () => {
    if (timeframe === 'currentMonth') {
      return `Displaying Workout History for: ${selectedExercise}, ${selectedMonth} ${selectedYear}`;
    } else if (timeframe === 'ytd') {
      return `Displaying Year-to-Date Workout History for: ${selectedExercise}, ${selectedYear}`;
    } else if (timeframe === 'allTime') {
      return `Displaying All-Time Workout History for: ${selectedExercise}`;
    } else {
      return `Displaying Workout History for: ${selectedExercise}`;
    }
  };

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
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
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="timeframe-select-label">Timeframe</InputLabel>
        <Select
          labelId="timeframe-select-label"
          id="timeframe-select"
          value={timeframe}
          label="Timeframe"
          onChange={handleTimeframeChange}
        >
          <MenuItem value="currentMonth">Current Month</MenuItem>
          <MenuItem value="ytd">Year to Date</MenuItem>
          <MenuItem value="allTime">All Time</MenuItem>
        </Select>
      </FormControl>

      <Container sx={{ mt: 2 }}>
        <Typography
          variant="h5"
          sx={{
            color: '#4A4A4A', 
            fontWeight: 'bold',
            backgroundColor: '#e0e0e0', 
            padding: '8px 16px',
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', 
          }}
        >
          {getTitle()}
        </Typography>

        {/* Display Exercise Stats */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1"><strong>Max Weight:</strong> {stats.maxWeight} lbs</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1"><strong>Average Weight:</strong> {stats.averageWeight} lbs</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1"><strong>Max Reps:</strong> {stats.maxReps}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1"><strong>Total Volume:</strong> {stats.totalVolume} lbs</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1"><strong>Average Volume per Workout:</strong> {stats.averageVolumePerWorkout} lbs</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1"><strong>Workout Count:</strong> {stats.workoutCount}</Typography>
          </Grid>
        </Grid>
      </Container>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={displayData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="weight" stroke="#8884d8" />
          <Line type="monotone" dataKey="reps" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StrengthChart;
