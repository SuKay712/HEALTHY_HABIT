import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const UserRoute = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to='/login' />;

  return <Outlet />;
};

export default UserRoute;
