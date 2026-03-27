// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',           // thanks to proxy → goes to correct backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request automatically (if exists)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: handle 401 globally (logout on token expire/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 422) {
      localStorage.removeItem('token');
      // You can redirect to login here later
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const loginUser = (credentials) =>
  api.post('/auth/login', credentials);

export const registerUser = (data) =>
  api.post('/auth/register', data);

export const getCurrentUser = () =>
  api.get('/auth/me');

export default api;