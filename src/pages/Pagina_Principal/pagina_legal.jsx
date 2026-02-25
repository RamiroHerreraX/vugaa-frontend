import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  alpha,
  Tabs,
  Tab,
  Divider,
  Grid,
  Switch,
  Button,
  Avatar,
  Chip,
  Fade,
  Grow,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GavelIcon from '@mui/icons-material/Gavel';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BadgeIcon from '@mui/icons-material/Badge';
import SecurityIcon from '@mui/icons-material/Security';
import CookieIcon from '@mui/icons-material/Cookie';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GroupIcon from '@mui/icons-material/Group';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import DescriptionIcon from '@mui/icons-material/Description';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import TimelineIcon from '@mui/icons-material/Timeline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';

// Paleta de colores - institucional y profesional
const colors = {
  primary: {
    main: '#133B6B',
    light: '#E8F0FE',
    medium: '#2A5A8C',
    dark: '#0D2A4D',
    gradient: 'linear-gradient(135deg, #133B6B 0%, #1E4A7A 100%)',
    gradientLight: 'linear-gradient(135deg, #E8F0FE 0%, #D0E0FF 100%)',
  },
  secondary: {
    main: '#00C2D1',
    light: '#E0F7FA',
    medium: '#35D0FF',
    dark: '#0099AA',
    gradient: 'linear-gradient(135deg, #00C2D1 0%, #0099AA 100%)',
  },
  accent: {
    electricBlue: '#0099FF',
    purple: '#6C5CE7',
    blueLight: '#E6F3FF',
    purpleLight: '#F0EDFF',
  },
  background: {
    default: '#F8FAFE',
    paper: '#FFFFFF',
    dark: '#132E4F',
    overlay: 'rgba(255, 255, 255, 0.05)',
  },
  text: {
    primary: '#1E293B',
    secondary: '#475569',
    tertiary: '#64748B',
    light: '#F8FAFC',
  },
  status: {
    success: '#00C2D1',
    warning: '#FFB800',
    error: '#FF4D4D',
    info: '#0099FF',
  },
  border: {
    light: '#E2E8F0',
    main: '#CBD5E1',
    focus: '#133B6B',
  },
  white: '#FFFFFF',
  black: '#000000',
};

// Componente de pestañas
const TabPanel = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`legal-tabpanel-${index}`}
      aria-labelledby={`legal-tab-${index}`}
    >
      {value === index && (
        <Fade in timeout={500}>
          <Box sx={{ py: { xs: 2, md: 4 } }}>
            {children}
          </Box>
        </Fade>
      )}
    </div>
  );
};

// Componente de tarjeta para secciones
const SectionCard = ({ title, children, icon, color = colors.primary.main, subtitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grow in timeout={500}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          mb: { xs: 2, md: 3 },
          bgcolor: colors.white,
          border: `1px solid ${alpha(color, 0.15)}`,
          borderRadius: { xs: 2, md: 3 },
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 12px 24px -8px ${alpha(color, 0.2)}`,
            borderColor: color,
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' },
        }}>
          {icon && (
            <Avatar
              sx={{
                bgcolor: alpha(color, 0.08),
                color: color,
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                mr: { xs: 0, sm: 2 },
                mb: { xs: 1, sm: 0 },
              }}
            >
              {icon}
            </Avatar>
          )}
          <Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              color: colors.text.primary,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
            }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: colors.text.tertiary }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        {children}
      </Paper>
    </Grow>
  );
};

// Componente de badge para fechas
const DateBadge = ({ text }) => {
  return (
    <Chip
      icon={<InfoIcon />}
      label={text}
      size="small"
      sx={{
        bgcolor: alpha(colors.primary.main, 0.08),
        color: colors.primary.main,
        fontWeight: 500,
        mb: { xs: 2, md: 3 },
        height: { xs: 28, md: 32 },
        fontSize: { xs: '0.7rem', md: '0.8rem' },
      }}
    />
  );
};

// Componente de lista con viñetas
const BulletList = ({ items, columns = 1 }) => {
  return (
    <Grid container spacing={1}>
      {items.map((item, idx) => (
        <Grid item xs={12} sm={columns === 2 ? 6 : 12} key={idx}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Avatar sx={{ 
              width: 20, 
              height: 20, 
              bgcolor: alpha(colors.secondary.main, 0.1), 
              color: colors.secondary.main,
              mt: 0.3,
            }}>
              <CheckCircleIcon sx={{ fontSize: 14 }} />
            </Avatar>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              {item}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

const PaginaLegalCompleta = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [tabValue, setTabValue] = useState(tabParam ? parseInt(tabParam) : 0);
  
  // Estado para preferencias de cookies
  const [cookiePreferences, setCookiePreferences] = useState({
    necesarias: true,
    rendimiento: false,
    funcionalidad: false,
    publicidad: false,
  });

  useEffect(() => {
    const newTab = searchParams.get('tab');
    if (newTab !== null) {
      setTabValue(parseInt(newTab));
    }
  }, [searchParams]);

    useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto' // 'auto' para instantáneo, 'smooth' para animación
    });
  }, [tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    navigate(`/legal?tab=${newValue}`, { replace: true });
  };

  const handleCookieChange = (tipo) => {
    if (tipo !== 'necesarias') {
      setCookiePreferences({
        ...cookiePreferences,
        [tipo]: !cookiePreferences[tipo],
      });
    }
  };

  const handleSaveCookies = () => {
    console.log('Preferencias de cookies guardadas:', cookiePreferences);
  };

  return (
    <Box sx={{ 
      bgcolor: colors.background.default, 
      minHeight: '100vh',
      width: '100%',
    }}>
      {/* Barra de navegación superior */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: colors.white,
          borderBottom: `1px solid ${colors.border.light}`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderRadius: 0,
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              size={isMobile ? "small" : "medium"}
              sx={{
                color: colors.text.secondary,
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                '&:hover': {
                  color: colors.primary.main,
                  bgcolor: alpha(colors.primary.main, 0.04),
                },
              }}
            >
              Volver
            </Button>
            
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(colors.primary.main, 0.08),
                  color: colors.primary.main,
                  width: { xs: 28, sm: 36 },
                  height: { xs: 28, sm: 36 },
                }}
              >
                <AccountBalanceIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
              </Avatar>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  background: colors.primary.gradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
                }}
              >
                {isMobile ? 'Marco Legal' : 'Marco Legal - Sistema Integral Aduanal'}
              </Typography>
            </Box>
            
            <Box sx={{ width: { xs: 50, sm: 80 } }} />
          </Box>
        </Container>
      </Paper>

      {/* Banner informativo */}
      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 } }}>
        <Paper
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            background: colors.primary.gradient,
            borderRadius: { xs: 2, md: 3 },
            color: colors.white,
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1.5, sm: 2 },
            flexWrap: 'wrap',
          }}
        >
          <Avatar sx={{ 
            bgcolor: colors.white, 
            color: colors.primary.main,
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
          }}>
            <GroupIcon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ 
              fontWeight: 600,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            }}>
              Protección de Datos del Personal Aduanal
            </Typography>
            <Typography variant="body2" sx={{ 
              opacity: 0.9,
              fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
            }}>
              VUGAA gestiona información confidencial de agentes aduanales, apoderados, personal autorizado y autoridades fiscales.
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* Contenido principal */}
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
        <Paper
          elevation={0}
          sx={{
            bgcolor: colors.white,
            border: `1px solid ${colors.border.light}`,
            borderRadius: { xs: 3, md: 4 },
            overflow: 'hidden',
            boxShadow: `0 8px 24px ${alpha(colors.primary.main, 0.05)}`,
          }}
        >
          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile
            sx={{
              borderBottom: `1px solid ${colors.border.light}`,
              bgcolor: colors.background.default,
              '& .MuiTab-root': {
                py: { xs: 2, sm: 2.5, md: 3 },
                fontWeight: 600,
                color: colors.text.secondary,
                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                minHeight: { xs: 56, sm: 64, md: 72 },
                '&.Mui-selected': {
                  color: colors.primary.main,
                  bgcolor: alpha(colors.primary.main, 0.02),
                },
                '&:hover': {
                  color: colors.primary.main,
                  bgcolor: alpha(colors.primary.main, 0.04),
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: colors.secondary.main,
                height: 3,
              },
            }}
          >
            <Tab 
              icon={<GavelIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />} 
              label={isMobile ? "Términos" : "TÉRMINOS Y CONDICIONES"} 
              iconPosition="start"
            />
            <Tab 
              icon={<PrivacyTipIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />} 
              label={isMobile ? "Privacidad" : "AVISO DE PRIVACIDAD"} 
              iconPosition="start"
            />
            <Tab 
              icon={<CookieIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />} 
              label={isMobile ? "Cookies" : "POLÍTICA DE COOKIES"} 
              iconPosition="start"
            />
          </Tabs>

          {/* TÉRMINOS Y CONDICIONES */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
              
              {/* Encabezado con fecha y título principal */}
              <Box sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                  <Chip
                    icon={<InfoIcon />}
                    label="Última actualización: 18 de febrero de 2026"
                    sx={{
                      bgcolor: alpha(colors.primary.main, 0.08),
                      color: colors.primary.main,
                      fontWeight: 500,
                      height: 32,
                    }}
                  />
                  <Chip
                    icon={<GavelIcon />}
                    label="Versión 2.0"
                    sx={{
                      bgcolor: alpha(colors.secondary.main, 0.08),
                      color: colors.secondary.main,
                      fontWeight: 500,
                      height: 32,
                    }}
                  />
                </Box>
                
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    color: colors.text.primary,
                    mb: 1,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    borderLeft: `4px solid ${colors.secondary.main}`,
                    pl: 2,
                  }}
                >
                  Términos y Condiciones
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.tertiary, pl: 2 }}>
                  Marco normativo para el uso de los sistemas VUGAA
                </Typography>
              </Box>

              {/* Sección 1 - Ámbito de Aplicación */}
              <Paper
                elevation={0}
                sx={{
                  mb: 4,
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: `1px solid ${colors.border.light}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 12px 24px -8px ${alpha(colors.primary.main, 0.15)}`,
                  },
                }}
              >
                {/* Cabecera de sección */}
                <Box
                  sx={{
                    bgcolor: alpha(colors.primary.main, 0.03),
                    p: 3,
                    borderBottom: `1px solid ${colors.border.light}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: colors.primary.main,
                      color: colors.white,
                      width: 48,
                      height: 48,
                    }}
                  >
                    <AccountBalanceIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary.main, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                      1. Ámbito de Aplicación
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.tertiary }}>
                      Sujetos obligados y alcance normativo
                    </Typography>
                  </Box>
                </Box>

                {/* Contenido de la sección */}
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: colors.text.secondary, 
                      lineHeight: 1.8,
                      mb: 3,
                      fontSize: { xs: '0.95rem', md: '1rem' },
                      fontWeight: 400,
                    }}
                  >
                    El presente instrumento regula el uso de los sistemas <strong style={{ color: colors.primary.main, fontWeight: 600 }}>SICAG, SIVAD, SICOM, SIGEC y SIAUD</strong> por parte de:
                  </Typography>

                  {/* Grid de dos columnas con diseño mejorado */}
                  <Grid container spacing={3}>
                    {/* Primera columna */}
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        {/* Agentes Aduanales */}
                        <Paper
                          sx={{
                            p: 2.5,
                            bgcolor: alpha(colors.primary.main, 0.02),
                            borderRadius: 2,
                            border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: colors.primary.main,
                              bgcolor: alpha(colors.primary.main, 0.04),
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                            <Avatar sx={{ bgcolor: colors.primary.main, width: 32, height: 32 }}>
                              <BadgeIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.primary.main }}>
                              Agentes Aduanales y sus apoderados
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: colors.text.secondary, pl: 6 }}>
                            Personas físicas o morales autorizadas para realizar el despacho aduanal
                          </Typography>
                        </Paper>

                        {/* Autoridades de la ANAM */}
                        <Paper
                          sx={{
                            p: 2.5,
                            bgcolor: alpha(colors.accent.electricBlue, 0.02),
                            borderRadius: 2,
                            border: `1px solid ${alpha(colors.accent.electricBlue, 0.1)}`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: colors.accent.electricBlue,
                              bgcolor: alpha(colors.accent.electricBlue, 0.04),
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                            <Avatar sx={{ bgcolor: colors.accent.electricBlue, width: 32, height: 32 }}>
                              <AccountBalanceIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.accent.electricBlue }}>
                              Autoridades de la ANAM
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: colors.text.secondary, pl: 6 }}>
                            Agencia Nacional de Aduanas de México
                          </Typography>
                        </Paper>

                        {/* Profesionales independientes */}
                        <Paper
                          sx={{
                            p: 2.5,
                            bgcolor: alpha(colors.primary.medium, 0.02),
                            borderRadius: 2,
                            border: `1px solid ${alpha(colors.primary.medium, 0.1)}`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: colors.primary.medium,
                              bgcolor: alpha(colors.primary.medium, 0.04),
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                            <Avatar sx={{ bgcolor: colors.primary.medium, width: 32, height: 32 }}>
                              <AssignmentIndIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.primary.medium }}>
                              Profesionales independientes
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: colors.text.secondary, pl: 6 }}>
                            Consultores, asesores y gestores del comercio exterior
                          </Typography>
                        </Paper>
                      </Stack>
                    </Grid>

                    {/* Segunda columna */}
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        {/* Personal autorizado de agencias */}
                        <Paper
                          sx={{
                            p: 2.5,
                            bgcolor: alpha(colors.secondary.main, 0.02),
                            borderRadius: 2,
                            border: `1px solid ${alpha(colors.secondary.main, 0.1)}`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: colors.secondary.main,
                              bgcolor: alpha(colors.secondary.main, 0.04),
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                            <Avatar sx={{ bgcolor: colors.secondary.main, width: 32, height: 32 }}>
                              <GroupIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.secondary.main }}>
                              Personal autorizado de agencias aduanales
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: colors.text.secondary, pl: 6 }}>
                            Empleados y representantes con facultades específicas
                          </Typography>
                        </Paper>

                        {/* Personal del SAT */}
                        <Paper
                          sx={{
                            p: 2.5,
                            bgcolor: alpha(colors.accent.purple, 0.02),
                            borderRadius: 2,
                            border: `1px solid ${alpha(colors.accent.purple, 0.1)}`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: colors.accent.purple,
                              bgcolor: alpha(colors.accent.purple, 0.04),
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                            <Avatar sx={{ bgcolor: colors.accent.purple, width: 32, height: 32 }}>
                              <SecurityIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.accent.purple }}>
                              Personal del SAT y entidades fiscalizadoras
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: colors.text.secondary, pl: 6 }}>
                            Servicio de Administración Tributaria y otras autoridades
                          </Typography>
                        </Paper>

                        {/* Personal administrativo */}
                        <Paper
                          sx={{
                            p: 2.5,
                            bgcolor: alpha(colors.status.info, 0.02),
                            borderRadius: 2,
                            border: `1px solid ${alpha(colors.status.info, 0.1)}`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: colors.status.info,
                              bgcolor: alpha(colors.status.info, 0.04),
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                            <Avatar sx={{ bgcolor: colors.status.info, width: 32, height: 32 }}>
                              <SettingsIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.status.info }}>
                              Personal administrativo y de soporte
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: colors.text.secondary, pl: 6 }}>
                            Personal técnico y de apoyo operativo
                          </Typography>
                        </Paper>
                      </Stack>
                    </Grid>
                  </Grid>

                  {/* Nota adicional sobre el alcance */}
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      bgcolor: alpha(colors.primary.main, 0.03),
                      borderRadius: 2,
                      border: `1px dashed ${alpha(colors.primary.main, 0.2)}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <InfoIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                      <strong>Alcance:</strong> Esta disposición aplica a todos los usuarios que accedan a los sistemas VUGAA, 
                      independientemente de su nivel de autorización o modalidad de contratación.
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Sección 2 - Obligaciones del Personal Aduanal */}
              <Paper
                elevation={0}
                sx={{
                  mb: 4,
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: `1px solid ${colors.border.light}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 12px 24px -8px ${alpha(colors.secondary.main, 0.15)}`,
                  },
                }}
              >
                {/* Cabecera de sección */}
                <Box
                  sx={{
                    bgcolor: alpha(colors.secondary.main, 0.03),
                    p: 3,
                    borderBottom: `1px solid ${colors.border.light}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: colors.secondary.main,
                      color: colors.white,
                      width: 48,
                      height: 48,
                    }}
                  >
                    <BadgeIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: colors.secondary.main, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                      2. Obligaciones del Personal Aduanal
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.tertiary }}>
                      Deberes y responsabilidades de los usuarios
                    </Typography>
                  </Box>
                </Box>

                {/* Contenido de la sección - UNA SOLA COLUMNA */}
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: colors.text.secondary, 
                      lineHeight: 1.8,
                      mb: 3,
                      fontSize: { xs: '0.95rem', md: '1rem' },
                    }}
                  >
                    Los usuarios registrados en los sistemas VUGAA se obligan a:
                  </Typography>

                  {/* Lista en una sola columna */}
                  <Box sx={{ width: '100%' }}>
                    {[
                      'Mantener estricta confidencialidad sobre la información de operaciones aduanales',
                      'No compartir credenciales de acceso con personal no autorizado',
                      'Reportar inmediatamente cualquier acceso no autorizado o fuga de información',
                      'Utilizar los sistemas exclusivamente para fines relacionados con el despacho aduanal',
                      'Mantener actualizados sus datos de contacto y habilitaciones profesionales',
                      'Someterse a auditorías periódicas de seguridad y cumplimiento',
                      'Conservar evidencia digital de todas las operaciones realizadas',
                    ].map((obligacion, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: 2,
                          transition: 'all 0.2s ease',
                          borderBottom: idx < 6 ? `1px solid ${alpha(colors.border.light, 0.5)}` : 'none',
                          '&:hover': {
                            bgcolor: alpha(colors.secondary.main, 0.04),
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: alpha(colors.secondary.main, 0.1),
                            color: colors.secondary.main,
                            width: 28,
                            height: 28,
                            mt: 0.3,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                        >
                          {idx + 1}
                        </Avatar>
                        <Typography variant="body2" sx={{ color: colors.text.primary, lineHeight: 1.6, flex: 1 }}>
                          {obligacion}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Nota adicional */}
                  <Box
                    sx={{
                      mt: 3,
                      p: 2.5,
                      bgcolor: alpha(colors.secondary.main, 0.04),
                      borderRadius: 2,
                      border: `1px solid ${alpha(colors.secondary.main, 0.2)}`,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                    }}
                  >
                    <InfoIcon sx={{ color: colors.secondary.main, fontSize: 20, mt: 0.2 }} />
                    <Typography variant="caption" sx={{ color: colors.text.secondary, fontStyle: 'italic', lineHeight: 1.6 }}>
                      <strong>Nota importante:</strong> El incumplimiento de estas obligaciones podrá generar sanciones administrativas, 
                      civiles y penales conforme a la legislación aplicable en materia aduanera y de protección de datos.
                    </Typography>
                  </Box>
                </Box>
              </Paper>

             {/* Sección 3 - Confidencialidad de la Información */}
<Paper
  elevation={0}
  sx={{
    mb: 4,
    borderRadius: 3,
    overflow: 'hidden',
    border: `1px solid ${colors.border.light}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: `0 12px 24px -8px ${alpha(colors.accent.purple, 0.15)}`,
    },
  }}
>
  {/* Cabecera de sección */}
  <Box
    sx={{
      bgcolor: alpha(colors.accent.purple, 0.03),
      p: { xs: 2, md: 3 },
      borderBottom: `1px solid ${colors.border.light}`,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    }}
  >
    <Avatar
      sx={{
        bgcolor: colors.accent.purple,
        color: colors.white,
        width: { xs: 40, md: 48 },
        height: { xs: 40, md: 48 },
      }}
    >
      <VerifiedUserIcon />
    </Avatar>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: colors.accent.purple, fontSize: { xs: '1.1rem', md: '1.4rem' } }}>
        3. Confidencialidad de la Información
      </Typography>
      <Typography variant="body2" sx={{ color: colors.text.tertiary, fontSize: { xs: '0.7rem', md: '0.8rem' } }}>
        Protección de datos sensibles
      </Typography>
    </Box>
  </Box>

  {/* Contenido de la sección */}
  <Box sx={{ p: { xs: 2, md: 3 } }}>
    
    {/* Texto principal */}
    <Typography 
      variant="body2" 
      sx={{ 
        color: colors.text.secondary, 
        lineHeight: 1.6,
        mb: { xs: 2.5, md: 3.5 },
        p: { xs: 1.5, md: 2.5 },
        bgcolor: alpha(colors.accent.purple, 0.02),
        borderRadius: 2,
        border: `1px solid ${alpha(colors.accent.purple, 0.1)}`,
        fontSize: { xs: '0.85rem', md: '0.95rem' },
        textAlign: 'center',
      }}
    >
      La información en los sistemas <strong style={{ color: colors.accent.purple }}>VUGAA</strong> es 
      <strong style={{ color: colors.accent.purple }}> confidencial y reservada</strong>. Prohibida su divulgación a terceros.
    </Typography>

    {/* Contenedor flex para centrar las tres columnas */}
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      
      {/* Columna 1 - Información protegida */}
      <Paper
        sx={{
          width: { xs: '100%', sm: '350px', md: '320px' },
          p: { xs: 2.5, md: 3.2 },
          display: 'flex',
          flexDirection: 'column',
          bgcolor: alpha(colors.primary.main, 0.02),
          borderRadius: { xs: 2, md: 3 },
          border: `1px solid ${alpha(colors.primary.main, 0.15)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: colors.primary.main,
            boxShadow: `0 12px 24px -8px ${alpha(colors.primary.main, 0.2)}`,
          },
        }}
      >
        {/* Encabezado centrado */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, mb: 2.5, justifyContent: 'center' }}>
          <Avatar
            sx={{
              bgcolor: alpha(colors.primary.main, 0.1),
              color: colors.primary.main,
              width: { xs: 36, md: 44 },
              height: { xs: 36, md: 44 },
            }}
          >
            <VerifiedUserIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, color: colors.primary.main, fontSize: { xs: '1rem', md: '1.2rem' } }}>
            Información protegida
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2.5, borderColor: alpha(colors.primary.main, 0.2) }} />
        
        {/* Lista */}
        <Stack spacing={2} sx={{ flex: 1, mb: 2.5 }}>
          {[
            'Operaciones de comercio exterior',
            'Valor de mercancías',
            'Datos personales',
          ].map((text, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: alpha(colors.primary.main, 0.1),
                  color: colors.primary.main,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Typography variant="body2" sx={{ color: colors.text.secondary, fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
                {text}
              </Typography>
            </Box>
          ))}
        </Stack>
        
        {/* Footer */}
        <Box
          sx={{
            pt: 2.5,
            borderTop: `1px dashed ${alpha(colors.primary.main, 0.2)}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
          }}
        >
          <Typography variant="body2" sx={{ color: colors.primary.main, fontWeight: 700, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
            ALTO
          </Typography>
          <Chip
            label="Art. 113"
            size="small"
            sx={{
              bgcolor: alpha(colors.primary.main, 0.1),
              color: colors.primary.main,
              height: { xs: 26, md: 30 },
              fontSize: { xs: '0.7rem', md: '0.8rem' },
              '& .MuiChip-label': { px: 2 },
            }}
          />
        </Box>
      </Paper>

      {/* Columna 2 - Restricciones de uso */}
      <Paper
        sx={{
          width: { xs: '100%', sm: '350px', md: '320px' },
          p: { xs: 2.5, md: 3.2 },
          display: 'flex',
          flexDirection: 'column',
          bgcolor: alpha(colors.status.warning, 0.02),
          borderRadius: { xs: 2, md: 3 },
          border: `1px solid ${alpha(colors.status.warning, 0.15)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: colors.status.warning,
            boxShadow: `0 12px 24px -8px ${alpha(colors.status.warning, 0.2)}`,
          },
        }}
      >
        {/* Encabezado centrado */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, mb: 2.5, justifyContent: 'center' }}>
          <Avatar
            sx={{
              bgcolor: alpha(colors.status.warning, 0.1),
              color: colors.status.warning,
              width: { xs: 36, md: 44 },
              height: { xs: 36, md: 44 },
            }}
          >
            <WarningIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, color: colors.status.warning, fontSize: { xs: '1rem', md: '1.2rem' } }}>
            Restricciones de uso
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2.5, borderColor: alpha(colors.status.warning, 0.2) }} />
        
        {/* Lista */}
        <Stack spacing={2} sx={{ flex: 1, mb: 2.5 }}>
          {[
            'Estrategias de cumplimiento',
            'Auditorías y verificaciones',
            'Procesos internos',
          ].map((text, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: alpha(colors.status.warning, 0.1),
                  color: colors.status.warning,
                }}
              >
                <WarningIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Typography variant="body2" sx={{ color: colors.text.secondary, fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
                {text}
              </Typography>
            </Box>
          ))}
        </Stack>
        
        {/* Footer */}
        <Box
          sx={{
            pt: 2.5,
            borderTop: `1px dashed ${alpha(colors.status.warning, 0.2)}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
          }}
        >
          <Typography variant="body2" sx={{ color: colors.status.warning, fontWeight: 700, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
            RESTRINGIDO
          </Typography>
          <Chip
            label="Art. 84"
            size="small"
            sx={{
              bgcolor: alpha(colors.status.warning, 0.1),
              color: colors.status.warning,
              height: { xs: 26, md: 30 },
              fontSize: { xs: '0.7rem', md: '0.8rem' },
              '& .MuiChip-label': { px: 2 },
            }}
          />
        </Box>
      </Paper>

      {/* Columna 3 - Obligaciones */}
      <Paper
        sx={{
          width: { xs: '100%', sm: '350px', md: '320px' },
          p: { xs: 2.5, md: 3.2 },
          display: 'flex',
          flexDirection: 'column',
          bgcolor: alpha(colors.secondary.main, 0.02),
          borderRadius: { xs: 2, md: 3 },
          border: `1px solid ${alpha(colors.secondary.main, 0.15)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: colors.secondary.main,
            boxShadow: `0 12px 24px -8px ${alpha(colors.secondary.main, 0.2)}`,
          },
        }}
      >
        {/* Encabezado centrado */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, mb: 2.5, justifyContent: 'center' }}>
          <Avatar
            sx={{
              bgcolor: alpha(colors.secondary.main, 0.1),
              color: colors.secondary.main,
              width: { xs: 36, md: 44 },
              height: { xs: 36, md: 44 },
            }}
          >
            <SecurityIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, color: colors.secondary.main, fontSize: { xs: '1rem', md: '1.2rem' } }}>
            Obligaciones
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2.5, borderColor: alpha(colors.secondary.main, 0.2) }} />
        
        {/* Lista */}
        <Stack spacing={2} sx={{ flex: 1, mb: 2.5 }}>
          {[
            'Acuerdos de confidencialidad',
            'No reproducir información',
            'Reportar incidentes',
          ].map((text, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: alpha(colors.secondary.main, 0.1),
                  color: colors.secondary.main,
                }}
              >
                <GavelIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Typography variant="body2" sx={{ color: colors.text.secondary, fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
                {text}
              </Typography>
            </Box>
          ))}
        </Stack>
        
        {/* Footer */}
        <Box
          sx={{
            pt: 2.5,
            borderTop: `1px dashed ${alpha(colors.secondary.main, 0.2)}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
          }}
        >
          <Typography variant="body2" sx={{ color: colors.secondary.main, fontWeight: 700, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
            PERMANENTE
          </Typography>
          <Chip
            label="Art. 9"
            size="small"
            sx={{
              bgcolor: alpha(colors.secondary.main, 0.1),
              color: colors.secondary.main,
              height: { xs: 26, md: 30 },
              fontSize: { xs: '0.7rem', md: '0.8rem' },
              '& .MuiChip-label': { px: 2 },
            }}
          />
        </Box>
      </Paper>
    </Box>

    {/* Nota legal */}
    <Box
      sx={{
        mt: { xs: 3, md: 4 },
        p: { xs: 2, md: 3 },
        bgcolor: alpha(colors.accent.purple, 0.03),
        borderRadius: 2,
        border: `1px solid ${alpha(colors.accent.purple, 0.1)}`,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mx: 'auto',
        maxWidth: '1000px',
      }}
    >
      <GavelIcon sx={{ color: colors.accent.purple, fontSize: { xs: 22, md: 26 } }} />
      <Typography variant="body2" sx={{ color: colors.text.secondary, lineHeight: 1.6, fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
        <strong>Fundamento legal:</strong> Arts. 8, 9, 113 LGPDP y 84, 85 Ley Aduanera.
      </Typography>
    </Box>
  </Box>
</Paper>

            {/* Sección 4 - Responsabilidad por Uso Indebido - VERSIÓN FINAL */}
<Paper
  elevation={0}
  sx={{
    mb: 4,
    borderRadius: 3,
    overflow: 'hidden',
    border: `1px solid ${colors.border.light}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: `0 12px 24px -8px ${alpha(colors.status.error, 0.15)}`,
    },
  }}
>
  {/* Cabecera de sección */}
  <Box
    sx={{
      bgcolor: alpha(colors.status.error, 0.03),
      p: { xs: 2, md: 3 },
      borderBottom: `1px solid ${colors.border.light}`,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    }}
  >
    <Avatar
      sx={{
        bgcolor: colors.status.error,
        color: colors.white,
        width: { xs: 40, md: 48 },
        height: { xs: 40, md: 48 },
      }}
    >
      <WarningIcon sx={{ fontSize: { xs: 22, md: 26 } }} />
    </Avatar>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: colors.status.error, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
        4. Responsabilidad por Uso Indebido
      </Typography>
      <Typography variant="body2" sx={{ color: colors.text.tertiary, fontSize: { xs: '0.7rem', md: '0.8rem' } }}>
        Sanciones y consecuencias legales
      </Typography>
    </Box>
  </Box>

  {/* Contenido de la sección */}
  <Box sx={{ p: { xs: 2, md: 4 } }}>
    
    {/* Texto introductorio */}
    <Typography 
      variant="body2" 
      sx={{ 
        color: colors.text.secondary, 
        lineHeight: 1.6,
        mb: 3,
        display: 'block',
        textAlign: 'center',
        fontSize: { xs: '0.9rem', md: '1rem' },
        fontStyle: 'italic',
      }}
    >
      El uso indebido de los sistemas será sancionado conforme a la legislación aplicable:
    </Typography>

    {/* Contenedor flex para las tres columnas con ancho fijo */}
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
    >
      
      {/* Administrativas */}
      <Paper
        sx={{
          width: { sm: '260px', md: '280px' },
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: alpha(colors.status.warning, 0.03),
          borderRadius: 2,
          border: `1px solid ${alpha(colors.status.warning, 0.2)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: colors.status.warning,
            boxShadow: `0 8px 16px -8px ${alpha(colors.status.warning, 0.2)}`,
          },
        }}
      >
        {/* Título */}
        <Typography variant="h6" sx={{ 
          fontWeight: 700, 
          color: colors.status.warning, 
          fontSize: { xs: '1.1rem', md: '1.2rem' },
          mb: 1,
          textAlign: 'center',
        }}>
          Administrativas
        </Typography>
        
        <Divider sx={{ mb: 1.5, borderColor: alpha(colors.status.warning, 0.2) }} />
        
        {/* Descripción */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: colors.text.secondary, 
            lineHeight: 1.5,
            flex: 1,
            mb: 1.5,
            fontSize: { xs: '0.9rem', md: '0.95rem' },
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            textAlign: 'center',
          }}
        >
          Suspensión de accesos, inhabilitación temporal y multas administrativas
        </Typography>
        
        {/* Badge legal */}
        <Box sx={{ mt: 'auto' }}>
          <Chip
            label="Ley Aduanera Art. 185"
            size="small"
            sx={{
              bgcolor: alpha(colors.status.warning, 0.1),
              color: colors.status.warning,
              height: 28,
              fontSize: { xs: '0.7rem', md: '0.75rem' },
              fontWeight: 600,
              width: '100%',
              '& .MuiChip-label': { px: 1.5 },
            }}
          />
        </Box>
      </Paper>

      {/* Civiles */}
      <Paper
        sx={{
          width: { sm: '260px', md: '280px' },
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: alpha(colors.primary.main, 0.03),
          borderRadius: 2,
          border: `1px solid ${alpha(colors.primary.main, 0.2)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: colors.primary.main,
            boxShadow: `0 8px 16px -8px ${alpha(colors.primary.main, 0.2)}`,
          },
        }}
      >
        {/* Título */}
        <Typography variant="h6" sx={{ 
          fontWeight: 700, 
          color: colors.primary.main, 
          fontSize: { xs: '1.1rem', md: '1.2rem' },
          mb: 1,
          textAlign: 'center',
        }}>
          Civiles
        </Typography>
        
        <Divider sx={{ mb: 1.5, borderColor: alpha(colors.primary.main, 0.2) }} />
        
        {/* Descripción */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: colors.text.secondary, 
            lineHeight: 1.5,
            flex: 1,
            mb: 1.5,
            fontSize: { xs: '0.9rem', md: '0.95rem' },
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            textAlign: 'center',
          }}
        >
          Indemnización por daños y perjuicios, responsabilidad patrimonial
        </Typography>
        
        {/* Badge legal */}
        <Box sx={{ mt: 'auto' }}>
          <Chip
            label="Código Civil Art. 1910"
            size="small"
            sx={{
              bgcolor: alpha(colors.primary.main, 0.1),
              color: colors.primary.main,
              height: 28,
              fontSize: { xs: '0.7rem', md: '0.75rem' },
              fontWeight: 600,
              width: '100%',
              '& .MuiChip-label': { px: 1.5 },
            }}
          />
        </Box>
      </Paper>

      {/* Penales */}
      <Paper
        sx={{
          width: { sm: '260px', md: '280px' },
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: alpha(colors.status.error, 0.03),
          borderRadius: 2,
          border: `1px solid ${alpha(colors.status.error, 0.2)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: colors.status.error,
            boxShadow: `0 8px 16px -8px ${alpha(colors.status.error, 0.2)}`,
          },
        }}
      >
        {/* Título */}
        <Typography variant="h6" sx={{ 
          fontWeight: 700, 
          color: colors.status.error, 
          fontSize: { xs: '1.1rem', md: '1.2rem' },
          mb: 1,
          textAlign: 'center',
        }}>
          Penales
        </Typography>
        
        <Divider sx={{ mb: 1.5, borderColor: alpha(colors.status.error, 0.2) }} />
        
        {/* Descripción */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: colors.text.secondary, 
            lineHeight: 1.5,
            flex: 1,
            mb: 1.5,
            fontSize: { xs: '0.9rem', md: '0.95rem' },
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            textAlign: 'center',
          }}
        >
          Por violación de secreto aduanal, delitos informáticos y fraude
        </Typography>
        
        {/* Badge legal */}
        <Box sx={{ mt: 'auto' }}>
          <Chip
            label="Código Penal Art. 211"
            size="small"
            sx={{
              bgcolor: alpha(colors.status.error, 0.1),
              color: colors.status.error,
              height: 28,
              fontSize: { xs: '0.7rem', md: '0.75rem' },
              fontWeight: 600,
              width: '100%',
              '& .MuiChip-label': { px: 1.5 },
            }}
          />
        </Box>
      </Paper>
    </Box>

    {/* Nota legal */}
    <Box
      sx={{
        mt: 3,
        p: 2,
        bgcolor: alpha(colors.status.error, 0.02),
        borderRadius: 2,
        border: `1px dashed ${alpha(colors.status.error, 0.2)}`,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <InfoIcon sx={{ color: colors.status.error, fontSize: 20 }} />
      <Typography variant="body2" sx={{ color: colors.text.secondary, fontSize: { xs: '0.85rem', md: '0.9rem' }, lineHeight: 1.5 }}>
        <strong>Nota:</strong> Las sanciones se aplicarán conforme al procedimiento establecido en la legislación vigente.
      </Typography>
    </Box>
  </Box>
</Paper>

              {/* Bloque de contacto */}
              <Box
                sx={{
                  mt: 5,
                  p: { xs: 2, md: 4 },
                  background: colors.primary.gradient,
                  borderRadius: 3,
                  color: colors.white,
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: colors.white,
                          color: colors.primary.main,
                          width: 56,
                          height: 56,
                        }}
                      >
                        <ContactSupportIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1rem', md: '1.2rem' } }}>
                          ¿Requieres asesoría?
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Contacta al Oficial de Cumplimiento Aduanal para resolver tus dudas sobre el uso de los sistemas.
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      variant="contained"
                      href="mailto:cumplimiento@vugaa.mx"
                      size="large"
                      sx={{
                        bgcolor: colors.white,
                        color: colors.primary.main,
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          bgcolor: alpha(colors.white, 0.9),
                        },
                      }}
                    >
                      cumplimiento@vugaa.mx
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </TabPanel>

         {/* AVISO DE PRIVACIDAD - VERSIÓN PROFESIONAL */}
<TabPanel value={tabValue} index={1}>
  <Box sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
    
    {/* Encabezado con fecha y título principal */}
    <Box sx={{ mb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Chip
          icon={<InfoIcon />}
          label="Última actualización: 18 de febrero de 2026"
          sx={{
            bgcolor: alpha(colors.primary.main, 0.08),
            color: colors.primary.main,
            fontWeight: 500,
            height: 32,
          }}
        />
        <Chip
          icon={<PrivacyTipIcon />}
          label="Versión 2.0"
          sx={{
            bgcolor: alpha(colors.secondary.main, 0.08),
            color: colors.secondary.main,
            fontWeight: 500,
            height: 32,
          }}
        />
      </Box>
      
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 700,
          color: colors.text.primary,
          mb: 1,
          fontSize: { xs: '1.5rem', md: '2rem' },
          borderLeft: `4px solid ${colors.secondary.main}`,
          pl: 2,
        }}
      >
        Aviso de Privacidad
      </Typography>
      <Typography variant="body2" sx={{ color: colors.text.tertiary, pl: 2 }}>
        Protección de datos personales en el sistema VUGAA
      </Typography>
    </Box>

    {/* Tarjeta de introducción - Resumen ejecutivo */}
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3.5 },
        mb: 4,
        background: `linear-gradient(135deg, ${alpha(colors.primary.main, 0.02)} 0%, ${alpha(colors.secondary.main, 0.02)} 100%)`,
        borderRadius: 3,
        border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '150px',
          height: '150px',
          background: `radial-gradient(circle, ${alpha(colors.secondary.main, 0.1)} 0%, transparent 70%)`,
          borderRadius: '50%',
          transform: 'translate(50%, -50%)',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="body1" sx={{ 
          color: colors.text.primary, 
          fontWeight: 500,
          fontSize: { xs: '0.95rem', md: '1.1rem' },
          lineHeight: 1.7,
          mb: 2,
        }}>
          En <strong style={{ color: colors.primary.main }}>VUGAA</strong>, la protección de tus datos personales es nuestra prioridad. Este aviso describe cómo recopilamos, utilizamos y protegemos la información de todos los involucrados en el proceso aduanal, en cumplimiento con la <strong>Ley General de Protección de Datos Personales</strong> y la <strong>Ley Aduanera</strong>.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<VerifiedUserIcon />}
            label="Cumplimiento garantizado"
            size="small"
            sx={{ bgcolor: alpha(colors.primary.main, 0.08), color: colors.primary.main }}
          />
          <Chip
            icon={<SecurityIcon />}
            label="Datos seguros"
            size="small"
            sx={{ bgcolor: alpha(colors.secondary.main, 0.08), color: colors.secondary.main }}
          />
          <Chip
            icon={<GavelIcon />}
            label="Marco legal aplicable"
            size="small"
            sx={{ bgcolor: alpha(colors.accent.purple, 0.08), color: colors.accent.purple }}
          />
        </Box>
      </Box>
    </Paper>

   {/* Sección 1 - Responsable del Tratamiento - ESTRUCTURADO Y CENTRADO */}
<Paper
  elevation={0}
  sx={{
    mb: 4,
    borderRadius: 3,
    overflow: 'hidden',
    border: `1px solid ${colors.border.light}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: `0 12px 24px -8px ${alpha(colors.primary.main, 0.15)}`,
    },
  }}
>
  <Box
    sx={{
      bgcolor: alpha(colors.primary.main, 0.03),
      p: { xs: 2.5, md: 3 },
      borderBottom: `1px solid ${colors.border.light}`,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    }}
  >
    <Avatar
      sx={{
        bgcolor: colors.primary.main,
        color: colors.white,
        width: { xs: 44, md: 52 },
        height: { xs: 44, md: 52 },
      }}
    >
      <AccountBalanceIcon />
    </Avatar>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary.main, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
        1. Responsable del Tratamiento
      </Typography>
      <Typography variant="body2" sx={{ color: colors.text.tertiary }}>
        Entidad responsable de la protección de tus datos
      </Typography>
    </Box>
  </Box>

  <Box sx={{ p: { xs: 2.5, md: 4 } }}>
    {/* Contenedor centrado con ancho controlado */}
    <Box 
      sx={{ 
        maxWidth: '800px', 
        mx: 'auto',
      }}
    >
      {/* Información en formato compacto */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        
        {/* Denominación y Registro INAI - Dos columnas */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}>
          <Paper
            sx={{
              flex: 1,
              p: 2.5,
              bgcolor: alpha(colors.primary.main, 0.02),
              borderRadius: 2,
              border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Avatar sx={{ bgcolor: alpha(colors.primary.main, 0.1), color: colors.primary.main, width: 40, height: 40 }}>
              <BadgeIcon />
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ color: colors.text.tertiary, fontWeight: 500 }}>
                Denominación
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.primary, fontWeight: 500 }}>
                VUGAA - Ventanilla Única de Gestión de Agentes Aduanales
              </Typography>
            </Box>
          </Paper>

          <Paper
            sx={{
              flex: 1,
              p: 2.5,
              bgcolor: alpha(colors.primary.main, 0.02),
              borderRadius: 2,
              border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Avatar sx={{ bgcolor: alpha(colors.primary.main, 0.1), color: colors.primary.main, width: 40, height: 40 }}>
              <InfoIcon />
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ color: colors.text.tertiary, fontWeight: 500 }}>
                Registro INAI
              </Typography>
              <Typography variant="body2" sx={{ color: colors.secondary.main, fontWeight: 600 }}>
                INAI-AD-2026-001234
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Oficial de Protección y Domicilio - Dos columnas */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}>
          <Paper
            sx={{
              flex: 1,
              p: 2.5,
              bgcolor: alpha(colors.primary.main, 0.02),
              borderRadius: 2,
              border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Avatar sx={{ bgcolor: alpha(colors.primary.main, 0.1), color: colors.primary.main, width: 40, height: 40 }}>
              <ContactSupportIcon />
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ color: colors.text.tertiary, fontWeight: 500 }}>
                Oficial de Protección de Datos
              </Typography>
              <Typography variant="body2" sx={{ color: colors.secondary.main, fontWeight: 600 }}>
                privacidad@vugaa.mx
              </Typography>
            </Box>
          </Paper>

          <Paper
            sx={{
              flex: 1,
              p: 2.5,
              bgcolor: alpha(colors.primary.main, 0.02),
              borderRadius: 2,
              border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Avatar sx={{ bgcolor: alpha(colors.primary.main, 0.1), color: colors.primary.main, width: 40, height: 40 }}>
              <LocationOnIcon />
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ color: colors.text.tertiary, fontWeight: 500 }}>
                Domicilio
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.primary }}>
                Av. Paseo de la Reforma 123, Piso 15, Col. Juárez, Cuauhtémoc, C.P. 06600, CDMX
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Badges de cumplimiento */}
      <Box
        sx={{
          mt: 3,
          display: 'flex',
          justifyContent: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
        }}
      >
        <Chip
          label="Sujeto obligado por la LGPDP"
          size="small"
          sx={{ bgcolor: alpha(colors.primary.main, 0.08), color: colors.primary.main, height: 28 }}
        />
        <Chip
          label="Registro ante INAI"
          size="small"
          sx={{ bgcolor: alpha(colors.secondary.main, 0.08), color: colors.secondary.main, height: 28 }}
        />
        <Chip
          label="Cumplimiento Ley Aduanera"
          size="small"
          sx={{ bgcolor: alpha(colors.accent.purple, 0.08), color: colors.accent.purple, height: 28 }}
        />
      </Box>
    </Box>
  </Box>
</Paper>
    {/* Sección 2 - Datos Personales Recabados - CENTRADO Y ESTANDARIZADO */}
<Paper
  elevation={0}
  sx={{
    mb: 4,
    borderRadius: 3,
    overflow: 'hidden',
    border: `1px solid ${colors.border.light}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: `0 12px 24px -8px ${alpha(colors.secondary.main, 0.15)}`,
    },
  }}
>
  <Box
    sx={{
      bgcolor: alpha(colors.secondary.main, 0.03),
      p: { xs: 2.5, md: 3 },
      borderBottom: `1px solid ${colors.border.light}`,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    }}
  >
    <Avatar
      sx={{
        bgcolor: colors.secondary.main,
        color: colors.white,
        width: { xs: 44, md: 52 },
        height: { xs: 44, md: 52 },
      }}
    >
      <AssignmentIndIcon />
    </Avatar>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: colors.secondary.main, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
        2. Datos Personales Recabados
      </Typography>
      <Typography variant="body2" sx={{ color: colors.text.tertiary }}>
        Información que recopilamos para la operación aduanal
      </Typography>
    </Box>
  </Box>

  <Box sx={{ p: { xs: 2.5, md: 4 } }}>
    {/* Contenedor flex para centrar las tarjetas */}
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        justifyContent: 'center',
        alignItems: 'stretch',
        flexWrap: 'wrap',
      }}
    >
      {[
        {
          categoria: 'Identificativos',
          icon: <BadgeIcon />,
          color: colors.primary.main,
          datos: ['Nombre completo', 'RFC', 'CURP', 'Firma electrónica', 'Cédula profesional'],
          fundamento: 'Ley Aduanera Art. 36'
        },
        {
          categoria: 'Laborales',
          icon: <WorkIcon />,
          color: colors.accent.electricBlue,
          datos: ['Patente aduanal', 'Puesto/función', 'Certificaciones', 'Historial de operaciones'],
          fundamento: 'Código Fiscal Art. 19'
        },
      
        {
          categoria: 'Seguimiento',
          icon: <TimelineIcon />,
          color: colors.secondary.main,
          datos: ['Bitácoras de acceso', 'Operaciones realizadas', 'Documentos consultados'],
          fundamento: 'LGPDP Art. 28'
        }
      ].map((seccion, idx) => (
        <Paper
          key={idx}
          sx={{
            width: { xs: '100%', sm: '350px', md: '280px' },
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: alpha(seccion.color, 0.02),
            borderRadius: 2,
            border: `1px solid ${alpha(seccion.color, 0.2)}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 16px -8px ${alpha(seccion.color, 0.2)}`,
              borderColor: seccion.color,
            },
          }}
        >
          {/* Encabezado centrado */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, justifyContent: 'center' }}>
            <Avatar sx={{ bgcolor: alpha(seccion.color, 0.1), color: seccion.color, width: 36, height: 36 }}>
              {seccion.icon}
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: seccion.color }}>
              {seccion.categoria}
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 2, borderColor: alpha(seccion.color, 0.2) }} />
          
          {/* Lista de datos - altura flexible */}
          <Box component="ul" sx={{ m: 0, pl: 2, mb: 2, flex: 1 }}>
            {seccion.datos.map((dato, i) => (
              <li key={i}>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                  {dato}
                </Typography>
              </li>
            ))}
          </Box>
          
          {/* Fundamento legal - SIEMPRE AL MISMO NIVEL */}
          <Box sx={{ mt: 'auto', pt: 1 }}>
            <Chip
              label={seccion.fundamento}
              size="small"
              sx={{
                bgcolor: alpha(seccion.color, 0.1),
                color: seccion.color,
                fontSize: '0.65rem',
                height: 24,
                width: '100%',
                '& .MuiChip-label': { px: 1 },
              }}
            />
          </Box>
        </Paper>
      ))}
    </Box>

    {/* Nota informativa */}
    <Box
      sx={{
        mt: 3,
        p: 2,
        bgcolor: alpha(colors.secondary.main, 0.02),
        borderRadius: 2,
        border: `1px dashed ${alpha(colors.secondary.main, 0.2)}`,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <InfoIcon sx={{ color: colors.secondary.main, fontSize: 20 }} />
      <Typography variant="caption" sx={{ color: colors.text.secondary }}>
        <strong>Nota:</strong> Todos los datos recabados son estrictamente necesarios para el cumplimiento de obligaciones legales en materia aduanera y fiscal.
      </Typography>
    </Box>
  </Box>
</Paper>


 {/* Sección 3 - Finalidades del Tratamiento - ALTURA IDÉNTICA EN AMBAS COLUMNAS */}
<Paper
  elevation={0}
  sx={{
    mb: 4,
    borderRadius: 3,
    overflow: 'hidden',
    border: `1px solid ${colors.border.light}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: `0 12px 24px -8px ${alpha(colors.accent.electricBlue, 0.15)}`,
    },
  }}
>
  <Box
    sx={{
      bgcolor: alpha(colors.accent.electricBlue, 0.03),
      p: { xs: 2.5, md: 3 },
      borderBottom: `1px solid ${colors.border.light}`,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    }}
  >
    <Avatar
      sx={{
        bgcolor: colors.accent.electricBlue,
        color: colors.white,
        width: { xs: 44, md: 52 },
        height: { xs: 44, md: 52 },
      }}
    >
      <DescriptionIcon />
    </Avatar>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: colors.accent.electricBlue, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
        3. Finalidades del Tratamiento
      </Typography>
      <Typography variant="body2" sx={{ color: colors.text.tertiary }}>
        Para qué utilizamos tus datos personales
      </Typography>
    </Box>
  </Box>

  <Box sx={{ p: { xs: 2.5, md: 4 } }}>
    
    {/* Texto introductorio */}
    <Typography 
      variant="body2" 
      sx={{ 
        color: colors.text.secondary, 
        mb: 3, 
        fontStyle: 'italic',
        textAlign: 'center',
        fontSize: { xs: '0.9rem', md: '1rem' },
      }}
    >
      Tus datos serán utilizados exclusivamente para las siguientes finalidades, necesarias para la operación aduanal:
    </Typography>

    {/* CSS Grid con 2 columnas y 4 filas - TODAS LAS TARJETAS CON LA MISMA ALTURA */}
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr', // 1 columna en móvil
          md: '1fr 1fr' // 2 columnas en desktop
        },
        gap: 3,
      }}
    >
      {/* Fila 1 - Tarjetas 1 y 5 */}
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          bgcolor: alpha(colors.accent.electricBlue, 0.02),
          borderRadius: 2,
          border: `1px solid ${alpha(colors.accent.electricBlue, 0.15)}`,
          transition: 'all 0.2s ease',
          width: '100%',
          height: '80%',
          minHeight: '100px', // Altura mínima uniforme
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: colors.accent.electricBlue,
            boxShadow: `0 8px 16px -8px ${alpha(colors.accent.electricBlue, 0.2)}`,
          },
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: alpha(colors.accent.electricBlue, 0.1),
            color: colors.accent.electricBlue,
            flexShrink: 0,
          }}
        >
          <LocalShippingIcon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>
            Gestión de operaciones de comercio exterior
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.tertiary, display: 'block' }}>
            Procesamiento de trámites, validaciones y seguimiento de operaciones aduanales
          </Typography>
        </Box>
      </Paper>

      <Paper
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          bgcolor: alpha(colors.accent.electricBlue, 0.02),
          borderRadius: 2,
          border: `1px solid ${alpha(colors.accent.electricBlue, 0.15)}`,
          transition: 'all 0.2s ease',
          width: '100%',
          height: '80%',
          minHeight: '100px',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: colors.accent.electricBlue,
            boxShadow: `0 8px 16px -8px ${alpha(colors.accent.electricBlue, 0.2)}`,
          },
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: alpha(colors.accent.electricBlue, 0.1),
            color: colors.accent.electricBlue,
            flexShrink: 0,
          }}
        >
          <SecurityIcon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>
            Prevención de fraudes y operaciones ilícitas
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.tertiary, display: 'block' }}>
            Monitoreo y detección de actividades irregulares en el proceso aduanal
          </Typography>
        </Box>
      </Paper>

      {/* Fila 2 - Tarjetas 2 y 6 */}
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          bgcolor: alpha(colors.accent.electricBlue, 0.02),
          borderRadius: 2,
          border: `1px solid ${alpha(colors.accent.electricBlue, 0.15)}`,
          transition: 'all 0.2s ease',
          width: '100%',
          height: '80%',
          minHeight: '100px',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: colors.accent.electricBlue,
            boxShadow: `0 8px 16px -8px ${alpha(colors.accent.electricBlue, 0.2)}`,
          },
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: alpha(colors.accent.electricBlue, 0.1),
            color: colors.accent.electricBlue,
            flexShrink: 0,
          }}
        >
          <VerifiedUserIcon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>
            Validación de identidad y habilitaciones profesionales
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.tertiary, display: 'block' }}>
            Verificación de credenciales, patentes y autorizaciones ante la ANAM
          </Typography>
        </Box>
      </Paper>

      <Paper
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          bgcolor: alpha(colors.accent.electricBlue, 0.02),
          borderRadius: 2,
          border: `1px solid ${alpha(colors.accent.electricBlue, 0.15)}`,
          transition: 'all 0.2s ease',
          width: '100%',
          height: '80%',
          minHeight: '100px',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: colors.accent.electricBlue,
            boxShadow: `0 8px 16px -8px ${alpha(colors.accent.electricBlue, 0.2)}`,
          },
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: alpha(colors.accent.electricBlue, 0.1),
            color: colors.accent.electricBlue,
            flexShrink: 0,
          }}
        >
          <GavelIcon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>
            Auditorías de cumplimiento y autorregulación
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.tertiary, display: 'block' }}>
            Revisiones periódicas para garantizar la integridad de las operaciones
          </Typography>
        </Box>
      </Paper>

      {/* Fila 3 - Tarjetas 3 y 7 */}
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          bgcolor: alpha(colors.accent.electricBlue, 0.02),
          borderRadius: 2,
          border: `1px solid ${alpha(colors.accent.electricBlue, 0.15)}`,
          transition: 'all 0.2s ease',
          width: '100%',
          height: '80%',
          minHeight: '100px',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: colors.accent.electricBlue,
            boxShadow: `0 8px 16px -8px ${alpha(colors.accent.electricBlue, 0.2)}`,
          },
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: alpha(colors.accent.electricBlue, 0.1),
            color: colors.accent.electricBlue,
            flexShrink: 0,
          }}
        >
          <AccountBalanceIcon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>
            Cumplimiento de obligaciones fiscales y aduaneras
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.tertiary, display: 'block' }}>
            Generación de reportes y declaraciones requeridas por las autoridades
          </Typography>
        </Box>
      </Paper>

      <Paper
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          bgcolor: alpha(colors.accent.electricBlue, 0.02),
          borderRadius: 2,
          border: `1px solid ${alpha(colors.accent.electricBlue, 0.15)}`,
          transition: 'all 0.2s ease',
          width: '100%',
          height: '80%',
          minHeight: '100px',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: colors.accent.electricBlue,
            boxShadow: `0 8px 16px -8px ${alpha(colors.accent.electricBlue, 0.2)}`,
          },
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: alpha(colors.accent.electricBlue, 0.1),
            color: colors.accent.electricBlue,
            flexShrink: 0,
          }}
        >
          <SettingsIcon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>
            Mejora continua de los servicios
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.tertiary, display: 'block' }}>
            Análisis de uso y optimización de la plataforma VUGAA
          </Typography>
        </Box>
      </Paper>

      {/* Fila 4 - Tarjetas 4 y 8 */}
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          bgcolor: alpha(colors.accent.electricBlue, 0.02),
          borderRadius: 2,
          border: `1px solid ${alpha(colors.accent.electricBlue, 0.15)}`,
          transition: 'all 0.2s ease',
          width: '100%',
          height: '80%',
          minHeight: '100px',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: colors.accent.electricBlue,
            boxShadow: `0 8px 16px -8px ${alpha(colors.accent.electricBlue, 0.2)}`,
          },
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: alpha(colors.accent.electricBlue, 0.1),
            color: colors.accent.electricBlue,
            flexShrink: 0,
          }}
        >
          <DescriptionIcon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>
            Generación de reportes para autoridades
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.tertiary, display: 'block' }}>
            SAT, ANAM y otras entidades fiscalizadoras en el marco de sus atribuciones
          </Typography>
        </Box>
      </Paper>

      <Paper
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          bgcolor: alpha(colors.accent.electricBlue, 0.02),
          borderRadius: 2,
          border: `1px solid ${alpha(colors.accent.electricBlue, 0.15)}`,
          transition: 'all 0.2s ease',
          width: '100%',
          height: '80%',
          minHeight: '100px',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: colors.accent.electricBlue,
            boxShadow: `0 8px 16px -8px ${alpha(colors.accent.electricBlue, 0.2)}`,
          },
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: alpha(colors.accent.electricBlue, 0.1),
            color: colors.accent.electricBlue,
            flexShrink: 0,
          }}
        >
          <ContactSupportIcon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>
            Atención de requerimientos de autoridades
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.tertiary, display: 'block' }}>
            Respuesta a solicitudes de información de entidades gubernamentales
          </Typography>
        </Box>
      </Paper>
    </Box>

    {/* Nota importante */}
    <Box
      sx={{
        mt: 4,
        p: 2.5,
        bgcolor: alpha(colors.accent.electricBlue, 0.03),
        borderRadius: 2,
        border: `1px dashed ${alpha(colors.accent.electricBlue, 0.3)}`,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <InfoIcon sx={{ color: colors.accent.electricBlue, fontSize: 24 }} />
      <Typography variant="body2" sx={{ color: colors.text.secondary, lineHeight: 1.6 }}>
        <strong>Importante:</strong> No utilizaremos tus datos para finalidades distintas a las aquí señaladas sin obtener tu consentimiento previo. Todas las finalidades están respaldadas por la <strong>Ley Aduanera</strong> y el <strong>Código Fiscal de la Federación</strong>.
      </Typography>
    </Box>

    {/* Badges de cumplimiento */}
    <Box
      sx={{
        mt: 3,
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <Chip
        icon={<CheckCircleIcon />}
        label="Ley Aduanera Art. 84-86"
        size="small"
        sx={{ bgcolor: alpha(colors.accent.electricBlue, 0.08), color: colors.accent.electricBlue }}
      />
      <Chip
        icon={<CheckCircleIcon />}
        label="Código Fiscal Art. 32"
        size="small"
        sx={{ bgcolor: alpha(colors.primary.main, 0.08), color: colors.primary.main }}
      />
      <Chip
        icon={<CheckCircleIcon />}
        label="LGPDP Art. 16"
        size="small"
        sx={{ bgcolor: alpha(colors.accent.purple, 0.08), color: colors.accent.purple }}
      />
    </Box>
  </Box>
</Paper>

   {/* Sección 4 - Derechos ARCO - ESTRUCTURADO Y CENTRADO */}
<Paper
  elevation={0}
  sx={{
    mb: 4,
    borderRadius: 3,
    overflow: 'hidden',
    border: `1px solid ${colors.border.light}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: `0 12px 24px -8px ${alpha(colors.status.info, 0.15)}`,
    },
  }}
>
  <Box
    sx={{
      bgcolor: alpha(colors.status.info, 0.03),
      p: { xs: 2.5, md: 3 },
      borderBottom: `1px solid ${colors.border.light}`,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    }}
  >
    <Avatar
      sx={{
        bgcolor: colors.status.info,
        color: colors.white,
        width: { xs: 44, md: 52 },
        height: { xs: 44, md: 52 },
      }}
    >
      <FingerprintIcon />
    </Avatar>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: colors.status.info, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
        4. Derechos ARCO
      </Typography>
      <Typography variant="body2" sx={{ color: colors.text.tertiary }}>
        Acceso, Rectificación, Cancelación y Oposición
      </Typography>
    </Box>
  </Box>

  <Box sx={{ p: { xs: 2.5, md: 4 } }}>
    {/* Contenedor centrado con ancho controlado */}
    <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
      
      {/* Texto introductorio */}
      <Typography 
        variant="body2" 
        sx={{ 
          color: colors.text.secondary, 
          mb: 3, 
          textAlign: 'center',
          fontSize: { xs: '0.9rem', md: '1rem' },
        }}
      >
        Como titular de datos personales, tienes derecho a ejercer los siguientes derechos:
      </Typography>

      {/* Tarjetas de derechos - 4 en fila en desktop */}
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          justifyContent: 'center',
          flexWrap: 'wrap',
          mb: 3,
        }}
      >
        {/* Acceso */}
        <Paper
          sx={{
            width: { xs: '100%', sm: '180px', md: '200px' },
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            bgcolor: alpha(colors.primary.main, 0.02),
            borderRadius: 2,
            border: `1px solid ${alpha(colors.primary.main, 0.2)}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              borderColor: colors.primary.main,
              boxShadow: `0 4px 12px -4px ${alpha(colors.primary.main, 0.2)}`,
            },
          }}
        >
          <Avatar sx={{ bgcolor: alpha(colors.primary.main, 0.1), color: colors.primary.main, width: 48, height: 48, mb: 1 }}>
            <VisibilityIcon />
          </Avatar>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.primary.main, mb: 0.5 }}>
            ACCESO
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            Conocer qué datos personales tenemos
          </Typography>
        </Paper>

        {/* Rectificación */}
        <Paper
          sx={{
            width: { xs: '100%', sm: '180px', md: '200px' },
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            bgcolor: alpha(colors.secondary.main, 0.02),
            borderRadius: 2,
            border: `1px solid ${alpha(colors.secondary.main, 0.2)}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              borderColor: colors.secondary.main,
              boxShadow: `0 4px 12px -4px ${alpha(colors.secondary.main, 0.2)}`,
            },
          }}
        >
          <Avatar sx={{ bgcolor: alpha(colors.secondary.main, 0.1), color: colors.secondary.main, width: 48, height: 48, mb: 1 }}>
            <EditIcon />
          </Avatar>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.secondary.main, mb: 0.5 }}>
            RECTIFICACIÓN
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            Corregir datos inexactos o incompletos
          </Typography>
        </Paper>

        {/* Cancelación */}
        <Paper
          sx={{
            width: { xs: '100%', sm: '180px', md: '200px' },
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            bgcolor: alpha(colors.status.error, 0.02),
            borderRadius: 2,
            border: `1px solid ${alpha(colors.status.error, 0.2)}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              borderColor: colors.status.error,
              boxShadow: `0 4px 12px -4px ${alpha(colors.status.error, 0.2)}`,
            },
          }}
        >
          <Avatar sx={{ bgcolor: alpha(colors.status.error, 0.1), color: colors.status.error, width: 48, height: 48, mb: 1 }}>
            <DeleteIcon />
          </Avatar>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.status.error, mb: 0.5 }}>
            CANCELACIÓN
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            Solicitar la eliminación de tus datos
          </Typography>
        </Paper>

        {/* Oposición */}
        <Paper
          sx={{
            width: { xs: '100%', sm: '180px', md: '200px' },
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            bgcolor: alpha(colors.accent.purple, 0.02),
            borderRadius: 2,
            border: `1px solid ${alpha(colors.accent.purple, 0.2)}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              borderColor: colors.accent.purple,
              boxShadow: `0 4px 12px -4px ${alpha(colors.accent.purple, 0.2)}`,
            },
          }}
        >
          <Avatar sx={{ bgcolor: alpha(colors.accent.purple, 0.1), color: colors.accent.purple, width: 48, height: 48, mb: 1 }}>
            <BlockIcon />
          </Avatar>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.accent.purple, mb: 0.5 }}>
            OPOSICIÓN
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            Oponerte al tratamiento para fines específicos
          </Typography>
        </Paper>
      </Box>

      {/* Tarjeta de contacto - Compacta y centrada */}
      <Paper
        sx={{
          p: 2.5,
          bgcolor: alpha(colors.primary.main, 0.02),
          borderRadius: 2,
          border: `1px solid ${alpha(colors.primary.main, 0.15)}`,
          mb: 3,
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: 2,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: colors.primary.main, color: colors.white, width: 40, height: 40 }}>
              <ContactSupportIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.text.primary }}>
                ¿Cómo ejercer tus derechos ARCO?
              </Typography>
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                Envía tu solicitud a nuestro Oficial de Protección de Datos
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            href="mailto:arco@vugaa.mx"
            size="small"
            sx={{
              bgcolor: colors.primary.main,
              color: colors.white,
              px: 3,
              py: 1,
              fontSize: '0.8rem',
              '&:hover': {
                bgcolor: colors.primary.medium,
              },
            }}
          >
            arco@vugaa.mx
          </Button>
        </Box>
      </Paper>

      {/* Nota informativa - Compacta */}
      <Box
        sx={{
          p: 2,
          bgcolor: alpha(colors.status.info, 0.03),
          borderRadius: 2,
          border: `1px dashed ${alpha(colors.status.info, 0.2)}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <InfoIcon sx={{ color: colors.status.info, fontSize: 18 }} />
        <Typography variant="caption" sx={{ color: colors.text.secondary, lineHeight: 1.4 }}>
          <strong>Plazo de respuesta:</strong> 20 días hábiles. Incluye identificación oficial y descripción clara del derecho que deseas ejercer.
        </Typography>
      </Box>
    </Box>
  </Box>
</Paper>


   {/* Sección 5 - Medidas de Seguridad - ESTRUCTURADO Y CENTRADO */}
<Paper
  elevation={0}
  sx={{
    mb: 4,
    borderRadius: 3,
    overflow: 'hidden',
    border: `1px solid ${colors.border.light}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: `0 12px 24px -8px ${alpha(colors.status.success, 0.15)}`,
    },
  }}
>
  <Box
    sx={{
      bgcolor: alpha(colors.status.success, 0.03),
      p: { xs: 2.5, md: 3 },
      borderBottom: `1px solid ${colors.border.light}`,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    }}
  >
    <Avatar
      sx={{
        bgcolor: colors.status.success,
        color: colors.white,
        width: { xs: 44, md: 52 },
        height: { xs: 44, md: 52 },
      }}
    >
      <SecurityIcon />
    </Avatar>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: colors.status.success, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
        5. Medidas de Seguridad
      </Typography>
      <Typography variant="body2" sx={{ color: colors.text.tertiary }}>
        Protección de tus datos personales
      </Typography>
    </Box>
  </Box>

  <Box sx={{ p: { xs: 2.5, md: 4 } }}>
    {/* Contenedor centrado con ancho controlado */}
    <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
      
      {/* Texto introductorio */}
      <Typography 
        variant="body2" 
        sx={{ 
          color: colors.text.secondary, 
          mb: 3, 
          textAlign: 'center',
          fontSize: { xs: '0.9rem', md: '1rem' },
        }}
      >
        Implementamos medidas de seguridad técnicas, administrativas y físicas para garantizar la protección de tus datos personales:
      </Typography>

      {/* Grid de 3 columnas para las categorías */}
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2.5,
          justifyContent: 'center',
          mb: 3,
        }}
      >
        {/* Medidas Técnicas */}
        <Paper
          sx={{
            flex: 1,
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: alpha(colors.primary.main, 0.02),
            borderRadius: 2,
            border: `1px solid ${alpha(colors.primary.main, 0.2)}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              borderColor: colors.primary.main,
              boxShadow: `0 8px 16px -8px ${alpha(colors.primary.main, 0.2)}`,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar sx={{ bgcolor: alpha(colors.primary.main, 0.1), color: colors.primary.main, width: 36, height: 36 }}>
              <VerifiedUserIcon />
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.primary.main }}>
              Técnicas
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 2, borderColor: alpha(colors.primary.main, 0.2) }} />
          
          <Box component="ul" sx={{ m: 0, pl: 2, flex: 1 }}>
            <li><Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>Encriptación de datos en tránsito y en reposo</Typography></li>
            <li><Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>Firewalls y sistemas de detección de intrusiones</Typography></li>
            <li><Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>Autenticación multifactor para accesos críticos</Typography></li>
            <li><Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>Copias de seguridad automatizadas</Typography></li>
          </Box>
          
          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Chip
              label="ISO 27001"
              size="small"
              sx={{ bgcolor: alpha(colors.primary.main, 0.1), color: colors.primary.main, height: 24, width: '100%' }}
            />
          </Box>
        </Paper>

        {/* Medidas Administrativas */}
        <Paper
          sx={{
            flex: 1,
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: alpha(colors.secondary.main, 0.02),
            borderRadius: 2,
            border: `1px solid ${alpha(colors.secondary.main, 0.2)}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              borderColor: colors.secondary.main,
              boxShadow: `0 8px 16px -8px ${alpha(colors.secondary.main, 0.2)}`,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar sx={{ bgcolor: alpha(colors.secondary.main, 0.1), color: colors.secondary.main, width: 36, height: 36 }}>
              <SecurityIcon />
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.secondary.main }}>
              Administrativas
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 2, borderColor: alpha(colors.secondary.main, 0.2) }} />
          
          <Box component="ul" sx={{ m: 0, pl: 2, flex: 1 }}>
            <li><Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>Controles de acceso basados en roles</Typography></li>
            <li><Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>Auditorías periódicas de seguridad</Typography></li>
            <li><Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>Capacitación continua al personal</Typography></li>
            <li><Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>Acuerdos de confidencialidad con empleados</Typography></li>
          </Box>
          
          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Chip
              label="LGPDP Art. 12"
              size="small"
              sx={{ bgcolor: alpha(colors.secondary.main, 0.1), color: colors.secondary.main, height: 24, width: '100%' }}
            />
          </Box>
        </Paper>

        {/* Medidas Físicas */}
        <Paper
          sx={{
            flex: 1,
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: alpha(colors.accent.purple, 0.02),
            borderRadius: 2,
            border: `1px solid ${alpha(colors.accent.purple, 0.2)}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              borderColor: colors.accent.purple,
              boxShadow: `0 8px 16px -8px ${alpha(colors.accent.purple, 0.2)}`,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar sx={{ bgcolor: alpha(colors.accent.purple, 0.1), color: colors.accent.purple, width: 36, height: 36 }}>
              <LocationOnIcon />
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.accent.purple }}>
              Físicas
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 2, borderColor: alpha(colors.accent.purple, 0.2) }} />
          
          <Box component="ul" sx={{ m: 0, pl: 2, flex: 1 }}>
            <li><Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>Control de acceso a instalaciones</Typography></li>
            <li><Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>Videovigilancia en centros de datos</Typography></li>
            <li><Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>Respaldo de energía y conectividad</Typography></li>
            <li><Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>Protección contra desastres naturales</Typography></li>
          </Box>
          
          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Chip
              label="ISO 27002"
              size="small"
              sx={{ bgcolor: alpha(colors.accent.purple, 0.1), color: colors.accent.purple, height: 24, width: '100%' }}
            />
          </Box>
        </Paper>
      </Box>

      {/* Badges de certificaciones */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          flexWrap: 'wrap',
          mb: 3,
        }}
      >
        <Chip
          icon={<VerifiedUserIcon />}
          label="Certificación ISO 27001"
          size="small"
          sx={{ bgcolor: alpha(colors.status.success, 0.08), color: colors.status.success, height: 28 }}
        />
        <Chip
          icon={<SecurityIcon />}
          label="Esquema Nacional de Seguridad"
          size="small"
          sx={{ bgcolor: alpha(colors.primary.main, 0.08), color: colors.primary.main, height: 28 }}
        />
        <Chip
          icon={<GavelIcon />}
          label="Cumplimiento LGPDP"
          size="small"
          sx={{ bgcolor: alpha(colors.accent.purple, 0.08), color: colors.accent.purple, height: 28 }}
        />
      </Box>

      {/* Nota adicional */}
      <Box
        sx={{
          p: 2,
          bgcolor: alpha(colors.status.success, 0.03),
          borderRadius: 2,
          border: `1px dashed ${alpha(colors.status.success, 0.2)}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <InfoIcon sx={{ color: colors.status.success, fontSize: 18 }} />
        <Typography variant="caption" sx={{ color: colors.text.secondary, lineHeight: 1.4 }}>
          <strong>Compromiso:</strong> Implementamos y mantenemos actualizadas estas medidas para garantizar la confidencialidad, integridad y disponibilidad de tu información.
        </Typography>
      </Box>
    </Box>
  </Box>
</Paper>

    {/* Bloque de contacto final */}
    <Box
      sx={{
        p: { xs: 3, md: 4 },
        background: colors.primary.gradient,
        borderRadius: 3,
        color: colors.white,
      }}
    >
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: colors.white,
                color: colors.primary.main,
                width: { xs: 48, md: 56 },
                height: { xs: 48, md: 56 },
              }}
            >
              <PrivacyTipIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1rem', md: '1.2rem' } }}>
                ¿Tienes dudas sobre tu privacidad?
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Contacta a nuestro Oficial de Protección de Datos para recibir asesoría personalizada.
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            fullWidth
            variant="contained"
            href="mailto:privacidad@vugaa.mx"
            size="large"
            sx={{
              bgcolor: colors.white,
              color: colors.primary.main,
              fontWeight: 600,
              py: 1.5,
              '&:hover': {
                bgcolor: alpha(colors.white, 0.9),
              },
            }}
          >
            privacidad@vugaa.mx
          </Button>
        </Grid>
      </Grid>
    </Box>
  </Box>
</TabPanel>

          {/* POLÍTICA DE COOKIES - Versión simplificada */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
              <DateBadge text="Última actualización: 18 de febrero de 2026" />

              <Paper
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  mb: { xs: 3, md: 4 },
                  bgcolor: alpha(colors.secondary.light, 0.3),
                  borderRadius: { xs: 2, md: 3 },
                  border: `1px solid ${alpha(colors.secondary.main, 0.2)}`,
                }}
              >
                <Typography variant="body1" sx={{ 
                  color: colors.text.primary,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                }}>
                  Las cookies en VUGAA permiten mantener sesiones seguras de usuarios autorizados y registrar operaciones para auditoría.
                </Typography>
              </Paper>

              <SectionCard title="Preferencias de Cookies" icon={<CookieIcon />}>
                {/* Necesarias */}
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    mb: 2,
                    bgcolor: alpha(colors.primary.light, 0.3),
                    borderRadius: 2,
                    border: `1px solid ${alpha(colors.primary.main, 0.15)}`,
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1,
                  }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 600, 
                        color: colors.primary.main,
                        fontSize: { xs: '0.9rem', md: '1rem' },
                      }}>
                        Cookies de Sesión y Seguridad
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: colors.text.secondary,
                        fontSize: { xs: '0.75rem', md: '0.8rem' },
                      }}>
                        Mantienen su sesión activa durante operaciones aduanales.
                      </Typography>
                    </Box>
                    <Switch checked={cookiePreferences.necesarias} disabled />
                  </Box>
                </Paper>

                {/* Rendimiento */}
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    mb: 2,
                    bgcolor: colors.white,
                    border: `1px solid ${colors.border.light}`,
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1,
                  }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 600, 
                        color: colors.text.primary,
                        fontSize: { xs: '0.9rem', md: '1rem' },
                      }}>
                        Cookies de Rendimiento
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: colors.text.secondary,
                        fontSize: { xs: '0.75rem', md: '0.8rem' },
                      }}>
                        Optimizan los tiempos de respuesta en operaciones masivas.
                      </Typography>
                    </Box>
                    <Switch
                      checked={cookiePreferences.rendimiento}
                      onChange={() => handleCookieChange('rendimiento')}
                    />
                  </Box>
                </Paper>

                {/* Personalización */}
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    mb: 2,
                    bgcolor: colors.white,
                    border: `1px solid ${colors.border.light}`,
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1,
                  }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 600, 
                        color: colors.text.primary,
                        fontSize: { xs: '0.9rem', md: '1rem' },
                      }}>
                        Cookies de Personalización
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: colors.text.secondary,
                        fontSize: { xs: '0.75rem', md: '0.8rem' },
                      }}>
                        Recuerdan sus preferencias y accesos directos.
                      </Typography>
                    </Box>
                    <Switch
                      checked={cookiePreferences.funcionalidad}
                      onChange={() => handleCookieChange('funcionalidad')}
                    />
                  </Box>
                </Paper>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: { xs: 'center', sm: 'flex-end' },
                  mt: 3,
                }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveCookies}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      bgcolor: colors.primary.main,
                      background: colors.primary.gradient,
                      color: colors.white,
                      fontSize: { xs: '0.8rem', md: '0.9rem' },
                      px: { xs: 3, md: 4 },
                      '&:hover': {
                        bgcolor: colors.primary.medium,
                      },
                    }}
                  >
                    Guardar preferencias
                  </Button>
                </Box>
              </SectionCard>
            </Box>
          </TabPanel>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ 
        bgcolor: colors.background.dark, 
        py: { xs: 3, md: 4 },
        mt: { xs: 4, md: 6 },
        borderTop: `3px solid ${colors.secondary.main}`,
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={8} sx={{ textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: alpha(colors.white, 0.7),
                  fontSize: { xs: '0.7rem', md: '0.8rem' },
                  '& strong': {
                    color: colors.secondary.main,
                  }
                }}
              >
                © {new Date().getFullYear()} <strong>VUGAA</strong> - Ventanilla Única de Gestión de Agentes Aduanales
              </Typography>
              <Typography variant="caption" sx={{ 
                color: alpha(colors.white, 0.5), 
                display: 'block', 
                mt: 1,
                fontSize: { xs: '0.6rem', md: '0.7rem' },
              }}>
                Sistema en cumplimiento con la Ley Aduanera, Código Fiscal de la Federación y Ley General de Protección de Datos
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default PaginaLegalCompleta;