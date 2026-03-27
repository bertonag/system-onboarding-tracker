// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasPermission } from '../services/auth';

export const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const ProtectedRoute = ({ children, requiredPermission }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        color: '#d32f2f' 
      }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <p>Required: <strong>{requiredPermission}</strong></p>
      </div>
    );
  }

  return children;
};