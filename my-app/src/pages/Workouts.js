import React, { useState } from 'react';
import { Container, Typography, Button, Box, Select, MenuItem } from '@mui/material';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Workout_Card from '../components/Workout_Card';
import { getUser } from '../services/AuthService';
import WorkoutCardPreview from '../components/WorkoutCardPreview';
import StrengthChart from '../components/StrengthChart'; // Import your StrengthChart component

function Workouts() {
  const user = getUser();
  const name = user !== 'undefined' && user ? user.name : '';

  // State to manage the visibility of the Workout Card
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [workouts, setWorkouts] = useState(sampleWorkoutsTesting);

  // State to manage the month and year
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month (1-12)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Current year

  // State to hold the predefined workouts (PPL)
  const [selectedWorkout, setSelectedWorkout] = useState([]);
  const [showGraph, setShowGraph] = useState(false); // New state for controlling the graph view

  const toggleAddWorkoutCard = (workout) => {
    setSelectedWorkout(workout);
    setIsCardVisible(!isCardVisible);
  };

  const handleClose = () => {
    setIsCardVisible(false);
  };

  // Filter workouts based on selected month and year
  const filteredWorkouts = workouts.filter(workout => {
    const workoutMonth = workout.date.getMonth() + 1;
    const workoutYear = workout.date.getFullYear();
    return workoutMonth === selectedMonth && workoutYear === selectedYear;
  });

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleGraphButtonClick = () => {
    setShowGraph(true); // Switch to the graph view when the button is clicked
  };

  return (
    <Container sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Navbar />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="h4" component="p" sx={{ mb: 4 }}>
          Your Workouts
        </Typography>

        {/* Month and Year Selectors with Graph Button */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {monthNames.map((month, index) => (
              <MenuItem key={index} value={index + 1}>
                {month}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {[2023, 2024, 2025].map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleGraphButtonClick}
            sx={{ padding: '8px 16px', fontSize: '14px' }}
          >
            Graph This Month
          </Button>
        </Box>

        {/* Conditionally render either the workout cards or the graph */}
        {showGraph ? (
          <StrengthChart workouts={filteredWorkouts} /> // Pass the filtered workouts to the StrengthChart component
        ) : (
          filteredWorkouts.length > 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              {filteredWorkouts.map((workout, index) => (
                <WorkoutCardPreview key={index} workout={workout} />
              ))}
            </Box>
          ) : (
            <Typography variant="h6" sx={{ mb: 4 }}>
              No workouts for {monthNames[selectedMonth - 1]} {selectedYear}
            </Typography>
          )
        )}
      </Box>

      {/* Workout creation buttons */}
      {!showGraph && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => toggleAddWorkoutCard([])}
            sx={{ padding: '10px 20px', fontSize: '16px', mr: 2 }}
          >
            Add Workout
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => toggleAddWorkoutCard(pushWorkout)}
            sx={{ padding: '10px 20px', fontSize: '16px', mr: 2 }}
          >
            Add Push Workout
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => toggleAddWorkoutCard(pullWorkout)}
            sx={{ padding: '10px 20px', fontSize: '16px', mr: 2 }}
          >
            Add Pull Workout
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => toggleAddWorkoutCard(legsWorkout)}
            sx={{ padding: '10px 20px', fontSize: '16px' }}
          >
            Add Legs Workout
          </Button>
        </Box>
      )}

      <Workout_Card open={isCardVisible} onClose={handleClose} preloadedExercises={selectedWorkout} />
      <Footer />
    </Container>
  );
}

const pushWorkout = [
  { label: 'Bench Press', bodyPart: 'Chest', sets: [{ weight: "", reps: "" }] },
  { label: 'Overhead Press', bodyPart: 'Shoulders', sets: [{ weight: "", reps: "" }] },
  { label: 'Tricep Extension', bodyPart: 'Arms', sets: [{ weight: "", reps: "" }] }
];

const pullWorkout = [
  { label: 'Pull Up', bodyPart: 'Back', sets: [{ weight: "", reps: "" }] },
  { label: 'Barbell Row', bodyPart: 'Back', sets: [{ weight: "", reps: "" }] },
  { label: 'Bicep Curl', bodyPart: 'Arms', sets: [{ weight: "", reps: "" }] }
];

const legsWorkout = [
  { label: 'Squat', bodyPart: 'Legs', sets: [{ weight: "", reps: "" }] },
  { label: 'Leg Press', bodyPart: 'Legs', sets: [{ weight: "", reps: "" }] },
  { label: 'Lunge', bodyPart: 'Legs', sets: [{ weight: "", reps: "" }] }
];

const sampleWorkoutsTesting = [
  {
    date: new Date(2024, 6, 14), 
    type: 'Push Workout',
    exercises: [
      { label: 'Bench Press', bodyPart: 'Chest', sets: [{ weight: '10', reps: '8' }, { weight: '15', reps: '6' }] },
      { label: 'Overhead Press', bodyPart: 'Shoulders', sets: [{ weight: '5', reps: '10' }, { weight: '7', reps: '8' }] },
    ],
  },
  {
    date: new Date(2024, 7, 14), 
    type: 'Push Workout',
    exercises: [
      { label: 'Bench Press', bodyPart: 'Chest', sets: [{ weight: '10', reps: '8' }, { weight: '15', reps: '6' }] },
      { label: 'Overhead Press', bodyPart: 'Shoulders', sets: [{ weight: '5', reps: '10' }, { weight: '7', reps: '8' }] },
    ],
  },
  {
    date: new Date(2024, 7, 16), 
    type: 'Pull Workout',
    exercises: [
      { label: 'Pull Up', bodyPart: 'Back', sets: [{ weight: '0', reps: '10' }] },
      { label: 'Barbell Row', bodyPart: 'Back', sets: [{ weight: '12', reps: '8' }, { weight: '15', reps: '6' }] },
    ],
  },
];

export default Workouts;
