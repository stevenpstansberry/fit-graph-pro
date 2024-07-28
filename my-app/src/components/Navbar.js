import React from 'react';
import { AppBar,Toolbar,Typography,Button, IconButton, Icon } from '@mui/material';


function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <Icon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          FitGraphPro
        </Typography>
        <Button color="inherit">Home</Button>
        <Button color="inherit">Login</Button>
        <Button color="inherit">Features</Button>
        <Button color="inherit">About</Button>
        <Button color="inherit">Contact</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
