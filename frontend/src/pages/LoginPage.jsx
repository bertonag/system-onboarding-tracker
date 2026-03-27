// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();        // ← Hook must be at the top level

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await loginUser({ username, password });
      
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setSuccess(`Welcome back, ${user?.username || 'User'}!`);

      // Redirect using React Router (cleaner than window.location)
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);

    } catch (err) {
      const errorMsg = 
        err.response?.data?.error || 
        err.response?.data?.msg || 
        err.message || 
        'Login failed. Please try again.';
      
      setError(errorMsg);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '420px',
      width: '100%',
      padding: '32px',
      border: '1px solid #ddd',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>System Onboarding Tracker</h2>
      <h3 style={{ textAlign: 'center', marginBottom: '32px' }}>Login</h3>

      {success && (
        <div style={{ 
          padding: '14px', 
          background: '#d4edda', 
          color: '#155724', 
          borderRadius: '6px', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {success}
        </div>
      )}

      {error && (
        <div style={{ 
          padding: '14px', 
          background: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '6px', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.trim())}
            required
            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
            placeholder="Enter your username"
          />
        </div>

        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: loading ? '#6c757d' : '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        Don't have an account? <a href="/register" style={{ color: '#1976d2' }}>Register here</a>
      </p>
    </div>
  );
}