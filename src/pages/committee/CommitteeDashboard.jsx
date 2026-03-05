// src/pages/committee/CommitteeDashboard.jsx
import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  TextField,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  LinearProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Avatar,
  Badge,
  Tabs,
  Tab,
  CircularProgress,
  Switch,
  FormControlLabel,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Gavel as GavelIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Place as PlaceIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Speed as SpeedIcon,
  Timer as TimerIcon,
  Assignment as AssignmentIcon,
  PriorityHigh as PriorityHighIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  ViewColumn as ViewColumnIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon,
  AutoAwesome as AutoAwesomeIcon,
  Insights as InsightsIcon,
  BarChart as BarChartIcon,
  FolderOpen as FolderOpenIcon,
  RocketLaunch as RocketLaunchIcon,
  ArrowForward as ArrowForwardIcon,
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
    success: '#00A8A8',
    warning: '#00C2D1',
    error: '#0099FF',
    info: '#3A6EA5'
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

const CommitteeDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [showFilters, setShowFilters] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Datos mock mejorados
  const certifications = [
    { 
      id: 1, 
      type: 'PATENTE ADUANAL', 
      code: 'PA-2026-00145',
      applicant: { name: 'Luis Rodríguez', type: 'agente', avatar: 'LR', complianceScore: 85 }, 
      region: 'Norte', 
      uploadDate: '15/01/2026',
      daysPending: 2,
      dueDate: '17/01/2026',
      status: 'PENDIENTE', 
      priority: 'ALTA',
      documents: { total: 5, completed: 4, pending: 1 },
      reviewTime: '2.3 días',
      category: 'Regulatoria',
      lastAction: 'Asignado a Comité',
      assignedTo: 'María González',
      color: colors.primary.main
    },
    { 
      id: 2, 
      type: 'OPINIÓN SAT POSITIVA', 
      code: 'OS-2025-03421',
      applicant: { name: 'Ana López', type: 'profesionista', avatar: 'AL', complianceScore: 92 }, 
      region: 'Centro', 
      uploadDate: '14/01/2026',
      daysPending: 3,
      dueDate: '28/01/2026',
      status: 'EN REVISIÓN', 
      priority: 'ALTA',
      documents: { total: 3, completed: 3, pending: 0 },
      reviewTime: '1.8 días',
      category: 'Fiscal',
      lastAction: 'En validación técnica',
      assignedTo: 'Carlos Ruiz',
      color: colors.secondary.main
    },
    { 
      id: 3, 
      type: 'CÉDULA PROFESIONAL', 
      code: 'CP-2024-56789',
      applicant: { name: 'Carlos Martínez', type: 'empresario', avatar: 'CM', complianceScore: 78 }, 
      region: 'Sur', 
      uploadDate: '13/01/2026',
      daysPending: 4,
      dueDate: '25/01/2026',
      status: 'PENDIENTE', 
      priority: 'MEDIA',
      documents: { total: 4, completed: 2, pending: 2 },
      reviewTime: '3.1 días',
      category: 'Profesional',
      lastAction: 'Esperando documentación',
      assignedTo: 'Laura Díaz',
      color: colors.accents.purple
    },
    { 
      id: 4, 
      type: 'PODER NOTARIAL', 
      code: 'PN-2025-12345',
      applicant: { name: 'María González', type: 'agente', avatar: 'MG', complianceScore: 65 }, 
      region: 'Metropolitana', 
      uploadDate: '12/01/2026',
      daysPending: 5,
      dueDate: '18/01/2026',
      status: 'REQUIERE INFO', 
      priority: 'ALTA',
      documents: { total: 2, completed: 1, pending: 1 },
      reviewTime: '4.2 días',
      category: 'Legal',
      lastAction: 'Solicitada información adicional',
      assignedTo: 'Pedro Sánchez',
      color: colors.status.warning
    },
    { 
      id: 5, 
      type: 'CONSTANCIA FISCAL', 
      code: 'CF-2025-78901',
      applicant: { name: 'Pedro Sánchez', type: 'profesionista', avatar: 'PS', complianceScore: 88 }, 
      region: 'Norte', 
      uploadDate: '11/01/2026',
      daysPending: 6,
      dueDate: '20/01/2026',
      status: 'PENDIENTE', 
      priority: 'MEDIA',
      documents: { total: 6, completed: 5, pending: 1 },
      reviewTime: '2.1 días',
      category: 'Fiscal',
      lastAction: 'En cola de revisión',
      assignedTo: 'Ana López',
      color: colors.accents.blue
    },
  ];

  // Calcular estadísticas dinámicas
  const calculateStats = () => {
    const today = new Date();
    const urgentThreshold = new Date();
    urgentThreshold.setDate(today.getDate() + 3);
    
    return {
      total: certifications.length,
      pending: certifications.filter(c => c.status === 'PENDIENTE').length,
      inReview: certifications.filter(c => c.status === 'EN REVISIÓN').length,
      requiresInfo: certifications.filter(c => c.status === 'REQUIERE INFO').length,
      highPriority: certifications.filter(c => c.priority === 'ALTA').length,
      urgent: certifications.filter(c => {
        const [day, month, year] = c.dueDate.split('/');
        const dueDate = new Date(`${year}-${month}-${day}`);
        return dueDate <= urgentThreshold;
      }).length,
      assignedToMe: certifications.filter(c => c.assignedTo === 'María González').length,
      avgReviewTime: (certifications.reduce((sum, c) => {
        const time = parseFloat(c.reviewTime);
        return sum + (isNaN(time) ? 0 : time);
      }, 0) / certifications.length).toFixed(1)
    };
  };

  const stats = calculateStats();

  // KPI Items
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
      label: 'Asignadas', 
      value: stats.assignedToMe, 
      color: colors.primary.main, 
      icon: <AssignmentIcon fontSize="small" />,
      tooltip: 'Asignadas a mí'
    },
    { 
      label: 'En Revisión', 
      value: stats.inReview, 
      color: colors.accents.blue, 
      icon: <AssessmentIcon fontSize="small" />,
      tooltip: 'En proceso de revisión'
    },
    { 
      label: 'Tiempo Prom.', 
      value: `${stats.avgReviewTime}d`, 
      color: colors.status.success, 
      icon: <SpeedIcon fontSize="small" />,
      tooltip: 'Tiempo promedio'
    },
    { 
      label: 'Total', 
      value: stats.total, 
      color: colors.accents.purple, 
      icon: <FolderOpenIcon fontSize="small" />,
      tooltip: 'Total activas'
    },
  ];

  const types = ['PATENTE ADUANAL', 'OPINIÓN SAT', 'CÉDULA PROFESIONAL', 'PODER NOTARIAL', 'CONSTANCIA FISCAL'];
  const regions = ['Norte', 'Centro', 'Sur', 'Metropolitana', 'Occidente'];
  const statuses = ['PENDIENTE', 'EN REVISIÓN', 'REQUIERE INFO', 'APROBADA', 'RECHAZADA'];
  const priorities = ['ALTA', 'MEDIA', 'BAJA'];
  const categories = ['Regulatoria', 'Fiscal', 'Legal', 'Profesional'];

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

  const getUserTypeColor = (type) => {
    switch(type) {
      case 'agente': return colors.primary.main;
      case 'profesionista': return colors.secondary.main;
      case 'empresario': return colors.status.warning;
      default: return colors.text.secondary;
    }
  };

  const getDaysColor = (days) => {
    if (days <= 2) return colors.status.error;
    if (days <= 4) return colors.status.warning;
    return colors.status.success;
  };

  const filteredCertifications = certifications.filter(cert => {
    const matchesSearch = 
      cert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || cert.type === filterType;
    const matchesRegion = filterRegion === 'all' || cert.region === filterRegion;
    const matchesStatus = filterStatus === 'all' || cert.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || cert.priority === filterPriority;

    return matchesSearch && matchesType && matchesRegion && matchesStatus && matchesPriority;
  });

  const sortedCertifications = [...filteredCertifications].sort((a, b) => {
    switch(sortBy) {
      case 'priority':
        const priorityOrder = { 'ALTA': 0, 'MEDIA': 1, 'BAJA': 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'days':
        return a.daysPending - b.daysPending;
      case 'date':
        const [aDay, aMonth, aYear] = a.uploadDate.split('/');
        const [bDay, bMonth, bYear] = b.uploadDate.split('/');
        return new Date(`${bYear}-${bMonth}-${bDay}`) - new Date(`${aYear}-${aMonth}-${aDay}`);
      default:
        return 0;
    }
  });

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

  return (
    <Box sx={{ 
      height: '100vh',
      bgcolor: colors.background.subtle,
      p: 2,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header minimalista */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <InsightsIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
            Panel de Control del Comité
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            Gestión y validación de certificaciones · {sortedCertifications.length} registros activos
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={1}>
          <Tooltip title="Auto-refrescar">
            <IconButton 
              size="small" 
              onClick={() => setAutoRefresh(!autoRefresh)}
              sx={{ color: autoRefresh ? colors.primary.main : colors.text.secondary }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={showStats ? "Ocultar estadísticas" : "Mostrar estadísticas"}>
            <IconButton 
              size="small" 
              onClick={() => setShowStats(!showStats)}
              sx={{ color: showStats ? colors.primary.main : colors.text.secondary }}
            >
              <BarChartIcon fontSize="small" />
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
          <Button
            variant="contained"
            size="small"
            startIcon={<RocketLaunchIcon />}
            component={Link}
            to="/committee/review"
            sx={{ 
              bgcolor: colors.primary.main,
              '&:hover': { bgcolor: colors.primary.dark },
              height: 32
            }}
          >
            Revisión Rápida
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={2} sx={{ flex: 1, minHeight: 0,  }}>
        {/* Columna Izquierda - Tabla (75% para dar más espacio a la tabla) */}
        <Grid item xs={12} lg={9} sx={{ height: '100%', display: 'flex', flexDirection: 'column',width: '75%' }}>
          <Paper elevation={2} sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
            borderRadius: 2
          }}>
            
            {/* SECCIÓN 1: KPI - Integrados */}
            {showStats && (
              <Box sx={{ 
                p: 1.5,
                borderBottom: `1px solid ${alpha(colors.primary.main, 0.1)}`,
                bgcolor: alpha(colors.primary.main, 0.02)
              }}>
                <Grid container spacing={1}>
                  {kpiItems.map((kpi, index) => (
                    <Grid item xs={4} md={2} key={index}>
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
                              {kpi.value}
                            </Typography>
                          </Box>
                        </Box>
                      </Tooltip>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* SECCIÓN 2: Búsqueda y filtros rápidos */}
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
                    placeholder="Buscar por tipo, código o solicitante..."
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
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      displayEmpty
                      sx={{ bgcolor: 'white' }}
                      renderValue={(selected) => {
                        if (selected === 'all') return <Typography color="textSecondary">Prioridad</Typography>;
                        return selected;
                      }}
                    >
                      <MenuItem value="all">Todas</MenuItem>
                      <MenuItem value="ALTA">Alta</MenuItem>
                      <MenuItem value="MEDIA">Media</MenuItem>
                      <MenuItem value="BAJA">Baja</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={6} sm={2}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      displayEmpty
                      sx={{ bgcolor: 'white' }}
                      renderValue={(selected) => {
                        if (selected === 'all') return <Typography color="textSecondary">Estado</Typography>;
                        return selected;
                      }}
                    >
                      <MenuItem value="all">Todos</MenuItem>
                      <MenuItem value="PENDIENTE">Pendiente</MenuItem>
                      <MenuItem value="EN REVISIÓN">En Revisión</MenuItem>
                      <MenuItem value="REQUIERE INFO">Requiere Info</MenuItem>
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
                        if (selected === 'all') return <Typography color="textSecondary">Región</Typography>;
                        return selected;
                      }}
                    >
                      <MenuItem value="all">Todas</MenuItem>
                      {regions.map(region => (
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
                        const labels = { priority: 'Prioridad', days: 'Días', date: 'Fecha' };
                        return `Orden: ${labels[selected]}`;
                      }}
                    >
                      <MenuItem value="priority">Por Prioridad</MenuItem>
                      <MenuItem value="days">Por Días pendientes</MenuItem>
                      <MenuItem value="date">Por Fecha de carga</MenuItem>
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
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      displayEmpty
                      sx={{ bgcolor: 'white' }}
                      size="small"
                    >
                      <MenuItem value="all">Todos los tipos</MenuItem>
                      {types.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value="all"
                      displayEmpty
                      sx={{ bgcolor: 'white' }}
                      size="small"
                    >
                      <MenuItem value="all">Todas las categorías</MenuItem>
                      {categories.map(cat => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Button 
                    size="small" 
                    startIcon={<RefreshIcon />}
                    onClick={() => {
                      setFilterType('all');
                      setFilterRegion('all');
                      setFilterStatus('all');
                      setFilterPriority('all');
                      setSearchTerm('');
                    }}
                    sx={{ color: colors.text.secondary, ml: 'auto' }}
                  >
                    Limpiar filtros
                  </Button>
                </Box>
              )}
            </Box>

            {/* SECCIÓN 3: Tabla de datos */}
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
                              {cert.type}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.text.secondary, fontFamily: 'monospace' }}>
                              {cert.code}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: getUserTypeColor(cert.applicant.type) }}>
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
                                    bgcolor: colors.primary.main,
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
                            <Tooltip title="Revisar certificación">
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
                                  fontSize: '0.7rem',
                                  minWidth: 60
                                }}
                              >
                                Revisar
                              </Button>
                            </Tooltip>
                            <Tooltip title="Más opciones">
                              <IconButton size="small" onClick={(e) => e.stopPropagation()} sx={{ color: colors.text.secondary }}>
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
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

            {/* SECCIÓN 4: Footer de la tabla */}
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
                {selectedRows.length > 0 && (
                  <Typography variant="caption" sx={{ color: colors.primary.main, fontWeight: 'bold' }}>
                    {selectedRows.length} seleccionadas
                  </Typography>
                )}
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
        </Grid>

        {/* Columna Derecha - Solo Notificaciones (25%) */}
        <Grid item xs={12} lg={3} sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          overflow: 'hidden'
        }}>
          
          {/* Alertas Inmediatas - Ocupa toda la altura disponible */}
          <Paper elevation={2} sx={{ 
            p: 2,
            flex: 1,
            overflow: 'auto',
            border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
            borderRadius: 2,
            bgcolor: colors.background.paper,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsIcon sx={{ color: colors.status.error, fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                  Alertas Críticas
                </Typography>
              </Box>
              <Badge badgeContent={3} sx={{ 
                '& .MuiBadge-badge': { 
                  bgcolor: colors.status.error, 
                  color: 'white',
                  fontSize: '0.65rem',
                  height: 18,
                  minWidth: 18
                } 
              }}>
                <IconButton size="small" sx={{ color: colors.text.secondary, p: 0.5 }}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Badge>
            </Box>
            
            <Stack spacing={1.5} sx={{ flex: 1 }}>
              {[
                { 
                  type: 'error', 
                  title: 'Vencimiento Inminente', 
                  code: 'PA-2026-00145',
                  desc: 'Patente Aduanal vence mañana', 
                  time: '30 min',
                  priority: 'Alta'
                },
                { 
                  type: 'warning', 
                  title: 'Documentación Pendiente', 
                  code: 'CP-2024-56789',
                  desc: 'Cédula Profesional - Falta 1 documento', 
                  time: '2 h',
                  priority: 'Media'
                },
                { 
                  type: 'info', 
                  title: 'Nueva Asignación', 
                  code: 'CF-2025-78901',
                  desc: 'Constancia Fiscal asignada a ti', 
                  time: '3 h',
                  priority: 'Baja'
                },
                { 
                  type: 'warning', 
                  title: 'Revisión Retrasada', 
                  code: 'OS-2025-03421',
                  desc: 'Opinión SAT excede tiempo estimado', 
                  time: '5 h',
                  priority: 'Media'
                },
              ].map((alert, idx) => (
                <Card 
                  key={idx} 
                  variant="outlined"
                  sx={{ 
                    p: 1.5,
                    borderLeft: `4px solid ${
                      alert.type === 'error' ? colors.status.error :
                      alert.type === 'warning' ? colors.status.warning : colors.accents.blue
                    }`,
                    '&:hover': { 
                      bgcolor: alpha(
                        alert.type === 'error' ? colors.status.error :
                        alert.type === 'warning' ? colors.status.warning : colors.accents.blue
                      , 0.04),
                      cursor: 'pointer'
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                      {alert.title}
                    </Typography>
                    <Chip 
                      label={alert.priority}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.6rem',
                        bgcolor: alert.priority === 'Alta' ? alpha(colors.status.error, 0.1) :
                                alert.priority === 'Media' ? alpha(colors.status.warning, 0.1) :
                                alpha(colors.accents.blue, 0.1),
                        color: alert.priority === 'Alta' ? colors.status.error :
                               alert.priority === 'Media' ? colors.status.warning :
                               colors.accents.blue,
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 0.5 }}>
                    {alert.desc}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ 
                        fontFamily: 'monospace', 
                        bgcolor: alpha(colors.primary.main, 0.05),
                        px: 0.5,
                        py: 0.25,
                        borderRadius: 0.5,
                        color: colors.text.secondary
                      }}>
                        {alert.code}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                        · {alert.time}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="text"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                      sx={{ 
                        textTransform: 'none',
                        color: colors.primary.main,
                        fontSize: '0.7rem',
                        minWidth: 'auto',
                        p: 0.5,
                        '&:hover': { 
                          color: colors.primary.dark,
                          bgcolor: 'transparent'
                        }
                      }}
                    >
                      Revisar
                    </Button>
                  </Box>
                </Card>
              ))}
            </Stack>
            
            <Button
              fullWidth
              variant="outlined"
              size="small"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                mt: 2,
                borderColor: alpha(colors.primary.main, 0.2),
                color: colors.primary.main,
                fontSize: '0.75rem',
                py: 0.5,
                '&:hover': {
                  borderColor: colors.primary.main,
                  bgcolor: alpha(colors.primary.main, 0.04),
                }
              }}
            >
              Ver todas las alertas (8)
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CommitteeDashboard;