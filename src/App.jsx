// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { palette } from './theme';

// Layouts
import SuperAdminLayout from './components/layout/SuperAdminLayout';
import AdminLayout from './components/layout/AdminLayout';
import CommitteeLayout from './components/layout/CommitteeLayout';
import AssociationLayout from './components/layout/AssociationLayout';
import UserLayout from './components/layout/UserLayout';

// Páginas de autenticación
import Login from './pages/auth/Login';

//Pagina de redirección
import PaginaRedireccion from './pages/Pagina_Principal/pagina_redireccion';

// Páginas de Super Admin
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import SystemInstances from './pages/superadmin/SystemInstances';

// Páginas de Admin
import AdminDashboard from './pages/admin/Dashboard';

// Páginas de Comité
import CommitteeDashboard from './pages/committee/Dashboard';
import PendingReviews from './pages/committee/PendingReviews';

// Páginas de Usuario
import UserDashboard from './pages/user/Dashboard';

// Componente protegido
import ProtectedRoute from './components/ProtectedRoute';

// Crear tema de MUI
const theme = createTheme({
  palette: {
    primary: {
      main: palette.primary.main,
    },
    secondary: {
      main: palette.secondary.main,
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<Login />} />
            <Route path="/inicio" element={<PaginaRedireccion />} />


            {/* Rutas protegidas - Super Admin */}
            <Route
              path="/supera"
              element={
                <ProtectedRoute allowedRoles={['supera']}>
                  <SuperAdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<SuperAdminDashboard />} />
              <Route path="instancias" element={<SystemInstances />} />
            </Route>

            {/* Rutas protegidas - Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
            </Route>

            {/* Rutas protegidas - Comité */}
            <Route
              path="/committee"
              element={
                <ProtectedRoute allowedRoles={['comite']}>
                  <CommitteeLayout />
                </ProtectedRoute>
              }
            >
              <Route path="pending" element={<PendingReviews />} />
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CommitteeDashboard />} />
            </Route>

            {/* Rutas protegidas - Asociación */}
            <Route
              path="/association"
              element={
                <ProtectedRoute allowedRoles={['asociacion']}>
                  <AssociationLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} /> {/* Temporalmente usamos AdminDashboard */}
            </Route>

            {/* Rutas protegidas - Usuario (Agente, Profesionista, Empresario) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['agente', 'profesionista', 'empresario']}>
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserDashboard />} />
            </Route>

            {/* Ruta por defecto */}
            <Route path="/" element={<Navigate to="/inicio" />} />
            <Route path="*" element={<Navigate to="/inicio" />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;