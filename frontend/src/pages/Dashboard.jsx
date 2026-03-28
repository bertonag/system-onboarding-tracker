// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getCurrentUser } from '../services/api';
import { getUserPermissions, hasPermission } from '../services/auth';
import './Dashboard.css';
const goToProjects = () => navigate('/projects');
const goToChecklists = () => navigate('/checklists');
export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ full_name: '', email: '' });
  
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
        setProfileForm({
          full_name: response.data.full_name || '',
          email: response.data.email || ''
        });

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

  const goToProjects = () => navigate('/projects');
  const goToChecklists = () => navigate('/checklists');

  const avatarLetter = (user && (user.full_name || user.username)) 
    ? (user.full_name || user.username)[0].toUpperCase() 
    : 'U';

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={{ marginLeft: '260px', flex: 1 }}>
        <div className="dashboard-container">
          <header className="dashboard-header">
            <div className="dashboard-title-block">
              <h1>System Onboarding Tracker</h1>
              <p className="dashboard-subtitle">
                Welcome back, <strong>{user?.full_name || user?.username}</strong>
              </p>
            </div>

            <div className="dashboard-icons">
              <button className="dash-icon" title="Help">❓</button>
              <button className="dash-icon" title="Settings">⚙️</button>
              <button className="dash-icon" title="Notifications">✨</button>
              <button className="dash-icon" title="Apps">☰</button>
            </div>

            <div className="dashboard-profile-wrap" onBlur={() => setTimeout(() => setIsProfileMenuOpen(false), 150)}>
              <div
                className="profile-chip"
                onClick={() => setIsProfileMenuOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={isProfileMenuOpen}
              >
                <div className="profile-avatar">{avatarLetter}</div>
                <div className="profile-details">
                  <div className="profile-name">{user?.full_name || user?.username}</div>
                  <div className="profile-email">{user?.email}</div>
                </div>
                <span className="profile-arrow">▾</span>
              </div>

              {isProfileMenuOpen && (
                <div className="profile-menu">
                  <button 
                    type="button" 
                    onClick={() => { 
                      setIsEditProfileOpen(true); 
                      setIsProfileMenuOpen(false); 
                    }}
                  >
                    Edit Profile
                  </button>
                  <button type="button" onClick={handleLogout}>Sign out</button>
                </div>
              )}
            </div>
          </header>

          {error && <p className="dashboard-error">{error}</p>}

          <section className="quick-access">
            <h2>Quick Access</h2>
            <div className="cards-grid">
              <article className="action-card action-projects" onClick={goToProjects}>
                <h3>📋 Projects</h3>
                <p>View all onboarding projects and their current status.</p>
                <button className="action-btn">Go to Projects →</button>
              </article>

              {hasPermission('edit_checklist_items') && (
                <article className="action-card action-checklist" onClick={goToChecklists}>
                  <h3>✅ Checklist Tracker</h3>
                  <p>Track progress using SAC and CDC checklists.</p>
                  <button className="action-btn">Open Checklist Tracker →</button>
                </article>
              )}

              {hasPermission('view_admin_dashboard') && (
                <article className="action-card action-admin">
                  <h3>🔧 Admin Panel</h3>
                  <p>System administration and user management.</p>
                  <button className="action-btn">Go to Admin Panel</button>
                </article>
              )}
            </div>
          </section>

          <footer className="dashboard-footer">System Onboarding Tracker • Phase 2 Complete</footer>

          {/* Edit Profile Modal */}
          {isEditProfileOpen && (
            <div className="profile-card-overlay" role="dialog" aria-modal="true">
              <div className="profile-card">
                <h3>Edit Profile</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setUser((curr) => ({ ...curr, full_name: profileForm.full_name, email: profileForm.email }));
                    setIsEditProfileOpen(false);
                  }}
                >
                  <label>
                    Full Name
                    <input
                      type="text"
                      value={profileForm.full_name}
                      onChange={(e) => setProfileForm((p) => ({ ...p, full_name: e.target.value }))}
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                    />
                  </label>

                  <div className="permissions-edit">
                    <strong>Permissions ({permissions.length})</strong>
                    <ul>
                      {permissions.map((perm) => (
                        <li key={perm}>{perm}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="profile-card-actions">
                    <button type="button" onClick={() => setIsEditProfileOpen(false)} className="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}