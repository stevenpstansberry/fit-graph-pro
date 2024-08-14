import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Select, MenuItem, FormControl, InputLabel, Box
} from '@mui/material';



const StrengthChart = () => {
  const [selectedExercise, setSelectedExercise] = useState('Pull Up');
  const [timeframe, setTimeframe] = useState('currentMonth');

  // Function to filter data based on the selected exercise
  //TODO: add ability to filter by reps
  const getFilteredData = () => {
    return workoutData.map((workout) => {
      const exercise = workout.exercises.find((ex) => ex.label === selectedExercise);
      if (exercise) {
        const totalWeight = exercise.sets.reduce((sum, set) => sum + parseInt(set.weight, 10), 0);
        return {
          date: workout.date,
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
          <MenuItem value="Pull Up">Pull Up</MenuItem>
          <MenuItem value="Barbell Row">Barbell Row</MenuItem>
          <MenuItem value="Bicep Curl">Bicep Curl</MenuItem>
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





const workoutData = [
  {
    id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
    date: "8/01/2024",
    exercises: [
      { label: "Pull Up", bodyPart: "Back", sets: [{ weight: "Bodyweight", reps: "5" }, { weight: "Bodyweight", reps: "5" }] },
      { label: "Barbell Row", bodyPart: "Back", sets: [{ weight: "100", reps: "8" }, { weight: "100", reps: "8" }] },
      { label: "Bicep Curl", bodyPart: "Arms", sets: [{ weight: "20", reps: "10" }, { weight: "20", reps: "10" }] },
    ],
  },
  {
    id: "b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6",
    date: "8/08/2024",
    exercises: [
      { label: "Pull Up", bodyPart: "Back", sets: [{ weight: "Bodyweight", reps: "6" }, { weight: "Bodyweight", reps: "6" }] },
      { label: "Barbell Row", bodyPart: "Back", sets: [{ weight: "105", reps: "8" }, { weight: "105", reps: "8" }] },
      { label: "Bicep Curl", bodyPart: "Arms", sets: [{ weight: "22", reps: "10" }, { weight: "22", reps: "10" }] },
    ],
  },
  {
    id: "c1d2e3f4-g5h6-i7j8-k9l0-m1n2o3p4q5r6",
    date: "8/15/2024",
    exercises: [
      { label: "Pull Up", bodyPart: "Back", sets: [{ weight: "Bodyweight", reps: "7" }, { weight: "Bodyweight", reps: "7" }] },
      { label: "Barbell Row", bodyPart: "Back", sets: [{ weight: "110", reps: "8" }, { weight: "110", reps: "8" }] },
      { label: "Bicep Curl", bodyPart: "Arms", sets: [{ weight: "24", reps: "10" }, { weight: "24", reps: "10" }] },
    ],
  },
  {
    id: "d1e2f3g4-h5i6-j7k8-l9m0-n1o2p3q4r5s6",
    date: "8/22/2024",
    exercises: [
      { label: "Pull Up", bodyPart: "Back", sets: [{ weight: "Bodyweight", reps: "8" }, { weight: "Bodyweight", reps: "8" }] },
      { label: "Barbell Row", bodyPart: "Back", sets: [{ weight: "115", reps: "8" }, { weight: "115", reps: "8" }] },
      { label: "Bicep Curl", bodyPart: "Arms", sets: [{ weight: "26", reps: "10" }, { weight: "26", reps: "10" }] },
    ],
  },
  {
    id: "e1f2g3h4-i5j6-k7l8-m9n0-o1p2q3r4s5t6",
    date: "8/29/2024",
    exercises: [
      { label: "Pull Up", bodyPart: "Back", sets: [{ weight: "Bodyweight", reps: "9" }, { weight: "Bodyweight", reps: "9" }] },
      { label: "Barbell Row", bodyPart: "Back", sets: [{ weight: "120", reps: "8" }, { weight: "120", reps: "8" }] },
      { label: "Bicep Curl", bodyPart: "Arms", sets: [{ weight: "28", reps: "10" }, { weight: "28", reps: "10" }] },
    ],
  }
];
