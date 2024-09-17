/**
 * @fileoverview Defines the light and dark themes for the application using MUI's createTheme.
 * 
* @file src/util/Theme.js
 * 
 * This file exports two theme objects: `lightTheme` and `darkTheme`, which define the color palette
 * 
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 * 
 */

import { createTheme } from '@mui/material/styles';

/**
 * Light theme configuration for the application.
 * 
 * @constant
 * @type {object}
 * @property {object} palette - The color palette for the light theme.
 * @property {string} palette.mode - The mode for the light theme ('light').
 * @property {object} palette.primary - Primary color configuration.
 * @property {string} palette.primary.main - Main primary color in HEX format.
 * @property {object} palette.secondary - Secondary color configuration.
 * @property {string} palette.secondary.main - Main secondary color in HEX format.
 * @property {object} palette.background - Background color configuration.
 * @property {string} palette.background.default - Default background color in HEX format.
 * @property {string} palette.background.paper - Paper background color in HEX format.
 */
export const lightTheme = createTheme({
  palette: {
    mode: 'light', // Light mode
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f4f6f8',
      paper: '#fff',
    },
  },
});

/**
 * Dark theme configuration for the application.
 * 
 * @constant
 * @type {object}
 * @property {object} palette - The color palette for the dark theme.
 * @property {string} palette.mode - The mode for the dark theme ('dark').
 * @property {object} palette.primary - Primary color configuration.
 * @property {string} palette.primary.main - Main primary color in HEX format.
 * @property {object} palette.secondary - Secondary color configuration.
 * @property {string} palette.secondary.main - Main secondary color in HEX format.
 * @property {object} palette.background - Background color configuration.
 * @property {string} palette.background.default - Default background color in HEX format.
 * @property {string} palette.background.paper - Paper background color in HEX format.
 */
export const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Dark mode
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#ce93d8',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
  },
});
