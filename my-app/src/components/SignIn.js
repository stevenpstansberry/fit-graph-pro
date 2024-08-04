import { Alert, Button, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container } from "@mui/material";
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { setUserSession } from "../services/AuthService";
import { useNavigate} from 'react-router-dom';

const fitGraphProd = process.env.REACT_APP_FIT_GRAPH_PROD;
const loginURL = fitGraphProd + "/login";

function SignIn(props) {
  axios.defaults.headers.common['X-Api-Key'] = process.env.REACT_APP_FIT_GRAPH_PROD_KEY;
  const navigate = useNavigate();


  const [message,setMessage] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const username = data.get('username');
    const password = data.get('password');

    if (username.trim() === '' || password.trim() === ''){
      setMessage('Fields must be filled')
      return;
    }

    const requestBody = {
      username: username,
      password: password
    }
    const requestCofig = {
      headers : {
        'x-api-key' :  process.env.REACT_APP_FIT_GRAPH_PROD_KEY
      }
    }

    axios.post(loginURL,requestBody).then((response) => {
      setMessage('success')
      setUserSession(response.data.user, response.data.token);
      navigate('/success');
    }).catch((error) => {
      setMessage('error')
    })

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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            name="password"
            label="Password"
            type="password"
            id="password"
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
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {message && <Alert severity="info" sx={{ mb: 2, width: '100%' }}>{message}</Alert>}
    </Container>
  );
}

export default SignIn