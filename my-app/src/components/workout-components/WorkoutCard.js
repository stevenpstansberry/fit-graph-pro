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
import { Autocomplete, TextField, IconButton, Box, Modal, Card, CardContent, Button, Typography, Alert, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExerciseSubcard from "./ExerciseSubCard";
import { v4 as uuidv4 } from 'uuid';
import { getUser } from '../../services/AuthService';

/**
 * WorkoutCard component for managing and creating workouts or workout splits.
 * Provides a modal interface to add exercises, specify sets, weights, and reps, and save or update the data.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Boolean to control the modal open/close state.
 * @param {function} props.onClose - Function to close the modal.
 * @param {Array} props.preloadedExercises - Array of exercises to preload into the workout or split.
 * @param {string} props.mode - Mode of operation for the component ('createWorkout' or 'addSplit').
 * @param {string} props.newSplitName - Name of the new workout split.
 * @param {string} props.type - Type of workout.
 * @param {boolean} props.editMode - Determines if in edit mode.
 * @param {string} props.ToEditId - The ID of the workout or split being edited.
 * @param {string} props.ToEditDate - The date of the workout or split being edited.
 * @param {function} props.manageWorkoutOrSplit - Function to manage (save or update) a workout or split to the backend.
 * @returns {React.Element} - The rendered WorkoutCard component.
 */
function WorkoutCard({ open, onClose, preloadedExercises, mode, newSplitName, type, editMode, ToEditId, ToEditDate, manageWorkoutOrSplit }) {
  const user = getUser();

// ======== State for managing input and UI interactions ========
const [inputValue, setInputValue] = useState(''); // Input value for the exercise search
const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message content
const [snackbarOpen, setSnackbarOpen] = useState(false); // State for controlling Snackbar visibility


// ======== State for managing exercises and workout data ========
const [exercises, setExercises] = useState([]); // List of exercises added to the workout
const [selectedExercise, setSelectedExercise] = useState(null); // Currently selected exercise from the dropdown
const [availableExercises, setAvailableExercises] = useState(strengthWorkouts); // State for available exercises in the dropdown

// ======== State for managing workout and split modes ========
const [isEditMode, setIsEditMode] = useState(editMode || false); // State to determine if editing mode is enabled
const [uniqueId, setUniqueId] = useState(''); // Unique ID for the workout or split
const [workoutDate, setWorkoutDate] = useState(null); // Date of the workout


  // Initialize workout metadata and preload exercises when the modal opens
  useEffect(() => {
    if (open) {
      setExercises(preloadedExercises);
      setUniqueId(uuidv4()); // Generate a unique ID for the workout


      // Filter out preloaded exercises from the available exercises
      const filteredExercises = strengthWorkouts.filter(
        (exercise) => !preloadedExercises.some(preloaded => preloaded.label === exercise.label)
      );
      setAvailableExercises(filteredExercises);

      // Set edit mode if passed in
      if (editMode) {
        setIsEditMode(true);
        setUniqueId(ToEditId)
        console.log("old workout date", workoutDate);
        setWorkoutDate(ToEditDate);
        console.log("workout date: ", workoutDate);
        console.log('!!!!!!in edit mode for: ', uniqueId);
        // Additional initialization for edit mode if needed
      } else {
        setWorkoutDate(new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })); // Set today's date with time for the workout
        setIsEditMode(false);
        console.log("returned back to normal mode");
      }
    }
  }, [open, preloadedExercises, editMode]);

/**
 * Formats a Date object to a string in the format "YYYY-MM-DDTHH:mm",
 * suitable for use with <input type="datetime-local"> HTML elements.
 * Adjusts the date to the local timezone offset.
 * 
 * @function formatDateToDatetimeLocal
 * @param {Date} date - The Date object to format.
 * @returns {string} A formatted date string in "YYYY-MM-DDTHH:mm" format.
 */
const formatDateToDatetimeLocal = (date) => {
  // Get the timezone offset in minutes
  const offset = date.getTimezoneOffset();
  // Create a new date adjusted to the local timezone
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  // Convert to ISO string and slice to "YYYY-MM-DDTHH:mm" format
  return localDate.toISOString().slice(0, 16);
};

/**
 * Handles the change event for a date input field.
 * Converts the selected date to an ISO string format and updates the workout date state.
 * 
 * @function handleDateChange
 * @param {Object} e - The event object from the date input field.
 * @param {string} e.target.value - The selected date value from the input field.
 */
const handleDateChange = (e) => {
  // Create a Date object from the input value
  const selectedDate = new Date(e.target.value);
  // Convert the date to ISO string format and update state
  setWorkoutDate(selectedDate.toISOString());
};

  /**
   * Adds a new exercise to the exercises list.
   */
  const addExercise = () => {
    if (selectedExercise) {
      const newExercise = { 
        label: selectedExercise.label, 
        bodyPart: selectedExercise.bodyPart, 
        muscles: selectedExercise.muscles,
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
      setSnackbarMessage("Workout is empty, add sets.");
      setSnackbarOpen(true);
      return;
    }

    if (mode === "createWorkout") {
      // Check to see if any of the reps or weights are empty
      const isAnyExerciseEmpty = exercises.some(exercise => 
        exercise.sets.length === 0 || exercise.sets.some(set => set.weight === '' || set.reps === '')
      );

      if (isAnyExerciseEmpty) {
        setSnackbarMessage("One or more exercises have empty sets, please fill them in.");
        setSnackbarOpen(true);
        return;
      }

      let workout = {
        workoutId: uniqueId,
        date: workoutDate, // Already in ISO string format
        username: user.username,
        type: type,
        exercises: exercises,
      };
      if (!isEditMode){
        manageWorkoutOrSplit(workout, 'workout', 'save');
      } else {
        manageWorkoutOrSplit(workout, 'workout', 'update');
      }
    }

    // Logic for "addSplit" mode
    if (mode === "addSplit") {
      // Only check that exercises and set counts are provided (no weights/reps validation)
      const isAnySetEmpty = exercises.some(exercise => exercise.sets.length === 0);

      if (isAnySetEmpty) {
        setSnackbarMessage("One or more exercises have empty sets.");
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
          muscles: exercise.muscles,
          sets: exercise.sets.map(set => ({ setCount: set.setCount })) // Only include set count
        })),
      };
      if (!isEditMode){
        manageWorkoutOrSplit(workoutSplit, 'split', 'save');
      } else {
        manageWorkoutOrSplit(workoutSplit, 'split', 'update');
      }
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

          {/* Date Picker */}
          <TextField
            label="Workout Date"
            type="datetime-local"
            value={formatDateToDatetimeLocal(new Date(workoutDate))}
            onChange={handleDateChange}
            sx={{ width: 300, mr: 2 }}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              position: 'sticky',
              top: 0,
              zIndex: 10,
              backgroundColor: 'white',
              paddingTop: 2,
              paddingBottom: 2,
              borderBottom: '1px solid #ccc',
            }}
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={availableExercises}
              value={selectedExercise}
              onChange={(event, newValue) => {
                setSelectedExercise(newValue);
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              sx={{ width: 300, mr: 2 }} // Adjust width and margin
              renderInput={(params) => <TextField {...params} label="Exercise" />}
            />
            <Button onClick={addExercise} variant="contained" color="primary">
              Add Exercise
            </Button>


            <Snackbar
              open={snackbarOpen}
              autoHideDuration={4000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              sx={{ position: 'absolute', right: 180, bottom: 20 }}
            >
              <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
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
                allowWeightAndReps={mode === "createWorkout"}
                snackbarMessage={snackbarMessage}
                setSnackbarMessage={setSnackbarMessage}
                snackbarOpen={snackbarOpen}
                setSnackbarOpen={setSnackbarOpen}
              />
            ))}
          </Box>

          {/* Create Workout button at the bottom */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
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

export default WorkoutCard;

// List of strength workout exercises for the autocomplete
const strengthWorkouts = [
  { label: 'Bench Press', type: 'Strength', bodyPart: 'Chest', muscles: ['chest', 'triceps', 'front-deltoids'] },
  { label: 'Squat', type: 'Strength', bodyPart: 'Legs', muscles: ['quadriceps', 'hamstring', 'gluteal', 'calves'] },
  { label: 'Deadlift', type: 'Strength', bodyPart: 'Back', muscles: ['lower-back', 'hamstring', 'gluteal', 'trapezius'] },
  { label: 'Overhead Press', type: 'Strength', bodyPart: 'Shoulders', muscles: ['front-deltoids', 'triceps'] },
  { label: 'Barbell Row', type: 'Strength', bodyPart: 'Back', muscles: ['upper-back', 'biceps', 'lower-back', 'trapezius'] },
  { label: 'Bicep Curl', type: 'Strength', bodyPart: 'Arms', muscles: ['biceps'] },
  { label: 'Tricep Extension', type: 'Strength', bodyPart: 'Arms', muscles: ['triceps'] },
  { label: 'Pull Up', type: 'Strength', bodyPart: 'Back', muscles: ['upper-back', 'biceps', 'trapezius'] },
  { label: 'Lunge', type: 'Strength', bodyPart: 'Legs', muscles: ['quadriceps', 'hamstring', 'gluteal', 'calves'] },
  { label: 'Leg Press', type: 'Strength', bodyPart: 'Legs', muscles: ['quadriceps', 'gluteal'] },
  { label: 'Chest Fly', type: 'Strength', bodyPart: 'Chest', muscles: ['chest'] },
  { label: 'Lat Pulldown', type: 'Strength', bodyPart: 'Back', muscles: ['upper-back', 'biceps', 'trapezius'] },
  { label: 'Hammer Curl', type: 'Strength', bodyPart: 'Arms', muscles: ['biceps', 'forearm'] },
  { label: 'Dumbbell Shoulder Press', type: 'Strength', bodyPart: 'Shoulders', muscles: ['front-deltoids', 'triceps'] },
  { label: 'Leg Curl', type: 'Strength', bodyPart: 'Legs', muscles: ['hamstring'] },
  { label: 'Leg Extension', type: 'Strength', bodyPart: 'Legs', muscles: ['quadriceps'] },
  { label: 'Incline Bench Press', type: 'Strength', bodyPart: 'Chest', muscles: ['chest', 'triceps', 'front-deltoids'] },
  { label: 'Decline Bench Press', type: 'Strength', bodyPart: 'Chest', muscles: ['chest', 'triceps', 'front-deltoids'] },
  { label: 'Calf Raise', type: 'Strength', bodyPart: 'Legs', muscles: ['calves'] },
  { label: 'Front Squat', type: 'Strength', bodyPart: 'Legs', muscles: ['quadriceps', 'gluteal', 'hamstring'] },
  { label: 'Reverse Lunge', type: 'Strength', bodyPart: 'Legs', muscles: ['quadriceps', 'hamstring', 'gluteal'] },
  { label: 'Goblet Squat', type: 'Strength', bodyPart: 'Legs', muscles: ['quadriceps', 'gluteal', 'hamstring'] },
  { label: 'Face Pull', type: 'Strength', bodyPart: 'Back', muscles: ['upper-back', 'trapezius', 'rear-deltoids'] },
  { label: 'Cable Row', type: 'Strength', bodyPart: 'Back', muscles: ['upper-back', 'biceps', 'trapezius'] },
  { label: 'Side Lateral Raise', type: 'Strength', bodyPart: 'Shoulders', muscles: ['back-deltoids', 'front-deltoids'] },
  { label: 'Bulgarian Split Squat', type: 'Strength', bodyPart: 'Legs', muscles: ['quadriceps', 'hamstring', 'gluteal'] },
  { label: 'Seated Dumbbell Press', type: 'Strength', bodyPart: 'Shoulders', muscles: ['front-deltoids', 'triceps'] },
  { label: 'Skull Crusher', type: 'Strength', bodyPart: 'Arms', muscles: ['triceps'] },
  { label: 'Dips', type: 'Strength', bodyPart: 'Chest', muscles: ['chest', 'triceps', 'front-deltoids'] },
  { label: 'Single-leg Deadlift', type: 'Strength', bodyPart: 'Legs', muscles: ['hamstring', 'gluteal', 'lower-back'] },
  { label: 'Russian Twist', type: 'Strength', bodyPart: 'Core', muscles: ['obliques', 'abs'] },
  { label: 'Hanging Leg Raise', type: 'Strength', bodyPart: 'Core', muscles: ['abs', 'obliques'] },
  { label: 'Farmers Walk', type: 'Strength', bodyPart: 'Full Body', muscles: ['forearm', 'trapezius', 'abs', 'calves'] },
  { label: 'Neck Curl', type: 'Strength', bodyPart: 'Neck', muscles: ['neck'] },
  { label: 'Hip Adduction Machine', type: 'Strength', bodyPart: 'Legs', muscles: ['adductor'] },
  { label: 'Hip Abduction Machine', type: 'Strength', bodyPart: 'Legs', muscles: ['abductors'] },
  { label: 'Wrist Curl', type: 'Strength', bodyPart: 'Arms', muscles: ['forearm'] },
  { label: 'Hanging Oblique Crunch', type: 'Strength', bodyPart: 'Core', muscles: ['obliques'] },
  { label: 'Landmine Rotation', type: 'Strength', bodyPart: 'Core', muscles: ['obliques', 'abs'] },
  { label: 'Reverse Hyperextension', type: 'Strength', bodyPart: 'Back', muscles: ['lower-back', 'gluteal', 'hamstring'] },
  { label: 'Good Morning', type: 'Strength', bodyPart: 'Back', muscles: ['lower-back', 'hamstring', 'gluteal'] }
];
