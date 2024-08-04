import React from 'react';
import Features from '../components/Features'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

import { Container, Typography, Box } from '@mui/material';

function Success(){
    const user = getUser();

    return (
        <Container>
        <Navbar></Navbar>

      <Footer></Footer>
  
    </Container>
    )
}

export default Success