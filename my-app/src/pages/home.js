import React, { useRef, useEffect } from 'react';
import Features from '../components/Features';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Typography, Box, Container, Button, Grid } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion'; // Import Framer Motion
import { Canvas } from '@react-three/fiber'; // Import React Three Fiber
import { OrbitControls } from '@react-three/drei'; // Drei helper for camera controls

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

      {/* Hero Section with 3D Barbell Animation */}
      <HeroSectionWith3DAnimation />

      {/* Feature Section 1 */}
      <ContentSection
        backgroundColor="#111"
        textColor="#fff"
        content={
          <Typography variant="h4" align="center" sx={{ mb: 2 }}>
            "People are not born to be ordinary; they are born to stand out. Let your style roar with us."
          </Typography>
        }
      />

      {/* Partner Spotlight */}
      <SpotlightSection />

      {/* Hero Section 2 */}
      <HeroSection
        image="https://via.placeholder.com/1920x1080" // Placeholder image URL
        title="Discover Powerful Insights"
        subtitle="Dive deep into data with customizable graphs and analytics."
        buttonText="Learn More"
      />

      {/* Feature Section 2 */}
      <ContentSection
        backgroundColor="#333"
        textColor="#ffdd57"
        content={<Features />} // Replace with actual feature content or component
      />

      {/* Hero Section 3 */}
      <HeroSection
        image="https://via.placeholder.com/1920x1080" // Placeholder image URL
        title="Join Our Community"
        subtitle="Connect with other fitness enthusiasts and share your progress."
        buttonText="Sign Up"
      />

      {/* Footer Component */}
      <Footer />
    </Box>
  );
}

/**
 * HeroSectionWith3DAnimation component for displaying a 3D barbell animation with scroll-triggered effects.
 *
 * @returns {React.Element} - A styled hero section with 3D barbell animation.
 */
const HeroSectionWith3DAnimation = () => {
  const { scrollYProgress } = useScroll(); // Use Framer Motion's useScroll hook
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]); // Transform scale based on scroll position

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
        textAlign: 'center',
        backgroundColor: '#222',
      }}
    >
      <Canvas camera={{ position: [0, 1, 5] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <BarbellModel scale={scale} /> {/* Render the barbell model */}
        <OrbitControls />
      </Canvas>
    </Box>
  );
};

/**
 * BarbellModel component for rendering a 3D barbell model.
 *
 * @returns {React.Element} - A 3D barbell model in the Three.js scene.
 */
const BarbellModel = ({ scale }) => {
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(scale.get(), scale.get(), scale.get());
    }
  }, [scale]);

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} /> {/* Replace with actual barbell model */}
      <meshStandardMaterial color="gray" />
    </mesh>
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
 * SpotlightSection component to showcase partner logos or spotlight content.
 *
 * @returns {React.Element} - A styled section with partner logos or spotlight content.
 */
const SpotlightSection = () => (
  <Box
    sx={{
      width: '100%',
      py: 8,
      backgroundColor: '#fff',
      textAlign: 'center',
    }}
  >
    <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
      Partner Spotlight
    </Typography>
    <Grid container spacing={3} justifyContent="center">
      <Grid item>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/National_Geographic_logo.svg/1024px-National_Geographic_logo.svg.png" alt="National Geographic" style={{ height: 50 }} />
      </Grid>
      <Grid item>
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Discovery_Channel_logo.svg" alt="Discovery Channel" style={{ height: 50 }} />
      </Grid>
      <Grid item>
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/45/Animal_Planet_Logo_2018.png" alt="Animal Planet" style={{ height: 50 }} />
      </Grid>
      {/* Add more logos as needed */}
    </Grid>
  </Box>
);

/**
 * HeroSection component for displaying large, full-width hero images with text overlay.
 *
 * @param {Object} props - Props containing the image, title, subtitle, and button text.
 * @returns {React.Element} - A styled hero section with background image and overlay text.
 */
const HeroSection = ({ image, title, subtitle, buttonText }) => (
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
      <Button variant="contained" color="secondary" size="large">
        {buttonText}
      </Button>
    </Box>
    {/* Dark overlay for better text contrast */}
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
