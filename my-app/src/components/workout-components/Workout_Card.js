/**
 * @fileoverview Component for creating and managing workouts and workout splits.
 * 
 * @file src/components/WorkoutCard.js
 * 
 * Provides a user interface to add exercises to a workout or split, specify sets, reps, and weights, and save workouts to the backend.
 * Allows users to create custom workout splits and customize individual workouts by selecting exercises and adding details.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Boolean to control the modal open/close state.
 * @param {function} props.onClose - Function to close the modal.
 * @param {Array} props.preloadedExercises - Array of exercises to preload into the workout or split.
 * @param {string} props.mode - Mode of operation for the component ('createWorkout' or 'addSplit').
 * @param {function} props.saveSplit - Function to save a workout split to the backend.
 * @param {function} props.saveWorkout - Function to save a workout to the backend.
 * @param {string} props.newSplitName - Name of the new workout split.
 * @param {string} props.type - Type of workout.
 * @returns {React.Element} - The rendered Workout_Card component.
 * 
 * @version 1.0.0
 * @author Steven Stansberry
 */

// Import necessary components and hooks
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
import { getUser } from '../../services/AuthService';

/**
 * Workout_Card component for managing and creating workouts or workout splits.
 * Provides a modal interface to add exercises, specify sets, weights, and reps, and save the data.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Boolean to control the modal open/close state.
 * @param {function} props.onClose - Function to close the modal.
 * @param {Array} props.preloadedExercises - Array of exercises to preload into the workout or split.
 * @param {string} props.mode - Mode of operation for the component ('createWorkout' or 'addSplit').
 * @param {function} props.saveSplit - Function to save a workout split to the backend.
 * @param {function} props.saveWorkout - Function to save a workout to the backend.
 * @param {string} props.newSplitName - Name of the new workout split.
 * @param {string} props.type - Type of workout.
 * @returns {React.Element} - The rendered Workout_Card component.
 */
function Workout_Card({ open, onClose, preloadedExercises, mode, saveSplit, saveWorkout, newSplitName, type }) {
  const user = getUser();
  const name = user !== 'undefined' && user ? user.name : '';

  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Workout metadata
  const [workoutId, setWorkoutId] = useState(null);
  const [workoutDate, setWorkoutDate] = useState(null);

  // Initialize workout metadata and preload exercises when the modal opens
  useEffect(() => {
    if (open) {
      setExercises(preloadedExercises);
      setWorkoutId(uuidv4()); // Generate a unique ID for the workout
      setWorkoutDate(new Date().toLocaleDateString()); // Set today's date for the workout
    }
  }, [open, preloadedExercises]);

  /**
   * Adds a new exercise to the exercises list.
   */
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

  /**
   * Removes an exercise from the exercises list.
   * 
   * @param {number} index - Index of the exercise to remove.
   */
  const removeExercise = (index) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  /**
   * Updates the sets of an exercise.
   * 
   * @param {number} index - Index of the exercise to update.
   * @param {Array} sets - New sets array for the exercise.
   */
  const updateExerciseSets = (index, sets) => {
    const updatedExercises = exercises.map((exercise, i) =>
      i === index ? { ...exercise, sets } : exercise
    );
    setExercises(updatedExercises);
  };

  // Generate a unique ID for the workout or split
  let id = uuidv4();

  /**
   * Creates the workout or split and validates inputs.
   * Handles both 'createWorkout' and 'addSplit' modes.
   * 
   * @param {Object} event - Event object.
   */
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

      // TODO bandaid solution by incorporating both id and workoutID into object due to discrepancy
      let workout = {
        id,
        workoutId: id,
        date: workoutDate,
        username: user.username,
        type: type,
        exercises: exercises,
      };
      saveWorkout(workout);
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

// List of strength workout exercises for the autocomplete
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