/**
 * @fileoverview Page component for the About section.
 *
 * @file src/pages/About.js
 *
 * This page provides information about the Fit Graph Pro application, its features, and its benefits.
 *
 * @component
 * @returns {React.Element} - The rendered About page component.
 *
 * @version 1.0.0
 *
 * @author Steven Stansberry
 */

import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Typography, Box } from "@mui/material";
import aboutPageImage from "../assets/about-page-image.jpg";

/**
 * About page component that provides information about the Fit Graph Pro application.
 * Renders a Navbar at the top, followed by content describing the app, and a Footer at the bottom.
 *
 * @component
 * @returns {React.Element} - The rendered component for the about page.
 */
function About() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Ensure Navbar spans the entire width */}
      <Navbar />

      {/* Main Content Area */}
      <Box
        sx={{ flexGrow: 1, mt: 4, px: 2, maxWidth: "1200px", margin: "0 auto" }}
      >
        {/* Flexbox Layout to position image and text side by side */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 6,
          }}
        >
          {/* Image Section */}
          <Box
            sx={{
              flex: "1 1 50%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <img
              src={aboutPageImage}
              alt="About Fit Graph Pro"
              style={{
                width: "100%", // Ensure the image fills the width of its container
                height: "auto", // Maintain aspect ratio by adjusting height automatically
                maxHeight: "700px", // Increase max height to make it bigger
                objectFit: "cover", // Cover the area while maintaining aspect ratio
                borderRadius: "8px", // Add rounded corners for a more polished look
                marginLeft: "-50px", // Adjust to move more to the left
              }}
            />
          </Box>

          {/* About Content Section */}
          <Box sx={{ flex: "1 1 50%", textAlign: "left", pr: 3 }}>
            {/* About Section Header */}
            <Typography
              variant="h3"
              component="h1"
              sx={{ mb: 4, fontWeight: "bold" }}
            >
              About Fit Graph Pro
            </Typography>

            {/* About Content */}
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              Fit Graph Pro is a smart and dynamic fitness companion that's been
              redefining how fitness enthusiasts track their progress and set
              their goals since day one. Think of it as your personal fitness
              scientist, turning your workout data into insights that drive
              real, tangible results.
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              Born out of a passion for data-driven fitness, Fit Graph Pro takes
              the guesswork out of the gym and brings clarity to your routine.
              Built with features like customizable workout splits, strength
              graphs, future performance predictions using linear regression,
              and a unique heatmap to show you exactly where you’ve been pushing
              your limits, our app empowers you to train smarter, not just
              harder.
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              Whether you're a seasoned athlete or just starting your fitness
              journey, Fit Graph Pro adapts to your needs. It provides you with
              tools to track your one-rep maxes, visualize muscle engagement,
              and even predict your future gains. Our goal? To turn every
              workout into a step closer to the best version of yourself.
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              At Fit Graph Pro, we believe fitness is more than just lifting
              weights or running miles—it's about understanding your body and
              progress. No goal is too big or small, and every bit of progress
              deserves to be celebrated. Join the Fit Graph Pro community today
              and see how science, data, and a passion for fitness can help you
              crush your goals!
            </Typography>

            {/* Invitation to Join or Call to Action */}
            <Typography variant="h5" sx={{ mt: 4, fontWeight: "bold" }}>
              Ready to Level Up Your Fitness Game?
            </Typography>
            <Typography variant="body1" sx={{ mb: 5, lineHeight: 1.8 }}>
              Dive into Fit Graph Pro and start transforming your fitness
              journey with the power of data. No more guesswork—just clear,
              measurable progress.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer Component */}
      <Footer />
    </Box>
  );
}

export default About;
