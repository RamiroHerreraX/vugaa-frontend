import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Paper, Typography, Card, CardContent, Chip, Stack,
  Button, IconButton, Tabs, Tab, TextField, MenuItem, Tooltip,
  Avatar, InputAdornment, CircularProgress, Snackbar, Alert
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  OpenInNew as OpenInNewIcon,
  MoreVert as MoreVertIcon,
  MarkEmailRead as MarkReadIcon,
  Sort as SortIcon,
  CircleNotifications as CircleNotificationsIcon,
  Place as PlaceIcon,
  DeleteSweep as DeleteSweepIcon,
} from '@mui/icons-material';
import notificacionService from "../../services/notificacionService";
import { useAuth } from "../../context/AuthContext";

const institutionalColors = {
  primary: '#133B6B',
  secondary: '#1a4c7a',
  background: '#f8fafc',
  lightBlue: 'rgba(19, 59, 107, 0.08)',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  success: '#27ae60',
  warning: '#f39c12',
  error: '#e74c3c',
  info: '#3498db',
};

// Mapea el tipo del backend a icono/color
const getAlertColor = (tipo) => {
  const map = {
    VENCIMIENTO: institutionalColors.warning,
    ALERTA:      institutionalColors.error,
    VALIDACION:  institutionalColors.info,
    INFO:        institutionalColors.info,
    SUCCESS:     institutionalColors.success,
  };
  return map[tipo?.toUpperCase()] || institutionalColors.info;
};

const getAlertIcon = (tipo) => {
  const t = tipo?.toUpperCase();
  if (t === 'VENCIMIENTO') return <WarningIcon />;
  if (t === 'ALERTA')      return <ErrorIcon />;
  if (t === 'VALIDACION')  return <CheckCircleIcon />;
  return <InfoIcon />;
};

const CommitteeAlerts = () => {
  const { user } = useAuth();
  const idUsuario = user?.id;

  // ── estado ──────────────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [tabValue, setTabValue]           = useState(0);
  const [filterType, setFilterType]       = useState('all');
  const [filterStatus, setFilterStatus]   = useState('all');
  const [searchTerm, setSearchTerm]       = useState('');
  const [expandedId, setExpandedId]       = useState(null);
  const [snackbar, setSnackbar]           = useState({ open: false, message: '', severity: 'success' });

  // ── carga ────────────────────────────────────────────────────────────────────
  useEffect(() => { if (idUsuario) fetchAll(); }, [idUsuario]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await notificacionService.findByUsuario(idUsuario);
      setNotifications(data);
    } catch (err) {
      showSnackbar(err.message || 'Error al cargar notificaciones', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  // ── acciones ─────────────────────────────────────────────────────────────────
  const handleMarcarLeida = async (idNotificacion, e) => {
    e.stopPropagation();
    try {
      await notificacionService.marcarLeida(idNotificacion);
      setNotifications(prev =>
        prev.map(n => n.idNotificacion === idNotificacion ? { ...n, leida: true } : n)
      );
      showSnackbar('Notificación marcada como leída');
    } catch (err) {
      showSnackbar(err.message || 'Error al marcar como leída', 'error');
    }
  };

  const handleMarcarTodasLeidas = async () => {
    try {
      const { actualizadas } = await notificacionService.marcarTodasLeidas(idUsuario);
      setNotifications(prev => prev.map(n => ({ ...n, leida: true })));
      showSnackbar(`${actualizadas} notificaciones marcadas como leídas`);
    } catch (err) {
      showSnackbar(err.message || 'Error al marcar todas', 'error');
    }
  };

  const handleEliminarLeidas = async () => {
    try {
      const { eliminadas } = await notificacionService.eliminarLeidas(idUsuario);
      setNotifications(prev => prev.filter(n => !n.leida));
      showSnackbar(`${eliminadas} notificaciones eliminadas`);
    } catch (err) {
      showSnackbar(err.message || 'Error al eliminar leídas', 'error');
    }
  };

  // ── filtrado ─────────────────────────────────────────────────────────────────
  const filtered = notifications.filter(n => {
    const matchesTab =
      tabValue === 0 ? true :
      tabValue === 1 ? !n.leida :
      tabValue === 2 ? n.tipo?.toUpperCase() === 'VENCIMIENTO' || n.tipo?.toUpperCase() === 'ALERTA' :
      tabValue === 3 ? n.leida :
      true;

    const matchesType   = filterType === 'all'   || n.tipo?.toUpperCase() === filterType.toUpperCase();
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'read' ? n.leida : !n.leida);
    const matchesSearch = searchTerm === '' ||
      (n.mensaje   || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.tipo      || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.nombreUsuario || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesType && matchesStatus && matchesSearch;
  });

  // ── stats ────────────────────────────────────────────────────────────────────
  const stats = {
    total:       notifications.length,
    unread:      notifications.filter(n => !n.leida).length,
    urgent:      notifications.filter(n => ['VENCIMIENTO','ALERTA'].includes(n.tipo?.toUpperCase())).length,
    resolved:    notifications.filter(n => n.leida).length,
  };

  const tabs = [
    { label: 'Todas',     badge: stats.total },
    { label: 'No Leídas', badge: stats.unread,   color: 'error' },
    { label: 'Urgentes',  badge: stats.urgent,   color: 'warning' },
    { label: 'Leídas',    badge: stats.resolved },
  ];

  const clearFilters = () => {
    setFilterType('all'); setFilterStatus('all'); setSearchTerm(''); setTabValue(0);
  };

  // ── render ────────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ height: 'calc(100vh - 64px)', overflow: 'hidden', display: 'flex',
               flexDirection: 'column', p: 2, bgcolor: institutionalColors.background }}>

      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: institutionalColors.primary, fontWeight: 'bold',
                                           display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsIcon />
              Centro de Notificaciones
            </Typography>
            <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
              Monitoreo y gestión de notificaciones del sistema
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Marcar todas como leídas">
              <Button size="small" variant="outlined" startIcon={<MarkReadIcon />}
                onClick={handleMarcarTodasLeidas} disabled={stats.unread === 0}
                sx={{ borderColor: institutionalColors.primary, color: institutionalColors.primary,
                      '&:hover': { bgcolor: institutionalColors.lightBlue } }}>
                Marcar todas
              </Button>
            </Tooltip>
            <Tooltip title="Eliminar leídas">
              <Button size="small" variant="outlined" startIcon={<DeleteSweepIcon />}
                onClick={handleEliminarLeidas} disabled={stats.resolved === 0}
                sx={{ borderColor: institutionalColors.error, color: institutionalColors.error,
                      '&:hover': { bgcolor: '#ffeaea' } }}>
                Limpiar leídas
              </Button>
            </Tooltip>
            <Button size="small" variant="contained" startIcon={<RefreshIcon />}
              onClick={fetchAll} disabled={loading}
              sx={{ bgcolor: institutionalColors.primary, '&:hover': { bgcolor: institutionalColors.secondary } }}>
              {loading ? 'Cargando...' : 'Actualizar'}
            </Button>
          </Stack>
        </Box>

        {/* Filtros */}
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'white', border: `1px solid ${institutionalColors.lightBlue}` }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" placeholder="Buscar notificaciones..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} /></InputAdornment>,
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} md={2.5}>
              <TextField select fullWidth size="small" value={filterType}
                onChange={(e) => setFilterType(e.target.value)} label="Tipo">
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="VENCIMIENTO">Vencimientos</MenuItem>
                <MenuItem value="ALERTA">Alertas</MenuItem>
                <MenuItem value="VALIDACION">Validaciones</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={2.5}>
              <TextField select fullWidth size="small" value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)} label="Estado">
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="unread">No leídas</MenuItem>
                <MenuItem value="read">Leídas</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={1.5}>
              <Button fullWidth size="small" variant="outlined" onClick={clearFilters}
                sx={{ height: 40, borderColor: institutionalColors.primary,
                      color: institutionalColors.primary,
                      '&:hover': { bgcolor: institutionalColors.lightBlue } }}>
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Contenido */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Tabs */}
        <Paper elevation={1} sx={{ mb: 2, border: `1px solid ${institutionalColors.lightBlue}` }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant="scrollable" scrollButtons="auto"
            sx={{ minHeight: 48,
                  '& .MuiTab-root.Mui-selected': { color: institutionalColors.primary, fontWeight: 'bold' },
                  '& .MuiTabs-indicator': { backgroundColor: institutionalColors.primary } }}>
            {tabs.map((tab, i) => (
              <Tab key={i} label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {tab.label}
                  {tab.badge > 0 && (
                    <Chip label={tab.badge} size="small" color={tab.color || 'default'} sx={{ height: 20 }} />
                  )}
                </Box>
              } />
            ))}
          </Tabs>
        </Paper>

        {/* Lista */}
        <Paper elevation={1} sx={{ flex: 1, display: 'flex', flexDirection: 'column',
                                   overflow: 'hidden', border: `1px solid ${institutionalColors.lightBlue}` }}>
          <Box sx={{ p: 2, borderBottom: `1px solid ${institutionalColors.lightBlue}`,
                     display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'white' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: institutionalColors.textPrimary }}>
              {filtered.length} notificaciones encontradas
            </Typography>
            <Chip label={`${stats.unread} sin leer`} size="small"
              sx={{ bgcolor: institutionalColors.lightBlue, color: institutionalColors.primary }} />
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', p: 1, bgcolor: '#f8fafc' }}>

            {/* Loading */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: institutionalColors.primary }} />
              </Box>
            )}

            {/* Vacío */}
            {!loading && filtered.length === 0 && (
              <Box sx={{ p: 8, textAlign: 'center' }}>
                <CircleNotificationsIcon sx={{ fontSize: 60, color: institutionalColors.textSecondary, mb: 2 }} />
                <Typography variant="h6" sx={{ color: institutionalColors.textSecondary, mb: 1 }}>
                  No hay notificaciones
                </Typography>
                <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
                  Intenta ajustar los filtros de búsqueda
                </Typography>
              </Box>
            )}

            {/* Cards */}
            {!loading && filtered.map((notif) => {
              const color    = getAlertColor(notif.tipo);
              const icon     = getAlertIcon(notif.tipo);
              const expanded = expandedId === notif.idNotificacion;

              return (
                <Card key={notif.idNotificacion} elevation={0} onClick={() => setExpandedId(expanded ? null : notif.idNotificacion)}
                  sx={{ mb: 1, borderLeft: `4px solid ${color}`,
                        bgcolor: notif.leida ? 'white' : institutionalColors.lightBlue,
                        cursor: 'pointer', transition: 'all 0.2s',
                        '&:hover': { bgcolor: '#e8f0fe' } }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Grid container spacing={1}>

                      {/* Título y acciones */}
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ color }}>{icon}</Box>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: institutionalColors.textPrimary }}>
                                {notif.tipo || 'Notificación'}
                              </Typography>
                              {!notif.leida && (
                                <Chip label="NUEVA" size="small" color="error" sx={{ height: 18, fontSize: '0.6rem' }} />
                              )}
                            </Box>
                          </Box>

                          <Stack direction="row" spacing={0.5}>
                            {!notif.leida && (
                              <Tooltip title="Marcar como leída">
                                <IconButton size="small" onClick={(e) => handleMarcarLeida(notif.idNotificacion, e)}
                                  sx={{ color: institutionalColors.primary }}>
                                  <MarkReadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <IconButton size="small" sx={{ color: institutionalColors.textSecondary }}>
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Box>
                      </Grid>

                      {/* Mensaje */}
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ color: institutionalColors.textSecondary, mb: 1 }}>
                          {notif.mensaje}
                        </Typography>
                      </Grid>

                      {/* Meta */}
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            {notif.nombreUsuario && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Avatar sx={{ width: 22, height: 22, fontSize: '0.7rem',
                                              bgcolor: institutionalColors.primary, color: 'white' }}>
                                  {notif.nombreUsuario.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                                  {notif.nombreUsuario}
                                </Typography>
                              </Box>
                            )}
                            {notif.nombreInstancia && (
                              <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                                <PlaceIcon sx={{ fontSize: '0.75rem', verticalAlign: 'middle', mr: 0.3,
                                                 color: institutionalColors.primary }} />
                                {notif.nombreInstancia}
                              </Typography>
                            )}
                          </Stack>

                          <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                            <EventIcon sx={{ fontSize: '0.75rem', verticalAlign: 'middle', mr: 0.3,
                                            color: institutionalColors.primary }} />
                            {notif.fechaCreacion
                              ? new Date(notif.fechaCreacion).toLocaleString('es-MX')
                              : '—'}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Panel expandido — metadata */}
                      {expanded && notif.metadataJson && Object.keys(notif.metadataJson).length > 0 && (
                        <Grid item xs={12} sx={{ mt: 1.5, pt: 1.5, borderTop: `1px dashed ${institutionalColors.lightBlue}` }}>
                          <Typography variant="caption" sx={{ fontWeight: 'bold', color: institutionalColors.textSecondary, display: 'block', mb: 1 }}>
                            INFORMACIÓN ADICIONAL
                          </Typography>
                          <Stack spacing={0.5}>
                            {Object.entries(notif.metadataJson).map(([key, val]) => (
                              <Typography key={key} variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                                <strong>{key}:</strong> {String(val)}
                              </Typography>
                            ))}
                          </Stack>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar(p => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(p => ({ ...p, open: false }))} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CommitteeAlerts;