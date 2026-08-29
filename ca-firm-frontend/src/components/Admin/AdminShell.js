import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, API_CONFIG } from '../../config/api';
import logoMark from '../../assets/logo-mark.png';

// Shared shell for both admin dashboards - dark sidebar, light table area.
// Deliberately a different visual language from the public site, since
// this is an internal tool, not something a visitor should ever see.
const AdminShell = ({ subtitle, navItems, children }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(API_ENDPOINTS.ADMIN_LOGOUT, {}, API_CONFIG);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/admin/login');
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-side">
        <div className="brand">
          <img src={logoMark} alt="" className="mark" />
          <span className="names">
            <strong>Ankita & Associates</strong>
            <span>{subtitle}</span>
          </span>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <button type="button" className="admin-logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
      <div className="admin-main">{children}</div>
    </div>
  );
};

export default AdminShell;
