import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Paper, Typography, Grid, TextField, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Stack, InputAdornment, Avatar, Tooltip, Switch,
  FormControlLabel, LinearProgress, Tabs, Tab, Pagination,
  FormControl, InputLabel, Select, Alert, Snackbar, Divider, FormHelperText
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Search as SearchIcon,
  CheckCircle as CheckCircleIcon, Cancel as CancelIcon,
  Visibility as VisibilityIcon, LocationOn as LocationIcon,
  Security as SecurityIcon, PersonAdd as PersonAddIcon,
  Close as CloseIcon, SwapHoriz as SwapHorizIcon,
  Info as InfoIcon, Lock as LockIcon,
  VisibilityOff as VisibilityOffIcon, Person as PersonIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import usuarioService from '../../services/usuarioService';
import rolService from '../../services/rol';
import regionesService from '../../services/regiones';

const colors = {
  primary: { dark: '#0D2A4D', main: '#133B6B', light: '#3A6EA5' },
  secondary: { main: '#00A8A8', light: '#00C2D1' },
  accents: { blue: '#0099FF', purple: '#6C5CE7' },
  status: { success: '#00A8A8', error: '#0099FF', info: '#3A6EA5' },
  text: { primary: '#0D2A4D', secondary: '#3A6EA5' }
};

const CARGOS_COMITE = ['Presidente', 'Secretario Tecnico', 'Vocal A', 'Vocal B'];

// FIX: constante alineada con lo que devuelve el backend en rolNombre
const ROL_COMITE = 'COMITE';

const UserManagement = () => {
  const { user } = useAuth();
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
  const [availableRegionsMap, setAvailableRegionsMap] = useState({});
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const rowsPerPage = 10;

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  useEffect(() => {
    if (user?.instanciaId) {
      cargarRegiones(user.instanciaId);
    }
  }, [user]);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.findAllForTable();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      mostrarSnackbar('Error al cargar usuarios', 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarRoles = async () => {
    try {
      setLoadingRoles(true);
      const roles = await rolService.findAll();
      const roleNames = roles.map(rol => rol.nombre).filter(Boolean);
      setAvailableRoles(roleNames);
    } catch (error) {
      console.error('Error cargando roles:', error);
      setAvailableRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  };

  const cargarRegiones = async (idInstancia) => {
    try {
      setLoadingRegions(true);
      const regiones = await regionesService.findActivasByInstanciaId(idInstancia);
      if (regiones && regiones.length > 0) {
        const regionMap = {};
        regiones.forEach(region => { regionMap[region.nombre] = region; });
        setAvailableRegionsMap(regionMap);
        setAvailableRegions(regiones.map(r => r.nombre).filter(Boolean));
      } else {
        setAvailableRegions([]);
        setAvailableRegionsMap({});
      }
    } catch (error) {
      console.error('Error cargando regiones:', error);
      try {
        const todas = await regionesService.findAll();
        const activas = (todas || []).filter(r => r.activa === true);
        const regionMap = {};
        activas.forEach(r => { regionMap[r.nombre] = r; });
        setAvailableRegionsMap(regionMap);
        setAvailableRegions(activas.map(r => r.nombre).filter(Boolean));
      } catch {
        setAvailableRegions([]);
        setAvailableRegionsMap({});
      }
    } finally {
      setLoadingRegions(false);
    }
  };

  useEffect(() => {
    if (users.length > 0 && availableRoles.length === 0) {
      const roles = [...new Set(users.map(u => u.rolNombre).filter(Boolean))];
      setAvailableRoles(roles);
    }
  }, [users, availableRoles.length]);

  useEffect(() => {
    if (users.length > 0 && availableRegions.length === 0 && !loadingRegions) {
      const regions = [...new Set(users.map(u => u.regionNombre).filter(Boolean))];
      setAvailableRegions(regions);
      const regionMap = {};
      regions.forEach(r => { regionMap[r] = { nombre: r }; });
      setAvailableRegionsMap(regionMap);
    }
  }, [users, availableRegions.length, loadingRegions]);

  // FIX: normalización para comparar rol comité igual que el backend
  const esRolComite = (rolNombre) => {
    if (!rolNombre) return false;
    const normalizado = rolNombre
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .trim();
    return normalizado === 'COMITE';
  };

  const getCargosOcupados = (excludeUserId = null) => {
    return users
      .filter(u => esRolComite(u.rolNombre) && u.rolEspecifico && u.id !== excludeUserId)
      .map(u => u.rolEspecifico);
  };

  const isCargoOcupado = (cargo, excludeUserId = null) => {
    return getCargosOcupados(excludeUserId).includes(cargo);
  };

  const getRoleColor = (rolNombre) => {
    if (!rolNombre) return colors.text.secondary;
    if (esRolComite(rolNombre)) return colors.accents.purple;
    switch (rolNombre.toLowerCase()) {
      case 'administrador': return colors.primary.dark;
      case 'agente aduanal': return colors.primary.main;
      case 'profesionista': return colors.accents.blue;
      case 'empresario': return colors.secondary.main;
      default: return colors.accents.blue;
    }
  };

  const stats = useMemo(() => {
    const s = {
      total: users.length,
      active: users.filter(u => u.estado === 'ACTIVO').length,
      inactive: users.filter(u => u.estado === 'INACTIVO').length,
      blocked: users.filter(u => u.estado === 'BLOQUEADO').length,
      byRole: {}
    };
    users.forEach(u => {
      if (u.rolNombre) s.byRole[u.rolNombre] = (s.byRole[u.rolNombre] || 0) + 1;
    });
    return s;
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = !searchTerm ||
        (u.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (u.rolNombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (u.regionNombre?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesTab = selectedTab === 'all' ? true :
        selectedTab === 'active' ? u.estado === 'ACTIVO' :
        selectedTab === 'inactive' ? u.estado === 'INACTIVO' :
        selectedTab === 'blocked' ? u.estado === 'BLOQUEADO' :
        u.rolNombre === selectedTab;
      return matchesSearch && matchesTab;
    });
  }, [users, searchTerm, selectedTab]);

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [filteredUsers, page]);

  const tabs = useMemo(() => {
    const list = [
      { value: 'all', label: `Todos (${stats.total})`, icon: <SecurityIcon /> },
      { value: 'active', label: `Activos (${stats.active})`, icon: <CheckCircleIcon /> },
      { value: 'inactive', label: `Inactivos (${stats.inactive})`, icon: <CancelIcon /> },
      { value: 'blocked', label: `Bloqueados (${stats.blocked})`, icon: <LockIcon /> },
    ];
    availableRoles.forEach(rol => {
      if (rol?.trim()) {
        list.push({ value: rol, label: `${rol} (${stats.byRole[rol] || 0})`, icon: <PersonIcon /> });
      }
    });
    return list;
  }, [stats, availableRoles]);

  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddUser = () => {
    setDialogMode('add');
    setSelectedUser({
      nombre: '',
      email: '',
      rolNombre: availableRoles.length > 0 ? availableRoles[0] : '',
      regionNombre: availableRegions.length > 0 ? availableRegions[0] : '',
      rolEspecifico: '',
      activo: true
    });
    setPassword('');
    setOpenDialog(true);
  };

  const handleEditUser = (u) => {
    setDialogMode('edit');
    setSelectedUser({
      id: u.id,
      nombre: u.nombre,
      email: u.email,
      rolNombre: u.rolNombre || '',
      regionNombre: u.regionNombre || '',
      rolEspecifico: u.rolEspecifico || '',
      activo: u.estado === 'ACTIVO'
    });
    setPassword('');
    setOpenDialog(true);
  };

  const handleChangeRole = (u) => {
    setSelectedUser({
      id: u.id,
      nombre: u.nombre,
      email: u.email,
      rolNombre: u.rolNombre || '',
      regionNombre: u.regionNombre || '',
      rolEspecifico: u.rolEspecifico || ''
    });
    setOpenRoleDialog(true);
  };

  // ─── Guardar cambio de rol ─────────────────────────────────────────────────
  const handleSaveRole = async () => {
    if (!selectedUser?.rolNombre) {
      mostrarSnackbar('Debe seleccionar un rol', 'error');
      return;
    }
    const esComite = esRolComite(selectedUser.rolNombre);
    if (esComite && !selectedUser.rolEspecifico) {
      mostrarSnackbar('Debe seleccionar un cargo específico para el rol de Comité', 'error');
      return;
    }
    if (esComite && isCargoOcupado(selectedUser.rolEspecifico, selectedUser.id)) {
      mostrarSnackbar(`El cargo "${selectedUser.rolEspecifico}" ya está asignado a otro miembro del comité`, 'error');
      return;
    }

    try {
      const usuarioActual = await usuarioService.findById(selectedUser.id);

      const updateData = {
        ...usuarioActual,
        rolNombre: selectedUser.rolNombre,
        // FIX: null explícito si no es comité
        rolEspecifico: esComite ? selectedUser.rolEspecifico : null,
        regionNombre: selectedUser.regionNombre || usuarioActual.regionNombre,
        instanciaId: user?.instanciaId || usuarioActual.instanciaId || 1,
      };

      // No enviar password si viene vacío
      if (!updateData.password) delete updateData.password;

      console.log('Actualizando rol - payload:', JSON.stringify(updateData));

      await usuarioService.update(selectedUser.id, updateData);
      await cargarUsuarios();

      mostrarSnackbar(
        `Rol de ${selectedUser.nombre} actualizado a ${selectedUser.rolNombre}${esComite && selectedUser.rolEspecifico ? ` - ${selectedUser.rolEspecifico}` : ''}`,
        'success'
      );
      setOpenRoleDialog(false);
    } catch (error) {
      console.error('Error al cambiar rol:', error);
      mostrarSnackbar(error.error || error.message || 'Error al actualizar el rol', 'error');
    }
  };

  // ─── Guardar usuario (nuevo / editar) ─────────────────────────────────────
  const handleSaveUser = async () => {
    if (!selectedUser.nombre || !selectedUser.email) {
      mostrarSnackbar('Por favor complete los campos obligatorios', 'error');
      return;
    }
    const esComite = esRolComite(selectedUser.rolNombre);
    if (esComite && !selectedUser.rolEspecifico) {
      mostrarSnackbar('Debe seleccionar un cargo específico para el rol de Comité', 'error');
      return;
    }
    if (esComite && isCargoOcupado(selectedUser.rolEspecifico, dialogMode === 'edit' ? selectedUser.id : null)) {
      mostrarSnackbar(`El cargo "${selectedUser.rolEspecifico}" ya está asignado a otro miembro del comité`, 'error');
      return;
    }

    try {
      if (dialogMode === 'add') {
        if (!password) {
          mostrarSnackbar('La contraseña es obligatoria', 'error');
          return;
        }

        const newUserDTO = {
          email: selectedUser.email,
          password: password,
          nombre: selectedUser.nombre,
          activo: selectedUser.activo,
          bloqueado: false,
          rolNombre: selectedUser.rolNombre,
          // FIX: null explícito si no es comité
          rolEspecifico: esComite ? selectedUser.rolEspecifico : null,
          regionNombre: selectedUser.regionNombre,
          // FIX: nombre de campo consistente con el DTO del backend
          instanciaId: user?.instanciaId || 1,
        };

        console.log('Creando usuario - payload:', JSON.stringify(newUserDTO));
        await usuarioService.create(newUserDTO);
        await cargarUsuarios();
        mostrarSnackbar('Usuario creado exitosamente', 'success');

      } else {
        const updatedUserDTO = {
          email: selectedUser.email,
          nombre: selectedUser.nombre,
          activo: selectedUser.activo,
          rolNombre: selectedUser.rolNombre,
          // FIX: null explícito si no es comité (limpia valor anterior en BD)
          rolEspecifico: esComite ? selectedUser.rolEspecifico : null,
          regionNombre: selectedUser.regionNombre,
          instanciaId: user?.instanciaId || 1,
        };

        console.log('Actualizando usuario - payload:', JSON.stringify(updatedUserDTO));
        await usuarioService.update(selectedUser.id, updatedUserDTO);
        await cargarUsuarios();
        mostrarSnackbar('Usuario actualizado exitosamente', 'success');
      }
      setOpenDialog(false);
    } catch (error) {
      console.error('Error en guardado:', error);
      mostrarSnackbar(error.error || 'Error al guardar el usuario', 'error');
    }
  };

  const handleToggleStatus = async (id) => {
    const u = users.find(u => u.id === id);
    const nuevoEstado = !(u.estado === 'ACTIVO');
    try {
      await usuarioService.cambiarEstadoActivo(id, nuevoEstado);
      await cargarUsuarios();
      mostrarSnackbar('Estado del usuario actualizado', 'success');
    } catch {
      mostrarSnackbar('Error al cambiar el estado', 'error');
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const formatUltimoAcceso = (ultimoAcceso) => usuarioService.formatUltimoAcceso(ultimoAcceso);

  // ─── Selector de cargo Comité ──────────────────────────────────────────────
  const ComiteCargoSelect = ({ user: u, onChange, excludeId = null, size = 'small' }) => {
    const ocupados = getCargosOcupados(excludeId);
    return (
      <FormControl fullWidth size={size} required>
        <InputLabel id="cargo-comite-label">Cargo en Comité *</InputLabel>
        <Select
          labelId="cargo-comite-label"
          value={u?.rolEspecifico || ''}
          label="Cargo en Comité *"
          onChange={(e) => onChange(e.target.value)}
          renderValue={(selected) =>
            selected ? selected : <em style={{ color: '#999' }}>Seleccione un cargo</em>
          }
        >
          <MenuItem value="" disabled><em>Seleccione un cargo</em></MenuItem>
          {CARGOS_COMITE.map((cargo) => {
            const ocupado = ocupados.includes(cargo);
            return (
              <MenuItem key={cargo} value={cargo} disabled={ocupado}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span>{cargo}</span>
                  {ocupado && (
                    <Chip
                      label="Ocupado"
                      size="small"
                      icon={<WarningIcon sx={{ fontSize: '0.7rem !important' }} />}
                      sx={{
                        height: 18, fontSize: '0.6rem',
                        bgcolor: '#ff980020', color: '#e65100',
                        border: '1px solid #ff980040', ml: 1
                      }}
                    />
                  )}
                </Box>
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText>
          {ocupados.length === CARGOS_COMITE.length
            ? 'Todos los cargos del comité están ocupados'
            : `${CARGOS_COMITE.length - ocupados.length} cargo(s) disponible(s)`}
        </FormHelperText>
      </FormControl>
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────
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
              {user?.instanciaNombre && ` - Instancia: ${user.instanciaNombre}`}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleAddUser}
            sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}
          >
            Nuevo Usuario
          </Button>
        </Box>

        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa' }}>
          <TextField
            fullWidth size="small"
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
        </Paper>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, v) => { setSelectedTab(v); setPage(1); }}
          variant="scrollable" scrollButtons="auto"
          sx={{
            '& .MuiTab-root': { color: colors.text.secondary, '&.Mui-selected': { color: colors.primary.main } },
            '& .MuiTabs-indicator': { backgroundColor: colors.primary.main }
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} iconPosition="start"
              label={tab.label} sx={{ minHeight: 48, textTransform: 'none' }} />
          ))}
        </Tabs>
      </Box>

      {/* Tabla */}
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
                paginatedUsers.map((u) => (
                  <TableRow key={u.id} hover
                    sx={{ '&:hover': { bgcolor: '#f8f9fa' }, opacity: u.estado === 'INACTIVO' ? 0.7 : 1 }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{
                          width: 36, height: 36,
                          bgcolor: getRoleColor(u.rolNombre),
                          fontSize: '0.9rem', fontWeight: 'bold'
                        }}>
                          {u.nombre?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                            {u.nombre}
                            {u.estado === 'INACTIVO' && (
                              <Chip label="INACTIVO" size="small"
                                sx={{ ml: 1, height: 18, fontSize: '0.65rem', bgcolor: colors.primary.dark, color: 'white' }} />
                            )}
                            {u.estado === 'BLOQUEADO' && (
                              <Chip label="BLOQUEADO" size="small"
                                sx={{ ml: 1, height: 18, fontSize: '0.65rem', bgcolor: colors.status.error, color: 'white' }} />
                            )}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                            {u.email}
                          </Typography>
                          {u.rolEspecifico && (
                            <Chip label={u.rolEspecifico} size="small" sx={{
                              mt: 0.5, height: 18, fontSize: '0.65rem',
                              bgcolor: colors.accents.purple + '20',
                              color: colors.accents.purple,
                              border: `1px solid ${colors.accents.purple}30`
                            }} />
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      {u.rolNombre ? (
                        <Chip label={u.rolNombre} size="small" sx={{
                          bgcolor: `${getRoleColor(u.rolNombre)}15`,
                          color: getRoleColor(u.rolNombre),
                          fontWeight: 600,
                          border: `1px solid ${getRoleColor(u.rolNombre)}30`
                        }} />
                      ) : (
                        <Typography variant="body2" sx={{ color: colors.text.secondary, fontStyle: 'italic' }}>—</Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 14, color: colors.text.secondary }} />
                        <Typography variant="body2" sx={{ color: colors.primary.dark }}>{u.regionNombre || '—'}</Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                        {formatUltimoAcceso(u.ultimoAcceso)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip label={u.estado || 'DESCONOCIDO'} size="small" sx={{
                        bgcolor: u.estado === 'ACTIVO' ? colors.secondary.main
                          : u.estado === 'BLOQUEADO' ? colors.status.error
                          : colors.primary.light,
                        color: 'white', fontSize: '0.75rem'
                      }} />
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Ver perfil">
                          <IconButton size="small" component={Link} to={`/admin/users/${u.id}/review`}
                            sx={{ color: colors.primary.main }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cambiar rol">
                          <IconButton size="small" onClick={() => handleChangeRole(u)}
                            sx={{ color: colors.accents.purple }}>
                            <SwapHorizIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => handleEditUser(u)}
                            sx={{ color: colors.accents.blue }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={u.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}>
                          <FormControlLabel
                            control={
                              <Switch size="small"
                                checked={u.estado === 'ACTIVO'}
                                onChange={() => handleToggleStatus(u.id)}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': { color: colors.secondary.main },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: colors.secondary.main },
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
            onChange={(e, v) => setPage(v)}
            size="small"
            sx={{
              '& .MuiPaginationItem-root': {
                color: colors.primary.main,
                '&.Mui-selected': { backgroundColor: colors.primary.main, color: 'white' }
              }
            }}
          />
        </Box>
      </Paper>

      {/* ── Diálogo: Cambiar Rol ─────────────────────────────────────────────── */}
      <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          bgcolor: colors.accents.purple, color: 'white',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
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
                  <Avatar sx={{
                    width: 48, height: 48,
                    bgcolor: getRoleColor(selectedUser.rolNombre),
                    fontSize: '1rem', fontWeight: 'bold'
                  }}>
                    {selectedUser.nombre?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                      {selectedUser.nombre}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                      {selectedUser.email}
                    </Typography>
                    {selectedUser.rolNombre && (
                      <Chip
                        label={`Rol actual: ${selectedUser.rolNombre}${selectedUser.rolEspecifico ? ` - ${selectedUser.rolEspecifico}` : ''}`}
                        size="small"
                        sx={{
                          mt: 0.5,
                          bgcolor: `${getRoleColor(selectedUser.rolNombre)}15`,
                          color: getRoleColor(selectedUser.rolNombre),
                          fontSize: '0.7rem', height: 20
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
                Seleccione el nuevo rol que desea asignar al usuario.
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="change-role-label">Rol Principal</InputLabel>
                    <Select
                      labelId="change-role-label"
                      value={selectedUser.rolNombre || ''}
                      label="Rol Principal"
                      onChange={(e) => {
                        const nuevoRol = e.target.value;
                        setSelectedUser({
                          ...selectedUser,
                          rolNombre: nuevoRol,
                          // FIX: limpiar rolEspecifico correctamente al cambiar de rol
                          rolEspecifico: esRolComite(nuevoRol) ? '' : null
                        });
                      }}
                    >
                      {loadingRoles ? (
                        <MenuItem disabled>Cargando roles...</MenuItem>
                      ) : availableRoles.length > 0 ? (
                        availableRoles.map((rolNombre) => (
                          <MenuItem key={rolNombre} value={rolNombre}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: getRoleColor(rolNombre) }} />
                              <Typography sx={{ flex: 1 }}>{rolNombre}</Typography>
                              {selectedUser.rolNombre === rolNombre && (
                                <Chip label="Actual" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                              )}
                            </Box>
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No hay roles disponibles</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                {esRolComite(selectedUser?.rolNombre) && (
                  <Grid item xs={12}>
                    <ComiteCargoSelect
                      user={selectedUser}
                      onChange={(cargo) => setSelectedUser({ ...selectedUser, rolEspecifico: cargo })}
                      excludeId={selectedUser.id}
                      size="medium"
                    />
                  </Grid>
                )}
              </Grid>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.primary.light}` }}>
          <Button onClick={() => setOpenRoleDialog(false)} variant="outlined"
            sx={{ borderColor: colors.primary.main, color: colors.primary.main }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveRole}
            variant="contained"
            sx={{ bgcolor: colors.accents.purple }}
            disabled={
              !selectedUser?.rolNombre ||
              (esRolComite(selectedUser?.rolNombre) && !selectedUser?.rolEspecifico)
            }
          >
            Confirmar Cambio
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Diálogo: Nuevo / Editar Usuario ─────────────────────────────────── */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          bgcolor: colors.primary.main, color: 'white',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
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
              <TextField fullWidth label="Nombre completo" size="small" required
                value={selectedUser?.nombre || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, nombre: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Email" type="email" size="small" required
                value={selectedUser?.email || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
              />
            </Grid>

            {dialogMode === 'add' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Contraseña" size="small" required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                <InputLabel id="rol-label">Rol</InputLabel>
                <Select
                  labelId="rol-label"
                  value={selectedUser?.rolNombre || ''}
                  label="Rol"
                  onChange={(e) => {
                    const nuevoRol = e.target.value;
                    setSelectedUser({
                      ...selectedUser,
                      rolNombre: nuevoRol,
                      // FIX: limpiar correctamente al cambiar de rol
                      rolEspecifico: esRolComite(nuevoRol) ? '' : null
                    });
                  }}
                >
                  {loadingRoles ? (
                    <MenuItem disabled>Cargando roles...</MenuItem>
                  ) : availableRoles.length > 0 ? (
                    availableRoles.map((rolNombre) => (
                      <MenuItem key={rolNombre} value={rolNombre}>{rolNombre}</MenuItem>
                    ))
                  ) : (
                    <MenuItem value=""><em>No hay roles disponibles</em></MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="region-label">Región</InputLabel>
                <Select
                  labelId="region-label"
                  value={selectedUser?.regionNombre || ''}
                  label="Región"
                  onChange={(e) => setSelectedUser({ ...selectedUser, regionNombre: e.target.value })}
                >
                  {loadingRegions ? (
                    <MenuItem disabled>Cargando regiones...</MenuItem>
                  ) : availableRegions.length > 0 ? (
                    availableRegions.map((region) => (
                      <MenuItem key={region} value={region}>{region}</MenuItem>
                    ))
                  ) : (
                    <MenuItem value=""><em>No hay regiones disponibles</em></MenuItem>
                  )}
                </Select>
                {!loadingRegions && availableRegions.length === 0 && user?.instanciaId && (
                  <FormHelperText error>
                    No hay regiones activas disponibles para esta instancia
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {esRolComite(selectedUser?.rolNombre) && (
              <Grid item xs={12}>
                <ComiteCargoSelect
                  user={selectedUser}
                  onChange={(cargo) => setSelectedUser({ ...selectedUser, rolEspecifico: cargo })}
                  excludeId={dialogMode === 'edit' ? selectedUser.id : null}
                  size="small"
                />
              </Grid>
            )}

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
          <Button onClick={() => setOpenDialog(false)} variant="outlined"
            sx={{ borderColor: colors.primary.main, color: colors.primary.main }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveUser}
            variant="contained"
            sx={{ bgcolor: colors.primary.main }}
            disabled={
              !selectedUser?.rolNombre ||
              !selectedUser?.nombre ||
              !selectedUser?.email ||
              (esRolComite(selectedUser?.rolNombre) && !selectedUser?.rolEspecifico) ||
              (dialogMode === 'add' && !password)
            }
          >
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