import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = ({ setIsAdmin, setIsSuperAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        username,
        password
      });
      
      // Store token in sessionStorage
      sessionStorage.setItem('token', response.data.token);
      
      if (response.data.role === 'superadmin') {
        setIsSuperAdmin(true);
        sessionStorage.setItem('isSuperAdmin', 'true');
        navigate('/admin/super-dashboard');
      } else if (response.data.role === 'admin') {
        setIsAdmin(true);
        sessionStorage.setItem('isAdmin', 'true');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(true);
      setTimeout(() => setError(false), 500);
      alert('Invalid credentials');
    }
  };
  


  return (
    <div className="admin-login-container">
      <div className={`admin-login-card ${error ? 'error-shake' : ''}`}>
        <h1 className="admin-login-title">Admin Login</h1>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="input-group">
            <input
              type="text"
              id="username"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="username">Username</label>
          </div>
          
          <div className="input-group">
            <input
              type="password"
              id="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
