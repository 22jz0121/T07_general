import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const myID = localStorage.getItem('MyID');
  return myID ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
