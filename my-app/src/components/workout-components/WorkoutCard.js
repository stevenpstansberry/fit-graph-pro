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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Autocomplete, TextField, IconButton, Box, Modal, Card, CardContent, Button, Typography, Alert, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExerciseSubcard from "./ExerciseSubCard";
import { v4 as uuidv4 } from 'uuid';
import { getUser } from '../../services/AuthService';
import { getAllExercises } from "../../services/ExerciseDBAPIServices";

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
 * @param {function} props.showSnackbar - Function to display a snackbar message in Workout Page.
 * @returns {React.Element} - The rendered WorkoutCard component.
 */
function WorkoutCard({ open, onClose, preloadedExercises, mode, newSplitName, type, editMode, ToEditId, ToEditDate, manageWorkoutOrSplit, showSnackbar }) {
  const user = getUser();

// ======== State for managing input and UI interactions ========
const [inputValue, setInputValue] = useState(''); // Input value for the exercise search
const [loading, setLoading] = useState(true); // Loading state for API call



// ======== State for managing exercises and workout data ========
const [exercises, setExercises] = useState([]); // List of exercises added to the workout
const [selectedExercise, setSelectedExercise] = useState(null); // Currently selected exercise from the dropdown
const [availableExercises, setAvailableExercises] = useState([]); // State for available exercises in the dropdown
const [exercisesFetched, setExercisesFetched] = useState(false); // State to track if exercises have been fetched

// ======== State for managing workout and split modes ========
const [isEditMode, setIsEditMode] = useState(editMode || false); // State to determine if editing mode is enabled
const [uniqueId, setUniqueId] = useState(''); // Unique ID for the workout or split
const [workoutDate, setWorkoutDate] = useState(null); // Date of the workout


  // Initialize workout metadata and preload exercises when the modal opens
  useEffect(() => {
    if (open) {
      setExercises(preloadedExercises); // Set the preloaded exercises
      setUniqueId(uuidv4()); // Generate a unique ID for the workout
  
      // Set edit mode if passed in
      if (editMode) {
        setIsEditMode(true);
        setUniqueId(ToEditId);
        setWorkoutDate(ToEditDate);
      } else {
        console.log(mode);
        setWorkoutDate(new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })); // Set today's date with time for the workout
        setIsEditMode(false);
        console.log("returned back to normal mode");
      }
  
      // Fetch exercises from ExerciseDB API and transform the data only if not fetched before
      if (!exercisesFetched) {
        fetchExercises();
      }
    }
  }, [open, preloadedExercises, editMode]);
  
/**
 * Fetches all exercises from the ExerciseDB API and transforms them to the required format.
 * Filters out exercises that are already preloaded and sets the available exercises in state.
 */
const fetchExercises = async () => {
  if (exercisesFetched) return; // Ensure fetchExercises is called only once

  setLoading(true);
  try {
    const data = await getAllExercises(); // Fetch all exercises
    console.log("ALL WORKOUTS!!!!!!!", data);

    // Use a Map to ensure uniqueness by exercise name
    const exerciseMap = new Map();

    data.forEach((exercise) => {
      const label = exercise.name.toLowerCase().trim(); // Normalize the name for uniqueness check

      if (!exerciseMap.has(label)) {
        const displayLabel = toTitleCase(exercise.name); // Title case for exercise name
        const displayBodyPart = toTitleCase(exercise.bodyPart); // Title case for body part

        console.log(`Processed Exercise: ${displayLabel}, Display Body Part: ${displayBodyPart}`); // Debugging log

        exerciseMap.set(label, {
          label: exercise.name, // Use 'name' as 'label'
          displayLabel: displayLabel, // Display name with proper capitalization
          bodyPart: exercise.bodyPart,
          displayBodyPart: displayBodyPart, // Display body part with proper capitalization
          muscles: exercise.secondaryMuscles
            ? [mapMuscleName(exercise.target), ...exercise.secondaryMuscles.map(mapMuscleName)].filter(Boolean) // Map muscles and filter out undefined values
            : [mapMuscleName(exercise.target)].filter(Boolean), // Map target muscle and filter out undefined values
          gifUrl: exercise.gifUrl,
          instructions: exercise.instructions,
        });
      }
    });

    // Convert Map back to an array for setting state
    const uniqueExercises = Array.from(exerciseMap.values());

    // Filter out exercises with bodyPart equal to 'cardio' and preloaded exercises from the available exercises
    const filteredExercises = uniqueExercises.filter(
      (exercise) =>
        exercise.bodyPart.toLowerCase() !== 'cardio' && // Exclude 'cardio' exercises
        !preloadedExercises.some((preloaded) => preloaded.label === exercise.label) // Exclude preloaded exercises
    );

    console.log("TRANSFORMED EXERCISES: ", filteredExercises); // Log transformed exercises to verify

    setAvailableExercises(filteredExercises); // Set the filtered exercises
    setExercisesFetched(true); 
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    showSnackbar("Failed to load exercises. Please try again later.", 'error');
  } finally {
    setLoading(false);
  }
};


/**
 * Converts a string to title case (capitalizes the first letter of each word).
 *
 * @function toTitleCase
 * @param {string} str - The string to convert.
 * @returns {string} - The title-cased string.
 */
const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};


  /**
  * Handles the end of a drag-and-drop operation to reorder exercises in the workout.
  *
  * If the dragged item is dropped outside a valid droppable area, the function exits early without making changes.
  * Otherwise, it creates a new reordered list of exercises by removing the dragged exercise from its
  * original position and inserting it at the new destination.
  *
  * @function onDragEnd
  * @param {Object} result - The result object provided by `react-beautiful-dnd` after a drag event.
  * @param {Object} result.source - The source object containing information about the starting point of the dragged item.
  * @param {number} result.source.index - The index of the exercise in the original list.
  * @param {Object} result.destination - The destination object containing information about where the dragged item is dropped.
  * @param {number} result.destination.index - The index where the exercise should be moved to in the new list.
  * @returns {void} Updates the state of exercises to reflect the new order after drag-and-drop.
  */

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedExercises = Array.from(exercises);
    const [movedExercise] = reorderedExercises.splice(result.source.index, 1);
    reorderedExercises.splice(result.destination.index, 0, movedExercise);

    setExercises(reorderedExercises);
  };


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
        displayLabel: selectedExercise.displayLabel,
        bodyPart: selectedExercise.bodyPart, 
        displayBodyPart: selectedExercise.displayBodyPart, 
        muscles: selectedExercise.muscles,
        sets: [{ weight: "", reps: "" }] 
      };

      setExercises([...exercises, newExercise]);

      // Remove the selected exercise from the dropdown options
      setAvailableExercises((prevExercises) =>
        prevExercises.filter((exercise) => exercise.label !== selectedExercise.label)
      );
      setSelectedExercise(null);  // Reset the selected exercise
      showSnackbar(`${selectedExercise.displayLabel} added successfully.`, 'success');
    } else {
      showSnackbar("Please select an exercise to add.", 'error');;
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
    showSnackbar(`${exerciseToRemove.displayLabel} removed successfully.`, 'success');
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
      showSnackbar("Workout is empty, add sets.", 'error');
      return;
    }

    if (mode === "createWorkout") {
      // Check to see if any of the reps or weights are empty
      const isAnyExerciseEmpty = exercises.some(exercise => 
        exercise.sets.length === 0 || exercise.sets.some(set => set.weight === '' || set.reps === '')
      );

      if (isAnyExerciseEmpty) {
        showSnackbar("One or more exercises have empty sets, please fill them in.", 'error');
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
        showSnackbar("One or more exercises have empty sets.", 'error');
        return;
      }

      const workoutSplit = {
        splitId: uniqueId,
        name: newSplitName, 
        username: user.username,
        exercises: exercises.map(exercise => ({
          label: exercise.label,
          displayLabel: exercise.displayLabel,
          bodyPart: exercise.bodyPart,
          displayBodyPart: exercise.displayBodyPart, 
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

/**
 * Maps API muscle names to the acceptable names for react-body-highlighter.
 *
 * @function mapMuscleName
 * @param {string} muscleName - The muscle name from the API.
 * @returns {string|null} - The mapped muscle name or null if it doesn't match any acceptable name.
 */
const mapMuscleName = (muscleName) => {
  const muscleMapping = {
    // Chest
    "pectorals": "chest",
    "chest": "chest",

    // Back
    "upper back": "upper-back",
    "lower back": "lower-back",
    "trapezius": "trapezius",
    "traps": "trapezius",

    // Arms
    "biceps": "biceps",
    "triceps": "triceps",
    "forearms": "forearm",
    "deltoids": "front-deltoids",
    "rear deltoids": "back-deltoids",

    // Abs
    "abdominals": "abs",
    "lower abs": "abs", 
    "obliques": "obliques",

    // Legs
    "adductors": "adductor",
    "inner thighs": "adductor", 
    "quads": "quadriceps",
    "quadriceps": "quadriceps",
    "hamstrings": "hamstring",
    "calves": "calves",
    "glutes": "gluteal",
    "abductors": "abductors",
    "soleus": "calves", 

    // Head
    "neck": "neck",
    "sternocleidomastoid": "neck", 
    "head": "head",
  };

  // Return the mapped muscle name if found, otherwise return undefined to discard
  return muscleMapping[muscleName.toLowerCase()];
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

          {mode === 'createWorkout' && (
            <>
              {/* Date Picker */}
              <TextField
                label="Workout Date"
                type="datetime-local"
                value={formatDateToDatetimeLocal(new Date(workoutDate))}
                onChange={handleDateChange}
                sx={{ width: 300, mr: 2 }}
              />
            </>
          )}

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
            getOptionLabel={(option) => option.displayLabel} // Use displayLabel for the dropdown
            isOptionEqualToValue={(option, value) => option.label === value.label} // Compare based on the internal label
            renderInput={(params) => <TextField {...params} label="Exercise" />}
          />
            <Button onClick={addExercise} variant="contained" color="primary">
              Add Exercise
            </Button>
          </Box>

          {/* List of exercises with drag-and-drop support */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="exercises">
              {(provided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                  {exercises.map((exercise, index) => (
                    console.log("EXERCISE: ", exercise),
                    <Draggable key={exercise.displayLabel} draggableId={exercise.displayLabel} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <ExerciseSubcard
                            key={index}
                            exercise={exercise}
                            index={index}
                            removeExercise={removeExercise}
                            updateExerciseSets={updateExerciseSets}
                            allowWeightAndReps={mode === "createWorkout"}
                            showSnackbar={showSnackbar}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>

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

