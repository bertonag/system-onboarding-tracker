// src/pages/ChecklistTracker.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { getCurrentUser } from '../services/api';
import { getUserPermissions } from '../services/auth';
import './ChecklistTracker.css';

export default function ChecklistTracker() {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [checklistType, setChecklistType] = useState('SAC');
  const [stages, setStages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ full_name: '', email: '' });

  // Mock projects
  const projects = [
    { id: 1, name: "IFMS Enhancement - Domestic Arrears", template: "Major Change" },
    { id: 2, name: "New Budget Utilization Report", template: "Moderate Change" },
  ];

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const avatarLetter = (user && (user.full_name || user.username)) 
    ? (user.full_name || user.username)[0].toUpperCase() 
    : 'U';

  // Checklist Templates from your Excel
  const checklistTemplates = {
    SAC: [
      { stage: "Planning & Initiation", items: [
        { id: 1, no: "1.1", requirement: "System concept note and business case", team: "Sponsor", status: false, comments: "" },
        { id: 2, no: "1.2", requirement: "Confirm availability of funds", team: "Owner", status: false, comments: "" },
      ]},
      { stage: "Requirements Gathering & Analysis", items: [
        { id: 3, no: "2.1", requirement: "Develop functional business requirements", team: "Business Team", status: false, comments: "" },
      ]},
      { stage: "Testing", items: [
        { id: 4, no: "6.1", requirement: "Develop test cases and procedures", team: "Business Team", status: false, comments: "" },
      ]}
    ],
    Minor: [
      { stage: "Conceptualisation and requirements", items: [
        { id: 101, no: "1", requirement: "Prepare a business case", team: "Business Team", status: false, comments: "" },
        { id: 102, no: "2", requirement: "Carry out the User Acceptance Tests (UAT)", team: "Business Team", status: false, comments: "" },
      ]},
      { stage: "Deployment to production", items: [
        { id: 103, no: "3", requirement: "Deployment to production", team: "Technical Team", status: false, comments: "" },
      ]}
    ],
    Moderate: [
      { stage: "Conceptualisation and requirements", items: [
        { id: 201, no: "1", requirement: "Prepare draft of concept note/business case", team: "Business Team", status: false, comments: "" },
      ]},
      { stage: "Development/Coding & Testing", items: [
        { id: 202, no: "2", requirement: "Carry out the User Acceptance Tests (UAT)", team: "Business Team", status: false, comments: "" },
      ]}
    ],
    Major: [
      { stage: "Conceptualisation and requirements", items: [
        { id: 301, no: "1", requirement: "Prepare draft of concept note/business case", team: "Business Team", status: false, comments: "" },
      ]},
      { stage: "Training & Go-live", items: [
        { id: 302, no: "2", requirement: "Training engagements for internal users", team: "Business Team", status: false, comments: "" },
      ]}
    ]
  };

  // Load checklist when type changes
  useEffect(() => {
    if (checklistType) {
      setStages(checklistTemplates[checklistType] || []);
      calculateProgress(checklistTemplates[checklistType] || []);
    }
  }, [checklistType]);

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
    const newStages = [...stages];
    const stage = newStages[stageIndex];
    const item = stage.items.find(i => i.id === itemId);
    
    if (item) {
      item.status = !item.status;
      setStages(newStages);
      calculateProgress(newStages);
    }
  };

  const updateComments = (stageIndex, itemId, comments) => {
    const newStages = [...stages];
    const item = newStages[stageIndex].items.find(i => i.id === itemId);
    if (item) {
      item.comments = comments;
      setStages(newStages);
    }
  };

  return (
    <ProtectedRoute requiredPermission="edit_checklist_items">
      <div className="checklist-shell" style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="checklist-main">
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

            {/* Progress Bar */}
            {stages.length > 0 && (
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
            )}

            {/* Checklist Stages */}
            {stages.length > 0 ? (
              stages.map((stage, stageIndex) => (
                <div key={stageIndex} style={{ 
                  marginBottom: '35px', 
                  border: '1px solid #ddd', 
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    background: '#f8f9fa', 
                    padding: '16px 24px', 
                    fontWeight: '600',
                    borderBottom: '1px solid #ddd'
                  }}>
                    {stage.stage}
                  </div>

                  <div style={{ padding: '10px 0' }}>
                    {stage.items.map((item, idx) => (
                      <div key={item.id} style={{
                        padding: '16px 24px',
                        borderBottom: idx < stage.items.length - 1 ? '1px solid #eee' : 'none',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '15px'
                      }}>
                        <input 
                          type="checkbox"
                          checked={item.status}
                          onChange={() => toggleItem(stageIndex, item.id)}
                          style={{ marginTop: '6px', transform: 'scale(1.3)' }}
                        />
                        
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '500' }}>
                            {item.no} - {item.requirement}
                          </div>
                          <small style={{ color: '#666' }}>Team: {item.team}</small>
                        </div>

                        <textarea
                          placeholder="Comments / Notes"
                          value={item.comments || ''}
                          onChange={(e) => updateComments(stageIndex, item.id, e.target.value)}
                          style={{
                            width: '320px',
                            height: '60px',
                            padding: '8px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#666', fontSize: '18px', marginTop: '80px' }}>
                Please select a project and checklist type to begin tracking.
              </p>
            )}
          </div>

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