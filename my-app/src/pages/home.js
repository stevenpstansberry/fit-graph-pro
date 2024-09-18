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
        content={
          <Typography variant="h4" align="center" sx={{ mb: 2, color: '#FFD700' }}> 
            "Success isn’t always about greatness. It’s about consistency. Consistent hard work gains success. Greatness will come."
          </Typography>
        }
      />

      {/* Hero Section 2 */}
      <HeroSectionWithFadeInAnimation />

      {/* Feature Section 2 */}
      <ContentSection
        backgroundColor="#333"
        textColor="#ffdd57"
        content={<Features />} 
      />

      {/* Hero Section 3 */}
      <HeroSection
        image="https://via.placeholder.com/1920x1080"  // Placeholder image URL
        title="Join The FitGraph Community"
        subtitle="Connect with other fitness enthusiasts and share your progress."
        buttonText="Sign Up"
      />

      {/* Footer Component */}
      <Footer />
    </Box>
  );
}

/**
 * HeroSectionWithBarbellAnimation component for displaying a barbell that scales and spins based on scroll position.
 *
 * @returns {React.Element} - A styled hero section with scroll-based animation for the barbell.
 */
const HeroSectionWithBarbellAnimation = () => {
  const { scrollYProgress } = useScroll();  // Use Framer Motion's useScroll hook

  // Barbell size will grow from 0.5 (small) to 2 times its original size
  const scale = useTransform(scrollYProgress, [0, 1], [0.5, 2]);

  // Barbell will rotate 0 to 360 degrees as the user scrolls
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '80vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222', 
      }}
    >
      {/* Barbell Image with Scroll Animation */}
      <motion.img
        src={barbellImage}  
        alt="Barbell Scroll Animation"
        style={{
          width: '150px',  // Initial width of the barbell (small size)
          height: 'auto',
        }}
        initial={{ scale: 0.5 }} 
        style={{ scale, rotate }}  
      />

      {/* Text content overlaying the barbell */}
      <Box sx={{ position: 'absolute', top: '20%', zIndex: 2, color: '#fff', textAlign: 'center' }}>
        <Typography variant="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
          Welcome to FitGraph Pro
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
        Empower your body with every rep.
        </Typography>
      </Box>
    </Box>
  );
};

/**
 * HeroSectionWithFadeInAnimation component for fading in the entire hero section as the user scrolls.
 *
 * @returns {React.Element} - A styled hero section where the whole section fades in based on scroll.
 */
const HeroSectionWithFadeInAnimation = () => {
  // Create a ref for the section we want to track the scroll progress of
  const ref = useRef(null);

  // Use useScroll with ref to track the scroll progress of this specific section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],  // Adjusts how the progress is calculated
  });

  // Create a fade-in effect for the entire section, increasing opacity from 0 to 1 as you scroll
  const fadeInEffect = useTransform(scrollYProgress, [0, 1], [0, 1]);  // Opacity goes from 0 to 1

  return (
    <motion.div
      ref={ref}  
      style={{
        opacity: fadeInEffect,  
        transition: 'opacity 0.5s ease-out', 
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5', 
          overflow: 'hidden',
        }}
      >
        {/* Graph Image centered with fade-in effect */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center', 
            alignItems: 'center',      
            width: '100%',
            height: '100%',
          }}
        >
          <motion.img
            src={graphImage}  
            alt="Graph Image"
            style={{
              width: 'auto',
              height: '70%',  
            }}
          />
        </Box>

        {/* Text content overlaying the graph */}
        <Box sx={{ position: 'absolute', top: '20%', zIndex: 2, color: '#333', textAlign: 'center' }}>
          <Typography variant="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
            Discover Powerful Insights
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Dive deep into data with customizable graphs and analytics.
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};




/**
 * ContentSection component for showcasing different features or text content in a distinct section.
 *
 * @param {Object} props - Props containing background color, text color, and content.
 * @returns {React.Element} - A visually distinct section.
 */
const ContentSection = ({ backgroundColor, textColor, content }) => (
  <Box
    sx={{
      width: '100%',
      py: 10,
      px: 3,
      backgroundColor: backgroundColor,
      color: textColor,
      textAlign: 'center',
    }}
  >
    <Container>{content}</Container>
  </Box>
);


/**
 * HeroSection component for displaying large, full-width hero images with text overlay.
 *
 * @param {Object} props - Props containing the image, title, subtitle, and button text.
 * @returns {React.Element} - A styled hero section with background image and overlay text.
 */
const HeroSection = ({ image, title, subtitle}) => (
  <Box
    sx={{
      position: 'relative',
      width: '100%',
      height: '80vh',
      backgroundImage: `url(${image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: '#fff',
    }}
  >
    <Box sx={{ position: 'relative', zIndex: 2, maxWidth: '80%' }}>
      <Typography variant="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ mb: 4 }}>
        {subtitle}
      </Typography>
    </Box>
    {/* Optional: Dark overlay for better text contrast */}
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
      }}
    />
  </Box>
);

export default Home;