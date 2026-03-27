// src/services/auth.js
import { jwtDecode } from 'jwt-decode';

export const getToken = () => localStorage.getItem('token');

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now(); // Check if token is expired
  } catch (err) {
    return false;
  }
};

// Get user permissions from JWT (we'll add them during login later)
export const getUserPermissions = () => {
  const token = getToken();
  if (!token) return [];

  try {
    const decoded = jwtDecode(token);
    return decoded.permissions || [];
  } catch (err) {
    return [];
  }
};

export const hasPermission = (requiredPerm) => {
  const perms = getUserPermissions();
  return perms.includes(requiredPerm);
};

// Optional: Get current user info from token
export const getCurrentUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    return null;
  }
};