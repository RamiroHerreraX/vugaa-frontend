import React, { useState, useEffect } from 'react';
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
  Info as InfoIcon, Warning as WarningIcon,
  Business as BusinessIcon, LocationOn as LocationIcon
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
const CreateUserModal = ({
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
  ocupadosComite = []
}) => {
  const [localUser, setLocalUser] = useState(null);
  const [errors, setErrors] = useState({});

  // Inicializar o actualizar estado local cuando cambian las props
  useEffect(() => {
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
  }, [user, availableRoles, availableRegions, open]);

  // Limpiar errores al cerrar
  useEffect(() => {
    if (!open) {
      setErrors({});
    }
  }, [open]);

  if (!localUser) return null;

  const handleChange = (field, value) => {
    setLocalUser(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleRolChange = (nuevoRol) => {
    setLocalUser({
      ...localUser,
      rolNombre: nuevoRol,
      rolEspecifico: esRolComite(nuevoRol) ? '' : null
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!localUser.nombre || localUser.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (!localUser.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localUser.email)) {
      newErrors.email = 'Ingrese un email válido';
    }
    
    if (mode === 'add' && !password) {
      newErrors.password = 'La contraseña es obligatoria';
    }
    
    if (!localUser.rolNombre) {
      newErrors.rolNombre = 'Debe seleccionar un rol';
    }
    
    if (!localUser.regionNombre) {
      newErrors.regionNombre = 'Debe seleccionar una región';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(localUser, password);
    }
  };

  const isComite = esRolComite(localUser?.rolNombre);

  const isFormValid = () => {
    return (
      localUser?.rolNombre &&
      localUser?.nombre &&
      localUser?.email &&
      localUser?.regionNombre &&
      (!isComite || localUser?.rolEspecifico) &&
      (mode !== 'add' || password)
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        bgcolor: mode === 'add' ? colors.primary.main : colors.accents.blue,
        color: 'white',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        py: 2,
        px: 3,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {mode === 'add' ? <PersonAddIcon /> : <EditIcon />}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {mode === 'add' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Complete la información para {mode === 'add' ? 'crear un nuevo' : 'actualizar el'} usuario
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2, p: 3 }}>
        <Grid container spacing={2}>
          {/* Nombre completo */}
          <Grid item xs={12}>
            <TextField 
              fullWidth 
              label="Nombre completo" 
              size="small" 
              required
              value={localUser?.nombre || ''}
              onChange={(e) => handleChange('nombre', e.target.value)}
              error={!!errors.nombre}
              helperText={errors.nombre}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon fontSize="small" sx={{ color: colors.primary.main }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField 
              fullWidth 
              label="Email" 
              type="email" 
              size="small" 
              required
              value={localUser?.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          {/* Contraseña (solo para creación) */}
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
                error={!!errors.password}
                helperText={errors.password}
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

          {/* Rol */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small" error={!!errors.rolNombre}>
              <InputLabel id="rol-label">Rol *</InputLabel>
              <Select
                labelId="rol-label"
                value={localUser?.rolNombre || ''}
                label="Rol *"
                onChange={(e) => handleRolChange(e.target.value)}
              >
                {loadingRoles ? (
                  <MenuItem disabled>Cargando roles...</MenuItem>
                ) : availableRoles.length > 0 ? (
                  availableRoles.map((rolNombre) => (
                    <MenuItem key={rolNombre} value={rolNombre}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: getRoleColor(rolNombre) }} />
                        {rolNombre}
                      </Box>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value=""><em>No hay roles disponibles</em></MenuItem>
                )}
              </Select>
              {errors.rolNombre && <FormHelperText>{errors.rolNombre}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Región */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small" error={!!errors.regionNombre}>
              <InputLabel id="region-label">Región *</InputLabel>
              <Select
                labelId="region-label"
                value={localUser?.regionNombre || ''}
                label="Región *"
                onChange={(e) => handleChange('regionNombre', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <LocationIcon fontSize="small" sx={{ color: colors.primary.main }} />
                  </InputAdornment>
                }
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
              {errors.regionNombre && <FormHelperText>{errors.regionNombre}</FormHelperText>}
              {!loadingRegions && availableRegions.length === 0 && userInstanciaId && (
                <FormHelperText error>
                  No hay regiones activas disponibles para esta instancia
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Cargo específico para Comité */}
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

          {/* Estado del usuario */}
          <Grid item xs={12}>
            <Box sx={{ mt: 1, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
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
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {localUser?.activo !== false ? (
                      <>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.secondary.main }} />
                        <Typography variant="body2" sx={{ color: colors.secondary.main }}>
                          Usuario activo
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.text.secondary }} />
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                          Usuario inactivo
                        </Typography>
                      </>
                    )}
                  </Box>
                }
              />
            </Box>
          </Grid>

          {/* Información de instancia */}
          {userInstanciaNombre && (
            <Grid item xs={12}>
              <Alert severity="info" icon={<InfoIcon />} sx={{ bgcolor: colors.primary.light + '10' }}>
                <Typography variant="body2">
                  <strong>Instancia:</strong> {userInstanciaNombre}
                </Typography>
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa', borderTop: `1px solid ${colors.primary.light}` }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ borderColor: colors.primary.main, color: colors.primary.main }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!isFormValid()}
          sx={{ 
            bgcolor: mode === 'add' ? colors.primary.main : colors.accents.blue,
            '&:hover': { 
              bgcolor: mode === 'add' ? colors.primary.dark : colors.accents.purple 
            }
          }}
        >
          {mode === 'add' ? 'Crear Usuario' : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserModal;