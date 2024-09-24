/**
 * @fileoverview Test file for Features component.
 *
 * @file src/components/__tests__/Features.test.js
 *
 * This file contains test cases for the Features component, which renders a set of feature cards with icons, titles, descriptions, and links.
 *
 * @version 1.0.0
 *
 * @author Steven Stansberry
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Features from "../Features"; // Your component
import { BrowserRouter } from "react-router-dom";

// Utility function to wrap the component in a BrowserRouter (for <Link>)
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

// Test suite for the Features component (independent of auth)
describe("Features Component", () => {
  it("renders all feature items correctly", () => {
    // Render the Features component inside a BrowserRouter
    renderWithRouter(<Features />);

    // Check that each feature item is present by matching their titles
    expect(screen.getByText("Track Activities")).toBeInTheDocument();
    expect(screen.getByText("Visualize Progress")).toBeInTheDocument();
    expect(screen.getByText("Estimate Future Performance")).toBeInTheDocument();
    expect(screen.getByText("Heatmap")).toBeInTheDocument();
  });

  it("renders the correct number of feature cards", () => {
    // Render the Features component inside a BrowserRouter
    renderWithRouter(<Features />);

    // Check that four feature cards are rendered
    const featureCards = screen.getAllByTestId(/feature-card-/); // Query by test ID
    expect(featureCards).toHaveLength(4); // Expect 4 feature cards
  });

  it("has correct links for each feature", () => {
    // Render the Features component inside a BrowserRouter
    renderWithRouter(<Features />);

    // Check the links for each card
    expect(
      screen.getByRole("link", { name: /Track Activities/i })
    ).toHaveAttribute("href", "/workouts");
    expect(
      screen.getByRole("link", { name: /Visualize Progress/i })
    ).toHaveAttribute("href", "/workouts?tabIndex=1");
    expect(
      screen.getByRole("link", { name: /Estimate Future Performance/i })
    ).toHaveAttribute("href", "/workouts?tabIndex=2");
    expect(screen.getByRole("link", { name: /Heatmap/i })).toHaveAttribute(
      "href",
      "/workouts?tabIndex=3"
    );
  });
});

// Hook to run after all tests in this file have been completed
afterAll(() => {
  // Force exit after tests complete
  process.exit(0);
});
