// src/pages/committee/CommitteeProfile.jsx
import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  IconButton,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Alert,
  LinearProgress,
  Tooltip,
  Badge,
  InputAdornment,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Stepper,
  Step,
  StepLabel,
  MenuItem
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Place as PlaceIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  VpnKey as VpnKeyIcon,
  History as HistoryIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Verified as VerifiedIcon,
  CalendarToday as CalendarTodayIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Speed as SpeedIcon,
  AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Lock as LockIcon,
  Description as DescriptionIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Gavel as GavelIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Paleta de colores corporativa CAAAREM (versión clara)
const colors = {
  primary: {
    dark: '#0D2A4D',
    main: '#133B6B',
    light: '#3A6EA5'
  },
  secondary: {
    main: '#00A8A8',
    light: '#00C2D1',
    lighter: '#35D0FF'
  },
  accents: {
    blue: '#0099FF',
    purple: '#6C5CE7'
  },
  status: {
    warning: '#00C2D1',      // Advertencias en cyan
    error: '#0099FF',         // Errores en azul eléctrico
    info: '#3A6EA5',          // Información en azul claro
    success: '#00A8A8',       // Éxito en verde/teal
    purple: '#6C5CE7'         // Púrpura para énfasis
  },
  text: {
    primary: '#0D2A4D',
    secondary: '#3A6EA5',
    light: '#6C5CE7'
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    subtle: '#f5f7fa'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #0D2A4D, #3A6EA5)',
    secondary: 'linear-gradient(135deg, #00A8A8, #00C2D1)',
  }
};

const CommitteeProfile = () => {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [expandedSections, setExpandedSections] = useState({
    stats: true,
    recent: false,
    achievements: false
  });

  const [formData, setFormData] = useState({
    name: user?.name || 'María González',
    email: user?.email || 'maria.gonzalez@ejemplo.com',
    phone: '+52 55 9876 5432',
    region: user?.region || 'Centro',
    role: 'Miembro Senior del Comité',
    specialization: 'Cumplimiento Normativo y Auditoría',
    experience: '5 años',
    joinDate: '15/03/2021',
    badge: 'Nivel Avanzado',
    status: 'Activo',
    bio: 'Especialista en cumplimiento normativo con enfoque en regulaciones aduaneras y fiscales. Experiencia en validación de certificaciones complejas.',
    notifications: {
      vencimientos: true,
      rechazos: true,
      observaciones: true,
      asignaciones: true,
      aprobaciones: true,
      cambiosEstado: true,
      email: true,
      push: true,
      resumenDiario: false,
      resumenSemanal: true
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSectionToggle = (section) => () => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleNotificationChange = (key) => (event) => {
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [key]: event.target.checked
      }
    });
  };

  const handleSave = () => {
    updateUser(formData);
    setEditMode(false);
  };

  const handlePasswordChange = () => {
    // Lógica para cambiar contraseña
    console.log('Cambiar contraseña:', passwordData);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  // Estadísticas enriquecidas
  const stats = {
    reviewsThisMonth: { current: 15, target: 20, trend: '+2' },
    reviewsTotal: 245,
    approvalRate: { value: 92, trend: '+1.5%' },
    avgResponseTime: { value: '2.3 días', trend: '-0.4 días' },
    pendingReviews: 3,
    efficiency: 88,
    accuracy: 94,
    recentActivity: [
      { date: 'Hoy', actions: 8 },
      { date: 'Ayer', actions: 12 },
      { date: 'Esta semana', actions: 45 }
    ]
  };

  // Logros y reconocimientos
  const achievements = [
    { id: 1, title: 'Revisor del Mes', date: 'Enero 2026', icon: <StarIcon />, color: colors.status.warning },
    { id: 2, title: '100 Certificaciones', date: 'Diciembre 2025', icon: <CheckCircleIcon />, color: colors.status.success },
    { id: 3, title: 'Alta Eficiencia', date: 'Noviembre 2025', icon: <SpeedIcon />, color: colors.accents.blue },
    { id: 4, title: 'Especialista Fiscal', date: 'Octubre 2025', icon: <VerifiedIcon />, color: colors.accents.purple },
  ];

  // Historial de actividad mejorado
  const activityHistory = [
    { 
      id: 1, 
      date: '15/01/2026 14:30', 
      action: 'Certificación APROBADA', 
      details: 'PATENTE ADUANAL - PA-2026-00145', 
      type: 'success',
      time: '2.1 horas',
      user: 'María González'
    },
    { 
      id: 2, 
      date: '15/01/2026 11:15', 
      action: 'Cambio de configuración', 
      details: 'Actualizadas preferencias de notificación', 
      type: 'info',
      time: '5.3 horas',
      user: 'María González'
    },
    { 
      id: 3, 
      date: '14/01/2026 16:45', 
      action: 'Certificación RECHAZADA', 
      details: 'OPINIÓN SAT - OS-2025-03421', 
      type: 'error',
      time: '1 día',
      user: 'María González'
    },
    { 
      id: 4, 
      date: '14/01/2026 09:30', 
      action: 'Inicio de sesión', 
      details: 'Desde dispositivo nuevo - Chrome, Windows', 
      type: 'warning',
      time: '1 día',
      user: 'Sistema'
    },
    { 
      id: 5, 
      date: '13/01/2026 15:20', 
      action: 'Revisión completada', 
      details: 'CÉDULA PROFESIONAL - CP-2024-56789', 
      type: 'success',
      time: '2 días',
      user: 'María González'
    },
  ];

  const getActivityColor = (type) => {
    switch(type) {
      case 'success': return colors.status.success;
      case 'error': return colors.status.error;
      case 'warning': return colors.status.warning;
      case 'info': return colors.status.info;
      default: return colors.text.secondary;
    }
  };

  return (
    <Box sx={{ 
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      bgcolor: colors.background.subtle
    }}>
      {/* Header Compacto */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: colors.primary.dark, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountCircleIcon sx={{ color: colors.primary.main }} />
              Mi Perfil - Comité de Cumplimiento
            </Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Gestiona tu información personal, seguridad y preferencias del sistema
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              sx={{
                borderColor: colors.primary.light,
                color: colors.primary.main,
                '&:hover': {
                  borderColor: colors.primary.main,
                  bgcolor: 'rgba(19, 59, 107, 0.04)',
                }
              }}
            >
              Exportar Datos
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={editMode ? <SaveIcon /> : <EditIcon />}
              onClick={editMode ? handleSave : () => setEditMode(true)}
              sx={{
                bgcolor: editMode ? colors.status.success : colors.primary.main,
                '&:hover': {
                  bgcolor: editMode ? colors.secondary.main : colors.primary.dark,
                }
              }}
            >
              {editMode ? 'Guardar' : 'Editar'}
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Contenido Principal */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          {/* Columna Izquierda - 35% */}
          <Grid item xs={12} lg={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Tarjeta de Perfil Mejorada */}
            <Paper elevation={1} sx={{ 
              p: 2.5, 
              mb: 2, 
              flex: 1,
              border: `1px solid ${colors.primary.light}20`,
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Avatar 
                      sx={{ 
                        width: 28, 
                        height: 28, 
                        bgcolor: colors.primary.main,
                        border: '2px solid white'
                      }}
                    >
                      <VerifiedIcon fontSize="small" sx={{ color: 'white' }} />
                    </Avatar>
                  }
                >
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: colors.primary.main,
                      fontSize: '2.2rem',
                      fontWeight: 'bold',
                      mb: 2,
                      boxShadow: 3
                    }}
                  >
                    {formData.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                </Badge>
                
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.primary.dark, mb: 0.5, textAlign: 'center' }}>
                  {formData.name}
                </Typography>
                
                <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                  <Chip 
                    label={formData.role}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(19, 59, 107, 0.08)',
                      color: colors.primary.main,
                      fontWeight: 600
                    }}
                    icon={<PersonIcon sx={{ color: colors.primary.main }} />}
                  />
                  <Chip 
                    label={formData.badge}
                    size="small"
                    variant="outlined"
                    sx={{
                      color: colors.status.success,
                      borderColor: colors.status.success,
                      fontWeight: 600
                    }}
                    icon={<StarIcon sx={{ color: colors.status.success }} />}
                  />
                </Stack>
                
                <Typography variant="body2" sx={{ color: colors.text.secondary, textAlign: 'center', mb: 2, lineHeight: 1.4 }}>
                  {formData.bio}
                </Typography>
              </Box>

              {/* Información de Contacto Compacta */}
              <Stack spacing={1.5}>
                {[
                  { icon: <EmailIcon />, label: 'Correo', value: formData.email, color: colors.status.error },
                  { icon: <PhoneIcon />, label: 'Teléfono', value: formData.phone, color: colors.accents.blue },
                  { icon: <PlaceIcon />, label: 'Región', value: formData.region, color: colors.status.success },
                  { icon: <CalendarTodayIcon />, label: 'Miembro desde', value: formData.joinDate, color: colors.accents.purple },
                  { icon: <SecurityIcon />, label: 'Experiencia', value: formData.experience, color: colors.status.warning },
                ].map((item, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: colors.background.subtle,
                      '&:hover': { bgcolor: 'rgba(58, 110, 165, 0.04)' }
                    }}
                  >
                    <Box sx={{ color: item.color, mr: 1.5 }}>
                      {item.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium', color: colors.primary.dark }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Estadísticas Personales Mejoradas */}
            <Paper elevation={1} sx={{ 
              p: 2.5, 
              flex: 1,
              border: `1px solid ${colors.primary.light}20`,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: colors.primary.dark, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssessmentIcon sx={{ color: colors.primary.main }} /> Mi Desempeño
                </Typography>
                <IconButton size="small" onClick={handleSectionToggle('stats')} sx={{ color: colors.text.secondary }}>
                  <ExpandMoreIcon sx={{ transform: expandedSections.stats ? 'rotate(180deg)' : 'none' }} />
                </IconButton>
              </Box>
              
              {expandedSections.stats && (
                <Stack spacing={2}>
                  {/* KPI Principal */}
                  <Grid container spacing={1.5}>
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ 
                        p: 1.5, 
                        textAlign: 'center',
                        borderColor: colors.primary.light,
                      }}>
                        <Typography variant="h5" sx={{ color: colors.primary.main, fontWeight: 'bold' }}>
                          {stats.reviewsThisMonth.current}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                          Este mes
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={(stats.reviewsThisMonth.current / stats.reviewsThisMonth.target) * 100}
                          sx={{ 
                            mt: 1, 
                            height: 4, 
                            borderRadius: 2,
                            bgcolor: colors.primary.light,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: colors.primary.main
                            }
                          }}
                        />
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ 
                        p: 1.5, 
                        textAlign: 'center',
                        borderColor: colors.primary.light,
                      }}>
                        <Typography variant="h5" sx={{ color: colors.status.success, fontWeight: 'bold' }}>
                          {stats.approvalRate.value}%
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                          Aprobación
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.status.success, display: 'block' }}>
                          {stats.approvalRate.trend}
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                  
                  {/* Métricas Secundarias */}
                  {[
                    { label: 'Total revisadas', value: stats.reviewsTotal, icon: <GavelIcon />, color: colors.accents.purple },
                    { label: 'Tiempo promedio', value: stats.avgResponseTime.value, icon: <SpeedIcon />, color: colors.accents.blue, trend: stats.avgResponseTime.trend },
                    { label: 'Eficiencia', value: `${stats.efficiency}%`, icon: <TrendingUpIcon />, color: colors.status.success },
                    { label: 'Precisión', value: `${stats.accuracy}%`, icon: <AutoAwesomeIcon />, color: colors.status.warning },
                  ].map((metric, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ color: metric.color }}>
                          {metric.icon}
                        </Box>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                          {metric.label}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                        {metric.value}
                        {metric.trend && (
                          <Typography variant="caption" sx={{ 
                            color: metric.trend.startsWith('+') ? colors.status.success : colors.status.error, 
                            ml: 0.5 
                          }}>
                            {metric.trend}
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>

          {/* Columna Derecha - 65% */}
          <Grid item xs={12} lg={8} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Tabs Mejoradas */}
            <Paper elevation={1} sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              overflow: 'hidden',
              border: `1px solid ${colors.primary.light}20`,
            }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ 
                  borderBottom: 1, 
                  borderColor: colors.primary.light,
                  bgcolor: colors.background.subtle,
                  '& .MuiTab-root': {
                    color: colors.text.secondary,
                    '&.Mui-selected': {
                      color: colors.primary.main,
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: colors.primary.main,
                  }
                }}
              >
                <Tab 
                  icon={<PersonIcon />} 
                  iconPosition="start"
                  label="Información" 
                  sx={{ minHeight: 48 }}
                />
                <Tab 
                  icon={<LockIcon />} 
                  iconPosition="start"
                  label="Seguridad" 
                  sx={{ minHeight: 48 }}
                />
                <Tab 
                  icon={<NotificationsIcon />} 
                  iconPosition="start"
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Notificaciones
                      <Badge 
                        badgeContent={3} 
                        sx={{ 
                          '& .MuiBadge-badge': { 
                            bgcolor: colors.status.error,
                            color: 'white'
                          } 
                        }} 
                        size="small" 
                      />
                    </Box>
                  } 
                  sx={{ minHeight: 48 }}
                />
                <Tab 
                  icon={<HistoryIcon />} 
                  iconPosition="start"
                  label="Actividad" 
                  sx={{ minHeight: 48 }}
                />
                <Tab 
                  icon={<SettingsIcon />} 
                  iconPosition="start"
                  label="Preferencias" 
                  sx={{ minHeight: 48 }}
                />
              </Tabs>

              {/* Contenido de Tabs - Scroll Interno */}
              <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
                {tabValue === 0 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 'bold', color: colors.primary.dark, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ color: colors.primary.main }} /> Información Personal
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {[
                        { 
                          field: 'name', 
                          label: 'Nombre Completo', 
                          value: formData.name, 
                          icon: <PersonIcon />,
                          fullWidth: true 
                        },
                        { 
                          field: 'email', 
                          label: 'Correo Electrónico', 
                          value: formData.email, 
                          icon: <EmailIcon />,
                          type: 'email',
                          fullWidth: true 
                        },
                        { 
                          field: 'phone', 
                          label: 'Teléfono', 
                          value: formData.phone, 
                          icon: <PhoneIcon />,
                          type: 'tel' 
                        },
                        { 
                          field: 'region', 
                          label: 'Región Asignada', 
                          value: formData.region, 
                          icon: <PlaceIcon />,
                          select: true,
                          options: ['Norte', 'Centro', 'Sur', 'Metropolitana', 'Occidente']
                        },
                        { 
                          field: 'specialization', 
                          label: 'Especialización', 
                          value: formData.specialization, 
                          icon: <SecurityIcon />,
                          select: true,
                          options: ['Cumplimiento Normativo', 'Derecho Aduanero', 'Fiscal', 'Auditoría', 'Gestión de Riesgos']
                        },
                        { 
                          field: 'experience', 
                          label: 'Experiencia', 
                          value: formData.experience, 
                          icon: <CalendarTodayIcon />,
                          select: true,
                          options: ['Menos de 1 año', '1-3 años', '3-5 años', '5-10 años', 'Más de 10 años']
                        },
                      ].map((field, idx) => (
                        <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={idx}>
                          <TextField
                            fullWidth
                            size="small"
                            label={field.label}
                            value={field.value}
                            onChange={handleInputChange(field.field)}
                            disabled={!editMode}
                            type={field.type || 'text'}
                            select={field.select}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: colors.primary.dark,
                                '& fieldset': {
                                  borderColor: colors.primary.light,
                                },
                                '&:hover fieldset': {
                                  borderColor: colors.primary.main,
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: colors.primary.dark,
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: colors.text.secondary,
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Box sx={{ color: colors.primary.main }}>
                                    {field.icon}
                                  </Box>
                                </InputAdornment>
                              ),
                            }}
                          >
                            {field.select && field.options?.map(option => (
                              <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      ))}
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Biografía / Descripción"
                          value={formData.bio}
                          onChange={handleInputChange('bio')}
                          disabled={!editMode}
                          placeholder="Describe tu experiencia y especialidades..."
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: colors.primary.dark,
                              '& fieldset': {
                                borderColor: colors.primary.light,
                              },
                              '&:hover fieldset': {
                                borderColor: colors.primary.main,
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: colors.text.secondary,
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {tabValue === 1 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 'bold', color: colors.primary.dark, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LockIcon sx={{ color: colors.primary.main }} /> Seguridad y Contraseña
                    </Typography>
                    
                    <Alert severity="info" sx={{ 
                      mb: 3,
                      bgcolor: 'rgba(58, 110, 165, 0.08)',
                      color: colors.primary.dark,
                      '& .MuiAlert-icon': {
                        color: colors.primary.main
                      }
                    }}>
                      <Typography variant="body2">
                        <strong>Recomendación de seguridad:</strong> Cambia tu contraseña cada 90 días y utiliza una combinación única de caracteres.
                      </Typography>
                    </Alert>
                    
                    <Grid container spacing={2}>
                      {[
                        {
                          field: 'currentPassword',
                          label: 'Contraseña Actual',
                          value: passwordData.currentPassword,
                          icon: <VpnKeyIcon />,
                          showPassword: showPassword.current,
                          toggle: () => togglePasswordVisibility('current')
                        },
                        {
                          field: 'newPassword',
                          label: 'Nueva Contraseña',
                          value: passwordData.newPassword,
                          icon: <LockIcon />,
                          showPassword: showPassword.new,
                          toggle: () => togglePasswordVisibility('new')
                        },
                        {
                          field: 'confirmPassword',
                          label: 'Confirmar Nueva Contraseña',
                          value: passwordData.confirmPassword,
                          icon: <LockIcon />,
                          showPassword: showPassword.confirm,
                          toggle: () => togglePasswordVisibility('confirm'),
                          error: passwordData.newPassword !== '' && 
                                 passwordData.confirmPassword !== '' && 
                                 passwordData.newPassword !== passwordData.confirmPassword
                        }
                      ].map((field, idx) => (
                        <Grid item xs={12} key={idx}>
                          <TextField
                            fullWidth
                            size="small"
                            label={field.label}
                            type={field.showPassword ? 'text' : 'password'}
                            value={field.value}
                            onChange={(e) => setPasswordData({
                              ...passwordData,
                              [field.field]: e.target.value
                            })}
                            error={field.error}
                            helperText={field.error ? 'Las contraseñas no coinciden' : ''}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: colors.primary.dark,
                                '& fieldset': {
                                  borderColor: field.error ? colors.status.error : colors.primary.light,
                                },
                                '&:hover fieldset': {
                                  borderColor: colors.primary.main,
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: colors.text.secondary,
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Box sx={{ color: colors.primary.main }}>
                                    {field.icon}
                                  </Box>
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={field.toggle} size="small" sx={{ color: colors.text.secondary }}>
                                    {field.showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                          />
                        </Grid>
                      ))}
                      
                      <Grid item xs={12}>
                        <Card variant="outlined" sx={{ 
                          p: 2, 
                          mb: 2,
                          borderColor: colors.primary.light,
                        }}>
                          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold', color: colors.primary.dark }}>
                            Requisitos de seguridad:
                          </Typography>
                          <Grid container spacing={1}>
                            {[
                              { text: 'Mínimo 12 caracteres', met: passwordData.newPassword.length >= 12 },
                              { text: 'Letra mayúscula y minúscula', met: /[a-z]/.test(passwordData.newPassword) && /[A-Z]/.test(passwordData.newPassword) },
                              { text: 'Al menos un número', met: /\d/.test(passwordData.newPassword) },
                              { text: 'Carácter especial', met: /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) },
                            ].map((req, idx) => (
                              <Grid item xs={6} key={idx}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {req.met ? (
                                    <CheckCircleIcon sx={{ color: colors.status.success, fontSize: 16 }} />
                                  ) : (
                                    <ErrorIcon sx={{ color: colors.status.error, fontSize: 16 }} />
                                  )}
                                  <Typography variant="caption" sx={{ color: req.met ? colors.status.success : colors.text.secondary }}>
                                    {req.text}
                                  </Typography>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Card>
                        
                        <Button
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={handlePasswordChange}
                          disabled={!passwordData.currentPassword || 
                                   !passwordData.newPassword || 
                                   !passwordData.confirmPassword ||
                                   passwordData.newPassword !== passwordData.confirmPassword ||
                                   passwordData.newPassword.length < 12}
                          sx={{ 
                            bgcolor: colors.primary.main,
                            '&:hover': { bgcolor: colors.primary.dark },
                            '&.Mui-disabled': {
                              bgcolor: colors.primary.light,
                            }
                          }}
                        >
                          Actualizar Contraseña
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {tabValue === 2 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 'bold', color: colors.primary.dark, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <NotificationsIcon sx={{ color: colors.primary.main }} /> Configuración de Notificaciones
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ 
                          p: 2.5,
                          borderColor: colors.primary.light,
                        }}>
                          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: colors.primary.dark, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <NotificationsIcon sx={{ color: colors.primary.main }} /> Tipos de Alertas
                          </Typography>
                          
                          <Stack spacing={2}>
                            {[
                              { key: 'vencimientos', label: 'Vencimientos próximos', color: 'warning' },
                              { key: 'rechazos', label: 'Certificaciones rechazadas', color: 'error' },
                              { key: 'observaciones', label: 'Observaciones pendientes', color: 'info' },
                              { key: 'asignaciones', label: 'Nuevas asignaciones', color: 'primary' },
                              { key: 'aprobaciones', label: 'Aprobaciones completadas', color: 'success' },
                              { key: 'cambiosEstado', label: 'Cambios de estado', color: 'default' },
                            ].map((item) => (
                              <Box key={item.key} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ color: colors.primary.dark }}>{item.label}</Typography>
                                <Switch
                                  size="small"
                                  checked={formData.notifications[item.key]}
                                  onChange={handleNotificationChange(item.key)}
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: item.color === 'warning' ? colors.status.warning :
                                             item.color === 'error' ? colors.status.error :
                                             item.color === 'info' ? colors.status.info :
                                             item.color === 'success' ? colors.status.success :
                                             colors.primary.main,
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: item.color === 'warning' ? colors.status.warning :
                                                       item.color === 'error' ? colors.status.error :
                                                       item.color === 'info' ? colors.status.info :
                                                       item.color === 'success' ? colors.status.success :
                                                       colors.primary.light,
                                    },
                                  }}
                                />
                              </Box>
                            ))}
                          </Stack>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ 
                          p: 2.5,
                          borderColor: colors.primary.light,
                        }}>
                          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: colors.primary.dark, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SettingsIcon sx={{ color: colors.primary.main }} /> Métodos de Entrega
                          </Typography>
                          
                          <Stack spacing={2}>
                            <Box>
                              <FormControlLabel
                                control={
                                  <Switch
                                    size="small"
                                    checked={formData.notifications.email}
                                    onChange={handleNotificationChange('email')}
                                    sx={{
                                      '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: colors.primary.main,
                                      },
                                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: colors.primary.light,
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <Box>
                                    <Typography variant="body2" sx={{ color: colors.primary.dark }}>Correo electrónico</Typography>
                                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                      Recibe alertas importantes en tu correo
                                    </Typography>
                                  </Box>
                                }
                              />
                            </Box>
                            
                            <Box>
                              <FormControlLabel
                                control={
                                  <Switch
                                    size="small"
                                    checked={formData.notifications.push}
                                    onChange={handleNotificationChange('push')}
                                    sx={{
                                      '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: colors.primary.main,
                                      },
                                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: colors.primary.light,
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <Box>
                                    <Typography variant="body2" sx={{ color: colors.primary.dark }}>Notificaciones push</Typography>
                                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                      Alertas en tiempo real en el sistema
                                    </Typography>
                                  </Box>
                                }
                              />
                            </Box>
                            
                            <Divider sx={{ my: 1, borderColor: colors.primary.light }} />
                            
                            <Box>
                              <Typography variant="body2" sx={{ mb: 1, color: colors.text.secondary }}>
                                Frecuencia de resúmenes:
                              </Typography>
                              <Stack direction="row" spacing={1}>
                                {[
                                  { value: 'diario', label: 'Diario' },
                                  { value: 'semanal', label: 'Semanal' },
                                  { value: 'quincenal', label: 'Quincenal' },
                                  { value: 'mensual', label: 'Mensual' },
                                ].map((freq) => (
                                  <Chip
                                    key={freq.value}
                                    label={freq.label}
                                    size="small"
                                    variant={formData.notifications.resumenDiario && freq.value === 'diario' ? 'filled' : 'outlined'}
                                    sx={{
                                      bgcolor: formData.notifications.resumenDiario && freq.value === 'diario' ? colors.primary.main : 'transparent',
                                      color: formData.notifications.resumenDiario && freq.value === 'diario' ? 'white' : colors.primary.main,
                                      borderColor: colors.primary.light,
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => {}}
                                  />
                                ))}
                              </Stack>
                            </Box>
                          </Stack>
                        </Card>
                      </Grid>
                    </Grid>
                    
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      sx={{ 
                        mt: 3, 
                        bgcolor: colors.primary.main,
                        '&:hover': { bgcolor: colors.primary.dark }
                      }}
                    >
                      Guardar Configuración
                    </Button>
                  </Box>
                )}

                {tabValue === 3 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: colors.primary.dark, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HistoryIcon sx={{ color: colors.primary.main }} /> Historial de Actividad
                      </Typography>
                      <Button
                        startIcon={<DownloadIcon />}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: colors.primary.light,
                          color: colors.primary.main,
                          '&:hover': {
                            borderColor: colors.primary.main,
                            bgcolor: 'rgba(19, 59, 107, 0.04)',
                          }
                        }}
                      >
                        Exportar Historial
                      </Button>
                    </Box>
                    
                    <Stack spacing={1.5}>
                      {activityHistory.map((activity) => (
                        <Card 
                          key={activity.id} 
                          variant="outlined"
                          sx={{ 
                            p: 2,
                            borderLeft: `3px solid ${getActivityColor(activity.type)}`,
                            borderColor: colors.primary.light,
                            '&:hover': { bgcolor: colors.background.subtle }
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                                {activity.action}
                              </Typography>
                              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                {activity.details}
                              </Typography>
                            </Box>
                            <Chip 
                              label={activity.time}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                height: 20,
                                borderColor: colors.primary.light,
                                color: colors.text.secondary,
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                              {activity.date}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.primary.light }}>
                              Por: {activity.user}
                            </Typography>
                          </Box>
                        </Card>
                      ))}
                    </Stack>
                  </Box>
                )}

                {tabValue === 4 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 'bold', color: colors.primary.dark, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SettingsIcon sx={{ color: colors.primary.main }} /> Preferencias del Sistema
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ 
                          p: 2.5,
                          borderColor: colors.primary.light,
                        }}>
                          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: colors.primary.dark }}>
                            Interfaz y Visualización
                          </Typography>
                          
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="body2" sx={{ mb: 1, color: colors.text.secondary }}>
                                Tema de color:
                              </Typography>
                              <Stack direction="row" spacing={1}>
                                {['Claro', 'Oscuro', 'Automático'].map((theme) => (
                                  <Chip
                                    key={theme}
                                    label={theme}
                                    size="small"
                                    variant={theme === 'Claro' ? 'filled' : 'outlined'}
                                    sx={{
                                      bgcolor: theme === 'Claro' ? colors.primary.main : 'transparent',
                                      color: theme === 'Claro' ? 'white' : colors.primary.main,
                                      borderColor: colors.primary.light,
                                      cursor: 'pointer'
                                    }}
                                  />
                                ))}
                              </Stack>
                            </Box>
                            
                            <FormControlLabel
                              control={<Switch size="small" defaultChecked />}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: colors.primary.main,
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: colors.primary.light,
                                },
                              }}
                              label={<Typography sx={{ color: colors.primary.dark }}>Mostrar tutoriales</Typography>}
                            />
                            
                            <FormControlLabel
                              control={<Switch size="small" />}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: colors.primary.main,
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: colors.primary.light,
                                },
                              }}
                              label={<Typography sx={{ color: colors.primary.dark }}>Modo compacto</Typography>}
                            />
                          </Stack>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ 
                          p: 2.5,
                          borderColor: colors.primary.light,
                        }}>
                          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: colors.primary.dark }}>
                            Comportamiento del Sistema
                          </Typography>
                          
                          <Stack spacing={2}>
                            <FormControlLabel
                              control={<Switch size="small" defaultChecked />}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: colors.primary.main,
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: colors.primary.light,
                                },
                              }}
                              label={<Typography sx={{ color: colors.primary.dark }}>Confirmación antes de acciones</Typography>}
                            />
                            
                            <FormControlLabel
                              control={<Switch size="small" />}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: colors.primary.main,
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: colors.primary.light,
                                },
                              }}
                              label={<Typography sx={{ color: colors.primary.dark }}>Auto-guardado de formularios</Typography>}
                            />
                            
                            <FormControlLabel
                              control={<Switch size="small" defaultChecked />}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: colors.primary.main,
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: colors.primary.light,
                                },
                              }}
                              label={<Typography sx={{ color: colors.primary.dark }}>Recordatorios de vencimiento</Typography>}
                            />
                            
                            <Box>
                              <Typography variant="body2" sx={{ mb: 1, color: colors.text.secondary }}>
                                Idioma:
                              </Typography>
                              <TextField
                                select
                                fullWidth
                                size="small"
                                defaultValue="es"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    color: colors.primary.dark,
                                    '& fieldset': {
                                      borderColor: colors.primary.light,
                                    },
                                  },
                                }}
                              >
                                <MenuItem value="es">Español</MenuItem>
                                <MenuItem value="en">English</MenuItem>
                              </TextField>
                            </Box>
                          </Stack>
                        </Card>
                      </Grid>
                    </Grid>
                    
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      sx={{ 
                        mt: 3, 
                        bgcolor: colors.primary.main,
                        '&:hover': { bgcolor: colors.primary.dark }
                      }}
                    >
                      Guardar Preferencias
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CommitteeProfile;