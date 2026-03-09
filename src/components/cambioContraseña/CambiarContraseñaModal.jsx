import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import usuarioService from "../../services/usuarioService";

const CambiarContraseñaModal = ({ open, onClose, userId, onSuccess }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  // Calcular fortaleza de contraseña y requisitos
  const calculatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordRequirements({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
      });
      return;
    }
    
    // Verificar requisitos
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]+/.test(password),
      uppercase: /[A-Z]+/.test(password),
      number: /[0-9]+/.test(password),
      special: /[$@#&!¡¿?\-_+*]/.test(password),
    };
    setPasswordRequirements(requirements);
    
    // Calcular fortaleza basada en requisitos cumplidos
    const metRequirements = Object.values(requirements).filter(Boolean).length;
    const strengthPercentage = (metRequirements / 5) * 100;
    
    setPasswordStrength(strengthPercentage);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    if (name === "newPassword") {
      calculatePasswordStrength(value);
    }
    
    // Validación en tiempo real para confirmación
    if (name === "confirmPassword" || name === "newPassword") {
      if (passwordData.newPassword && passwordData.confirmPassword) {
        if (name === "newPassword" && value !== passwordData.confirmPassword) {
          setPasswordErrors(prev => ({ 
            ...prev, 
            confirmPassword: "Las contraseñas no coinciden" 
          }));
        } else if (name === "confirmPassword" && value !== passwordData.newPassword) {
          setPasswordErrors(prev => ({ 
            ...prev, 
            confirmPassword: "Las contraseñas no coinciden" 
          }));
        } else if (value === (name === "newPassword" ? passwordData.confirmPassword : passwordData.newPassword)) {
          setPasswordErrors(prev => ({ 
            ...prev, 
            confirmPassword: null 
          }));
        }
      }
    }
    
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleTogglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar contraseña actual
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Contraseña actual requerida";
    }
    
    // Validar nueva contraseña
    if (!passwordData.newPassword) {
      newErrors.newPassword = "Nueva contraseña requerida";
    } else {
      // Verificar todos los requisitos de seguridad
      const missingRequirements = [];
      if (!passwordRequirements.length) missingRequirements.push("8 caracteres");
      if (!passwordRequirements.lowercase) missingRequirements.push("minúsculas");
      if (!passwordRequirements.uppercase) missingRequirements.push("mayúsculas");
      if (!passwordRequirements.number) missingRequirements.push("números");
      if (!passwordRequirements.special) missingRequirements.push("caracteres especiales");
      
      if (missingRequirements.length > 0) {
        newErrors.newPassword = `Debe incluir: ${missingRequirements.join(", ")}`;
      }
    }
    
    // Validar confirmación
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Confirmar contraseña requerido";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    
    // Validar que la nueva contraseña sea diferente a la actual
    if (passwordData.newPassword && passwordData.currentPassword && 
        passwordData.newPassword === passwordData.currentPassword) {
      newErrors.newPassword = "La nueva contraseña debe ser diferente a la actual";
    }
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert("No se encontró el ID del usuario");
      return;
    }

    if (validateForm()) {
      setLoading(true);
      try {
        console.log(`Cambiando contraseña para usuario ${userId}`);
        
        const response = await usuarioService.cambiarPassword(
          userId,
          passwordData.currentPassword,
          passwordData.newPassword
        );
        
        console.log("Respuesta cambio de contraseña:", response);
        
        // Limpiar el formulario
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordErrors({});
        setPasswordStrength(0);
        setPasswordRequirements({
          length: false,
          lowercase: false,
          uppercase: false,
          number: false,
          special: false,
        });
        
        if (onSuccess) onSuccess();
        onClose();
        
      } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        setPasswordErrors({
          general: error.message || error.error || "Error al cambiar la contraseña"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
    setPasswordStrength(0);
    setPasswordRequirements({
      length: false,
      lowercase: false,
      uppercase: false,
      number: false,
      special: false,
    });
    onClose();
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "#dc2626"; // Rojo
    if (passwordStrength < 70) return "#f59e0b"; // Naranja
    if (passwordStrength < 90) return "#3b82f6"; // Azul
    return "#059669"; // Verde
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return "Muy Débil";
    if (passwordStrength < 70) return "Débil";
    if (passwordStrength < 90) return "Buena";
    return "Excelente";
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <LockIcon color="primary" />
          <Typography variant="h6">Cambiar Contraseña</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {passwordErrors.general && (
            <Alert severity="error">{passwordErrors.general}</Alert>
          )}

          <Alert severity="info" sx={{ mb: 2 }}>
            La contraseña debe cumplir con todos los requisitos de seguridad
          </Alert>

          <TextField
            fullWidth
            size="small"
            name="currentPassword"
            label="Contraseña Actual"
            type={showPassword.current ? "text" : "password"}
            value={passwordData.currentPassword}
            onChange={handleChange}
            error={!!passwordErrors.currentPassword}
            helperText={passwordErrors.currentPassword}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleTogglePasswordVisibility('current')}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            size="small"
            name="newPassword"
            label="Nueva Contraseña"
            type={showPassword.new ? "text" : "password"}
            value={passwordData.newPassword}
            onChange={handleChange}
            error={!!passwordErrors.newPassword}
            helperText={passwordErrors.newPassword}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleTogglePasswordVisibility('new')}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          {passwordData.newPassword && !loading && (
            <>
              <Box sx={{ mt: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                  <Typography variant="caption" color="textSecondary">
                    Fortaleza: {getPasswordStrengthText()}
                  </Typography>
                  <Typography variant="caption" fontWeight="bold" sx={{ color: getPasswordStrengthColor() }}>
                    {Math.round(passwordStrength)}%
                  </Typography>
                </Stack>
                <Box sx={{ height: 6, bgcolor: '#e5e7eb', borderRadius: 3, mt: 0.5, overflow: "hidden" }}>
                  <Box sx={{
                    height: "100%",
                    width: `${passwordStrength}%`,
                    bgcolor: getPasswordStrengthColor(),
                    borderRadius: 3,
                    transition: "width 0.3s ease",
                  }} />
                </Box>
              </Box>

              {/* Requisitos de seguridad */}
              <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Requisitos de seguridad:
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {passwordRequirements.length ? 
                      <CheckCircleIcon sx={{ fontSize: 18, color: '#059669' }} /> : 
                      <CancelIcon sx={{ fontSize: 18, color: '#dc2626' }} />
                    }
                    <Typography variant="body2" color={passwordRequirements.length ? 'success' : 'error'}>
                      Mínimo 8 caracteres
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {passwordRequirements.lowercase ? 
                      <CheckCircleIcon sx={{ fontSize: 18, color: '#059669' }} /> : 
                      <CancelIcon sx={{ fontSize: 18, color: '#dc2626' }} />
                    }
                    <Typography variant="body2" color={passwordRequirements.lowercase ? 'success' : 'error'}>
                      Al menos una letra minúscula
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {passwordRequirements.uppercase ? 
                      <CheckCircleIcon sx={{ fontSize: 18, color: '#059669' }} /> : 
                      <CancelIcon sx={{ fontSize: 18, color: '#dc2626' }} />
                    }
                    <Typography variant="body2" color={passwordRequirements.uppercase ? 'success' : 'error'}>
                      Al menos una letra mayúscula
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {passwordRequirements.number ? 
                      <CheckCircleIcon sx={{ fontSize: 18, color: '#059669' }} /> : 
                      <CancelIcon sx={{ fontSize: 18, color: '#dc2626' }} />
                    }
                    <Typography variant="body2" color={passwordRequirements.number ? 'success' : 'error'}>
                      Al menos un número
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {passwordRequirements.special ? 
                      <CheckCircleIcon sx={{ fontSize: 18, color: '#059669' }} /> : 
                      <CancelIcon sx={{ fontSize: 18, color: '#dc2626' }} />
                    }
                    <Typography variant="body2" color={passwordRequirements.special ? 'success' : 'error'}>
                      Al menos un carácter especial (@ # $ & ! ¡ ¿ ? - _ + *)
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </>
          )}

          <TextField
            fullWidth
            size="small"
            name="confirmPassword"
            label="Confirmar Nueva Contraseña"
            type={showPassword.confirm ? "text" : "password"}
            value={passwordData.confirmPassword}
            onChange={handleChange}
            error={!!passwordErrors.confirmPassword}
            helperText={passwordErrors.confirmPassword}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleTogglePasswordVisibility('confirm')}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Indicador de coincidencia */}
          {passwordData.newPassword && passwordData.confirmPassword && (
            <Chip
              icon={passwordData.newPassword === passwordData.confirmPassword ? 
                <CheckCircleIcon /> : <CancelIcon />}
              label={passwordData.newPassword === passwordData.confirmPassword ? 
                "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
              color={passwordData.newPassword === passwordData.confirmPassword ? "success" : "error"}
              variant="outlined"
              size="small"
              sx={{ alignSelf: 'flex-start' }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          disabled={loading || !allRequirementsMet || passwordData.newPassword !== passwordData.confirmPassword}
          sx={{ bgcolor: "#133B6B" }}
        >
          {loading ? "Cambiando..." : "Cambiar Contraseña"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CambiarContraseñaModal;