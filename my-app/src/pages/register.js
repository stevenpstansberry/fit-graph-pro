import React from 'react';
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

import { Container, Typography, Box , FormControl, InputLabel, Input, FormHelperText} from '@mui/material';


function Register() {
    return (
      <Container>
          <Navbar></Navbar>
          <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
            <FormControl>
              <InputLabel htmlFor="my-input">Email address</InputLabel>
              <Input id="my-input" aria-describedby="my-helper-text" />
              <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
            </FormControl>
            </Box>
          </Container>
        <Footer></Footer>
    
      </Container>
    );
  }
  
  export default Register;