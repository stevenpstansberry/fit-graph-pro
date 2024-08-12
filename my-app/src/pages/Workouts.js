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

  // Placeholder state for workouts
  const [workouts, setWorkouts] = useState([sampleWorkouts]); // assuming workouts array is empty initially

  const toggleAddWorkoutCard = () => {
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
              onClick={toggleAddWorkoutCard}
              sx={{ padding: '10px 20px', fontSize: '16px' }}
            >
              Add Workout
            </Button>
          </Box>
        ) : (
          // Display workouts or other content when they exist
          <Typography variant="h6">Your current workouts will be listed here.</Typography>
        )}
      </Box>
      <Workout_Card open={isCardVisible} onClose={handleClose} />
      <Footer />
    </Container>
  );
}

const sampleWorkouts =  [
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
  }
];

export default Workouts;
