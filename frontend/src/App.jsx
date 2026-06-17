import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './components/LandingPage';
import WhatsAppInterface from './components/WhatsAppInterface';

const PrivateRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" />;
  if (roleRequired && role !== roleRequired) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/chat" 
          element={
            <PrivateRoute>
              <WhatsAppInterface />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <PrivateRoute roleRequired="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <div className="auth-container">
                <div className="panel auth-panel" style={{ textAlign: 'center' }}>
                  <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>SYSTEM ACCESS GRANTED</h1>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>OPERATOR LOGGED IN SUCCESSFULLY</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <Link to="/chat" className="btn-transmit" style={{ textDecoration: 'none', display: 'block' }}>
                      INITIALIZE SIGNAL CHAT
                    </Link>
                    <button 
                      className="btn-transmit" 
                      onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                      style={{ border: '1px solid var(--alert-color)', color: 'var(--alert-color)', background: 'transparent' }}
                    >
                      DISCONNECT
                    </button>
                  </div>
                </div>
              </div>
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;