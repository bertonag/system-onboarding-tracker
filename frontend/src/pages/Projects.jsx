// src/pages/Projects.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { getCurrentUser } from '../services/api';
import { getUserPermissions } from '../services/auth';
import './Projects.css';

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ full_name: '', email: '' });
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    template: 'System Onboarding'
  });

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

  // Load mock projects
  useEffect(() => {
    setTimeout(() => {
      setProjects([
        { 
          id: 1, 
          name: 'IFMS Enhancement - Domestic Arrears', 
          description: 'Deployment of domestic arrears business process', 
          status: 'In Progress', 
          template: 'Major Change', 
          progress: 65, 
          owner: 'Gilbert' 
        },
        { 
          id: 2, 
          name: 'New Budget Utilization Report', 
          description: 'Development of new report on the system', 
          status: 'Completed', 
          template: 'Moderate Change', 
          progress: 100, 
          owner: 'Finance Team' 
        }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    const project = {
      id: Date.now(),
      ...newProject,
      status: 'Pending',
      progress: 0,
      owner: 'You',
      createdAt: new Date().toISOString(),
    };

    setProjects([project, ...projects]);
    setShowCreateModal(false);
    setNewProject({ name: '', description: '', template: 'System Onboarding' });

    alert('✅ Project created successfully!\n\n(Backend integration will be added in next phase)');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const avatarLetter = (user && (user.full_name || user.username)) 
    ? (user.full_name || user.username)[0].toUpperCase() 
    : 'U';

  return (
    <ProtectedRoute requiredPermission="view_projects">
      <div className="projects-shell" style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="projects-main">
          <div className="projects-container">
            <header className="projects-header">
              <div className="header-title-block">
                <h1>Projects</h1>
                <p className="header-subtitle">Manage your system onboarding projects</p>
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

              <button className="btn-primary" onClick={() => setShowCreateModal(true)}>+ New Project</button>
            </header>

            {loading ? (
              <p className="projects-placeholder">Loading projects...</p>
            ) : projects.length === 0 ? (
              <p className="projects-placeholder">No projects found. Create your first project!</p>
            ) : (
              <div className="projects-grid">
                {projects.map((project) => (
                  <article className="project-card" key={project.id}>
                    <div className="project-card-top">
                      <div>
                        <h3>{project.name}</h3>
                        <p>{project.description}</p>
                        <p><strong>Template:</strong> {project.template}</p>
                      </div>
                    </div>

                    <div className="project-status">
                      <span className={project.status === 'Completed' ? 'tag-completed' : 'tag-pending'}>
                        {project.status}
                      </span>
                      <p>Progress: <strong>{project.progress}%</strong></p>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Create New Project Modal */}
            {showCreateModal && (
              <div className="modal-overlay">
                <div className="modal-board">
                  <h2>Create New Project</h2>
                  <form onSubmit={handleCreateProject}>
                    <div className="form-group">
                      <label>Project Name *</label>
                      <input 
                        type="text" 
                        value={newProject.name} 
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} 
                        required 
                        placeholder="e.g. IFMS - New Payment Module" 
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea 
                        value={newProject.description} 
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} 
                        placeholder="Brief description of the change or onboarding" 
                      />
                    </div>

                    <div className="form-group">
                      <label>Category / Template</label>
                      <select 
                        value={newProject.template} 
                        onChange={(e) => setNewProject({ ...newProject, template: e.target.value })}
                      >
                        <option value="System Onboarding">System Onboarding (SAC)</option>
                        <option value="Minor Change">Minor Change</option>
                        <option value="Moderate Change">Moderate Change</option>
                        <option value="Major Change">Major Change</option>
                      </select>
                    </div>

                    <div className="modal-action-row">
                      <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={() => setShowCreateModal(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        Create Project
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

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
      </div>
    </ProtectedRoute>
  );
}