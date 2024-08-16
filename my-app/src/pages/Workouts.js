import React, { useState } from 'react';
import { Container, Typography, Button, Box, Select, MenuItem } from '@mui/material';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Workout_Card from '../components/Workout_Card';
import { getUser } from '../services/AuthService';
import WorkoutCardPreview from '../components/WorkoutCardPreview';
import StrengthChart from '../components/StrengthChart'; 
import workoutDataRaw from '../util/sampleProgression.json';


//TODO don't show graphworkout button if there are no workouts for the month

// temp sample data
const workoutData = workoutDataRaw.map(workout => {
  return {
    ...workout,
    date: new Date(workout.date) 
  };
});

function Workouts() {
  const user = getUser();
  const name = user !== 'undefined' && user ? user.name : '';


  // State to manage the visibility of the Workout Card
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState(workoutData);

  // State to manage the month and year
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month (1-12)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Current year

  // State to hold workouts
  const [selectedWorkout, setSelectedWorkout] = useState([]);

  const [showGraph, setShowGraph] = useState(false); // State to toggle between graph view and workout history view

  // Predefined workout plans. 
  //TODO by default, all users will be have ppl as a predefined workout plan, need to
  // implement way to store predefined workouts in dynamodb and fetch based on user
  //use this method to change it later
  const [predefinedWorkouts, setPredefinedWorkouts] = useState([      
    { name: 'Push Workout', exercises: pushWorkout },
    { name: 'Pull Workout', exercises: pullWorkout },
    { name: 'Legs Workout', exercises: legsWorkout },]);



  const toggleAddWorkoutCard = (workout) => {
    setSelectedWorkout(workout);
    setIsCardVisible(!isCardVisible);
  };

  const handleClose = () => {
    setIsCardVisible(false);
  };

  // Filter workouts based on selected month and year
  const filteredWorkouts = workoutHistory.filter(workout => {
    const workoutMonth = workout.date.getMonth() + 1;
    const workoutYear = workout.date.getFullYear();
    return workoutMonth === selectedMonth && workoutYear === selectedYear;
  });

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];





  const handleGraphButtonClick = () => {
    setShowGraph(!showGraph); // Toggle between graph view and workout history view
    console.log(workoutHistory)
  };

  return (
    <Container sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Navbar />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="h4" component="p" sx={{ mb: 4 }}>
          Your Workouts
        </Typography>

        {/* Sticky container for selectors and button */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: 'white',
            padding: '10px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            mb: 4,
            width: '100%',
          }}
        >
          {/* Conditionally render the month and year selectors */}
          {!showGraph && (
            <>
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
            </>
          )}
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleGraphButtonClick}
            sx={{ padding: '8px 16px', fontSize: '14px' }}
          >
            {showGraph ? 'View Workout History' : 'Graph This Month'}
          </Button>
        </Box>

        {/* Conditionally render either the workout cards or the graph */}
        {showGraph ? (
          <StrengthChart workoutHistory={workoutHistory} // Workout History
          filteredWorkouts={filteredWorkouts} // Workouts of current month and year
          selectedMonth={monthNames[selectedMonth - 1]}
          selectedYear={selectedYear}  />
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
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, gap: 2 }}>
          {/* Default Workout Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => toggleAddWorkoutCard([])}
            sx={{ padding: '10px 20px', fontSize: '16px' }}
          >
            Add Default Workout
          </Button>

          {/* Dynamically generate predefined workout buttons */}
          {predefinedWorkouts.map((workout, index) => (
            <Button
              key={index}
              variant="contained"
              color="primary"
              onClick={() => toggleAddWorkoutCard(workout.exercises)}
              sx={{ padding: '10px 20px', fontSize: '16px' }}
            >
              Add {workout.name}
            </Button>
          ))}
        </Box>
      )}

      <Workout_Card open={isCardVisible} onClose={handleClose} preloadedExercises={selectedWorkout} />
      <Footer />
    </Container>
  );
}

// Sample predefined workouts
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
    date: new Date(2024, 7, 17), 
    type: 'Push Workout',
    exercises: [
      { label: 'Bench Press', bodyPart: 'Chest', sets: [{ weight: '15', reps: '8' }, { weight: '15', reps: '6' }] },
      { label: 'Overhead Press', bodyPart: 'Shoulders', sets: [{ weight: '15', reps: '10' }, { weight: '7', reps: '8' }] },
    ],
  },
];

export default Workouts;
