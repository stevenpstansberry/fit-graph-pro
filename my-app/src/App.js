import './App.css';
import React from 'react';
import Home from './pages/Home';
import About from './pages/About';
import {BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path = "/home" element={<Home/>} />
          <Route path = "/about" element={<About/>} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

