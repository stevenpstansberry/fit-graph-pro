/**
 * @fileoverview Component for handling public routes in the application.
 * 
 * @file src/pages/PublicRoute.js
 * 
 * This component ensures that only unauthenticated users can access certain routes.
 * If a user is authenticated (i.e., a token is present), they are redirected to a success page.
 * Otherwise, it renders the child components.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {React.Element} props.children - The child components to be rendered if the user is not authenticated.
 * @returns {React.Element} - The rendered component for public routes or a redirect to the success page.
 * 
 * @version 1.0.0
 * 
 * @author Steven Stansberry
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../services/AuthService';

/**
 * PublicRoute component to manage public routes accessible only to unauthenticated users.
 * 
 * This component checks if the user is not authenticated by verifying the absence of a token.
 * If unauthenticated, it renders the child components; otherwise, it redirects to the success page.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {React.Element} props.children - The child components to be rendered if the user is not authenticated.
 * @returns {React.Element} - The rendered component for public routes or a redirect to the success page.
 */
function PublicRoute({ children }) {
  const auth = !getToken(); // Determine if the user is not authenticated
  console.log(auth); // Log the authentication status for debugging purposes
  return auth ? <>{children}</> : <Navigate to="/success" />; // Render children if unauthenticated, otherwise redirect
}

export default PublicRoute;
