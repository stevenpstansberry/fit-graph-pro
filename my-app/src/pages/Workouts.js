import React, { useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Workout_Card from '../components/Workout_Card';
import { getUser } from '../services/AuthService';
import WorkoutCalendar from '../components/WorkoutCalendar';
import WorkoutCardPreview from '../components/WorkoutCardPreview';

function Workouts() {
  const user = getUser();
  const name = user !== 'undefined' && user ? user.name : '';

  // State to manage the visibility of the Workout Card
  const [isCardVisible, setIsCardVisible] = useState(false);

  const [workouts, setWorkouts] = useState([
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
  ]);

  // State to hold the predefined workouts
  const [selectedWorkout, setSelectedWorkout] = useState([]);

  const toggleAddWorkoutCard = (workout) => {
    setSelectedWorkout(workout);
    setIsCardVisible(!isCardVisible);
  };

  const handleClose = () => {
    setIsCardVisible(false);
  };

  return (
    <Container sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Navbar />
      <Box sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        {workouts.length === 0 ? (
          <Box>
            <Typography variant="h4" component="p" sx={{ mb: 2 }}>
              You don't have any current workouts.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => toggleAddWorkoutCard([])}
              sx={{ padding: '10px 20px', fontSize: '16px' }}
            >
              Add Workout
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="h4" component="p" sx={{ mb: 8, textAlign: 'center' }}>
              Your Workouts
            </Typography>
            <Box 
              sx={{
                display: 'flex',
                flexWrap: 'wrap', // Allows items to wrap onto new rows if necessary
                justifyContent: 'center', // Centers the cards in the container
                gap: 4, // Space between cards
              }}
            >
              {workouts.map((workout, index) => (
                <WorkoutCardPreview key={index} workout={workout} />
              ))}
            </Box>
          </Box>  
        )}
      </Box>
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

export default Workouts;
