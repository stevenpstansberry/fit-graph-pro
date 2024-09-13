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
 * @param {string} timeframe - The selected timeframe (e.g., 'currentMonth', 'ytd', 'allTime').
 * @param {number} selectedMonth - The selected month (1-12).
 * @param {number} selectedYear - The selected year.
 * @returns {string} - The generated title.
 * 
 * @version 1.0.0
 * @Author Steven Stansberry
 */


/**
 * Generates the title for the chart based on the selected timeframe and date.
 *
 * @param {string} timeframe - The selected timeframe (e.g., 'currentMonth', 'ytd', 'allTime').
 * @param {number} selectedMonth - The selected month (1-12).
 * @param {number} selectedYear - The selected year.
 * @returns {string} - The generated title.
 */
export const getTitle = (timeframe, selectedMonth, selectedYear) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    if (timeframe === 'currentMonth') {
      const monthName = monthNames[selectedMonth - 1]; // Get the month name
      return `Displaying Workout History Heatmap for: ${monthName} ${selectedYear}`;
    } else if (timeframe === 'ytd') {
      const today = new Date();
      const todayDate = `${monthNames[today.getMonth()]} ${today.getDate()}`;
      return `Displaying Year-to-Date Workout History Heatmap from Jan 1 ${selectedYear} through ${todayDate}`;
    } else if (timeframe === 'allTime') {
      return `Displaying All-Time Workout History Heatmap`;
    } else {
      return `Displaying Workout History Heatmap`;
    }
  };