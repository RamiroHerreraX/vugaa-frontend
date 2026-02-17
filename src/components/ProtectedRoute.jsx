import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f7fa'
      }}>
        Cargando VUGAA...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    switch (user.rol) {
      case 'supera':
        return <Navigate to="/supera/dashboard" />;
      case 'comite':
        return <Navigate to="/committee/dashboard" />;
      case 'admin':
        return <Navigate to="/admin/dashboard" />;
      case 'asociacion':
        return <Navigate to="/association/dashboard" />;
      default:
        return <Navigate to="/dashboard" />;
    }
  }

  return children;
};

export default ProtectedRoute;