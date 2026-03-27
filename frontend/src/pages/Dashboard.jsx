// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/api';
import { getUserPermissions, hasPermission } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Get user info from backend
        const response = await getCurrentUser();
        setUser(response.data);

        // Get permissions from JWT token
        const userPerms = getUserPermissions();
        setPermissions(userPerms);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading dashboard...</div>;
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '1px solid #eee',
        paddingBottom: '20px'
      }}>
        <div>
          <h1>System Onboarding Tracker</h1>
          <p>Welcome, <strong>{user?.full_name || user?.username}</strong></p>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            background: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* User Info & Permissions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
          <h3>User Information</h3>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>User ID:</strong> {user?.id}</p>
        </div>

        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
          <h3>Your Permissions ({permissions.length})</h3>
          {permissions.length > 0 ? (
            <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
              {permissions.map((perm, index) => (
                <li key={index} style={{ margin: '6px 0' }}>✓ {perm}</li>
              ))}
            </ul>
          ) : (
            <p>No permissions assigned yet.</p>
          )}
        </div>
      </div>

      {/* Main Actions - RBAC Protected */}
      <h2>Available Modules</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
        
        {/* Always visible */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Projects Overview</h3>
          <p>View all onboarding projects and their status.</p>
          <button style={{ marginTop: '15px', padding: '10px 20px' }}>
            View Projects
          </button>
        </div>

        {/* Visible only if user has permission */}
        {hasPermission('edit_checklist_items') && (
          <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
            <h3>Checklist Management</h3>
            <p>Update checklist items and track progress.</p>
            <button style={{ marginTop: '15px', padding: '10px 20px', background: '#1976d2', color: 'white', border: 'none' }}>
              Manage Checklists
            </button>
          </div>
        )}

        {hasPermission('manage_projects') && (
          <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
            <h3>Project Administration</h3>
            <p>Create and manage onboarding projects.</p>
            <button style={{ marginTop: '15px', padding: '10px 20px', background: '#1976d2', color: 'white', border: 'none' }}>
              Create New Project
            </button>
          </div>
        )}

        {hasPermission('view_admin_dashboard') && (
          <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', background: '#fff3cd' }}>
            <h3>Admin Dashboard</h3>
            <p>System administration and user management.</p>
            <button style={{ marginTop: '15px', padding: '10px 20px', background: '#d32f2f', color: 'white', border: 'none' }}>
              Go to Admin Panel
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: '50px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
        System Onboarding Tracker • Built with RBAC
      </div>
    </div>
  );
}