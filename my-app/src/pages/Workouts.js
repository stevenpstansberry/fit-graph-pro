import React, { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Workout_Card from '../components/Workout_Card';

function Workouts() {
    // Set the workout card to be disabled by default
  const [isCardVisible, setIsCardVisible] = useState(false);

  const toggleCardVisibility = () => {
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
      <Button onClick={toggleCardVisibility}>
        add workout
      </Button>
      <Workout_Card open={isCardVisible} onClose={handleClose} />
      <Footer />
    </Container>
  );
}

export default Workouts;
