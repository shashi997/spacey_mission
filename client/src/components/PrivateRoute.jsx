import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/authentication';

const PrivateRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Show a loading indicator while we're verifying the user's auth state.
    // This prevents a flicker of the login page for already-logged-in users.
    return <div className="flex items-center justify-center h-screen bg-deep-black text-white">Loading...</div>;
  }

  // If loading is finished and there's no user, redirect to the login page.
  // The `replace` prop is used to replace the `/dashboard` entry in the
  // history stack so the user can't click "back" to the protected page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the child route component using <Outlet />.
  return <Outlet />;
};

export default PrivateRoute;
