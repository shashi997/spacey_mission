import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // Logged in but not an admin, redirect away.
    // You could also show an "Unauthorized" page.
    console.log("Access Denied: User is not an admin.");
    return <Navigate to="/login" replace />;
  }

  // User is authenticated and is an admin, render the nested routes
  return <Outlet />;
};

export default ProtectedRoute;
