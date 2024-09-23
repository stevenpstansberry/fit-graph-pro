/**
 * @fileoverview Component to display recent workouts with expandable details.
 *
 * @file src/components/profile-components/RecentWorkouts.js
 *
 * Exposes the `RecentWorkouts` component, which handles displaying a list of recent workouts
 * and allows the user to expand each workout card to view detailed information.
 *
 * @version 1.0.0
 * @author Steven Stansberry
 */

import React, { useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Grid,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toTitleCase } from "../workout-components/shared-workout-components/util";

/**
 * Component for displaying recent workouts with expandable details.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.recentWorkouts - Array of recent workout objects.
 * @returns {React.Element} - The rendered RecentWorkouts component.
 */
const RecentWorkouts = ({ recentWorkouts }) => {
  const [expandedWorkout, setExpandedWorkout] = useState(null); // Track which workout is expanded

  // Toggle expand/collapse for workout details
  const handleExpandClick = (workoutId) => {
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Recent Workouts
      </Typography>
      <Grid container spacing={3}>
        {recentWorkouts.map((workout) => (
          <Grid item xs={12} md={6} key={workout.workoutId}>
            <Card>
              <CardContent>
                <Typography variant="h6">{workout.type}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Date: {new Date(workout.date).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleExpandClick(workout.workoutId)}
                >
                  {expandedWorkout === workout.workoutId
                    ? "Hide Details"
                    : "View Details"}
                </Button>
                <IconButton
                  onClick={() => handleExpandClick(workout.workoutId)}
                  aria-expanded={expandedWorkout === workout.workoutId}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>
              <Collapse
                in={expandedWorkout === workout.workoutId}
                timeout="auto"
                unmountOnExit
              >
                <CardContent>
                  {workout.exercises.map((exercise, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">
                        {toTitleCase(exercise.label)} (
                        {toTitleCase(exercise.bodyPart)})
                      </Typography>
                      {exercise.sets.map((set, setIndex) => (
                        <Typography
                          key={setIndex}
                          variant="body2"
                          color="textSecondary"
                        >
                          Set {setIndex + 1}: {set.weight} lbs x {set.reps} reps
                        </Typography>
                      ))}
                    </Box>
                  ))}
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default RecentWorkouts;
