import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const AdminRoute: React.FC = () => {
  const { isAdmin } = useUser();
  
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default AdminRoute;