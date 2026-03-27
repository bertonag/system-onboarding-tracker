// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { PrivateRoute, ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Basic Protected Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        {/* Example: Admin-only page */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredPermission="view_admin_dashboard">
              <div>Admin Dashboard - Only users with 'view_admin_dashboard' permission can see this</div>
            </ProtectedRoute>
          } 
        />

        {/* Example: Checklist management page */}
        <Route 
          path="/checklists" 
          element={
            <ProtectedRoute requiredPermission="edit_checklist_items">
              <div>Checklist Management Page</div>
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;