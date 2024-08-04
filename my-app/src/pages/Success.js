import React from 'react';
import Features from '../components/Features'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { getUser, resetUserSession } from '../services/AuthService';
import { useNavigate} from 'react-router-dom';

import { Container, Typography, Box, Button } from '@mui/material';

function Success(){
    const navigate = useNavigate();
    const user = getUser();
    const name = user !== 'undefined' && user ? user.name : '';

    const logoutHandler = () => {
        resetUserSession();
        navigate('/Login');
    }

    return (
    <Container>
        <Navbar></Navbar>
        <Typography component="p">
            {name}
        </Typography>
        <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={logoutHandler}
          >
            logout
          </Button>
        <Footer></Footer>
  
    </Container>
    )
}

export default Success