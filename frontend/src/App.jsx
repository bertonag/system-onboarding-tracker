// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ChecklistTracker from './pages/ChecklistTracker';   // ← New import
import { PrivateRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/projects" 
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          } 
        />

        {/* New: Checklist Tracker Route */}
        <Route 
          path="/checklists" 
          element={
            <PrivateRoute>
              <ChecklistTracker />
            </PrivateRoute>
          } 
        />

        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;