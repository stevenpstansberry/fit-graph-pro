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

import { getUser, resetUserSession, getProfileImageUrlFromSession, setProfileImageUrlToSession } from '../services/AuthService';
import { getProfilePicture } from '../services/APIServices';
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
import { useNavigate } from 'react-router-dom';
import fitGraphLogo from '../assets/fit-graph-logo.png'; // Import the logo image

const pages = ['Workouts', 'About', 'Contact', 'Attributions'];
const settings = ['Profile', 'Account', 'Logout'];

/**
 * Navbar component providing the main navigation for the Fit Graph application.
 * 
 * The navbar displays links to key pages
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {string|null} props.profileImageUrl - The profile image URL for the user.
 * @returns {React.Element} - The rendered Navbar component.
 */
function Navbar({ profileImageUrl }) {
  const user = getUser(); // Retrieve the authenticated user's information
  const navigate = useNavigate(); // Hook for navigation

  // State for managing the mobile navigation menu anchor element
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  // State for managing the user settings menu anchor element
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [userProfileImageUrl, setUserProfileImageUrl] = React.useState(profileImageUrl || getProfileImageUrlFromSession()); // State for profile image URL

  // Effect to fetch user profile picture if not provided in props or session storage
  React.useEffect(() => {
    if (!userProfileImageUrl && user) {
      // Fetch from the database if no image URL is available in props or session storage
      fetchUserProfileImage();
    }
  }, [profileImageUrl, user]);

  /**
   * Fetches the profile picture URL from the backend.
   *
   * @function fetchUserProfileImage
   */
  const fetchUserProfileImage = async () => {
    console.log('Fetching profile picture for user:', user.username); // Log fetch attempt
    try {
      const response = await getProfilePicture(user.username); // Fetch profile picture from API
      if (response && response.profilePictureUrl) {
        const cacheBustedUrl = `${response.profilePictureUrl}?t=${new Date().getTime()}`; // Bust cache
        setUserProfileImageUrl(cacheBustedUrl);
        setProfileImageUrlToSession(cacheBustedUrl); // Save to session storage
        console.log('Profile picture URL fetched and saved to session storage:', cacheBustedUrl); // Log fetched URL
      } else {
        console.log('No profile picture found for user:', user.username); // Log absence of profile picture
        setProfileImageUrlToSession(null);
      }
    } catch (error) {
      console.log('No profile picture found for user:', user.username);
      setProfileImageUrlToSession(null);

      
    }
  };

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
          {/* Grouping the logo and the navigation links */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Logo Section */}
            <Box component="a" href="/home" sx={{ mr: 4 }}>
              <img
                src={fitGraphLogo}
                alt="Fit Graph Logo"
                style={{ width: '100px', height: '75' }} // Adjust the size as needed
              />
            </Box>

            {/* Navigation links placed immediately to the right of the logo */}
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
                  {userProfileImageUrl ? (
                    <Avatar src={userProfileImageUrl} /> // If user has a profile picture, show it
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
