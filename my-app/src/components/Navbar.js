import React from 'react';
import { AppBar,Toolbar,Typography,Button, IconButton, Icon } from '@mui/material';
import {Link} from 'react-router-dom';
import { getUser} from '../services/AuthService';


function Navbar() {

  // Check to see whether or not the user is logged in or not.
  const user = getUser();
  if (user){
    
    // If the user is logged in, show them appropiate navbar
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <Icon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FitGraphPro
          </Typography>
          <Button color="inherit" component = {Link} to ='/'>Home</Button>
          <Button color="inherit" component = {Link} to ='/'>Features</Button>
          <Button color="inherit" component = {Link} to ='/About'>About</Button>
          <Button color="inherit" component = {Link} to ='/Workouts'>Workouts</Button>
          <Button color="inherit" component = {Link} to ='/Contact'>Contact</Button>
          <Button color="inherit" component = {Link} to ='/Success'>Profile</Button>
  
        </Toolbar>
      </AppBar>
    );
  } 
  // if the user is not logged in, show them the appropiate navbar 
  else {
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <Icon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FitGraphPro
          </Typography>
          <Button color="inherit" component = {Link} to ='/'>Home</Button>
          <Button color="inherit" component = {Link} to ='/Login'>Login</Button>
          <Button color="inherit" component = {Link} to ='/Register'>Register</Button>
          <Button color="inherit" component = {Link} to ='/'>Features</Button>
          <Button color="inherit" component = {Link} to ='/About'>About</Button>
          <Button color="inherit" component = {Link} to ='/Contact'>Contact</Button>
  
        </Toolbar>
      </AppBar>
    );
  }
  

}

export default Navbar;
