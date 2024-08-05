import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { getToken } from '../services/AuthService';

// const PublicRoute = ({ component: Component, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       element={!getToken() ? <Component {...rest} /> : <Navigate to="/success" />}
//     />
//   );
// };

function PublicRoute({ children }) {
    const auth = !getToken();
    console.log(auth);
    return auth ? <>{children}</> : <Navigate to="/success" />;
  }

export default PublicRoute;
