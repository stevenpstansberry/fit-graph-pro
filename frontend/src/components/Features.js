/**
 * @fileoverview Component that displays a grid of feature cards for the Fit Graph application.
 *
 * @file src/components/Features.js
 *
 * The `Features` component renders a set of cards that showcase the key features of the application.
 * Each card contains an icon, title, and description, and links to the corresponding feature page.
 *
 * @version 1.0.0
 *
 * @author Steven Stansberry
 */

import React from "react";
import { Grid, Paper, Typography, ButtonBase } from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import BarChartIcon from "@mui/icons-material/BarChart";
import FlagIcon from "@mui/icons-material/Flag";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { Link } from "react-router-dom";

/**
 * Array of feature items to be displayed on the Features page.
 * Each item contains the title, description, icon, and link for the feature.
 */
const featureItems = [
  {
    title: "Track Activities",
    description:
      "Log your workouts and activities to keep track of your progress.",
    icon: <FitnessCenterIcon sx={{ fontSize: 40 }} />,
    link: "/workouts",
  },
  {
    title: "Visualize Progress",
    description: "Use dynamic graphs to visualize your fitness journey.",
    icon: <BarChartIcon sx={{ fontSize: 40 }} />,
    link: "/workouts?tabIndex=1",
  },
  {
    title: "Estimate Future Performance",
    description:
      "Use your workout history to estimate when you will achieve your goals.",
    icon: <FlagIcon sx={{ fontSize: 40 }} />,
    link: "/workouts?tabIndex=2",
  },
  {
    title: "Heatmap",
    description:
      "Understand how your workouts impact your body and refine your workouts.",
    icon: <LocalFireDepartmentIcon sx={{ fontSize: 40 }} />,
    link: "/workouts?tabIndex=3",
  },
];

/**
 * Features component for displaying a grid of feature cards.
 * Each card contains an icon, title, description, and a link to navigate to the corresponding feature page.
 *
 * @component
 * @returns {React.Element} - The rendered Features component.
 */
function Features() {
  return (
    <Grid container spacing={3} justifyContent="center">
      {featureItems.map((item, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          key={index}
          sx={{
            animation: "slideInFromRight 1s ease-out",
            animationDelay: `${index * 0.2}s`,
            animationFillMode: "both",
          }}
        >
          <ButtonBase
            data-testid={`feature-card-${index}`}
            component={Link}
            to={item.link}
            sx={{
              width: "100%",
              display: "block",
              textAlign: "inherit",
              borderRadius: 2,
              overflow: "hidden",
            }}
            TouchRippleProps={{
              sx: {
                color: "rgba(255, 0, 0, 0.5)",
              },
              timeout: 50,
            }}
          >
            <Paper
              sx={{
                padding: 2,
                textAlign: "center",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                color: "#333",
                opacity: 0.9,
                transition:
                  "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                  backgroundColor: "rgba(255, 255, 255, 1)",
                },
              }}
              elevation={4}
            >
              {item.icon}
              <Typography variant="h6" component="h3" sx={{ mt: 1, mb: 1 }}>
                {item.title}
              </Typography>
              <Typography variant="body2">{item.description}</Typography>
            </Paper>
          </ButtonBase>
        </Grid>
      ))}
    </Grid>
  );
}

export default Features;
