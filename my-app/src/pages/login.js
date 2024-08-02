import React from 'react';
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

import { Container, Typography, Box } from '@mui/material';
import SignIn from '../components/SignIn';


function Login() {
    return (
      <Container>
        <Navbar></Navbar>
        <SignIn/>
        <Footer></Footer>
      </Container>
    );
  }
  
  export default Login;