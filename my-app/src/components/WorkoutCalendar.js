import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Box, Typography, Modal, Card, CardContent } from '@mui/material';

function WorkoutCalendar({ workouts }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const handleDayClick = (value) => {
    const workout = workouts.find(w => w.date.toDateString() === value.toDateString());
    if (workout) {
      setSelectedWorkout(workout);
      setSelectedDate(value);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWorkout(null);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const workout = workouts.find(w => w.date.toDateString() === date.toDateString());
      if (workout) {
        return (
          <Box
            sx={{
              backgroundColor: 'green',
              color: 'white',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            {date.getDate()}
          </Box>
        );
      }
    }
    return null;
  };

  return (
    <Box>
      <Calendar
        onClickDay={handleDayClick}
        tileContent={tileContent}
      />
      <Modal open={isModalOpen} onClose={closeModal}>
        <Card
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            boxShadow: 24,
            p: 4,
          }}
        >
          <CardContent>
            {selectedWorkout ? (
              <>
                <Typography variant="h5" gutterBottom>
                  {selectedWorkout.label}
                </Typography>
                {selectedWorkout.exercises.map((exercise, index) => (
                  <Box key={index} mb={2}>
                    <Typography variant="h6">{exercise.label}</Typography>
                    {exercise.sets.map((set, i) => (
                      <Typography key={i}>
                        Set {i + 1}: {set.weight} kg x {set.reps} reps
                      </Typography>
                    ))}
                  </Box>
                ))}
              </>
            ) : (
              <Typography>No workout for this day</Typography>
            )}
          </CardContent>
        </Card>
      </Modal>
    </Box>
  );
}

export default WorkoutCalendar;
