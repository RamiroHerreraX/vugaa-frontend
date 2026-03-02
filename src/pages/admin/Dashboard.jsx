import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Stack,
  Divider,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  LinearProgress,
  Badge,
  Avatar,
  AvatarGroup,
  Drawer,
  Fab,
  Tabs,
  Tab,
  Tooltip
} from '@mui/material';
import {
  People as PeopleIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  ChevronRight as ChevronRightIcon,
  Timer as TimerIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

// Paleta corporativa
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
    success: '#00A8A8',
    warning: '#00C2D1',
    error: '#0099FF',
    info: '#3A6EA5'
  },
  text: {
    primary: '#0D2A4D',
    secondary: '#3A6EA5',
    light: '#6C5CE7'
  }
};

const AdminDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [panelTab, setPanelTab] = useState(0);

  const systemStats = [
    { title: 'Usuarios Activos', value: '156', change: '+12%', icon: <PeopleIcon />, color: colors.primary.main, trend: 'up', detail: 'De 180 totales' },
    { title: 'Certificaciones Hoy', value: '24', change: '+5%', icon: <DescriptionIcon />, color: colors.secondary.main, trend: 'up', detail: 'Meta: 30 diarias' },
    { title: 'Pendientes Revisión', value: '18', change: '-3%', icon: <WarningIcon />, color: colors.accents.blue, trend: 'down', detail: 'Reducción semanal' },
    { title: 'Tasa Cumplimiento', value: '92%', change: '+2%', icon: <TrendingUpIcon />, color: colors.accents.purple, trend: 'up', detail: 'Óptimo: >90%' },
  ];

  const alerts = [
    { id: 1, type: 'warning', title: 'Certificaciones Pendientes', count: 5, icon: <WarningIcon />, time: 'Ahora' },
    { id: 2, type: 'error', title: 'Usuarios Inactivos', count: 8, icon: <PeopleIcon />, time: '2 días' },
    { id: 3, type: 'info', title: 'Vencimientos Próx.', count: 12, icon: <NotificationsIcon />, time: 'Próxima sem.' },
    { id: 4, type: 'success', title: 'Sistema OK', count: 0, icon: <CheckCircleIcon />, time: 'Actualizado' },
  ];

  const recentActivities = [
    { id: 1, user: 'Luis Rodríguez', action: 'Nueva certificación', time: '15 min', type: 'add', avatar: 'LR' },
    { id: 2, user: 'María González', action: 'Certificación aprobada', time: '30 min', type: 'approve', avatar: 'MG' },
    { id: 3, user: 'Carlos Martínez', action: 'Usuario creado', time: '1 h', type: 'user', avatar: 'CM' },
    { id: 4, user: 'Ana López', action: 'Config. actualizada', time: '2 h', type: 'config', avatar: 'AL' },
  ];

  const regionalStats = [
    { region: 'Norte', users: 45, certifications: 120, compliance: 95, status: 'excelente', trend: '+3%' },
    { region: 'Centro', users: 68, certifications: 180, compliance: 92, status: 'bueno', trend: '+1%' },
    { region: 'Sur', users: 32, certifications: 85, compliance: 88, status: 'regular', trend: '-2%' },
    { region: 'Metropolitana', users: 56, certifications: 150, compliance: 96, status: 'excelente', trend: '+4%' },
  ];

  const committeeDashboard = [
    { type: 'PATENTE ADUANAL', user: 'Luis Rodríguez', region: 'Norte', date: '15/01/2026', status: 'PENDIENTE', priority: 'alta', days: 2 },
    { type: 'OPINIÓN SAT', user: 'Carlos Martínez', region: 'Sur', date: '14/01/2026', status: 'EN REVISIÓN', priority: 'media', days: 1 },
    { type: 'CÉDULA PROFESIONAL', user: 'Ana López', region: 'Centro', date: '13/01/2026', status: 'PENDIENTE', priority: 'baja', days: 3 },
    { type: 'PODER NOTARIAL', user: 'Pedro Sánchez', region: 'Metropolitana', date: '12/01/2026', status: 'REQUIERE INFO', priority: 'alta', days: 4 },
  ];

  const activeUsers = ['LR', 'MG', 'CM', 'AL', 'PS', 'JR', 'MM', 'RS'];

  const panelTabs = [
    { label: 'Actividad', icon: <PeopleIcon /> },
    { label: 'Usuarios', icon: <PeopleIcon /> },
    { label: 'Alertas', icon: <WarningIcon /> },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excelente': return colors.secondary.main;
      case 'bueno': return colors.accents.blue;
      case 'regular': return colors.primary.main;
      case 'critico': return colors.primary.dark;
      default: return colors.text.secondary;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'add': return <DescriptionIcon sx={{ color: colors.primary.main, fontSize: 16 }} />;
      case 'approve': return <CheckCircleIcon sx={{ color: colors.secondary.main, fontSize: 16 }} />;
      case 'user': return <PeopleIcon sx={{ color: colors.accents.purple, fontSize: 16 }} />;
      case 'config': return <SettingsIcon sx={{ color: colors.accents.blue, fontSize: 16 }} />;
      case 'report': return <DownloadIcon sx={{ color: colors.primary.light, fontSize: 16 }} />;
      default: return <NotificationsIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'alta': return { color: colors.primary.dark, label: 'ALTA' };
      case 'media': return { color: colors.accents.blue, label: 'MEDIA' };
      case 'baja': return { color: colors.primary.main, label: 'BAJA' };
      default: return { color: colors.text.secondary, label: 'NORMAL' };
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{
      p: 2.5,
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    }}>
      {/* Header compacto con acciones rápidas integradas */}
      <Box sx={{
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1.5
      }}>
        <Box>
          <Typography variant="h5" sx={{ color: colors.primary.dark, fontWeight: 'bold', mb: 0.5 }}>
            Panel Administrativo
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            Resumen del sistema SICAG - Estado actual y control
          </Typography>
        </Box>
      </Box>

      {/* Layout principal: KPI Cards - 4 CARDS OCUPANDO TODO EL RENGLÓN */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)', // 4 columnas de igual ancho
        gap: 2,
        mb: 3,
        width: '100%',
        '@media (max-width: 1200px)': {
          gridTemplateColumns: 'repeat(2, 1fr)', // 2 columnas en pantallas medianas
        },
        '@media (max-width: 600px)': {
          gridTemplateColumns: '1fr', // 1 columna en móviles
        }
      }}>
        {systemStats.map((stat, index) => (
          <Card key={index} sx={{
            borderLeft: `4px solid ${stat.color}`,
            height: 120, // MISMA ALTURA EXACTA que las 5 cards del otro código
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden' // Para asegurar que nada se desborde
          }}>
            <CardContent sx={{
              p: 1.5, // Padding reducido para usar mejor el espacio
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}>
              {/* Primera fila: Icono, título y valor */}
              <Box sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 1,
                mb: 1
              }}>
                {/* Icono y título */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: stat.color }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="body2" sx={{
                    color: colors.text.secondary,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    lineHeight: 1.2
                  }}>
                    {stat.title}
                  </Typography>
                </Box>

                {/* Valor principal */}
                <Typography variant="h5" sx={{
                  color: colors.primary.dark,
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  lineHeight: 1,
                  textAlign: 'right'
                }}>
                  {stat.value}
                </Typography>
              </Box>

              {/* Segunda fila: Detalle y cambio porcentual */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: 0.5
              }}>
                {/* Detalle */}
                <Typography variant="caption" sx={{
                  color: '#95a5a6',
                  fontSize: '0.7rem',
                  lineHeight: 1.2,
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {stat.detail}
                </Typography>

                {/* Cambio porcentual */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.25,
                  flexShrink: 0
                }}>
                  <Box sx={{
                    width: 0,
                    height: 0,
                    borderLeft: '3px solid transparent',
                    borderRight: '3px solid transparent',
                    borderBottom: stat.trend === 'up' ? `4px solid ${colors.secondary.main}` : `4px solid ${colors.primary.dark}`,
                    transform: stat.trend === 'up' ? 'none' : 'rotate(180deg)'
                  }} />
                  <Chip
                    label={stat.change}
                    size="small"
                    sx={{
                      bgcolor: stat.trend === 'up' ? '#e0f7f7' : '#e8f0fe',
                      color: stat.trend === 'up' ? colors.secondary.main : colors.primary.dark,
                      fontWeight: 'bold',
                      fontSize: '0.65rem',
                      height: 20,
                      minWidth: 'auto',
                      '& .MuiChip-label': {
                        px: 0.5
                      }
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dashboard del Comité y Cumplimiento por Región - CON MISMA ALTURA */}
      <Box sx={{ 
        display: 'flex',
        gap: 2,
        mb: 2,
        width: '100%',
        '@media (max-width: 1200px)': {
          flexDirection: 'column',
        }
      }}>
        {/* Dashboard del Comité - 70% */}
        <Box sx={{ 
          flex: 7, // 70% del espacio
          minHeight: '100%',
          '@media (max-width: 1200px)': {
            flex: '1 1 100%',
          }
        }}>
          <Card sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent sx={{ 
              p: 2, 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: 'bold', fontSize: '1rem' }}>
                  Dashboard del Comité
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Chip 
                    label="5 PENDIENTES" 
                    size="small"
                    sx={{ 
                      fontSize: '0.65rem', 
                      height: 22,
                      bgcolor: '#e6f0ff',
                      color: colors.accents.blue
                    }}
                  />
                  <Chip 
                    label="3 VENCIMIENTOS" 
                    size="small"
                    sx={{ 
                      fontSize: '0.65rem', 
                      height: 22,
                      bgcolor: '#e8f0fe',
                      color: colors.primary.dark
                    }}
                  />
                </Box>
              </Box>

              <TableContainer sx={{ flex: 1 }}>
                <Table size="small" sx={{ tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: '30%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '15%' }} />
                  </colgroup>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 'bold', py: 1, fontSize: '0.75rem', color: colors.primary.dark }}>Tipo</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 1, fontSize: '0.75rem', color: colors.primary.dark }}>Usuario</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 1, fontSize: '0.75rem', color: colors.primary.dark }}>Fecha</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 1, fontSize: '0.75rem', color: colors.primary.dark }}>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {committeeDashboard.map((row, index) => {
                      const priority = getPriorityBadge(row.priority);
                      return (
                        <TableRow 
                          key={index} 
                          hover
                          sx={{ '&:last-child td': { borderBottom: 0 } }}
                        >
                          <TableCell sx={{ py: 1, overflow: 'hidden' }}>
                            <Box>
                              <Typography variant="body2" sx={{ 
                                fontWeight: '500', 
                                color: colors.primary.dark,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {row.type}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                <Chip 
                                  label={priority.label}
                                  size="small"
                                  sx={{
                                    bgcolor: `${priority.color}15`,
                                    color: priority.color,
                                    fontWeight: 'bold',
                                    fontSize: '0.65rem',
                                    height: 18
                                  }}
                                />
                                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                  {row.region}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ 
                            py: 1, 
                            fontSize: '0.875rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: colors.primary.dark
                          }}>
                            {row.user}
                          </TableCell>
                          <TableCell sx={{ 
                            py: 1, 
                            fontSize: '0.875rem',
                            whiteSpace: 'nowrap',
                            color: colors.primary.dark
                          }}>
                            {row.date}
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Chip 
                                label={row.status}
                                size="small"
                                sx={{
                                  bgcolor: row.status === 'PENDIENTE' ? '#e6f0ff' :
                                           row.status === 'EN REVISIÓN' ? '#e0f7f7' :
                                           '#e8f0fe',
                                  color: row.status === 'PENDIENTE' ? colors.accents.blue :
                                         row.status === 'EN REVISIÓN' ? colors.secondary.main :
                                         colors.primary.dark,
                                  fontWeight: 'bold',
                                  fontSize: '0.7rem',
                                  height: 20
                                }}
                              />
                              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                {row.days} días
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mt: 2,
                pt: 1.5,
                borderTop: '1px solid #ecf0f1'
              }}>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  Mostrando 4 de 18 certificaciones
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Cumplimiento por Región - 30% */}
        <Box sx={{ 
          flex: 3, // 30% del espacio
          minHeight: '100%',
          '@media (max-width: 1200px)': {
            flex: '1 1 100%',
          }
        }}>
          <Card sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent sx={{ 
              p: 2, 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ color: colors.primary.dark, mb: 2, fontWeight: 'bold', fontSize: '1rem' }}>
                Cumplimiento por Región
              </Typography>

              <Stack spacing={2} sx={{ flex: 1 }}>
                {regionalStats.map((region, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                        {region.region}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ 
                          color: region.trend.startsWith('+') ? colors.secondary.main : colors.primary.dark,
                          fontWeight: 'bold'
                        }}>
                          {region.trend}
                        </Typography>
                        <Chip 
                          label={`${region.compliance}%`}
                          size="small"
                          sx={{ 
                            bgcolor: `${getStatusColor(region.status)}20`,
                            color: getStatusColor(region.status),
                            fontWeight: 'bold',
                            fontSize: '0.7rem',
                            height: 20
                          }}
                        />
                      </Box>
                    </Box>

                    <LinearProgress 
                      variant="determinate" 
                      value={region.compliance}
                      sx={{ 
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#ecf0f1',
                        mb: 1,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getStatusColor(region.status),
                          borderRadius: 3
                        }
                      }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                        👥 {region.users} usuarios
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                        📄 {region.certifications} certs.
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Footer compacto */}
      <Box sx={{
        mt: 3,
        pt: 2,
        borderTop: '1px solid #dfe6e9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1
      }}>
        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
          SICAG v2.1 • Última actualización: Hoy 10:30 AM
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CheckCircleIcon sx={{ fontSize: 12, color: colors.secondary.main }} />
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Sistema operativo al 100%
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ height: 16 }} />
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            156 usuarios activos
          </Typography>
        </Box>
      </Box>

      {/* Panel flotante (Drawer) CON ALERTAS */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        variant="persistent"
        PaperProps={{
          sx: {
            width: 380,
            maxWidth: '90vw',
            marginTop: '64px',
            height: 'calc(100vh - 64px)',
            borderLeft: `1px solid ${colors.primary.light}`,
            boxShadow: '0px 0px 20px rgba(0,0,0,0.1)',
            borderRadius: '8px 0 0 8px'
          }
        }}
      >
        <Box sx={{
          p: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header del panel */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            pb: 2,
            borderBottom: `1px solid ${colors.primary.light}`
          }}>
            <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: 'bold' }}>
              Panel de Información
            </Typography>
            <IconButton
              size="small"
              onClick={toggleDrawer}
              sx={{
                color: colors.text.secondary,
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>

          {/* Tabs del panel */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
              value={panelTab}
              onChange={(e, newValue) => setPanelTab(newValue)}
              variant="fullWidth"
              sx={{ 
                minHeight: 40,
                '& .MuiTab-root': {
                  color: colors.text.secondary,
                  '&.Mui-selected': {
                    color: colors.primary.main
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: colors.primary.main
                }
              }}
            >
              {panelTabs.map((tab, index) => (
                <Tab
                  key={index}
                  icon={tab.icon}
                  iconPosition="start"
                  label={tab.label}
                  sx={{
                    minHeight: 40,
                    fontSize: '0.75rem',
                    textTransform: 'none'
                  }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Contenido del panel */}
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflowY: 'auto'
          }}>
            {panelTab === 0 && (
              /* Actividad Reciente */
              <Box sx={{ flex: 1, overflowY: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: colors.primary.dark, fontWeight: 'bold' }}>
                    Actividad Reciente
                  </Typography>
                  <Tooltip title="Filtrar actividad">
                    <IconButton size="small" sx={{ color: colors.primary.main }}>
                      <FilterIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Stack spacing={1.5}>
                  {recentActivities.map((activity) => {
                    let bgColor;
                    if (activity.type === 'add') bgColor = colors.primary.main;
                    else if (activity.type === 'approve') bgColor = colors.secondary.main;
                    else if (activity.type === 'user') bgColor = colors.accents.purple;
                    else if (activity.type === 'config') bgColor = colors.accents.blue;
                    else bgColor = colors.primary.light;

                    return (
                      <Paper
                        key={activity.id}
                        sx={{
                          p: 1.5,
                          bgcolor: 'white',
                          borderLeft: `3px solid ${bgColor}`
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                          <Avatar sx={{
                            width: 32,
                            height: 32,
                            fontSize: '0.75rem',
                            bgcolor: bgColor
                          }}>
                            {activity.avatar}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: '600', color: colors.primary.dark }}>
                              {activity.user}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                              {activity.action}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" sx={{
                            color: '#95a5a6',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}>
                            <TimerIcon sx={{ fontSize: 12 }} />
                            {activity.time}
                          </Typography>
                          {getActivityIcon(activity.type)}
                        </Box>
                      </Paper>
                    );
                  })}
                </Stack>
              </Box>
            )}

            {panelTab === 1 && (
              /* Usuarios Activos */
              <Box sx={{ flex: 1, overflowY: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: colors.primary.dark, fontWeight: 'bold' }}>
                    Usuarios Activos
                  </Typography>
                  <Tooltip title="Gestionar usuarios">
                    <IconButton size="small" sx={{ color: colors.primary.main }}>
                      <SettingsIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 1, mb: 2 }}>
                  <AvatarGroup max={8} sx={{ justifyContent: 'center', mb: 2, '& .MuiAvatar-root': { width: 36, height: 36, fontSize: '0.875rem' } }}>
                    {activeUsers.map((initials, idx) => (
                      <Avatar key={idx} sx={{ bgcolor: [colors.primary.main, colors.secondary.main, colors.accents.blue, colors.accents.purple, colors.primary.dark, colors.primary.light][idx % 6] }}>
                        {initials}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', textAlign: 'center' }}>
                    8 usuarios activos en este momento
                  </Typography>
                </Box>
              </Box>
            )}

            {panelTab === 2 && (
              /* Alertas del Sistema - MOVIDAS AL PANEL */
              <Box sx={{ flex: 1, overflowY: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: colors.primary.dark, fontWeight: 'bold' }}>
                    Alertas del Sistema
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Configurar alertas">
                      <IconButton size="small" sx={{ color: colors.primary.main }}>
                        <SettingsIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Marcar todas como leídas">
                      <IconButton size="small" sx={{ color: colors.secondary.main }}>
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Stack spacing={1.5}>
                  {alerts.map((alert) => {
                    let borderColor;
                    let iconColor;
                    let badgeColor;
                    let hoverColor;

                    if (alert.type === 'warning') {
                      borderColor = colors.accents.blue;
                      iconColor = colors.accents.blue;
                      badgeColor = 'warning';
                      hoverColor = colors.accents.blue;
                    } else if (alert.type === 'error') {
                      borderColor = colors.primary.dark;
                      iconColor = colors.primary.dark;
                      badgeColor = 'error';
                      hoverColor = colors.primary.dark;
                    } else if (alert.type === 'info') {
                      borderColor = colors.primary.main;
                      iconColor = colors.primary.main;
                      badgeColor = 'info';
                      hoverColor = colors.primary.light;
                    } else {
                      borderColor = colors.secondary.main;
                      iconColor = colors.secondary.main;
                      badgeColor = 'success';
                      hoverColor = colors.secondary.light;
                    }

                    return (
                      <Paper
                        key={alert.id}
                        sx={{
                          p: 1.5,
                          borderLeft: `4px solid ${borderColor}`,
                          bgcolor: 'white',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateX(-2px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ color: iconColor }}>
                              {alert.icon}
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                                {alert.title}
                              </Typography>
                              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                {alert.time}
                              </Typography>
                            </Box>
                          </Box>
                          {alert.count > 0 ? (
                            <Badge
                              badgeContent={alert.count}
                              sx={{
                                '& .MuiBadge-badge': {
                                  fontWeight: 'bold',
                                  fontSize: '0.7rem',
                                  minWidth: 20,
                                  height: 20,
                                  bgcolor: borderColor,
                                  color: 'white'
                                }
                              }}
                            />
                          ) : (
                            <CheckCircleIcon sx={{ color: colors.secondary.main, fontSize: 20 }} />
                          )}
                        </Box>

                        {/* Acciones para cada alerta */}
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: 1,
                          mt: 1,
                          pt: 1,
                          borderTop: '1px solid #f0f0f0'
                        }}>
                          <Button size="small" sx={{ fontSize: '0.65rem', px: 1, color: colors.text.secondary }}>
                            Ver detalles
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            sx={{
                              fontSize: '0.65rem',
                              px: 1,
                              bgcolor: borderColor,
                              '&:hover': {
                                bgcolor: hoverColor
                              }
                            }}
                          >
                            Acción
                          </Button>
                        </Box>
                      </Paper>
                    );
                  })}
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Resumen de alertas */}
                <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ color: colors.primary.dark, mb: 1, fontWeight: 'bold' }}>
                    Resumen de Alertas
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Badge
                          badgeContent={alerts.filter(a => a.type === 'warning').reduce((sum, a) => sum + a.count, 0)}
                          sx={{
                            mb: 0.5,
                            '& .MuiBadge-badge': {
                              bgcolor: colors.accents.blue,
                              color: 'white'
                            }
                          }}
                        >
                          <WarningIcon sx={{ color: colors.accents.blue }} />
                        </Badge>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                          Advertencias
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Badge
                          badgeContent={alerts.filter(a => a.type === 'error').reduce((sum, a) => sum + a.count, 0)}
                          sx={{
                            mb: 0.5,
                            '& .MuiBadge-badge': {
                              bgcolor: colors.primary.dark,
                              color: 'white'
                            }
                          }}
                        >
                          <WarningIcon sx={{ color: colors.primary.dark }} />
                        </Badge>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                          Errores
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <CheckCircleIcon sx={{ color: colors.secondary.main, mb: 0.5 }} />
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                          OK
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}
          </Box>

          {/* Footer del panel */}
          <Box sx={{
            pt: 2,
            mt: 2,
            borderTop: `1px solid ${colors.primary.light}`,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ChevronRightIcon />}
              onClick={toggleDrawer}
              fullWidth
              sx={{
                color: colors.primary.main,
                borderColor: colors.primary.main,
                '&:hover': {
                  borderColor: colors.primary.dark,
                  backgroundColor: '#e8f0fe'
                }
              }}
            >
              Cerrar Panel
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Botón flotante para abrir panel */}
      {!drawerOpen && (
        <Fab
          color="default"
          aria-label="ver panel"
          onClick={toggleDrawer}
          sx={{
            position: 'fixed',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            color: colors.primary.main,
            border: `1px solid ${colors.primary.light}`,
            opacity: 0.8,
            '&:hover': {
              bgcolor: '#e8f0fe',
              opacity: 1,
              boxShadow: '0px 4px 12px rgba(0,0,0,0.15)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
          size="small"
        >
          <VisibilityIcon sx={{ fontSize: 18 }} />
        </Fab>
      )}
    </Box>
  );
};

export default AdminDashboard;