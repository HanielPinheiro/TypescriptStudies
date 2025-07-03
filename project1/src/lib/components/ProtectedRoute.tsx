import { Navigate } from 'react-router-dom';
import type { JSX } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
