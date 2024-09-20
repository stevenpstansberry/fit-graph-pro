/**
 * @fileoverview Component for handling private routes in the application.
 * 
 * @file src/pages/PrivateRoute.js
 * 
 * This component ensures that only authenticated users can access certain routes.
 * If a user is not authenticated (i.e., no token is present), they are redirected to the login page.
 * Otherwise, it renders the child components.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {React.Element} props.children - The child components to be rendered if the user is authenticated.
 * @returns {React.Element} - The rendered component for private routes or a redirect to the login page.
 * 
 * @version 1.0.0
 * 
 * @author Steven Stansberry
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from '../services/AuthService';

/**
 * PrivateRoute component to protect routes from unauthorized access.
 * 
 * This component checks if the user is authenticated by verifying the presence of a token.
 * If authenticated, it renders the child components; otherwise, it redirects to the login page.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {React.Element} props.children - The child components to be rendered if the user is authenticated.
 * @returns {React.Element} - The rendered component for private routes or a redirect to the login page.
 */
function PrivateRoute({ children }) {
  const auth = getToken(); // Get the authentication token
  const location = useLocation(); // Get the current location

  // If authenticated, render children; otherwise, redirect to login with the original path
  return auth ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default PrivateRoute;

