import React, { useState } from "react";
import {
  Autocomplete,
  TextField,
  IconButton,
  Box,
  Modal,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExerciseSubcard from "./Exercise_Sub_Card";

function Workout_Card({ open, onClose }) {
  const [inputValue, setInputValue] = useState('');
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const addExercise = () => {
    if (selectedExercise) {
      setExercises([...exercises, { label: selectedExercise.label, bodyPart: selectedExercise.bodyPart, sets: [{ weight: "", reps: "" }] }]);
    }
  };

  const removeExercise = (index) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const updateExerciseSets = (index, sets) => {
    const updatedExercises = exercises.map((exercise, i) =>
      i === index ? { ...exercise, sets } : exercise
    );
    setExercises(updatedExercises);
  };

  const createWorkout = (event) => {
    event.preventDefault();
    console.log("Workout Created: ", exercises);
    // Add logic to check if workout is empty and display a message if needed.
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{
        style: { backgroundColor: 'rgba(0,0,0,0.5)' },
      }}
    >
      <Card
        sx={{
          maxWidth: 1000,
          minWidth: 1000,
          maxHeight: 600,
          minHeight: 600,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 12,
          p: 4,
          overflowY: 'auto',
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            left: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Add a Workout
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add exercises to your workout from the list below.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              position: 'sticky',
              top: 0,
              zIndex: 10,
              backgroundColor: 'white',
              paddingBottom: 2,
              borderBottom: '1px solid #ccc',
            }}
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={strengthWorkouts}
              value={selectedExercise}
              onChange={(event, newValue) => {
                setSelectedExercise(newValue);
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              sx={{ width: 300, mr: 2 }}
              renderInput={(params) => <TextField {...params} label="Exercise" />}
            />
            <Button onClick={addExercise} variant="contained" color="primary">
              Add Exercise
            </Button>
          </Box>

          <Box>
            {exercises.map((exercise, index) => (
              <ExerciseSubcard
                key={index}
                exercise={exercise}
                index={index}
                removeExercise={removeExercise}
                updateExerciseSets={updateExerciseSets} // Pass the update function
              />
            ))}
          </Box>
        </CardContent>

        <CardActions sx={{ position: 'sticky', bottom: 0, backgroundColor: 'white', zIndex: 10, p: 2 }}>
          <Button
            size="large"
            variant="contained"
            onClick={createWorkout}
            sx={{
              boxShadow: 4,
              ml: 'auto',
            }}
          >
            Create Workout
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
}

export default Workout_Card;




const strengthWorkouts = [
    { label: 'Bench Press', type: 'Strength', bodyPart: 'Chest' },
    { label: 'Squat', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Deadlift', type: 'Strength', bodyPart: 'Back' },
    { label: 'Overhead Press', type: 'Strength', bodyPart: 'Shoulders' },
    { label: 'Barbell Row', type: 'Strength', bodyPart: 'Back' },
    { label: 'Bicep Curl', type: 'Strength', bodyPart: 'Arms' },
    { label: 'Tricep Extension', type: 'Strength', bodyPart: 'Arms' },
    { label: 'Pull Up', type: 'Strength', bodyPart: 'Back' },
    { label: 'Lunge', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Leg Press', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Chest Fly', type: 'Strength', bodyPart: 'Chest' },
    { label: 'Lat Pulldown', type: 'Strength', bodyPart: 'Back' },
    { label: 'Hammer Curl', type: 'Strength', bodyPart: 'Arms' },
    { label: 'Dumbbell Shoulder Press', type: 'Strength', bodyPart: 'Shoulders' },
    { label: 'Leg Curl', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Leg Extension', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Incline Bench Press', type: 'Strength', bodyPart: 'Chest' },
    { label: 'Decline Bench Press', type: 'Strength', bodyPart: 'Chest' },
    { label: 'Calf Raise', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Front Squat', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Reverse Lunge', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Goblet Squat', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Face Pull', type: 'Strength', bodyPart: 'Back' },
    { label: 'Cable Row', type: 'Strength', bodyPart: 'Back' },
    { label: 'Side Lateral Raise', type: 'Strength', bodyPart: 'Shoulders' },
    { label: 'Bulgarian Split Squat', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Seated Dumbbell Press', type: 'Strength', bodyPart: 'Shoulders' },
    { label: 'Skull Crusher', type: 'Strength', bodyPart: 'Arms' },
    { label: 'Dips', type: 'Strength', bodyPart: 'Chest' },
    { label: 'Single-leg Deadlift', type: 'Strength', bodyPart: 'Legs' }
];
