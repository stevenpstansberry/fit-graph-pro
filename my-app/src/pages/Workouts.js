/**
 * @fileoverview Component to manage and display user workouts and splits.
 * 
 * @file src/pages/Workouts.js
 * 
 * Exposes the `Workouts` React component, which handles fetching, creating, updating,
 * and deleting workouts and splits for the authenticated user.
 * 
 * @version 1.0.0
 * @author Steven Stansberry
 */

// Imports
import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, CircularProgress, Snackbar, Alert, Tabs, Tab } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Workout_Card from '../components/workout-components/Workout_Card';
import { getUser,getSessionData, setSessionData } from '../services/AuthService';
import ViewWorkouts from '../components/workout-components/ViewWorkouts';
import StrengthChart from '../components/workout-components/StrengthChart';
import FuturePrediction from '../components/workout-components/FuturePrediction';
import HeatMap from '../components/workout-components/HeatMap';
import { uploadWorkout, uploadSplit, deleteWorkout, deleteSplit, getAllWorkouts, getAllSplits, updateWorkout, updateSplit } from '../services/APIServices';
import { useSearchParams } from 'react-router-dom';


/**
 * Main component to manage user workouts and splits.
 * 
 * @component
 * @returns {React.Element} - The rendered component.
 */
function Workouts() {
  const user = getUser();
  const username = user !== 'undefined' && user ? user.username : '';

  console.log(user);

// State declarations

// ======== Modal and Dialog States ========
const [isCardVisible, setIsCardVisible] = useState(false); // Controls visibility of workout card modal
const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // Controls visibility of edit dialog for workout splits
const [isCustomSplitDialogOpen, setIsCustomSplitDialogOpen] = useState(false); // Controls visibility of custom split dialog
const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // Controls visibility of confirmation dialog

// ======== Workout Management States ========
const [workoutHistory, setWorkoutHistory] = useState([]); // Stores the history of workouts
const [selectedWorkout, setSelectedWorkout] = useState([]); // Stores the currently selected workout for editing or viewing
const [workoutType, setWorkoutType] = useState("Default"); // Stores the type of workout (e.g., Default, Push, Pull, etc.)
const [cardMode, setCardMode] = useState('createWorkout'); // Determines the mode for the workout card (create or edit)
const [editMode, setEditMode] = useState(false); // Determines if the workout is in edit mode
const [toEditId, setToEditId] = useState(''); // Stores the ID of the workout being edited
const [toEditDate, setToEditDate] = useState(''); // Stores the Date of the workout being edited


// ======== Split Management States ========
const [userSplits, setUserSplits] = useState([]); // Stores the user's workout splits
const [newSplitName, setNewSplitName] = useState(""); // Stores the name of a new workout split
const [customSplitName, setCustomSplitName] = useState(""); // Temporary storage for custom split name input
const [tempSplitName, setTempSplitName] = useState({}); // Temporary storage for editing split names


// ======== Snackbar and Notification States ========
const [snackbarOpen, setSnackbarOpen] = useState(false); // Controls visibility of snackbar notifications
const [snackbarMessage, setSnackbarMessage] = useState(''); // Stores the message to be displayed in the snackbar
const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Stores the severity level of the snackbar (success, error, etc.)

// ======== Deletion States ========
const [itemToDelete, setItemToDelete] = useState(null); // Stores the ID of the item to be deleted (workout or split)
const [deleteType, setDeleteType] = useState(''); // Stores the type of item to be deleted ('workout' or 'split')

// ======== Loading and UI States ========
const [isLoading, setIsLoading] = useState(true); // Controls the loading state for data fetching or processing

// ======== Date and Time Management States ========
const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Stores the selected month for filtering workouts
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Stores the selected year for filtering workouts

// ======== Tab and Search Management States ========
const [searchParams] = useSearchParams(); // Handles URL search parameters
const initialTabIndex = parseInt(searchParams.get('tabIndex')) || 0; // Gets 'tabIndex' from URL or defaults to 0
const [tabIndex, setTabIndex] = useState(initialTabIndex); // Controls the active tab index



  // Fetch from API using APIServices
  useEffect(() => {
    if (username) {
      fetchWorkoutsAndSplits();
    }
  }, [username]);
  
  /**
   * Fetches workouts and splits for the user and updates state.
   * Checks session storage first to avoid redundant API calls.
   */
  const fetchWorkoutsAndSplits = async () => {
    setIsLoading(true); // Start loading for load icon
    try {
      // Attempt to retrieve from session storage first
      const storedWorkouts = getSessionData('workouts');
      const storedSplits = getSessionData('splits');
  
      if (storedWorkouts) {
        // Parse date strings back into Date objects
        const parsedWorkouts = storedWorkouts.map(workout => ({
          ...workout,
          date: new Date(workout.date), // Convert back to Date object
        }));
        setWorkoutHistory(parsedWorkouts);
      } else {
        await fetchWorkouts(); // Fetch from API if not found in session
      }
  
      if (storedSplits) {
        setUserSplits(storedSplits);
      } else {
        await fetchSplits(); // Fetch from API if not found in session
      }
    } finally {
      setIsLoading(false); // End loading for load icon
    }
  };
  
  
/**
 * Fetches workouts for the user and updates state.
 */
const fetchWorkouts = async () => {
  try {
    const data = await getAllWorkouts(username);
    console.log('Workouts API Response:', data);

    if (data && Array.isArray(data)) {
      // Convert date strings to Date objects and format workouts
      const formattedWorkouts = data.map(workout => ({
        ...workout,
        date: new Date(workout.date), // Convert date to Date object
      }));

      // Sort workouts by date in ascending order (earliest to latest)
      const sortedWorkouts = formattedWorkouts.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Update the workout history state with sorted workouts
      setWorkoutHistory(sortedWorkouts);
      
      // Convert Date objects to ISO strings for storage
      const workoutsToStore = sortedWorkouts.map(workout => ({
        ...workout,
        date: workout.date.toISOString(),
      }));
      
      // Save sorted workouts to session storage
      setSessionData('workouts', workoutsToStore);
    }
  } catch (error) {
    console.error('Error fetching workouts:', error);
  }
};

  
  /**
   * Fetches splits for the user and updates state.
   */
  const fetchSplits = async () => {
    try {
      const data = await getAllSplits(username);
      console.log('Splits API Response:', data);
  
      if (data && Array.isArray(data)) {
        const formattedSplits = data.map(split => ({
          splitId: split.splitId,
          name: split.splitName,
          exercises: split.exercises,
        }));
        setUserSplits(formattedSplits);
        
        // Save splits to session storage
        setSessionData('splits', formattedSplits);
      }
    } catch (error) {
      console.error('Error fetching splits:', error);
    }
  };
  console.log(userSplits);


  /**
   * Handles tab change.
   * Prevent changing tabs if there are no workouts available.
   * 
   * @param {Object} event - The event object.
   * @param {number} newValue - The new value of the selected tab.
   */
  const handleTabChange = (event, newValue) => {
      setTabIndex(newValue);
  };

  /**
   * Toggles the visibility of the workout card and sets its mode.
   * 
   * @param {Array} workout - The selected workout exercises.
   * @param {string} mode - The mode of the workout card ('createWorkout' or 'addSplit').
   * @param {string} workoutType - The type of workout.
   */
  const toggleAddWorkoutCard = (workout, mode, workoutType) => {
    setWorkoutType(workoutType);
    setSelectedWorkout(workout);
    setCardMode(mode); 
    setIsCardVisible(!isCardVisible);
  };

  /**
   * Toggles the visibility of the workout card and sets its mode to edit.
   * 
   * @param {Array} workout - The selected workout exercises.
   * @param {string} mode - The mode of the workout card ('createWorkout' or 'addSplit').
   * @param {string} workoutType - The type of workout.
   */
  const toggleEditWorkoutCard = (workout, mode, workoutType) => {
    setEditMode(true)
    setWorkoutType(workoutType);
    setSelectedWorkout(workout);
    setCardMode(mode); 
    setIsCardVisible(!isCardVisible);
  };

  /**
   * Closes the workout card modal.
   */
  const handleClose = () => {
    setIsCardVisible(false);
    setEditMode(false); // Set edit workout mode back to false.
    setSelectedWorkout([]);
  };


  /**
   * Confirm and delete the selected item (workout or split)
   */
  const confirmDelete = async () => {
    if (deleteType === 'workout') {
      try {
        // Delete the workout from the backend
        await deleteWorkout(itemToDelete);
        
        // Update state
        const updatedWorkouts = workoutHistory.filter(workout => workout.workoutId !== itemToDelete);
        setWorkoutHistory(updatedWorkouts);

        // Update session storage
        const workoutsToStore = updatedWorkouts.map(workout => ({
          ...workout,
          date: workout.date.toISOString(), // Store date as a string in ISO format
        }));
        setSessionData('workouts', workoutsToStore); // Save to session storage

        // Show success Snackbar
        setSnackbarMessage('Workout deleted successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Failed to delete workout:", error);

        // Show error Snackbar
        setSnackbarMessage('Failed to delete workout.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } else if (deleteType === 'split') {
      try {
        // Delete the split from the backend
        await deleteSplit(itemToDelete);
        
        // Update state
        const updatedSplits = userSplits.filter(split => split.splitId !== itemToDelete);
        setUserSplits(updatedSplits);

        // Update session storage
        setSessionData('splits', updatedSplits); // Save to session storage

        // Show success Snackbar
        setSnackbarMessage('Split deleted successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Failed to delete split:", error);

        // Show error Snackbar
        setSnackbarMessage('Failed to delete split.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }

    setConfirmDialogOpen(false); // Close confirmation dialog after deleting
  };


  /**
   * Deletes a workout by ID.
   * 
   * @param {string} workoutId - The ID of the workout to delete.
   */  
  const handleDeleteWorkout = (workoutId) => {
    setItemToDelete(workoutId);
    setDeleteType('workout');
    setConfirmDialogOpen(true);
  };


    /**
   * Edits a workout
   * 
   * @param {object} workout - The workout to be edited
   */ 
    const handleEditWorkout = (workout) => {
      setToEditId(workout.workoutId);
      setToEditDate(workout.date);
      console.log(workout.date);
      toggleEditWorkoutCard(workout.exercises, 'createWorkout', workout.type)
      
    }

  const handleEditSplit = (split) => {
    console.log("split id being edited: ", split.splitId);
    setEditMode(true);
    setToEditId(split.splitId);
    setSelectedWorkout(split.exercises);
    setNewSplitName(customSplitName);
    setIsCardVisible(true);
    setCardMode("addSplit");
    setIsCustomSplitDialogOpen(false);
  }


  

  /**
   * Saves a workout to the backend and updates state.
   * 
   * @async
   * @param {Object} workout - The workout object to save.
   */
  const saveWorkout = async (workout) => {
    try {
      const workoutWithDate = {
        ...workout,
        date: new Date(workout.date), // Ensure the date is a Date object
      };

      // Update state
      const updatedWorkoutHistory = [...workoutHistory, workoutWithDate];
      setWorkoutHistory(updatedWorkoutHistory);
      console.log("Saved Workout: ", workoutWithDate);

      // Update session storage with the new workout
      const workoutsToStore = updatedWorkoutHistory.map(workout => ({
        ...workout,
        date: workout.date.toISOString(), // Store date as a string in ISO format
      }));
      setSessionData('workouts', workoutsToStore); // Save to session storage

      // Upload the workout to the backend
      await uploadWorkout(workout);
      console.log("Workout uploaded Successfully");

      // Show success Snackbar
      setSnackbarMessage('Workout added successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to upload workout: ", error);

      // Show error Snackbar
      setSnackbarMessage('Failed to add workout.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

/**
 * Updates an existing workout in the backend and updates state.
 * 
 * @async
 * @param {Object} workout - The workout object to update.
 */
const putWorkout = async (workout) => {
  try {
    const workoutWithDate = {
      ...workout,
      date: new Date(workout.date), // Ensure the date is a Date object
    };

    // Find the index of the workout to be updated
    const workoutIndex = workoutHistory.findIndex(w => w.workoutId === workout.workoutId);
    
    // If workout exists, update it in the state
    if (workoutIndex !== -1) {
      const updatedWorkoutHistory = [...workoutHistory];
      updatedWorkoutHistory[workoutIndex] = workoutWithDate;
      setWorkoutHistory(updatedWorkoutHistory);
      console.log("Updated Workout: ", workoutWithDate);

      // Update session storage with the updated workout
      const workoutsToStore = updatedWorkoutHistory.map(workout => ({
        ...workout,
        date: workout.date.toISOString(), // Store date as a string in ISO format
      }));
      setSessionData('workouts', workoutsToStore); // Save to session storage

      // Update the workout in the backend
      await updateWorkout(workout.workoutId, workoutWithDate);
      console.log("Workout updated Successfully");

      // Show success Snackbar
      setSnackbarMessage('Workout updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } else {
      console.error("Workout not found for update.");
    }
  } catch (error) {
    console.error("Failed to update workout: ", error);

    // Show error Snackbar
    setSnackbarMessage('Failed to update workout.');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  }
};

/**
 * Updates an existing workout split in the backend and updates state.
 * 
 * @async
 * @param {Object} split - The split object to update.
 */
const putSplit = async (split) => {
  try {
    // Find the index of the split to be updated
    const splitIndex = userSplits.findIndex(s => s.splitId === split.splitId);
    
    // If the split exists, update it in the state
    if (splitIndex !== -1) {
      const updatedSplits = [...userSplits];
      updatedSplits[splitIndex] = split; // Update the split with the new data
      setUserSplits(updatedSplits);
      console.log("Updated Split: ", split);

      // Update session storage with the updated split
      setSessionData('splits', updatedSplits); // Save to session storage

      // Update the split in the backend
      await updateSplit(split.splitId, split);
      console.log("Split updated Successfully");

      // Show success Snackbar
      setSnackbarMessage('Split updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } else {
      console.error("Split not found for update.");
    }
  } catch (error) {
    console.error("Failed to update split: ", error);

    // Show error Snackbar
    setSnackbarMessage('Failed to update split.');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  }
};


  /**
   * Saves a workout split to the backend and updates state.
   * 
   * @async
   * @param {Object} split - The split object to save.
   */
  const saveSplit = async (split) => {
    try {
      // Update state
      const updatedUserSplits = [...userSplits, split];
      setUserSplits(updatedUserSplits);
      console.log("Saved Workout Split: ", split);

      // Update session storage with the new split
      setSessionData('splits', updatedUserSplits); // Save to session storage

      // Upload the split to the backend
      await uploadSplit(split);
      console.log("Split uploaded successfully: ", split)

      // Show success Snackbar
      setSnackbarMessage('Split added successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to upload split: ", error);

      // Show error Snackbar
      setSnackbarMessage('Failed to add split.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  /**
   * Closes snackbar alert
   */
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  /**
   * Closes confirm dialog alert
   */
  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };





  /**
   * Filters workouts based on the selected month and year.
   * 
   * @returns {Array} - The filtered list of workouts.
   */
  const filteredWorkouts = workoutHistory.filter(workout => {
    const workoutMonth = workout.date.getMonth() + 1;
    const workoutYear = workout.date.getFullYear();
    return workoutMonth === selectedMonth && workoutYear === selectedYear;
  });

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  /**
   * Opens the edit dialog for workout splits.
   */
  const handleOpenEditDialog = () => {
    setIsEditDialogOpen(true);
  };

  /**
   * Closes the edit dialog for workout splits.
   */
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };



  /**
   * Deletes a workout split by ID.
   * 
   * @param {string} splitId - The ID of the split to delete.
   */
  const handleDeleteSplit = (splitId) => {
    setItemToDelete(splitId);
    setDeleteType('split');
    setConfirmDialogOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-delete-dialog"
      >
        <DialogTitle id="confirm-delete-dialog">Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteType === 'workout' ? 'workout' : 'split'}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ width: '100%' }}>
        <Navbar />
      </Box>

      {/* Tabs for toggling between different views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="View Workouts" />
          <Tab label="Graph Workout History" />
          <Tab label="Predict Future Performance" />
          <Tab label="Heat Map" /> 
        </Tabs>
      </Box>

      {isLoading ? (
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {tabIndex === 0 && (
            <ViewWorkouts
              name={username}
              filteredWorkouts={filteredWorkouts}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              toggleAddWorkoutCard={toggleAddWorkoutCard}
              userSplits={userSplits}
              handleDeleteWorkout={handleDeleteWorkout}
              handleOpenEditDialog={handleOpenEditDialog}
              workoutHistory={workoutHistory}
              handleEditWorkout={handleEditWorkout}
            />
          )}

          {tabIndex === 1 && (
            <Box>
              {/* Graph Workout History */}
              <StrengthChart
                workoutHistory={workoutHistory}
                filteredWorkouts={filteredWorkouts}
                selectedMonth={monthNames[selectedMonth - 1]}
                selectedYear={selectedYear}
                setSelectedMonth={setSelectedMonth}
                setSelectedYear={setSelectedYear}

              />
            </Box>
          )}

          {tabIndex === 2 && (
            <Box>
              {/* Predict Future Performance */}
              <FuturePrediction workoutHistory={workoutHistory} />
            </Box>
          )}
          {tabIndex === 3 && (
            <Box>
              {/* Heat Map */}
              <HeatMap workoutHistory={workoutHistory} /> 
            </Box>      
          )}
        </>
      )}

      {/* Footer */}
      <Box sx={{ width: '100%' }}>
        <Footer />
      </Box>

      {/* Add/Edit Dialogs */}
      <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog}>
      <DialogTitle>Edit Workout Splits</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Available Workout Splits</Typography>
        
        {/* Check if there are any user splits */}
        {userSplits.length > 0 ? (
          userSplits.map((split, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <TextField
              value={tempSplitName[index] !== undefined ? tempSplitName[index] : split.name} 
              onChange={(e) => {
                const updatedTempSplitName = { ...tempSplitName, [index]: e.target.value }; // Update temp name on change
                setTempSplitName(updatedTempSplitName);
              }}
              onBlur={() => {
                // Only update if the name has changed
                if (tempSplitName[index] !== undefined && tempSplitName[index] !== split.name) {
                  const updatedSplits = [...userSplits];
                  updatedSplits[index].name = tempSplitName[index]; // Save temp value to actual state
                  setUserSplits(updatedSplits);
                  putSplit(updatedSplits[index]); // Save to DB
                }
              }}
              sx={{ mr: 2 }}
            />
              {/* Edit Button */}
              <IconButton
                color="primary"
                onClick={() => handleEditSplit(split)}
                sx={{ mr: 1 }}  
              >
                <EditIcon />
              </IconButton>
              {/* Delete Button */}
              <IconButton color="error" onClick={() => handleDeleteSplit(split.splitId)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))
        ) : (
          // Display message when there are no splits
          <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
            Add your first split!
          </Typography>
        )}

        {/* Button to add a new custom split */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
          {console.log('Current number of splits:', userSplits.length)} {/* Log the length of userSplits */}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              if (userSplits.length >= 8) {
                // Show error Snackbar if there are already 9 splits
                setSnackbarMessage('You cannot have more than 9 splits.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
              } else {
                // Open the dialog to add a new custom split
                setIsCustomSplitDialogOpen(true);
              }
            }}
          >
            Add Custom Split
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEditDialog} color="primary">Done</Button>
      </DialogActions>
    </Dialog>


      <Dialog open={isCustomSplitDialogOpen} onClose={() => setIsCustomSplitDialogOpen(false)}>
        <DialogTitle sx={{ pb: 2 }}>Name Your Custom Split</DialogTitle>
        <DialogContent sx={{ minWidth: 500, minHeight: 200 }}>
          <TextField
            label="Split Name"
            value={customSplitName}
            onChange={(e) => setCustomSplitName(e.target.value)}
            sx={{
              width: 500,
              mb: 2,
              '& .MuiInputLabel-root': { fontSize: '1rem' },
              '& .MuiInputBase-root': { paddingRight: 2 },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setNewSplitName(customSplitName);
              setIsCardVisible(true);
              setCardMode("addSplit");
              setIsCustomSplitDialogOpen(false);
            }}
          >
            Create Split
          </Button>
        </DialogContent>
      </Dialog>

      <Workout_Card
        open={isCardVisible}
        onClose={handleClose}
        preloadedExercises={selectedWorkout}
        mode={cardMode}
        saveWorkout={saveWorkout}
        saveSplit={saveSplit}
        newSplitName={newSplitName}
        type={workoutType}
        {...(editMode && { editMode: editMode })}
        ToEditId={toEditId}
        putWorkout={putWorkout}
        putSplit={putSplit}
        ToEditDate={toEditDate}
      />
    </Box>
  );
}


export default Workouts;
