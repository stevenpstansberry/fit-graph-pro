import React, { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Workout_Card from '../components/Workout_Card';
import { getUser } from '../services/AuthService';


function Workouts() {

  const user = getUser();
  const name = user !== 'undefined' && user ? user.name : '';

    // Set the workout card to be disabled by default
  const [isCardVisible, setIsCardVisible] = useState(false);

  const toggleAddWorkoutCard = () => {
    setIsCardVisible(!isCardVisible);
  };

  const handleClose = () => {
    setIsCardVisible(false);
  };

  return (
    <Container>
      <Navbar />
      <Typography>
        hello
      </Typography>
      <Button onClick={toggleAddWorkoutCard}>
        add workout
      </Button>
      <Workout_Card open={isCardVisible} onClose={handleClose} />
      <Footer />
    </Container>
  );
}

export default Workouts;
