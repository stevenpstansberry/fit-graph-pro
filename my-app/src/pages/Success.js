import React from 'react';
import Features from '../components/Features'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { getUser, resetUserSession } from '../services/AuthService';
import { useNavigate} from 'react-router-dom';

import { Container, Typography, Box } from '@mui/material';

function Success(){
    const navigate = useNavigate();
    const user = getUser();
    const name = user !== 'undefined' && user ? user.name : '';

    const logoutHandler = () => {
        resetUserSession();
        navigate('/signin');
    }

    return (
    <Container>
        <Navbar></Navbar>
        <Typography component="p">
            {name}
        </Typography>
        <Footer></Footer>
  
    </Container>
    )
}

export default Success