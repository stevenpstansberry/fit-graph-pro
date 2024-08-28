// src/components/Navbar.js

import { Link } from 'react-router-dom';
import { getUser, resetUserSession } from '../services/AuthService';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from 'react-router-dom';

const pages = ['Workouts', 'About', 'Contact'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Navbar() {
  const user = getUser();
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logoutHandler = () => {
    resetUserSession();
    navigate('/Login');
  };

  const handleMenuClick = (setting) => {
    if (setting === 'Logout') {
      logoutHandler();
    } else {
      navigate(`/${setting.toLowerCase()}`);
      handleCloseUserMenu();
    }
  };

  return (
<AppBar
  position="static"
  sx={{
    backgroundColor: 'rgba(51, 51, 51, 0.8)', // Semi-transparent dark gray background
    backdropFilter: 'blur(10px)', // Optional: adds a subtle blur effect to the background
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
              sx={{ color: 'white', mx: 1 }} // Adjust spacing as needed
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
              <Avatar alt="avatar" src="/static/images/avatar/2.jpg" />
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
