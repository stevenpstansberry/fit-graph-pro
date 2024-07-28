import logo from './logo.svg';
import './App.css';
import React from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home'
import Footer from './components/Footer'
import Features from './components/Features';

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <Home></Home>
      <Features></Features>
      <Footer></Footer>
    </div>
  );
}

export default App;
