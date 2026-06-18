import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiLock, FiShield } from 'react-icons/fi';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Error: Access codes do not match!');
      return;
    }
    try {
      await axios.post('http://localhost:8081/api/auth/signup', {
        username,
        password,
        role,
        dob
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Failed to register');
    }
  };

  return (
    <div className="auth-container">
      <div className="panel auth-panel">
        <h2 style={{ marginBottom: '8px', fontSize: '1.8rem', color: 'var(--text-primary)' }}>REQUEST ACCESS</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>REGISTER NEW OPERATOR CREDENTIALS.</p>
        
        {error && <div className="error-alert" style={{ background: 'rgba(255, 51, 0, 0.1)', border: '1px solid var(--alert-color)', color: 'var(--alert-color)', padding: '10px', marginBottom: '20px', textAlign: 'center', textShadow: 'var(--alert-glow)' }}>{error}</div>}
        
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>OPERATOR ID (USERNAME)</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ENTER NEW ID"
              required 
            />
          </div>
          
          <div className="form-group">
            <label>DATE OF BIRTH</label>
            <input 
              type="date" 
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              style={{ padding: '12px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', width: '100%', fontFamily: 'var(--font-mono)' }}
              required 
            />
          </div>

          <div className="form-group">
            <label>ACCESS CODE (PASSWORD)</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="CREATE ACCESS CODE"
              required 
            />
          </div>

          <div className="form-group">
            <label>CONFIRM ACCESS CODE</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="VERIFY ACCESS CODE"
              required 
            />
          </div>

          <div className="form-group">
            <label>CLEARANCE LEVEL (ROLE)</label>
            <select 
              className="form-input" 
              style={{ padding: '12px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', width: '100%', fontFamily: 'var(--font-mono)' }}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER" style={{ color: 'black' }}>STANDARD OPERATOR (USER)</option>
              <option value="ADMIN" style={{ color: 'black' }}>COMMANDER (ADMIN)</option>
            </select>
          </div>
          
          <button type="submit" className="btn-transmit" style={{ marginTop: '32px' }}>
            TRANSMIT REQUEST
          </button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <span style={{ color: 'var(--text-secondary)' }}>ALREADY CLEARED? </span>
          <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>AUTHENTICATE</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
