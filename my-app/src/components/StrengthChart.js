import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Select, MenuItem, FormControl, InputLabel, Box
} from '@mui/material';

const StrengthChart = ({ workouts }) => { 
  const [selectedExercise, setSelectedExercise] = useState('');
  const [timeframe, setTimeframe] = useState('currentMonth');

  // Extract unique exercise labels from workouts
  const exerciseLabels = Array.from(new Set(workouts.flatMap(workout => 
    workout.exercises.map(exercise => exercise.label)
  )));

  // Set the first exercise as the default selected if none is selected
  if (!selectedExercise && exerciseLabels.length > 0) {
    setSelectedExercise(exerciseLabels[0]);
  }

  // Function to filter data based on the selected exercise
  const getFilteredData = () => {
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

  const handleExerciseChange = (event) => {
    setSelectedExercise(event.target.value);
  };

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
    // Handle timeframe logic here if needed
  };

  const filteredData = getFilteredData();

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

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData}>
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
