// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',                    // Works with Vite proxy in dev + same-domain in production
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,                     // Prevent hanging requests
});

// Request Interceptor - Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor - Handle common errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Token expired or invalid → force logout
    if (status === 401 || status === 422) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Optional: Handle other common errors
    if (status === 403) {
      console.warn('Permission denied:', error.response?.data);
    }

    if (status === 500) {
      console.error('Server error:', error.response?.data);
    }

    return Promise.reject(error);
  }
);

// ====================== AUTH ENDPOINTS ======================
export const loginUser = (credentials) => 
  api.post('/auth/login', credentials);

export const registerUser = (data) => 
  api.post('/auth/register', data);

export const getCurrentUser = () => 
  api.get('/auth/me');

// ====================== PROJECTS ENDPOINTS ======================
export const getProjects = () => 
  api.get('/onboarding/projects');

export const createProject = (data) => 
  api.post('/onboarding/projects', data);

export const getProjectById = (id) => 
  api.get(`/onboarding/projects/${id}`);

export const updateProject = (id, data) => 
  api.put(`/onboarding/projects/${id}`, data);

// ====================== CHECKLIST ENDPOINTS ======================
export const getChecklist = (projectId, checklistType) => 
  api.get(`/onboarding/projects/${projectId}/checklist?type=${checklistType}`);

export const updateChecklistItem = (projectId, itemId, data) => 
  api.put(`/onboarding/projects/${projectId}/checklist/items/${itemId}`, data);

export const getChecklistProgress = (projectId) => 
  api.get(`/onboarding/projects/${projectId}/checklist/progress`);

// ====================== UTILITY ======================
export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export default api;