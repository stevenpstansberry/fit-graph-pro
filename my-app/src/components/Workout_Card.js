
import React from "react";
import { Modal,Card, CardActions,CardContent, CardMedia, Button, Typography } from "@mui/material";


function Workout_Card(open, onClose){


    return (
        <Modal
            open = {open}
            onclose = {onClose}
            backdropProps = {{
                style : {backgroundColor: 'rgba(0,0,0,0.5' },
            }}     
        >
            <Card sx={{ maxWidth: 345,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,

            }}>
            <CardMedia
                sx={{ height: 140 }}
                image="/static/images/cards/contemplative-reptile.jpg"
                title="green iguana"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                Lizard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                Lizards are a widespread group of squamate reptiles, with over 6,000
                species, ranging across all continents except Antarctica
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={onClose}>Close</Button>
            </CardActions>
            </Card>
        </Modal>
      );
    }

export default Workout_Card