// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Stack,
  InputAdornment,
  Avatar,
  Tooltip,
  Switch,
  FormControlLabel,
  LinearProgress,
  Tabs,
  Tab,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Snackbar,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationIcon,
  Security as SecurityIcon,
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
  SwapHoriz as SwapHorizIcon,
  Info as InfoIcon,
  Lock as LockIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import usuarioService from '../../services/usuarioService';

// Paleta corporativa
const colors = {
  primary: {
    dark: '#0D2A4D',
    main: '#133B6B',
    light: '#3A6EA5'
  },
  secondary: {
    main: '#00A8A8',
    light: '#00C2D1'
  },
  accents: {
    blue: '#0099FF',
    purple: '#6C5CE7'
  },
  status: {
    success: '#00A8A8',
    error: '#0099FF',
    info: '#3A6EA5'
  },
  text: {
    primary: '#0D2A4D',
    secondary: '#3A6EA5'
  }
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [dialogMode, setDialogMode] = useState('add');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availableRegions, setAvailableRegions] = useState([]);

  const rowsPerPage = 10;

  // Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Extraer roles y regiones únicos de los usuarios
  useEffect(() => {
    if (users.length > 0) {
      // Extraer roles únicos
      const roles = [...new Set(users.map(user => user.rolNombre))];
      setAvailableRoles(roles);
      
      // Extraer regiones únicas
      const regions = [...new Set(users.map(user => user.regionNombre))];
      setAvailableRegions(regions);
    }
  }, [users]);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      // Usar el nuevo endpoint para la tabla
      const data = await usuarioService.findAllForTable();
      setUsers(data);
    } catch (error) {
      mostrarSnackbar('Error al cargar usuarios', 'error');
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener color para el rol basado en su nombre
  const getRoleColor = (rolNombre) => {
    switch (rolNombre?.toLowerCase()) {
      case 'administrador': return colors.primary.dark;
      case 'comité': return colors.accents.purple;
      case 'agente aduanal': return colors.primary.main;
      case 'profesionista': return colors.accents.blue;
      case 'empresario': return colors.secondary.main;
      default: return colors.text.secondary;
    }
  };

  // Estadísticas
  const stats = {
    total: users.length,
    active: users.filter(u => u.estado === 'Activo').length,
    inactive: users.filter(u => u.estado === 'Inactivo').length,
    blocked: users.filter(u => u.estado === 'Bloqueado').length,
    byRole: {}
  };

  // Calcular estadísticas por rol
  useEffect(() => {
    if (users.length > 0) {
      users.forEach(user => {
        const roleName = user.rolNombre?.toLowerCase() || 'sin rol';
        stats.byRole[roleName] = (stats.byRole[roleName] || 0) + 1;
      });
    }
  }, [users]);

  // Filtros
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      (user.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.rolNombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.regionNombre?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesTab =
      selectedTab === 'all' ? true :
        selectedTab === 'active' ? user.estado === 'Activo' :
          selectedTab === 'inactive' ? user.estado === 'Inactivo' :
            selectedTab === 'blocked' ? user.estado === 'Bloqueado' :
              // Si es un tab de rol, filtrar por nombre del rol
              user.rolNombre?.toLowerCase() === selectedTab.toLowerCase();

    return matchesSearch && matchesTab;
  });

  // Paginación
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddUser = () => {
    setDialogMode('add');
    setSelectedUser({
      nombre: '',
      email: '',
      rolNombre: availableRoles.length > 0 ? availableRoles[0] : '',
      regionNombre: availableRegions.length > 0 ? availableRegions[0] : 'No asignada',
      activo: true
    });
    setPassword('');
    setOpenDialog(true);
  };

  const handleEditUser = (user) => {
    setDialogMode('edit');
    setSelectedUser({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rolNombre: user.rolNombre,
      regionNombre: user.regionNombre,
      activo: user.estado === 'Activo'
    });
    setPassword('');
    setOpenDialog(true);
  };

  const handleChangeRole = (user) => {
    setSelectedUser({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rolNombre: user.rolNombre,
      regionNombre: user.regionNombre
    });
    setOpenRoleDialog(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser?.rolNombre) return;

    try {
      // Aquí llamarías a un endpoint para cambiar el rol
      // Por ahora solo simulamos el cambio
      const updatedUser = {
        ...selectedUser,
        rolNombre: selectedUser.rolNombre
      };

      setUsers(users.map(user =>
        user.id === selectedUser.id ? updatedUser : user
      ));

      mostrarSnackbar(`Rol de ${selectedUser.nombre} actualizado a ${selectedUser.rolNombre}`, 'success');
      setOpenRoleDialog(false);
    } catch (error) {
      mostrarSnackbar('Error al actualizar el rol', 'error');
    }
  };

  const handleSaveUser = async () => {
    if (!selectedUser.nombre || !selectedUser.email) {
      mostrarSnackbar('Por favor complete los campos obligatorios', 'error');
      return;
    }

    try {
      if (dialogMode === 'add') {
        if (!password) {
          mostrarSnackbar('La contraseña es obligatoria', 'error');
          return;
        }

        // Crear usuario en formato DTO completo
        const newUserDTO = {
          email: selectedUser.email,
          password: password,
          nombre: selectedUser.nombre,
          activo: selectedUser.activo,
          bloqueado: false
        };

        const createdUser = await usuarioService.create(newUserDTO);
        
        // Recargar la lista de usuarios para obtener los datos formateados
        await cargarUsuarios();
        
        mostrarSnackbar('Usuario creado exitosamente', 'success');
      } else {
        // Actualizar usuario
        const updatedUserDTO = {
          email: selectedUser.email,
          nombre: selectedUser.nombre,
          activo: selectedUser.activo
        };

        const updatedUser = await usuarioService.update(selectedUser.id, updatedUserDTO);
        
        // Actualizar el usuario en la lista manteniendo los campos de tabla
        setUsers(users.map(user =>
          user.id === selectedUser.id 
            ? { ...user, nombre: updatedUser.nombre, email: updatedUser.email, estado: updatedUser.activo ? 'Activo' : 'Inactivo' }
            : user
        ));
        
        mostrarSnackbar('Usuario actualizado exitosamente', 'success');
      }
      setOpenDialog(false);
    } catch (error) {
      mostrarSnackbar(error.error || 'Error al guardar el usuario', 'error');
    }
  };

  const handleToggleStatus = async (id) => {
    const user = users.find(u => u.id === id);
    const nuevoEstado = !(user.estado === 'Activo');
    
    try {
      const updatedUser = await usuarioService.cambiarEstadoActivo(id, nuevoEstado);
      setUsers(users.map(u => 
        u.id === id 
          ? { ...u, estado: updatedUser.activo ? 'Activo' : 'Inactivo' }
          : u
      ));
      mostrarSnackbar('Estado del usuario actualizado', 'success');
    } catch (error) {
      mostrarSnackbar('Error al cambiar el estado', 'error');
    }
  };

  // Construir tabs dinámicamente
  const tabs = [
    { value: 'all', label: `Todos (${stats.total})`, icon: <SecurityIcon /> },
    { value: 'active', label: `Activos (${stats.active})`, icon: <CheckCircleIcon /> },
    { value: 'inactive', label: `Inactivos (${stats.inactive})`, icon: <CancelIcon /> },
    { value: 'blocked', label: `Bloqueados (${stats.blocked})`, icon: <LockIcon /> },
    // Agregar tabs para cada rol
    ...availableRoles.map(rol => ({
      value: rol.toLowerCase(),
      label: `${rol} (${stats.byRole[rol.toLowerCase()] || 0})`,
      icon: <PersonIcon />
    }))
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Formatear fecha de último acceso
  const formatUltimoAcceso = (ultimoAcceso) => {
    return usuarioService.formatUltimoAcceso(ultimoAcceso);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: colors.primary.dark, fontWeight: 'bold', mb: 0.5 }}>
              Gestión de Usuarios
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Administre los usuarios del sistema - {filteredUsers.length} usuarios encontrados
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleAddUser}
            sx={{
              bgcolor: colors.primary.main,
              '&:hover': { bgcolor: colors.primary.dark }
            }}
          >
            Nuevo Usuario
          </Button>
        </Box>

        {/* Buscador */}
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar por nombre, email, rol o región..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: colors.primary.main }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <CancelIcon fontSize="small" sx={{ color: colors.text.secondary }} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => {
            setSelectedTab(newValue);
            setPage(1);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              color: colors.text.secondary,
              '&.Mui-selected': { color: colors.primary.main }
            },
            '& .MuiTabs-indicator': { backgroundColor: colors.primary.main }
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              iconPosition="start"
              label={tab.label}
              sx={{ minHeight: 48, textTransform: 'none' }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Tabla de usuarios */}
      <Paper elevation={1} sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TableContainer sx={{ flex: 1 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '30%' }}>Usuario</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '15%' }}>Rol</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '15%' }}>Región</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '15%' }}>Último Acceso</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '15%' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark, width: '10%' }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <LinearProgress />
                    <Typography sx={{ mt: 2 }}>Cargando usuarios...</Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography>No se encontraron usuarios</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{
                      '&:hover': { bgcolor: '#f8f9fa' },
                      opacity: user.estado === 'Inactivo' ? 0.7 : 1
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: getRoleColor(user.rolNombre),
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {user.nombre?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                            {user.nombre}
                            {user.estado === 'Inactivo' && (
                              <Chip
                                label="INACTIVO"
                                size="small"
                                sx={{
                                  ml: 1,
                                  height: 18,
                                  fontSize: '0.65rem',
                                  bgcolor: colors.primary.dark,
                                  color: 'white'
                                }}
                              />
                            )}
                            {user.estado === 'Bloqueado' && (
                              <Chip
                                label="BLOQUEADO"
                                size="small"
                                sx={{
                                  ml: 1,
                                  height: 18,
                                  fontSize: '0.65rem',
                                  bgcolor: colors.status.error,
                                  color: 'white'
                                }}
                              />
                            )}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={user.rolNombre || 'Sin rol'}
                        size="small"
                        sx={{
                          bgcolor: `${getRoleColor(user.rolNombre)}15`,
                          color: getRoleColor(user.rolNombre),
                          fontWeight: 600,
                          border: `1px solid ${getRoleColor(user.rolNombre)}30`
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 14, color: colors.text.secondary }} />
                        <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                          {user.regionNombre || 'No asignada'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                        {formatUltimoAcceso(user.ultimoAcceso)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={user.estado || 'Desconocido'}
                        size="small"
                        sx={{
                          bgcolor: user.estado === 'Activo' 
                            ? colors.secondary.main 
                            : user.estado === 'Bloqueado'
                              ? colors.status.error
                              : colors.primary.light,
                          color: 'white',
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Ver perfil">
                          <IconButton
                            size="small"
                            component={Link}
                            to={`/admin/users/${user.id}/review`}
                            sx={{ color: colors.primary.main }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Cambiar rol">
                          <IconButton
                            size="small"
                            onClick={() => handleChangeRole(user)}
                            sx={{ color: colors.accents.purple }}
                          >
                            <SwapHorizIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => handleEditUser(user)}
                            sx={{ color: colors.accents.blue }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title={user.estado === 'Activo' ? 'Desactivar' : 'Activar'}>
                          <FormControlLabel
                            control={
                              <Switch
                                size="small"
                                checked={user.estado === 'Activo'}
                                onChange={() => handleToggleStatus(user.id)}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: colors.secondary.main,
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: colors.secondary.main,
                                  },
                                }}
                              />
                            }
                            label=""
                          />
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            Mostrando {filteredUsers.length > 0 ? ((page - 1) * rowsPerPage) + 1 : 0} - {Math.min(page * rowsPerPage, filteredUsers.length)} de {filteredUsers.length} usuarios
          </Typography>
          <Pagination
            count={Math.ceil(filteredUsers.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            size="small"
            sx={{
              '& .MuiPaginationItem-root': {
                color: colors.primary.main,
                '&.Mui-selected': {
                  backgroundColor: colors.primary.main,
                  color: 'white'
                }
              }
            }}
          />
        </Box>
      </Paper>

      {/* Diálogo para cambiar rol */}
      <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          bgcolor: colors.accents.purple,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SwapHorizIcon />
            <Typography variant="h6">Cambiar Rol de Usuario</Typography>
          </Box>
          <IconButton onClick={() => setOpenRoleDialog(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {selectedUser && (
            <>
              <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ color: colors.primary.dark, mb: 1 }}>
                  Usuario Seleccionado:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: getRoleColor(selectedUser.rolNombre),
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {selectedUser.nombre?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                      {selectedUser.nombre}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                      {selectedUser.email}
                    </Typography>
                    <Chip
                      label={`Rol actual: ${selectedUser.rolNombre || 'Sin rol'}`}
                      size="small"
                      sx={{
                        mt: 0.5,
                        bgcolor: `${getRoleColor(selectedUser.rolNombre)}15`,
                        color: getRoleColor(selectedUser.rolNombre),
                        fontSize: '0.7rem',
                        height: 20
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
                Seleccione el nuevo rol que desea asignar al usuario.
              </Alert>

              <FormControl fullWidth>
                <InputLabel id="change-role-label">Nuevo Rol</InputLabel>
                <Select
                  labelId="change-role-label"
                  value={selectedUser.rolNombre || ''}
                  label="Nuevo Rol"
                  onChange={(e) => setSelectedUser({
                    ...selectedUser,
                    rolNombre: e.target.value
                  })}
                >
                  {availableRoles.map((rolNombre) => {
                    const roleColor = getRoleColor(rolNombre);
                    return (
                      <MenuItem key={rolNombre} value={rolNombre}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: roleColor }} />
                          <Typography sx={{ flex: 1 }}>{rolNombre}</Typography>
                          {selectedUser.rolNombre === rolNombre && (
                            <Chip label="Actual" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                          )}
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.primary.light}` }}>
          <Button onClick={() => setOpenRoleDialog(false)} variant="outlined" sx={{ borderColor: colors.primary.main, color: colors.primary.main }}>
            Cancelar
          </Button>
          <Button onClick={handleSaveRole} variant="contained" sx={{ bgcolor: colors.accents.purple }}>
            Confirmar Cambio
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de usuario */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          bgcolor: colors.primary.main,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {dialogMode === 'add' ? <PersonAddIcon /> : <EditIcon />}
            <Typography variant="h6">
              {dialogMode === 'add' ? 'Nuevo Usuario' : 'Editar Usuario'}
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenDialog(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre completo"
                value={selectedUser?.nombre || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, nombre: e.target.value })}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={selectedUser?.email || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                required
                size="small"
              />
            </Grid>

            {dialogMode === 'add' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" sx={{ color: colors.primary.main }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Rol</InputLabel>
                <Select
                  value={selectedUser?.rolNombre || (availableRoles.length > 0 ? availableRoles[0] : '')}
                  label="Rol"
                  onChange={(e) => setSelectedUser({ ...selectedUser, rolNombre: e.target.value })}
                >
                  {availableRoles.map((rolNombre) => {
                    const roleColor = getRoleColor(rolNombre);
                    return (
                      <MenuItem key={rolNombre} value={rolNombre}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: roleColor }} />
                          {rolNombre}
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Región</InputLabel>
                <Select
                  value={selectedUser?.regionNombre || (availableRegions.length > 0 ? availableRegions[0] : 'No asignada')}
                  label="Región"
                  onChange={(e) => setSelectedUser({ ...selectedUser, regionNombre: e.target.value })}
                >
                  {availableRegions.length > 0 ? (
                    availableRegions.map((region) => (
                      <MenuItem key={region} value={region}>{region}</MenuItem>
                    ))
                  ) : (
                    <>
                      <MenuItem value="Norte">Norte</MenuItem>
                      <MenuItem value="Centro">Centro</MenuItem>
                      <MenuItem value="Sur">Sur</MenuItem>
                      <MenuItem value="Occidente">Occidente</MenuItem>
                      <MenuItem value="Metropolitana">Metropolitana</MenuItem>
                    </>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedUser?.activo !== false}
                    onChange={(e) => setSelectedUser({ ...selectedUser, activo: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: colors.secondary.main },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: colors.secondary.main }
                    }}
                  />
                }
                label="Usuario activo"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.primary.light}` }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined" sx={{ borderColor: colors.primary.main, color: colors.primary.main }}>
            Cancelar
          </Button>
          <Button onClick={handleSaveUser} variant="contained" sx={{ bgcolor: colors.primary.main }}>
            {dialogMode === 'add' ? 'Crear Usuario' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;