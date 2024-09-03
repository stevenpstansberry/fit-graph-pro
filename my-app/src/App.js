import './App.css';
import React, {useEffect} from 'react';
import axios from 'axios';
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile'
import NoPage from './pages/NoPage';
import StrengthChart from './components/StrengthChart';
import Register from './pages/Register'
import Login from './pages/Login'
import Test from './pages/Test';
import Contact from './pages/Contact';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import {BrowserRouter, Routes, Route } from 'react-router-dom'
import {getUser, getToken, setUserSession, resetUserSession} from './services/AuthService'
import Workouts from './pages/Workouts';
import ExerciseSubcard from './components/Exercise_Sub_Card';
//<Route path="/login" component={Login} />

const verifyTokenAPIURL = process.env.REACT_APP_FIT_GRAPH_PROD + "/verify";

function App() {
  axios.defaults.headers.common['X-Api-Key'] = process.env.REACT_APP_FIT_GRAPH_PROD_KEY;

  useEffect (() => {
    const token = getToken();
    if (token === 'undefined' || token === undefined || token === null || !token){
      return;
    }

    const requestBody = {
      user: getUser(),
      token: getToken()
    }

    axios.post(verifyTokenAPIURL, requestBody).then(response => {
      setUserSession(response.data.user, response.data.token);
    }).catch(() => {
      resetUserSession();
    })
  }, [])

  return (
    <BrowserRouter>
      <div className="content">
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path ="/login" element={<Login/>} />
          <Route path = "/register" element={<Register/>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test" element={<Test />} />
          <Route path="/testchart" element={<StrengthChart />} />

          <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />        
          <Route
          path="/workouts"
          element={
            <PrivateRoute>
              <Workouts />
            </PrivateRoute>
          }
        />           

          <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
          <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />                      
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

