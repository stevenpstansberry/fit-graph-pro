/**
 * @fileoverview Component for creating and managing workouts and workout splits.
 * 
 * @file src/components/workout-components/WorkoutCard.js
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

import React, { useState, useEffect } from "react";
import { Autocomplete, TextField ,IconButton ,Box ,Modal ,Card ,CardContent ,Button ,Typography, Alert, Snackbar} from "@mui/material";
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
 * @param {string} props.editMode - Determines if in edit mode
 * @param {string} props.workoutToEditId - The id of the workout being edited
 * @param {function} props.putWorkout - Function to put (edit) a workout to the backend.
 * @returns {React.Element} - The rendered Workout_Card component.
 */
function Workout_Card({ open, onClose, preloadedExercises, mode, saveSplit, saveWorkout, newSplitName, type, editMode, workoutToEditId, putWorkout }) {
  const user = getUser();

  // Initialize state variables
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [availableExercises, setAvailableExercises] = useState(strengthWorkouts); // State for available exercises
  const [isEditMode, setIsEditMode] = useState(editMode || false); // Initialize based on editMode prop

  // Workout metadata
  const [uniqueId, setUniqueId] = useState('');
  const [workoutDate, setWorkoutDate] = useState(null);

  // Initialize workout metadata and preload exercises when the modal opens
  useEffect(() => {
    if (open) {
      setExercises(preloadedExercises);
      setUniqueId(uuidv4()); // Generate a unique ID for the workout
      setWorkoutDate(new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })); // Set today's date with time for the workout

      // Filter out preloaded exercises from the available exercises
      const filteredExercises = strengthWorkouts.filter(
        (exercise) => !preloadedExercises.some(preloaded => preloaded.label === exercise.label)
      );
      setAvailableExercises(filteredExercises);

      // Set edit mode if passed in
      if (editMode) {
        setIsEditMode(true);
        setUniqueId(workoutToEditId)
        console.log('!!!!!!in edit mode for: ', uniqueId);
        // Additional initialization for edit mode if needed
      }
    }
  }, [open, preloadedExercises, editMode]);

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

      // Remove the selected exercise from the dropdown options
      setAvailableExercises((prevExercises) =>
        prevExercises.filter((exercise) => exercise.label !== selectedExercise.label)
      );
      setSelectedExercise(null);  // Reset the selected exercise
    }
  };

  /**
   * Removes an exercise from the exercises list.
   * 
   * @param {number} index - Index of the exercise to remove.
   */
  const removeExercise = (index) => {
    const exerciseToRemove = exercises[index]; // Exercise being removed
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);

    // Add the removed exercise back to the available options
    setAvailableExercises((prevExercises) => [...prevExercises, exerciseToRemove]);
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
      setSnackbarOpen(true);
      return;
    }

    if (mode === "createWorkout") {
      // Check to see if any of the reps or weights are empty
      const isAnyExerciseEmpty = exercises.some(exercise => 
        exercise.sets.length === 0 || exercise.sets.some(set => set.weight === '' || set.reps === '')
      );

      if (isAnyExerciseEmpty) {
        setMessage("One or more exercises have empty sets, please fill them in.");
        setSnackbarOpen(true);
        return;
      }

      let workout = {
        workoutId: uniqueId,
        date: workoutDate,
        username: user.username,
        type: type,
        exercises: exercises,
      };
      if (!editMode){
        saveWorkout(workout);
      } else {
        putWorkout(workout);
      }
    }

    // Logic for "addSplit" mode
    if (mode === "addSplit") {
      // Only check that exercises and set counts are provided (no weights/reps validation)
      const isAnySetEmpty = exercises.some(exercise => exercise.sets.length === 0);

      if (isAnySetEmpty) {
        setMessage("One or more exercises have empty sets.");
        setSnackbarOpen(true);
        return;
      }

      const workoutSplit = {
        splitId: uniqueId,
        name: newSplitName, 
        username: user.username,
        exercises: exercises.map(exercise => ({
          label: exercise.label,
          bodyPart: exercise.bodyPart,
          sets: exercise.sets.map(set => ({ setCount: set.setCount })) // Only include set count
        })),
      };
      saveSplit(workoutSplit); 
    }
    onClose();
  };

  // Handle closing the snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
            {mode === "addSplit" ? "Create a Workout Split" : (isEditMode ? "Edit Workout" : "Add a Workout")}
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
              options={availableExercises} // Dynamically updated available exercises
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

          {/* List of exercises */}
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

          {/* Create Workout button at the bottom */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
            {/* Snackbar positioned to the left of the button */}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={4000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              sx={{ position: 'absolute', right: 180, bottom: 20 }} // Position to the left of the button
            >
              <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                {message}
              </Alert>
            </Snackbar>

            <Button
              size="large"
              variant="contained"
              onClick={createWorkout}
              sx={{
                boxShadow: 4,
                marginLeft: 'auto',
              }}
            >
              {mode === "addSplit" ? "Save Workout Split" : (isEditMode ? "Edit Workout" : "Create Workout")}
            </Button>
          </Box>
        </CardContent>
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