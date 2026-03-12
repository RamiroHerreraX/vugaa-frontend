// src/pages/audit/AuditAgent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  Divider,
  Avatar,
  LinearProgress,
  Pagination,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  History as HistoryIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Gavel as GavelIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  CloudUpload as CloudUploadIcon,
  Verified as VerifiedIcon,
  Send as SendIcon,
  Business as BusinessIcon,
  LocationCity as LocationCityIcon,
  FactCheck as FactCheckIcon,
  Assessment as AssessmentIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Update as UpdateIcon,
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
  Downloading as DownloadingIcon
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import auditoriaService from '../../../services/auditoriaService';

// Paleta corporativa del UserManagement
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

const AuditAgent = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterEntity, setFilterEntity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Estados para modales
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ========== FUNCIÓN PARA CARGAR LOGS ==========
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const idUsuario = user?.id || user?.idUsuario;
      if (!idUsuario) {
        throw new Error('No se pudo obtener el ID del usuario');
      }

      const data = await auditoriaService.findByAgente(idUsuario);
      
      // Ordenar por fecha descendente (más reciente primero)
      const sorted = [...data].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setAuditLogs(sorted);
      
      setPage(1);
      setSnackbar({
        open: true,
        message: 'Datos cargados correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al cargar logs:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Error al cargar los datos',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // ========== FUNCIONES PARA MODALES ==========
  const handleOpenDetailModal = (log) => {
    setSelectedLog(log);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedLog(null);
  };

  const handleOpenCertModal = (cert) => {
    setSelectedCert(cert);
    setCertModalOpen(true);
  };

  const handleCloseCertModal = () => {
    setCertModalOpen(false);
    setSelectedCert(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // ========== FUNCIONES DE FILTRADO ==========
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'success': return colors.status.success;
      case 'info': return colors.primary.main;
      case 'warning': return colors.status.warning;
      case 'error': return colors.status.error;
      default: return colors.text.secondary;
    }
  };

  const getActionIcon = (action) => {
    const accion = (action || '').toUpperCase();
    if (accion.includes('CERTIFICATION')) return <VerifiedIcon />;
    if (accion.includes('DOCUMENT')) return <DescriptionIcon />;
    if (accion.includes('LOGIN')) return <LoginIcon />;
    if (accion.includes('SECURITY')) return <SecurityIcon />;
    if (accion.includes('DECLARACION')) return <GavelIcon />;
    if (accion.includes('LOGOUT')) return <LogoutIcon />;
    if (accion.includes('RECONOCIMIENTO')) return <DownloadingIcon />;
    if (accion.includes('AUTORIZACION')) return <AssignmentTurnedInIcon />;
    if (accion.includes('CONFLICTO')) return <GavelIcon />;
    return <DescriptionIcon />;
  };

  // Estados personalizados basados en los que proporcionaste
  const statusConfig = {
    'Aceptados': {
      label: 'Aceptados',
      color: colors.status.success,
      bgColor: '#e8f5e9',
      icon: <CheckCircleIcon />,
      description: 'Certificación validada y activa'
    },
    'En revisión': {
      label: 'En revisión',
      color: colors.status.warning,
      bgColor: '#fff3e0',
      icon: <PendingIcon />,
      description: 'En proceso de validación por el comité'
    },
    'Información adicional': {
      label: 'Información adicional',
      color: colors.primary.main,
      bgColor: '#e3f2fd',
      icon: <InfoIcon />,
      description: 'Requiere documentación complementaria'
    },
    'Desactualizado': {
      label: 'Desactualizado',
      color: colors.status.warning,
      bgColor: '#fffde7',
      icon: <UpdateIcon />,
      description: 'Requiere actualización'
    },
    'Registro': {
      label: 'Registro',
      color: colors.primary.light,
      bgColor: '#e1f5fe',
      icon: <AddIcon />,
      description: 'Registro inicial pendiente de validación'
    },
    'Rechazado': {
      label: 'Rechazado',
      color: colors.status.error,
      bgColor: '#ffebee',
      icon: <ErrorIcon />,
      description: 'Certificación no aprobada o vencida'
    }
  };

  const getStatusChip = (status) => {
    const config = statusConfig[status] || statusConfig['Registro'];
    
    return (
      <Tooltip title={config.description}>
        <Chip
          icon={config.icon}
          label={config.label}
          size="small"
          sx={{
            backgroundColor: config.bgColor,
            color: config.color,
            border: `1px solid ${config.color}40`,
            fontWeight: '600',
            fontSize: '0.75rem',
            height: '24px',
            '& .MuiChip-icon': {
              color: config.color,
              fontSize: '16px'
            }
          }}
        />
      </Tooltip>
    );
  };

  // ========== FILTRADO DE LOGS ==========
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      (log.accion || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.entidadTipo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(log.idEntidad || '').includes(searchTerm);
    
    const matchesType = filterType === 'all' ? true : 
      (log.accion || '').toUpperCase().includes(filterType);
    
    const matchesEntity = filterEntity === 'all' ? true : 
      (log.entidadTipo || '') === filterEntity;
    
    const matchesStatus = filterStatus === 'all' ? true : 
      (log.valorNuevo?.estado || '') === filterStatus;
    
    return matchesSearch && matchesType && matchesEntity && matchesStatus;
  });

  const paginatedLogs = filteredLogs.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // ========== ESTADÍSTICAS ==========
  const stats = {
    total: auditLogs.length,
    today: auditLogs.filter(log => {
      if (!log.fecha) return false;
      const today = new Date().toDateString();
      const logDate = new Date(log.fecha).toDateString();
      return today === logDate;
    }).length,
    byStatus: {
      aceptados: auditLogs.filter(log => log.valorNuevo?.estado === 'Aceptados').length,
      enRevision: auditLogs.filter(log => log.valorNuevo?.estado === 'En revisión').length,
      infoAdicional: auditLogs.filter(log => log.valorNuevo?.estado === 'Información adicional').length,
      desactualizado: auditLogs.filter(log => log.valorNuevo?.estado === 'Desactualizado').length,
      registro: auditLogs.filter(log => log.valorNuevo?.estado === 'Registro').length,
      rechazado: auditLogs.filter(log => log.valorNuevo?.estado === 'Rechazado').length,
    },
    byEntity: {
      certificaciones: auditLogs.filter(log => log.entidadTipo === 'CERTIFICACION').length,
      sistema: auditLogs.filter(log => log.entidadTipo === 'SISTEMA').length,
      cumplimiento: auditLogs.filter(log => log.entidadTipo === 'CUMPLIMIENTO').length,
      expediente: auditLogs.filter(log => log.entidadTipo === 'EXPEDIENTE').length,
      documentos: auditLogs.filter(log => log.entidadTipo === 'DOCUMENTO').length,
    }
  };

  // Acciones específicas que puede realizar el AGENTE
  const actionTypes = [
    { value: 'all', label: 'Todas las acciones' },
    { value: 'LOGIN', label: 'Accesos al sistema' },
    { value: 'CERTIFICATION', label: 'Gestión de Certificaciones' },
    { value: 'DOCUMENT', label: 'Documentos y Expediente' },
    { value: 'SECURITY', label: 'Seguridad' },
    { value: 'DECLARACION', label: 'Declaraciones' },
  ];

  // Entidades específicas del AGENTE
  const entities = [
    { value: 'all', label: 'Todas las entidades' },
    { value: 'CERTIFICACION', label: 'Certificaciones' },
    { value: 'SISTEMA', label: 'Sistema SICAG' },
    { value: 'CUMPLIMIENTO', label: 'Cumplimiento' },
    { value: 'EXPEDIENTE', label: 'Expediente' },
    { value: 'DOCUMENTO', label: 'Documentos' },
  ];

  // Estados para filtro
  const statusFilter = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'Aceptados', label: 'Aceptados' },
    { value: 'En revisión', label: 'En revisión' },
    { value: 'Información adicional', label: 'Información adicional' },
    { value: 'Desactualizado', label: 'Desactualizado' },
    { value: 'Registro', label: 'Registro' },
    { value: 'Rechazado', label: 'Rechazado' },
  ];

  // ========== RENDER ==========
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: colors.primary.dark, fontWeight: 'bold', mb: 0.5 }}>
              Auditoría - Agente Aduanal
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Registro completo de tus accesos y actividades en el sistema
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              size="small"
              onClick={fetchLogs}
              disabled={loading}
              sx={{
                bgcolor: colors.primary.main,
                '&:hover': { bgcolor: colors.primary.dark },
                '&:disabled': { bgcolor: `${colors.primary.main}60` }
              }}
            >
              {loading ? 'Cargando...' : 'Actualizar'}
            </Button>
          </Stack>
        </Box>

        {/* Información del agente */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: `${colors.primary.main}10` }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 48, 
                    height: 48, 
                    bgcolor: colors.primary.main,
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}
                >
                  {user?.nombre?.charAt(0) || 'A'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: colors.text.primary }}>
                    {user?.nombre || 'Agente Aduanal'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    ID: {user?.id || user?.idUsuario} • Miembro desde: {new Date().toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<CheckCircleIcon />}
                  label={`${stats.byStatus.aceptados} aceptados`}
                  size="small"
                  sx={{ 
                    bgcolor: '#e8f5e9',
                    color: colors.status.success,
                    borderColor: colors.status.success
                  }}
                  variant="outlined"
                />
                <Chip 
                  icon={<LoginIcon />}
                  label={`${stats.today} accesos hoy`}
                  size="small"
                  sx={{ 
                    color: colors.primary.main,
                    bgcolor: '#e3f2fd',
                    borderColor: colors.primary.main
                  }}
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Contenido principal */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Estadísticas */}
        <Box sx={{ width: '100%', mb: 3 }}>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr 1fr',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(5, 1fr)'
            },
            gap: 1.5
          }}>
            <Card sx={{ borderLeft: `4px solid ${colors.primary.main}` }}>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: colors.primary.main, fontWeight: 'bold', mb: 0.5 }}>
                  {stats.total}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  Total de Eventos
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ borderLeft: `4px solid ${colors.status.success}` }}>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: colors.status.success, fontWeight: 'bold', mb: 0.5 }}>
                  {stats.byStatus.aceptados}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  Aceptados
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ borderLeft: `4px solid ${colors.status.warning}` }}>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: colors.status.warning, fontWeight: 'bold', mb: 0.5 }}>
                  {stats.byStatus.enRevision}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  En Revisión
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ borderLeft: `4px solid ${colors.status.warning}` }}>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: colors.status.warning, fontWeight: 'bold', mb: 0.5 }}>
                  {stats.byStatus.desactualizado}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  Desactualizados
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ borderLeft: `4px solid ${colors.status.error}` }}>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: colors.status.error, fontWeight: 'bold', mb: 0.5 }}>
                  {stats.byStatus.rechazado}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  Rechazados
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Filtros */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            bgcolor: '#f8f9fa',
            width: '100%',
            borderRadius: 2
          }}
        >
          <Grid 
            container 
            spacing={2} 
            alignItems="center"
            sx={{
              width: '100%',
              mx: 0,
            }}
          >
            {/* Buscador */}
            <Grid 
              item 
              xs={12} 
              md={3}
              sx={{
                flexBasis: { md: '25%' },
                maxWidth: { md: '25%' }
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar en auditoría..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: colors.primary.main }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    backgroundColor: 'white',
                  }
                }}
              />
            </Grid>
            
            {/* Tipo de Acción */}
            <Grid 
              item 
              xs={12} 
              md={2.5}
              sx={{
                flexBasis: { md: '18%' },
                maxWidth: { md: '18%' }
              }}
            >
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: colors.text.primary }}>Tipo de Acción</InputLabel>
                <Select
                  value={filterType}
                  label="Tipo de Acción"
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setPage(1);
                  }}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 1.5,
                  }}
                >
                  {actionTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Entidad */}
            <Grid 
              item 
              xs={12} 
              md={2.5}
              sx={{
                flexBasis: { md: '18%' },
                maxWidth: { md: '18%' }
              }}
            >
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: colors.text.primary }}>Entidad</InputLabel>
                <Select
                  value={filterEntity}
                  label="Entidad"
                  onChange={(e) => {
                    setFilterEntity(e.target.value);
                    setPage(1);
                  }}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 1.5,
                  }}
                >
                  {entities.map(entity => (
                    <MenuItem key={entity.value} value={entity.value}>{entity.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Estado */}
            <Grid 
              item 
              xs={12} 
              md={2}
              sx={{
                flexBasis: { md: '18%' },
                maxWidth: { md: '18%' }
              }}
            >
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: colors.text.primary }}>Estado</InputLabel>
                <Select
                  value={filterStatus}
                  label="Estado"
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setPage(1);
                  }}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 1.5,
                  }}
                >
                  {statusFilter.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {status.value !== 'all' && statusConfig[status.value]?.icon}
                        {status.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Botones */}
            <Grid 
              item 
              xs={12} 
              md={1.8}
              sx={{
                flexBasis: { md: '13%' },
                maxWidth: { md: '13%' }
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                size="medium"
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterEntity('all');
                  setFilterStatus('all');
                  setPage(1);
                }}
                sx={{
                  color: colors.primary.main,
                  borderColor: colors.primary.main,
                  borderRadius: 1.5,
                  py: 0.8,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  backgroundColor: 'white',
                  '&:hover': {
                    borderColor: colors.primary.dark,
                    backgroundColor: `${colors.primary.main}10`,
                  }
                }}
              >
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabla de auditoría */}
        <Paper elevation={1} sx={{ mb: 3 }}>
          <Box sx={{ 
            p: 2, 
            borderBottom: `1px solid ${colors.primary.main}20`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: colors.text.primary }}>
              Mi Historial de Actividades - {filteredLogs.length} eventos
            </Typography>
            
            <Stack direction="row" spacing={1}>
              <Chip 
                label={`${stats.today} eventos hoy`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ color: colors.primary.main, borderColor: colors.primary.main }}
              />
              <Chip 
                label={`${paginatedLogs.length} mostrados`}
                size="small"
                variant="outlined"
                sx={{ color: colors.text.secondary, borderColor: colors.text.secondary }}
              />
            </Stack>
          </Box>

          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, width: '15%' }}>Fecha y Hora</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, width: '20%' }}>Acción Realizada</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, width: '15%' }}>Entidad</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, width: '15%' }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, width: '30%' }}>Detalles</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, width: '5%' }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <CircularProgress sx={{ color: colors.primary.main }} />
                    </TableCell>
                  </TableRow>
                ) : paginatedLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: colors.text.secondary }}>
                      No se encontraron registros de auditoría
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLogs.map((log) => (
                    <TableRow 
                      key={log.idAuditoria}
                      hover
                      sx={{ 
                        '&:hover': { bgcolor: '#f8f9fa' },
                        borderLeft: `3px solid ${getSeverityColor(log.severidad)}`
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.text.primary }}>
                            {log.fecha ? new Date(log.fecha).toLocaleDateString('es-MX') : '—'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            {log.fecha ? new Date(log.fecha).toLocaleTimeString('es-MX') : ''}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ color: getSeverityColor(log.severidad) }}>
                            {getActionIcon(log.accion)}
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium', color: colors.text.primary }}>
                              {log.accion}
                            </Typography>
                            <Chip 
                              label={log.severidad || 'info'}
                              size="small"
                              sx={{ 
                                bgcolor: `${getSeverityColor(log.severidad)}15`,
                                color: getSeverityColor(log.severidad),
                                fontSize: '0.65rem',
                                height: 18,
                                mt: 0.5
                              }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', color: colors.text.primary }}>
                            {log.entidadTipo || '—'}
                          </Typography>
                          {log.idEntidad && (
                            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                              ID: {log.idEntidad}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        {getStatusChip(log.valorNuevo?.estado)}
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            {log.valorNuevo?.descripcion || '—'}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Tooltip title="Ver detalles completos">
                          <IconButton 
                            size="small" 
                            sx={{ color: colors.primary.main }}
                            onClick={() => handleOpenDetailModal(log)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          <Box sx={{ p: 2, borderTop: `1px solid ${colors.primary.main}20`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Mostrando {filteredLogs.length > 0 ? ((page - 1) * rowsPerPage) + 1 : 0} - {Math.min(page * rowsPerPage, filteredLogs.length)} de {filteredLogs.length} eventos
            </Typography>
            <Pagination
              count={Math.ceil(filteredLogs.length / rowsPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
              size="small"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: colors.primary.main,
                  '&.Mui-selected': {
                    backgroundColor: colors.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: colors.primary.dark,
                    }
                  }
                }
              }}
            />
          </Box>
        </Paper>

        {/* Información adicional */}
        <Paper elevation={0} sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa' }}>
          <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: 'bold' }}>
            Resumen de tus actividades
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: colors.text.secondary, mb: 0.5, display: 'block' }}>
                  Estados principales:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" sx={{ minWidth: 140, color: colors.text.primary }}>
                    Aceptados:
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.total > 0 ? (stats.byStatus.aceptados / stats.total) * 100 : 0}
                    sx={{ 
                      flex: 1,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': { bgcolor: colors.status.success }
                    }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 'bold', minWidth: 30, color: colors.text.primary }}>
                    {stats.byStatus.aceptados}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: colors.text.secondary, mb: 0.5, display: 'block' }}>
                  En revisión:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" sx={{ minWidth: 140, color: colors.text.primary }}>
                    Validación:
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.total > 0 ? (stats.byStatus.enRevision / stats.total) * 100 : 0}
                    sx={{ 
                      flex: 1,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': { bgcolor: colors.status.warning }
                    }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 'bold', minWidth: 30, color: colors.text.primary }}>
                    {stats.byStatus.enRevision}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: colors.text.secondary, mb: 0.5, display: 'block' }}>
                  Eventos hoy:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" sx={{ minWidth: 140, color: colors.text.primary }}>
                    {new Date().toLocaleDateString('es-MX')}:
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.total > 0 ? (stats.today / stats.total) * 100 : 0}
                    sx={{ 
                      flex: 1,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': { bgcolor: colors.primary.main }
                    }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 'bold', minWidth: 30, color: colors.text.primary }}>
                    {stats.today}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: colors.text.secondary, mb: 0.5, display: 'block' }}>
                  Certificaciones:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" sx={{ minWidth: 140, color: colors.text.primary }}>
                    Total:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.primary.main }}>
                    {stats.byEntity.certificaciones} certificaciones
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2, borderColor: `${colors.primary.main}20` }} />
          
          <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
            <strong>Nota:</strong> Esta auditoría registra todas tus actividades en el sistema. Los registros se mantienen por 5 años según normativa vigente.
          </Typography>
        </Paper>
      </Box>

      {/* Modal de detalles (mantén tu componente DetailModal existente) */}
      {/* <DetailModal /> */}
      
      {/* Modal de certificación (mantén tu componente CertPreviewModal existente) */}
      {/* <CertPreviewModal /> */}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuditAgent;