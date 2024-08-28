// src/pages/PrivateRoute.js

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { getToken } from '../services/AuthService';

// const PrivateRoute = ({ component: Component, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       element={getToken() ? <Component {...rest} /> : <Navigate to="/login" />}
//     />
//   );
// };

function PrivateRoute({ children }) {
    const auth = getToken();
    return auth ? <>{children}</> : <Navigate to="/login" />;
  }

export default PrivateRoute;
