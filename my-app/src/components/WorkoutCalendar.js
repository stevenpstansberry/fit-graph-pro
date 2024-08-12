import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Box, Typography, Modal, Card, CardContent } from '@mui/material';

const workouts = [
  {
    date: new Date(2024, 7, 14), 
    label: 'Push Workout',
    exercises: [
      { label: 'Bench Press', bodyPart: 'Chest', sets: [{ weight: '10', reps: '8' }, { weight: '15', reps: '6' }] },
      { label: 'Overhead Press', bodyPart: 'Shoulders', sets: [{ weight: '5', reps: '10' }, { weight: '7', reps: '8' }] },
    ],
  },
  {
    date: new Date(2024, 7, 16), 
    label: 'Pull Workout',
    exercises: [
      { label: 'Pull Up', bodyPart: 'Back', sets: [{ weight: '0', reps: '10' }] },
      { label: 'Barbell Row', bodyPart: 'Back', sets: [{ weight: '12', reps: '8' }, { weight: '15', reps: '6' }] },
    ],
  },
];

function WorkoutCalendar() {
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
              borderRadius: '50%',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
