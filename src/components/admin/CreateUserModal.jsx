import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  InputAdornment,
  Typography,
  Avatar,
  Box,
  Chip,
  Paper,
  Grid
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

// Colores institucionales
const institutionalColors = {
  primary: '#133B6B',      // Azul oscuro principal
  secondary: '#1a4c7a',    // Azul medio
  accent: '#e9e9e9',       // Color para acentos (gris claro)
  background: '#f8f9fa',   // Fondo claro
  lightBlue: 'rgba(19, 59, 107, 0.08)',  // Azul transparente para hover
  darkBlue: '#0D2A4D',     // Azul más oscuro
  textPrimary: '#2c3e50',  // Texto principal
  textSecondary: '#7f8c8d', // Texto secundario
  success: '#27ae60',      // Verde para éxito
  warning: '#f39c12',      // Naranja para advertencias
  error: '#e74c3c',        // Rojo para errores
  info: '#3498db',         // Azul para información
};

// Lista de instancias disponibles
const instances = [
  { id: 'instancia-administrativa', name: 'Instancia Administrativa', description: 'Área administrativa principal' },
  { id: 'instancia-ingenieria', name: 'Instancia de Ingeniería', description: 'Departamento de ingeniería y desarrollo' },
  { id: 'instancia-finanzas', name: 'Instancia de Finanzas', description: 'Gestión financiera y contable' },
  { id: 'instancia-recursos-humanos', name: 'Instancia de Recursos Humanos', description: 'Gestión de personal y nóminas' },
  { id: 'instancia-operaciones', name: 'Instancia de Operaciones', description: 'Operaciones y logística' },
  { id: 'instancia-calidad', name: 'Instancia de Calidad', description: 'Control de calidad y auditoría interna' },
  { id: 'instancia-comercial', name: 'Instancia Comercial', description: 'Ventas y atención al cliente' },
  { id: 'instancia-legal', name: 'Instancia Legal', description: 'Asuntos jurídicos y cumplimiento' },
  { id: 'instancia-soporte', name: 'Instancia de Soporte', description: 'Soporte técnico y TI' },
];

// Roles disponibles
const roles = [
  { id: 'agente', name: 'Agente Aduanal', color: '#526F78' },
  { id: 'comite', name: 'Comité', color: institutionalColors.primary },
  { id: 'profesionista', name: 'Profesionista', color: '#2e7d32' },
  { id: 'empresario', name: 'Empresario', color: '#ed6c02' },
  { id: 'admin', name: 'Administrador', color: institutionalColors.success },
];

// Regiones disponibles
const regions = [
  'Norte',
  'Sur',
  'Centro',
  'Metropolitana',
  'Occidente',
  'Noreste',
  'Todas las regiones'
];

const CreateUserModal = ({ open, onClose, onCreateUser, initialData = null }) => {
  const [userData, setUserData] = useState(
    initialData || {
      name: '',
      email: '',
      phone: '',
      role: 'agente',
      instance: 'instancia-administrativa',
      region: 'Norte',
      status: 'active'
    }
  );
  
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // Para wizard de creación

  const getRoleColor = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role?.color || institutionalColors.textSecondary;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!userData.name || userData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = 'Ingrese un email válido';
    }
    
    if (!userData.phone || userData.phone.trim().length < 10) {
      newErrors.phone = 'Ingrese un teléfono válido (mínimo 10 dígitos)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando se corrige
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Generar avatar iniciales
      const nameParts = userData.name.split(' ');
      const avatar = nameParts.length > 1 
        ? `${nameParts[0][0]}${nameParts[1][0]}` 
        : nameParts[0][0];
      
      // Obtener nombre del rol
      const selectedRole = roles.find(r => r.id === userData.role);
      
      // Obtener nombre de la instancia
      const selectedInstance = instances.find(i => i.id === userData.instance);
      
      const newUser = {
        ...userData,
        id: Date.now(), // ID temporal, se reemplazará en el padre
        avatar: avatar.toUpperCase(),
        roleName: selectedRole?.name || userData.role,
        color: getRoleColor(userData.role),
        instanceName: selectedInstance?.name || 'Instancia',
        lastAccessInstance: userData.instance,
        lastAccess: new Date().toLocaleDateString('es-ES') + ' ' + 
                    new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        registrationDate: new Date().toLocaleDateString('es-ES'),
        compliance: 0,
        certifications: 0,
        pending: 0,
      };
      
      onCreateUser(newUser);
      resetForm();
    }
  };

  const resetForm = () => {
    setUserData({
      name: '',
      email: '',
      phone: '',
      role: 'agente',
      instance: 'instancia-administrativa',
      region: 'Norte',
      status: 'active'
    });
    setErrors({});
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleNextStep = () => {
    if (step === 1 && validateForm()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      {/* Header con diseño mejorado */}
      <DialogTitle sx={{ 
        bgcolor: institutionalColors.primary,
        color: 'white',
        py: 2,
        px: 3,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: 'white', color: institutionalColors.primary }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {initialData ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Complete la información para {initialData ? 'actualizar el' : 'crear un nuevo'} usuario en el sistema
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: institutionalColors.background }}>
        {/* Wizard Steps Indicator */}
        {!initialData && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label="1. Información básica"
                color={step === 1 ? 'primary' : 'default'}
                sx={{
                  bgcolor: step === 1 ? institutionalColors.primary : '#e0e0e0',
                  color: step === 1 ? 'white' : institutionalColors.textSecondary,
                  fontWeight: step === 1 ? 600 : 400,
                  px: 2
                }}
              />
              <Box sx={{ width: 40, height: 2, bgcolor: step === 2 ? institutionalColors.primary : '#e0e0e0' }} />
              <Chip 
                label="2. Asignación de permisos"
                color={step === 2 ? 'primary' : 'default'}
                sx={{
                  bgcolor: step === 2 ? institutionalColors.primary : '#e0e0e0',
                  color: step === 2 ? 'white' : institutionalColors.textSecondary,
                  fontWeight: step === 2 ? 600 : 400,
                  px: 2
                }}
              />
            </Box>
          </Box>
        )}

        {step === 1 && (
          <Stack spacing={2.5}>
            {/* Nombre completo */}
            <TextField
              label="Nombre completo"
              fullWidth
              value={userData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: institutionalColors.primary,
                }
              }}
            />

            {/* Email */}
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={userData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: institutionalColors.primary,
                }
              }}
            />

            {/* Teléfono */}
            <TextField
              label="Teléfono"
              fullWidth
              value={userData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: institutionalColors.primary,
                }
              }}
            />

            {/* Vista previa del avatar */}
            {userData.name && (
              <Paper sx={{ p: 2, bgcolor: 'white', border: `1px dashed ${institutionalColors.primary}` }}>
                <Typography variant="subtitle2" sx={{ color: institutionalColors.textSecondary, mb: 1 }}>
                  Vista previa del avatar:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: getRoleColor(userData.role),
                      width: 48,
                      height: 48
                    }}
                  >
                    {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: institutionalColors.textPrimary }}>
                      {userData.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                      {userData.email || 'email@ejemplo.com'}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}
          </Stack>
        )}

        {step === 2 && (
          <Stack spacing={2.5}>
            {/* Rol */}
            <FormControl fullWidth required>
              <InputLabel sx={{ 
                '&.Mui-focused': { color: institutionalColors.primary } 
              }}>
                Rol
              </InputLabel>
              <Select
                value={userData.role}
                label="Rol"
                onChange={(e) => handleChange('role', e.target.value)}
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: institutionalColors.primary,
                  }
                }}
              >
                {roles.map(role => (
                  <MenuItem key={role.id} value={role.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: role.color 
                      }} />
                      {role.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Instancia */}
            <FormControl fullWidth required>
              <InputLabel sx={{ 
                '&.Mui-focused': { color: institutionalColors.primary } 
              }}>
                Instancia
              </InputLabel>
              <Select
                value={userData.instance}
                label="Instancia"
                onChange={(e) => handleChange('instance', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <BusinessIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                  </InputAdornment>
                }
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: institutionalColors.primary,
                  }
                }}
              >
                {instances.map(instance => (
                  <MenuItem key={instance.id} value={instance.id}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                        {instance.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                        {instance.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Región */}
            <FormControl fullWidth required>
              <InputLabel sx={{ 
                '&.Mui-focused': { color: institutionalColors.primary } 
              }}>
                Región
              </InputLabel>
              <Select
                value={userData.region}
                label="Región"
                onChange={(e) => handleChange('region', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <LocationIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                  </InputAdornment>
                }
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: institutionalColors.primary,
                  }
                }}
              >
                {regions.map(region => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Estado del usuario */}
            <Paper sx={{ p: 2, bgcolor: 'white' }}>
              <Typography variant="subtitle2" sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
                Estado de la cuenta
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={userData.status === 'active'}
                    onChange={(e) => handleChange('status', e.target.checked ? 'active' : 'inactive')}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: institutionalColors.success,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: institutionalColors.success,
                      }
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {userData.status === 'active' ? (
                      <>
                        <CheckCircleIcon sx={{ color: institutionalColors.success, fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: institutionalColors.success }}>
                          Usuario activo
                        </Typography>
                      </>
                    ) : (
                      <>
                        <CancelIcon sx={{ color: institutionalColors.error, fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: institutionalColors.error }}>
                          Usuario inactivo
                        </Typography>
                      </>
                    )}
                  </Box>
                }
              />
            </Paper>

            {/* Resumen de creación */}
            <Paper sx={{ p: 2, bgcolor: institutionalColors.lightBlue }}>
              <Typography variant="subtitle2" sx={{ color: institutionalColors.primary, mb: 1 }}>
                Resumen del nuevo usuario:
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                    Nombre:
                  </Typography>
                  <Typography variant="body2" sx={{ color: institutionalColors.textPrimary, fontWeight: 500 }}>
                    {userData.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                    Email:
                  </Typography>
                  <Typography variant="body2" sx={{ color: institutionalColors.textPrimary, fontWeight: 500 }}>
                    {userData.email}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                    Rol:
                  </Typography>
                  <Typography variant="body2" sx={{ color: getRoleColor(userData.role), fontWeight: 500 }}>
                    {roles.find(r => r.id === userData.role)?.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                    Instancia:
                  </Typography>
                  <Typography variant="body2" sx={{ color: institutionalColors.textPrimary, fontWeight: 500 }}>
                    {instances.find(i => i.id === userData.instance)?.name}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: 'white', borderTop: `1px solid #e5e7eb` }}>
        <Button 
          onClick={handleClose}
          sx={{ color: institutionalColors.textSecondary }}
        >
          Cancelar
        </Button>
        
        {!initialData && step === 1 && (
          <Button 
            variant="contained"
            onClick={handleNextStep}
            sx={{
              bgcolor: institutionalColors.primary,
              '&:hover': { bgcolor: institutionalColors.secondary },
              '&:disabled': {
                bgcolor: institutionalColors.textSecondary
              }
            }}
          >
            Siguiente
          </Button>
        )}

        {(!initialData && step === 2) || initialData ? (
          <>
            {!initialData && (
              <Button onClick={handlePrevStep}>
                Anterior
              </Button>
            )}
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              sx={{
                bgcolor: institutionalColors.primary,
                '&:hover': { bgcolor: institutionalColors.secondary }
              }}
            >
              {initialData ? 'Actualizar Usuario' : 'Crear Usuario'}
            </Button>
          </>
        ) : null}
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserModal;