import React from 'react';
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import SignUp from '../components/SignUp';

import { Container, Typography, Box , FormControl, InputLabel, Input, FormHelperText} from '@mui/material';


function Register() {
  return (
      <Container>
          <Navbar />
              <SignUp />
          <Footer />
      </Container>
  );
}
  
  export default Register;