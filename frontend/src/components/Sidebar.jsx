// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getUserPermissions, hasPermission } from '../services/auth';

export default function Sidebar() {
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const permissions = getUserPermissions();

  return (
    <div style={{
      width: '260px',
      background: '#1e2937',
      color: 'white',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      overflowY: 'auto',
      padding: '20px 0',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
    }}>
      {/* Logo / Title */}
      <div style={{ padding: '0 24px 30px 24px', borderBottom: '1px solid #334155' }}>
        <h2 style={{ margin: 0, fontSize: '22px' }}>Onboarding Tracker</h2>
        <p style={{ margin: '6px 0 0 0', fontSize: '14px', opacity: 0.7 }}>PFM Systems</p>
      </div>

      {/* Navigation Menu */}
      <div style={{ padding: '20px 0' }}>
        <NavItem to="/dashboard" icon="🏠" label="Dashboard" />

        {hasPermission('view_projects') && (
          <>
            <div
              onClick={() => setProjectsExpanded((v) => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 24px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '15px',
                backgroundColor: projectsExpanded ? '#334155' : 'transparent',
                borderLeft: projectsExpanded ? '4px solid #60a5fa' : '4px solid transparent',
              }}
            >
              <span style={{ fontSize: '18px' }}>📋</span>
              <span>Projects</span>
              <span style={{ marginLeft: 'auto', opacity: 0.7 }}>{projectsExpanded ? '▾' : '▸'}</span>
            </div>

            {projectsExpanded && (
              <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '24px' }}>
                <SubNavItem to="/projects" label="View Projects" />
                <SubNavItem to="/projects/new" label="New Project" />
              </div>
            )}
          </>
        )}

        {hasPermission('edit_checklist_items') && (
          <NavItem to="/checklists" icon="✅" label="Checklist Tracker" />
        )}

        {hasPermission('view_admin_dashboard') && (
          <NavItem to="/admin" icon="🔧" label="Admin Panel" />
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        position: 'absolute', 
        bottom: '30px', 
        left: '24px', 
        right: '24px',
        fontSize: '13px',
        opacity: 0.6 
      }}>
        © 2026 System Onboarding Tracker
      </div>
    </div>
  );
}

// Reusable Nav Item Component
function NavItem({ to, icon, label, permission }) {
  // If permission is required, check it
  if (permission && !hasPermission(permission)) {
    return null;
  }

  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 24px',
        color: isActive ? '#60a5fa' : 'white',
        textDecoration: 'none',
        fontSize: '15px',
        backgroundColor: isActive ? '#334155' : 'transparent',
        borderLeft: isActive ? '4px solid #60a5fa' : '4px solid transparent',
      })}
    >
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

function SubNavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        padding: '10px 24px',
        color: isActive ? '#60a5fa' : '#d1d5db',
        textDecoration: 'none',
        fontSize: '14px',
        borderLeft: isActive ? '4px solid #60a5fa' : '4px solid transparent',
        backgroundColor: isActive ? '#1f2937' : 'transparent',
        margin: '1px 0',
      })}
    >
      {label}
    </NavLink>
  );
}