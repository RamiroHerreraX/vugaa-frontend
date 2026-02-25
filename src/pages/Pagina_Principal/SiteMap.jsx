import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  alpha,
  Button,
  Container,
  Divider,
  Stack,
  IconButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Folder as FolderIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Gavel as GavelIcon,
  Login as LoginIcon,
  LockReset as LockResetIcon,
  PrivacyTip as PrivacyTipIcon,
  AdminPanelSettings as AdminIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  AssignmentTurnedIn as AuditIcon,
  History as HistoryIcon,
  LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon
} from '@mui/icons-material';

// Paleta de colores mejorada - más luminosa en secciones intermedias
const colors = {
  primary: {
    main: "#133B6B",
    light: "#E8F0FE",
    medium: "#2A5A8C",
    dark: "#0D2A4D",
    gradient: "linear-gradient(135deg, #133B6B 0%, #1E4A7A 100%)",
  },
  secondary: {
    main: "#00C2D1",
    light: "#E0F7FA",
    medium: "#35D0FF",
    dark: "#0099AA",
    gradient: "linear-gradient(135deg, #00C2D1 0%, #0099AA 100%)",
  },
  accent: {
    electricBlue: "#0099FF",
    purple: "#6C5CE7",
    blueLight: "#E6F3FF",
    purpleLight: "#F0EDFF",
  },
  background: {
    default: "#F8FAFE",
    paper: "#FFFFFF",
    dark: "#132E4F",
    overlay: "rgba(255, 255, 255, 0.05)",
  },
  text: {
    primary: "#1E293B",
    secondary: "#475569",
    tertiary: "#64748B",
    light: "#F8FAFC",
  },
  status: {
    success: "#00C2D1",
    warning: "#0099FF",
    error: "#FF4D4D",
    successLight: "#E0F7FA",
    warningLight: "#FFF4E0",
    errorLight: "#FFE5E5",
  },
  border: {
    light: "#E2E8F0",
    main: "#CBD5E1",
  },
  white: "#FFFFFF",
  black: "#000000",
};

// Tamaños estandarizados
const sizes = {
  headerHeight: { xs: 64, md: 72 },
  sectionSpacing: { xs: 4, md: 6 },
  cardPadding: { xs: 2, md: 3 },
  containerMaxWidth: "1400px",
  borderRadius: {
    small: 8,
    medium: 6,
    large: 8,
    xl: 24,
  },
  fontSize: {
    h1: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
    h2: { xs: "1.75rem", md: "2.5rem" },
    h3: { xs: "1.25rem", md: "1.8rem" },
    body: { xs: "0.9rem", md: "1rem" },
    small: "0.875rem",
  },
};

const SiteMap = () => {
  const navigate = useNavigate();

  // Estadísticas del mapa
  const stats = [
    { label: 'Módulos', value: '8', color: colors.primary.main, icon: <DashboardIcon /> },
    { label: 'Rutas', value: '42', color: colors.status.success, icon: <TimelineIcon /> },
    { label: 'Roles', value: '3', color: colors.status.warning, icon: <GroupIcon /> },
    { label: 'Versión', value: '2.0', color: colors.accent.purple, icon: <InfoIcon /> },
  ];

  // Módulos por rol (solo las rutas, sin links)
  const modulesByRole = [
    {
      role: 'USUARIO',
      roleColor: colors.primary.main,
      roleIcon: <PersonIcon />,
      description: 'Agentes Aduanales y Usuarios',
      modules: [
        { name: 'Dashboard Personal', icon: <DashboardIcon /> },
        { name: 'Expediente Digital', icon: <FolderIcon /> },
        { name: 'Mis Certificaciones', icon: <DescriptionIcon /> },
        { name: 'Declaraciones', icon: <AssignmentIcon /> },
        { name: 'Auditoría Personal', icon: <AuditIcon /> },
        { name: 'Mi Perfil', icon: <PersonIcon /> },
      ]
    },
    {
      role: 'COMITÉ',
      roleColor: colors.status.warning,
      roleIcon: <GavelIcon />,
      description: 'Miembros del Comité de Cumplimiento',
      modules: [
        { name: 'Dashboard Comité', icon: <DashboardIcon /> },
        { name: 'Revisión de Certificaciones', icon: <AssignmentIcon /> },
        { name: 'Validaciones Pendientes', icon: <InfoIcon /> },
        { name: 'Estadísticas', icon: <TimelineIcon /> },
        { name: 'Auditoría del Comité', icon: <AuditIcon /> },
      ]
    },
    {
      role: 'ADMINISTRADOR',
      roleColor: colors.status.success,
      roleIcon: <AdminIcon />,
      description: 'Administradores del Sistema',
      modules: [
        { name: 'Dashboard Admin', icon: <DashboardIcon /> },
        { name: 'Gestión de Usuarios', icon: <GroupIcon /> },
        { name: 'Configuración del Sistema', icon: <SettingsIcon /> },
        { name: 'Reportes', icon: <AssignmentIcon /> },
        { name: 'Auditoría Global', icon: <HistoryIcon /> },
        { name: 'Regiones y Aduanas', icon: <LocationIcon /> },
      ]
    }
  ];

  // Módulos de autenticación (transversales) - sin links
  const authModules = [
    { name: 'Inicio de Sesión', icon: <LoginIcon /> },
    { name: 'Recuperación de Contraseña', icon: <LockResetIcon /> },
    { name: 'Cambio de Contraseña', icon: <LockResetIcon /> },
    { name: 'Acuerdo de Privacidad', icon: <PrivacyTipIcon /> },
  ];

  // Pasos del flujo del sistema (solo texto, sin links)
  const flujoPasos = [
    { step: '01', text: 'Registro y Autenticación' },
    { step: '02', text: 'Creación de Expediente' },
    { step: '03', text: 'Carga de Certificaciones' },
    { step: '04', text: 'Validación por Comité' },
    { step: '05', text: 'Generación de Reportes' },
    { step: '06', text: 'Asignación de Nivel' }
  ];

  const handleGoBack = () => {
    navigate(-1); // Vuelve a la página anterior
  };

  return (
    <Box sx={{ width: '100%', bgcolor: colors.background.default }}>
      {/* Header con diseño del navbar y botón de volver */}
      <Paper 
        elevation={0}
        sx={{ 
          background: colors.primary.gradient,
          color: colors.white,
          borderRadius: 0,
          py: { xs: 2, sm: 2.5, md: 3 },
          mb: { xs: 3, sm: 4 },
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            zIndex: 0
          }
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
          <Box sx={{ 
            position: 'relative', 
            zIndex: 1, 
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}>
            {/* Botón de volver */}
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{
                color: colors.white,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  borderColor: colors.white,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                },
                mr: 2,
                textTransform: 'none',
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' }
              }}
              variant="outlined"
              size="small"
            >
              Volver
            </Button>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flex: 1,
              gap: { xs: 1.5, sm: 2, md: 3 }, 
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: 'center'
            }}>
              <Avatar 
                sx={{ 
                  width: { xs: 48, sm: 56, md: 72 }, 
                  height: { xs: 48, sm: 56, md: 72 }, 
                  bgcolor: colors.white,
                  color: colors.primary.main,
                  fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  border: '3px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                S
              </Avatar>
              <Box>
                <Typography variant="h2" sx={{ 
                  fontWeight: '800', 
                  letterSpacing: 2, 
                  mb: 1, 
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' } 
                }}>
                  MAPA DEL SITIO
                </Typography>
                <Typography variant="h6" sx={{ 
                  opacity: 0.9, 
                  fontWeight: 400, 
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.2rem' } 
                }}>
                  SICAG - Sistema Integral de Consultoría y Asesoría Gremial
                </Typography>
              </Box>
            </Box>

            {/* Espacio vacío para equilibrar el botón de volver */}
            <Box sx={{ width: { xs: '40px', sm: '80px' } }} />
          </Box>
        </Container>
      </Paper>

      {/* Contenedor principal */}
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ 
          maxWidth: sizes.containerMaxWidth,
          mx: 'auto', 
          width: '100%'
        }}>
          {/* Estadísticas rápidas */}
          <Box sx={{ width: '100%', mb: { xs: 4, sm: 5, md: 6 } }}>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
                md: '1fr 1fr 1fr 1fr'
              },
              gap: { xs: 2, sm: 2.5, md: 3, lg: 4 },
              width: '100%'
            }}>
              {stats.map((stat, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                    borderRadius: sizes.borderRadius.large,
                    border: '2px solid',
                    borderColor: `${stat.color}30`,
                    background: `linear-gradient(135deg, ${alpha(stat.color, 0.05)} 0%, white 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 20px ${alpha(stat.color, 0.25)}`,
                      borderColor: stat.color
                    }
                  }}
                >
                  <Box>
                    <Typography variant="h2" sx={{ 
                      color: stat.color, 
                      fontWeight: '800', 
                      lineHeight: 1, 
                      fontSize: { xs: '2.2rem', sm: '2.5rem', md: '2.8rem', lg: '3.2rem' } 
                    }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: colors.text.secondary, 
                      mt: 1, 
                      fontWeight: '500', 
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } 
                    }}>
                      {stat.label}
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: alpha(stat.color, 0.1), 
                    color: stat.color, 
                    width: { xs: 48, sm: 56, md: 64 }, 
                    height: { xs: 48, sm: 56, md: 64 } 
                  }}>
                    {React.cloneElement(stat.icon, { sx: { fontSize: { xs: 24, sm: 28, md: 32 } } })}
                  </Avatar>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Módulos por Rol - sin links */}
          <Box sx={{ width: '100%', mb: { xs: 4, sm: 5, md: 6 } }}>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: '1fr 1fr 1fr'
              },
              gap: { xs: 2, sm: 2.5, md: 3, lg: 4 },
              width: '100%'
            }}>
              {modulesByRole.map((roleSection, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: sizes.borderRadius.large,
                    border: '2px solid',
                    borderColor: `${roleSection.roleColor}30`,
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 24px ${alpha(roleSection.roleColor, 0.2)}`,
                      borderColor: roleSection.roleColor
                    }
                  }}
                >
                  {/* Header del rol */}
                  <Box
                    sx={{
                      p: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                      background: `linear-gradient(135deg, ${roleSection.roleColor} 0%, ${alpha(roleSection.roleColor, 0.8)} 100%)`,
                      color: colors.white
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2, md: 2.5 } }}>
                      <Avatar sx={{ 
                        bgcolor: colors.white, 
                        color: roleSection.roleColor, 
                        width: { xs: 48, sm: 52, md: 56, lg: 60 }, 
                        height: { xs: 48, sm: 52, md: 56, lg: 60 } 
                      }}>
                        {React.cloneElement(roleSection.roleIcon, { sx: { fontSize: { xs: 24, sm: 26, md: 28, lg: 30 } } })}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ 
                          fontWeight: '800', 
                          letterSpacing: 1, 
                          fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem', lg: '1.4rem' } 
                        }}>
                          {roleSection.role}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          opacity: 0.9, 
                          display: 'block', 
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.85rem' } 
                        }}>
                          {roleSection.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Lista de módulos - sin links, solo visual */}
                  <Box sx={{ flex: 1, overflow: 'auto', maxHeight: { xs: 280, sm: 300, md: 320, lg: 350 } }}>
                    <Box sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                      {roleSection.modules.map((module, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 1.5, sm: 2 },
                            borderRadius: 1.5,
                            mb: { xs: 0.5, sm: 0.75, md: 1 },
                            py: { xs: 1, sm: 1.2, md: 1.5 },
                            px: { xs: 1.5, sm: 1.8, md: 2 },
                            '&:hover': {
                              bgcolor: alpha(roleSection.roleColor, 0.08),
                            }
                          }}
                        >
                          <Box sx={{ 
                            minWidth: { xs: 32, sm: 36, md: 40, lg: 44 }, 
                            color: roleSection.roleColor,
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            {React.cloneElement(module.icon, { sx: { fontSize: { xs: 18, sm: 20, md: 22 } } })}
                          </Box>
                          <Typography variant="body1" sx={{ 
                            fontWeight: '500',
                            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem', lg: '1rem' },
                            color: colors.text.primary
                          }}>
                            {module.name}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Footer con contador */}
                  <Box sx={{ 
                    p: { xs: 1.5, sm: 2, md: 2.5 }, 
                    borderTop: `1px solid ${alpha(roleSection.roleColor, 0.2)}`,
                    bgcolor: alpha(roleSection.roleColor, 0.02)
                  }}>
                    <Typography variant="body2" sx={{ 
                      color: roleSection.roleColor, 
                      fontWeight: '600',
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem', lg: '0.9rem' }
                    }}>
                      {roleSection.modules.length} módulos disponibles
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Módulos de Autenticación - Ocupa 100% del ancho, sin links */}
          <Box sx={{ width: '100%', mb: { xs: 4, sm: 5, md: 6 } }}>
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                borderRadius: sizes.borderRadius.large,
                border: '2px solid',
                borderColor: `${colors.primary.main}30`,
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 24px ${alpha(colors.primary.main, 0.2)}`,
                  borderColor: colors.primary.main
                }
              }}
            >
              {/* Header de Autenticación */}
              <Box
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                  background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${alpha(colors.primary.main, 0.8)} 100%)`,
                  color: colors.white
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2, md: 2.5 } }}>
                  <Avatar sx={{ 
                    bgcolor: colors.white, 
                    color: colors.primary.main, 
                    width: { xs: 48, sm: 52, md: 56, lg: 60 }, 
                    height: { xs: 48, sm: 52, md: 56, lg: 60 } 
                  }}>
                    <SecurityIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ 
                      fontWeight: '800', 
                      letterSpacing: 1, 
                      fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem', lg: '1.4rem' } 
                    }}>
                      Autenticación y Seguridad
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      opacity: 0.9, 
                      display: 'block', 
                      fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.85rem' } 
                    }}>
                      Módulos comunes para todos los roles
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Grid de módulos de autenticación - 4 columnas en desktop, sin links */}
              <Box sx={{ flex: 1, p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr',
                    md: '1fr 1fr 1fr 1fr'
                  },
                  gap: { xs: 1.5, sm: 2, md: 2.5 }
                }}>
                  {authModules.map((module, index) => (
                    <Card
                      key={index}
                      sx={{
                        border: '1px solid',
                        borderColor: `${colors.primary.main}20`,
                        transition: 'all 0.2s',
                        height: '100%',
                        borderRadius: 2,
                        cursor: 'default',
                        '&:hover': {
                          borderColor: colors.primary.main,
                          bgcolor: alpha(colors.primary.main, 0.02),
                        }
                      }}
                    >
                      <CardContent sx={{ 
                        p: { xs: 1.5, sm: 2, md: 2.5 }, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: { xs: 1.5, sm: 2 },
                        flexDirection: 'row'
                      }}>
                        <Avatar sx={{ 
                          bgcolor: alpha(colors.primary.main, 0.1), 
                          color: colors.primary.main, 
                          width: { xs: 32, sm: 36, md: 40 }, 
                          height: { xs: 32, sm: 36, md: 40 } 
                        }}>
                          {module.icon}
                        </Avatar>
                        <Typography variant="body1" sx={{ 
                          fontWeight: '600', 
                          color: colors.text.primary, 
                          fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' } 
                        }}>
                          {module.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>

              {/* Footer con contador */}
              <Box sx={{ 
                p: { xs: 1.5, sm: 2, md: 2.5 }, 
                borderTop: `1px solid ${alpha(colors.primary.main, 0.2)}`,
                bgcolor: alpha(colors.primary.main, 0.02)
              }}>
                <Typography variant="body2" sx={{ 
                  color: colors.primary.main, 
                  fontWeight: '600',
                  fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem', lg: '0.9rem' }
                }}>
                  {authModules.length} módulos disponibles
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Flujo del Sistema - Ocupa 100% del ancho, sin links */}
          <Box sx={{ width: '100%', mb: { xs: 4, sm: 5, md: 6 } }}>
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                borderRadius: sizes.borderRadius.large,
                border: '2px solid',
                borderColor: `${colors.primary.dark}30`,
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 24px ${alpha(colors.primary.dark, 0.2)}`,
                  borderColor: colors.primary.dark
                }
              }}
            >
              {/* Header de Flujo */}
              <Box
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                  background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${alpha(colors.primary.dark, 0.8)} 100%)`,
                  color: colors.white
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2, md: 2.5 } }}>
                  <Avatar sx={{ 
                    bgcolor: colors.white, 
                    color: colors.primary.dark, 
                    width: { xs: 48, sm: 52, md: 56, lg: 60 }, 
                    height: { xs: 48, sm: 52, md: 56, lg: 60 } 
                  }}>
                    <TimelineIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ 
                      fontWeight: '800', 
                      letterSpacing: 1, 
                      fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem', lg: '1.4rem' } 
                    }}>
                      Flujo del Sistema
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      opacity: 0.9, 
                      display: 'block', 
                      fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.85rem' } 
                    }}>
                      Proceso completo de certificación y cumplimiento
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Grid de pasos del flujo - 6 columnas en desktop, sin links */}
              <Box sx={{ flex: 1, p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr',
                    md: '1fr 1fr 1fr',
                    lg: '1fr 1fr 1fr 1fr 1fr 1fr'
                  },
                  gap: { xs: 1.5, sm: 2, md: 2.5 }
                }}>
                  {flujoPasos.map((item, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: { xs: 1.5, sm: 2, md: 2.5 },
                        bgcolor: alpha(colors.primary.dark, 0.03),
                        border: '1px solid',
                        borderColor: `${colors.primary.dark}20`,
                        borderRadius: 2,
                        textAlign: 'center',
                        height: '100%',
                        transition: 'transform 0.2s',
                        cursor: 'default',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          borderColor: colors.primary.dark,
                          bgcolor: alpha(colors.primary.dark, 0.05)
                        }
                      }}
                    >
                      <Typography variant="h4" sx={{ 
                        fontWeight: '800', 
                        color: colors.primary.main, 
                        mb: 0.5, 
                        fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.6rem', lg: '1.8rem' } 
                      }}>
                        {item.step}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: colors.text.primary, 
                        fontWeight: '500', 
                        display: 'block',
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.85rem' }
                      }}>
                        {item.text}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>

              {/* Footer con contador */}
              <Box sx={{ 
                p: { xs: 1.5, sm: 2, md: 2.5 }, 
                borderTop: `1px solid ${alpha(colors.primary.dark, 0.2)}`,
                bgcolor: alpha(colors.primary.dark, 0.02)
              }}>
                <Typography variant="body2" sx={{ 
                  color: colors.primary.dark, 
                  fontWeight: '600',
                  fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem', lg: '0.9rem' }
                }}>
                  6 pasos en el proceso
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* Footer - Copiado exactamente de la página de inicio */}
      <Box
        sx={{
          bgcolor: colors.background.dark,
          borderTop: `3px solid ${colors.secondary.main}`,
          py: { xs: 4, md: 5 },
          mt: 4,
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: colors.white,
                  mb: 2,
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                }}
              >
                Sistema Integral Aduanal
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: alpha(colors.white, 0.7),
                  lineHeight: 1.7,
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                }}
              >
                Transformando la gestión aduanal a través de la tecnología y la
                innovación.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: colors.white,
                  mb: 2,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                }}
              >
                Enlaces rápidos
              </Typography>
              <Stack spacing={1.5}>
                {[
                  { nombre: "Términos y condiciones", ruta: "/legal?tab=0" },
                  { nombre: "Aviso de privacidad", ruta: "/legal?tab=1" },
                  { nombre: "Política de cookies", ruta: "/legal?tab=2" },
                  
                ].map((item, idx) => (
                  <Button
                    key={item.nombre}
                    color="inherit"
                    onClick={() => navigate(item.ruta)}
                    sx={{
                      justifyContent: "flex-start",
                      p: 0,
                      color: alpha(colors.white, 0.7),
                      fontSize: { xs: "0.8rem", md: "0.95rem" },
                      textTransform: "none",
                      "&:hover": {
                        color: colors.white,
                      },
                    }}
                  >
                    {item.nombre}
                  </Button>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: colors.white,
                  mb: 2,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                }}
              >
                Contacto
              </Typography>
              <Stack spacing={1.5}>
                <Typography
                  variant="body1"
                  sx={{
                    color: alpha(colors.white, 0.7),
                    fontSize: { xs: "0.8rem", md: "0.95rem" },
                  }}
                >
                  contacto@sistemas-aduanales.mx
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: alpha(colors.white, 0.7),
                    fontSize: { xs: "0.8rem", md: "0.95rem" },
                  }}
                >
                  (55) 1234-5678
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: alpha(colors.white, 0.7),
                    fontSize: { xs: "0.8rem", md: "0.95rem" },
                  }}
                >
                  Cd. de México, México
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, borderColor: alpha(colors.white, 0.1) }} />
          <Typography
            variant="body1"
            align="center"
            sx={{
              color: alpha(colors.white, 0.6),
              fontSize: { xs: "0.75rem", md: "0.9rem" },
            }}
          >
            © {new Date().getFullYear()} Sistema Integral Aduanal. Todos los
            derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default SiteMap;