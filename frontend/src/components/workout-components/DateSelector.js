/**
 * @fileoverview Component for selecting and filtering workout data by month and year.
 * 
 * @file src/components/common/DateSelector.js
 * 
 * Provides a user interface for selecting a specific month and year to filter workout data.
 * This component can be used within other components such as charts or heatmaps to allow 
 * users to filter their workout history or any other data by a specified date range.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.selectedMonth - The currently selected month for filtering data.
 * @param {number} props.selectedYear - The currently selected year for filtering data.
 * @param {function} props.setSelectedMonth - Function to update the selected month.
 * @param {function} props.setSelectedYear - Function to update the selected year.
 * @returns {React.Element} - The rendered DateSelector component.
 * 
 * @version 1.0.0
 * @Author Steven Stansberry
 */

import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * Converts a month name to a month number.
 * @param {string} monthName - The name of the month.
 * @returns {number} The number of the month (1-12).
 */
const monthNameToNumber = (monthName) => monthNames.indexOf(monthName) + 1;

/**
 * DateSelector component for selecting month and year.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.selectedMonth - The currently selected month.
 * @param {number} props.selectedYear - The currently selected year.
 * @param {function} props.setSelectedMonth - Function to update the selected month.
 * @param {function} props.setSelectedYear - Function to update the selected year.
 * @returns {React.Element} - The rendered DateSelector component.
 */
const DateSelector = ({ selectedMonth, selectedYear, setSelectedMonth, setSelectedYear }) => {
  return (
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
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="month-select-label">Month</InputLabel>
        <Select
          labelId="month-select-label"
          id="month-select"
          value={monthNames[selectedMonth - 1]}  
          label="Month"
          onChange={(e) => setSelectedMonth(monthNameToNumber(e.target.value))}  // Convert back to number
        >
          {monthNames.map((month) => (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="year-select-label">Year</InputLabel>
        <Select
          labelId="year-select-label"
          id="year-select"
          value={selectedYear}
          label="Year"
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {[2023, 2024, 2025].map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default DateSelector;