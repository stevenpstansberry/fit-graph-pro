import React from 'react';
import { Typography, Box, Select, MenuItem, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import WorkoutCardPreview from '../components/WorkoutCardPreview';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * Component for viewing workouts, including filtering by month and year, and adding workouts.
 * 
 * @component
 * @param {Object} props - The properties passed to the component.
 * @returns {React.Element} - The rendered component.
 */
const ViewWorkouts = ({ 
  name, 
  filteredWorkouts, 
  selectedMonth, 
  setSelectedMonth, 
  selectedYear, 
  setSelectedYear, 
  toggleAddWorkoutCard, 
  userSplits, 
  handleDeleteWorkout, 
  handleOpenEditDialog 
}) => {
  return (
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
  );
};

export default ViewWorkouts;
