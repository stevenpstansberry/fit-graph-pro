import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Workouts from "../Workouts";

/**
 * Test suite for the `Workouts` component to verify tab switching functionality.
 */
describe("Workouts Component Tab Switching", () => {
  /**
   * Test to verify if the tab switches to 'Graph Workout History' when clicked.
   *
   * @function
   */
  test("switches to 'Graph Workout History' tab when clicked", () => {
    // Render the Workouts component wrapped in MemoryRouter
    render(
      <MemoryRouter>
        <Workouts />
      </MemoryRouter>
    );

    // The initial tab is "View Workouts" (tabIndex 0), check for its content
    expect(screen.getByText(/View Workouts/i)).toBeInTheDocument();

    // Find the 'Graph Workout History' tab and simulate a click
    const graphTab = screen.getByRole("tab", {
      name: /Graph Workout History/i,
    });
    fireEvent.click(graphTab);

    // Assert that the content changes to 'Graph Workout History'
    expect(screen.getByText(/Graph Workout History/i)).toBeInTheDocument();
  });

  /**
   * Test to verify if the tab switches to 'Predict Future Performance' when clicked.
   *
   * @function
   */
  test("switches to 'Predict Future Performance' tab when clicked", () => {
    // Render the Workouts component wrapped in MemoryRouter
    render(
      <MemoryRouter>
        <Workouts />
      </MemoryRouter>
    );

    // Find the 'Predict Future Performance' tab and simulate a click
    const futureTab = screen.getByRole("tab", {
      name: /Predict Future Performance/i,
    });
    fireEvent.click(futureTab);

    // Assert that the content changes to 'Predict Future Performance'
    expect(screen.getByText(/Predict Future Performance/i)).toBeInTheDocument();
  });

  /**
   * Test to verify if the tab switches to 'Heat Map' when clicked.
   *
   * @function
   */
  test("switches to 'Heat Map' tab when clicked", () => {
    // Render the Workouts component wrapped in MemoryRouter
    render(
      <MemoryRouter>
        <Workouts />
      </MemoryRouter>
    );

    // Find the 'Heat Map' tab and simulate a click
    const heatMapTab = screen.getByRole("tab", { name: /Heat Map/i });
    fireEvent.click(heatMapTab);

    // Assert that the content changes to 'Heat Map'
    expect(screen.getByText(/Heat Map/i)).toBeInTheDocument();
  });
});
