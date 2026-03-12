// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { palette } from "./theme";
import RecuperarPassword from "./pages/auth/RecuperarPassword";
import RestablecerPassword from "./pages/auth/RestablecerPassword";

// Layouts
import SuperAdminLayout from "./components/layout/SuperAdminLayout";
import AdminLayout from "./components/layout/AdminLayout";
import CommitteeLayout from "./components/layout/CommitteeLayout";
import AssociationLayout from "./components/layout/AssociationLayout";
import UserLayout from "./components/layout/UserLayout";

// Páginas de autenticación
import Login from "./pages/auth/Login";

//Pagina de redirección
import PaginaRedireccion from "./pages/Pagina_Principal/pagina_redireccion";
import PaginaLegalCompleta from "./pages/Pagina_Principal/pagina_legal";
import SiteMap from "./pages/Pagina_Principal/SiteMap";

// Páginas de Super Admin
import SuperASystemInstances from "./pages/superadmin/SuperASystemInstances";
import SuperAAdminDashboard from "./pages/superadmin/SuperAAdminDashboard";
import SuperAUserManagement from "./pages/superadmin/SuperAUserManagement";
import SuperAAuditLog from "./pages/superadmin/SuperAAuditLog";
import SuperAExpedienteConfig from "./pages/superadmin/SuperAConfigExpediente";
import SuperAReports from "./pages/superadmin/SuperAReports";
import SuperAProfile from "./pages/superadmin/SuperAProfile";
import SuperAAlerts from "./pages/superadmin/SuperAAlerts";
import Adminprofile from "./pages/superadmin/Adminprofile";
// Páginas de Admin
import AdminDashboard from "./pages/admin/Dashboard";
import SystemConfig from "./pages/admin/SystemConfig";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminProfileI from "./pages/admin/AdminprofileI";
import ConfigExpediente from "./pages/admin/ConfigExpediente";
import ConfigDeclaraciones from "./pages/admin/ConfigDeclaraciones";
import GeneralAlerts from "./pages/admin/GeneralAlerts";
import Reports from "./pages/admin/Reports";
import UserManagement from "./pages/admin/UserManagement";
import UserReview from "./pages/admin/UserReview";
import AdminAuditLog from "./pages/admin/AdminAuditLog";

// Páginas de Comité
import CommitteeDashboard from "./pages/committee/CommitteeDashboard";


// Páginas de Usuario agente
import UserDashboard from "./pages/agente/dashboard/Dashboard";
import Certifications from "./pages/agente/certifications/Certifications";
import Declaraciones from "./pages/agente/expediente/Declaraciones";
import Notificaciones from "./pages/agente/notifications/AlertsAgent";
import Expediente from "./pages/agente/expediente/Expediente";
import Profile from "./pages/agente/profile/Profile_agent";
import CompleteProfile from "./pages/agente/profile/CompleteProfile";
import AuditAgent from "./pages/agente/auditoria/AuditAgent";

// Componente protegido
import ProtectedRoute from "./components/ProtectedRoute";

// Association
import AssociationDashboard from "./pages/association/AssociationDashboard";
import ControlAsociados from "./pages/association/ControlAsociados";
import AssociationAuditLog from "./pages/association/AssociationAuditLog";
import AssociationProfile from "./pages/association/AssociationProfile";
import ExpedienteAssociation from "./pages/association/ExpedienteAsociados";
import AlertsAsociacion from "./pages/association/AlertsAsociacion";
import AssociationProfileI from "./pages/association/AssociationProfileI";

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
      default: "#f5f7fa",
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
            <Route path="/recuperar-password" element={<RecuperarPassword />} />
            <Route
              path="/restablecer-password"
              element={<RestablecerPassword />}
            />
            <Route path="/inicio" element={<PaginaRedireccion />} />
            <Route path="/legal" element={<PaginaLegalCompleta />} />
            <Route path="/sitemap" element={<SiteMap />} />

            {/* Rutas protegidas - Super Admin */}
            <Route
              path="/supera"
              element={
                <ProtectedRoute allowedRoles={["supera"]}>
                  <SuperAdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="instancias" element={<SuperASystemInstances />} />
              <Route path="dashboard" element={<SuperAAdminDashboard />} />
              <Route path="users" element={<SuperAUserManagement />} />
              <Route path="audit" element={<SuperAAuditLog />} />
              <Route
                path="expediente-config"
                element={<SuperAExpedienteConfig />}
              />
              <Route path="reports" element={<SuperAReports />} />
              <Route path="profile" element={<SuperAProfile />} />
              <Route path="alerts" element={<SuperAAlerts />} />
            </Route>

             <Route
              path="/supera/profileI"
              element={
                <ProtectedRoute allowedRoles={["supera"]}>
                  <Adminprofile />
                </ProtectedRoute>
              }
            />

            {/* Rutas protegidas - Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route
                path="/admin/config_expedientes"
                element={<ConfigExpediente />}
              />
              <Route path="/admin/alerts" element={<GeneralAlerts />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/users/:id/review" element={<UserReview />} />
              <Route path="/admin/config" element={<SystemConfig />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/admin/config_declaraciones" element={<ConfigDeclaraciones />} />
              <Route path="/admin/auditoria" element={<AdminAuditLog />} />
            
            </Route>

            <Route
              path="/admin/profileI"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminProfileI />
                </ProtectedRoute>
              }
            />
           

            {/* Rutas protegidas - Comité */}
            <Route
              path="/committee"
              element={
                <ProtectedRoute allowedRoles={["comite"]}>
                  <CommitteeLayout />
                </ProtectedRoute>
              }
            >
              
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CommitteeDashboard />} />
            </Route>

            {/* Rutas protegidas - Asociación */}
            <Route
              path="/association"
              element={
                <ProtectedRoute allowedRoles={["asociacion"]}>
                  <AssociationLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AssociationDashboard />} />
              <Route path="alerts" element={<AlertsAsociacion />} />
              <Route path="control-asociados" element={<ControlAsociados />} />
              <Route path="expediente" element={<ExpedienteAssociation />} />
              <Route path="profile" element={<AssociationProfile />} />
              <Route path="audit" element={<AssociationAuditLog />} />
            </Route>

            <Route
              path="/association/profileI"
              element={
                <ProtectedRoute allowedRoles={["asociacion"]}>
                  <AssociationProfileI />
                </ProtectedRoute>
              }
            />

            {/* Rutas protegidas - Usuario (Agente, Profesionista, Empresario) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={["agente", "profesionista", "empresario"]}
                >
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserDashboard />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="notificaciones" element={<Notificaciones />} />
              <Route path="certificaciones" element={<Certifications />} />
              <Route path="declaraciones" element={<Declaraciones />} />
              <Route path="expediente" element={<Expediente />} />
              <Route path="perfil" element={<Profile />} />
              <Route path="auditoria-agente" element={<AuditAgent />} />
            
              
            </Route>
              {/* ✅ RUTA INDEPENDIENTE - Completar Perfil (sin navbar) */}
              <Route
                path="/dashboard/completar-perfil"
                element={
                  <ProtectedRoute allowedRoles={["agente", "profesionista", "empresario"]}>
                    <CompleteProfile />
                  </ProtectedRoute>
                }
              />

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
