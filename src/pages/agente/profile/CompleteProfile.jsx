import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Button,
  Stack,
  TextField,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  AlertTitle,
  Avatar,
  InputAdornment,
  IconButton,
  Snackbar,
  CircularProgress,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Save as SaveIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Warning as WarningIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  DoneAll as DoneAllIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Home as HomeIcon,
  Badge as BadgeIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

import { useAuth } from "../../../context/AuthContext";
import usuarioService from "../../../services/usuarioService";

const palette = {
  primary: "#133B6B",
  primaryLight: "#1a4c7a",
  primaryBg: "#EEF3F9",
  white: "#FFFFFF",
  text: "#0B1F3A",
  textMuted: "#6B7A8D",
  border: "#D6E0EC",
  borderLight: "#EEF3F9",
  success: "#00A8A8",
  successBg: "#E8F5EE",
  error: "#DC2626",
  warning: "#F59E0B",
};

// Definición de pasos del wizard
const STEPS = [
  {
    id: 0,
    key: "identidad",
    label: "Identidad",
    icon: BadgeIcon,
    description: "Datos oficiales de identificación",
    fields: [
      { name: "nombre", label: "Nombre Completo", type: "text", required: true, placeholder: "Ingresa tu nombre completo" },
      { name: "curp", label: "CURP", type: "text", required: true, placeholder: "XXXX000101HDFXXX00" },
      { name: "rfc", label: "RFC", type: "text", required: true, placeholder: "XXX000101XXX" },
      { name: "patenteAduanal", label: "Patente Aduanal", type: "text", required: true, placeholder: "PA-2024-00123" },
      { name: "fechaNacimiento", label: "Fecha de Nacimiento", type: "date", required: true },
      { name: "lugarNacimiento", label: "Lugar de Nacimiento", type: "text", required: true, placeholder: "Ciudad, Estado" },
      { name: "nacionalidad", label: "Nacionalidad", type: "text", required: true, placeholder: "Mexicana" },
      { name: "estadoCivil", label: "Estado Civil", type: "select", required: false, 
        options: ["Soltero", "Casado", "Divorciado", "Viudo", "Unión Libre"] },
    ],
  },
  {
    id: 1,
    key: "contacto",
    label: "Contacto",
    icon: PhoneIcon,
    description: "Información de contacto",
    fields: [
      { name: "telefono", label: "Teléfono Principal", type: "tel", required: true, placeholder: "+52 55 1234 5678" },
      { name: "telefonoAlternativo", label: "Teléfono Alternativo", type: "tel", required: false, placeholder: "+52 55 8765 4321" },
      { name: "emailAlternativo", label: "Correo Electrónico Alternativo", type: "email", required: false, placeholder: "contacto@ejemplo.com" },
    ],
  },
  {
    id: 2,
    key: "domicilios",
    label: "Domicilios",
    icon: HomeIcon,
    description: "Direcciones fiscales y particulares",
    fields: [
      { name: "domicilioFiscal", label: "Domicilio Fiscal", type: "textarea", required: false, 
        placeholder: "Calle, número, colonia, código postal, ciudad, estado" },
      { name: "domicilioParticular", label: "Domicilio Particular", type: "textarea", required: false,
        placeholder: "Calle, número, colonia, código postal, ciudad, estado" },
    ],
  },
  {
    id: 3,
    key: "seguridad",
    label: "Seguridad",
    icon: LockIcon,
    description: "Cambio de contraseña (OBLIGATORIO por seguridad)",
    fields: [],
  },
];

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  // Estados principales
  const [activeStep, setActiveStep] = useState(0);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [completedSections, setCompletedSections] = useState({
    identidad: false,
    contacto: false,
    domicilios: false,
    seguridad: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordChanged, setPasswordChanged] = useState(false);

  // Datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    curp: "",
    rfc: "",
    patenteAduanal: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    nacionalidad: "",
    estadoCivil: "",
    telefono: "",
    telefonoAlternativo: "",
    emailAlternativo: "",
    domicilioFiscal: "",
    domicilioParticular: "",
  });

  // Datos de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Cargar datos existentes del perfil al iniciar
  useEffect(() => {
    const cargarPerfil = async () => {
      if (!user?.id) return;

      try {
        const perfil = await usuarioService.obtenerPerfilAgente(user.id);
        if (perfil) {
          setFormData({
            nombre: user.nombre || "",
            curp: perfil.curp || "",
            rfc: perfil.rfc || "",
            patenteAduanal: perfil.patenteAduanal || "",
            fechaNacimiento: perfil.fechaNacimiento || "",
            lugarNacimiento: perfil.lugarNacimiento || "",
            nacionalidad: perfil.nacionalidad || "",
            estadoCivil: perfil.estadoCivil || "",
            telefono: perfil.telefono || "",
            telefonoAlternativo: perfil.telefonoAlternativo || "",
            emailAlternativo: perfil.emailAlternativo || "",
            domicilioFiscal: perfil.domicilioFiscal || "",
            domicilioParticular: perfil.domicilioParticular || "",
          });
        } else {
          // Si no hay perfil, al menos cargar el nombre del usuario
          setFormData(prev => ({
            ...prev,
            nombre: user.nombre || ""
          }));
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    };

    cargarPerfil();
  }, [user]);

  // Calcular fortaleza de contraseña
  useEffect(() => {
    const p = passwordData.newPassword;
    if (!p) { 
      setPasswordStrength(0); 
      return; 
    }
    let s = 0;
    if (p.length >= 8) s += 25;
    if (p.match(/[a-z]+/)) s += 25;
    if (p.match(/[A-Z]+/)) s += 25;
    if (p.match(/[0-9]+/)) s += 15;
    if (p.match(/[$@#&!]+/)) s += 10;
    setPasswordStrength(Math.min(s, 100));
  }, [passwordData.newPassword]);

  // Helpers
  const getStrengthColor = () => {
    if (passwordStrength < 50) return palette.error;
    if (passwordStrength < 75) return palette.warning;
    return palette.success;
  };

  const getStrengthText = () => {
    if (passwordStrength < 50) return "Débil";
    if (passwordStrength < 75) return "Media";
    return "Fuerte";
  };

  // Validar formulario de contraseña
  const validatePasswordForm = () => {
    const errors = {};
    
    // La contraseña es OBLIGATORIA
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Contraseña actual requerida";
    }
    if (!passwordData.newPassword) {
      errors.newPassword = "Nueva contraseña requerida";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Mínimo 8 caracteres";
    }
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Confirmar contraseña requerido";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }
    if (passwordData.newPassword && passwordData.currentPassword && 
        passwordData.newPassword === passwordData.currentPassword) {
      errors.newPassword = "La nueva contraseña debe ser diferente a la actual";
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validar sección actual
  const validateCurrentSection = () => {
    const section = STEPS[activeStep];
    const errors = {};

    section.fields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === "")) {
        errors[field.name] = "Este campo es requerido";
      }

      // Validaciones específicas
      if (formData[field.name] && field.name === "emailAlternativo" && 
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[field.name])) {
        errors[field.name] = "Email inválido";
      }

      if (formData[field.name] && field.name === "telefono" && 
          !/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(formData[field.name])) {
        errors[field.name] = "Teléfono inválido";
      }

      if (formData[field.name] && field.name === "curp" && 
          !/^[A-Z]{4}[0-9]{6}[A-Z]{6}[0-9]{2}$/.test(formData[field.name].toUpperCase())) {
        errors[field.name] = "CURP inválido";
      }

      if (formData[field.name] && field.name === "rfc" && 
          !/^[A-Z]{3,4}[0-9]{6}[A-Z0-9]{3}$/.test(formData[field.name].toUpperCase())) {
        errors[field.name] = "RFC inválido";
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleNext = () => {
    if (validateCurrentSection()) {
      const sectionKey = STEPS[activeStep].key;
      setCompletedSections(prev => ({ ...prev, [sectionKey]: true }));
      setActiveStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSavePassword = async () => {
    if (!validatePasswordForm()) return;
    
    setLoadingPassword(true);
    try {
      await usuarioService.cambiarPassword(
        user.id,
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      setCompletedSections(prev => ({ ...prev, seguridad: true }));
      setPasswordChanged(true);
      setSnackbar({ 
        open: true, 
        message: "Contraseña actualizada exitosamente", 
        severity: "success" 
      });
      
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.message || "Error al cambiar la contraseña", 
        severity: "error" 
      });
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleCompleteProfile = async () => {
    // Validar última sección si no es la de seguridad
    if (activeStep !== 3 && !validateCurrentSection()) return;

    // Marcar sección actual como completada
    const sectionKey = STEPS[activeStep].key;
    setCompletedSections(prev => ({ ...prev, [sectionKey]: true }));

    // Verificar que la contraseña se haya cambiado
    if (!completedSections.seguridad && !passwordChanged) {
      setSnackbar({
        open: true,
        message: "Debes cambiar tu contraseña por seguridad antes de completar el perfil",
        severity: "warning"
      });
      setActiveStep(3);
      return;
    }

    // Validar que todas las secciones requeridas estén completas
    const requiredSections = ["identidad", "contacto", "seguridad"];
    const allRequiredComplete = requiredSections.every(
      section => completedSections[section] || section === sectionKey || 
                (section === "seguridad" && passwordChanged)
    );

    if (!allRequiredComplete) {
      setSnackbar({
        open: true,
        message: "Debes completar todos los datos personales, de contacto y cambiar tu contraseña",
        severity: "warning"
      });
      return;
    }

    setLoadingSave(true);
    
    try {
      // Llamar al servicio completarPerfil con todos los datos
      await usuarioService.completarPerfil(
        user.id,
        user.instanciaId,
        {
          curp: formData.curp,
          rfc: formData.rfc,
          patenteAduanal: formData.patenteAduanal,
          fechaNacimiento: formData.fechaNacimiento,
          lugarNacimiento: formData.lugarNacimiento,
          nacionalidad: formData.nacionalidad,
          estadoCivil: formData.estadoCivil,
          domicilioFiscal: formData.domicilioFiscal,
          domicilioParticular: formData.domicilioParticular,
          telefono: formData.telefono,
          telefonoAlternativo: formData.telefonoAlternativo,
          emailAlternativo: formData.emailAlternativo,
        }
      );

      // Actualizar el nombre en usuarios si cambió
      if (formData.nombre !== user.nombre) {
        await usuarioService.update(user.id, {
          id: user.id,
          nombre: formData.nombre,
          email: user.email,
          activo: true,
          bloqueado: false,
          intentosFallidos: 0,
        });
      }

      // Actualizar el contexto
      updateUser({ 
        nombre: formData.nombre, 
        perfilCompleto: true 
      });

      setSnackbar({
        open: true,
        message: "¡Perfil completado exitosamente! Redirigiendo...",
        severity: "success"
      });

      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => navigate("/dashboard"), 2000);

    } catch (error) {
      console.error("Error al guardar perfil:", error);
      setSnackbar({
        open: true,
        message: error.message || "Error al guardar el perfil",
        severity: "error"
      });
    } finally {
      setLoadingSave(false);
    }
  };

  // Renderizar campo según tipo
  const renderField = (field) => {
    const { name, label, type, required, placeholder, options } = field;

    if (type === "select" && options) {
      return (
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" sx={{ color: palette.textMuted, fontWeight: 600, display: "block", mb: 0.5 }}>
            {label}
            {required && <span style={{ color: palette.error, marginLeft: 2 }}>*</span>}
          </Typography>
          <TextField
            fullWidth
            select
            size="small"
            name={name}
            value={formData[name] || ""}
            onChange={handleChange}
            error={!!fieldErrors[name]}
            helperText={fieldErrors[name]}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "white",
                "& fieldset": { borderColor: fieldErrors[name] ? palette.error : palette.border },
                "&:hover fieldset": { borderColor: palette.primary },
                "&.Mui-focused fieldset": { borderColor: palette.primary },
              },
            }}
          >
            {options.map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        </Box>
      );
    }

    if (type === "textarea") {
      return (
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" sx={{ color: palette.textMuted, fontWeight: 600, display: "block", mb: 0.5 }}>
            {label}
            {required && <span style={{ color: palette.error, marginLeft: 2 }}>*</span>}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            size="small"
            name={name}
            value={formData[name] || ""}
            onChange={handleChange}
            placeholder={placeholder}
            error={!!fieldErrors[name]}
            helperText={fieldErrors[name]}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "white",
                "& fieldset": { borderColor: fieldErrors[name] ? palette.error : palette.border },
                "&:hover fieldset": { borderColor: palette.primary },
                "&.Mui-focused fieldset": { borderColor: palette.primary },
              },
            }}
          />
        </Box>
      );
    }

    return (
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="caption" sx={{ color: palette.textMuted, fontWeight: 600, display: "block", mb: 0.5 }}>
          {label}
          {required && <span style={{ color: palette.error, marginLeft: 2 }}>*</span>}
        </Typography>
        <TextField
          fullWidth
          size="small"
          name={name}
          type={type}
          value={formData[name] || ""}
          onChange={handleChange}
          placeholder={placeholder}
          error={!!fieldErrors[name]}
          helperText={fieldErrors[name]}
          InputLabelProps={type === "date" ? { shrink: true } : undefined}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "white",
              "& fieldset": { borderColor: fieldErrors[name] ? palette.error : palette.border },
              "&:hover fieldset": { borderColor: palette.primary },
              "&.Mui-focused fieldset": { borderColor: palette.primary },
            },
          }}
        />
      </Box>
    );
  };

  // Renderizar sección de seguridad (ahora obligatoria)
  const renderSecuritySection = () => (
    <Box>
      <Alert severity="warning" sx={{ mb: 3 }}>
        <AlertTitle>Cambio de contraseña OBLIGATORIO</AlertTitle>
        Por seguridad, debes cambiar tu contraseña antes de completar tu perfil.
        {user?.email && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Usuario: <strong>{user.email}</strong>
          </Typography>
        )}
      </Alert>

      <Paper sx={{ p: 3, bgcolor: palette.white, borderRadius: 2 }}>
        <Grid container spacing={2}>
          {[
            { key: "currentPassword", label: "Contraseña Actual", field: "current" },
            { key: "newPassword", label: "Nueva Contraseña", field: "new" },
            { key: "confirmPassword", label: "Confirmar Nueva Contraseña", field: "confirm" },
          ].map(({ key, label, field }) => (
            <Grid item xs={12} key={key}>
              <TextField
                fullWidth
                size="small"
                name={key}
                label={label}
                type={showPassword[field] ? "text" : "password"}
                value={passwordData[key]}
                onChange={handlePasswordChange}
                error={!!passwordErrors[key]}
                helperText={passwordErrors[key]}
                disabled={loadingPassword || completedSections.seguridad}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(p => ({ ...p, [field]: !p[field] }))}
                        edge="end"
                      >
                        {showPassword[field] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {key === "newPassword" && passwordData.newPassword && !completedSections.seguridad && (
                <Box sx={{ mt: 1 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="textSecondary">
                      Fortaleza: {getStrengthText()}
                    </Typography>
                    <Typography variant="caption" fontWeight="bold" sx={{ color: getStrengthColor() }}>
                      {passwordStrength}%
                    </Typography>
                  </Stack>
                  <Box sx={{ 
                    height: 4, 
                    bgcolor: palette.borderLight, 
                    borderRadius: 2, 
                    mt: 0.5, 
                    overflow: "hidden" 
                  }}>
                    <Box sx={{ 
                      height: "100%", 
                      width: `${passwordStrength}%`, 
                      bgcolor: getStrengthColor(), 
                      borderRadius: 2, 
                      transition: "width 0.3s ease" 
                    }} />
                  </Box>
                </Box>
              )}
            </Grid>
          ))}
        </Grid>

        {!completedSections.seguridad ? (
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleSavePassword}
              startIcon={loadingPassword ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loadingPassword}
              sx={{ bgcolor: palette.primary }}
            >
              {loadingPassword ? "Cambiando..." : "Cambiar Contraseña"}
            </Button>
          </Stack>
        ) : (
          <Alert severity="success" sx={{ mt: 2 }}>
            <AlertTitle>¡Contraseña actualizada!</AlertTitle>
            Puedes continuar con el resto del perfil.
          </Alert>
        )}
      </Paper>
    </Box>
  );

  // Calcular progreso
  const completedCount = Object.values(completedSections).filter(Boolean).length + (passwordChanged ? 1 : 0);
  const totalSteps = STEPS.length;
  const progress = (completedCount / totalSteps) * 100;

  return (
    <Box sx={{ minHeight: "100vh", background: "#F4F7FB" }}>
      {/* Header */}
      <Paper elevation={0} sx={{ borderRadius: 0, borderBottom: `1px solid ${palette.border}`, px: 4, py: 2.5 }}>
        <Box sx={{ maxWidth: 1300, mx: "auto" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: palette.primary, width: 48, height: 48 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="700" sx={{ color: palette.text }}>
                  Completa tu Perfil de Agente Aduanal
                </Typography>
                <Typography variant="caption" sx={{ color: palette.textMuted }}>
                  {completedCount === totalSteps ? "Todo listo para finalizar" : "Completa la información requerida"}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          {/* Barra de progreso */}
          <Box sx={{ mt: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="caption" fontWeight="600" sx={{ color: palette.textMuted }}>
                Progreso
              </Typography>
              <Typography variant="caption" fontWeight="700" sx={{ color: palette.primary }}>
                {completedCount} de {totalSteps} pasos
              </Typography>
            </Stack>
            <Box sx={{ height: 6, bgcolor: palette.borderLight, borderRadius: 3, overflow: "hidden" }}>
              <Box sx={{ 
                height: "100%", 
                bgcolor: palette.success, 
                width: `${progress}%`, 
                transition: "width 0.3s ease", 
                borderRadius: 3 
              }} />
            </Box>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 3 }}>
            {STEPS.map((step) => (
              <Step key={step.key} completed={completedSections[step.key] || (step.key === "seguridad" && passwordChanged)}>
                <StepLabel>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>{step.label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Paper>

      {/* Contenido principal */}
      <Box sx={{ maxWidth: 1300, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }} icon={<WarningIcon />}>
          <AlertTitle>Completa tu información</AlertTitle>
          {activeStep === 3 
            ? "Paso OBLIGATORIO: Debes cambiar tu contraseña por seguridad."
            : `Paso ${activeStep + 1} de ${totalSteps}: ${STEPS[activeStep].label}`}
          {" "}Los campos marcados con <strong>*</strong> son obligatorios.
        </Alert>

        <Paper sx={{ borderRadius: 3, overflow: "hidden", border: `1px solid ${palette.border}` }}>
          <Box sx={{ p: 4 }}>
            {/* Sección de seguridad (paso 3) */}
            {activeStep === 3 ? (
              renderSecuritySection()
            ) : (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ color: palette.text }}>
                    {STEPS[activeStep].label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: palette.textMuted, mt: 0.5 }}>
                    {STEPS[activeStep].description}
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {STEPS[activeStep].fields.map((field) => (
                    <Grid item xs={12} md={field.type === "textarea" ? 12 : 6} key={field.name}>
                      {renderField(field)}
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            <Divider sx={{ my: 4 }} />

            {/* Navegación */}
            <Stack direction="row" justifyContent="space-between">
              <Button
                startIcon={<PrevIcon />}
                onClick={handlePrev}
                disabled={activeStep === 0}
                variant="outlined"
                sx={{
                  borderColor: palette.border,
                  color: palette.text,
                  textTransform: "none",
                  px: 3,
                  "&:hover": { borderColor: palette.primary, bgcolor: palette.primaryBg },
                }}
              >
                Anterior
              </Button>

              {activeStep < totalSteps - 1 ? (
                <Button
                  endIcon={<NextIcon />}
                  onClick={handleNext}
                  variant="contained"
                  sx={{ 
                    bgcolor: palette.primary, 
                    textTransform: "none", 
                    px: 3, 
                    "&:hover": { bgcolor: palette.primaryLight } 
                  }}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  endIcon={loadingSave ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <DoneAllIcon />}
                  onClick={handleCompleteProfile}
                  variant="contained"
                  color="success"
                  disabled={loadingSave || !completedSections.seguridad}
                  sx={{ textTransform: "none", px: 4, py: 1 }}
                >
                  {loadingSave ? "Guardando..." : "Completar Perfil"}
                </Button>
              )}
            </Stack>
          </Box>
        </Paper>
      </Box>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CompleteProfile;