import React, { useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Workout_Card from '../components/Workout_Card';
import { getUser } from '../services/AuthService';

function Workouts() {
  const user = getUser();
  const name = user !== 'undefined' && user ? user.name : '';

  // State to manage the visibility of the Workout Card
  const [isCardVisible, setIsCardVisible] = useState(false);

  const [workouts, setWorkouts] =[
    {
    "WorkoutId": 1,
    "date" : new Date (2024,7,11),
    "Exercises":[ 
    {
        "label": "Bench Press",
        "bodyPart": "Chest",
        "sets": [
            {
                "weight": "10",
                "reps": "8"
            },
            {
                "weight": "15",
                "reps": "6"
            }
        ]
    },
    {
        "label": "Squat",
        "bodyPart": "Legs",
        "sets": [
            {
                "weight": "20",
                "reps": "10"
            },
            {
                "weight": "25",
                "reps": "8"
            },
            {
                "weight": "30",
                "reps": "6"
            }
        ]
    },
    {
        "label": "Deadlift",
        "bodyPart": "Back",
        "sets": [
            {
                "weight": "30",
                "reps": "5"
            },
            {
                "weight": "35",
                "reps": "4"
            }
        ]
    },
    {
        "label": "Bicep Curl",
        "bodyPart": "Arms",
        "sets": [
            {
                "weight": "5",
                "reps": "12"
            },
            {
                "weight": "7",
                "reps": "10"
            },
            {
                "weight": "8",
                "reps": "8"
            }
        ]
    },
    {
        "label": "Tricep Extension",
        "bodyPart": "Arms",
        "sets": [
            {
                "weight": "5",
                "reps": "12"
            },
            {
                "weight": "7",
                "reps": "10"
            }
        ]
    }]
  }
  ];

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
    <Container sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box sx={{ 
        flexGrow: 1,
        display: 'flex',
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
            <Typography variant="h6">Your current workouts will be listed here.</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => toggleAddWorkoutCard([])}
              sx={{ padding: '10px 20px', fontSize: '16px' }}
            >
              Add Workout
            </Button>
            <Box>
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={() => toggleAddWorkoutCard(pushWorkout)}
                sx={{ padding: '10px 20px', fontSize: '16px' }}
              >
                Add Push Workout
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => toggleAddWorkoutCard(pullWorkout)}
                sx={{ padding: '10px 20px', fontSize: '16px' }}
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
          </Box>
        )}
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
