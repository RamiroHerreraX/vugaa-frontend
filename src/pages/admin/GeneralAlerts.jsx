import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Grid, Paper, Typography, Card, CardContent, Chip, Stack,
  Button, IconButton, Tabs, Tab, TextField, MenuItem, Tooltip,
  Avatar, InputAdornment, CircularProgress, Snackbar, Alert,
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
  MoreVert as MoreVertIcon,
  MarkEmailRead as MarkReadIcon,
  CircleNotifications as CircleNotificationsIcon,
  Place as PlaceIcon,
  DeleteSweep as DeleteSweepIcon,
  RadioButtonUnchecked as UnreadDotIcon,
  TaskAlt as TaskAltIcon,
} from '@mui/icons-material';
import notificacionService from "../../services/notificacionService";
import { useAuth } from "../../context/AuthContext";

const C = {
  primary:       '#133B6B',
  secondary:     '#1a4c7a',
  background:    '#f8fafc',
  lightBlue:     'rgba(19, 59, 107, 0.08)',
  textPrimary:   '#2c3e50',
  textSecondary: '#7f8c8d',
  success:       '#27ae60',
  warning:       '#f39c12',
  error:         '#e74c3c',
  info:          '#3498db',
};

const getAlertColor = (tipo) => ({
  VENCIMIENTO: C.warning,
  ALERTA:      C.error,
  VALIDACION:  C.success,
  INFO:        C.info,
  SUCCESS:     C.success,
}[tipo?.toUpperCase()] ?? C.info);

const getAlertIcon = (tipo) => {
  switch (tipo?.toUpperCase()) {
    case 'VENCIMIENTO': return <WarningIcon />;
    case 'ALERTA':      return <ErrorIcon />;
    case 'VALIDACION':  return <CheckCircleIcon />;
    default:            return <InfoIcon />;
  }
};

// Label amigable para cualquier tipo que venga del backend
const labelTipo = (tipo) => {
  const map = {
    VENCIMIENTO: 'Vencimiento',
    ALERTA:      'Alerta',
    VALIDACION:  'Validación',
    INFO:        'Información',
    SUCCESS:     'Éxito',
  };
  return map[tipo?.toUpperCase()] ?? (tipo
    ? tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase()
    : 'Otro');
};

// ── Toggle de leído ──────────────────────────────────────────────────────────
const ReadToggle = ({ leida, loading, onClick }) => (
  <Tooltip title={leida ? 'Marcar como no leída' : 'Marcar como leída'} arrow placement="left">
    <span>
      <IconButton
        size="small"
        onClick={onClick}
        disabled={loading}
        sx={{
          width: 34, height: 34, flexShrink: 0,
          transition: 'all 0.2s',
          color:   leida ? C.success : C.textSecondary,
          bgcolor: leida ? `${C.success}18` : 'transparent',
          border:  `1.5px solid ${leida ? C.success : '#d0d7de'}`,
          borderRadius: '50%',
          '&:hover': {
            bgcolor:     leida ? `${C.success}28` : C.lightBlue,
            borderColor: leida ? C.success : C.primary,
            color:       leida ? C.success : C.primary,
            transform: 'scale(1.12)',
          },
          '&.Mui-disabled': { opacity: 0.5 },
        }}
      >
        {loading
          ? <CircularProgress size={14} sx={{ color: 'inherit' }} />
          : leida
            ? <TaskAltIcon   sx={{ fontSize: '1.05rem' }} />
            : <UnreadDotIcon sx={{ fontSize: '1.05rem' }} />
        }
      </IconButton>
    </span>
  </Tooltip>
);

// ── Componente principal ─────────────────────────────────────────────────────
const CommitteeAlerts = () => {
  const { user } = useAuth();
  const idUsuario = user?.id;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [togglingIds, setTogglingIds]     = useState(new Set());
  const [tabValue, setTabValue]           = useState(0);
  const [filterType, setFilterType]       = useState('all');
  const [filterStatus, setFilterStatus]   = useState('all');
  const [searchTerm, setSearchTerm]       = useState('');
  const [expandedId, setExpandedId]       = useState(null);
  const [snackbar, setSnackbar]           = useState({ open: false, message: '', severity: 'success' });

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

  const showSnackbar = (msg, sev = 'success') =>
    setSnackbar({ open: true, message: msg, severity: sev });

  // ── Tipos dinámicos extraídos de los datos reales ────────────────────────
  const tiposDinamicos = useMemo(() => {
    const set = new Set(notifications.map(n => n.tipo?.toUpperCase()).filter(Boolean));
    return Array.from(set).sort();
  }, [notifications]);

  // ── Toggle individual ────────────────────────────────────────────────────
  const handleToggleLeida = async (notif, e) => {
    e?.stopPropagation();
    const { idNotificacion, leida } = notif;
    setTogglingIds(prev => new Set(prev).add(idNotificacion));
    try {
      if (!leida) {
        await notificacionService.marcarLeida(idNotificacion);
        setNotifications(prev =>
          prev.map(n => n.idNotificacion === idNotificacion ? { ...n, leida: true } : n)
        );
        showSnackbar('Notificación marcada como leída');
      } else {
        // optimistic update — conectar endpoint si existe en backend
        setNotifications(prev =>
          prev.map(n => n.idNotificacion === idNotificacion ? { ...n, leida: false } : n)
        );
        showSnackbar('Notificación marcada como no leída');
      }
    } catch (err) {
      showSnackbar(err.message || 'Error al actualizar la notificación', 'error');
    } finally {
      setTogglingIds(prev => { const s = new Set(prev); s.delete(idNotificacion); return s; });
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

  // ── Filtrado ─────────────────────────────────────────────────────────────
  const filtered = notifications.filter(n => {
    const matchesTab =
      tabValue === 0 ? true :
      tabValue === 1 ? !n.leida :
      tabValue === 2 ? ['VENCIMIENTO','ALERTA'].includes(n.tipo?.toUpperCase()) :
      n.leida;
    const matchesType   = filterType === 'all' || n.tipo?.toUpperCase() === filterType;
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'read' ? n.leida : !n.leida);
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q ||
      (n.mensaje       || '').toLowerCase().includes(q) ||
      (n.tipo          || '').toLowerCase().includes(q) ||
      (n.nombreUsuario || '').toLowerCase().includes(q);
    return matchesTab && matchesType && matchesStatus && matchesSearch;
  });

  const stats = {
    total:    notifications.length,
    unread:   notifications.filter(n => !n.leida).length,
    urgent:   notifications.filter(n => ['VENCIMIENTO','ALERTA'].includes(n.tipo?.toUpperCase())).length,
    resolved: notifications.filter(n => n.leida).length,
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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ height: 'calc(100vh - 64px)', overflow: 'hidden', display: 'flex',
               flexDirection: 'column', p: 2, bgcolor: C.background }}>

      {/* ── Header ── */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: C.primary, fontWeight: 'bold',
                                           display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsIcon />
              Centro de Notificaciones
            </Typography>
            <Typography variant="caption" sx={{ color: C.textSecondary }}>
              Monitoreo y gestión de notificaciones del sistema
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Marcar todas como leídas">
              <span>
                <Button size="small" variant="outlined" startIcon={<MarkReadIcon />}
                  onClick={handleMarcarTodasLeidas} disabled={stats.unread === 0}
                  sx={{ borderColor: C.primary, color: C.primary, '&:hover': { bgcolor: C.lightBlue } }}>
                  Marcar todas
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Eliminar leídas">
              <span>
                <Button size="small" variant="outlined" startIcon={<DeleteSweepIcon />}
                  onClick={handleEliminarLeidas} disabled={stats.resolved === 0}
                  sx={{ borderColor: C.error, color: C.error, '&:hover': { bgcolor: '#ffeaea' } }}>
                  Limpiar leídas
                </Button>
              </span>
            </Tooltip>
            <Button size="small" variant="contained" startIcon={<RefreshIcon />}
              onClick={fetchAll} disabled={loading}
              sx={{ bgcolor: C.primary, '&:hover': { bgcolor: C.secondary } }}>
              {loading ? 'Cargando…' : 'Actualizar'}
            </Button>
          </Stack>
        </Box>

        {/* ── Filtros ── */}
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'white', border: `1px solid ${C.lightBlue}` }}>
          <Grid container spacing={2} alignItems="center">

            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" placeholder="Buscar notificaciones…" value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: C.textSecondary }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* ── Tipo: dinámico desde BD ── */}
            <Grid item xs={12} md={3}>
              <TextField select fullWidth size="small" value={filterType}
                onChange={(e) => setFilterType(e.target.value)} label="Tipo"
                disabled={tiposDinamicos.length === 0}>
                <MenuItem value="all">
                  <em>Todos los tipos</em>
                </MenuItem>
                {tiposDinamicos.map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <Box sx={{ color: getAlertColor(tipo), display: 'flex', alignItems: 'center',
                                 '& svg': { fontSize: '1rem' } }}>
                        {getAlertIcon(tipo)}
                      </Box>
                      <Typography variant="body2">{labelTipo(tipo)}</Typography>
                      <Chip
                        label={notifications.filter(n => n.tipo?.toUpperCase() === tipo).length}
                        size="small"
                        sx={{ ml: 'auto', height: 18, fontSize: '0.65rem',
                              bgcolor: `${getAlertColor(tipo)}18`, color: getAlertColor(tipo) }}
                      />
                    </Box>
                  </MenuItem>
                ))}
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
                sx={{ height: 40, borderColor: C.primary, color: C.primary,
                      '&:hover': { bgcolor: C.lightBlue } }}>
                Limpiar
              </Button>
            </Grid>
          </Grid>

          {/* ── Chips de acceso rápido por tipo (dinámicos) ── */}
          {tiposDinamicos.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mt: 1.5, pt: 1.5,
                       borderTop: `1px dashed ${C.lightBlue}`, alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: C.textSecondary, mr: 0.5 }}>
                Filtro rápido:
              </Typography>

              {/* "Todos" */}
              <Chip
                label="Todos"
                size="small"
                onClick={() => setFilterType('all')}
                sx={{
                  height: 22, fontSize: '0.7rem', cursor: 'pointer',
                  bgcolor:    filterType === 'all' ? C.primary : C.lightBlue,
                  color:      filterType === 'all' ? 'white'   : C.primary,
                  fontWeight: filterType === 'all' ? 700 : 400,
                  '&:hover': { bgcolor: C.primary, color: 'white' },
                }}
              />

              {tiposDinamicos.map((tipo) => {
                const active = filterType === tipo;
                const col    = getAlertColor(tipo);
                const count  = notifications.filter(n => n.tipo?.toUpperCase() === tipo).length;
                return (
                  <Chip
                    key={tipo}
                    icon={
                      <Box sx={{ color: active ? 'white' : col, display: 'flex',
                                 ml: '6px !important', '& svg': { fontSize: '0.75rem' } }}>
                        {getAlertIcon(tipo)}
                      </Box>
                    }
                    label={`${labelTipo(tipo)} (${count})`}
                    size="small"
                    onClick={() => setFilterType(active ? 'all' : tipo)}
                    sx={{
                      height: 22, fontSize: '0.7rem', cursor: 'pointer',
                      bgcolor:    active ? col : `${col}15`,
                      color:      active ? 'white' : col,
                      border:     `1px solid ${col}40`,
                      fontWeight: active ? 700 : 400,
                      '&:hover': { bgcolor: col, color: 'white' },
                    }}
                  />
                );
              })}
            </Box>
          )}
        </Paper>
      </Box>

      {/* ── Contenido ── */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        <Paper elevation={1} sx={{ mb: 2, border: `1px solid ${C.lightBlue}` }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant="scrollable" scrollButtons="auto"
            sx={{ minHeight: 48,
                  '& .MuiTab-root.Mui-selected': { color: C.primary, fontWeight: 'bold' },
                  '& .MuiTabs-indicator': { backgroundColor: C.primary } }}>
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

        <Paper elevation={1} sx={{ flex: 1, display: 'flex', flexDirection: 'column',
                                   overflow: 'hidden', border: `1px solid ${C.lightBlue}` }}>
          <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${C.lightBlue}`,
                     display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'white' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: C.textPrimary }}>
              {filtered.length} notificaciones encontradas
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={`${stats.unread} sin leer`} size="small"
                sx={{ bgcolor: C.lightBlue, color: C.primary, height: 22 }} />
              <Tooltip title="Haz clic en la palomita (✓) de cada notificación para marcarla como leída o no leída" arrow>
                <Chip
                  icon={<TaskAltIcon sx={{ fontSize: '0.8rem !important' }} />}
                  label="✓ para leer / no leer"
                  size="small" variant="outlined"
                  sx={{ fontSize: '0.65rem', height: 22, cursor: 'default',
                        borderColor: C.success, color: C.success }}
                />
              </Tooltip>
            </Stack>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', p: 1, bgcolor: '#f8fafc' }}>

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: C.primary }} />
              </Box>
            )}

            {!loading && filtered.length === 0 && (
              <Box sx={{ p: 8, textAlign: 'center' }}>
                <CircleNotificationsIcon sx={{ fontSize: 60, color: C.textSecondary, mb: 2 }} />
                <Typography variant="h6" sx={{ color: C.textSecondary, mb: 1 }}>
                  No hay notificaciones
                </Typography>
                <Typography variant="body2" sx={{ color: C.textSecondary }}>
                  Intenta ajustar los filtros de búsqueda
                </Typography>
              </Box>
            )}

            {!loading && filtered.map((notif) => {
              const color    = getAlertColor(notif.tipo);
              const icon     = getAlertIcon(notif.tipo);
              const expanded = expandedId === notif.idNotificacion;
              const toggling = togglingIds.has(notif.idNotificacion);

              return (
                <Card
                  key={notif.idNotificacion}
                  elevation={0}
                  onClick={() => setExpandedId(expanded ? null : notif.idNotificacion)}
                  sx={{
                    mb: 1,
                    borderLeft: `4px solid ${color}`,
                    bgcolor: notif.leida ? 'white' : C.lightBlue,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    opacity: notif.leida ? 0.82 : 1,
                    '&:hover': { bgcolor: '#e8f0fe', boxShadow: '0 2px 8px rgba(19,59,107,0.10)' },
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>

                      {/* Ícono de tipo */}
                      <Box sx={{ color, mt: 0.25, flexShrink: 0 }}>{icon}</Box>

                      {/* Contenido central */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>

                        {/* Tipo + chip NUEVA */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: C.textPrimary }}>
                            {labelTipo(notif.tipo)}
                          </Typography>
                          {!notif.leida && (
                            <Chip label="NUEVA" size="small" color="error"
                              sx={{ height: 16, fontSize: '0.55rem', fontWeight: 700 }} />
                          )}
                        </Box>

                        {/* Mensaje */}
                        <Typography variant="body2" sx={{ color: C.textSecondary, mb: 1, lineHeight: 1.5 }}>
                          {notif.mensaje}
                        </Typography>

                        {/* Meta */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
                          {notif.nombreUsuario && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Avatar sx={{ width: 20, height: 20, fontSize: '0.65rem',
                                            bgcolor: C.primary, color: 'white' }}>
                                {notif.nombreUsuario.charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography variant="caption" sx={{ color: C.textSecondary }}>
                                {notif.nombreUsuario}
                              </Typography>
                            </Box>
                          )}
                          {notif.nombreInstancia && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                              <PlaceIcon sx={{ fontSize: '0.75rem', color: C.primary }} />
                              <Typography variant="caption" sx={{ color: C.textSecondary }}>
                                {notif.nombreInstancia}
                              </Typography>
                            </Box>
                          )}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <EventIcon sx={{ fontSize: '0.75rem', color: C.primary }} />
                            <Typography variant="caption" sx={{ color: C.textSecondary }}>
                              {notif.fechaCreacion
                                ? new Date(notif.fechaCreacion).toLocaleString('es-MX')
                                : '—'}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Panel expandido — metadata */}
                        {expanded && notif.metadataJson && Object.keys(notif.metadataJson).length > 0 && (
                          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px dashed ${C.lightBlue}` }}>
                            <Typography variant="caption"
                              sx={{ fontWeight: 700, color: C.textSecondary, display: 'block', mb: 0.75 }}>
                              INFORMACIÓN ADICIONAL
                            </Typography>
                            <Stack spacing={0.4}>
                              {Object.entries(notif.metadataJson).map(([k, v]) => (
                                <Typography key={k} variant="caption" sx={{ color: C.textSecondary }}>
                                  <strong>{k}:</strong> {String(v)}
                                </Typography>
                              ))}
                            </Stack>
                          </Box>
                        )}
                      </Box>

                      {/* ── Toggle de leído — columna derecha ── */}
                      <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column',
                                 alignItems: 'center', gap: 0.4, ml: 0.5 }}>
                        <ReadToggle
                          leida={notif.leida}
                          loading={toggling}
                          onClick={(e) => handleToggleLeida(notif, e)}
                        />
                        <Typography variant="caption"
                          sx={{
                            fontSize: '0.58rem', lineHeight: 1, whiteSpace: 'nowrap',
                            color:      notif.leida ? C.success : C.textSecondary,
                            fontWeight: notif.leida ? 700 : 400,
                          }}>
                          {notif.leida ? 'Leída' : 'No leída'}
                        </Typography>
                      </Box>

                    </Box>
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
        <Alert severity={snackbar.severity}
          onClose={() => setSnackbar(p => ({ ...p, open: false }))}
          sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CommitteeAlerts;