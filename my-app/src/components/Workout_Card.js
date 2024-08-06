
import React, {useState} from "react";
import { IconButton, Box, Modal,Card, CardActions,CardContent, CardMedia, Button, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function Workout_Card({open, onClose}){
    const [message,setMessage] = useState(null)

    const createWorkout = (event) => {
        event.preventDefault();
        console.log("button pushed");

    }
    return (
        <Modal
            open = {open}
            onclose = {onClose}
            backdropProps = {{
                style : {backgroundColor: 'rgba(0,0,0,0.5' },
            }}     
        >
            <Card sx={{ maxWidth: 1000,
                minWidth: 1000,
                maxHeight: 500,
                minHeight: 500,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 12,
                p: 4,

            }}>
            <IconButton
            aria-label="close"
            onClick={onClose}
            sx = {{
                position:'absolute',
                left:8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
            }}
            >
            <CloseIcon></CloseIcon>


            </IconButton>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                Add a Workout
                </Typography>
                <Typography variant="body2" color="text.secondary">
                Lizards are a widespread group of squamate reptiles, with over 6,000
                species, ranging across all continents except Antarctica
                </Typography>
            </CardContent>
            <CardActions>
                <Button 
                size ="large"
                variant='contained'
                onClick={createWorkout}
                sx = {{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    boxShadow: 4
                
                }}
                     >
                        Create Workout</Button>
            </CardActions>
            </Card>
        </Modal>
      );
    }

export default Workout_Card