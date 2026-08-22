import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, API_CONFIG } from '../../config/api';

// Gates admin routes on a real, server-verified session - the backend is
// the only source of truth for who's logged in and with what role. There is
// deliberately no client-side flag to trust here.
const ProtectedAdminRoute = ({ requiredRole, redirectPath }) => {
  const [status, setStatus] = useState('checking'); // 'checking' | 'allowed' | 'denied'

  useEffect(() => {
    let isMounted = true;
    axios.get(API_ENDPOINTS.ADMIN_ME, API_CONFIG)
      .then((response) => {
        if (!isMounted) return;
        const role = response.data.role;
        const allowed = requiredRole === 'superadmin'
          ? role === 'superadmin'
          : role === 'admin' || role === 'superadmin';
        setStatus(allowed ? 'allowed' : 'denied');
      })
      .catch(() => {
        if (isMounted) setStatus('denied');
      });
    return () => { isMounted = false; };
  }, [requiredRole]);

  if (status === 'checking') {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#7A7A7A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem' }}>
        Checking session…
      </div>
    );
  }
  if (status === 'denied') {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

export default ProtectedAdminRoute;
