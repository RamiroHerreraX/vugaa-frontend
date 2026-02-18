import React, { useState } from 'react';
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
  TrendingUp as TrendingUpIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';

// Paleta de colores - Mayor uso de los colores proporcionados
const colors = {
  primary: '#396ED6',
  secondary: '#3462BF',
  tertiary: '#4465A6',
  accent: '#638DDA',
  white: '#FFFFFF',
  background: '#F0F4FA',
  textPrimary: '#1A2A3A',
  textSecondary: '#4A5A6A',
  success: '#34A853',
  warning: '#FBBC04',
  error: '#EA4335',
  overlay: 'rgba(57, 110, 214, 0.08)',
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
    h1: { xs: '2.5rem', md: '4rem' },
    h2: { xs: '2rem', md: '2.75rem' },
    h3: { xs: '1.5rem', md: '2rem' },
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
    color: colors.primary,
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
    color: colors.accent,
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
    color: colors.accent,
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
    color: colors.tertiary,
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
    color: colors.accent,
    ruta: '/siaud',
    modulo: 'Auditoría',
    estado: 'Activo',
    usuarios: 500,
    certificaciones: 50,
  },
];

// Trámites disponibles - Divididos en dos filas de 4
const tramitesFila1 = [
  { nombre: 'Validación de documentos', icon: <DescriptionIcon />, color: colors.primary },
  { nombre: 'Certificaciones profesionales', icon: <SchoolIcon />, color: colors.accent },
  { nombre: 'Registro de expedientes', icon: <AssignmentIcon />, color: colors.secondary },
  { nombre: 'Consultas de cumplimiento', icon: <VerifiedIcon />, color: colors.tertiary },
];

const tramitesFila2 = [
  { nombre: 'Auditorías programadas', icon: <AssessmentIcon />, color: colors.primary },
  { nombre: 'Reportes estadísticos', icon: <TimelineIcon />, color: colors.accent },
  { nombre: 'Operaciones aduanales', icon: <LocalShippingIcon />, color: colors.secondary },
  { nombre: 'Gestión de patentes', icon: <WarehouseIcon />, color: colors.tertiary },
];

// Estadísticas
const estadisticas = [
  { numero: '2,850+', label: 'Usuarios Activos', icon: <GroupsIcon />, color: colors.primary },
  { numero: '6', label: 'Sistemas', icon: <DashboardIcon />, color: colors.accent },
  { numero: '15.2K', label: 'Trámites', icon: <AssignmentIcon />, color: colors.secondary },
  { numero: '98%', label: 'Satisfacción', icon: <StarIcon />, color: colors.tertiary },
  { numero: '24/7', label: 'Soporte', icon: <ShieldIcon />, color: colors.primary },
  { numero: '32', label: 'Regiones', icon: <TimelineIcon />, color: colors.accent },
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

  const drawer = (
    <Box sx={{ 
      width: 300, 
      bgcolor: colors.white, 
      height: '100%',
      background: `linear-gradient(180deg, ${colors.white} 0%, ${colors.background} 100%)`,
    }}>
      <Toolbar sx={{ 
        bgcolor: colors.primary, 
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
          { text: 'Inicio', icon: <DashboardIcon /> },
          { text: 'Servicios', icon: <SecurityIcon /> },
          { text: 'Ayuda', icon: <HelpIcon /> },
          { text: 'Contacto', icon: <ContactIcon /> },
        ].map((item) => (
          <ListItem 
            button 
            key={item.text} 
            sx={{ 
              px: 3, 
              py: 1.5,
              '&:hover': { 
                bgcolor: alpha(colors.primary, 0.08),
                '& .MuiListItemIcon-root': { color: colors.primary },
              },
            }}
          >
            <ListItemIcon sx={{ color: colors.textSecondary, minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ fontWeight: 500 }} 
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 3 }}>
        <Typography variant="subtitle2" sx={{ color: colors.textSecondary, mb: 2, fontWeight: 600 }}>
          Accesos Rápidos
        </Typography>
        {['T-MEC', 'CONSULT', 'CAAAREM'].map((item) => (
          <Button
            key={item}
            fullWidth
            variant="contained"
            sx={{
              mb: 1.5,
              bgcolor: colors.overlay,
              color: colors.primary,
              justifyContent: 'flex-start',
              fontWeight: 600,
              '&:hover': { 
                bgcolor: colors.primary,
                color: colors.white,
              },
            }}
          >
            {item}
          </Button>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      bgcolor: colors.background, 
      minHeight: '100vh',
      width: '100%',
    }}>
      {/* Barra de navegación superior */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: colors.white, 
          color: colors.textPrimary,
          borderBottom: `1px solid ${alpha(colors.primary, 0.12)}`,
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
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 800, 
                  color: colors.primary,
                  letterSpacing: '-0.5px',
                  mr: 6,
                  fontSize: '1.5rem',
                }}
              >
                SIA
              </Typography>

              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
                {['Inicio',  'Servicios', 'Ayuda', 'Contacto'].map((item) => (
                  <Button
                    key={item}
                    color="inherit"
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      '&:hover': { 
                        color: colors.primary,
                        bgcolor: alpha(colors.primary, 0.04),
                      },
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 2, mr: 2 }}>
                {['T-MEC', 'CONSULT', 'CAAAREM'].map((logo) => (
                  <Chip
                    key={logo}
                    label={logo}
                    sx={{ 
                      bgcolor: alpha(colors.primary, 0.08),
                      color: colors.primary,
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      height: 32,
                      '&:hover': { bgcolor: colors.primary, color: colors.white },
                    }}
                  />
                ))}
              </Box>

              <IconButton sx={{ color: colors.textSecondary }}>
                <NotificationsIcon />
              </IconButton>

              <IconButton 
                onClick={handleUserMenuOpen} 
                sx={{ 
                  color: colors.textSecondary,
                  bgcolor: alpha(colors.primary, 0.08),
                  '&:hover': { bgcolor: alpha(colors.primary, 0.15) },
                }}
              >
                <AccountCircleIcon />
              </IconButton>

              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                sx={{ 
                  bgcolor: colors.primary,
                  px: 3,
                  height: 44,
                  fontWeight: 600,
                  '&:hover': { bgcolor: colors.secondary },
                  display: { xs: 'none', md: 'flex' },
                }}
              >
                Acceder
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Menú de usuario */}
      <Menu
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{ sx: { borderRadius: sizes.borderRadius.medium, minWidth: 200 } }}
      >
        <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.5 }}>Mi Perfil</MenuItem>
        <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.5 }}>Configuración</MenuItem>
        <Divider />
        <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.5 }}>Cerrar Sesión</MenuItem>
      </Menu>

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

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: colors.white,
          borderBottom: `1px solid ${alpha(colors.primary, 0.12)}`,
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Zoom in timeout={1000}>
                <Box>
                  <Chip
                    label="Plataforma Oficial del Sector Aduanal"
                    sx={{ 
                      bgcolor: alpha(colors.primary, 0.1),
                      color: colors.primary,
                      fontWeight: 600,
                      mb: 3,
                      height: 32,
                      fontSize: '0.9rem',
                    }}
                  />
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontSize: sizes.fontSize.h1,
                      fontWeight: 800,
                      lineHeight: 1.1,
                      mb: 2,
                      color: colors.textPrimary,
                    }}
                  >
                    Sistema Integral
                    <Box component="span" sx={{ color: colors.primary, display: 'block' }}>
                      Aduanal
                    </Box>
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: colors.textSecondary,
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
                      sx={{ 
                        bgcolor: colors.primary,
                        px: 5,
                        py: 1.8,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: sizes.borderRadius.medium,
                        '&:hover': { bgcolor: colors.secondary },
                      }}
                    >
                      Explorar Sistemas
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="large"
                      sx={{ 
                        borderColor: colors.primary,
                        color: colors.primary,
                        px: 5,
                        py: 1.8,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: sizes.borderRadius.medium,
                        borderWidth: 2,
                        '&:hover': { 
                          borderColor: colors.secondary,
                          bgcolor: alpha(colors.primary, 0.04),
                        },
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
                position: 'relative',
              }}>
                <Box
                  sx={{
                    width: 500,
                    height: 500,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(colors.primary, 0.08)} 0%, ${alpha(colors.accent, 0.02)} 100%)`,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 0,
                  }}
                />
                <Stack spacing={3} sx={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 350 }}>
                  {['T-MEC', 'CONSULT', 'CAAAREM'].map((logo, index) => (
                    <Zoom in timeout={1500 + index * 200} key={logo}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          bgcolor: colors.white,
                          border: `1px solid ${alpha(colors.primary, 0.15)}`,
                          borderRadius: sizes.borderRadius.large,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s',
                          '&:hover': {
                            borderColor: colors.primary,
                            boxShadow: `0 8px 24px ${alpha(colors.primary, 0.2)}`,
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                          {logo}
                        </Typography>
                      </Paper>
                    </Zoom>
                  ))}
                </Stack>
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
                      bgcolor: colors.white,
                      border: `1px solid ${alpha(colors.primary, 0.1)}`,
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
                        boxShadow: `0 12px 30px -8px ${alpha(stat.color, 0.3)}`,
                        borderColor: stat.color,
                      },
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(stat.color, 0.1), 
                        color: stat.color,
                        width: 56,
                        height: 56,
                        mb: 2,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h4" sx={{ color: stat.color, fontWeight: 800, mb: 0.5, fontSize: '2rem' }}>
                      {stat.numero}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary, fontWeight: 500, fontSize: '0.9rem' }}>
                      {stat.label}
                    </Typography>
                  </Paper>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Sistemas */}
        <Typography variant="h2" sx={{ 
          fontSize: sizes.fontSize.h2,
          fontWeight: 800,
          color: colors.textPrimary,
          textAlign: 'center',
          mb: 5,
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -16,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 100,
            height: 4,
            backgroundColor: colors.primary,
            borderRadius: 2,
          },
        }}>
          Nuestros Sistemas
        </Typography>
        <Grid container spacing={3} sx={{ mb: sizes.sectionSpacing }}>
          {sistemas.map((sistema, index) => (
            <Grid item xs={12} sm={6} md={4} key={sistema.id}>
              <Fade in timeout={1000 + index * 200}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    border: `1px solid ${alpha(colors.primary, 0.1)}`,
                    borderRadius: sizes.borderRadius.large,
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    bgcolor: colors.white,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px -12px ${alpha(sistema.color, 0.4)}`,
                      borderColor: sistema.color,
                    },
                  }}
                  onClick={(e) => handleMenuClick(e, sistema)}
                >
                  <CardContent sx={{ p: sizes.cardPadding }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: alpha(sistema.color, 0.1),
                          color: sistema.color,
                          width: 56,
                          height: 56,
                          mr: 2,
                        }}
                      >
                        {sistema.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.4rem' }}>
                          {sistema.nombre}
                        </Typography>
                        <Chip
                          label={sistema.estado}
                          size="small"
                          sx={{
                            bgcolor: sistema.estado === 'Activo' ? alpha(colors.success, 0.1) :
                                    sistema.estado === 'Beta' ? alpha(colors.warning, 0.1) :
                                    alpha(colors.error, 0.1),
                            color: sistema.estado === 'Activo' ? colors.success :
                                   sistema.estado === 'Beta' ? colors.warning :
                                   colors.error,
                            fontWeight: 600,
                            height: 24,
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2, fontSize: '0.95rem' }}>
                      {sistema.descripcionCorta}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: colors.textSecondary, fontSize: '0.8rem' }}>
                          Usuarios
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: colors.textPrimary, fontSize: '1.1rem' }}>
                          {sistema.usuarios.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: colors.textSecondary, fontSize: '0.8rem' }}>
                          Certificaciones
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: colors.textPrimary, fontSize: '1.1rem' }}>
                          {sistema.certificaciones.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ color: sistema.color, fontWeight: 600, fontSize: '0.85rem' }}>
                      Módulo: {sistema.modulo}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

{/* Trámites - Dos filas de 4 columnas */}
<Typography
  variant="h2"
  sx={{
    fontSize: sizes.fontSize.h2,
    fontWeight: 800,
    color: colors.textPrimary,
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
      sm: 'repeat(2, minmax(240px, 1fr))',
      md: 'repeat(4, minmax(240px, 1fr))',
    },
    columnGap: 7,
    rowGap: 3,
    width:'100%',
    maxWidth: '1200px',
    
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
          bgcolor: colors.white,
          border: `1px solid ${alpha(tramite.color, 0.2)}`,
          borderRadius: sizes.borderRadius.medium,
          cursor: 'pointer',
          transition: 'all 0.2s',
          height: '85px',
          width: '100%',
          '&:hover': {
            bgcolor: tramite.color,
            borderColor: tramite.color,
            transform: 'translateX(4px)',
            '& .MuiTypography-root': { color: colors.white },
            '& .MuiAvatar-root': { bgcolor: colors.white, color: tramite.color },
          },
        }}
        onClick={() => handleModalOpen('tramite')}
      >
        <Avatar
          sx={{
            bgcolor: alpha(tramite.color, 0.1),
            color: tramite.color,
            width: 44,
            height: 44,
            mr: 1.5,
            transition: 'all 0.2s',
          }}
        >
          {tramite.icon}
        </Avatar>

        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
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
    fontWeight: 800,
    color: colors.textPrimary,
    textAlign: 'center',
    mb: 5,
  }}
>
  Nuestra Identidad
</Typography>

<Box sx={{ display: 'flex', justifyContent: 'center', mb: sizes.sectionSpacing }}>
  <Grid
    container
    spacing={4}
    justifyContent="center"
  >

    {[
      {
        titulo: 'Misión',
        descripcion:
          'Proporcionar soluciones tecnológicas integrales que fortalezcan la transparencia, eficiencia y cumplimiento normativo en el sector aduanal mexicano.',
        icon: <FlagIcon />,
        color: colors.primary,
      },
      {
        titulo: 'Visión',
        descripcion:
          'Ser el referente nacional en sistemas de gestión aduanal, reconocidos por nuestra innovación, confiabilidad y contribución al desarrollo del comercio exterior.',
        icon: <TrendingUpIcon />,
        color: colors.accent,
      },
      {
        titulo: 'Valores',
        descripcion:
          'Integridad, Transparencia, Innovación, Excelencia, Compromiso social, Trabajo en equipo, Mejora continua y responsabilidad profesional.',
        icon: <VerifiedIcon />,
        color: colors.secondary,
      },
    ].map((item, index) => (
      <Grid item key={index}>

        <Grow in timeout={1000 + index * 200}>
          <Card
            elevation={0}
            sx={{
              width: 380,              // 👈 ANCHO FIJO PARA TODOS
              bgcolor: colors.white,
              border: `1px solid ${alpha(item.color, 0.2)}`,
              borderRadius: sizes.borderRadius.large,
              textAlign: 'center',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 20px 40px -8px ${alpha(item.color, 0.3)}`,
                borderColor: item.color,
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>

              <Avatar
                sx={{
                  bgcolor: alpha(item.color, 0.1),
                  color: item.color,
                  width: 90,
                  height: 90,
                  mx: 'auto',
                  mb: 3,
                }}
              >
                {item.icon}
              </Avatar>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: item.color,
                  mb: 2,
                  fontSize: '2rem',
                }}
              >
                {item.titulo}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: colors.textSecondary,
                  lineHeight: 1.7,
                  fontSize: '1rem',
                  textAlign: 'center',
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
            bgcolor: colors.primary,
            color: colors.white,
            borderRadius: sizes.borderRadius.xl,
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 100%)`,
          }}
        >
          <Typography variant="h3" sx={{ 
            fontSize: sizes.fontSize.h3,
            fontWeight: 700, 
            mb: 4, 
            textAlign: 'center' 
          }}>
            Políticas y Compromisos
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {[
              'Protección de datos personales',
              'Confidencialidad de la información',
              'Transparencia en procesos',
              'Mejora continua',
              'Cumplimiento normativo',
              'Ética profesional',
            ].map((politica, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  bgcolor: alpha(colors.white, 0.1),
                  p: 2,
                  borderRadius: sizes.borderRadius.medium,
                  backdropFilter: 'blur(10px)',
                }}>
                  <ChevronRightIcon sx={{ color: colors.white, fontSize: '1.5rem' }} />
                  <Typography variant="body1" sx={{ color: colors.white, fontWeight: 500, fontSize: '1rem' }}>
                    {politica}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Contacto */}
        <Paper
          elevation={0}
          sx={{
            p: 5,
            bgcolor: colors.white,
            border: `1px solid ${alpha(colors.primary, 0.15)}`,
            borderRadius: sizes.borderRadius.xl,
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h3" sx={{ 
                fontSize: sizes.fontSize.h3,
                fontWeight: 700, 
                color: colors.textPrimary, 
                mb: 2 
              }}>
                ¿Necesitas ayuda?
              </Typography>
              <Typography variant="body1" sx={{ 
                color: colors.textSecondary, 
                mb: 3, 
                fontSize: '1.1rem',
                lineHeight: 1.6,
              }}>
                Contáctanos para recibir asesoría personalizada sobre nuestros sistemas y servicios.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    bgcolor: colors.primary,
                    px: 5,
                    py: 1.8,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: sizes.borderRadius.medium,
                    '&:hover': { bgcolor: colors.secondary },
                  }}
                  onClick={() => handleModalOpen('contacto')}
                >
                  Contactar ahora
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  sx={{ 
                    borderColor: colors.primary,
                    color: colors.primary,
                    px: 5,
                    py: 1.8,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: sizes.borderRadius.medium,
                    borderWidth: 2,
                    '&:hover': { 
                      borderColor: colors.secondary,
                      bgcolor: alpha(colors.primary, 0.04),
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
                <Typography variant="h5" sx={{ color: colors.textPrimary, fontWeight: 600, mb: 3 }}>
                  Síguenos en redes
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  {[
                    { icon: <FacebookIcon />, color: '#1877F2', label: 'Facebook' },
                    { icon: <TwitterIcon />, color: '#1DA1F2', label: 'Twitter' },
                    { icon: <LinkedInIcon />, color: '#0A66C2', label: 'LinkedIn' },
                    { icon: <InstagramIcon />, color: '#E4405F', label: 'Instagram' },
                  ].map((social, index) => (
                    <IconButton
                      key={index}
                      aria-label={social.label}
                      sx={{
                        bgcolor: alpha(social.color, 0.1),
                        color: social.color,
                        width: 56,
                        height: 56,
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
      </Container>

      {/* Footer */}
      <Box sx={{ 
        bgcolor: colors.white, 
        borderTop: `3px solid ${colors.primary}`,
        py: 5,
        mt: 4,
      }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary, mb: 2 }}>
                Sistema Integral Aduanal
              </Typography>
              <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.7 }}>
                Transformando la gestión aduanal a través de la tecnología y la innovación.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: colors.textPrimary, mb: 2 }}>
                Enlaces rápidos
              </Typography>
              <Stack spacing={1.5}>
                {['Términos y condiciones', 'Aviso de privacidad', 'Política de cookies'].map((item) => (
                  <Button
                    key={item}
                    color="inherit"
                    sx={{
                      justifyContent: 'flex-start',
                      p: 0,
                      color: colors.textSecondary,
                      fontSize: '0.95rem',
                      '&:hover': { color: colors.primary },
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: colors.textPrimary, mb: 2 }}>
                Contacto
              </Typography>
              <Stack spacing={1.5}>
                <Typography variant="body1" sx={{ color: colors.textSecondary }}>
                  contacto@sistemas-aduanales.mx
                </Typography>
                <Typography variant="body1" sx={{ color: colors.textSecondary }}>
                  (55) 1234-5678
                </Typography>
                <Typography variant="body1" sx={{ color: colors.textSecondary }}>
                  Cd. de México, México
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, borderColor: alpha(colors.primary, 0.2) }} />
          <Typography variant="body1" align="center" sx={{ color: colors.textSecondary }}>
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
          width: { xs: '90%', sm: 550 },
          bgcolor: colors.white,
          boxShadow: 24,
          p: 4,
          borderRadius: sizes.borderRadius.large,
        }}>
          <Typography variant="h4" sx={{ 
            color: colors.primary, 
            fontWeight: 700, 
            mb: 3,
            fontSize: '1.8rem',
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
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: sizes.borderRadius.medium,
                  } 
                }}
              />
              <TextField 
                fullWidth 
                label="Correo electrónico" 
                margin="normal" 
                variant="outlined" 
                type="email"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: sizes.borderRadius.medium } }}
              />
              <TextField 
                fullWidth 
                label="Teléfono" 
                margin="normal" 
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: sizes.borderRadius.medium } }}
              />
              <TextField 
                fullWidth 
                label="Mensaje" 
                margin="normal" 
                variant="outlined" 
                multiline 
                rows={4}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: sizes.borderRadius.medium } }}
              />
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ 
                  mt: 3, 
                  bgcolor: colors.primary,
                  py: 1.8,
                  borderRadius: sizes.borderRadius.medium,
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': { bgcolor: colors.secondary },
                }}
              >
                Enviar mensaje
              </Button>
            </form>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 3, fontSize: '1.1rem' }}>
                ¿En qué podemos ayudarte? Selecciona una opción:
              </Typography>
              <List>
                {['Preguntas frecuentes', 'Tutoriales', 'Soporte técnico', 'Documentación'].map((item) => (
                  <ListItem 
                    button 
                    key={item}
                    sx={{ 
                      borderRadius: sizes.borderRadius.medium,
                      mb: 1,
                      py: 1.5,
                      '&:hover': { bgcolor: alpha(colors.primary, 0.08) },
                    }}
                  >
                    <ListItemText 
                      primary={item} 
                      primaryTypographyProps={{ fontWeight: 500, fontSize: '1rem' }}
                    />
                  </ListItem>
                ))}
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
            minWidth: 240,
            boxShadow: `0 12px 32px ${alpha(colors.textPrimary, 0.2)}`,
          },
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" sx={{ color: colors.primary }} />
          </ListItemIcon>
          <ListItemText primary="Acceder al sistema" primaryTypographyProps={{ fontSize: '0.95rem' }} />
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <DescriptionIcon fontSize="small" sx={{ color: colors.accent }} />
          </ListItemIcon>
          <ListItemText primary="Ver documentación" primaryTypographyProps={{ fontSize: '0.95rem' }} />
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <HelpIcon fontSize="small" sx={{ color: colors.secondary }} />
          </ListItemIcon>
          <ListItemText primary="Ayuda del sistema" primaryTypographyProps={{ fontSize: '0.95rem' }} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <InfoIcon fontSize="small" sx={{ color: colors.tertiary }} />
          </ListItemIcon>
          <ListItemText primary={`Acerca de ${selectedSistema?.nombre}`} primaryTypographyProps={{ fontSize: '0.95rem' }} />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Inicio;