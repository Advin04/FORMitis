import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiUsers, FiSettings, FiActivity, FiLogOut, FiMessageSquare } from 'react-icons/fi';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert("Access Denied!");
        navigate('/login');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8081/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleResetPassword = async (id) => {
    const newPassword = window.prompt('Enter new password:');
    if (newPassword) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:8081/api/admin/users/${id}/reset-password`, 
          { newPassword },
          { headers: { Authorization: `Bearer ${token}` }}
        );
        alert('Password reset successfully!');
      } catch (err) {
        alert('Failed to reset password');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="title-section">
          <h1>COMMAND CENTER</h1>
          <div style={{ color: 'var(--text-secondary)', display: 'flex', gap: '20px' }}>
            <span>Tactical Operator Management</span>
            <span>|</span>
            <span>COMMANDER: {localStorage.getItem('username') || 'ADMIN'}</span>
            <span>|</span>
            <span>{currentDate}</span>
          </div>
        </div>
        <div className="status-container" style={{ textAlign: 'right' }}>
          <div className="status-indicator">
            <div className="status-dot online"></div>
            <span>SECURE UPLINK ACTIVE</span>
          </div>
          <button onClick={handleLogout} style={{
            marginTop: '10px', background: 'transparent', color: 'var(--alert-color)',
            border: '1px solid var(--alert-color)', padding: '5px 10px', cursor: 'pointer',
            fontFamily: 'var(--font-mono)'
          }}>DISCONNECT</button>
        </div>
      </header>
      
      <div className="panels-wrapper">
        <div className="left-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="panel">
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '15px' }}>SYSTEM CONTROLS</h2>
            <button className="btn-transmit" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <FiUsers /> MANAGE OPERATORS
            </button>
            <Link to="/chat" className="btn-transmit" style={{ textDecoration: 'none', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-secondary)' }}>
              <FiMessageSquare /> INITIALIZE COMMS
            </Link>
            <button className="btn-transmit" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-secondary)' }}>
              <FiActivity /> SYSTEM LOGS
            </button>
          </div>
          
          <div className="panel">
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>NETWORK STATS</h3>
            <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', textShadow: 'var(--accent-glow)' }}>
              {users.length}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>REGISTERED OPERATORS</div>
          </div>
        </div>

        <div className="right-panel">
          <div className="panel" style={{ padding: '0', height: '100%' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="status-dot online"></div>
              <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)' }}>OPERATOR DIRECTORY</h2>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>OPERATOR</th>
                    <th>CLEARANCE</th>
                    <th>REGISTRATION DATE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>#{user.id}</td>
                      <td style={{ fontWeight: 'bold' }}>{user.username}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', 
                          border: `1px solid ${user.role === 'ADMIN' ? 'var(--alert-color)' : 'var(--text-primary)'}`,
                          color: user.role === 'ADMIN' ? 'var(--alert-color)' : 'var(--text-primary)',
                          background: user.role === 'ADMIN' ? 'rgba(255,51,0,0.1)' : 'rgba(0,255,102,0.1)',
                          fontSize: '0.8rem'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-secondary)' }}></span> ACTIVE
                        </span>
                      </td>
                      <td>
                        <button className="action-btn" onClick={() => handleResetPassword(user.id)} title="Reset Password" style={{ marginRight: '8px' }}>
                          RESET
                        </button>
                        <button className="action-btn btn-delete" onClick={() => handleDelete(user.id)} title="Delete User">
                          PURGE
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                        NO OPERATORS FOUND IN DATABASE.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
