import './App.css';
import React from 'react';
import Home from './pages/Home';
import About from './pages/About';
import Success from './pages/Success'
import NoPage from './pages/NoPage';
import {BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>} />
          <Route path = "/home" element={<Home/>} />
          <Route path = "/about" element={<About/>} />
          <Route path = "/success" element={<Success/>} />
          <Route path = "/register" element={<register/>} />
          <Route path = "/login" element={<login/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

