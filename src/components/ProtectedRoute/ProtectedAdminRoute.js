import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedAdminRoute = ({ isAllowed, redirectPath }) => {
  const isAuthenticated = sessionStorage.getItem('isAdmin') === 'true' || 
                         sessionStorage.getItem('isSuperAdmin') === 'true';

  if (!isAuthenticated || !isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

export default ProtectedAdminRoute;
