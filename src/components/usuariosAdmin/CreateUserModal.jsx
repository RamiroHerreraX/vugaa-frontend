import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button, FormControl, InputLabel,
  Select, MenuItem, FormControlLabel, Switch, InputAdornment,
  IconButton, Box, Typography, Chip, Alert, Divider,
  FormHelperText
} from '@mui/material';
import {
  Close as CloseIcon, PersonAdd as PersonAddIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon,
  Info as InfoIcon, Warning as WarningIcon,
  Business as BusinessIcon, LocationOn as LocationIcon,
  WorkOutline as WorkIcon
} from '@mui/icons-material';

const colors = {
  primary: { dark: '#0D2A4D', main: '#133B6B', light: '#3A6EA5' },
  secondary: { main: '#00A8A8', light: '#00C2D1' },
  accents: { blue: '#0099FF', purple: '#6C5CE7' },
  text: { primary: '#0D2A4D', secondary: '#3A6EA5' }
};

const CARGOS_COMITE = ['Presidente', 'Secretario Tecnico', 'Vocal A', 'Vocal B'];
const ROLES_PERMITIDOS = ['AGENTE', 'COMITE'];

const normalizarRol = (rolNombre) => {
  if (!rolNombre) return '';
  return rolNombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
};

const esRolComite = (rolNombre) => normalizarRol(rolNombre) === 'COMITE';
const esRolPermitido = (rolNombre) => ROLES_PERMITIDOS.includes(normalizarRol(rolNombre));

const getRoleColor = (rolNombre) => {
  if (!rolNombre) return colors.text.secondary;
  if (esRolComite(rolNombre)) return colors.accents.purple;
  return colors.primary.main;
};

// Estilos compartidos para todos los inputs — aseguran altura y apariencia uniforme
const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#FAFBFD',
    transition: 'box-shadow 0.2s, border-color 0.2s',
    '&:hover fieldset': { borderColor: colors.primary.light },
    '&.Mui-focused fieldset': {
      borderColor: colors.primary.main,
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: colors.primary.main },
  '& .MuiInputBase-input': { fontSize: '0.875rem' },
};

// Componente selector de cargo para comité — label fuera del input (shrink siempre activo)
const ComiteCargoSelect = ({ value, onChange, ocupados = [], error, helperText }) => (
  <FormControl fullWidth size="small" required error={error} sx={inputSx}>
    {/* FIX: shrink={true} evita que el label se superponga con el placeholder/valor */}
    <InputLabel id="cargo-comite-label" shrink>
      Cargo en Comité *
    </InputLabel>
    <Select
      labelId="cargo-comite-label"
      value={value ?? ''}
      label="Cargo en Comité *"
      notched                          // FIX: mantiene el hueco del label en el borde
      displayEmpty
      onChange={(e) => onChange(e.target.value)}
      startAdornment={
        <InputAdornment position="start">
          <WorkIcon fontSize="small" sx={{ color: colors.primary.main }} />
        </InputAdornment>
      }
      renderValue={(selected) =>
        selected
          ? selected
          : <em style={{ color: '#aaa', fontStyle: 'normal', fontSize: '0.875rem' }}>
              Seleccione un cargo
            </em>
      }
    >
      <MenuItem value="" disabled>
        <em>Seleccione un cargo</em>
      </MenuItem>
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
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
);

const INITIAL_FORM = {
  nombre: '',
  email: '',
  rolNombre: '',
  regionNombre: '',
  rolEspecifico: '',
  activo: true
};

const CreateUserModal = ({
  open,
  onClose,
  onSave,
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
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const rolesFiltrados = useMemo(
    () => availableRoles.filter(esRolPermitido),
    [availableRoles]
  );

  useEffect(() => {
    if (open) {
      setFormData({
        ...INITIAL_FORM,
        rolNombre: rolesFiltrados[0] ?? '',
        regionNombre: availableRegions[0] ?? '',
      });
      setErrors({});
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleRolChange = (nuevoRol) => {
    setFormData(prev => ({ ...prev, rolNombre: nuevoRol, rolEspecifico: '' }));
    if (errors.rolNombre || errors.rolEspecifico)
      setErrors(prev => ({ ...prev, rolNombre: null, rolEspecifico: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre || formData.nombre.trim().length < 3)
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Ingrese un email válido';
    if (!password)
      newErrors.password = 'La contraseña es obligatoria';
    else if (password.length < 6)
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (!formData.rolNombre)
      newErrors.rolNombre = 'Debe seleccionar un rol';
    if (!formData.regionNombre)
      newErrors.regionNombre = 'Debe seleccionar una región';
    if (esRolComite(formData.rolNombre) && !formData.rolEspecifico)
      newErrors.rolEspecifico = 'Debe seleccionar un cargo para el comité';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) onSave({ ...formData, activo: true }, password);
  };

  const isComite = esRolComite(formData.rolNombre);

  const isFormValid =
    formData.rolNombre &&
    formData.nombre?.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.regionNombre &&
    (!isComite || formData.rolEspecifico) &&
    password?.length >= 6;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(13,42,77,0.18)',
        }
      }}
    >
      {/* ── Header ── */}
      <DialogTitle sx={{
        background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.primary.main} 100%)`,
        color: 'white',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        py: 2.5, px: 3,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            bgcolor: 'rgba(255,255,255,0.15)',
            borderRadius: '10px', p: 0.8,
            display: 'flex', alignItems: 'center'
          }}>
            <PersonAddIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Crear Nuevo Usuario
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
              Complete la información para crear un nuevo usuario
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small"
          sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }, borderRadius: '8px' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ── Body ── */}
      <DialogContent sx={{ p: 3, bgcolor: '#F4F6FA' }}>
        <Box sx={{
          bgcolor: 'white',
          borderRadius: 2,
          p: 2.5,
          border: '1px solid #E8EDF5',
          boxShadow: '0 2px 8px rgba(13,42,77,0.05)'
        }}>
          <Grid container spacing={2}>

            {/* Nombre completo — fila completa */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre completo"
                size="small"
                required
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                error={!!errors.nombre}
                helperText={errors.nombre}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon fontSize="small" sx={{ color: colors.primary.main }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Email — fila completa */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                size="small"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: colors.primary.main, fontSize: '0.9rem', fontWeight: 600 }}>@</Box>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Contraseña — fila completa */}
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
                helperText={errors.password || 'Mínimo 6 caracteres'}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" sx={{ color: colors.primary.main }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={onTogglePasswordVisibility} edge="end" size="small">
                        {showPassword
                          ? <VisibilityOffIcon fontSize="small" sx={{ color: colors.primary.light }} />
                          : <VisibilityIcon fontSize="small" sx={{ color: colors.primary.light }} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Rol + Región — misma fila, mismo ancho (xs=6 cada uno) */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small" error={!!errors.rolNombre} sx={inputSx}>
                <InputLabel id="rol-label">Rol *</InputLabel>
                <Select
                  labelId="rol-label"
                  value={formData.rolNombre}
                  label="Rol *"
                  onChange={(e) => handleRolChange(e.target.value)}
                >
                  {loadingRoles ? (
                    <MenuItem disabled>Cargando roles...</MenuItem>
                  ) : rolesFiltrados.length > 0 ? (
                    rolesFiltrados.map((rolNombre) => (
                      <MenuItem key={rolNombre} value={rolNombre}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: getRoleColor(rolNombre), flexShrink: 0 }} />
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

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small" error={!!errors.regionNombre} sx={inputSx}>
                <InputLabel id="region-label">Región *</InputLabel>
                <Select
                  labelId="region-label"
                  value={formData.regionNombre}
                  label="Región *"
                  onChange={(e) => handleChange('regionNombre', e.target.value)}
                >
                  {loadingRegions ? (
                    <MenuItem disabled>Cargando regiones...</MenuItem>
                  ) : availableRegions.length > 0 ? (
                    availableRegions.map((region) => (
                      <MenuItem key={region} value={region}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon fontSize="small" sx={{ color: colors.primary.main }} />
                          {region}
                        </Box>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value=""><em>No hay regiones disponibles</em></MenuItem>
                  )}
                </Select>
                {errors.regionNombre && <FormHelperText>{errors.regionNombre}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Cargo Comité — fila completa, solo visible si rol = COMITE */}
            {isComite && (
              <Grid item xs={12}>
                <ComiteCargoSelect
                  value={formData.rolEspecifico}
                  onChange={(cargo) => handleChange('rolEspecifico', cargo)}
                  ocupados={ocupadosComite}
                  error={!!errors.rolEspecifico}
                  helperText={errors.rolEspecifico}
                />
              </Grid>
            )}

          </Grid>
        </Box>

        {/* Alertas debajo de la tarjeta blanca */}
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {userInstanciaNombre && (
            <Alert
              severity="info"
              icon={<InfoIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderRadius: 2,
                bgcolor: `${colors.primary.light}12`,
                border: `1px solid ${colors.primary.light}30`,
                '& .MuiAlert-message': { fontSize: '0.82rem' }
              }}
            >
              <strong>Instancia:</strong> {userInstanciaNombre}
            </Alert>
          )}

          <Alert
            severity="success"
            icon={<InfoIcon sx={{ fontSize: 18 }} />}
            sx={{
              borderRadius: 2,
              bgcolor: `${colors.secondary.light}12`,
              border: `1px solid ${colors.secondary.light}30`,
              '& .MuiAlert-message': { fontSize: '0.82rem' }
            }}
          >
            <strong>Nota:</strong> El usuario se creará automáticamente como <strong>activo</strong> por defecto.
          </Alert>
        </Box>
      </DialogContent>

      {/* ── Footer ── */}
      <DialogActions sx={{
        px: 3, py: 2,
        bgcolor: 'white',
        borderTop: `1px solid #E8EDF5`,
        gap: 1.5
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: colors.primary.main,
            color: colors.primary.main,
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            '&:hover': { bgcolor: `${colors.primary.main}08` }
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!isFormValid}
          sx={{
            bgcolor: colors.primary.main,
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            boxShadow: 'none',
            '&:hover': { bgcolor: colors.primary.dark, boxShadow: '0 4px 12px rgba(13,42,77,0.25)' },
            '&.Mui-disabled': { bgcolor: `${colors.primary.light}50`, color: 'white' }
          }}
        >
          Crear Usuario
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserModal;