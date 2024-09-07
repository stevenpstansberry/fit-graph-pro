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
import { Container, Typography, Button, Box, Select, MenuItem, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, CircularProgress, Snackbar, Alert, Tooltip, Tabs, Tab } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Workout_Card from '../components/Workout_Card';
import { getUser,getSessionData, setSessionData } from '../services/AuthService';
import WorkoutCardPreview from '../components/WorkoutCardPreview';
import StrengthChart from '../components/StrengthChart';
import FuturePrediction from '../components/FuturePrediction';
import HeatMap from '../components/HeatMap';
import { uploadWorkout, uploadSplit, deleteWorkout, deleteSplit, getAllWorkouts, getAllSplits } from '../services/APIServices';



// TODO: add logic to see avg growth for exercises, max, estimated time to reach goal...
// TODO: add logic to store workouts in session

/**
 * Main component to manage user workouts and splits.
 * 
 * @component
 * @returns {React.Element} - The rendered component.
 */
function Workouts() {
  const user = getUser();
  const name = user !== 'undefined' && user ? user.name : '';
  console.log(user);

  // State declarations
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [cardMode, setCardMode] = useState('createWorkout');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedWorkout, setSelectedWorkout] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSplitName, setNewSplitName] = useState("");
  const [newWorkoutExercises, setNewWorkoutExercises] = useState([]);
  const [userSplits, setUserSplits] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSplitForEditing, setSelectedSplitForEditing] = useState({});
  const [editedName, setEditedName] = useState('');
  const [isCustomSplitDialogOpen, setIsCustomSplitDialogOpen] = useState(false);
  const [customSplitName, setCustomSplitName] = useState("");
  const [workoutType, setWorkoutType] = useState("Default");
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(''); // 'workout' or 'split'
  const [tabIndex, setTabIndex] = useState(0);

  // Fetch from API using APIServices
  useEffect(() => {
    if (name) {
      fetchWorkoutsAndSplits();
    }
  }, [name]);
  
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
    const data = await getAllWorkouts(name);
    console.log('Workouts API Response:', data);

    if (data && Array.isArray(data)) {
      const formattedWorkouts = data.map(workout => ({
        ...workout,
        date: new Date(workout.date), // Convert date to Date object
      }));
      setWorkoutHistory(formattedWorkouts);
      
      // Convert Date objects to ISO strings for storage
      const workoutsToStore = formattedWorkouts.map(workout => ({
        ...workout,
        date: workout.date.toISOString(),
      }));
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
      const data = await getAllSplits(name);
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

  /**
   * Handles tab change.
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
   * Closes the workout card modal.
   */
  const handleClose = () => {
    setIsCardVisible(false);
  };


  /**
   * Opens the add workout dialog.
   */
  const handleAddDialogOpen = () => {
    setIsAddDialogOpen(true);
  };

  /**
   * Closes the add workout dialog.
   */  
  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setNewSplitName(""); // Clear the input field
    setNewWorkoutExercises([]); // Clear the exercise selection
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
      console.log("Split uploaded successfully");

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
   * Toggles between graph view and workout history view.
   */  
  const handleGraphButtonClick = () => {
    setShowGraph(!showGraph); // Toggle between graph view and workout history view
  };


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
    setSelectedSplitForEditing({});
    setEditedName('');
  };

  /**
   * Renames a workout split.
   */
  const handleRenameSplit = () => {
    setUserSplits(prevWorkouts =>
      prevWorkouts.map(workout =>
        workout.name === selectedSplitForEditing.name ? { ...workout, name: editedName } : workout
      )
    );
    handleCloseEditDialog();
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
            <Box>
              {/* View Workouts */}
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" component="p" sx={{ mb: 4 }}>
                  Your Workouts for {name}
                </Typography>

                {/* Sticky container for selectors and button */}
                <Box
                  sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    backgroundColor: 'white',
                    padding: '10px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    mb: 4,
                    width: '100%',
                  }}
                >
                  <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {monthNames.map((month, index) => (
                      <MenuItem key={index} value={index + 1}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {[2023, 2024, 2025].map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                {/* Conditionally render workout cards */}
                {filteredWorkouts.length > 0 ? (
                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}
                  >
                    {filteredWorkouts.map((workout, index) => (
                      <WorkoutCardPreview
                        key={workout.workoutId || index}
                        workout={workout}
                        onDelete={() => handleDeleteWorkout(workout.workoutId)}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="h6" sx={{ mb: 4 }}>
                    No workouts for {monthNames[selectedMonth - 1]} {selectedYear}
                  </Typography>
                )}

                {/* Workout creation buttons and edit icon */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4, gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Default Workout Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => toggleAddWorkoutCard([], 'createWorkout', "Default")}
                      sx={{ padding: '10px 20px', fontSize: '16px' }}
                    >
                      Add Default Workout
                    </Button>

                    {/* Dynamically generate predefined workout buttons */}
                    {userSplits.map((workout, index) => (
                      <Button
                        key={index}
                        variant="contained"
                        color="primary"
                        onClick={() => toggleAddWorkoutCard(workout.exercises, 'createWorkout', workout.name)}
                        sx={{ padding: '10px 20px', fontSize: '16px' }}
                      >
                        Add {workout.name}
                      </Button>
                    ))}
                  </Box>
                  <IconButton onClick={handleOpenEditDialog}>
                    <EditIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}

          {tabIndex === 1 && (
            <Box>
              {/* Graph Workout History */}
              <StrengthChart
                workoutHistory={workoutHistory}
                filteredWorkouts={filteredWorkouts}
                selectedMonth={monthNames[selectedMonth - 1]}
                selectedYear={selectedYear}
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
          {userSplits.map((split, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TextField
                value={split.name}
                onChange={(e) => {
                  const updatedSplits = [...userSplits];
                  updatedSplits[index].name = e.target.value;
                  setUserSplits(updatedSplits);
                }}
                sx={{ mr: 2 }}
              />
              <IconButton color="error" onClick={() => handleDeleteSplit(split.splitId)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setIsCustomSplitDialogOpen(true)}
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
      />
    </Box>
  );
}


export default Workouts;
