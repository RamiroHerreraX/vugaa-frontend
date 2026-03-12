// src/pages/committee/CommitteeReview.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Stack,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Badge,
  Avatar,
  LinearProgress,
  Divider,
  InputAdornment,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Gavel as GavelIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Place as PlaceIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
  ViewColumn as ViewColumnIcon,
  MoreVert as MoreVertIcon,
  Timer as TimerIcon,
  PriorityHigh as PriorityHighIcon,
  Assignment as AssignmentIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  AutoAwesome as AutoAwesomeIcon,
  Insights as InsightsIcon,
  FolderOpen as FolderOpenIcon,
  CalendarMonth as CalendarMonthIcon,
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

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

const CommitteeReview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [activeView, setActiveView] = useState('list');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [batchActionDialog, setBatchActionDialog] = useState(false);
  const [showStats, setShowStats] = useState(true);

  // Datos mock mejorados para revisión
  const certifications = [
    { 
      id: 1, 
      type: 'FORMACIÓN ETICA Y CUMPLIMIENTO Y ACTUALIZACIÓN TÉCNICA ADUANERA', 
      code: 'PA-2026-00145',
      applicant: { 
        name: 'Luis Rodríguez', 
        type: 'agente', 
        avatar: 'LR',
        complianceScore: 85,
        level: 'Avanzado'
      }, 
      region: 'Norte', 
      uploadDate: '15/01/2026',
      daysPending: 2,
      dueDate: '17/01/2026',
      status: 'PENDIENTE', 
      priority: 'ALTA',
      documents: { total: 5, completed: 4, pending: 1 },
      category: 'Regulatoria',
      assignedTo: 'María González',
      lastActivity: 'Hace 2 horas',
      reviewEstimate: '1.5 horas',
      color: colors.primary.main
    },
    { 
      id: 2, 
      type: 'OPINIÓN SAT POSITIVA', 
      code: 'OS-2025-03421',
      applicant: { 
        name: 'Carlos Martínez', 
        type: 'empresario', 
        avatar: 'CM',
        complianceScore: 78,
        level: 'Intermedio'
      }, 
      region: 'Sur', 
      uploadDate: '14/01/2026',
      daysPending: 3,
      dueDate: '28/01/2026',
      status: 'EN REVISIÓN', 
      priority: 'ALTA',
      documents: { total: 3, completed: 3, pending: 0 },
      category: 'Fiscal',
      assignedTo: 'Carlos Ruiz',
      lastActivity: 'En progreso',
      reviewEstimate: '45 minutos',
      color: colors.secondary.main
    },
    { 
      id: 3, 
      type: 'CÉDULA PROFESIONAL', 
      code: 'CP-2024-56789',
      applicant: { 
        name: 'Ana López', 
        type: 'profesionista', 
        avatar: 'AL',
        complianceScore: 92,
        level: 'Avanzado'
      }, 
      region: 'Centro', 
      uploadDate: '13/01/2026',
      daysPending: 4,
      dueDate: '25/01/2026',
      status: 'PENDIENTE', 
      priority: 'MEDIA',
      documents: { total: 4, completed: 2, pending: 2 },
      category: 'Profesional',
      assignedTo: 'Laura Díaz',
      lastActivity: 'Hace 1 día',
      reviewEstimate: '2 horas',
      color: colors.accents.purple
    },
    { 
      id: 4, 
      type: 'PODER NOTARIAL', 
      code: 'PN-2025-12345',
      applicant: { 
        name: 'Pedro Sánchez', 
        type: 'agente', 
        avatar: 'PS',
        complianceScore: 65,
        level: 'Básico'
      }, 
      region: 'Metropolitana', 
      uploadDate: '12/01/2026',
      daysPending: 5,
      dueDate: '18/01/2026',
      status: 'REQUIERE INFO', 
      priority: 'ALTA',
      documents: { total: 2, completed: 1, pending: 1 },
      category: 'Legal',
      assignedTo: 'Pedro Sánchez',
      lastActivity: 'Esperando respuesta',
      reviewEstimate: '30 minutos',
      color: colors.status.warning
    },
    { 
      id: 5, 
      type: 'CONSTANCIA FISCAL', 
      code: 'CF-2025-78901',
      applicant: { 
        name: 'Laura Díaz', 
        type: 'profesionista', 
        avatar: 'LD',
        complianceScore: 88,
        level: 'Avanzado'
      }, 
      region: 'Norte', 
      uploadDate: '11/01/2026',
      daysPending: 6,
      dueDate: '20/01/2026',
      status: 'PENDIENTE', 
      priority: 'MEDIA',
      documents: { total: 6, completed: 5, pending: 1 },
      category: 'Fiscal',
      assignedTo: 'Ana López',
      lastActivity: 'Hace 2 días',
      reviewEstimate: '1 hora',
      color: colors.accents.blue
    },
  ];

  // Estadísticas dinámicas
  const calculateStats = () => {
    const urgentThreshold = 3;
    
    return {
      total: certifications.length,
      pending: certifications.filter(c => c.status === 'PENDIENTE').length,
      inReview: certifications.filter(c => c.status === 'EN REVISIÓN').length,
      requiresInfo: certifications.filter(c => c.status === 'REQUIERE INFO').length,
      highPriority: certifications.filter(c => c.priority === 'ALTA').length,
      urgent: certifications.filter(c => c.daysPending <= urgentThreshold).length,
      assignedToMe: certifications.filter(c => c.assignedTo === 'María González').length,
      avgReviewTime: '1.8'
    };
  };

  const stats = calculateStats();

  // Filtros y opciones
  const statusOptions = ['PENDIENTE', 'EN REVISIÓN', 'REQUIERE INFO', 'APROBADA', 'RECHAZADA'];
  const priorityOptions = ['ALTA', 'MEDIA', 'BAJA'];
  const regionOptions = ['Norte', 'Centro', 'Sur', 'Metropolitana', 'Occidente'];
  const typeOptions = ['FORMACIÓN ETICA Y CUMPLIMIENTO', 'OPINIÓN SAT', 'CÉDULA PROFESIONAL', 'PODER NOTARIAL', 'CONSTANCIA FISCAL'];
  const categoryOptions = ['Regulatoria', 'Fiscal', 'Legal', 'Profesional'];

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDIENTE': return 'warning';
      case 'EN REVISIÓN': return 'info';
      case 'REQUIERE INFO': return 'error';
      case 'APROBADA': return 'success';
      case 'RECHAZADA': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'ALTA': return 'error';
      case 'MEDIA': return 'warning';
      case 'BAJA': return 'success';
      default: return 'default';
    }
  };

  const getDaysColor = (days) => {
    if (days <= 2) return colors.status.error;
    if (days <= 4) return colors.status.warning;
    return colors.status.success;
  };

  const getComplianceColor = (score) => {
    if (score >= 85) return colors.status.success;
    if (score >= 70) return colors.status.warning;
    return colors.status.error;
  };

  // Filtrado y ordenamiento
  const filteredCertifications = certifications.filter(cert => {
    const matchesSearch = 
      cert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || cert.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || cert.priority === filterPriority;
    const matchesRegion = filterRegion === 'all' || cert.region === filterRegion;
    const matchesType = filterType === 'all' || cert.type.includes(filterType);

    return matchesSearch && matchesStatus && matchesPriority && matchesRegion && matchesType;
  });

  // Ordenamiento
  const sortedCertifications = [...filteredCertifications].sort((a, b) => {
    switch(sortBy) {
      case 'priority':
        const priorityOrder = { 'ALTA': 0, 'MEDIA': 1, 'BAJA': 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'days':
        return a.daysPending - b.daysPending;
      case 'date':
        return new Date(b.uploadDate.split('/').reverse().join('-')) - 
               new Date(a.uploadDate.split('/').reverse().join('-'));
      case 'compliance':
        return b.applicant.complianceScore - a.applicant.complianceScore;
      default:
        return 0;
    }
  });

  // Manejo de selección múltiple
  const handleRowSelect = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === sortedCertifications.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(sortedCertifications.map(cert => cert.id));
    }
  };

  const handleBatchAction = (action) => {
    console.log(`Acción ${action} en certificaciones:`, selectedRows);
    setBatchActionDialog(false);
    setSelectedRows([]);
  };

  // KPI Items para la cabecera de la tabla
  const kpiItems = [
    { 
      label: 'Urgentes', 
      value: stats.urgent, 
      color: colors.status.error, 
      icon: <PriorityHighIcon fontSize="small" />,
      tooltip: 'Vencen en 3 días o menos'
    },
    { 
      label: 'Pendientes', 
      value: stats.pending, 
      color: colors.status.warning, 
      icon: <TimerIcon fontSize="small" />,
      tooltip: 'Pendientes de revisión'
    },
    { 
      label: 'Asignadas a mí', 
      value: stats.assignedToMe, 
      color: colors.primary.main, 
      icon: <AssignmentIcon fontSize="small" />,
      tooltip: 'Asignadas a tu usuario'
    },
    { 
      label: 'Alta Prioridad', 
      value: stats.highPriority, 
      color: colors.accents.purple, 
      icon: <WarningIcon fontSize="small" />,
      tooltip: 'Prioridad ALTA'
    },
    { 
      label: 'Tiempo Prom.', 
      value: stats.avgReviewTime, 
      color: colors.accents.blue, 
      icon: <SpeedIcon fontSize="small" />,
      tooltip: 'Horas promedio'
    },
    { 
      label: 'Total', 
      value: stats.total, 
      color: colors.status.success, 
      icon: <FolderOpenIcon fontSize="small" />,
      tooltip: 'Total activas'
    },
  ];

  return (
    <Box sx={{ 
      height: '100vh',
      bgcolor: colors.background.subtle,
      display: 'flex',
      flexDirection: 'column',
      p: 2
    }}>
      {/* Header minimalista */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <GavelIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
            Revisión de Certificaciones
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            Validación individual de certificaciones - Comité de Cumplimiento {sortedCertifications.length} registros
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={1}>
          <Tooltip title={showStats ? "Ocultar estadísticas" : "Mostrar estadísticas"}>
            <IconButton 
              size="small" 
              onClick={() => setShowStats(!showStats)}
              sx={{ color: showStats ? colors.primary.main : colors.text.secondary }}
            >
              <InsightsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={showFilters ? "Ocultar filtros" : "Mostrar filtros"}>
            <IconButton 
              size="small" 
              onClick={() => setShowFilters(!showFilters)}
              sx={{ color: showFilters ? colors.primary.main : colors.text.secondary }}
            >
              <FilterIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {selectedRows.length > 0 && (
            <Button
              variant="contained"
              size="small"
              startIcon={<AssignmentIcon />}
              onClick={() => setBatchActionDialog(true)}
              sx={{ 
                bgcolor: colors.primary.main,
                '&:hover': { bgcolor: colors.primary.dark },
                height: 32
              }}
            >
              {selectedRows.length} seleccionadas
            </Button>
          )}
        </Stack>
      </Box>

      {/* Tabla principal que contiene TODO */}
      <Paper elevation={2} sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
        borderRadius: 2
      }}>
        
        {/* SECCIÓN 1: KPI - Integrados en la tabla */}
        {showStats && (
          <Box sx={{ 
            p: 1.5,
            borderBottom: `1px solid ${alpha(colors.primary.main, 0.1)}`,
            bgcolor: alpha(colors.primary.main, 0.02)
          }}>
            <Grid container spacing={1}>
              {kpiItems.map((kpi, index) => (
                <Grid item xs={2} key={index}>
                  <Tooltip title={kpi.tooltip} arrow>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 0.5,
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: alpha(kpi.color, 0.1) }
                    }}>
                      <Avatar sx={{ 
                        width: 28, 
                        height: 28, 
                        bgcolor: alpha(kpi.color, 0.1),
                        color: kpi.color
                      }}>
                        {kpi.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', lineHeight: 1.2 }}>
                          {kpi.label}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: kpi.color, fontWeight: 'bold' }}>
                          {kpi.value}{kpi.label === 'Tiempo Prom.' ? 'h' : ''}
                        </Typography>
                      </Box>
                    </Box>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* SECCIÓN 2: Barra de búsqueda y filtros rápidos - Integrada */}
        <Box sx={{ 
          p: 1.5,
          borderBottom: `1px solid ${alpha(colors.primary.main, 0.1)}`,
          bgcolor: alpha(colors.primary.main, 0.02)
        }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar por certificación, solicitante o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: colors.text.secondary }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                    '& fieldset': { borderColor: alpha(colors.primary.main, 0.2) }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={6} sm={2}>
              <FormControl fullWidth size="small">
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  displayEmpty
                  sx={{ bgcolor: 'white' }}
                  renderValue={(selected) => {
                    if (selected === 'all') return <Typography color="textSecondary">Estado: Todos</Typography>;
                    return selected;
                  }}
                >
                  <MenuItem value="all">Todos los estados</MenuItem>
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6} sm={2}>
              <FormControl fullWidth size="small">
                <Select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  displayEmpty
                  sx={{ bgcolor: 'white' }}
                  renderValue={(selected) => {
                    if (selected === 'all') return <Typography color="textSecondary">Prioridad: Todas</Typography>;
                    return selected;
                  }}
                >
                  <MenuItem value="all">Todas las prioridades</MenuItem>
                  {priorityOptions.map(priority => (
                    <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6} sm={2}>
              <FormControl fullWidth size="small">
                <Select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  displayEmpty
                  sx={{ bgcolor: 'white' }}
                  renderValue={(selected) => {
                    if (selected === 'all') return <Typography color="textSecondary">Región: Todas</Typography>;
                    return selected;
                  }}
                >
                  <MenuItem value="all">Todas las regiones</MenuItem>
                  {regionOptions.map(region => (
                    <MenuItem key={region} value={region}>{region}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6} sm={2}>
              <FormControl fullWidth size="small">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  displayEmpty
                  sx={{ bgcolor: 'white' }}
                  renderValue={(selected) => {
                    const labels = { priority: 'Prioridad', days: 'Días', date: 'Fecha', compliance: 'Cumplimiento' };
                    return `Orden: ${labels[selected]}`;
                  }}
                >
                  <MenuItem value="priority">Por Prioridad</MenuItem>
                  <MenuItem value="days">Por Días pendientes</MenuItem>
                  <MenuItem value="date">Por Fecha de carga</MenuItem>
                  <MenuItem value="compliance">Por Cumplimiento</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Filtros expandidos */}
          {showFilters && (
            <Box sx={{ 
              mt: 1.5,
              pt: 1.5,
              borderTop: `1px dashed ${alpha(colors.primary.main, 0.2)}`,
              display: 'flex',
              gap: 1,
              alignItems: 'center'
            }}>
              <Chip 
                label="Tipo: Todos" 
                size="small"
                onClick={() => {}}
                onDelete={() => {}}
                deleteIcon={<KeyboardArrowDownIcon />}
                sx={{ bgcolor: 'white' }}
              />
              <Chip 
                label="Categoría: Todas" 
                size="small"
                onClick={() => {}}
                onDelete={() => {}}
                deleteIcon={<KeyboardArrowDownIcon />}
                sx={{ bgcolor: 'white' }}
              />
              <Chip 
                label="Asignado: Cualquiera" 
                size="small"
                onClick={() => {}}
                onDelete={() => {}}
                deleteIcon={<KeyboardArrowDownIcon />}
                sx={{ bgcolor: 'white' }}
              />
              <Button 
                size="small" 
                startIcon={<RefreshIcon />}
                onClick={() => {
                  setFilterStatus('all');
                  setFilterPriority('all');
                  setFilterRegion('all');
                  setFilterType('all');
                  setSearchTerm('');
                  setSortBy('priority');
                }}
                sx={{ color: colors.text.secondary, ml: 'auto' }}
              >
                Limpiar
              </Button>
            </Box>
          )}
        </Box>

        {/* SECCIÓN 3: Tabla de datos - Ocupa el resto del espacio */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <TableContainer sx={{ height: '100%' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ bgcolor: colors.background.subtle, width: 30 }}>
                    <input
                      type="checkbox"
                      checked={selectedRows.length === sortedCertifications.length && sortedCertifications.length > 0}
                      onChange={handleSelectAll}
                      style={{ cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, bgcolor: colors.background.subtle }}>Certificación</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, bgcolor: colors.background.subtle }}>Solicitante</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, bgcolor: colors.background.subtle }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, bgcolor: colors.background.subtle }}>Tiempo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, bgcolor: colors.background.subtle }}>Docs</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, bgcolor: colors.background.subtle }} align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedCertifications.map((cert) => (
                  <TableRow 
                    key={cert.id} 
                    hover
                    selected={selectedRows.includes(cert.id)}
                    onClick={() => handleRowSelect(cert.id)}
                    sx={{ 
                      cursor: 'pointer',
                      borderLeft: `3px solid ${cert.color}`,
                      '&.Mui-selected': {
                        bgcolor: alpha(colors.primary.main, 0.08),
                        '&:hover': { bgcolor: alpha(colors.primary.main, 0.12) }
                      }
                    }}
                  >
                    <TableCell padding="checkbox">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(cert.id)}
                        onChange={() => handleRowSelect(cert.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                          {cert.type.length > 40 ? cert.type.substring(0, 40) + '...' : cert.type}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, fontFamily: 'monospace' }}>
                          {cert.code}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: colors.primary.main }}>
                          {cert.applicant.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                            {cert.applicant.name}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={cert.applicant.complianceScore}
                            sx={{ 
                              width: 50, 
                              height: 3,
                              borderRadius: 1,
                              bgcolor: alpha(colors.primary.main, 0.1),
                              '& .MuiLinearProgress-bar': {
                                bgcolor: getComplianceColor(cert.applicant.complianceScore)
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Chip 
                          label={cert.status}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            bgcolor: cert.status === 'PENDIENTE' ? alpha(colors.status.warning, 0.1) :
                                    cert.status === 'EN REVISIÓN' ? alpha(colors.accents.blue, 0.1) :
                                    cert.status === 'REQUIERE INFO' ? alpha(colors.status.error, 0.1) :
                                    alpha(colors.primary.main, 0.1),
                            color: cert.status === 'PENDIENTE' ? colors.status.warning :
                                   cert.status === 'EN REVISIÓN' ? colors.accents.blue :
                                   cert.status === 'REQUIERE INFO' ? colors.status.error :
                                   colors.primary.main,
                            fontWeight: 'bold',
                          }}
                        />
                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                          {cert.priority}
                        </Typography>
                      </Stack>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: getDaysColor(cert.daysPending) }}>
                        {cert.daysPending} días
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                        Vence: {cert.dueDate}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Tooltip title={`${cert.documents.completed}/${cert.documents.total} documentos`}>
                        <Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={(cert.documents.completed / cert.documents.total) * 100}
                            sx={{ 
                              height: 4,
                              borderRadius: 2,
                              width: 50,
                              bgcolor: alpha(colors.primary.main, 0.1),
                              '& .MuiLinearProgress-bar': {
                                bgcolor: colors.primary.main,
                              }
                            }}
                          />
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            {cert.documents.completed}/{cert.documents.total}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Ver detalles">
                          <IconButton 
                            size="small"
                            component={Link}
                            to={`/committee/review/${cert.id}`}
                            onClick={(e) => e.stopPropagation()}
                            sx={{ color: colors.text.secondary }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Button
                          component={Link}
                          to={`/committee/review/${cert.id}`}
                          size="small"
                          variant="contained"
                          onClick={(e) => e.stopPropagation()}
                          sx={{ 
                            bgcolor: colors.primary.main,
                            '&:hover': { bgcolor: colors.primary.dark },
                            height: 24,
                            fontSize: '0.7rem'
                          }}
                        >
                          Revisar
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                
                {sortedCertifications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ py: 6, textAlign: 'center' }}>
                      <FolderOpenIcon sx={{ fontSize: 40, color: colors.primary.light, mb: 2 }} />
                      <Typography color="textSecondary">No hay certificaciones que coincidan</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* SECCIÓN 4: Footer de la tabla con resumen */}
        <Box sx={{ 
          p: 1,
          borderTop: `1px solid ${alpha(colors.primary.main, 0.1)}`,
          bgcolor: colors.background.subtle,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            Mostrando {sortedCertifications.length} de {certifications.length} certificaciones
          </Typography>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              {selectedRows.length} seleccionadas
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ height: 16 }} />
            <IconButton size="small" sx={{ color: colors.text.secondary }}>
              <DownloadIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: colors.text.secondary }}>
              <ViewColumnIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Paper>

      {/* Diálogo de Acciones Masivas */}
      <Dialog 
        open={batchActionDialog} 
        onClose={() => setBatchActionDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: colors.primary.dark, pb: 1 }}>
          Acciones en Lote ({selectedRows.length} certificaciones)
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            {[
              { icon: <AssignmentIcon />, label: 'Asignar a', color: colors.accents.blue },
              { icon: <CheckCircleIcon />, label: 'Marcar como revisadas', color: colors.status.success },
              { icon: <WarningIcon />, label: 'Cambiar prioridad', color: colors.status.warning },
              { icon: <DownloadIcon />, label: 'Exportar selección', color: colors.accents.purple },
            ].map((action, idx) => (
              <Grid item xs={6} key={idx}>
                <Card 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: `1px solid ${alpha(action.color, 0.2)}`,
                    '&:hover': {
                      borderColor: action.color,
                      bgcolor: alpha(action.color, 0.04)
                    }
                  }}
                  onClick={() => handleBatchAction(action.label.toLowerCase())}
                >
                  <Box sx={{ color: action.color, mb: 1 }}>
                    {action.icon}
                  </Box>
                  <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                    {action.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setBatchActionDialog(false)} sx={{ color: colors.text.secondary }}>
            Cancelar
          </Button>
          <Button 
            variant="contained"
            onClick={() => setBatchActionDialog(false)}
            sx={{ bgcolor: colors.primary.main }}
          >
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommitteeReview;