/**
 * @fileoverview Component for visualizing the user's workout history in a line chart format.
 * 
 * @file src/components/workout-components/StrengthChart.js
 * 
 * Provides a user interface to select different exercises and timeframes to display a 
 * graph of total weight lifted and reps performed over time.
 * Displays statistics like maximum weight lifted, average weight, maximum reps, total volume, 
 * average volume per workout, and predicts 1-rep max (1RM).
 * Allows users to toggle whether weight or reps data is displayed in the graph.
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
 * @Author Steven Stansberry
 */

import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Select, MenuItem, FormControl, InputLabel, Box, Container,
  Typography, Grid, FormControlLabel, Checkbox, Button, Collapse
} from '@mui/material';
import WorkoutDetailsCard from './WorkoutDetailsCard'
import DateSelector from './DateSelector';
import TimeframeSelector from './TimeframeSelector';  
import { getTitle } from './common/util';


const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


/**
 * Converts a month name to a month number.
 * @param {string} monthName - The name of the month.
 * @returns {number} The number of the month (1-12).
 */
const monthNameToNumber = (monthName) => monthNames.indexOf(monthName) + 1;

/**
 * Custom tooltip for displaying workout details on hover.
 *
 * @param {Object} props - The properties passed to the tooltip.
 * @returns {React.Element} - The rendered custom tooltip.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const workout = payload[0].payload.workout; // Get the full workout object from the data point

    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
        <WorkoutDetailsCard workout={workout} /> {/* Render WorkoutDetailsCard for the hovered workout */}
      </div>
    );
  }

  return null;
};

/**
 * StrengthChart component for displaying a line chart of workout history.
 * Allows users to select exercises and timeframes to filter and visualize workout data.
 * Displays additional statistics like max weight, average weight, max reps, total volume, and more.
 * Users can toggle between displaying weight and reps on the graph.
 * Predicts 1RM  for selected exercises.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {Array} props.workoutHistory - Full workout data of the user.
 * @param {Array} props.filteredWorkouts - Workouts filtered by the selected month and year.
 * @param {string} props.selectedMonth - The currently selected month for filtering workouts.
 * @param {number} props.selectedYear - The currently selected year for filtering workouts.
 * @returns {React.Element} - The rendered StrengthChart component.
 */
const StrengthChart = ({ workoutHistory, filteredWorkouts, selectedMonth, selectedYear, setSelectedMonth, setSelectedYear }) => {
  const [selectedExercise, setSelectedExercise] = useState(''); // Selected exercise for filtering data
  const [timeframe, setTimeframe] = useState('currentMonth'); // Timeframe for filtering data (currentMonth, ytd, allTime)
  const [displayData, setDisplayData] = useState([]); // Data to display in the line chart
  const [stats, setStats] = useState({}); // Statistics for the selected exercise
  const [showWeight, setShowWeight] = useState(true); // Toggle weight line on the chart
  const [showReps, setShowReps] = useState(true); // Toggle reps line on the chart
  const [showStats, setShowStats] = useState(false); // Toggle statistics visibility



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

  // Function to filter workout data based on the selected exercise
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
          workoutId: workout.workoutId, // Include workoutId for tooltip reference
          workout: workout, // Include the full workout object for detailed view
        };
      }
      return null;
    }).filter(Boolean); // Remove any null values
  };

  

  // Function to calculate various statistics for the selected exercise
  const calculateStats = (workouts) => {
    let maxWeight = 0;
    let maxReps = 0;
    let totalVolume = 0;
    let totalWeight = 0;
    let totalSets = 0;
    let workoutCount = 0;
    let maxPredicted1RM = 0;

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
          
          // Calculate predicted 1RM for this set using Epley formula
          const predicted1RM = weight * (1 + 0.0333 * reps);
          maxPredicted1RM = Math.max(maxPredicted1RM, predicted1RM);
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
      maxPredicted1RM: maxPredicted1RM.toFixed(2),
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

  // Function to handle the change of selected exercise
  const handleExerciseChange = (event) => {
    setSelectedExercise(event.target.value);
  };

  // Function to handle the change of selected timeframe
  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  if (workoutHistory.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          flexDirection: 'column'
        }}
      >
        <Typography variant="h6" >
          No workouts found in history. Get started by adding one!
        </Typography>
      </Box>
    );
  }

  // Function to generate the title for the chart based on the selected timeframe and exercise
  // const getTitle = () => {
  //   if (timeframe === 'currentMonth') {
  //     return `Displaying Workout History for: ${selectedExercise}, ${selectedMonth} ${selectedYear}`;
  //   } else if (timeframe === 'ytd') {
  //     return `Displaying Year-to-Date Workout History for: ${selectedExercise}, ${selectedYear}`;
  //   } else if (timeframe === 'allTime') {
  //     return `Displaying All-Time Workout History for: ${selectedExercise}`;
  //   } else {
  //     return `Displaying Workout History for: ${selectedExercise}`;
  //   }
  // };

  

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',  // Make the Box container cover the entire viewport height
      }}
    >
      {/* Main Content Box */}
      <Box
        sx={{
          flexGrow: 1,  // Allow this container to grow and fill the available space
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          width: '100%',
          height: '100%',
          justifyContent: 'flex-start',  // Align content to the top
          pt: 8,  // Add padding to the top
          pb: 8,  // Add padding to the bottom
        }}
      >
        {/* Chart Title */}
        <Typography
          variant="h5"
          sx={{
            color: '#4A4A4A', 
            fontWeight: 'bold',
            backgroundColor: '#e0e0e0', 
            padding: '8px 16px',
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            marginBottom: 2, 
          }}
        >
          {getTitle('strengthChart', timeframe, selectedMonth, selectedYear, selectedExercise)}
          </Typography>

        {/* Exercise and Timeframe Selectors */}
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

        {/* Timeframe selector */}
        <TimeframeSelector
          timeframe={timeframe}
          onChange={(event) => setTimeframe(event.target.value)}
        />


        {/* Use DateSelector component if timeframe is 'currentMonth' */}
        {timeframe === 'currentMonth' && (
          <DateSelector
            selectedMonth={monthNameToNumber(selectedMonth)}
            selectedYear={selectedYear}
            setSelectedMonth={setSelectedMonth}
            setSelectedYear={setSelectedYear}
          />
        )}
          <>
            {/* Checkboxes to toggle weight and reps display */}
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={<Checkbox checked={showWeight} onChange={() => setShowWeight(!showWeight)} />}
                label="Show Weight"
              />
              <FormControlLabel
                control={<Checkbox checked={showReps} onChange={() => setShowReps(!showReps)} />}
                label="Show Reps"
              />
            </Box>

            <Container sx={{ mt: 2 }}>
              {/* Button to toggle statistics visibility */}
              <Button
                variant="text"
                onClick={() => setShowStats(!showStats)}
                sx={{ mt: 2, mb: 2 }}
              >
                {showStats ? 'Hide Statistics' : 'Show Statistics'}
              </Button>

              {/* Collapsible Exercise Stats */}
              <Collapse in={showStats}>
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
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1"><strong>Predicted 1RM:</strong> {stats.maxPredicted1RM} lbs</Typography>
                  </Grid>
                </Grid>
              </Collapse>
            </Container>
              {/* Line Chart Display */}
              <ResponsiveContainer width="100%" height={400}>
              <LineChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} /> {/* Use custom tooltip for displaying workout details */}
                <Legend />
                {showWeight && <Line type="monotone" dataKey="weight" stroke="#8884d8" />}
                {showReps && <Line type="monotone" dataKey="reps" stroke="#82ca9d" />}
              </LineChart>
            </ResponsiveContainer>
          </>
      </Box>
    </Box>
  );
};

export default StrengthChart;
