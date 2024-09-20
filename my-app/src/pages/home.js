/**
 * @fileoverview Redesigned Page component for the Home section with scroll-triggered animation using Framer Motion.
 *
 * @file src/pages/Home.js
 *
 * This page serves as the landing page of the application, redesigned to feature bold sections with unique imagery, typography, and scroll-triggered animations.
 *
 * @component
 * @returns {React.Element} - The rendered Home page component.
 *
 * @version 1.0.0
 *
 * @author Steven Stansberry
 */

import React, { useRef } from 'react';
import Features from '../components/Features';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Typography, Box, Container, Button, Grid } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion'; 
import barbellImage from '../assets/barbell.png';  
import graphImage from '../assets/graph.png';  
import heatmapImage from '../assets/heatmap.png';
import { HeroSectionWithBarbellAnimation, HeroSectionWithFadeInAnimation, HeroSectionWithSlideInAnimationLeft, HeroSectionWithSlideUpAnimation, FeatureSectionWithFadeIn, ContentSection, ShimmerTypography, HeroSectionWithSlideInAnimationRight } from '../components/HeroSections';


/**
 * Home page component that serves as the landing page for the Fit Graph Pro application.
 * Renders a Navbar, distinct sections with hero images, bold typography, scroll-triggered animations, a spotlight for partners, and a Footer.
 *
 * @component
 * @returns {React.Element} - The rendered component for the home page.
 */
function Home() {
  return (
    <Box sx={{ backgroundColor: '#f4f4f4', overflowX: 'hidden' }}>
      {/* Navbar Component */}
      <Navbar />

      {/* Hero Section 1 with Barbell Scroll Animation */}
      <HeroSectionWithBarbellAnimation />

      {/* Feature Section 1 */}
      <ContentSection
        backgroundColor="#111"
        textColor="#fff"
        content={<ShimmerTypography />}
      />

      {/* Hero Section 2 */}
      <HeroSectionWithFadeInAnimation />


      <HeroSectionWithSlideInAnimationLeft />

      <HeroSectionWithSlideInAnimationRight />


      {/* Feature Section 2 */}
      <FeatureSectionWithFadeIn/>

      {/* Hero Section 3 */}
      <HeroSectionWithSlideUpAnimation/>

      {/* Footer Component */}
      <Footer />
    </Box>
  );
}




export default Home;