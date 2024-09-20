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
      <HeroSection
        image="https://via.placeholder.com/1920x1080"  // Placeholder image URL
        title="Join The FitGraph Community"
        subtitle="Connect with other fitness enthusiasts and share your progress."
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

const HeroSectionWithSlideInAnimationLeft = () => {  
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"], 
  });

  const slideInEffect = useTransform(scrollYProgress, [0, 0.2], [-200, 0]);  
  const fadeInEffect = useTransform(scrollYProgress, [0, 0.2], [0, 1]);  

  return (
    <motion.div ref={ref} style={{ height: '100vh', backgroundColor: '#f0f0f0' }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e0e0e0',
          overflow: 'hidden',
          boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.05)', // Subtle shadow for the section
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Updated Card for Future Performance Prediction */}
          <motion.div
            style={{
              x: slideInEffect,
              opacity: fadeInEffect,
            }}
            transition={{ type: 'spring', stiffness: 50 }}  
          >
            <Box
              sx={{
                padding: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
                textAlign: 'left',
                maxWidth: '400px',
                minHeight: '300px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.2)',
                },
                background: 'linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%)', // Gradient background
              }}
            >
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', fontSize: '1.8rem', letterSpacing: '0.5px', color: '#333' }}>
                Predict Your Progress
              </Typography>
              <Typography variant="body1" sx={{ color: '#555' }}>
                Enter your goal weight and let our advanced regression models analyze your workout data to forecast when you’ll hit your next PR. Track your progress with precision and see results in real-time.
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, color: '#555' }}>
                With at least 50 sets logged, we'll give you an accurate estimate of when you’ll reach your goals based on data-driven insights.
              </Typography>
            </Box>
          </motion.div>

          {/* Updated Card for Estimating One Rep Max */}
          <motion.div
            style={{
              x: slideInEffect,
              opacity: fadeInEffect,
            }}
            transition={{ type: 'spring', stiffness: 50 }}  
          >
            <Box
              sx={{
                padding: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
                textAlign: 'left',
                maxWidth: '400px',
                minHeight: '300px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.2)',
                },
                background: 'linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%)',
              }}
            >
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', fontSize: '1.8rem', letterSpacing: '0.5px', color: '#333' }}>
                Calculate Your 1RM
              </Typography>
              <Typography variant="body1" sx={{ color: '#555' }}>
                Easily estimate your 1-rep max (1RM) using our advanced algorithm. We analyze your heaviest sets and reps to calculate your maximum strength potential.
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, color: '#555' }}>
                Powered by Epley’s formula, we give you accurate 1RM predictions based on your workout history, helping you plan your next big lift with confidence.
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
};







const HeroSectionWithSlideInAnimationRight = () => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const slideInEffect = useTransform(scrollYProgress, [0, 0.2], [200, 0]);
  const fadeInEffect = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{
        height: "100vh",
        backgroundColor: "#f0f0f0",
        background: "linear-gradient(180deg, #f4f4f4 0%, #e0e0e0 100%)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Flex container to center the content */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {/* Heatmap Card with sliding and hover effect */}
          <motion.div
            style={{
              x: slideInEffect,
              opacity: fadeInEffect,
            }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <Box
              sx={{
                width: "600px",
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <img
                src={heatmapImage}
                alt="Workout Heatmap"
                style={{
                  width: "100%", 
                  height: "auto",
                  display: "block", 
                  borderRadius: "16px",
                }}
              />
            </Box>
          </motion.div>

          {/* Text content below the heatmap */}
          <motion.div
            style={{
              x: slideInEffect,
              opacity: fadeInEffect,
              marginTop: "20px",
            }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <Box
              sx={{
                textAlign: "center",
                maxWidth: "800px",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  fontSize: "2.5rem",
                  color: "#333",
                }}
              >
                Workout Heatmap
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#555",
                  lineHeight: "1.6",
                  fontSize: "1.2rem",
                }}
              >
                Visualize your workout intensity with our body heatmap feature. It
                highlights which areas of your body have been worked the most,
                helping you balance your workouts and avoid overtraining.
              </Typography>
            </Box>
          </motion.div>
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

const ShimmerTypography = () => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], 
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const shimmerEffect = useTransform(scrollYProgress, [0, 0.2], [-200, 0]);

  return (
    <motion.div
      ref={ref}
      style={{
        opacity, 
        background: 'linear-gradient(90deg, #FFD700 25%, #fff 50%, #FFD700 75%)',
        backgroundSize: '200% 100%',
        backgroundPositionX: shimmerEffect,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'shimmer 3s infinite linear',
        fontSize: '2rem',
        fontWeight: 'bold',
        textAlign: 'center',
        display: 'inline-block',
      }}
    >
      "Success isn’t always about greatness. It’s about consistency. Consistent hard work gains success. Greatness will come."
    </motion.div>
  );
};

const FeatureSectionWithFadeIn = () => {
  const ref = useRef(null);

  // Track the scroll position for this section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],  
  });

  // Transform scroll progress to opacity value (0 to 1)
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <motion.div ref={ref} style={{ opacity }}>
      <ContentSection
        backgroundColor="#333"
        textColor="#ffdd57"
        content={<Features />}  
      />
    </motion.div>
  );
};



export default Home;