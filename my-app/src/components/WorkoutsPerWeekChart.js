/**
 * @fileoverview Component to display the number of workouts per week for the user.
 * 
 * @file src/components/WorkoutsPerWeekChart.js
 * 
 * Uses Recharts to visualize the number of workouts completed each week as a bar chart.
 * 
 * @version 1.0.0
 * @author Steven Stansberry
 * 
 */

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Box } from '@mui/material';

/**
 * Component to display the number of workouts per week using a bar chart.
 * 
 * @component
 * @param {Array} recentWorkouts - List of recent workout objects.
 * @returns {React.Element} - Rendered component.
 */
const WorkoutsPerWeekChart = ({ recentWorkouts }) => {
  const [workoutData, setWorkoutData] = useState([]);

  /**
   * Groups workouts by week and counts the number of workouts for each week.
   * 
   * @function groupWorkoutsByWeek
   * @param {Array} workouts - List of workout objects.
   * @returns {Array} - Array of objects containing week and count of workouts.
   */
  const groupWorkoutsByWeek = (workouts) => {
    const weeks = {};

    workouts.forEach((workout) => {
      const startOfWeek = new Date(workout.date);
      startOfWeek.setDate(workout.date.getDate() - workout.date.getDay()); // Get Sunday of the week
      const weekKey = startOfWeek.toISOString().split('T')[0];

      if (weeks[weekKey]) {
        weeks[weekKey]++;
      } else {
        weeks[weekKey] = 1;
      }
    });

    return Object.entries(weeks).map(([week, count]) => ({
      week,
      count,
    }));
  };

  useEffect(() => {
    setWorkoutData(groupWorkoutsByWeek(recentWorkouts));
  }, [recentWorkouts]);

  return (
    <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={workoutData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default WorkoutsPerWeekChart;
