import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/api/auth/login', {
        username,
        password
      });
      
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username); // Save username for chat
      
      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard'); // Normal user dashboard
      }
    } catch (err) {
      if (err.response) {
        setError('Server Error: ' + (err.response.data.message || err.response.data || err.response.status));
      } else {
        setError('Network Error: ' + err.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="panel auth-panel">
        <h2 style={{ marginBottom: '8px', fontSize: '1.8rem', color: 'var(--text-primary)' }}>SYSTEM LOGIN</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>AWAITING OPERATOR CREDENTIALS...</p>
        
        {error && <div className="error-alert" style={{ background: 'rgba(255, 51, 0, 0.1)', border: '1px solid var(--alert-color)', color: 'var(--alert-color)', padding: '10px', marginBottom: '20px', textAlign: 'center', textShadow: 'var(--alert-glow)' }}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>OPERATOR ID (USERNAME)</label>
            <input 
              type="text" 
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ENTER ID"
              required 
              autoComplete="off"
            />
          </div>
          
          <div className="form-group">
            <label>ACCESS CODE (PASSWORD)</label>
            <input 
              type="password" 
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>
          
          <button type="submit" className="btn-transmit" style={{ marginTop: '32px' }}>
            AUTHENTICATE
          </button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <span style={{ color: 'var(--text-secondary)' }}>NO CLEARANCE? </span>
          <Link to="/signup" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>REQUEST ACCESS</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
