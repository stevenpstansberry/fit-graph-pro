/**
 * @fileoverview Main application component for the FitGraphPro application.
 * 
 * @file src/App.js
 * 
 * This file sets up the main routing for the application using React Router, handles user session verification, 
 * and provides public and private routes for various pages.
 * 
 * @component
 * @returns {React.Element} - The main App component containing all routes.
 * 
 * @version 1.0.0
 * 
 * @author Steven Stansberry
 */

import './App.css';
import React, { useEffect } from 'react';
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import NoPage from './pages/NoPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Contact from './pages/Contact';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getUser, getToken, setUserSession, resetUserSession } from './services/AuthService';
import Workouts from './pages/Workouts';
import ResetPassword from './pages/ResetPassword';
import Account from './pages/Account';
import Attributions from './pages/Attributions';
import { verifyToken } from './services/FitGraphAPIServices';  
import ResetPasswordFromEmail from './pages/ResetPasswordFromEmail';

function App() {

  useEffect(() => {
    const token = getToken();
    // If no token is found, exit early
    if (token === 'undefined' || token === undefined || token === null || !token) {
      return;
    }

    const requestBody = {
      user: getUser(),
      token: getToken()
    };

    // Verify the user token using the verifyToken function from APIServices
    verifyToken(requestBody).then(response => {
      setUserSession(response.user, response.token); // Set the user session with the response data
    }).catch(() => {
      resetUserSession(); // Reset session if verification fails
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="content">
        <Routes>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forgot-password" element={<ResetPassword />} />
          <Route path="/reset-password" element={<ResetPasswordFromEmail />} />
          <Route path="/account" element={<Account />} />
          <Route path="/attributions" element={<Attributions />} />

          {/* Private Routes */}
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

          {/* Protected Public Routes */}
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
