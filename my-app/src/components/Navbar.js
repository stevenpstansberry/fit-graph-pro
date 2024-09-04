/**
 * @fileoverview Navigation bar component for the Fit Graph application.
 * 
 * @file src/components/Navbar.js
 * 
 * Provides a responsive navigation bar that includes links to various pages, a
 * user profile avatar displaying the first letter of the user's name, and a dropdown
 * menu with user settings options.
 * 
 * @version 1.0.0
 * @author Steven Stansberry
 */

import { Link } from 'react-router-dom';
import { getUser, resetUserSession } from '../services/AuthService';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from 'react-router-dom';

const pages = ['Workouts', 'About', 'Contact'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

/**
 * Navbar component providing the main navigation for the Fit Graph application.
 * 
 * The navbar displays links to key pages
 * 
 * @component
 * @returns {React.Element} - The rendered Navbar component.
 */
function Navbar() {
  const user = getUser(); // Retrieve the authenticated user's information
  const navigate = useNavigate(); // Hook for navigation

  // State for managing the mobile navigation menu anchor element
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  // State for managing the user settings menu anchor element
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  /**
   * Handles the opening of the mobile navigation menu.
   * 
   * @function handleOpenNavMenu
   * @param {Object} event - The event object from the menu button click.
   */
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  /**
   * Handles the opening of the user settings menu.
   * 
   * @function handleOpenUserMenu
   * @param {Object} event - The event object from the avatar click.
   */
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  /**
   * Closes the mobile navigation menu.
   * 
   * @function handleCloseNavMenu
   */
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  /**
   * Closes the user settings menu.
   * 
   * @function handleCloseUserMenu
   */
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  /**
   * Logs the user out by resetting the user session and navigating to the login page.
   * 
   * @function logoutHandler
   */
  const logoutHandler = () => {
    resetUserSession();
    navigate('/Login');
  };

  /**
   * Handles navigation based on the selected user setting option.
   * 
   * @function handleMenuClick
   * @param {string} setting - The selected setting from the user menu.
   */
  const handleMenuClick = (setting) => {
    if (setting === 'Logout') {
      logoutHandler();
    } else {
      navigate(`/${setting.toLowerCase()}`);
      handleCloseUserMenu();
    }
  };

  // Extract the first letter of the user's name for the avatar
  const userInitial = user && user.name ? user.name.charAt(0).toUpperCase() : 'A';

  // Extract S3 profile picture url for user, if it is associated with the user in DynamoDB
  let profileImageUrl = null;
  if (user && user.s3ProfileURI) {
    profileImageUrl = user.s3ProfileURI;
  }

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'rgba(51, 51, 51, 0.8)', // Semi-transparent dark gray background
        backdropFilter: 'blur(10px)', 
      }}
    >
      <Container maxWidth={false} sx={{ px: 2 }}>
        <Toolbar disableGutters sx={{ justifyContent: 'flex-start' }}>
          {/* Grouping the title and the navigation links */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AdbIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/home"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                mr: 4, // Add spacing between the title and navigation links
              }}
            >
              Fit Graph
            </Typography>

            {/* Navigation links placed immediately to the right of the title */}
            <Box sx={{ display: 'flex' }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  href={`/${page.toLowerCase()}`}
                  sx={{ color: 'white', mx: 1 }} 
                >
                  {page}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Spacer to push the user profile or login/register button to the far right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Profile or login/register button */}
          <Box sx={{ flexGrow: 0 }}>
            {!user ? (
              <Button
                color="inherit"
                onClick={() => navigate('/Login')}
                sx={{ my: 2, display: 'block' }}
              >
                Log In / Register
              </Button>
            ) : (
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {profileImageUrl ? (
                    <Avatar src={profileImageUrl} /> // If user has a profile picture, show it
                  ) : (
                    <Avatar>{userInitial}</Avatar> // Otherwise, show the user's initial
                  )}
                </IconButton>
              </Tooltip>
            )}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleMenuClick(setting)}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
