/**
 * @fileoverview Utility functions for the workout components.
 * 
 * @file src/components/workout-components/common/util.js
 * 
 * Provides utility functions to support various workout components, such as generating
 * titles for charts based on selected timeframes and dates.
 * 
 * @module util
 * 
 * @function getTitle
 * Generates the title for the chart based on the selected timeframe and date.
 * 
 * @param {string} component - The component invoking the function (e.g., 'HeatMap', 'strengthChart').
 * @param {string} timeframe - The selected timeframe (e.g., 'currentMonth', 'ytd', 'allTime').
 * @param {number} selectedMonth - The selected month (1-12).
 * @param {number} selectedYear - The selected year.
 * @param {string} [selectedExercise] - The selected exercise (only for 'strengthChart').
 * @returns {string} - The generated title.
 * 
 * @version 1.0.0
 * @Author Steven Stansberry
 */


export const getTitle = (component, timeframe, selectedMonth, selectedYear, selectedExercise) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const componentName = component === 'heatmap' ? 'Heatmap' : component === 'strengthChart' ? 'Strength Chart' : 'View Workouts';

  if (component === 'strengthChart') {
    if (timeframe === 'currentMonth') {
      return ` ${componentName} for: ${selectedExercise}, ${selectedMonth} ${selectedYear}`;
    } else if (timeframe === 'ytd') {
      const today = new Date();
      const todayDate = `${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
      return ` Year-to-Date ${componentName} for ${selectedExercise} from Jan 1 ${selectedYear} through ${todayDate}`;
    } else if (timeframe === 'allTime') {
      return ` All-Time ${componentName} for: ${selectedExercise}`;
    } else {
      return `Displaying Workout History for: ${selectedExercise}`;
    }
  } else {
    if (timeframe === 'currentMonth') {
      const monthName = monthNames[selectedMonth - 1]; // Get the month name
      return ` ${componentName} for: ${monthName} ${selectedYear}`;
    } else if (timeframe === 'ytd') {
      const today = new Date();
      const todayDate = `${monthNames[today.getMonth()]} ${today.getDate()}`;
      return ` Year-to-Date  ${componentName} from Jan 1 ${selectedYear} through ${todayDate}`;
    } else if (timeframe === 'allTime') {
      return ` All-Time  ${componentName}`;
    } else {
      return `Displaying Workout History ${componentName}`;
    }
  }
};


/**
 * Converts a string to title case (capitalizes the first letter of each word).
 *
 * @function toTitleCase
 * @param {string} str - The string to convert.
 * @returns {string} - The title-cased string.
 */
export const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};