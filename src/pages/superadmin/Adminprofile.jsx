import React, { useState, useEffect } from "react";

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
} from "@mui/material";

import { useNavigate } from "react-router-dom";

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
  Key as KeyIcon,
} from "@mui/icons-material";

import { useAuth } from "../../context/AuthContext";
import usuarioService from "../../services/usuarioService";
import {
  crearPerfilAdministrador,
} from "../../services/Perfiladministrador";

const palette = {
  primary: "#133B6B",
  primaryLight: "#1a4c7a",
  primaryBg: "#EEF3F9",
  white: "#FFFFFF",
  text: "#0B1F3A",
  textMuted: "#6B7A8D",
  border: "#D6E0EC",
  borderLight: "#EEF3F9",
  success: "#1A7F5A",
  successBg: "#E8F5EE",
  error: "#DC2626",
  warning: "#F59E0B",
};

const sections = [
  {
    key: "seguridad",
    label: "Contraseña",
    icon: LockIcon,
    description: "Por seguridad, primero cambia tu contraseña",
    fields: [],
  },
  {
    key: "personal",
    label: "Datos Personales",
    icon: PersonIcon,
    description: "Información personal del administrador",
    fields: [
      { name: "numeroEmpleado", label: "Número de Empleado", type: "text", required: true, placeholder: "SA-0001" },
      {
        name: "tipoAdmin",
        label: "Tipo de Administrador",
        type: "select",
        required: true,
        options: [
          { label: "Super Administrador", value: "SUPERADMIN" },
          { label: "Administrador", value: "ADMIN" },
        ],
      },
    ],
  },
  {
    key: "contacto",
    label: "Contacto",
    icon: PhoneIcon,
    description: "Información de contacto adicional",
    fields: [
      { name: "telefono", label: "Teléfono", type: "tel", required: false, placeholder: "+52 55 9876 5432" },
      { name: "emailAlternativo", label: "Email Alternativo", type: "email", required: false, placeholder: "admin@empresa.com" },
    ],
  },
  {
    key: "sistema",
    label: "Departamento",
    icon: BusinessIcon,
    description: "Área y departamento en el sistema",
    fields: [
      { name: "departamento", label: "Departamento", type: "text", required: false, placeholder: "Administración General" },
    ],
  },
];

const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const AdminProfile = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState(0);
  const [idUsuario, setIdUsuario] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [completedSections, setCompletedSections] = useState(
    Object.fromEntries(sections.map((s) => [s.key, false]))
  );

  const [formData, setFormData] = useState({
    numeroEmpleado: "",
    tipoAdmin: "",
    telefono: "",
    emailAlternativo: "",
    departamento: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});

  // ── Cargar usuario del storage ────────────────────────────────────────────
  useEffect(() => {
    const user = getUserFromStorage();
    if (user) {
      setIdUsuario(user.id || user.idUsuario);
      setUserEmail(user.email || "");
      
      // Forzar tipoAdmin como SUPERADMIN
      setFormData(prev => ({
        ...prev,
        tipoAdmin: "SUPERADMIN"
      }));
    } else {
      setSnackbar({ open: true, message: "No se encontró sesión activa.", severity: "error" });
    }
  }, []);

  // ── Fortaleza de contraseña ───────────────────────────────────────────────
  useEffect(() => {
    const p = passwordData.newPassword;
    if (!p) { setPasswordStrength(0); return; }
    let s = 0;
    if (p.length >= 8) s += 25;
    if (p.match(/[a-z]+/)) s += 25;
    if (p.match(/[A-Z]+/)) s += 25;
    if (p.match(/[0-9]+/)) s += 15;
    if (p.match(/[$@#&!]+/)) s += 10;
    setPasswordStrength(Math.min(s, 100));
  }, [passwordData.newPassword]);

  // ── Helpers ───────────────────────────────────────────────────────────────
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

  const validatePasswordForm = () => {
    const e = {};
    if (!passwordData.currentPassword) e.currentPassword = "Contraseña actual requerida";
    if (!passwordData.newPassword) e.newPassword = "Nueva contraseña requerida";
    else if (passwordData.newPassword.length < 8) e.newPassword = "Mínimo 8 caracteres";
    if (!passwordData.confirmPassword) e.confirmPassword = "Confirmar contraseña requerido";
    else if (passwordData.newPassword !== passwordData.confirmPassword) e.confirmPassword = "Las contraseñas no coinciden";
    if (passwordData.newPassword && passwordData.currentPassword &&
      passwordData.newPassword === passwordData.currentPassword)
      e.newPassword = "La nueva contraseña debe ser diferente a la actual";
    setPasswordErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateCurrentSection = () => {
    const section = sections[activeTab];
    const newErrors = {};
    section.fields.forEach(({ name, required }) => {
      if (required && (!formData[name] || formData[name].toString().trim() === "")) {
        newErrors[name] = "Este campo es requerido";
      }
      if (formData[name] && name === "emailAlternativo" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[name])) {
        newErrors[name] = "Email inválido";
      }
      if (formData[name] && name === "telefono" &&
        !/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(formData[name])) {
        newErrors[name] = "Teléfono inválido";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    
    // Log para depuración
    console.log("Campo cambiado:", name, value);
    console.log("Estado actual de completedSections:", completedSections);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleNext = () => {
    console.log("handleNext - activeTab:", activeTab);
    if (activeTab === 0) { 
      setActiveTab(1); 
      return; 
    }
    if (validateCurrentSection()) {
      const sectionKey = sections[activeTab].key;
      console.log("Marcando sección como completada:", sectionKey);
      setCompletedSections((prev) => {
        const newState = { ...prev, [sectionKey]: true };
        console.log("Nuevo estado de completedSections:", newState);
        return newState;
      });
      setActiveTab((t) => t + 1);
    }
  };

  const handlePrev = () => setActiveTab((t) => t - 1);

  const handleSavePassword = async () => {
    if (!idUsuario) return;
    if (!validatePasswordForm()) return;
    setLoadingPassword(true);
    try {
      await usuarioService.cambiarPassword(idUsuario, passwordData.currentPassword, passwordData.newPassword);
      console.log("Contraseña cambiada exitosamente, marcando sección seguridad como completada");
      setCompletedSections((prev) => {
        const newState = { ...prev, seguridad: true };
        console.log("Nuevo estado de completedSections después de cambiar contraseña:", newState);
        return newState;
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSnackbar({ open: true, message: "Contraseña actualizada exitosamente", severity: "success" });
      setTimeout(() => setActiveTab(1), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Error al cambiar la contraseña", severity: "error" });
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!idUsuario) return;

    if (!completedSections.seguridad) {
      setSnackbar({ open: true, message: "Debes cambiar tu contraseña primero", severity: "warning" });
      setActiveTab(0);
      return;
    }

    // Validar todas las secciones requeridas
    let allValid = true;
    const newCompleted = { ...completedSections };
    
    console.log("Validando todas las secciones. Estado actual:", completedSections);
    console.log("Datos del formulario:", formData);
    
    sections.forEach((section) => {
      if (section.key === "seguridad") return;
      
      // Verificar si todos los campos requeridos están llenos
      const requiredFields = section.fields.filter((f) => f.required);
      console.log(`Sección ${section.key} - Campos requeridos:`, requiredFields.map(f => f.name));
      
      const valid = requiredFields.every((f) => {
        const value = formData[f.name];
        const isValid = value && value.toString().trim() !== "";
        console.log(`  Campo ${f.name}: valor="${value}", válido=${isValid}`);
        return isValid;
      });
      
      console.log(`Sección ${section.key} válida: ${valid}`);
      newCompleted[section.key] = valid;
      if (!valid) allValid = false;
    });
    
    console.log("Nuevo estado de completedSections después de validar:", newCompleted);
    setCompletedSections(newCompleted);

    if (!allValid) {
      console.log("No todas las secciones son válidas. allValid =", allValid);
      setSnackbar({ open: true, message: "Hay campos obligatorios incompletos.", severity: "warning" });
      return;
    }

    console.log("Todas las secciones son válidas, procediendo a guardar...");
    setLoadingSave(true);
    try {
      const payload = {
        idUsuario,
        numeroEmpleado: formData.numeroEmpleado,
        tipoAdmin: "SUPERADMIN", // Forzar SUPERADMIN
        telefono: formData.telefono,
        emailAlternativo: formData.emailAlternativo,
        departamento: formData.departamento,
      };

      console.log("Enviando payload:", payload);
      await crearPerfilAdministrador(payload);

      updateUser({ perfilCompleto: true });

      setSnackbar({ open: true, message: "¡Perfil completado exitosamente! Redirigiendo...", severity: "success" });
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error("Error al guardar el perfil:", err);
      setSnackbar({ open: true, message: err.message || "Error al guardar el perfil", severity: "error" });
    } finally {
      setLoadingSave(false);
    }
  };

  // ── Render field ──────────────────────────────────────────────────────────
  const renderField = (field) => {
    const { name, label, type, required, placeholder, options } = field;

    // Si es el campo tipoAdmin, deshabilitarlo y forzar SUPERADMIN
    if (name === "tipoAdmin") {
      return (
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" sx={{ color: palette.textMuted, fontWeight: 600, display: "block", mb: 0.5 }}>
            {label}
            {required && <span style={{ color: palette.error, marginLeft: 2 }}>*</span>}
          </Typography>
          <TextField
            fullWidth
            size="small"
            value="Super Administrador"
            disabled
            InputProps={{
              readOnly: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#f5f5f5",
                "& fieldset": { borderColor: palette.border },
              },
            }}
          />
        </Box>
      );
    }

    if (type === "select") {
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
            error={!!errors[name]}
            helperText={errors[name]}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "white",
                "& fieldset": { borderColor: errors[name] ? palette.error : palette.border },
                "&:hover fieldset": { borderColor: palette.primary },
                "&.Mui-focused fieldset": { borderColor: palette.primary },
              },
            }}
          >
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
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
          value={formData[name] || ""}
          onChange={handleChange}
          placeholder={placeholder}
          type={type}
          error={!!errors[name]}
          helperText={errors[name]}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "white",
              "& fieldset": { borderColor: errors[name] ? palette.error : palette.border },
              "&:hover fieldset": { borderColor: palette.primary },
              "&.Mui-focused fieldset": { borderColor: palette.primary },
            },
          }}
        />
      </Box>
    );
  };

  // ── Sección contraseña ────────────────────────────────────────────────────
  const renderSecuritySection = () => (
    <Box>
      <Alert severity="warning" sx={{ mb: 3 }}>
        <AlertTitle>Paso 1: Cambia tu contraseña</AlertTitle>
        Por seguridad, debes cambiar tu contraseña antes de continuar.
        {userEmail && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Usuario: <strong>{userEmail}</strong>
          </Typography>
        )}
      </Alert>

      <Paper sx={{ p: 3, bgcolor: palette.white, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar sx={{ bgcolor: palette.primary }}><KeyIcon /></Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="600">Cambiar Contraseña</Typography>
            <Typography variant="caption" color="textSecondary">La contraseña debe tener al menos 8 caracteres</Typography>
          </Box>
        </Stack>

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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((p) => ({ ...p, [field]: !p[field] }))}
                        edge="end"
                        disabled={loadingPassword || completedSections.seguridad}
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
                    <Typography variant="caption" color="textSecondary">Fortaleza: {getStrengthText()}</Typography>
                    <Typography variant="caption" fontWeight="bold" sx={{ color: getStrengthColor() }}>{passwordStrength}%</Typography>
                  </Stack>
                  <Box sx={{ height: 4, bgcolor: palette.borderLight, borderRadius: 2, mt: 0.5, overflow: "hidden" }}>
                    <Box sx={{ height: "100%", width: `${passwordStrength}%`, bgcolor: getStrengthColor(), borderRadius: 2, transition: "width 0.3s ease" }} />
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

  // ── Cálculos de progreso ──────────────────────────────────────────────────
  const completedCount = Object.values(completedSections).filter(Boolean).length;
  const progress = (completedCount / sections.length) * 100;
  const allDone = completedCount === sections.length;

  // Log para depuración del estado
  console.log("=== ESTADO ACTUAL ===");
  console.log("completedSections:", completedSections);
  console.log("completedCount:", completedCount);
  console.log("allDone:", allDone);
  console.log("activeTab:", activeTab);
  console.log("formData:", formData);
  console.log("===================");

  return (
    <Box sx={{ minHeight: "100vh", background: "#F4F7FB" }}>
      {/* Header */}
      <Paper elevation={0} sx={{ borderRadius: 0, borderBottom: `1px solid ${palette.border}`, px: 4, py: 2.5 }}>
        <Box sx={{ maxWidth: 1300, mx: "auto" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: palette.primary, width: 48, height: 48 }}><PersonIcon /></Avatar>
              <Box>
                <Typography variant="h6" fontWeight="700" sx={{ color: palette.text }}>
                  Completa tu Perfil de Administrador
                </Typography>
                <Typography variant="caption" sx={{ color: palette.textMuted }}>
                  {allDone ? "Todo listo para finalizar" : "Configuración pendiente"}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          {/* Barra de progreso */}
          <Box sx={{ mt: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="caption" fontWeight="600" sx={{ color: palette.textMuted }}>Progreso</Typography>
              <Typography variant="caption" fontWeight="700" sx={{ color: palette.primary }}>
                {completedCount} de {sections.length} pasos
              </Typography>
            </Stack>
            <Box sx={{ height: 6, bgcolor: palette.borderLight, borderRadius: 3, overflow: "hidden" }}>
              <Box sx={{ height: "100%", bgcolor: palette.success, width: `${progress}%`, transition: "width 0.3s ease", borderRadius: 3 }} />
            </Box>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeTab} alternativeLabel sx={{ mt: 3 }}>
            {sections.map((section) => (
              <Step key={section.key} completed={completedSections[section.key]}>
                <StepLabel>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>{section.label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Paper>

      {/* Contenido */}
      <Box sx={{ maxWidth: 1300, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
        {!allDone && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }} icon={<WarningIcon />}>
            <AlertTitle>Completa todos los pasos</AlertTitle>
            {activeTab === 0
              ? "Primero debes cambiar tu contraseña por seguridad."
              : `Paso ${activeTab + 1} de ${sections.length}: ${sections[activeTab].label}`}
            {" "}Los campos marcados con <strong>*</strong> son obligatorios.
          </Alert>
        )}

        <Paper sx={{ borderRadius: 3, overflow: "hidden", border: `1px solid ${palette.border}` }}>
          <Box sx={{ p: 4 }}>
            {activeTab === 0 ? (
              renderSecuritySection()
            ) : (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ color: palette.text }}>
                    {sections[activeTab].label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: palette.textMuted, mt: 0.5 }}>
                    {sections[activeTab].description}
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  {sections[activeTab].fields.map((field) => (
                    <Grid item xs={12} md={6} key={field.name}>
                      {renderField(field)}
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {/* Navegación - Mostrar siempre */}
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
              <Button
                startIcon={<PrevIcon />}
                onClick={handlePrev}
                disabled={activeTab === 0}
                variant="outlined"
                sx={{ borderColor: palette.border, color: palette.text, textTransform: "none", px: 3, "&:hover": { borderColor: palette.primary, bgcolor: palette.primaryBg } }}
              >
                Anterior
              </Button>

              {activeTab < sections.length - 1 ? (
                <Button
                  endIcon={<NextIcon />}
                  onClick={handleNext}
                  variant="contained"
                  sx={{ bgcolor: palette.primary, textTransform: "none", px: 3, "&:hover": { bgcolor: palette.primaryLight } }}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  endIcon={loadingSave ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <DoneAllIcon />}
                  onClick={handleCompleteProfile}
                  variant="contained"
                  color="success"
                  disabled={loadingSave || !allDone}
                  sx={{ textTransform: "none", px: 4, py: 1 }}
                >
                  {loadingSave ? "Guardando..." : "Completar Perfil"}
                </Button>
              )}
            </Stack>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar((p) => ({ ...p, open: false }))} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminProfile;