import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  Stack,
  Avatar,
  Divider,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  FiberNew as NewIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

// Services
import { crearInstancia } from "../../services/Instancia";
import usuarioService from "../../services/usuarioService";

// Constants
const institutionalColors = {
  primary: '#133B6B',
  secondary: '#1a4c7a',
  background: '#f8f9fa',
  lightBlue: 'rgba(19, 59, 107, 0.08)',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  success: '#4caf50',
  error: '#f44336',
};

const STEPS = ["Datos de la Instancia", "Apariencia", "Administrador"];

const emptyForm = {
  nombre: "",
  codigo: "",
  descripcion: "",
  activa: true,
  colorPrimario: institutionalColors.primary,
  colorSecundario: institutionalColors.secondary,
  colorAcento: "#27ae60",
  adminNombre: "",
  adminEmail: "",
  adminPassword: "",
};

// Main Component
const CreateInstanceDialog = ({ open, onClose, onCreated }) => {
  // State
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const [formData, setFormData] = useState(emptyForm);
  
  // Refs
  const isMounted = useRef(true);

  // Effects
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (open) {
      resetDialog();
    }
  }, [open]);

  // Handlers
  const resetDialog = () => {
    setFormData(emptyForm);
    setActiveStep(0);
    setError("");
    setShowPassword(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleClose = () => {
    if (!loading) onClose();
  };

  // Validation
  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!formData.nombre.trim()) {
          setError("El nombre de la instancia es requerido");
          return false;
        }
        if (!formData.codigo.trim()) {
          setError("El código de la instancia es requerido");
          return false;
        }
        break;

      case 2:
        if (!formData.adminNombre.trim()) {
          setError("El nombre del administrador es requerido");
          return false;
        }
        if (!formData.adminEmail.trim()) {
          setError("El email del administrador es requerido");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
          setError("El email no es válido");
          return false;
        }
        if (!formData.adminPassword || formData.adminPassword.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres");
          return false;
        }
        break;

      default:
        return true;
    }
    return true;
  };

  // Navigation
  const handleNext = () => {
    if (!validateStep(activeStep)) return;
    setError("");
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setActiveStep(prev => prev - 1);
  };

  // Submit
  const handleSave = async () => {
    if (!validateStep(2)) return;

    try {
      setLoading(true);
      setError("");

      // Crear instancia
      const instanciaCreada = await crearInstancia({
        nombre: formData.nombre,
        codigo: formData.codigo,
        descripcion: formData.descripcion,
        activa: formData.activa,
        colorPrimario: formData.colorPrimario,
        colorSecundario: formData.colorSecundario,
        colorAcento: formData.colorAcento,
        adminNombre: formData.adminNombre,
        adminEmail: formData.adminEmail,
      });

      const instanciaId = instanciaCreada?.id || instanciaCreada?.id_instancia;

      // Crear administrador
      await usuarioService.create({
        nombre: formData.adminNombre,
        email: formData.adminEmail,
        password: formData.adminPassword,
        rolNombre: "ADMIN",
        instanciaId,
        rolEspecifico: null,
        activo: true,
      });

      if (isMounted.current) {
        setSnackbar({ 
          open: true, 
          message: `Instancia "${formData.nombre}" y administrador creados exitosamente`, 
          severity: "success" 
        });
        
        if (onCreated) onCreated();
        
        setTimeout(() => {
          if (isMounted.current) onClose();
        }, 500);
      }
    } catch (err) {
      console.error("Error:", err);
      if (isMounted.current) {
        const msg = err.response?.data?.message || "Error al crear la instancia o el administrador";
        setError(msg);
        setSnackbar({ 
          open: true, 
          message: msg, 
          severity: "error" 
        });
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  // Render Functions
  const renderStepZero = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
          Ingresa la información principal de la nueva instancia.
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Nombre *
        </Typography>
        <TextField
          fullWidth
          size="small"
          autoFocus
          placeholder="Ej. CAAAREM Monterrey"
          value={formData.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
          disabled={loading}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Código *
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Ej. caaarem-mty"
          value={formData.codigo}
          onChange={(e) => handleChange("codigo", e.target.value.toLowerCase().replace(/\s/g, ""))}
          disabled={loading}
        />
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Descripción
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          size="small"
          placeholder="Descripción breve de la instancia..."
          value={formData.descripcion}
          onChange={(e) => handleChange("descripcion", e.target.value)}
          disabled={loading}
        />
      </Grid>
    </Grid>
  );

  const renderStepOne = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
          Personaliza los colores que identificarán a esta instancia.
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Color Primario
        </Typography>
        <TextField 
          type="color" 
          fullWidth 
          size="small" 
          value={formData.colorPrimario}
          onChange={(e) => handleChange("colorPrimario", e.target.value)} 
          disabled={loading}
          sx={{ '& input': { height: 40, cursor: 'pointer' } }} 
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Color Secundario
        </Typography>
        <TextField 
          type="color" 
          fullWidth 
          size="small" 
          value={formData.colorSecundario}
          onChange={(e) => handleChange("colorSecundario", e.target.value)} 
          disabled={loading}
          sx={{ '& input': { height: 40, cursor: 'pointer' } }} 
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Color Acento
        </Typography>
        <TextField 
          type="color" 
          fullWidth 
          size="small" 
          value={formData.colorAcento}
          onChange={(e) => handleChange("colorAcento", e.target.value)} 
          disabled={loading}
          sx={{ '& input': { height: 40, cursor: 'pointer' } }} 
        />
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Vista previa
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Stack direction="row" spacing={1}>
            <Box sx={{ width: 48, height: 48, bgcolor: formData.colorPrimario, borderRadius: 2, boxShadow: 1 }} />
            <Box sx={{ width: 48, height: 48, bgcolor: formData.colorSecundario, borderRadius: 2, boxShadow: 1 }} />
            <Box sx={{ width: 48, height: 48, bgcolor: formData.colorAcento, borderRadius: 2, boxShadow: 1 }} />
          </Stack>
          
          <Box sx={{ 
            ml: 2, 
            p: 2, 
            borderRadius: 2, 
            flex: 1, 
            bgcolor: formData.colorPrimario, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5 
          }}>
            <Avatar sx={{ 
              bgcolor: formData.colorAcento, 
              width: 36, 
              height: 36, 
              fontSize: '0.9rem', 
              fontWeight: 'bold' 
            }}>
              {formData.nombre?.charAt(0)?.toUpperCase() || "?"}
            </Avatar>
            
            <Box>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', lineHeight: 1 }}>
                {formData.nombre || "Nombre instancia"}
              </Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
                {formData.codigo || "codigo"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );

  const renderStepTwo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
          Crea el usuario administrador que gestionará esta instancia.
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Nombre *
        </Typography>
        <TextField
          fullWidth
          size="small"
          autoFocus
          placeholder="Nombre completo"
          value={formData.adminNombre}
          onChange={(e) => handleChange("adminNombre", e.target.value)}
          disabled={loading}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Email *
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="email"
          placeholder="admin@ejemplo.com"
          value={formData.adminEmail}
          onChange={(e) => handleChange("adminEmail", e.target.value)}
          disabled={loading}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Contraseña *
        </Typography>
        <TextField
          fullWidth
          size="small"
          type={showPassword ? "text" : "password"}
          placeholder="Mínimo 6 caracteres"
          value={formData.adminPassword}
          onChange={(e) => handleChange("adminPassword", e.target.value)}
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  size="small" 
                  onClick={() => setShowPassword(!showPassword)} 
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      {/* Resumen */}
      <Grid item xs={12}>
        <Box sx={{ p: 2, bgcolor: institutionalColors.lightBlue, borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ 
            color: institutionalColors.primary, 
            mb: 1, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5 
          }}>
            <CheckCircleIcon fontSize="small" /> Resumen de la instancia
          </Typography>
          
          <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
            <b>Nombre:</b> {formData.nombre} &nbsp;·&nbsp; <b>Código:</b> {formData.codigo}
          </Typography>
          
          {formData.descripcion && (
            <Typography variant="body2" sx={{ color: institutionalColors.textSecondary, mt: 0.5 }}>
              {formData.descripcion}
            </Typography>
          )}
          
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Box sx={{ width: 18, height: 18, bgcolor: formData.colorPrimario, borderRadius: 0.5 }} />
            <Box sx={{ width: 18, height: 18, bgcolor: formData.colorSecundario, borderRadius: 0.5 }} />
            <Box sx={{ width: 18, height: 18, bgcolor: formData.colorAcento, borderRadius: 0.5 }} />
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return renderStepZero();
      case 1:
        return renderStepOne();
      case 2:
        return renderStepTwo();
      default:
        return null;
    }
  };

  // Main Render
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: 3, 
            border: `1px solid ${institutionalColors.lightBlue}` 
          } 
        }}
      >
        {/* Header */}
        <DialogTitle sx={{ pb: 1, bgcolor: institutionalColors.background }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ 
              bgcolor: institutionalColors.lightBlue, 
              color: institutionalColors.primary, 
              width: 40, 
              height: 40 
            }}>
              <NewIcon />
            </Avatar>
            
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: institutionalColors.primary }}>
                Crear Nueva Instancia
              </Typography>
              <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
                Paso {activeStep + 1} de {STEPS.length} — {STEPS[activeStep]}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <Divider />

        {/* Stepper */}
        <Box sx={{ px: 4, pt: 3, pb: 2, bgcolor: institutionalColors.background }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {STEPS.map((label, index) => (
              <Step key={label} completed={index < activeStep}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      '&.Mui-active': { color: institutionalColors.primary },
                      '&.Mui-completed': { color: institutionalColors.success },
                    }
                  }}
                >
                  <Typography variant="caption" fontWeight={activeStep === index ? 700 : 400}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Divider />

        {/* Content */}
        <DialogContent sx={{ py: 4, minHeight: 300 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }} 
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}
          {renderStep()}
        </DialogContent>

        <Divider />

        {/* Actions */}
        <DialogActions sx={{ px: 3, py: 2, bgcolor: institutionalColors.background }}>
          <Button 
            onClick={handleClose} 
            disabled={loading} 
            sx={{ color: institutionalColors.textSecondary }}
          >
            Cancelar
          </Button>

          <Box sx={{ flex: 1 }} />

          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              disabled={loading}
              variant="outlined"
              sx={{ 
                mr: 1, 
                borderColor: institutionalColors.primary, 
                color: institutionalColors.primary 
              }}
            >
              Atrás
            </Button>
          )}

          {activeStep < STEPS.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ 
                px: 3, 
                borderRadius: 2, 
                bgcolor: institutionalColors.primary, 
                '&:hover': { bgcolor: institutionalColors.secondary } 
              }}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              sx={{
                px: 3, 
                borderRadius: 2, 
                minWidth: 150,
                bgcolor: institutionalColors.primary,
                '&:hover': { bgcolor: institutionalColors.secondary },
                '&.Mui-disabled': { bgcolor: alpha(institutionalColors.primary, 0.5) }
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  <Typography variant="button">Creando...</Typography>
                </Box>
              ) : "Crear Instancia"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateInstanceDialog;