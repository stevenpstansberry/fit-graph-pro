import React, { useState } from 'react';
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



// Temp sample data formatting
const workoutData = workoutDataRaw.map(workout => ({
  ...workout,
  date: new Date(workout.date),
}));

function Workouts() {
  const user = getUser();
  const name = user !== 'undefined' && user ? user.name : '';

  // State to manage the visibility of the Workout Card
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState(workoutData);

  // State to manage the month and year
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month (1-12)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Current year

  // State to hold selected workouts
  const [selectedWorkout, setSelectedWorkout] = useState([]);

  const [showGraph, setShowGraph] = useState(false); // State to toggle between graph view and workout history view
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false); // State for add workout dialog
  const [newSplitName, setNewSplitName] = useState(""); // State for the new workout name
  const [newWorkoutExercises, setNewWorkoutExercises] = useState([]); // State for exercises in the new workout

   // Predefined workout plans. 
  //TODO by default, all users will be have ppl as a predefined workout plan, need to
  // implement way to store predefined workouts in dynamodb and fetch based on user
  //use this to add or delete methods later, change the use state to be a fetch from db.
  const [predefinedWorkouts, setPredefinedWorkouts] = useState([
    { name: 'Push Workout', exercises: pushWorkout },
    { name: 'Pull Workout', exercises: pullWorkout },
    { name: 'Legs Workout', exercises: legsWorkout },
  ]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // Manage visibility of edit dialog
  const [selectedSplitForEditing, setSelectedSplitForEditing] = useState({}); // Split being edited
  const [editedName, setEditedName] = useState(''); // For renaming

  const toggleAddWorkoutCard = (workout) => {
    setSelectedWorkout(workout);
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

  const handleAddNewSplit = () => {
    if (newSplitName.trim()) {
      const newWorkout = {
        name: newSplitName,
        exercises: newWorkoutExercises,
      };
      setPredefinedWorkouts([...predefinedWorkouts, newWorkout]);
      //TODO add CRUD logic for backend

      handleAddDialogClose(); // Close the dialog after adding the workout
    }
  };

  const handleDeleteWorkout = (index) => {
    const updatedWorkouts = predefinedWorkouts.filter((_, i) => i !== index);
    setPredefinedWorkouts(updatedWorkouts);
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
    setPredefinedWorkouts(prevWorkouts =>
      prevWorkouts.map(workout =>
        workout.name === selectedSplitForEditing.name ? { ...workout, name: editedName } : workout
      )
    );
    handleCloseEditDialog();
  };

  // Handle deleting a workout split
  const handleDeleteSplit = (splitName) => {
    setPredefinedWorkouts(prevWorkouts =>
      prevWorkouts.filter(workout => workout.name !== splitName)
    );
  };

return (
  <Container sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <Navbar />

    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <Typography variant="h4" component="p" sx={{ mb: 4 }}>
        Your Workouts
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
              {[2023, 2024, 2025].map(year => (
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
        <StrengthChart workoutHistory={workoutHistory} filteredWorkouts={filteredWorkouts} selectedMonth={monthNames[selectedMonth - 1]} selectedYear={selectedYear} />
      ) : (
        filteredWorkouts.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
            {filteredWorkouts.map((workout, index) => (
              <WorkoutCardPreview key={index} workout={workout} />
            ))}
          </Box>
        ) : (
          <Typography variant="h6" sx={{ mb: 4 }}>
            No workouts for {monthNames[selectedMonth - 1]} {selectedYear}
          </Typography>
        )
      )}
    </Box>

    {/* Workout creation buttons and edit icon */}
    {!showGraph && (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4, gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Default Workout Button */}
          <Button variant="contained" color="primary" onClick={() => toggleAddWorkoutCard([])} sx={{ padding: '10px 20px', fontSize: '16px' }}>
            Add Default Workout
          </Button>

          {/* Dynamically generate predefined workout buttons */}
          {predefinedWorkouts.map((workout, index) => (
            <Button key={index} variant="contained" color="primary" onClick={() => toggleAddWorkoutCard(workout.exercises)} sx={{ padding: '10px 20px', fontSize: '16px' }}>
              Add {workout.name}
            </Button>
          ))}
        </Box>
        {/* Single edit icon to the right of the buttons */}
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
        {predefinedWorkouts.map((workout, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <TextField
              value={workout.name}
              onChange={(e) => {
                const updatedSplits = [...predefinedWorkouts];
                updatedSplits[index].name = e.target.value;
                setPredefinedWorkouts(updatedSplits);
              }}
              sx={{ mr: 2 }}
            />
            <IconButton color="error" onClick={() => handleDeleteSplit(workout.name)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        {/* Add New Split */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
          <TextField
            label="New Workout Split"
            value={newSplitName}
            onChange={(e) => setNewSplitName(e.target.value)}
            sx={{ mr: 2 }}
          />
          <IconButton onClick={handleAddNewSplit}>
            <AddIcon />
          </IconButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEditDialog} color="primary">Done</Button>
      </DialogActions>
    </Dialog>

    <Workout_Card open={isCardVisible} onClose={handleClose} preloadedExercises={selectedWorkout} />
    <Footer />
  </Container>
);
}

// Sample predefined workouts
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
