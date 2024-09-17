/**
 * @fileoverview Component for toggling dark mode on and off in the application.
 * 
 * @file src/components/DarkModeToggle.js
 * This component provides a switch button that allows users to toggle between light and dark modes.
 * It uses Material-UI's `Switch` component and relies on the `darkMode` state and `setDarkMode`
 * function passed down as props to manage the theme mode.
 * 
 * @component
 * @module DarkModeToggle
 * @param {Object} props - Component props.
 * @param {boolean} props.darkMode - The current state of dark mode (true for dark mode, false for light mode).
 * @param {function} props.setDarkMode - The function to toggle the dark mode state.
 * @returns {React.Element} The rendered DarkModeToggle component.
 */

import React from 'react';
import { Switch } from '@mui/material';

/**
 * DarkModeToggle component for toggling between light and dark modes.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.darkMode - Current dark mode state.
 * @param {function} props.setDarkMode - Function to toggle the dark mode state.
 * @returns {React.Element} The rendered toggle switch component.
 */
const DarkModeToggle = ({ darkMode, setDarkMode }) => {
  return (
    <Switch
      checked={darkMode}
      onChange={() => setDarkMode((prevMode) => !prevMode)}
      color="default"
      inputProps={{ 'aria-label': 'dark mode toggle' }}
    />
  );
};

export default DarkModeToggle;
