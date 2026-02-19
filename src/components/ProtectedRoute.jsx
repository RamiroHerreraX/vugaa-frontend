// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f7fa'
      }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#133B6B', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#133B6B' }}>
          Cargando VUGAA...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    // Guardar la ruta intentada para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    // Redirigir al dashboard correspondiente según el rol
    const roleRoutes = {
      supera: '/supera/dashboard',
      comite: '/committee/dashboard',
      admin: '/admin/dashboard',
      asociacion: '/association/dashboard',
      agente: '/dashboard',
      profesionista: '/dashboard',
      empresario: '/dashboard'
    };
    
    return <Navigate to={roleRoutes[user.rol] || '/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;