// src/pages/ChecklistTracker.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { getCurrentUser, getProjects } from '../services/api';
import { getUserPermissions } from '../services/auth';
import './ChecklistTracker.css';

export default function ChecklistTracker() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [checklistType, setChecklistType] = useState('SAC');
  const [stages, setStages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ full_name: '', email: '' });
  const [loading, setLoading] = useState(true);

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
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
      }
    };
    loadUser();
  }, []);

  // Load projects from backend
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await getProjects();
        setProjects(response.data || []);
      } catch (err) {
        console.error("Failed to load projects from backend:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  // Load checklist templates from backend when checklistType changes
  useEffect(() => {
    if (checklistType) {
      loadChecklistTemplates();
    }
  }, [checklistType]);

  const loadChecklistTemplates = async () => {
    try {
      const response = await fetch('/api/onboarding/checklist-templates', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const templates = await response.json();
        const currentTemplate = templates[checklistType] || templates['SAC'] || [];
        setStages(currentTemplate);
        calculateProgress(currentTemplate);
      } else {
        console.error("Failed to load checklist templates");
        setStages([]);
      }
    } catch (err) {
      console.error("Error loading checklist templates:", err);
      setStages([]);
    }
  };

  const calculateProgress = (currentStages) => {
    let totalItems = 0;
    let completedItems = 0;

    currentStages.forEach(stage => {
      stage.items.forEach(item => {
        totalItems++;
        if (item.status) completedItems++;
      });
    });

    setProgress(totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0);
  };

  const toggleItem = (stageIndex, itemId) => {
    console.log(`Toggle item ${itemId} in stage ${stageIndex} - connect to backend later`);
    // TODO: Call PUT /api/onboarding/projects/{project_id}/checklist/items/{item_id}
  };

  const updateComments = (stageIndex, itemId, comments) => {
    console.log(`Update comments for item ${itemId} - connect to backend later`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Avatar letter
  const avatarLetter = user && (user.full_name || user.username)
    ? (user.full_name || user.username)[0].toUpperCase()
    : 'U';

  return (
    <ProtectedRoute requiredPermission="edit_checklist_items">
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />

        <div style={{ marginLeft: '260px', flex: 1 }}>
          <div className="checklist-container">
            <header className="checklist-header">
              <div className="header-title-block">
                <h1>Checklist Tracker</h1>
                <p className="header-subtitle">Track SAC and CDC checklist progress</p>
              </div>

              <div className="header-icons">
                <button className="header-icon" title="Help">❓</button>
                <button className="header-icon" title="Settings">⚙️</button>
                <button className="header-icon" title="Notifications">✨</button>
                <button className="header-icon" title="Apps">☰</button>
              </div>

              <div className="header-profile-wrap" onBlur={() => setTimeout(() => setIsProfileMenuOpen(false), 150)}>
                <div
                  className="header-profile-chip"
                  onClick={() => setIsProfileMenuOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={isProfileMenuOpen}
                >
                  <div className="header-profile-avatar">{avatarLetter}</div>
                  <div className="header-profile-details">
                    <div className="header-profile-name">{user?.full_name || user?.username || 'User'}</div>
                    <div className="header-profile-email">{user?.email}</div>
                  </div>
                  <span className="header-profile-arrow">▾</span>
                </div>

                {isProfileMenuOpen && (
                  <div className="header-profile-menu">
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

            <div className="checklist-controls">
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Project</label>
                <select 
                  value={selectedProject?.id || ''}
                  onChange={(e) => {
                    const proj = projects.find(p => p.id === parseInt(e.target.value));
                    setSelectedProject(proj);
                  }}
                  style={{ padding: '10px', width: '320px', borderRadius: '6px' }}
                >
                  <option value="">Select a Project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Checklist Type</label>
                <select 
                  value={checklistType}
                  onChange={(e) => setChecklistType(e.target.value)}
                  style={{ padding: '10px', width: '220px', borderRadius: '6px' }}
                >
                  <option value="SAC">SAC - System Assessment Checklist</option>
                  <option value="Minor">Minor Change (CDC)</option>
                  <option value="Moderate">Moderate Change (CDC)</option>
                  <option value="Major">Major Change (CDC)</option>
                </select>
              </div>
            </div>

            {stages.length > 0 ? (
              <>
                {/* Progress Bar */}
                <div style={{ marginBottom: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong>Overall Progress</strong>
                    <strong>{progress}%</strong>
                  </div>
                  <div style={{ height: '12px', background: '#e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${progress}%`, 
                      background: progress > 80 ? '#28a745' : progress > 40 ? '#ffc107' : '#1976d2',
                      transition: 'width 0.4s'
                    }} />
                  </div>
                </div>

                {/* Checklist Stages */}
                {stages.map((stage, stageIndex) => (
                  <div key={stageIndex} className="checklist-stage">
                    <div className="stage-header">
                      {stage.stage}
                    </div>

                    <div className="stage-items">
                      {stage.items.map((item, idx) => (
                        <div key={item.id} className="checklist-item">
                          <input 
                            type="checkbox"
                            checked={item.status}
                            onChange={() => toggleItem(stageIndex, item.id)}
                          />
                          <div className="item-content">
                            <div className="item-requirement">
                              {item.no} - {item.requirement}
                            </div>
                            <small className="item-team">Team: {item.team}</small>
                          </div>
                          <textarea
                            placeholder="Comments / Notes"
                            value={item.comments || ''}
                            onChange={(e) => updateComments(stageIndex, item.id, e.target.value)}
                            className="item-comments"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="no-data-message">
                {loading ? "Loading from backend..." : "Please select a project and checklist type to begin tracking."}
              </p>
            )}
          </div>

          {/* Edit Profile Modal */}
          {isEditProfileOpen && (
            <div className="profile-card-overlay" role="dialog" aria-modal="true">
              <div className="profile-card">
                <h3>Edit Profile</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setUser((curr) => ({ ...curr, full_name: profileForm.full_name, email: profileForm.email }));
                  setIsEditProfileOpen(false);
                }}>
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
                    <button 
                      type="button" 
                      onClick={() => setIsEditProfileOpen(false)} 
                      className="btn-secondary"
                    >
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
    </ProtectedRoute>
  );
}