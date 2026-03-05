import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Button, FormControl, InputLabel,
  Select, MenuItem, Box, Typography, Avatar, Chip, Alert,
  IconButton, Divider
} from '@mui/material';
import {
  Close as CloseIcon, LocationOn as LocationIcon,
  Info as InfoIcon, SwapHoriz as SwapHorizIcon
} from '@mui/icons-material';

const colors = {
  primary: { dark: '#0D2A4D', main: '#133B6B', light: '#3A6EA5' },
  secondary: { main: '#00A8A8', light: '#00C2D1' },
  accents: { blue: '#0099FF', purple: '#6C5CE7' },
  text: { primary: '#0D2A4D', secondary: '#3A6EA5' }
};

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

// Modal para cambiar región del usuario
const EditUserModal = ({
  open,
  onClose,
  onSave,
  user,
  availableRegions = [],
  loadingRegions = false,
  userInstanciaNombre,
  getRoleColor: getRoleColorProp = getRoleColor
}) => {
  const [selectedRegion, setSelectedRegion] = useState(user?.regionNombre || '');
  const [saving, setSaving] = useState(false);

  // Actualizar estado local cuando cambia el user prop
  React.useEffect(() => {
    if (user) {
      setSelectedRegion(user.regionNombre || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!selectedRegion) {
      return;
    }

    setSaving(true);
    try {
      // Crear objeto solo con la región a actualizar
      const userData = {
        id: user.id,
        regionNombre: selectedRegion
      };
      await onSave(userData);
    } finally {
      setSaving(false);
    }
  };

  const isFormValid = () => {
    return selectedRegion && selectedRegion !== user?.regionNombre;
  };

  if (!user) return null;

  const roleColor = getRoleColorProp(user.rolNombre);
  const isComite = esRolComite(user.rolNombre);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{
        bgcolor: colors.primary.main,
        color: 'white',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationIcon />
          <Typography variant="h6">
            Cambiar Región de Usuario
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Información del usuario */}
        <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ color: colors.primary.dark, mb: 1 }}>
            Usuario Seleccionado:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{
              width: 48, height: 48,
              bgcolor: roleColor,
              fontSize: '1rem', fontWeight: 'bold'
            }}>
              {user.nombre?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                {user.nombre}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                {user.email}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                <Chip
                  label={user.rolNombre}
                  size="small"
                  sx={{
                    bgcolor: `${roleColor}15`,
                    color: roleColor,
                    fontSize: '0.7rem', height: 20
                  }}
                />
                {isComite && user.rolEspecifico && (
                  <Chip
                    label={user.rolEspecifico}
                    size="small"
                    sx={{
                      bgcolor: `${colors.accents.purple}15`,
                      color: colors.accents.purple,
                      fontSize: '0.7rem', height: 20
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
          <Typography variant="body2">
            Solo puedes modificar la región del usuario. Los demás datos permanecerán igual.
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
            Región actual: <strong>{user.regionNombre || 'No asignada'}</strong>
          </Typography>
        </Alert>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="region-label">Nueva Región</InputLabel>
              <Select
                labelId="region-label"
                value={selectedRegion}
                label="Nueva Región"
                onChange={(e) => setSelectedRegion(e.target.value)}
                disabled={loadingRegions}
              >
                {loadingRegions ? (
                  <MenuItem disabled>Cargando regiones...</MenuItem>
                ) : availableRegions.length > 0 ? (
                  availableRegions.map((region) => (
                    <MenuItem key={region} value={region}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, color: colors.text.secondary }} />
                        <Typography>{region}</Typography>
                        {region === user.regionNombre && (
                          <Chip label="Actual" size="small" sx={{ height: 18, fontSize: '0.65rem', ml: 1 }} />
                        )}
                      </Box>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No hay regiones disponibles</MenuItem>
                )}
              </Select>
            </FormControl>
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
          disabled={!isFormValid() || saving}
          sx={{ bgcolor: colors.primary.main }}
        >
          {saving ? 'Guardando...' : 'Actualizar Región'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Modal para cambiar rol (se mantiene igual pero con todas las importaciones necesarias)
const ChangeRoleModal = ({
  open,
  onClose,
  onSave,
  user,
  availableRoles = [],
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
              <FormControl fullWidth>
                <InputLabel id="cargo-comite-label">Cargo en Comité *</InputLabel>
                <Select
                  labelId="cargo-comite-label"
                  value={localUser.rolEspecifico || ''}
                  label="Cargo en Comité *"
                  onChange={(e) => setLocalUser({ ...localUser, rolEspecifico: e.target.value })}
                  renderValue={(selected) =>
                    selected ? selected : <em style={{ color: '#999' }}>Seleccione un cargo</em>
                  }
                >
                  <MenuItem value="" disabled><em>Seleccione un cargo</em></MenuItem>
                  {['Presidente', 'Secretario Tecnico', 'Vocal A', 'Vocal B'].map((cargo) => {
                    const ocupado = ocupadosComite.includes(cargo);
                    return (
                      <MenuItem key={cargo} value={cargo} disabled={ocupado}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <span>{cargo}</span>
                          {ocupado && (
                            <Chip
                              label="Ocupado"
                              size="small"
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
              </FormControl>
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