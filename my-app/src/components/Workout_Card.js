// src/components/WorkoutCard.js

import React, { useState, useEffect } from "react";
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
import { v4 as uuidv4 } from 'uuid'; 
import { getUser } from '../services/AuthService';


function Workout_Card({ open, onClose, preloadedExercises, mode, saveSplit, saveWorkout, newSplitName,type }) {
  const user = getUser();
  const name = user !== 'undefined' && user ? user.name : '';

  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Workout metadata
  const [workoutId, setWorkoutId] = useState(null);
  const [workoutDate, setWorkoutDate] = useState(null);

  // UseEffect to initialize workout metadata and preload exercises when the modal opens
  useEffect(() => {
    if (open) {
      setExercises(preloadedExercises);
      setWorkoutId(uuidv4()); // Generate a unique ID for the workout
      setWorkoutDate(new Date().toLocaleDateString()); // Set today's date for the workout
    }
  }, [open, preloadedExercises]);

  // Function to add a new exercise to the exercises list
  const addExercise = () => {
    if (selectedExercise) {
      const newExercise = { 
        label: selectedExercise.label, 
        bodyPart: selectedExercise.bodyPart, 
        sets: [{ weight: "", reps: "" }] 
      };

      setExercises([...exercises, newExercise]);
    }
  };

  // Function to remove an exercise from the exercises list
  const removeExercise = (index) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  // Function to update the sets of an exercise
  const updateExerciseSets = (index, sets) => {
    const updatedExercises = exercises.map((exercise, i) =>
      i === index ? { ...exercise, sets } : exercise
    );
    setExercises(updatedExercises);
  };

 

  // Function to create the workout and validate inputs

  let id = uuidv4();

  const createWorkout = (event) => {
    event.preventDefault();

    // Check to see if any exercises have been added
    if (exercises.length === 0) {
      setMessage("Workout is empty, add sets.");
      console.log(message); 
      return;
    }

    if (mode === "createWorkout") {

    // Check to see if any of the reps or weights are empty
    const isAnyExerciseEmpty = exercises.some(exercise => 
      exercise.sets.length === 0 || exercise.sets.some(set => set.weight === '' || set.reps === '')
    );
  
    if (isAnyExerciseEmpty) {
      setMessage("One or more exercises have empty sets, please fill them in.");
      console.log(message);
      return;
    }

    //TODO bandaid solution by incorporating both id and workoutID into object due to discrepancy
    let workout = {
      id,
      workoutId: id,
      date: workoutDate,
      username: user.username,
      type: type,
      exercises: exercises,
    };
    saveWorkout(workout)


  }
    // Logic for "addSplit" mode
    if (mode === "addSplit") {
      // Only check that exercises and set counts are provided (no weights/reps validation)
      const isAnySetEmpty = exercises.some(exercise => exercise.sets.length === 0);
  
      if (isAnySetEmpty) {
        setMessage("One or more exercises have empty sets.");
        console.log(message);
        return;
      }
  
      const workoutSplit = {
        id,
        splitId: id,
        name: newSplitName, 
        username: user.username,
        exercises: exercises.map(exercise => ({
          label: exercise.label,
          bodyPart: exercise.bodyPart,
          sets: exercise.sets.map(set => ({ setCount: set.setCount })) // Only include set count
        })),
      };
      console.log(newSplitName);
      saveSplit(workoutSplit); 
      //console.log("Workout Split Created: ", workoutSplit);
    }
    onClose();
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
            {mode === "addSplit" ? "Create a Workout Split" : "Add a Workout"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {mode === "addSplit"
              ? "Define your workout split by adding exercises and specifying the number of sets."
              : "Add exercises to your workout and customize sets, weights, and reps."}
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
                updateExerciseSets={updateExerciseSets}
                allowWeightAndReps={mode === "createWorkout"} // Show weights/reps only in "createWorkout" mode
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
            {mode === "addSplit" ? "Save Workout Split" : "Create Workout"}
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
