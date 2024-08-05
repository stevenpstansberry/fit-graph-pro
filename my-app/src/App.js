import './App.css';
import React from 'react';
import Home from './pages/Home';
import About from './pages/About';
import Success from './pages/Success'
import NoPage from './pages/NoPage';
import Register from './pages/Register'
import Login from './pages/Login'
import Test from './pages/Test';
import Contact from './pages/Contact';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import {BrowserRouter, Routes, Route } from 'react-router-dom'
//<Route path="/login" component={Login} />

function App() {
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
          <Route
          path="/Success"
          element={
            <PrivateRoute>
              <Success />
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

