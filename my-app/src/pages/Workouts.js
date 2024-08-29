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

import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Select, MenuItem, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Workout_Card from '../components/Workout_Card';
import { getUser } from '../services/AuthService';
import WorkoutCardPreview from '../components/WorkoutCardPreview';
import StrengthChart from '../components/StrengthChart';
import axios from 'axios'; 
import { uploadWorkout, uploadSplit, deleteWorkout, deleteSplit, getAllWorkouts, getAllSplits } from '../services/APIServices';

// API URLs
const fitGraphProd = process.env.REACT_APP_FIT_GRAPH_PROD;
const getAllWorkoutsURL = fitGraphProd + "/workouts/all/";
const getAllSplitsURL = fitGraphProd + "/splits/all/";


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

  // Fetch from API using APIServices
  useEffect(() => {
    if (name) {
      fetchWorkouts();
      fetchSplits();
    }
  }, [name]);

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
      }
    } catch (error) {
      console.error('Error fetching splits:', error);
    }
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
   * Deletes a workout by ID.
   * 
   * @async
   * @param {string} workoutId - The ID of the workout to delete.
   */  
  const handleDeleteWorkout = async (workoutId) => {
    console.log("Deleting workout with ID:", workoutId);
  
    try {
      // Attempt to delete workout from the backend
      await deleteWorkout(workoutId);
      console.log("Workout deleted successfully from backend");
  
      // Update the state to remove the deleted workout
      setWorkoutHistory(prevWorkouts =>
        prevWorkouts.filter(workout => workout.workoutId !== workoutId)
      );
  
      console.log("Updated workout history:", workoutHistory);
    } catch (error) {
      console.error("Failed to delete workout:", error);
    }
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
        date: new Date(workout.date),
      };
      
      setWorkoutHistory([...workoutHistory, workoutWithDate]);
      console.log("Saved Workout: ", workoutWithDate);
  
      await uploadWorkout(workout);
      console.log("Workout uploaded Successfully")
    } catch (error) {
      console.error("Failed to upload workout: ", error);
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
      setUserSplits([...userSplits, split]);
      console.log("Saved Workout Split: ", split);
  
      await uploadSplit(split);
      console.log("Split uploaded successfully");
    } catch (error) {
      console.error("Failed to upload split: ", error);
    }
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
   * @async
   * @param {string} splitId - The ID of the split to delete.
   */
  const handleDeleteSplit = async (splitId) => {
    console.log("Deleting split with ID: ", splitId);

    try {

      await deleteSplit(splitId);
      console.log("Split deleted successfully from backend");

      // Update state to remove deleted split
      setUserSplits(prevSplits =>
        prevSplits.filter(split => split.splitId !== splitId)
      );

      console.log("Updated splits: ", userSplits)
    } catch (error) {
      console.error("Failed to delete split: ", error)
    }
  };

return (
<Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
  <Box sx={{ width: '100%' }}>
    <Navbar />
  </Box>

  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
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
      {!showGraph && (
        <>
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
        </>
      )}
      {filteredWorkouts.length > 0 && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleGraphButtonClick}
          sx={{ padding: '8px 16px', fontSize: '14px' }}
        >
          {showGraph ? 'View Workout History' : 'Graph This Month'}
        </Button>
      )}
    </Box>

    {/* Conditionally render either the workout cards or the graph */}
    {showGraph ? (
      <StrengthChart
        workoutHistory={workoutHistory}
        filteredWorkouts={filteredWorkouts}
        selectedMonth={monthNames[selectedMonth - 1]}
        selectedYear={selectedYear}
      />
    ) : filteredWorkouts.length > 0 ? (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
      {filteredWorkouts.map((workout, index) => {
        console.log('Workout object:', workout); // Log workout to see its structure
        return (
          <WorkoutCardPreview
            key={workout.workoutId || index}
            workout={workout}
            onDelete={() => handleDeleteWorkout(workout.workoutId)}
          />
        );
      })}
      </Box>
    ) : (
      <Typography variant="h6" sx={{ mb: 4 }}>
        No workouts for {monthNames[selectedMonth - 1]} {selectedYear}
      </Typography>
    )}
  </Box>

  {/* Workout creation buttons and edit icon */}
  {!showGraph && (
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
  )}

  {/* Edit Dialog */}
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
  <Box sx={{ width: '100%' }}>
    <Footer />
  </Box>
</Box>

);
}


export default Workouts;
