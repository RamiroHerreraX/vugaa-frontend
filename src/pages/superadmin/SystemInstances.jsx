// src/pages/superadmin/SystemInstances.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  ContentCopy as DuplicateIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Domain as DomainIcon,
  People as PeopleIcon,
  Storage as StorageIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

const SystemInstances = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDuplicateDialog, setOpenDuplicateDialog] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState(null);

  // Datos de ejemplo de instancias
  const systemInstances = [
    {
      id: 1,
      name: 'CAAAREM - Principal',
      code: 'caaarem',
      description: 'Confederación de Agentes Aduanales de la República Mexicana',
      status: 'active',
      users: 1250,
      certifications: 45,
      storageUsed: '15.2 GB',
      lastBackup: '2026-02-17 03:00',
      created: '2024-01-10',
      admin: 'Dr. Carlos Méndez',
      email: 'carlos.mendez@caaarem.org',
      region: 'Nacional',
    },
    {
      id: 2,
      name: 'Instancia de Pruebas',
      code: 'test',
      description: 'Ambiente de pruebas para desarrollo y validación',
      status: 'active',
      users: 45,
      certifications: 12,
      storageUsed: '2.3 GB',
      lastBackup: '2026-02-17 03:00',
      created: '2024-06-15',
      admin: 'Ing. Roberto Sánchez',
      email: 'roberto.sanchez@test.org',
      region: 'Centro',
    },
    {
      id: 3,
      name: 'Facultad de Ingeniería',
      code: 'ingenieria',
      description: 'Sistema de certificaciones para la Facultad de Ingeniería',
      status: 'active',
      users: 345,
      certifications: 18,
      storageUsed: '4.8 GB',
      lastBackup: '2026-02-16 03:00',
      created: '2024-09-20',
      admin: 'Dra. Ana López',
      email: 'ana.lopez@ingenieria.edu',
      region: 'Norte',
    },
    {
      id: 4,
      name: 'Facultad de Medicina',
      code: 'medicina',
      description: 'Certificaciones médicas y especialidades',
      status: 'maintenance',
      users: 289,
      certifications: 24,
      storageUsed: '6.1 GB',
      lastBackup: '2026-02-15 03:00',
      created: '2024-11-05',
      admin: 'Dr. Miguel Ángel Ruiz',
      email: 'miguel.ruiz@medicina.edu',
      region: 'Sur',
    },
    {
      id: 5,
      name: 'Asociación de Agentes del Norte',
      code: 'asoc-norte',
      description: 'Asociación regional de agentes aduanales del norte',
      status: 'inactive',
      users: 156,
      certifications: 9,
      storageUsed: '1.8 GB',
      lastBackup: '2026-02-10 03:00',
      created: '2025-01-15',
      admin: 'Lic. Fernando Gómez',
      email: 'fernando.gomez@asoc-norte.org',
      region: 'Norte',
    },
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'active', label: 'Activas', color: '#4caf50' },
    { value: 'inactive', label: 'Inactivas', color: '#f44336' },
    { value: 'maintenance', label: 'En mantenimiento', color: '#ff9800' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#4caf50';
      case 'inactive': return '#f44336';
      case 'maintenance': return '#ff9800';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <CheckCircleIcon fontSize="small" />;
      case 'inactive': return <ErrorIcon fontSize="small" />;
      case 'maintenance': return <WarningIcon fontSize="small" />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'Activa';
      case 'inactive': return 'Inactiva';
      case 'maintenance': return 'Mantenimiento';
      default: return status;
    }
  };

  const filteredInstances = systemInstances.filter(instance => {
    const matchesSearch = 
      instance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.admin.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' ? true : instance.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateInstance = () => {
    setOpenCreateDialog(true);
  };

  const handleDuplicateInstance = (instance) => {
    setSelectedInstance(instance);
    setOpenDuplicateDialog(true);
  };

  // Calcular estadísticas
  const totalInstancias = systemInstances.length;
  const activas = systemInstances.filter(i => i.status === 'active').length;
  const totalUsuarios = systemInstances.reduce((acc, curr) => acc + curr.users, 0);
  const totalCertificaciones = systemInstances.reduce((acc, curr) => acc + curr.certifications, 0);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ color: '#133B6B', fontWeight: 'bold', mb: 0.5 }}>
              Instancias del Sistema
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestión de múltiples instancias multi-tenant
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateInstance}
            sx={{ bgcolor: '#133B6B', '&:hover': { bgcolor: '#0D2A4D' } }}
          >
            Nueva Instancia
          </Button>
        </Box>

        {/* Tarjetas de estadísticas */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Total Instancias
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {totalInstancias}
                    </Typography>
                  </Box>
                  <DomainIcon sx={{ fontSize: 40, color: '#133B6B', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Instancias Activas
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="#4caf50">
                      {activas}
                    </Typography>
                  </Box>
                  <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Usuarios Totales
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {totalUsuarios.toLocaleString()}
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 40, color: '#00C2D1', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Certificaciones
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {totalCertificaciones}
                    </Typography>
                  </Box>
                  <StorageIcon sx={{ fontSize: 40, color: '#9b59b6', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filtros */}
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar por nombre, código, administrador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filterStatus}
                  label="Estado"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  {statusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {option.color && (
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: option.color }} />
                        )}
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
              >
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Tabla de instancias */}
      <Paper sx={{ width: '100%', overflow: 'hidden', flex: 1 }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 350px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Instancia</TableCell>
                <TableCell>Código</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Usuarios</TableCell>
                <TableCell align="center">Certificaciones</TableCell>
                <TableCell>Administrador</TableCell>
                <TableCell>Región</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInstances
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((instance) => (
                  <TableRow key={instance.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#133B6B' }}>
                          {instance.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {instance.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {instance.description.substring(0, 50)}...
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={instance.code}
                        size="small"
                        sx={{ bgcolor: '#f0f0f0', fontWeight: 'medium' }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        size="small"
                        label={getStatusText(instance.status)}
                        icon={getStatusIcon(instance.status)}
                        sx={{
                          bgcolor: `${getStatusColor(instance.status)}15`,
                          color: getStatusColor(instance.status),
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="bold">
                        {instance.users}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Typography variant="body2">
                        {instance.certifications}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {instance.admin}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {instance.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={instance.region}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Ver detalles">
                          <IconButton size="small" color="primary">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton size="small" color="warning">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Duplicar">
                          <IconButton 
                            size="small" 
                            color="info"
                            onClick={() => handleDuplicateInstance(instance)}
                          >
                            <DuplicateIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              
              {filteredInstances.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <DomainIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No se encontraron instancias
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredInstances.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
        />
      </Paper>

      {/* Diálogo para crear instancia */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon color="primary" />
            <Typography variant="h6">Crear Nueva Instancia</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de la Instancia"
                placeholder="Ej: Facultad de Derecho"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Código Único"
                placeholder="Ej: derecho-001"
                size="small"
                helperText="Identificador único para la instancia (sin espacios)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={3}
                placeholder="Descripción del propósito de esta instancia..."
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Región</InputLabel>
                <Select label="Región" defaultValue="">
                  <MenuItem value="nacional">Nacional</MenuItem>
                  <MenuItem value="norte">Norte</MenuItem>
                  <MenuItem value="centro">Centro</MenuItem>
                  <MenuItem value="sur">Sur</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Administrador Principal"
                placeholder="Nombre del administrador"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email del Administrador"
                type="email"
                placeholder="admin@instancia.org"
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={() => setOpenCreateDialog(false)}>
            Crear Instancia
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para duplicar instancia */}
      <Dialog open={openDuplicateDialog} onClose={() => setOpenDuplicateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DuplicateIcon color="primary" />
            <Typography variant="h6">Duplicar Instancia</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedInstance && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                Se duplicará la configuración de: <strong>{selectedInstance.name}</strong>
              </Alert>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nuevo Nombre"
                    defaultValue={`${selectedInstance.name} - Copia`}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nuevo Código"
                    defaultValue={`${selectedInstance.code}-copy`}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Mantener administrador</InputLabel>
                    <Select label="Mantener administrador" defaultValue="yes">
                      <MenuItem value="yes">Sí, mantener el mismo</MenuItem>
                      <MenuItem value="no">No, asignar nuevo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDuplicateDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={() => setOpenDuplicateDialog(false)}>
            Duplicar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SystemInstances;