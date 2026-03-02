// src/pages/audit/AuditAgent.jsx
import React, { useState } from 'react';
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
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TablePagination
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Restore as RestoreIcon,
  History as HistoryIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Gavel as GavelIcon,
  Settings as SettingsIcon,
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

  // Datos de auditoría específicos para AGENTE ADUANAL - CON NUEVOS LOGS Y FECHAS AJUSTADAS
  const auditLogs = [
    {
      id: 1,
      timestamp: '26/02/2026 12:26:00',
      user: { name: 'Luis Rodríguez', role: 'agente', avatar: 'LR' },
      action: 'LOGIN_SUCCESS',
      actionName: 'Inicio de sesión exitoso',
      entity: 'Sistema',
      entityId: 'N/A',
      details: 'Inicio de sesión desde dispositivo principal',
      ipAddress: '192.168.1.105',
      device: 'Chrome / Windows',
      severity: 'info',
      status: 'Aceptados',
      icon: <LoginIcon />,
    },
    {
      id: 2,
      timestamp: '26/02/2026 12:27:00',
      user: { name: 'Luis Rodríguez', role: 'agente', avatar: 'LR' },
      action: 'DOCUMENT_UPLOAD',
      actionName: 'Documento subido',
      entity: 'Expediente',
      entityId: 'DOC-2026-001',
      details: 'Se subió el acta de nacimiento al expediente digital',
      ipAddress: '192.168.1.105',
      device: 'Chrome / Windows',
      severity: 'success',
      status: 'Aceptados',
      icon: <CloudUploadIcon />,
    },
     {
      id: 3,
      timestamp: '26/02/2026 12:29:22',
      user: { name: 'Luis Rodríguez', role: 'agente', avatar: 'LR' },
      action: 'CERTIFICATION_CREATE',
      actionName: 'Certificación creada',
      entity: 'Certificación',
      entityId: 'CET-2025-001',
      details: 'Curso de Ética Profesional y Código de Conducta',
      ipAddress: '192.168.1.105',
      device: 'Chrome / Windows',
      severity: 'success',
      status: 'En revisión',
      icon: <AddIcon />,
    },
    {
      id: 4,
      timestamp: '26/02/2026 12:30:22',
      user: { name: 'Luis Rodríguez', role: 'agente', avatar: 'LR' },
      action: 'CERTIFICATION_CREATE',
      actionName: 'Certificación creada',
      entity: 'Certificación',
      entityId: 'CET-2025-001',
      details: 'Diplomado en Comercio Exterior y Legislación Aduanera',
      ipAddress: '192.168.1.105',
      device: 'Chrome / Windows',
      severity: 'success',
      status: 'En revisión',
      icon: <AddIcon />,
    },
    {
      id: 5,
      timestamp: '26/02/2026 12:32:00',
      user: { name: 'Luis Rodríguez', role: 'agente', avatar: 'LR' },
      action: 'DECLARACION_ACCEPTED',
      actionName: 'Declaración aceptada',
      entity: 'Cumplimiento',
      entityId: 'DEC-2026-001',
      details: 'Se aceptó la declaración de buena fe y veracidad',
      ipAddress: '192.168.1.105',
      device: 'Chrome / Windows',
      severity: 'success',
      status: 'Aceptados',
      icon: <VerifiedIcon />,
    },
    {
      id: 6,
      timestamp: '26/02/2026 12:34:50',
      user: { name: 'Luis Rodríguez', role: 'agente', avatar: 'LR' },
      action: 'CONFLICTO_INTERESES_COMPLETED',
      actionName: 'Declaración completada',
      entity: 'Cumplimiento',
      entityId: 'ART-92-2026',
      details: 'Se completó la declaración de conflicto de intereses (Artículo 92)',
      ipAddress: '192.168.1.105',
      device: 'Chrome / Windows',
      severity: 'success',
      status: 'Aceptados',
      icon: <GavelIcon />,
    },
    {
      id: 7,
      timestamp: '26/02/2026 12:36:00',
      user: { name: 'Luis Rodríguez', role: 'agente', avatar: 'LR' },
      action: 'AUTORIZACION_ASOCIACION',
      actionName: 'Autorización otorgada',
      entity: 'Documentos',
      entityId: 'AUT-2026-001',
      details: 'Se aceptó que la asociación suba los documentos al sistema',
      ipAddress: '192.168.1.105',
      device: 'Chrome / Windows',
      severity: 'info',
      status: 'Aceptados',
      icon: <AssignmentTurnedInIcon />,
    },
   
    {
      id: 8,
      timestamp: '26/02/2026 12:36:15',
      user: { name: 'Luis Rodríguez', role: 'agente', avatar: 'LR' },
      action: 'LOGOUT',
      actionName: 'Cierre de sesión',
      entity: 'Sistema',
      entityId: 'N/A',
      details: 'Cierre de sesión exitoso',
      ipAddress: '192.168.1.105',
      device: 'Chrome / Windows',
      severity: 'info',
      status: 'Aceptados',
      icon: <LogoutIcon />,
    },
    {
      id: 9,
      timestamp: '26/02/2026 10:43:49',
      user: { name: 'Luis Rodríguez', role: 'agente', avatar: 'LR' },
      action: 'LOGIN_SUCCESS',
      actionName: 'Inicio de sesión exitoso',
      entity: 'Sistema',
      entityId: 'N/A',
      details: 'Inicio de sesión desde dispositivo principal',
      ipAddress: '192.168.1.105',
      device: 'Chrome / Windows',
      severity: 'info',
      status: 'Aceptados',
      icon: <LoginIcon />,
    },
  
     {
      id: 10,
      timestamp: '26/02/2026 12:44:12',
      user: { name: 'Luis Rodríguez', role: 'agente', avatar: 'LR' },
      action: 'RECONOCIMIENTO_DOWNLOAD',
      actionName: 'Documento descargado',
      entity: 'Certificaciones',
      entityId: 'REC-2026-001',
      details: 'Se descargó el reconocimiento de nivel gremial',
      ipAddress: '192.168.1.105',
      device: 'Chrome / Windows',
      severity: 'info',
      status: 'Aceptados',
      icon: <DownloadingIcon />,
    },
  ];

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
    { value: 'Certificación', label: 'Certificaciones' },
    { value: 'Sistema', label: 'Sistema SICAG' },
    { value: 'Cumplimiento', label: 'Cumplimiento' },
    { value: 'Expediente', label: 'Expediente' },
    { value: 'Documentos', label: 'Documentos' },
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
    if (action.includes('CERTIFICATION')) return <VerifiedIcon />;
    if (action.includes('DOCUMENT')) return <DescriptionIcon />;
    if (action.includes('LOGIN')) return <LoginIcon />;
    if (action.includes('SECURITY')) return <SecurityIcon />;
    if (action.includes('DECLARACION')) return <GavelIcon />;
    if (action.includes('LOGOUT')) return <LogoutIcon />;
    if (action.includes('RECONOCIMIENTO')) return <DownloadingIcon />;
    if (action.includes('AUTORIZACION')) return <AssignmentTurnedInIcon />;
    if (action.includes('CONFLICTO')) return <GavelIcon />;
    return <DescriptionIcon />;
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

  // Función para abrir modal de detalles
  const handleOpenDetailModal = (log) => {
    setSelectedLog(log);
    setDetailModalOpen(true);
  };

  // Función para cerrar modal de detalles
  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedLog(null);
  };

  // Función para abrir modal de certificación
  const handleOpenCertModal = (cert) => {
    setSelectedCert(cert);
    setCertModalOpen(true);
  };

  // Función para cerrar modal de certificación
  const handleCloseCertModal = () => {
    setCertModalOpen(false);
    setSelectedCert(null);
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.actionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      filterType === 'all' ? true : log.action.includes(filterType);
    
    const matchesEntity = 
      filterEntity === 'all' ? true : log.entity === filterEntity;
    
    const matchesStatus = 
      filterStatus === 'all' ? true : log.status === filterStatus;
    
    return matchesSearch && matchesType && matchesEntity && matchesStatus;
  });

  const paginatedLogs = filteredLogs.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Estadísticas específicas para AGENTE
  const stats = {
    total: auditLogs.length,
    today: auditLogs.filter(log => log.timestamp.includes('26/02/2026')).length,
    thisWeek: auditLogs.filter(log => {
      const date = parseInt(log.timestamp.split('/')[0]);
      return date >= 24 && date <= 26;
    }).length,
    bySeverity: {
      success: auditLogs.filter(log => log.severity === 'success').length,
      info: auditLogs.filter(log => log.severity === 'info').length,
      warning: auditLogs.filter(log => log.severity === 'warning').length,
      error: auditLogs.filter(log => log.severity === 'error').length,
    },
    byStatus: {
      aceptados: auditLogs.filter(log => log.status === 'Aceptados').length,
      enRevision: auditLogs.filter(log => log.status === 'En revisión').length,
      infoAdicional: auditLogs.filter(log => log.status === 'Información adicional').length,
      desactualizado: auditLogs.filter(log => log.status === 'Desactualizado').length,
      registro: auditLogs.filter(log => log.status === 'Registro').length,
      rechazado: auditLogs.filter(log => log.status === 'Rechazado').length,
    },
    byEntity: {
      certificaciones: auditLogs.filter(log => log.entity === 'Certificación').length,
      sistema: auditLogs.filter(log => log.entity === 'Sistema').length,
      cumplimiento: auditLogs.filter(log => log.entity === 'Cumplimiento').length,
      expediente: auditLogs.filter(log => log.entity === 'Expediente').length,
      documentos: auditLogs.filter(log => log.entity === 'Documentos').length,
    }
  };

  // Trazabilidad de certificaciones - SOLO LAS DOS CERTIFICACIONES
  const certificationTrace = [
    {
      id: 1,
      certification: 'Curso de Ética Profesional y Código de Conducta',
      status: 'En revisión',
      tipo: 'Curso de Ética',
      numero: 'CET-2025-001',
      fechaEmision: '15/06/2025',
      fechaVencimiento: '15/06/2028',
      horas: 20,
      subseccion: 'Formación Ética y Cumplimiento',
      documentos: [
        { nombre: 'certificado_etica_profesional.pdf', tipo: 'PDF', tamaño: '0.8 MB' }
      ],
      timeline: [
        { date: '15/06/2025 10:00', action: 'Certificación creada', user: 'Luis Rodríguez', status: 'Registro' },
        { date: '15/06/2025 10:30', action: 'Documento subido', user: 'Luis Rodríguez', status: 'Información adicional' },
        { date: '16/06/2025 14:15', action: 'Enviada a validación', user: 'Luis Rodríguez', status: 'En revisión' },
        { date: '20/06/2025 11:20', action: 'Aprobada por comité', user: 'María González', status: 'Aceptados' },
      ]
    },
    {
      id: 2,
      certification: 'Diplomado en Comercio Exterior y Legislación Aduanera',
      status: 'En revisión',
      tipo: 'Diplomado',
      numero: 'DCE-2025-002',
      fechaEmision: '10/02/2025',
      fechaVencimiento: '10/02/2028',
      horas: 80,
      subseccion: 'Actualización Técnica y Aduanera',
      documentos: [
        { nombre: 'diplomado_comercio_exterior.pdf', tipo: 'PDF', tamaño: '1.5 MB' }
      ],
      timeline: [
        { date: '10/02/2025 09:30', action: 'Registro inicial', user: 'Luis Rodríguez', status: 'Registro' },
        { date: '10/02/2025 10:45', action: 'Documento cargado', user: 'Luis Rodríguez', status: 'Información adicional' },
        { date: '12/02/2025 15:20', action: 'Enviado a validación', user: 'Luis Rodríguez', status: 'En revisión' },
        { date: '15/02/2025 14:30', action: 'Aprobado por comité', user: 'Carlos Martínez', status: 'Aceptados' },
      ]
    }
  ];

  // Modal de detalles de actividad
  const DetailModal = () => (
    <Dialog 
      open={detailModalOpen} 
      onClose={handleCloseDetailModal}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      {selectedLog && (
        <>
          <DialogTitle sx={{ 
            borderBottom: `1px solid ${colors.primary.main}20`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ color: getSeverityColor(selectedLog.severity) }}>
                {getActionIcon(selectedLog.action)}
              </Box>
              <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 'bold' }}>
                Detalles de la Actividad
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDetailModal} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ py: 3 }}>
            <Grid container spacing={3}>
              {/* Información principal */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ color: colors.primary.main, mb: 2, fontWeight: 'bold' }}>
                      Información General
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                        Acción realizada
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.primary, fontWeight: 'bold' }}>
                        {selectedLog.actionName}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                        Descripción completa
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.primary }}>
                        {selectedLog.details}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                        Fecha y hora
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.primary }}>
                        {selectedLog.timestamp}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                        Estado
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        {getStatusChip(selectedLog.status)}
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                        Severidad
                      </Typography>
                      <Chip 
                        label={selectedLog.severity}
                        size="small"
                        sx={{ 
                          bgcolor: `${getSeverityColor(selectedLog.severity)}15`,
                          color: getSeverityColor(selectedLog.severity),
                          fontSize: '0.75rem',
                          mt: 0.5
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Información de entidad y metadatos */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ color: colors.primary.main, mb: 2, fontWeight: 'bold' }}>
                      Entidad y Metadatos
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                        Entidad afectada
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.primary, fontWeight: 'bold' }}>
                        {selectedLog.entity}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                        ID de entidad
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.primary }}>
                        {selectedLog.entityId}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                        Usuario
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: colors.primary.main }}>
                          {selectedLog.user.avatar}
                        </Avatar>
                        <Typography variant="body2" sx={{ color: colors.text.primary }}>
                          {selectedLog.user.name} ({selectedLog.user.role})
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                        Dirección IP
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.primary }}>
                        {selectedLog.ipAddress || '192.168.1.105'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                        Dispositivo / Navegador
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.primary }}>
                        {selectedLog.device || 'Chrome / Windows'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${colors.primary.main}20` }}>
            <Button 
              onClick={handleCloseDetailModal}
              variant="outlined"
              sx={{ 
                textTransform: 'none',
                color: colors.primary.main,
                borderColor: colors.primary.main
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  // Modal de vista previa de certificación - VERSIÓN COMPACTA Y ORGANIZADA
  const CertPreviewModal = () => (
    <Dialog 
      open={certModalOpen} 
      onClose={handleCloseCertModal}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      {selectedCert && (
        <>
          {/* Header con gradiente */}
          <DialogTitle sx={{ 
            background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.primary.main} 100%)`,
            color: 'white',
            py: 2,
            px: 3
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <VerifiedIcon sx={{ fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {selectedCert.certification}
                </Typography>
              </Box>
              <IconButton onClick={handleCloseCertModal} size="small" sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ py: 2, px: 3, bgcolor: '#f8fafc' }}>
            {/* Fila de estado y fechas clave - MÁS COMPACTA */}
            <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'white', borderRadius: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%', 
                      bgcolor: `${statusConfig[selectedCert.status]?.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {statusConfig[selectedCert.status]?.icon || <InfoIcon sx={{ fontSize: 18 }} />}
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.7rem' }}>
                        Estado actual
                      </Typography>
                      <Box sx={{ mt: 0.25 }}>
                        {getStatusChip(selectedCert.status)}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CalendarIcon sx={{ fontSize: 18, color: colors.primary.main }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.7rem' }}>
                        Emisión
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: '500', fontSize: '0.9rem' }}>
                        {selectedCert.fechaEmision}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <UpdateIcon sx={{ fontSize: 18, color: colors.status.warning }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.7rem' }}>
                        Vencimiento
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: '500', fontSize: '0.9rem' }}>
                        {selectedCert.fechaVencimiento}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* SECCIÓN PRINCIPAL - DOS COLUMNAS ORGANIZADAS */}
            <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'white', borderRadius: 2 }}>
              <Grid container spacing={3}>
                {/* Columna izquierda - Detalles de Certificación */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ borderRight: { md: `1px solid ${colors.primary.main}20` }, pr: { md: 2 } }}>
                    <Typography variant="subtitle2" sx={{ 
                      color: colors.primary.main, 
                      mb: 1.5, 
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontSize: '0.9rem'
                    }}>
                      <FactCheckIcon sx={{ fontSize: 18 }} />
                      Detalles de la Certificación
                    </Typography>
                    
                    <Grid container spacing={1.5}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', fontSize: '0.7rem' }}>
                          Tipo
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: '500', fontSize: '0.9rem' }}>
                          {selectedCert.tipo}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', fontSize: '0.7rem' }}>
                          Número
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: '500', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                          {selectedCert.numero}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', fontSize: '0.7rem' }}>
                          Subsección
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                          {selectedCert.subseccion}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', fontSize: '0.7rem' }}>
                          Horas
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: colors.primary.main }}>
                          {selectedCert.horas} hrs
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                
                {/* Columna derecha - Información Adicional */}
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ 
                      color: colors.primary.main, 
                      mb: 1.5, 
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontSize: '0.9rem'
                    }}>
                      <DescriptionIcon sx={{ fontSize: 18 }} />
                      Información Adicional
                    </Typography>
                    
                    <Grid container spacing={1.5}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', fontSize: '0.7rem' }}>
                          Vigencia
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                          3 años
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', fontSize: '0.7rem' }}>
                          Ámbito
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                          Nacional
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', fontSize: '0.7rem' }}>
                          Autoridad
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                          {selectedCert.id === 1 ? 'Instituto de Ética Empresarial' : 'Universidad Aduanera de México'}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', fontSize: '0.7rem' }}>
                          Estatus
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.status.success, fontWeight: '500', fontSize: '0.9rem' }}>
                          Vigente
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Documentos asociados - MÁS COMPACTO */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ 
                color: colors.primary.main, 
                mb: 1.5, 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '0.9rem'
              }}>
                <DownloadIcon sx={{ fontSize: 18 }} />
                Documentos Asociados ({selectedCert.documents?.length || 1})
              </Typography>
              
              <Grid container spacing={1.5}>
                {selectedCert.documents.map((doc, index) => (
                  <Grid item xs={12} key={index}>
                    <Box 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        border: `1px solid ${colors.primary.main}20`,
                        borderRadius: 1,
                        '&:hover': {
                          borderColor: colors.primary.main,
                          bgcolor: '#f8f9fa'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {doc.tipo === 'PDF' ? 
                          <PdfIcon sx={{ color: colors.status.error, fontSize: 20 }} /> : 
                          <FileIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
                        }
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: '500', fontSize: '0.9rem' }}>
                            {doc.nombre}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.7rem' }}>
                            {doc.tipo} • {doc.tamaño}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box>
                        <Tooltip title="Ver">
                          <IconButton size="small" sx={{ color: colors.primary.main }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Descargar">
                          <IconButton size="small" sx={{ color: colors.status.success }}>
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </DialogContent>
          
          <DialogActions sx={{ 
            p: 2, 
            borderTop: `1px solid ${colors.primary.main}20`,
            bgcolor: '#f8fafc',
            justifyContent: 'flex-end',
            gap: 1
          }}>
            <Button 
              onClick={handleCloseCertModal}
              variant="outlined"
              size="small"
              sx={{ 
                textTransform: 'none',
                color: colors.primary.main,
                borderColor: colors.primary.main,
                px: 2
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  const renderAuditView = () => (
    <>
      {/* Estadísticas - Versión con CSS Grid */}
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

      {/* Filtros - Versión más ancha con CSS */}
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
          {/* Buscador - 25% */}
          <Grid 
            item 
            xs={12} 
            md={3}
            sx={{
              flexBasis: {
                md: '25%'
              },
              maxWidth: {
                md: '25%'
              }
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar en auditoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.primary.main,
                    }
                  }
                }
              }}
            />
          </Grid>
          
          {/* Tipo de Acción - 22% */}
          <Grid 
            item 
            xs={12} 
            md={2.5}
            sx={{
              flexBasis: {
                md: '18%'
              },
              maxWidth: {
                md: '18%'
              }
            }}
          >
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: colors.text.primary }}>Tipo de Acción</InputLabel>
              <Select
                value={filterType}
                label="Tipo de Acción"
                onChange={(e) => setFilterType(e.target.value)}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 1.5,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary.main,
                  }
                }}
              >
                {actionTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Entidad - 22% */}
          <Grid 
            item 
            xs={12} 
            md={2.5}
            sx={{
              flexBasis: {
                md: '18%'
              },
              maxWidth: {
                md: '18%'
              }
            }}
          >
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: colors.text.primary }}>Entidad</InputLabel>
              <Select
                value={filterEntity}
                label="Entidad"
                onChange={(e) => setFilterEntity(e.target.value)}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 1.5,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary.main,
                  }
                }}
              >
                {entities.map(entity => (
                  <MenuItem key={entity.value} value={entity.value}>{entity.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Estado - 18% */}
          <Grid 
            item 
            xs={12} 
            md={2}
            sx={{
              flexBasis: {
                md: '18%'
              },
              maxWidth: {
                md: '18%'
              }
            }}
          >
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: colors.text.primary }}>Estado</InputLabel>
              <Select
                value={filterStatus}
                label="Estado"
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 1.5,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary.main,
                  }
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
          
          {/* Botones - 13% */}
          <Grid 
            item 
            xs={12} 
            md={1.8}
            sx={{
              flexBasis: {
                md: '13%'
              },
              maxWidth: {
                md: '13%'
              }
            }}
          >
            <Stack direction="row" spacing={1}>
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
            </Stack>
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
              {paginatedLogs.map((log) => (
                <TableRow 
                  key={log.id}
                  hover
                  sx={{ 
                    '&:hover': { bgcolor: '#f8f9fa' },
                    borderLeft: `3px solid ${getSeverityColor(log.severity)}`
                  }}
                >
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.text.primary }}>
                        {log.timestamp.split(' ')[0]}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                        {log.timestamp.split(' ')[1]}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ color: getSeverityColor(log.severity) }}>
                        {getActionIcon(log.action)}
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: colors.text.primary }}>
                          {log.actionName}
                        </Typography>
                        <Chip 
                          label={log.severity}
                          size="small"
                          sx={{ 
                            bgcolor: `${getSeverityColor(log.severity)}15`,
                            color: getSeverityColor(log.severity),
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
                        {log.entity}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                        ID: {log.entityId}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    {getStatusChip(log.status)}
                  </TableCell>
                  
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        {log.details}
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        <Box sx={{ p: 2, borderTop: `1px solid ${colors.primary.main}20`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            Mostrando {((page - 1) * rowsPerPage) + 1} - {Math.min(page * rowsPerPage, filteredLogs.length)} de {filteredLogs.length} eventos
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
    </>
  );

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
              startIcon={<RefreshIcon />}
              size="small"
              onClick={() => window.location.reload()}
              sx={{
                bgcolor: colors.primary.main,
                '&:hover': { bgcolor: colors.primary.dark }
              }}
            >
              Actualizar
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
                  LR
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: colors.text.primary }}>
                    Luis Rodríguez - Agente Aduanal
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Nivel II • Miembro desde: 24/02/2024
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
        {renderAuditView()}

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
                    value={(stats.byStatus.aceptados / stats.total) * 100}
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
                    value={(stats.byStatus.enRevision / stats.total) * 100}
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
                    26 de febrero 2026:
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.today / stats.total) * 100}
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

      {/* Modales */}
      <DetailModal />
      <CertPreviewModal />
    </Box>
  );
};

export default AuditAgent;