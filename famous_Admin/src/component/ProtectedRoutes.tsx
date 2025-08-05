// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to /admin/login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;