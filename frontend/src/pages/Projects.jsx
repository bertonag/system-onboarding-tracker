// src/pages/Projects.jsx
import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    template: 'System Onboarding' // Default template
  });

  // Mock data for now (we'll connect to backend later)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProjects([
        {
          id: 1,
          name: "IFMS Enhancement - Domestic Arrears",
          description: "Deployment of domestic arrears business process",
          status: "In Progress",
          template: "Major Change",
          progress: 65,
          owner: "Gilbert"
        },
        {
          id: 2,
          name: "New Report: Budget Utilization",
          description: "Development of new budget utilization report",
          status: "Completed",
          template: "Moderate Change",
          progress: 100,
          owner: "Finance Team"
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.name) return;

    const project = {
      id: Date.now(),
      ...newProject,
      status: "Pending",
      progress: 0,
      owner: "You"
    };

    setProjects([project, ...projects]);
    setShowCreateModal(false);
    setNewProject({ name: '', description: '', template: 'System Onboarding' });

    alert('Project created successfully! (Backend integration coming soon)');
  };

  return (
    <ProtectedRoute requiredPermission="view_projects">
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>Projects</h1>
          <button 
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '12px 24px',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            + Create New Project
          </button>
        </div>

        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {projects.map(project => (
              <div key={project.id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                background: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h3>{project.name}</h3>
                    <p style={{ color: '#666', margin: '8px 0' }}>{project.description}</p>
                    <p><strong>Template:</strong> {project.template}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      background: project.status === 'Completed' ? '#d4edda' : '#fff3cd',
                      color: project.status === 'Completed' ? '#155724' : '#856404',
                      fontSize: '14px'
                    }}>
                      {project.status}
                    </span>
                    <p style={{ marginTop: '10px' }}><strong>Progress:</strong> {project.progress}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Project Modal */}
        {showCreateModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              width: '500px',
              maxWidth: '90%'
            }}>
              <h2>Create New Project</h2>
              <form onSubmit={handleCreateProject}>
                <div style={{ marginBottom: '15px' }}>
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    required
                    style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label>Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    style={{ width: '100%', padding: '10px', marginTop: '5px', minHeight: '80px' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label>Change Category / Template</label>
                  <select
                    value={newProject.template}
                    onChange={(e) => setNewProject({...newProject, template: e.target.value})}
                    style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                  >
                    <option value="Minor Change">Minor Change</option>
                    <option value="Moderate Change">Moderate Change</option>
                    <option value="Major Change">Major Change</option>
                    <option value="System Onboarding">System Onboarding (SAC)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowCreateModal(false)}
                    style={{ flex: 1, padding: '12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={{ flex: 1, padding: '12px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '6px' }}
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}