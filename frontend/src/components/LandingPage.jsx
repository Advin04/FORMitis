import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="auth-container">
      <div className="panel auth-panel" style={{ textAlign: 'center', maxWidth: '600px', width: '100%', padding: '50px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div className="status-dot online" style={{ width: '30px', height: '30px' }}></div>
        </div>
        
        <h1 style={{ fontSize: '3rem', marginBottom: '15px', color: 'var(--text-primary)' }}>E-WARFARE TERMINAL</h1>
        
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: '1.6' }}>
          SECURE CONNECTION ESTABLISHED. AWAITING OPERATOR AUTHENTICATION.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link to="/login" className="btn-transmit" style={{ width: '180px', textDecoration: 'none' }}>
            AUTHENTICATE
          </Link>
          <Link to="/signup" className="btn-transmit" style={{ width: '180px', textDecoration: 'none', background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-secondary)' }}>
            REQUEST ACCESS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
