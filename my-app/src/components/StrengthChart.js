import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Select, MenuItem, FormControl, InputLabel, Box, Container,
  Typography
} from '@mui/material';

const StrengthChart = ({ workoutHistory, filteredWorkouts, selectedMonth, selectedYear }) => { 
  const [selectedExercise, setSelectedExercise] = useState('');
  const [timeframe, setTimeframe] = useState('currentMonth');
  const [displayData, setDisplayData] = useState([]);

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

  // Function to filter data based on the selected exercise
  const getFilteredData = (workouts) => {
    return workouts.map((workout) => {
      const exercise = workout.exercises.find((ex) => ex.label === selectedExercise);
      if (exercise) {
        const totalWeight = exercise.sets.reduce((sum, set) => sum + parseInt(set.weight, 10), 0);
        return {
          date: workout.date.toLocaleDateString(), // Format the date for X-axis
          weight: totalWeight,
        };
      }
      return null;
    }).filter(Boolean); // Remove any null values
  };

  // Update display data based on timeframe and selected exercise
  useEffect(() => {
    if (timeframe === 'currentMonth') {
      setDisplayData(getFilteredData(filteredWorkouts));
    } else if (timeframe === 'ytd') {
      const currentYearWorkouts = workoutHistory.filter(workout => workout.date.getFullYear() === selectedYear);
      setDisplayData(getFilteredData(currentYearWorkouts));
    } else if (timeframe === 'allTime') {
      setDisplayData(getFilteredData(workoutHistory));
    }
  }, [filteredWorkouts, workoutHistory, timeframe, selectedExercise]);

  const handleExerciseChange = (event) => {
    setSelectedExercise(event.target.value);
  };

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

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
      </Container>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={displayData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="weight" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StrengthChart;
