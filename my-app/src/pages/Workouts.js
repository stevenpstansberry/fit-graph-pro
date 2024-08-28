// src/pages/Workouts.js

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
import workoutDataRaw from '../util/sampleProgression.json';
import axios from 'axios'; 
import { uploadWorkout, uploadSplit } from '../services/APIServices';


const fitGraphProd = process.env.REACT_APP_FIT_GRAPH_PROD;
const getAllWorkoutsURL = fitGraphProd + "/workouts/all/";
const getAllSplitsURL = fitGraphProd + "/splits/all/";


// Temp sample data formatting
const workoutData = workoutDataRaw.map(workout => ({
  ...workout,
  date: new Date(workout.date),
}));

function Workouts() {
  const user = getUser();
  const name = user !== 'undefined' && user ? user.name : '';
  console.log(user);

  // Fetch from API
  useEffect(() => {
    if (name) {
      // Fetch workouts for the user
      const fetchWorkouts = async () => {
        try {
          const response = await axios.get(getAllWorkoutsURL + name);
          console.log('Workouts API Response:', response.data);

          // Update workoutHistory with the retrieved workouts
          if (response.data && Array.isArray(response.data)) {
            const formattedWorkouts = response.data.map(workout => ({
              ...workout,
              date: new Date(workout.date), // Ensure date is in Date format
            }));
            setWorkoutHistory(prevHistory => [...prevHistory, ...formattedWorkouts]);
          }
        } catch (error) {
          console.error('Error fetching workouts:', error);
        }
      };
      fetchWorkouts();

      // Fetch splits for the user and update state
      const fetchSplits = async () => {
        try {
          const response = await axios.get(getAllSplitsURL + name);
          console.log('Splits API Response:', response.data);

          // Transform the response data to use `splitName` and map it to `name` in the local state
          if (response.data && Array.isArray(response.data)) {
            const formattedSplits = response.data.map(split => ({
              name: split.splitName, // Map splitName to name
              exercises: split.exercises,
            }));
            setUserSplits((prevSplits) => [...prevSplits, ...formattedSplits]);
          }
        } catch (error) {
          console.error('Error fetching splits:', error);
        }
      };
      fetchSplits();
    }
  }, [name]);

  // State to manage the visibility and mode of the Workout Card
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [cardMode, setCardMode] = useState('createWorkout'); // State to determine the mode of Workout_Card


  // State to manage the month and year
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month (1-12)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Current year

  // State to hold selected workouts
  const [selectedWorkout, setSelectedWorkout] = useState([]);

  const [showGraph, setShowGraph] = useState(false); // State to toggle between graph view and workout history view
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false); // State for add workout dialog
  const [newSplitName, setNewSplitName] = useState(""); // State for the new workout name
  const [newWorkoutExercises, setNewWorkoutExercises] = useState([]); // State for exercises in the new workout

   // Holds the user Splits
  const [userSplits, setUserSplits] = useState([]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // Manage visibility of edit dialog
  const [selectedSplitForEditing, setSelectedSplitForEditing] = useState({}); // Split being edited
  const [editedName, setEditedName] = useState(''); // For renaming

  const [isCustomSplitDialogOpen, setIsCustomSplitDialogOpen] = useState(false);
  const [customSplitName, setCustomSplitName] = useState("");

  const [workoutType, setWorkoutType] = useState("Default");

  const toggleAddWorkoutCard = (workout, mode, workoutType) => {
    setWorkoutType(workoutType);
    setSelectedWorkout(workout);
    setCardMode(mode); 
    setIsCardVisible(!isCardVisible);
  };

  const handleClose = () => {
    setIsCardVisible(false);
  };

  const handleAddDialogOpen = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setNewSplitName(""); // Clear the input field
    setNewWorkoutExercises([]); // Clear the exercise selection
  };

  const handleAddNewSplit = (mode) => {
    setCardMode(mode); 
    setIsCardVisible(!isCardVisible);

    if (newSplitName.trim()) {
      const newWorkout = {
        name: newSplitName,
        exercises: newWorkoutExercises,
        
      };
      setUserSplits([...userSplits, newWorkout]);
      handleAddDialogClose(); // Close the dialog after adding the workout
    }
  };

  const handleDeleteWorkout = (workoutId) => {
    console.log("Deleting workout with ID:", workoutId);
    console.log("Current workout history:", workoutHistory);
  
    // Use a function to update state based on the previous state
    setWorkoutHistory(prevWorkouts =>
      prevWorkouts.filter(workout => workout.workoutId !== workoutId)
    );
  
    console.log("Updated workout history:", workoutHistory);
  };
  
  

  // Function to save a workout
  const saveWorkout = async (workout) => {
    try {
      const workoutWithDate = {
        ...workout,
        date: new Date(workout.date),
      };
  
      setWorkoutHistory([...workoutHistory, workoutWithDate]);
      console.log("Saved Workout: ", workoutWithDate);
  
    } catch (error) {
      console.error("Failed to upload workout: ", error);
    }
  };
    
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


  // Filter workouts based on selected month and year
  const filteredWorkouts = workoutHistory.filter(workout => {
    const workoutMonth = workout.date.getMonth() + 1;
    const workoutYear = workout.date.getFullYear();
    return workoutMonth === selectedMonth && workoutYear === selectedYear;
  });

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleGraphButtonClick = () => {
    setShowGraph(!showGraph); // Toggle between graph view and workout history view
  };


  // Handle opening the edit dialog
  const handleOpenEditDialog = () => {
    setIsEditDialogOpen(true);
  };

  // Handle closing the edit dialog
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedSplitForEditing({});
    setEditedName('');
  };

  // Handle renaming a workout split
  const handleRenameSplit = () => {
    setUserSplits(prevWorkouts =>
      prevWorkouts.map(workout =>
        workout.name === selectedSplitForEditing.name ? { ...workout, name: editedName } : workout
      )
    );
    handleCloseEditDialog();
  };

  // Handle deleting a workout split
  const handleDeleteSplit = (splitName) => {
    setUserSplits(prevWorkouts =>
      prevWorkouts.filter(workout => workout.name !== splitName)
    );
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
      {filteredWorkouts.map((workout, index) => (
        <WorkoutCardPreview
          key={workout.workoutId || index} // Ensure the key is unique
          workout={workout}
          onDelete={() => handleDeleteWorkout(workout.workoutId)} // Correctly pass workoutId here
        />
      ))}
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
      {userSplits.map((workout, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <TextField
            value={workout.name}
            onChange={(e) => {
              const updatedSplits = [...userSplits];
              updatedSplits[index].name = e.target.value;
              setUserSplits(updatedSplits);
            }}
            sx={{ mr: 2 }}
          />
          <IconButton color="error" onClick={() => handleDeleteSplit(workout.name)}>
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

// Sample predefined workouts
// const pushWorkout = {
// splitId: "1'",
// username: "d",
// splitName: "Push Workout",
// exercises: 
// [
//   { label: 'Bench Press', bodyPart: 'Chest', sets: [{ weight: "", reps: "" }] },
//   { label: 'Overhead Press', bodyPart: 'Shoulders', sets: [{ weight: "", reps: "" }] },
//   { label: 'Tricep Extension', bodyPart: 'Arms', sets: [{ weight: "", reps: "" }] }
// ]};

const pushWorkout = [
  { label: 'Bench Press', bodyPart: 'Chest', sets: [{ weight: "", reps: "" }] },
  { label: 'Overhead Press', bodyPart: 'Shoulders', sets: [{ weight: "", reps: "" }] },
  { label: 'Tricep Extension', bodyPart: 'Arms', sets: [{ weight: "", reps: "" }] }
];

const pullWorkout = [
  { label: 'Pull Up', bodyPart: 'Back', sets: [{ weight: "", reps: "" }] },
  { label: 'Barbell Row', bodyPart: 'Back', sets: [{ weight: "", reps: "" }] },
  { label: 'Bicep Curl', bodyPart: 'Arms', sets: [{ weight: "", reps: "" }] }
];

const legsWorkout = [
  { label: 'Squat', bodyPart: 'Legs', sets: [{ weight: "", reps: "" }] },
  { label: 'Leg Press', bodyPart: 'Legs', sets: [{ weight: "", reps: "" }] },
  { label: 'Lunge', bodyPart: 'Legs', sets: [{ weight: "", reps: "" }] }
];

export default Workouts;
