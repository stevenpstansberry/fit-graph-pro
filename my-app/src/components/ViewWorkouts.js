/**
 * @fileoverview Component to manage and display user workouts.
 *
 * @file src/components/ViewWorkouts.js
 *
 * Exposes the `ViewWorkouts` component, which handles viewing workouts, filtering by date,
 * and adding new workouts for the authenticated user.
 *
 *
 * @version 1.0.0
 * @author Steven Stansberry
 */

import React from 'react';
import { Typography, Box, Button, IconButton, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import WorkoutCardPreview from '../components/WorkoutCardPreview';
import fitnessImage from '../assets/fitnessImage.png';


const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * Component for viewing workouts, including filtering by month and year, and adding workouts.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.name - The name of the user.
 * @param {Array} props.filteredWorkouts - The list of workouts filtered by the selected date.
 * @param {number} props.selectedMonth - The currently selected month for filtering.
 * @param {function} props.setSelectedMonth - Function to set the selected month.
 * @param {number} props.selectedYear - The currently selected year for filtering.
 * @param {function} props.setSelectedYear - Function to set the selected year.
 * @param {function} props.toggleAddWorkoutCard - Function to toggle the workout card visibility.
 * @param {Array} props.userSplits - The list of user-defined workout splits.
 * @param {function} props.handleDeleteWorkout - Function to handle workout deletion.
 * @param {function} props.handleOpenEditDialog - Function to open the edit dialog for workout splits.
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
  const hasWorkouts = filteredWorkouts.length > 0;

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',  // Align content to the top
        pt: 8,  // Add padding to the top
        pb: 8,  // Add padding to the bottom
      }}
    >
      <Typography variant="h4" component="p" sx={{ mb: 8 }}>
        Your Workouts for {name}
      </Typography>

      {/* Conditionally render workout cards or show a message if none exist */}
      {hasWorkouts ? (
        <>
          {/* Calendar selectors for filtering by date */}
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

          {/* Display workout cards */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
            {filteredWorkouts.map((workout, index) => (
              <WorkoutCardPreview
                key={workout.workoutId || index}
                workout={workout}
                onDelete={() => handleDeleteWorkout(workout.workoutId)}
              />
            ))}
          </Box>
        </>
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            mt: 8,  // Add margin-top to create space for the background image
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Background Image */}
          <img
            src={fitnessImage}
            alt="Fitness Background"
            style={{ width: '100%', maxWidth: '400px', marginBottom: '16px' }}  // Adjust size and margin as needed
          />

          {/* Message encouraging the user to add their first workout */}
          <Typography variant="h6" color="textSecondary" sx={{ mb: 8 }}>
            Let's get started with your first workout!
          </Typography>

          {/* Workout creation buttons and edit icon */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 4, gap: 2 }}>
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
            <IconButton onClick={handleOpenEditDialog}>
              <EditIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ViewWorkouts;
