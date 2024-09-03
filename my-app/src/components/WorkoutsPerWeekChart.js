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
      // Convert the workout date to a Date object
      const workoutDate = new Date(workout.date);
      
      const startOfWeek = new Date(workoutDate);
      startOfWeek.setDate(workoutDate.getDate() - workoutDate.getDay()); // Get Sunday of the week

      const weekKey = startOfWeek.toISOString().split('T')[0];

      if (weeks[weekKey]) {
        weeks[weekKey]++;
      } else {
        weeks[weekKey] = 1;
      }
    });

    // Convert the object to an array and sort by week date
    const sortedWeeks = Object.entries(weeks)
      .map(([week, count]) => ({ week, count }))
      .sort((a, b) => new Date(a.week) - new Date(b.week));

    // Return only the last 5 weeks
    return sortedWeeks.slice(-5);
  };

  useEffect(() => {
    setWorkoutData(groupWorkoutsByWeek(recentWorkouts));
  }, [recentWorkouts]);

  return (
    <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={workoutData} barCategoryGap={30}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" barSize={50} /> 
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default WorkoutsPerWeekChart;
