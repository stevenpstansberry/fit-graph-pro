
import React, {useState} from "react";
import { Autocomplete, TextField, IconButton, Box, Modal,Card, CardActions,CardContent, CardMedia, Button, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ExerciseSubcard from "./Exercise_Sub_Card";

function Workout_Card({open, onClose}){
    const [message,setMessage] = useState(null);
    const [inputValue,setInputValue] = useState('');
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);


    const addExercise = () => {
        setExercises([...exercises, { label: '', bodyPart: '', sets: '', weight: '', time: '' }]);
      };
    
      const removeExercise = (index) => {
        const newExercises = exercises.filter((_, i) => i !== index);
        setExercises(newExercises);
      };
    
      const updateExercise = (index, updatedExercise) => {
        const newExercises = exercises.map((exercise, i) => (i === index ? updatedExercise : exercise));
        setExercises(newExercises);
      };

    const createWorkout = (event) => {
        event.preventDefault();
        console.log("button pushed");

        console.log(inputValue);


        // TODO: add logic to check to see if workout is empty, flash message if so


    }
    return (
        <Modal
          open={open}
          onClose={onClose}
          BackdropProps={{
            style: { backgroundColor: 'rgba(0,0,0,0.5)' },
          }}
        >
          <Card
            sx={{
              maxWidth: 1000,
              minWidth: 1000,
              maxHeight: 600,
              minHeight: 600,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 12,
              p: 4,
              overflowY: 'auto',
            }}
          >
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                left: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Add a Workout
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add exercises to your workout from the list below.
              </Typography>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={strengthWorkouts}
                value={selectedExercise}
                onChange={(event, newValue) => {
                  setSelectedExercise(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                sx={{ width: 300, mb: 2 }}
                renderInput={(params) => <TextField {...params} label="Exercise" />}
              />
              <Button onClick={addExercise} variant="contained" sx={{ mb: 2 }}>
                Add Exercise
              </Button>
              <Box>
                {exercises.map((exercise, index) => (
                  <ExerciseSubcard
                    key={index}
                    exercise={exercise}
                    index={index}
                    removeExercise={removeExercise}
                    updateExercise={updateExercise}
                  />
                ))}
              </Box>
            </CardContent>
            <CardActions>
              <Button
                size="large"
                variant='contained'
                onClick={createWorkout}
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  boxShadow: 4
                }}
              >
                Create Workout
              </Button>
            </CardActions>
          </Card>
        </Modal>
      );
    }

export default Workout_Card



const strengthWorkouts = [
    { label: 'Bench Press', type: 'Strength', bodyPart: 'Chest' },
    { label: 'Squat', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Deadlift', type: 'Strength', bodyPart: 'Back' },
    { label: 'Overhead Press', type: 'Strength', bodyPart: 'Shoulders' },
    { label: 'Barbell Row', type: 'Strength', bodyPart: 'Back' },
    { label: 'Bicep Curl', type: 'Strength', bodyPart: 'Arms' },
    { label: 'Tricep Extension', type: 'Strength', bodyPart: 'Arms' },
    { label: 'Pull Up', type: 'Strength', bodyPart: 'Back' },
    { label: 'Lunge', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Leg Press', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Chest Fly', type: 'Strength', bodyPart: 'Chest' },
    { label: 'Lat Pulldown', type: 'Strength', bodyPart: 'Back' },
    { label: 'Hammer Curl', type: 'Strength', bodyPart: 'Arms' },
    { label: 'Dumbbell Shoulder Press', type: 'Strength', bodyPart: 'Shoulders' },
    { label: 'Leg Curl', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Leg Extension', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Incline Bench Press', type: 'Strength', bodyPart: 'Chest' },
    { label: 'Decline Bench Press', type: 'Strength', bodyPart: 'Chest' },
    { label: 'Calf Raise', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Front Squat', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Reverse Lunge', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Goblet Squat', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Face Pull', type: 'Strength', bodyPart: 'Back' },
    { label: 'Cable Row', type: 'Strength', bodyPart: 'Back' },
    { label: 'Side Lateral Raise', type: 'Strength', bodyPart: 'Shoulders' },
    { label: 'Bulgarian Split Squat', type: 'Strength', bodyPart: 'Legs' },
    { label: 'Seated Dumbbell Press', type: 'Strength', bodyPart: 'Shoulders' },
    { label: 'Skull Crusher', type: 'Strength', bodyPart: 'Arms' },
    { label: 'Dips', type: 'Strength', bodyPart: 'Chest' },
    { label: 'Single-leg Deadlift', type: 'Strength', bodyPart: 'Legs' }
];
