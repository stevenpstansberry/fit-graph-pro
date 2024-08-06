import React, {useState} from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Workout_Card from '../components/Workout_Card';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

function Workouts(){
    // Set the workout card to be disabled by default
    const [isCardVisible, setIsCardVisible] = useState(false)

    const toggleCardVisbility = () => {
        setIsCardVisible(!isCardVisible);
    };



    return(
        <Container>
            <Navbar/>
            <Typography>
                hello
            </Typography>
            <Button onClick={toggleCardVisbility}>
                add workout
            </Button>
            {isCardVisible && <Workout_Card />}
            <Footer/>
        </Container>)
}

export default Workouts;