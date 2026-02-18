import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Modal,
  TextField,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Chip,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
  Zoom,
  alpha,
  Collapse
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Description as TramitesIcon,
  Help as HelpIcon,
  ContactMail as ContactIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Security as SecurityIcon,
  Groups as GroupsIcon,
  Assignment as AssignmentIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Verified as VerifiedIcon,
  Timeline as TimelineIcon,
  Warehouse as WarehouseIcon,
  LocalShipping as LocalShippingIcon,
  Flag as FlagIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';

// Paleta de colores mejorada - más luminosa en secciones intermedias
const colors = {
  primary: {
    main: '#133B6B',
    light: '#E8F0FE',
    medium: '#2A5A8C',
    dark: '#0D2A4D',
    gradient: 'linear-gradient(135deg, #133B6B 0%, #1E4A7A 100%)',
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
    successLight: '#E0F7FA',
    warningLight: '#FFF4E0',
    errorLight: '#FFE5E5',
  },
  border: {
    light: '#E2E8F0',
    main: '#CBD5E1',
  },
  white: '#FFFFFF',
  black: '#000000',
};

// Tamaños estandarizados
const sizes = {
  headerHeight: 72,
  sectionSpacing: 6,
  cardPadding: 3,
  containerMaxWidth: '1400px',
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 24,
  },
  fontSize: {
    h1: { xs: '2.5rem', md: '3.5rem' },
    h2: { xs: '2rem', md: '2.5rem' },
    h3: { xs: '1.5rem', md: '1.8rem' },
    body: '1rem',
    small: '0.875rem',
  },
};

// Sistemas disponibles
const sistemas = [
  {
    id: 'sicag',
    nombre: 'SICAG',
    descripcion: 'Sistema Integral de Cumplimiento y Autorregulación Gremial',
    descripcionCorta: 'Cumplimiento y autorregulación',
    icon: <VerifiedIcon />,
    color: colors.primary.main,
    bgLight: colors.primary.light,
    ruta: '/sicag',
    modulo: 'Cumplimiento',
    estado: 'Activo',
    usuarios: 850,
    certificaciones: 1200,
  },
  {
    id: 'sivad',
    nombre: 'SIVAD',
    descripcion: 'Sistema Integral de Validación Aduanal Digital',
    descripcionCorta: 'Validación digital',
    icon: <AssignmentIcon />,
    color: colors.accent.electricBlue,
    bgLight: colors.accent.blueLight,
    ruta: '/sivad',
    modulo: 'Validación',
    estado: 'Proximamente',
    usuarios: 0,
    certificaciones: 0,
  },
  {
    id: 'sicom',
    nombre: 'SICOM',
    descripcion: 'Sistema de Control de Operaciones y Mercancías',
    descripcionCorta: 'Control operativo',
    icon: <LocalShippingIcon />,
    color: colors.secondary.main,
    bgLight: colors.secondary.light,
    ruta: '/sicom',
    modulo: 'Operaciones',
    estado: 'Próximamente',
    usuarios: 0,
    certificaciones: 0,
  },
  {
    id: 'sigec',
    nombre: 'SIGEC',
    descripcion: 'Sistema de Gestión de Certificaciones Aduanales',
    descripcionCorta: 'Gestión de certificaciones',
    icon: <SchoolIcon />,
    color: colors.accent.purple,
    bgLight: colors.accent.purpleLight,
    ruta: '/sigec',
    modulo: 'Certificaciones',
    estado: 'Proximamente',
    usuarios: 0,
    certificaciones: 0,
  },
  {
    id: 'siaud',
    nombre: 'SIAUD',
    descripcion: 'Sistema Integral de Auditoría y Trazabilidad',
    descripcionCorta: 'Auditoría y trazabilidad',
    icon: <AssessmentIcon />,
    color: colors.primary.medium,
    bgLight: colors.primary.light,
    ruta: '/siaud',
    modulo: 'Auditoría',
    estado: 'Activo',
    usuarios: 500,
    certificaciones: 50,
  },
];

// Trámites disponibles
const tramitesFila1 = [
  { nombre: 'Validación de documentos', icon: <DescriptionIcon />, color: colors.primary.main },
  { nombre: 'Certificaciones profesionales', icon: <SchoolIcon />, color: colors.accent.electricBlue },
  { nombre: 'Registro de expedientes', icon: <AssignmentIcon />, color: colors.secondary.main },
  { nombre: 'Consultas de cumplimiento', icon: <VerifiedIcon />, color: colors.accent.purple },
];

const tramitesFila2 = [
  { nombre: 'Auditorías programadas', icon: <AssessmentIcon />, color: colors.primary.main },
  { nombre: 'Reportes estadísticos', icon: <TimelineIcon />, color: colors.accent.electricBlue },
  { nombre: 'Operaciones aduanales', icon: <LocalShippingIcon />, color: colors.secondary.main },
  { nombre: 'Gestión de patentes', icon: <WarehouseIcon />, color: colors.accent.purple },
];

// Estadísticas
const estadisticas = [
  { numero: '2,850+', label: 'Usuarios Activos', icon: <GroupsIcon />, color: colors.primary.main },
  { numero: '6', label: 'Sistemas', icon: <DashboardIcon />, color: colors.accent.electricBlue },
  { numero: '15.2K', label: 'Trámites', icon: <AssignmentIcon />, color: colors.secondary.main },
  { numero: '98%', label: 'Satisfacción', icon: <StarIcon />, color: colors.accent.purple },
  { numero: '24/7', label: 'Soporte', icon: <ShieldIcon />, color: colors.primary.main },
  { numero: '32', label: 'Regiones', icon: <TimelineIcon />, color: colors.accent.electricBlue },
];

const Inicio = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSistema, setSelectedSistema] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const politicasData = [
  {
    titulo: 'Protección de datos personales',
    descripcion: 'Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos personales contra acceso no autorizado, pérdida o destrucción. Cumplimos con la Ley Federal de Protección de Datos Personales.'
  },
  {
    titulo: 'Confidencialidad de la información',
    descripcion: 'Toda la información compartida con VUGAA se maneja con estricta confidencialidad. Nuestro personal está sujeto a acuerdos de confidencialidad y solo accede a información necesaria para brindar el servicio.'
  },
  {
    titulo: 'Transparencia en procesos',
    descripcion: 'Mantenemos procesos claros y transparentes, informando a los usuarios sobre cualquier cambio en nuestras políticas, procedimientos o términos de servicio.'
  },
  {
    titulo: 'Mejora continua',
    descripcion: 'Evaluamos constantemente nuestros procesos y sistemas para identificar áreas de mejora, implementando actualizaciones que optimicen la experiencia del usuario.'
  },
  {
    titulo: 'Cumplimiento normativo',
    descripcion: 'Cumplimos rigurosamente con todas las leyes, regulaciones y normativas aplicables al sector, garantizando operaciones legales y éticas.'
  },
  {
    titulo: 'Ética profesional',
    descripcion: 'Actuamos con integridad, honestidad y responsabilidad en todas nuestras interacciones, manteniendo los más altos estándares éticos.'
  }
];


const [expandedIndex, setExpandedIndex] = useState(null);

//  REFERENCIAS PARA NAVEGACIÓN INTERNA
const sistemasRef = useRef(null);
const tramitesRef = useRef(null);
const contactoRef = useRef(null);

//  FUNCIONES PARA SCROLL SUAVE
const scrollToSistemas = () => {
  sistemasRef.current?.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start',
  });
};

const scrollToTramites = () => {
  tramitesRef.current?.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start',
  });
};

const scrollToContacto = () => {
  contactoRef.current?.scrollIntoView({ 
    behavior: 'smooth',
    block: 'center',
  });
};

const handlePoliticaClick = (index) => {
  setExpandedIndex(expandedIndex === index ? null : index);
};

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleModalOpen = (tipo) => {
    setModalTipo(tipo);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleMenuClick = (event, sistema) => {
    setAnchorEl(event.currentTarget);
    setSelectedSistema(sistema);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSistema(null);
    
  };

  const handleUserMenuOpen = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  const handleAccederSistema = () => {
    handleMenuClose(); // Cierra el menú
    navigate('/login'); // Redirige a login
  };

  const drawer = (
    <Box sx={{ 
      width: 300, 
      bgcolor: colors.background.paper, 
      height: '100%',
    }}>
      <Toolbar sx={{ 
        bgcolor: colors.primary.main, 
        color: colors.white,
        height: sizes.headerHeight,
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>
          Menú
        </Typography>
        <IconButton sx={{ color: colors.white }} onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List sx={{ pt: 2 }}>
        {[
          { text: 'Inicio', icon: <DashboardIcon />, color: colors.primary.main },
          { text: 'Servicios', icon: <SecurityIcon />, color: colors.accent.electricBlue },
          { text: 'Ayuda', icon: <HelpIcon />, color: colors.secondary.main },
          { text: 'Contacto', icon: <ContactIcon />, color: colors.accent.purple },
        ].map((item) => (
          <ListItem 
            button 
            key={item.text} 
            sx={{ 
              px: 3, 
              py: 1.5,
              borderRadius: '0 20px 20px 0',
              mr: 1,
              '&:hover': { 
                bgcolor: alpha(item.color, 0.04),
                '& .MuiListItemIcon-root': { color: item.color },
              },
            }}
          >
            <ListItemIcon sx={{ color: colors.text.tertiary, minWidth: 40 }}>
              {React.cloneElement(item.icon, { style: { color: 'inherit' } })}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ fontWeight: 500, color: colors.text.primary }} 
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="subtitle2" sx={{ color: colors.text.secondary, mb: 2, fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
          Accesos Rápidos
        </Typography>
        <Stack spacing={1}>
          {['T-MEC', 'CONSULT', 'CAAAREM'].map((item, index) => {
            const colors_list = [colors.primary.main, colors.accent.electricBlue, colors.secondary.main];
            return (
              <Button
                key={item}
                fullWidth
                variant="text"
                sx={{
                  justifyContent: 'flex-start',
                  color: colors.text.secondary,
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  py: 0.75,
                  '&:hover': { 
                    color: colors_list[index % colors_list.length],
                    bgcolor: alpha(colors_list[index % colors_list.length], 0.04),
                  },
                }}
              >
                {item}
              </Button>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      bgcolor: colors.background.default, 
      minHeight: '100vh',
      width: '100%',
    }}>
      {/* Barra de navegación superior */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: colors.background.paper, 
          color: colors.text.primary,
          borderBottom: `1px solid ${colors.border.light}`,
          height: sizes.headerHeight,
          justifyContent: 'center',
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
          <Toolbar disableGutters sx={{ minHeight: 'auto !important' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' }, color: colors.text.secondary }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  color: colors.primary.main,
                  letterSpacing: '-0.5px',
                  mr: 6,
                  fontSize: '1.5rem',
                }}
              >
                VUGAA
              </Typography>

              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                {['Inicio', 'Servicios', 'Ayuda', 'Contacto'].map((item, index) => {
                  let onClickHandler;
                  if (item === 'Servicios') {
                    onClickHandler = scrollToTramites;
                  } else if (item === 'Ayuda' || item === 'Contacto') {
                    onClickHandler = scrollToContacto;
                  } else {
                    onClickHandler = () => window.scrollTo({ top: 0, behavior: 'smooth' });
                  }

                  const colors_hover = [colors.primary.main, colors.accent.electricBlue, colors.secondary.main, colors.accent.purple];

                  return (
                    <Button
                      key={item}
                      color="inherit"
                      onClick={onClickHandler}
                      sx={{ 
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        color: colors.text.secondary,
                        position: 'relative',
                        '&:after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -4,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 0,
                          height: 2,
                          bgcolor: colors_hover[index % colors_hover.length],
                          transition: 'width 0.2s ease',
                        },
                        '&:hover': { 
                          color: colors_hover[index % colors_hover.length],
                          bgcolor: 'transparent',
                          '&:after': {
                            width: '60%',
                          },
                        },
                      }}
                    >
                      {item}
                    </Button>
                  );
                })}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1.5, mr: 2 }}>
                {['T-MEC', 'CONSULT', 'CAAAREM'].map((logo, index) => {
                  const colors_list = [colors.primary.main, colors.accent.electricBlue, colors.secondary.main];
                  return (
                    <Chip
                      key={logo}
                      label={logo}
                      size="small"
                      sx={{ 
                        bgcolor: alpha(colors_list[index % colors_list.length], 0.08),
                        color: colors_list[index % colors_list.length],
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        height: 28,
                        border: `1px solid ${alpha(colors_list[index % colors_list.length], 0.15)}`,
                        '&:hover': { 
                          bgcolor: colors_list[index % colors_list.length],
                          color: colors.white,
                          borderColor: 'transparent',
                        },
                      }}
                    />
                  );
                })}
              </Box>

              <IconButton sx={{ color: colors.text.secondary }}>
                <NotificationsIcon />
              </IconButton>

              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={handleClick}
                sx={{ 
                  bgcolor: colors.primary.main,
                  px: 3,
                  height: 40,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  boxShadow: 'none',
                  '&:hover': { 
                    bgcolor: colors.primary.medium,
                    boxShadow: `0 4px 12px ${alpha(colors.primary.main, 0.2)}`,
                  },
                  display: { xs: 'none', md: 'flex' },
                }}
              >
                Acceder
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer móvil */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300 } }}
      >
        {drawer}
      </Drawer>

      {/* Hero Section - CON IMAGEN PROFESIONALMENTE INTEGRADA */}
      <Box
        sx={{
          bgcolor: colors.primary.main,
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 6, md: 10 },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: `radial-gradient(circle at 70% 50%, ${alpha(colors.secondary.main, 0.1)} 0%, transparent 50%)`,
            zIndex: 0,
          }
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 }, position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Zoom in timeout={1000}>
                <Box>
                  <Chip
                    label="Plataforma Oficial del Sector Aduanal"
                    sx={{ 
                      bgcolor: alpha(colors.secondary.main, 0.15),
                      color: colors.secondary.main,
                      fontWeight: 600,
                      mb: 3,
                      height: 32,
                      fontSize: '0.9rem',
                      border: `1px solid ${alpha(colors.secondary.main, 0.3)}`,
                    }}
                  />
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontSize: sizes.fontSize.h1,
                      fontWeight: 800,
                      lineHeight: 1.1,
                      mb: 2,
                      color: colors.white,
                      textShadow: `0 2px 20px ${alpha(colors.black, 0.2)}`,
                    }}
                  >
                    Ventanilla Única de Gestión 
                    <Box component="span" sx={{ color: colors.secondary.main, display: 'block' }}>
                      de Agentes Aduanales
                    </Box>
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: alpha(colors.white, 0.8),
                      fontWeight: 400,
                      mb: 4,
                      maxWidth: '700px',
                      fontSize: '1.25rem',
                      lineHeight: 1.6,
                    }}
                  >
                    Gestión integral, cumplimiento y autorregulación para el sector aduanal mexicano
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button 
                      variant="contained" 
                      size="large"
                      onClick={scrollToSistemas}
                      sx={{ 
                        bgcolor: colors.secondary.main,
                        px: 5,
                        py: 1.8,
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: colors.primary.dark,
                        borderRadius: sizes.borderRadius.medium,
                        boxShadow: `0 8px 20px ${alpha(colors.secondary.main, 0.3)}`,
                        '&:hover': { 
                          bgcolor: colors.secondary.dark,
                          boxShadow: `0 12px 28px ${alpha(colors.secondary.main, 0.4)}`,
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Explorar Sistemas
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="large"
                      sx={{ 
                        borderColor: colors.secondary.main,
                        color: colors.white,
                        px: 5,
                        py: 1.8,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: sizes.borderRadius.medium,
                        borderWidth: 2,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: alpha(colors.white, 0.05),
                        '&:hover': { 
                          borderColor: colors.secondary.light,
                          backgroundColor: alpha(colors.secondary.main, 0.1),
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Ver Demo
                    </Button>
                  </Stack>
                </Box>
              </Zoom>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                height: '100%',
                minHeight: 450,
              }}>
                {/* Capas de fondo para dar profundidad */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: 1000,
                    height: 1000,
                    borderRadius: '100%',
                    background: `radial-gradient(circle, ${alpha(colors.secondary.main, 0.2)} 0%, transparent 70%)`,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 0,
                  }}
                />
                
                <Box
                  sx={{
                    position: 'absolute',
                    width: 450,
                    height: 450,
                    borderRadius: '50%',
                    border: `2px solid ${alpha(colors.secondary.main, 0.15)}`,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                  }}
                />

                <Box
                  sx={{
                    position: 'absolute',
                    width: 380,
                    height: 380,
                    borderRadius: '50%',
                    border: `1px solid ${alpha(colors.secondary.main, 0.3)}`,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                    boxShadow: `0 0 40px ${alpha(colors.secondary.main, 0.2)}`,
                  }}
                />
                
                {/* Elementos decorativos flotantes */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: alpha(colors.secondary.main, 0.1),
                    top: '15%',
                    right: '10%',
                    zIndex: 3,
                    filter: 'blur(8px)',
                    animation: 'pulse 4s ease-in-out infinite',
                  }}
                />
                
                <Box
                  sx={{
                    position: 'absolute',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: alpha(colors.accent.electricBlue, 0.1),
                    bottom: '20%',
                    left: '15%',
                    zIndex: 3,
                    filter: 'blur(6px)',
                    animation: 'pulse 5s ease-in-out infinite',
                  }}
                />

                {/* IMAGEN PRINCIPAL CON EFECTOS */}
                <Zoom in timeout={1500}>
                  <Box
                    sx={{
                      position: 'relative',
                      zIndex: 4,
                      filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.3))',
                      animation: 'float 6s ease-in-out infinite',
                      '@keyframes float': {
                        '0%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-20px)' },
                        '100%': { transform: 'translateY(0px)' },
                      },
                      '@keyframes pulse': {
                        '0%': { opacity: 0.5, transform: 'scale(1)' },
                        '50%': { opacity: 0.8, transform: 'scale(1.1)' },
                        '100%': { opacity: 0.5, transform: 'scale(1)' },
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src="/assets/Imagen_2.png"
                      alt="Ventanilla Única"
                      sx={{
                        width: '100%',
                        maxWidth: 380,
                        height: 'auto',
                        objectFit: 'contain',
                        position: 'relative',
                        zIndex: 4,
                        borderRadius: '20px',
                      }}
                    />
                    
                    {/* Capa de brillo adicional */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '20px',
                        background: `linear-gradient(135deg, ${alpha(colors.secondary.main, 0.1)} 0%, transparent 50%, ${alpha(colors.accent.purple, 0.1)} 100%)`,
                        pointerEvents: 'none',
                        zIndex: 5,
                      }}
                    />
                  </Box>
                </Zoom>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contenido principal */}
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 }, py: 8 }}>
        {/* Estadísticas */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mb: sizes.sectionSpacing,
        }}>
          <Grid 
            container 
            spacing={3} 
            sx={{ 
              maxWidth: '1200px',
              mx: 'auto',
            }}
          >
            {estadisticas.map((stat, index) => (
              <Grid item xs={6} sm={4} md={2} key={index}>
                <Grow in timeout={1000 + index * 100}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: sizes.cardPadding,
                      bgcolor: colors.background.paper,
                      border: `1px solid ${colors.border.light}`,
                      borderRadius: sizes.borderRadius.medium,
                      textAlign: 'center',
                      transition: 'all 0.3s',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: stat.color,
                        boxShadow: `0 12px 30px -8px ${alpha(stat.color, 0.15)}`,
                      },
                    }}
                  >
                    <Avatar 
                    ref={sistemasRef}
                      sx={{ 
                        bgcolor: alpha(stat.color, 0.08), 
                        color: stat.color,
                        width: 56,
                        height: 56,
                        mb: 2,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h4" sx={{ color: colors.text.primary, fontWeight: 700, mb: 0.5, fontSize: '2rem' }}>
                      {stat.numero}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.tertiary, fontWeight: 500, fontSize: '0.85rem' }}>
                      {stat.label}
                    </Typography>
                  </Paper>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Sistemas */}
        <Typography 
          
          variant="h2" 
          sx={{ 
            fontSize: sizes.fontSize.h2,
            fontWeight: 700,
            color: colors.text.primary,
            textAlign: 'center',
            mb: 5,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -12,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 3,
              backgroundColor: colors.secondary.main,
              borderRadius: 1.5,
            },
          }}
        >
          Nuestros Sistemas
        </Typography>
        
        <Grid 
          container 
          spacing={3} 
          sx={{ 
            mb: sizes.sectionSpacing,
            pl: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {sistemas.map((sistema, index) => (
            <Grid item xs={12} sm={6} md={4} key={sistema.id}>
              <Fade in timeout={1000 + index * 200}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    bgcolor: colors.background.paper,
                    border: `1px solid ${colors.border.light}`,
                    borderRadius: sizes.borderRadius.large,
                    transition: 'all 0.3s',
                    cursor: sistema.estado === 'Activo' ? 'pointer' : 'default',
                    opacity: sistema.estado === 'Activo' ? 1 : 0.85,
                    '&:hover': {
                      transform: sistema.estado === 'Activo' ? 'translateY(-4px)' : 'none',
                      borderColor: sistema.color,
                      boxShadow: sistema.estado === 'Activo' ? `0 16px 32px -12px ${alpha(sistema.color, 0.2)}` : 'none',
                    },
                  }}
                  onClick={(e) => {
                    if (sistema.estado === 'Activo') {
                      handleMenuClick(e, sistema);
                    }
                  }}
                >
                  <CardContent sx={{ p: sizes.cardPadding }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                      ref={tramitesRef} 
                        sx={{ 
                          bgcolor: alpha(sistema.color, 0.08),
                          color: sistema.color,
                          width: 56,
                          height: 56,
                          mr: 2,
                        }}
                      >
                        {sistema.icon}
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.3rem', color: colors.text.primary }}>
                          {sistema.nombre}
                        </Typography>
                        <Chip
                          label={sistema.estado}
                          size="small"
                          sx={{
                            bgcolor: sistema.estado === 'Activo' ? alpha(colors.status.success, 0.08) : alpha(colors.status.warning, 0.08),
                            color: sistema.estado === 'Activo' ? colors.status.success : colors.status.warning,
                            fontWeight: 600,
                            height: 22,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2, fontSize: '0.9rem', lineHeight: 1.5 }}>
                      {sistema.descripcionCorta}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: colors.text.tertiary, fontSize: '0.7rem', display: 'block' }}>
                          Usuarios
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: colors.text.primary, fontSize: '1rem' }}>
                          {sistema.usuarios.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: colors.text.tertiary, fontSize: '0.7rem', display: 'block' }}>
                          Certificaciones
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: colors.text.primary, fontSize: '1rem' }}>
                          {sistema.certificaciones.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ color: sistema.color, fontWeight: 600, fontSize: '0.75rem' }}>
                      Módulo: {sistema.modulo}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Trámites */}
        <Typography
          
          variant="h2"
          sx={{
            fontSize: sizes.fontSize.h2,
            fontWeight: 700,
            color: colors.text.primary,
            textAlign: 'center',
            mb: 5,
          }}
        >
          Trámites Disponibles
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
            width: '100%',
            maxWidth: '1200px',
            mx: 'auto',
            mb: sizes.sectionSpacing,
          }}
        >
          {[...tramitesFila1, ...tramitesFila2].map((tramite, index) => (
            <Grow in timeout={1000 + index * 100} key={`tramite-${index}`}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: colors.background.paper,
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: sizes.borderRadius.medium,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  height: '80px',
                  '&:hover': {
                    bgcolor: alpha(tramite.color, 0.02),
                    borderColor: tramite.color,
                    transform: 'translateX(4px)',
                    boxShadow: `0 4px 12px ${alpha(tramite.color, 0.1)}`,
                  },
                }}
                onClick={() => handleModalOpen('tramite')}
              >
                <Avatar
                  sx={{
                    bgcolor: alpha(tramite.color, 0.08),
                    color: tramite.color,
                    width: 44,
                    height: 44,
                    mr: 1.5,
                  }}
                >
                  {tramite.icon}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.9rem', color: colors.text.primary }}>
                  {tramite.nombre}
                </Typography>
              </Paper>
            </Grow>
          ))}
        </Box>

        {/* Misión, Visión, Valores */}
        <Typography
          variant="h2"
          sx={{ 
            fontSize: sizes.fontSize.h2,
            fontWeight: 700,
            color: colors.text.primary,
            textAlign: 'center',
            mb: 5,
          }}
        >
          Nuestra Identidad
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: sizes.sectionSpacing }}>
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                titulo: 'Misión',
                descripcion: 'Proporcionar soluciones tecnológicas integrales que fortalezcan la transparencia, eficiencia y cumplimiento normativo en el sector aduanal mexicano.',
                icon: <FlagIcon />,
                color: colors.primary.main,
              },
              {
                titulo: 'Visión',
                descripcion: 'Ser el referente nacional en sistemas de gestión aduanal, reconocidos por nuestra innovación, confiabilidad y contribución al desarrollo del comercio exterior.',
                icon: <TrendingUpIcon />,
                color: colors.secondary.main,
              },
              {
                titulo: 'Valores',
                descripcion: 'Integridad, Transparencia, Innovación, Excelencia, Compromiso social, Trabajo en equipo, Mejora continua y responsabilidad profesional.',
                icon: <VerifiedIcon />,
                color: colors.accent.purple,
              },
            ].map((item, index) => (
              <Grid item key={index}>
                <Grow in timeout={1000 + index * 200}>
                  <Card
                    elevation={0}
                    sx={{
                      width: 360,
                      bgcolor: colors.background.paper,
                      border: `1px solid ${colors.border.light}`,
                      borderRadius: sizes.borderRadius.large,
                      textAlign: 'center',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: item.color,
                        boxShadow: `0 16px 32px -12px ${alpha(item.color, 0.15)}`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(item.color, 0.08),
                          color: item.color,
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          mb: 3,
                        }}
                      >
                        {item.icon}
                      </Avatar>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 600,
                          color: item.color,
                          mb: 2,
                          fontSize: '1.8rem',
                        }}
                      >
                        {item.titulo}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: colors.text.secondary,
                          lineHeight: 1.6,
                          fontSize: '0.95rem',
                        }}
                      >
                        {item.descripcion}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Políticas */}
        <Paper
          elevation={0}
          sx={{
            p: 5,
            mb: sizes.sectionSpacing,
            bgcolor: colors.primary.main,
            color: colors.white,
            borderRadius: sizes.borderRadius.xl,
            background: colors.primary.gradient,
          }}
        >
          <Typography variant="h3" sx={{ 
            fontSize: sizes.fontSize.h3,
            fontWeight: 600, 
            mb: 4, 
            textAlign: 'center',
            color: colors.white,
          }}>
            Políticas y Compromisos
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {politicasData.map((politica, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  width: '100%',
                  maxWidth: '100%',
                }}>
                  {/* Bloque principal */}
                  <Box 
                    onClick={() => handlePoliticaClick(index)}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1.5,
                      bgcolor: alpha(colors.white, 0.1),
                      p: 2,
                      borderRadius: sizes.borderRadius.medium,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(colors.secondary.main, 0.2),
                      },
                      borderBottomLeftRadius: expandedIndex === index ? 0 : sizes.borderRadius.medium,
                      borderBottomRightRadius: expandedIndex === index ? 0 : sizes.borderRadius.medium,
                      width: '100%',
                      minWidth: '280px',
                      maxWidth: '320px',
                      margin: '0 auto',
                    }}
                  >
                    <ChevronRightIcon sx={{ 
                      color: colors.secondary.main, 
                      fontSize: '1.5rem',
                      minWidth: '24px',
                      transform: expandedIndex === index ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }} />
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: colors.white, 
                        fontWeight: 500, 
                        fontSize: '1rem',
                        wordWrap: 'break-word',
                        whiteSpace: 'normal',
                      }}
                    >
                      {politica.titulo}
                    </Typography>
                  </Box>

                  {/* Contenido expandible */}
                  <Collapse in={expandedIndex === index}>
                    <Box sx={{ 
                      bgcolor: alpha(colors.secondary.main, 0.15),
                      p: 2,
                      mt: 0.2,
                      borderRadius: sizes.borderRadius.medium,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      width: '100%',
                      minWidth: '280px',
                      maxWidth: '320px',
                      margin: '0 auto',
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: alpha(colors.white, 0.9), 
                          fontSize: '0.9rem',
                          lineHeight: 1.6,
                          wordWrap: 'break-word',
                          whiteSpace: 'normal',
                        }}
                      >
                        {politica.descripcion}
                      </Typography>
                    </Box>
                  </Collapse>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Contacto */}
        <div ref={contactoRef}>
          <Paper
            elevation={0}
            sx={{
              p: 5,
              bgcolor: colors.background.paper,
              border: `1px solid ${colors.border.light}`,
              borderRadius: sizes.borderRadius.xl,
            }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="h3" sx={{ 
                  fontSize: sizes.fontSize.h3,
                  fontWeight: 600, 
                  color: colors.text.primary, 
                  mb: 2 
                }}>
                  ¿Necesitas ayuda?
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: colors.text.secondary, 
                  mb: 3, 
                  fontSize: '1rem',
                  lineHeight: 1.6,
                }}>
                  Contáctanos para recibir asesoría personalizada sobre nuestros sistemas y servicios.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button 
                    variant="contained" 
                    size="large"
                    sx={{ 
                      bgcolor: colors.primary.main,
                      px: 4,
                      py: 1.5,
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      borderRadius: sizes.borderRadius.medium,
                      boxShadow: 'none',
                      '&:hover': { 
                        bgcolor: colors.primary.medium,
                        boxShadow: `0 8px 16px ${alpha(colors.primary.main, 0.15)}`,
                      },
                    }}
                    onClick={() => handleModalOpen('contacto')}
                  >
                    Contactar ahora
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    sx={{ 
                      borderColor: colors.secondary.main,
                      color: colors.secondary.main,
                      px: 4,
                      py: 1.5,
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      borderRadius: sizes.borderRadius.medium,
                      borderWidth: 1.5,
                      '&:hover': { 
                        borderColor: colors.secondary.dark,
                        bgcolor: alpha(colors.secondary.main, 0.02),
                      },
                    }}
                    onClick={() => handleModalOpen('ayuda')}
                  >
                    Centro de ayuda
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: colors.text.primary, fontWeight: 600, mb: 3, fontSize: '1.2rem' }}>
                    Síguenos en redes
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    {[
                      { icon: <FacebookIcon />, color: '#1877F2' },
                      { icon: <TwitterIcon />, color: '#1DA1F2' },
                      { icon: <LinkedInIcon />, color: '#0A66C2' },
                      { icon: <InstagramIcon />, color: '#E4405F' },
                    ].map((social, index) => (
                      <IconButton
                        key={index}
                        aria-label={social.label}
                        sx={{
                          bgcolor: alpha(social.color, 0.05),
                          color: social.color,
                          width: 48,
                          height: 48,
                          transition: 'all 0.3s',
                          '&:hover': {
                            bgcolor: social.color,
                            color: colors.white,
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    ))}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </Container>

      {/* Footer */}
      <Box sx={{ 
        bgcolor: colors.background.dark, 
        borderTop: `3px solid ${colors.secondary.main}`,
        py: 5,
        mt: 4,
      }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.white, mb: 2 }}>
                Sistema Integral Aduanal
              </Typography>
              <Typography variant="body1" sx={{ color: alpha(colors.white, 0.7), lineHeight: 1.7 }}>
                Transformando la gestión aduanal a través de la tecnología y la innovación.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: colors.white, mb: 2 }}>
                Enlaces rápidos
              </Typography>
              <Stack spacing={1.5}>
                {['Términos y condiciones', 'Aviso de privacidad', 'Política de cookies'].map((item, idx) => (
                  <Button
                    key={item}
                    color="inherit"
                    sx={{
                      justifyContent: 'flex-start',
                      p: 0,
                      color: alpha(colors.white, 0.7),
                      fontSize: '0.95rem',
                      textTransform: 'none',
                      '&:hover': { 
                        color: colors.white,
                      },
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: colors.white, mb: 2 }}>
                Contacto
              </Typography>
              <Stack spacing={1.5}>
                <Typography variant="body1" sx={{ color: alpha(colors.white, 0.7) }}>
                  contacto@sistemas-aduanales.mx
                </Typography>
                <Typography variant="body1" sx={{ color: alpha(colors.white, 0.7) }}>
                  (55) 1234-5678
                </Typography>
                <Typography variant="body1" sx={{ color: alpha(colors.white, 0.7) }}>
                  Cd. de México, México
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, borderColor: alpha(colors.white, 0.1) }} />
          <Typography variant="body1" align="center" sx={{ color: alpha(colors.white, 0.6) }}>
            © {new Date().getFullYear()} Sistema Integral Aduanal. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>

      {/* Modales */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          bgcolor: colors.background.paper,
          boxShadow: `0 24px 48px -12px ${alpha(colors.primary.main, 0.25)}`,
          p: 4,
          borderRadius: sizes.borderRadius.large,
        }}>
          <Typography variant="h4" sx={{ 
            color: colors.primary.main, 
            fontWeight: 600, 
            mb: 3,
            fontSize: '1.5rem',
          }}>
            {modalTipo === 'contacto' ? 'Contacto' : 'Centro de ayuda'}
          </Typography>
          {modalTipo === 'contacto' ? (
            <form>
              <TextField 
                fullWidth 
                label="Nombre" 
                margin="normal" 
                variant="outlined"
                size="small"
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: sizes.borderRadius.small,
                  },
                }}
              />
              <TextField 
                fullWidth 
                label="Correo electrónico" 
                margin="normal" 
                variant="outlined" 
                type="email"
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: sizes.borderRadius.small } }}
              />
              <TextField 
                fullWidth 
                label="Teléfono" 
                margin="normal" 
                variant="outlined"
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: sizes.borderRadius.small } }}
              />
              <TextField 
                fullWidth 
                label="Mensaje" 
                margin="normal" 
                variant="outlined" 
                multiline 
                rows={3}
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: sizes.borderRadius.small } }}
              />
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ 
                  mt: 3, 
                  bgcolor: colors.primary.main,
                  py: 1.2,
                  borderRadius: sizes.borderRadius.medium,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: colors.primary.medium },
                }}
              >
                Enviar mensaje
              </Button>
            </form>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ color: colors.text.secondary, mb: 3, fontSize: '1rem' }}>
                ¿En qué podemos ayudarte? Selecciona una opción:
              </Typography>
              <List>
                {['Preguntas frecuentes', 'Tutoriales', 'Soporte técnico', 'Documentación'].map((item, idx) => {
                  const colors_list = [colors.primary.main, colors.accent.electricBlue, colors.secondary.main, colors.accent.purple];
                  return (
                    <ListItem 
                      button 
                      key={item}
                      sx={{ 
                        borderRadius: sizes.borderRadius.small,
                        mb: 1,
                        py: 1,
                        '&:hover': { 
                          bgcolor: alpha(colors_list[idx % colors_list.length], 0.04),
                        },
                      }}
                    >
                      <ListItemText 
                        primary={item} 
                        primaryTypographyProps={{ fontWeight: 500, fontSize: '0.95rem', color: colors.text.primary }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          )}
        </Box>
      </Modal>

      {/* Menú contextual del sistema */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: sizes.borderRadius.medium,
            minWidth: 220,
            bgcolor: colors.background.paper,
            boxShadow: `0 8px 24px ${alpha(colors.primary.main, 0.12)}`,
            border: `1px solid ${colors.border.light}`,
          },
        }}
      >
        <MenuItem onClick={handleAccederSistema} sx={{ py: 1.2, '&:hover': { bgcolor: alpha(colors.primary.main, 0.04) } }}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" sx={{ color: colors.primary.main }} />
          </ListItemIcon>
          <ListItemText primary="Acceder al sistema" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500, color: colors.text.primary }} />
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.2, '&:hover': { bgcolor: alpha(colors.accent.electricBlue, 0.04) } }}>
          <ListItemIcon>
            <DescriptionIcon fontSize="small" sx={{ color: colors.accent.electricBlue }} />
          </ListItemIcon>
          <ListItemText primary="Ver documentación" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500, color: colors.text.primary }} />
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.2, '&:hover': { bgcolor: alpha(colors.secondary.main, 0.04) } }}>
          <ListItemIcon>
            <HelpIcon fontSize="small" sx={{ color: colors.secondary.main }} />
          </ListItemIcon>
          <ListItemText primary="Ayuda del sistema" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500, color: colors.text.primary }} />
        </MenuItem>
        <Divider sx={{ borderColor: colors.border.light }} />
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.2, '&:hover': { bgcolor: alpha(colors.accent.purple, 0.04) } }}>
          <ListItemIcon>
            <InfoIcon fontSize="small" sx={{ color: colors.accent.purple }} />
          </ListItemIcon>
          <ListItemText primary={`Acerca de ${selectedSistema?.nombre || 'VUGAA'}`} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500, color: colors.text.primary }} />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Inicio;