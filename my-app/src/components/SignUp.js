import React, {useState} from 'react';
import { Container, Typography, Box, FormControl, InputLabel, Input, FormHelperText, Button, TextField, FormControlLabel, Checkbox, Link, Grid, Alert } from '@mui/material';
import axrios from 'axios'

function SignUp() {
    const [message, setMessage] = useState(null);

    

    const handleSubmit = (event) => {
    
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const name = data.get("name");
      const username = data.get("username");
      const email = data.get("email");
      const password = data.get("password");


      if (name.trim() === '' || username.trim() === '' || email.trim() === '' || password.trim() === ''){
        setMessage('All fields are required');
        return;
      }
      console.log({
        name: name,
        username: username,
        email: email,
        password: password,
      });
      console.log('success');
      
    };
  
    return (
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
          <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
                        <TextField
              margin="normal"
              required
              fullWidth
              name="confirm-password"
              label="Confirm password"
              type="password"
              id="confirm-password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Already have an account? Login"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {message && <Alert severity="info" sx={{ mb: 2, width: '100%' }}>{message}</Alert>}
        </Container>
    );
  }

export default SignUp;
