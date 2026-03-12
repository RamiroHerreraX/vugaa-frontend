// src/pages/committee/AuditCommittee.jsx
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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge
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
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Update as UpdateIcon,
  Close as CloseIcon,
  Verified as VerifiedIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  HowToVote as HowToVoteIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon,
  CloudUpload as CloudUploadIcon,
  Downloading as DownloadingIcon
} from '@mui/icons-material';

// Paleta corporativa (misma que en CommitteeLayout)
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

const AuditCommittee = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterEntity, setFilterEntity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Estados para modales
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // Configuración de estados
  const statusConfig = {
    'Aprobado': {
      label: 'Aprobado',
      color: colors.status.success,
      bgColor: '#e8f5e9',
      icon: <CheckCircleIcon />,
      description: 'Acción completada exitosamente'
    },
    'Pendiente': {
      label: 'Pendiente',
      color: colors.status.warning,
      bgColor: '#fff3e0',
      icon: <PendingIcon />,
      description: 'Acción en proceso'
    },
    'Rechazado': {
      label: 'Rechazado',
      color: colors.status.error,
      bgColor: '#ffebee',
      icon: <ErrorIcon />,
      description: 'Acción no aprobada'
    },
    'Info': {
      label: 'Informativo',
      color: colors.primary.main,
      bgColor: '#e3f2fd',
      icon: <InfoIcon />,
      description: 'Evento informativo del sistema'
    }
  };

  // LOGS DE AUDITORÍA DEL COMITÉ - Acciones al revisar documentos de Luis Rodríguez
  const auditLogs = [
    {
      id: 1,
      timestamp: '26/02/2026 12:20:22',
      user: { name: 'María González', role: 'Presidente', avatar: 'MG' },
      action: 'ASSIGNMENT_CREATE',
      actionName: 'Asignación de revisión',
      entity: 'Certificación',
      entityId: 'CUR-ET-2026-001',
      details: 'Asignó la certificación "Curso de Ética Profesional" a sí misma',
      ipAddress: '192.168.1.120',
      device: 'Chrome / Windows',
      severity: 'info',
      status: 'Aprobado',
      icon: <AssignmentTurnedInIcon />,
      targetAgent: 'Luis Rodríguez',
      certificationType: 'Curso de Ética Profesional'
    },
    {
      id: 2,
      timestamp: '26/02/2026 12:18:10',
      user: { name: 'María González', role: 'Presidente', avatar: 'MG' },
      action: 'DOCUMENT_REVIEW_START',
      actionName: 'Inicio de revisión',
      entity: 'Documento',
      entityId: 'CUR-ET-2026-001',
      details: 'Comenzó la revisión del documento "Curso de Ética Profesional"',
      ipAddress: '192.168.1.120',
      device: 'Chrome / Windows',
      severity: 'info',
      status: 'Aprobado',
      icon: <VisibilityIcon />,
      targetAgent: 'Luis Rodríguez',
      certificationType: 'Curso de Ética Profesional'
    },
    {
      id: 3,
      timestamp: '26/02/2026 12:16:45',
      user: { name: 'María González', role: 'Presidente', avatar: 'MG' },
      action: 'DOCUMENT_APPROVE',
      actionName: 'Documento aprobado',
      entity: 'Documento',
      entityId: 'CUR-ET-2026-001',
      details: 'Aprobó el documento "Curso de Ética Profesional" - Documentación completa y válida',
      ipAddress: '192.168.1.120',
      device: 'Chrome / Windows',
      severity: 'success',
      status: 'Aprobado',
      icon: <ThumbUpIcon />,
      targetAgent: 'Luis Rodríguez',
      certificationType: 'Curso de Ética Profesional',
      comments: 'Documento en regla, firma válida, fechas correctas'
    },
    {
      id: 4,
      timestamp: '26/02/2026 11:05:33',
      user: { name: 'Juan Pérez', role: 'Vocal', avatar: 'JP' },
      action: 'DOCUMENT_REVIEW_START',
      actionName: 'Inicio de revisión',
      entity: 'Documento',
      entityId: 'DIP-CE-2026-001',
      details: 'Comenzó la revisión del documento "Diplomado en Comercio Exterior"',
      ipAddress: '192.168.1.121',
      device: 'Firefox / Windows',
      severity: 'info',
      status: 'Aprobado',
      icon: <VisibilityIcon />,
      targetAgent: 'Luis Rodríguez',
      certificationType: 'Diplomado Comercio Exterior'
    },
    {
      id: 5,
      timestamp: '26/02/2026 11:42:18',
      user: { name: 'Juan Pérez', role: 'Vocal', avatar: 'JP' },
      action: 'DOCUMENT_REJECT',
      actionName: 'Documento rechazado',
      entity: 'Documento',
      entityId: 'DIP-CE-2026-001',
      details: 'Rechazó el documento "Diplomado en Comercio Exterior" - Firma ilegible',
      ipAddress: '192.168.1.121',
      device: 'Firefox / Windows',
      severity: 'error',
      status: 'Rechazado',
      icon: <ThumbDownIcon />,
      targetAgent: 'Luis Rodríguez',
      certificationType: 'Diplomado Comercio Exterior',
      comments: 'La firma del participante no es legible, favor de subir documento con firma clara'
    },
    {
      id: 6,
      timestamp: '26/02/2026 12:05:47',
      user: { name: 'Laura Sánchez', role: 'Vocal', avatar: 'LS' },
      action: 'DOCUMENT_REVIEW_START',
      actionName: 'Inicio de revisión',
      entity: 'Documento',
      entityId: 'CUR-IVA-2026-001',
      details: 'Comenzó la revisión del documento "Materia del IVA - 60 horas"',
      ipAddress: '192.168.1.122',
      device: 'Chrome / MacOS',
      severity: 'info',
      status: 'Aprobado',
      icon: <VisibilityIcon />,
      targetAgent: 'Luis Rodríguez',
      certificationType: 'Materia del IVA'
    },
    {
      id: 7,
      timestamp: '26/02/2026 12:38:22',
      user: { name: 'Laura Sánchez', role: 'Vocal', avatar: 'LS' },
      action: 'DOCUMENT_APPROVE',
      actionName: 'Documento aprobado',
      entity: 'Documento',
      entityId: 'CUR-IVA-2026-001',
      details: 'Aprobó el documento "Materia del IVA" - Documento válido, institución reconocida',
      ipAddress: '192.168.1.122',
      device: 'Chrome / MacOS',
      severity: 'success',
      status: 'Aprobado',
      icon: <ThumbUpIcon />,
      targetAgent: 'Luis Rodríguez',
      certificationType: 'Materia del IVA',
      comments: 'Documento emitido por Universidad de Guanajuato, 60 horas, sello institucional visible'
    },
    {
      id: 8,
      timestamp: '26/02/2026 13:15:05',
      user: { name: 'María González', role: 'Presidente', avatar: 'MG' },
      action: 'CERTIFICATION_REVIEW_COMPLETE',
      actionName: 'Revisión completada',
      entity: 'Certificación',
      entityId: 'CUR-ET-2026-001',
      details: 'Completó la revisión de la certificación "Curso de Ética Profesional"',
      ipAddress: '192.168.1.120',
      device: 'Chrome / Windows',
      severity: 'success',
      status: 'Aprobado',
      icon: <AssessmentIcon />,
      targetAgent: 'Luis Rodríguez',
      certificationType: 'Curso de Ética Profesional',
      summary: 'Documento aprobado, pendiente votación colegiada'
    },
    {
      id: 9,
      timestamp: '26/02/2026 14:20:33',
      user: { name: 'Juan Pérez', role: 'Vocal', avatar: 'JP' },
      action: 'CERTIFICATION_VOTE',
      actionName: 'Voto emitido',
      entity: 'Votación',
      entityId: 'VOT-2026-001',
      details: 'Emitió voto a favor para la certificación "Curso de Ética Profesional"',
      ipAddress: '192.168.1.121',
      device: 'Firefox / Windows',
      severity: 'success',
      status: 'Aprobado',
      icon: <HowToVoteIcon />,
      targetAgent: 'Luis Rodríguez',
      certificationType: 'Curso de Ética Profesional',
      vote: 'A FAVOR'
    },
    {
      id: 10,
      timestamp: '26/02/2026 14:25:47',
      user: { name: 'Laura Sánchez', role: 'Vocal', avatar: 'LS' },
      action: 'CERTIFICATION_VOTE',
      actionName: 'Voto emitido',
      entity: 'Votación',
      entityId: 'VOT-2026-001',
      details: 'Emitió voto a favor para la certificación "Curso de Ética Profesional"',
      ipAddress: '192.168.1.122',
      device: 'Chrome / MacOS',
      severity: 'success',
      status: 'Aprobado',
      icon: <HowToVoteIcon />,
      targetAgent: 'Luis Rodríguez',
      certificationType: 'Curso de Ética Profesional',
      vote: 'A FAVOR'
    },
    {
      id: 11,
      timestamp: '26/02/2026 14:30:12',
      user: { name: 'María González', role: 'Presidente', avatar: 'MG' },
      action: 'CERTIFICATION_FINALIZE',
      actionName: 'Certificación finalizada',
      entity: 'Certificación',
      entityId: 'CUR-ET-2026-001',
      details: 'Finalizó el proceso de certificación - APROBADA POR UNANIMIDAD',
      ipAddress: '192.168.1.120',
      device: 'Chrome / Windows',
      severity: 'success',
      status: 'Aprobado',
      icon: <VerifiedIcon />,
      targetAgent: 'Luis Rodríguez',
      certificationType: 'Curso de Ética Profesional',
      finalResult: 'APROBADA (3 votos a favor)'
    },
    {
      id: 12,
      timestamp: '26/02/2026 15:05:18',
      user: { name: 'María González', role: 'Presidente', avatar: 'MG' },
      action: 'COMMENT_ADD',
      actionName: 'Observación añadida',
      entity: 'Certificación',
      entityId: 'DIP-CE-2026-001',
      details: 'Añadió observación: "Solicitar nuevamente documento con firma legible"',
      ipAddress: '192.168.1.120',
      device: 'Chrome / Windows',
      severity: 'info',
      status: 'Info',
      icon: <InfoIcon />,
      targetAgent: 'Luis Rodríguez',
      certificationType: 'Diplomado Comercio Exterior'
    },
    {
      id: 13,
      timestamp: '26/02/2026 15:45:00',
      user: { name: 'Laura Sánchez', role: 'Vocal', avatar: 'LS' },
      action: 'CERTIFICATION_VOTE',
      actionName: 'Voto emitido',
      entity: 'Votación',
      entityId: 'VOT-2026-002',
      details: 'Emitió voto a favor para la certificación "Materia del IVA"',
      ipAddress: '192.168.1.122',
      device: 'Chrome / MacOS',
      severity: 'success',
      status: 'Aprobado',
      icon: <HowToVoteIcon />,
      targetAgent: 'Luis Rodríguez',
      certificationType: 'Materia del IVA',
      vote: 'A FAVOR'
    },
    {
      id: 14,
      timestamp: '26/02/2026 15:50:22',
      user: { name: 'Juan Pérez', role: 'Vocal', avatar: 'JP' },
      action: 'CERTIFICATION_VOTE',
      actionName: 'Voto emitido',
      entity: 'Votación',
      entityId: 'VOT-2026-002',
      details: 'Emitió voto a favor para la certificación "Materia del IVA"',
      ipAddress: '192.168.1.121',
      device: 'Firefox / Windows',
      severity: 'success',
      status: 'Aprobado',
      icon: <HowToVoteIcon />,
      targetAgent: 'Luis Rodríguez',
      certificationType: 'Materia del IVA',
      vote: 'A FAVOR'
    },
    {
      id: 15,
      timestamp: '26/02/2026 16:00:45',
      user: { name: 'María González', role: 'Presidente', avatar: 'MG' },
      action: 'CERTIFICATION_FINALIZE',
      actionName: 'Certificación finalizada',
      entity: 'Certificación',
      entityId: 'CUR-IVA-2026-001',
      details: 'Finalizó el proceso de certificación - APROBADA POR UNANIMIDAD',
      ipAddress: '192.168.1.120',
      device: 'Chrome / Windows',
      severity: 'success',
      status: 'Aprobado',
      icon: <VerifiedIcon />,
      targetAgent: 'Luis Rodríguez',
      certificationType: 'Materia del IVA',
      finalResult: 'APROBADA (3 votos a favor)'
    },
    {
      id: 16,
      timestamp: '26/02/2026 09:30:00',
      user: { name: 'Sistema', role: 'Automático', avatar: 'S' },
      action: 'NOTIFICATION_SENT',
      actionName: 'Notificación enviada',
      entity: 'Sistema',
      entityId: 'NOT-2026-001',
      details: 'Se notificó a Luis Rodríguez sobre el inicio de revisión de sus documentos',
      ipAddress: 'Sistema',
      device: 'Sistema',
      severity: 'info',
      status: 'Info',
      icon: <InfoIcon />,
      targetAgent: 'Luis Rodríguez'
    },
    {
      id: 17,
      timestamp: '26/02/2026 12:45:00',
      user: { name: 'Sistema', role: 'Automático', avatar: 'S' },
      action: 'NOTIFICATION_SENT',
      actionName: 'Notificación enviada',
      entity: 'Sistema',
      entityId: 'NOT-2026-002',
      details: 'Se notificó a Luis Rodríguez sobre el rechazo del documento "Diplomado en Comercio Exterior"',
      ipAddress: 'Sistema',
      device: 'Sistema',
      severity: 'warning',
      status: 'Info',
      icon: <WarningIcon />,
      targetAgent: 'Luis Rodríguez'
    },
    {
      id: 18,
      timestamp: '26/02/2026 16:10:00',
      user: { name: 'Sistema', role: 'Automático', avatar: 'S' },
      action: 'NOTIFICATION_SENT',
      actionName: 'Notificación enviada',
      entity: 'Sistema',
      entityId: 'NOT-2026-003',
      details: 'Se notificó a Luis Rodríguez sobre la aprobación de 2 certificaciones',
      ipAddress: 'Sistema',
      device: 'Sistema',
      severity: 'success',
      status: 'Info',
      icon: <CheckCircleIcon />,
      targetAgent: 'Luis Rodríguez'
    }
  ];

  // Tipos de acciones del comité
  const actionTypes = [
    { value: 'all', label: 'Todas las acciones' },
    { value: 'ASSIGNMENT', label: 'Asignaciones' },
    { value: 'DOCUMENT', label: 'Revisión de documentos' },
    { value: 'VOTE', label: 'Votaciones' },
    { value: 'CERTIFICATION', label: 'Certificaciones' },
    { value: 'NOTIFICATION', label: 'Notificaciones' }
  ];

  // Entidades del comité
  const entities = [
    { value: 'all', label: 'Todas las entidades' },
    { value: 'Certificación', label: 'Certificaciones' },
    { value: 'Documento', label: 'Documentos' },
    { value: 'Votación', label: 'Votaciones' },
    { value: 'Sistema', label: 'Sistema' }
  ];

  // Filtro de estados
  const statusFilter = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'Aprobado', label: 'Aprobado' },
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Rechazado', label: 'Rechazado' },
    { value: 'Info', label: 'Informativo' }
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
    if (action.includes('ASSIGNMENT')) return <AssignmentTurnedInIcon />;
    if (action.includes('DOCUMENT_APPROVE')) return <ThumbUpIcon />;
    if (action.includes('DOCUMENT_REJECT')) return <ThumbDownIcon />;
    if (action.includes('DOCUMENT_REVIEW')) return <VisibilityIcon />;
    if (action.includes('VOTE')) return <HowToVoteIcon />;
    if (action.includes('CERTIFICATION_FINALIZE')) return <VerifiedIcon />;
    if (action.includes('COMMENT')) return <InfoIcon />;
    if (action.includes('NOTIFICATION')) return <InfoIcon />;
    return <GavelIcon />;
  };

  const getStatusChip = (status) => {
    const config = statusConfig[status] || statusConfig['Info'];
    
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

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.actionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.targetAgent && log.targetAgent.toLowerCase().includes(searchTerm.toLowerCase()));
    
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

  // Estadísticas específicas para el comité
  const stats = {
    total: auditLogs.length,
    today: auditLogs.filter(log => log.timestamp.includes('26/02/2026')).length,
    bySeverity: {
      success: auditLogs.filter(log => log.severity === 'success').length,
      info: auditLogs.filter(log => log.severity === 'info').length,
      warning: auditLogs.filter(log => log.severity === 'warning').length,
      error: auditLogs.filter(log => log.severity === 'error').length,
    },
    byAction: {
      assignments: auditLogs.filter(log => log.action.includes('ASSIGNMENT')).length,
      reviews: auditLogs.filter(log => log.action.includes('DOCUMENT')).length,
      votes: auditLogs.filter(log => log.action.includes('VOTE')).length,
      finalizations: auditLogs.filter(log => log.action.includes('FINALIZE')).length,
    },
    byAgent: {
      luisRodriguez: auditLogs.filter(log => log.targetAgent === 'Luis Rodríguez').length,
    },
    byMember: {
      maria: auditLogs.filter(log => log.user.name === 'María González').length,
      juan: auditLogs.filter(log => log.user.name === 'Juan Pérez').length,
      laura: auditLogs.filter(log => log.user.name === 'Laura Sánchez').length,
    }
  };

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
                      {selectedLog.comments && (
                        <Alert severity="info" sx={{ mt: 1, fontSize: '0.8rem' }}>
                          <strong>Comentario:</strong> {selectedLog.comments}
                        </Alert>
                      )}
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                        Fecha y hora
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.primary }}>
                        {selectedLog.timestamp}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                        Estado
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        {getStatusChip(selectedLog.status)}
                      </Box>
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
                      <Typography variant="body2" sx={{ color: colors.text.primary, fontFamily: 'monospace' }}>
                        {selectedLog.entityId}
                      </Typography>
                    </Box>

                    {selectedLog.targetAgent && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                          Agente involucrado
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.text.primary, fontWeight: 'bold' }}>
                          {selectedLog.targetAgent}
                        </Typography>
                      </Box>
                    )}

                    {selectedLog.certificationType && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                          Tipo de certificación
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.text.primary }}>
                          {selectedLog.certificationType}
                        </Typography>
                      </Box>
                    )}

                    {selectedLog.vote && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                          Sentido del voto
                        </Typography>
                        <Chip 
                          label={selectedLog.vote}
                          size="small"
                          color={selectedLog.vote === 'A FAVOR' ? 'success' : 'error'}
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                    )}
                    
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
                        {selectedLog.ipAddress}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                        Dispositivo / Navegador
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.primary }}>
                        {selectedLog.device}
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

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: colors.primary.dark, fontWeight: 'bold', mb: 0.5 }}>
              Auditoría - Comité de Cumplimiento
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Registro de actividades del comité en las certificaciones de agentes
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

        {/* Tarjeta resumen de actividad de hoy */}
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
                  C
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: colors.text.primary }}>
                    Actividad del Comité - 26 de Febrero 2026
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Se revisaron certificaciones de Luis Rodríguez • {stats.byAgent.luisRodriguez} eventos registrados
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <Chip 
                  icon={<CheckCircleIcon />}
                  label={`${stats.byAction.finalizations} aprobadas`}
                  size="small"
                  sx={{ 
                    bgcolor: '#e8f5e9',
                    color: colors.status.success,
                    borderColor: colors.status.success
                  }}
                  variant="outlined"
                />
                <Chip 
                  icon={<GavelIcon />}
                  label={`${stats.byAction.reviews} revisiones`}
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
        <Grid container spacing={2} alignItems="center">
          {/* Buscador */}
          <Grid item xs={12} md={3}>
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
          
          {/* Tipo de Acción */}
          <Grid item xs={12} md={2.5}>
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
          
          {/* Entidad */}
          <Grid item xs={12} md={2.5}>
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
          
          {/* Estado */}
          <Grid item xs={12} md={2}>
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
          
          {/* Botones */}
          <Grid item xs={12} md={1.8}>
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

      {/* Estadísticas rápidas */}
      <Box sx={{ width: '100%', mb: 3 }}>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr 1fr',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(6, 1fr)'
          },
          gap: 1.5
        }}>
          <Card sx={{ borderLeft: `4px solid ${colors.primary.main}` }}>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: colors.primary.main, fontWeight: 'bold', mb: 0.5 }}>
                {stats.total}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                Total Eventos
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ borderLeft: `4px solid ${colors.status.success}` }}>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: colors.status.success, fontWeight: 'bold', mb: 0.5 }}>
                {stats.byAction.finalizations}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                Aprobaciones
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ borderLeft: `4px solid ${colors.status.error}` }}>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: colors.status.error, fontWeight: 'bold', mb: 0.5 }}>
                {auditLogs.filter(l => l.severity === 'error').length}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                Rechazos
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ borderLeft: `4px solid ${colors.status.warning}` }}>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: colors.status.warning, fontWeight: 'bold', mb: 0.5 }}>
                {stats.byAction.votes}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                Votos Emitidos
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ borderLeft: `4px solid ${colors.accents.purple}` }}>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: colors.accents.purple, fontWeight: 'bold', mb: 0.5 }}>
                {stats.byMember.maria + stats.byMember.juan + stats.byMember.laura}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                Miembros Activos
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ borderLeft: `4px solid ${colors.accents.blue}` }}>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: colors.accents.blue, fontWeight: 'bold', mb: 0.5 }}>
                {stats.today}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                Eventos Hoy
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

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
            Actividades del Comité - {filteredLogs.length} eventos
          </Typography>
          
          <Stack direction="row" spacing={1}>
            <Chip 
              label={`Agente: Luis Rodríguez`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ color: colors.primary.main, borderColor: colors.primary.main }}
            />
            <Chip 
              label={`${stats.byAgent.luisRodriguez} eventos relacionados`}
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
                <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, width: '10%' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, width: '30%' }}>Detalles</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, width: '10%' }} align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedLogs.map((log) => (
                <TableRow 
                  key={log.id}
                  hover
                  sx={{ 
                    '&:hover': { bgcolor: '#f8f9fa' },
                    borderLeft: `3px solid ${getSeverityColor(log.severity)}`,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleOpenDetailModal(log)}
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
                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                          {log.user.name} • {log.user.role}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'medium', color: colors.text.primary }}>
                        {log.entity}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, fontFamily: 'monospace' }}>
                        {log.entityId}
                      </Typography>
                      {log.certificationType && (
                        <Chip 
                          label={log.certificationType}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            mt: 0.5,
                            height: 18,
                            fontSize: '0.6rem',
                            color: colors.text.secondary,
                            borderColor: colors.primary.light
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    {getStatusChip(log.status)}
                  </TableCell>
                  
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: log.severity === 'error' ? 'bold' : 'normal' }}>
                        {log.details.length > 60 ? `${log.details.substring(0, 60)}...` : log.details}
                      </Typography>
                      {log.targetAgent && (
                        <Chip 
                          label={`Agente: ${log.targetAgent}`}
                          size="small"
                          sx={{ 
                            mt: 0.5,
                            height: 18,
                            fontSize: '0.6rem',
                            bgcolor: '#e3f2fd',
                            color: colors.primary.main
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  
                  <TableCell align="right">
                    <Tooltip title="Ver detalles completos">
                      <IconButton 
                        size="small" 
                        sx={{ color: colors.primary.main }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetailModal(log);
                        }}
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

      {/* Nota informativa */}
      <Paper elevation={0} sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa' }}>
        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
          <strong>Nota:</strong> Este registro muestra todas las acciones realizadas por el Comité de Cumplimiento en las certificaciones del agente Luis Rodríguez. 
          Se incluyen asignaciones, revisiones de documentos, votaciones y aprobaciones finales. 
          Los registros se mantienen por 5 años según normativa vigente.
        </Typography>
      </Paper>

      {/* Modales */}
      <DetailModal />
    </Box>
  );
};

export default AuditCommittee;