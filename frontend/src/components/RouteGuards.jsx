import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protect route - redirect to login if not authenticated
export const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="page-loader">
      <div className="spinner" style={{ width: 40, height: 40 }}></div>
      <p>Loading...</p>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

// Public only route - redirect dashboard if already logged in
export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    const map = { seeker: '/seeker', employer: '/employer', admin: '/admin' };
    return <Navigate to={map[user.role] || '/'} replace />;
  }
  return children;
};
