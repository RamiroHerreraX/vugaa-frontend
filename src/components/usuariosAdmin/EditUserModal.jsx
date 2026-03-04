import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button, FormControl, InputLabel,
  Select, MenuItem, FormControlLabel, Switch, InputAdornment,
  IconButton, Box, Typography, Avatar, Chip, Alert, Divider,
  FormHelperText
} from '@mui/material';
import {
  Close as CloseIcon, PersonAdd as PersonAddIcon,
  Edit as EditIcon, Lock as LockIcon,
  Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon,
  Info as InfoIcon, SwapHoriz as SwapHorizIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const colors = {
  primary: { dark: '#0D2A4D', main: '#133B6B', light: '#3A6EA5' },
  secondary: { main: '#00A8A8', light: '#00C2D1' },
  accents: { blue: '#0099FF', purple: '#6C5CE7' },
  text: { primary: '#0D2A4D', secondary: '#3A6EA5' }
};

const CARGOS_COMITE = ['Presidente', 'Secretario Tecnico', 'Vocal A', 'Vocal B'];

// Función para normalizar y comparar si es rol comité
const esRolComite = (rolNombre) => {
  if (!rolNombre) return false;
  const normalizado = rolNombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
  return normalizado === 'COMITE';
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

// Componente selector de cargo para comité
const ComiteCargoSelect = ({ user, onChange, excludeId = null, size = 'small', ocupados = [] }) => {
  return (
    <FormControl fullWidth size={size} required>
      <InputLabel id="cargo-comite-label">Cargo en Comité *</InputLabel>
      <Select
        labelId="cargo-comite-label"
        value={user?.rolEspecifico || ''}
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

// Modal para crear/editar usuario
const EditUserModal = ({
  open,
  onClose,
  onSave,
  mode = 'add',
  user,
  password,
  onPasswordChange,
  showPassword,
  onTogglePasswordVisibility,
  availableRoles = [],
  availableRegions = [],
  loadingRoles = false,
  loadingRegions = false,
  userInstanciaId,
  userInstanciaNombre,
  ocupadosComite = [],
  getRoleColor: getRoleColorProp = getRoleColor
}) => {
  const [localUser, setLocalUser] = useState(user || {
    nombre: '',
    email: '',
    rolNombre: availableRoles.length > 0 ? availableRoles[0] : '',
    regionNombre: availableRegions.length > 0 ? availableRegions[0] : '',
    rolEspecifico: '',
    activo: true
  });

  // Actualizar estado local cuando cambia el user prop
  React.useEffect(() => {
    if (user) {
      setLocalUser(user);
    } else {
      setLocalUser({
        nombre: '',
        email: '',
        rolNombre: availableRoles.length > 0 ? availableRoles[0] : '',
        regionNombre: availableRegions.length > 0 ? availableRegions[0] : '',
        rolEspecifico: '',
        activo: true
      });
    }
  }, [user, availableRoles, availableRegions]);

  const handleChange = (field, value) => {
    setLocalUser(prev => ({ ...prev, [field]: value }));
  };

  const handleRolChange = (nuevoRol) => {
    setLocalUser({
      ...localUser,
      rolNombre: nuevoRol,
      rolEspecifico: esRolComite(nuevoRol) ? '' : null
    });
  };

  const isComite = esRolComite(localUser?.rolNombre);

  const handleSave = () => {
    onSave(localUser, password);
  };

  const isFormValid = () => {
    return (
      localUser?.rolNombre &&
      localUser?.nombre &&
      localUser?.email &&
      (!isComite || localUser?.rolEspecifico) &&
      (mode !== 'add' || password)
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{
        bgcolor: mode === 'add' ? colors.primary.main : colors.accents.blue,
        color: 'white',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {mode === 'add' ? <PersonAddIcon /> : <EditIcon />}
          <Typography variant="h6">
            {mode === 'add' ? 'Nuevo Usuario' : 'Editar Usuario'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField 
              fullWidth 
              label="Nombre completo" 
              size="small" 
              required
              value={localUser?.nombre || ''}
              onChange={(e) => handleChange('nombre', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField 
              fullWidth 
              label="Email" 
              type="email" 
              size="small" 
              required
              value={localUser?.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </Grid>

          {mode === 'add' && (
            <Grid item xs={12}>
              <TextField
                fullWidth 
                label="Contraseña" 
                size="small" 
                required
                type={showPassword ? 'text' : 'password'}
                value={password || ''}
                onChange={onPasswordChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" sx={{ color: colors.primary.main }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={onTogglePasswordVisibility} edge="end" size="small">
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
                value={localUser?.rolNombre || ''}
                label="Rol"
                onChange={(e) => handleRolChange(e.target.value)}
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
                value={localUser?.regionNombre || ''}
                label="Región"
                onChange={(e) => handleChange('regionNombre', e.target.value)}
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
              {!loadingRegions && availableRegions.length === 0 && userInstanciaId && (
                <FormHelperText error>
                  No hay regiones activas disponibles para esta instancia
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          {isComite && (
            <Grid item xs={12}>
              <ComiteCargoSelect
                user={localUser}
                onChange={(cargo) => handleChange('rolEspecifico', cargo)}
                excludeId={mode === 'edit' ? localUser.id : null}
                ocupados={ocupadosComite}
                size="small"
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={localUser?.activo !== false}
                  onChange={(e) => handleChange('activo', e.target.checked)}
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

        {userInstanciaNombre && (
          <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Instancia: <strong>{userInstanciaNombre}</strong>
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.primary.light}` }}>
        <Button onClick={onClose} variant="outlined"
          sx={{ borderColor: colors.primary.main, color: colors.primary.main }}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!isFormValid()}
          sx={{ bgcolor: mode === 'add' ? colors.primary.main : colors.accents.blue }}
        >
          {mode === 'add' ? 'Crear Usuario' : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Modal para cambiar rol
const ChangeRoleModal = ({
  open,
  onClose,
  onSave,
  user,
  availableRoles = [],
  availableRegions = [],
  loadingRoles = false,
  ocupadosComite = [],
  getRoleColor: getRoleColorProp = getRoleColor
}) => {
  const [localUser, setLocalUser] = useState(user || {});

  React.useEffect(() => {
    if (user) {
      setLocalUser(user);
    }
  }, [user]);

  const handleRolChange = (nuevoRol) => {
    setLocalUser({
      ...localUser,
      rolNombre: nuevoRol,
      rolEspecifico: esRolComite(nuevoRol) ? '' : null
    });
  };

  const isComite = esRolComite(localUser?.rolNombre);

  const handleSave = () => {
    onSave(localUser);
  };

  const isFormValid = () => {
    return (
      localUser?.rolNombre &&
      (!isComite || localUser?.rolEspecifico)
    );
  };

  if (!localUser) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{
        bgcolor: colors.accents.purple, color: 'white',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SwapHorizIcon />
          <Typography variant="h6">Cambiar Rol de Usuario</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ color: colors.primary.dark, mb: 1 }}>
            Usuario Seleccionado:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{
              width: 48, height: 48,
              bgcolor: getRoleColorProp(localUser.rolNombre),
              fontSize: '1rem', fontWeight: 'bold'
            }}>
              {localUser.nombre?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                {localUser.nombre}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                {localUser.email}
              </Typography>
              {localUser.rolNombre && (
                <Chip
                  label={`Rol actual: ${localUser.rolNombre}${localUser.rolEspecifico ? ` - ${localUser.rolEspecifico}` : ''}`}
                  size="small"
                  sx={{
                    mt: 0.5,
                    bgcolor: `${getRoleColorProp(localUser.rolNombre)}15`,
                    color: getRoleColorProp(localUser.rolNombre),
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
                value={localUser.rolNombre || ''}
                label="Rol Principal"
                onChange={(e) => handleRolChange(e.target.value)}
              >
                {loadingRoles ? (
                  <MenuItem disabled>Cargando roles...</MenuItem>
                ) : availableRoles.length > 0 ? (
                  availableRoles.map((rolNombre) => (
                    <MenuItem key={rolNombre} value={rolNombre}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: getRoleColorProp(rolNombre) }} />
                        <Typography sx={{ flex: 1 }}>{rolNombre}</Typography>
                        {localUser.rolNombre === rolNombre && (
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

          {isComite && (
            <Grid item xs={12}>
              <ComiteCargoSelect
                user={localUser}
                onChange={(cargo) => setLocalUser({ ...localUser, rolEspecifico: cargo })}
                excludeId={localUser.id}
                ocupados={ocupadosComite}
                size="medium"
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.primary.light}` }}>
        <Button onClick={onClose} variant="outlined"
          sx={{ borderColor: colors.primary.main, color: colors.primary.main }}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!isFormValid()}
          sx={{ bgcolor: colors.accents.purple }}
        >
          Confirmar Cambio
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { EditUserModal, ChangeRoleModal };
export default EditUserModal;