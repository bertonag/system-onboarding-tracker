import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Use proxy if you added it: '/api/auth/login'
      const response = await axios.post('http://localhost:5001/login', {
        username,
        password,
      });
      setMessage('Login successful! Token: ' + response.data.token);
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      setMessage(
        'Login failed: ' +
          (error.response?.data?.msg || error.message)
      );
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem' }}>
      <h1>System Onboarding Tracker</h1>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Username:</label><br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        
        <button type="submit" style={{ padding: '0.6rem 1.2rem' }}>
          Login
        </button>
      </form>

      {message && (
        <p style={{ marginTop: '1.5rem', color: message.includes('successful') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default App;