/**
 * @fileoverview Component for selecting a timeframe for workout data visualization.
 * 
 * @file src/components/workout-components/TimeframeSelector.js
 * 
 * Provides a user interface to select a timeframe for filtering workout data.
 * The component allows users to choose from pre-defined timeframes such as 
 * "Current Month & Year," "Year to Date," or "All Time," which can then be used
 * to filter the displayed data.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.timeframe - The currently selected timeframe.
 * @param {function} props.onChange - Callback function to handle changes to the selected timeframe.
 * @returns {React.Element} - The rendered TimeframeSelector component.
 * 
 * @version 1.0.0
 * @Author Steven Stansberry
 */
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

/**
 * TimeframeSelector component for selecting the timeframe for workout data visualization.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.timeframe - The currently selected timeframe.
 * @param {function} props.onChange - Callback function to handle the change in selected timeframe.
 * @returns {React.Element} - The rendered TimeframeSelector component.
 */
const TimeframeSelector = ({ timeframe, onChange }) => {
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="timeframe-select-label">Timeframe</InputLabel>
      <Select
        labelId="timeframe-select-label"
        id="timeframe-select"
        value={timeframe}
        label="Timeframe"
        onChange={onChange}
      >
        <MenuItem value="currentMonth">Current Month & Year</MenuItem>
        <MenuItem value="ytd">Year to Date</MenuItem>
        <MenuItem value="allTime">All Time</MenuItem>
      </Select>
    </FormControl>
  );
};

export default TimeframeSelector;
