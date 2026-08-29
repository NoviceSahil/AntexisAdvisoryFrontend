import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, API_CONFIG } from '../../../config/api';
import logoMark from '../../../assets/logo-mark.png';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // The server sets an httpOnly session cookie on success - there is
      // nothing for the client to store itself.
      const response = await axios.post(API_ENDPOINTS.ADMIN_LOGIN, { username, password }, API_CONFIG);
      navigate(response.data.role === 'superadmin' ? '/admin/super-dashboard' : '/admin/dashboard');
    } catch (err) {
      setError(true);
      setTimeout(() => setError(false), 500);
      alert(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-shell">
      <div className={`admin-login-card${error ? ' error-shake' : ''}`}>
        <div className="brand">
          <img src={logoMark} alt="" className="mark" />
          <span className="names">
            <strong>Ankita & Associates</strong>
            <span>Admin</span>
          </span>
        </div>
        <h1>Sign in to continue</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="admin-username">Username</label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
