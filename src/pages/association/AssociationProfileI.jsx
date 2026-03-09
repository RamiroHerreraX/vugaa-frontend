import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Stack,
  TextField,
  Paper,
  Chip,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  Alert,
  AlertTitle,
  Avatar,
  Divider,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Switch,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
  Save as SaveIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  AccountBalance as BalanceIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  DoneAll as DoneAllIcon,
  Image as ImageIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Key as KeyIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import asociacionService from "../../services/asociacion"
import usuarioService from "../../services/usuarioService";

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
  successBorder: "#A3D4BC",
  activeBg: "#F0F6FF",
  activeBorder: "#93B8E0",
  pendingBg: "#F8F9FB",
  pendingBorder: "#E2E8F0",
  error: "#DC2626",
  warning: "#F59E0B",
  info: "#3B82F6",
};

const sections = [
  {
    key: "seguridad",
    label: "Cambiar Contraseña",
    icon: LockIcon,
    description: "Por seguridad, primero cambia tu contraseña",
    fields: [],
  },
  {
    key: "identificacion",
    label: "Identificación",
    icon: BusinessIcon,
    description: "Datos básicos de identificación",
    fields: [
      { name: "codigo", label: "Código Interno", type: "text", required: false, placeholder: "ASOC-001" },
      { name: "nombre", label: "Nombre de la Asociación", type: "text", required: true, placeholder: "Asociación Aduanal del Norte, S.A. de C.V." },
      { name: "cif", label: "RFC / CIF", type: "text", required: true, placeholder: "AAN240101XYZ" },
      { name: "activa", label: "Asociación Activa", type: "switch", required: false, default: true },
    ],
  },
  {
    key: "fiscal",
    label: "Datos Fiscales",
    icon: BalanceIcon,
    description: "Información fiscal y certificaciones",
    fields: [
      { name: "regimenFiscal", label: "Régimen Fiscal", type: "text", required: true, placeholder: "Personas Morales con Fines No Lucrativos" },
      { name: "numeroCertificacionSat", label: "Número de Certificación SAT", type: "text", required: false, placeholder: "SAT-2020-001234" },
      { name: "vigenciaCertificacionSat", label: "Vigencia de Certificación", type: "date", required: false },
      { name: "fechaConstitucion", label: "Fecha de Constitución", type: "date", required: true },
    ],
  },
  {
    key: "representacion",
    label: "Representación Legal",
    icon: PersonIcon,
    description: "Datos del representante legal",
    fields: [
      { name: "representanteLegal", label: "Nombre del Representante", type: "text", required: true, placeholder: "Luis Rodríguez Martínez" },
      { name: "rfcRepresentanteLegal", label: "RFC del Representante", type: "text", required: true, placeholder: "RMLU850101HDF" },
    ],
  },
  {
    key: "contacto",
    label: "Contacto",
    icon: PhoneIcon,
    description: "Información de contacto principal",
    fields: [
      { name: "email", label: "Correo Electrónico", type: "email", required: true, placeholder: "contacto@asociacionnorte.com" },
      { name: "telefono", label: "Teléfono", type: "tel", required: true, placeholder: "+52 55 1234 5678" },
      { name: "sitioWeb", label: "Sitio Web", type: "url", required: false, placeholder: "www.asociacionnorte.com" },
    ],
  },
  {
    key: "ubicacion",
    label: "Ubicación",
    icon: LocationIcon,
    description: "Dirección fiscal completa",
    fields: [
      { name: "direccion", label: "Calle y Número", type: "text", required: true, placeholder: "Av. Industrial 1234" },
      { name: "colonia", label: "Colonia", type: "text", required: true, placeholder: "Parque Industrial del Norte" },
      { name: "ciudad", label: "Ciudad", type: "text", required: true, placeholder: "Monterrey" },
      { name: "estado", label: "Estado", type: "text", required: true, placeholder: "Nuevo León" },
      { name: "codigoPostal", label: "Código Postal", type: "text", required: true, placeholder: "66470" },
      { name: "pais", label: "País", type: "text", required: false, placeholder: "México", default: "México" },
    ],
  },
  {
    key: "multimedia",
    label: "Logo",
    icon: ImageIcon,
    description: "Logo de la asociación",
    fields: [
      { name: "logoUrl", label: "URL del Logo", type: "url", required: false, placeholder: "https://ejemplo.com/logo.png" },
    ],
  },
];

// Función para obtener datos del usuario del storage
const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user;
    }
    return null;
  } catch (error) {
    console.error("Error al obtener usuario del storage:", error);
    return null;
  }
};

const getIdUsuarioFromStorage = () => {
  const user = getUserFromStorage();
  return user?.id || user?.idUsuario || null;
};

const AssociationProfile = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth(); // Agregar updateUser del contexto
  const [activeTab, setActiveTab] = useState(0);
  const [idAsociacion, setIdAsociacion] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [loadingAsociacion, setLoadingAsociacion] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
  const [completedSections, setCompletedSections] = useState(
    Object.fromEntries(sections.map((s) => [s.key, false]))
  );
  
  const [formData, setFormData] = useState({
    // Identificación
    codigo: "",
    nombre: "",
    cif: "",
    activa: true,
    
    // Fiscal
    regimenFiscal: "",
    numeroCertificacionSat: "",
    vigenciaCertificacionSat: "",
    fechaConstitucion: "",
    
    // Representación
    representanteLegal: "",
    rfcRepresentanteLegal: "",
    
    // Contacto
    email: "",
    telefono: "",
    sitioWeb: "",
    
    // Ubicación
    direccion: "",
    colonia: "",
    ciudad: "",
    estado: "",
    codigoPostal: "",
    pais: "México",
    
    // Multimedia
    logoUrl: "",
    
    // Fechas de sistema
    fechaRegistro: "",
    fechaActualizacion: "",
  });
  
  // Estado para cambio de contraseña
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
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChanged, setPasswordChanged] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [direccionCompleta, setDireccionCompleta] = useState("");
  const [contactoPrincipal, setContactoPrincipal] = useState("");
  const [perfilCompleto, setPerfilCompleto] = useState(false);

  // Obtener ID del usuario al inicio
  useEffect(() => {
    const id = getIdUsuarioFromStorage();
    if (id) {
      setIdUsuario(id);
      console.log("ID Usuario:", id);
    } else {
      setSnackbar({
        open: true,
        message: "No se encontró sesión activa. Por favor inicia sesión nuevamente.",
        severity: "error",
      });
    }
  }, []);

  // Obtener idAsociacion y cargar datos
  useEffect(() => {
    if (!idUsuario) return;

    const cargarAsociacion = async () => {
      setLoadingAsociacion(true);
      try {
        console.log("Buscando asociación para usuario:", idUsuario);
        const asociacion = await asociacionService.findByUsuarioId(idUsuario);
        console.log("Asociación encontrada:", asociacion);
        
        setIdAsociacion(asociacion.idAsociacion);
        setUserEmail(asociacion.email || "");
        
        // Mapear datos de la asociación al formData
        const mappedData = {
          // Identificación
          codigo: asociacion.codigo || "",
          nombre: asociacion.nombre || "",
          cif: asociacion.cif || "",
          activa: asociacion.activa !== undefined ? asociacion.activa : true,
          
          // Fiscal
          regimenFiscal: asociacion.regimenFiscal || "",
          numeroCertificacionSat: asociacion.numeroCertificacionSat || "",
          vigenciaCertificacionSat: asociacion.vigenciaCertificacionSat || "",
          fechaConstitucion: asociacion.fechaConstitucion || "",
          
          // Representación
          representanteLegal: asociacion.representanteLegal || "",
          rfcRepresentanteLegal: asociacion.rfcRepresentanteLegal || "",
          
          // Contacto
          email: asociacion.email || "",
          telefono: asociacion.telefono || "",
          sitioWeb: asociacion.sitioWeb || "",
          
          // Ubicación
          direccion: asociacion.direccion || "",
          colonia: asociacion.colonia || "",
          ciudad: asociacion.ciudad || "",
          estado: asociacion.estado || "",
          codigoPostal: asociacion.codigoPostal || "",
          pais: asociacion.pais || "México",
          
          // Multimedia
          logoUrl: asociacion.logoUrl || "",
          
          // Fechas de sistema
          fechaRegistro: asociacion.fechaRegistro || "",
          fechaActualizacion: asociacion.fechaActualizacion || "",
        };
        
        setFormData(mappedData);
        
        // Calcular secciones completadas basado en datos existentes
        const nuevasCompletadas = { ...completedSections };
        sections.forEach(section => {
          if (section.key === "seguridad") {
            // La sección de seguridad se completa cuando se cambia la contraseña
            nuevasCompletadas[section.key] = false;
            return;
          }
          
          let sectionComplete = true;
          section.fields.forEach(({ name, required }) => {
            if (required) {
              const value = mappedData[name];
              if (!value || value.toString().trim() === "") {
                sectionComplete = false;
              }
            }
          });
          nuevasCompletadas[section.key] = sectionComplete;
        });
        setCompletedSections(nuevasCompletadas);
        
      } catch (error) {
        console.error("Error al cargar asociación:", error);
        setSnackbar({
          open: true,
          message: error.message || "No se pudo obtener la asociación del usuario. Verifica tu sesión.",
          severity: "error",
        });
      } finally {
        setLoadingAsociacion(false);
      }
    };
    
    cargarAsociacion();
  }, [idUsuario]);

  // Actualizar campos calculados
  useEffect(() => {
    const direccionParts = [];
    if (formData.direccion) direccionParts.push(formData.direccion);
    if (formData.colonia) direccionParts.push(formData.colonia);
    if (formData.ciudad) direccionParts.push(formData.ciudad);
    if (formData.estado) direccionParts.push(formData.estado);
    
    let direccionStr = direccionParts.join(", ");
    if (formData.codigoPostal) direccionStr += ` - CP: ${formData.codigoPostal}`;
    if (formData.pais && formData.pais !== "México") direccionStr += ` - ${formData.pais}`;
    
    setDireccionCompleta(direccionStr);

    const contactoParts = [];
    if (formData.email) contactoParts.push(`Email: ${formData.email}`);
    if (formData.telefono) contactoParts.push(`Tel: ${formData.telefono}`);
    setContactoPrincipal(contactoParts.join(" | "));

    const completo = 
      formData.nombre && formData.nombre.trim() !== "" &&
      formData.cif && formData.cif.trim() !== "" &&
      formData.email && formData.email.trim() !== "" &&
      formData.telefono && formData.telefono.trim() !== "" &&
      formData.representanteLegal && formData.representanteLegal.trim() !== "" &&
      formData.fechaConstitucion;
    
    setPerfilCompleto(completo);
  }, [formData]);

  // Calcular fortaleza de contraseña
  useEffect(() => {
    const password = passwordData.newPassword;
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 15;
    if (password.match(/[$@#&!]+/)) strength += 10;
    
    setPasswordStrength(Math.min(strength, 100));
  }, [passwordData.newPassword]);

  const validateCurrentSection = () => {
    const section = sections[activeTab];
    const newErrors = {};
    
    section.fields.forEach(({ name, required }) => {
      if (required) {
        const value = formData[name];
        if (value === undefined || value === null || value.toString().trim() === "") {
          newErrors[name] = "Este campo es requerido";
        }
      }
      
      if (formData[name] && formData[name].toString().trim() !== "") {
        if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[name])) {
          newErrors[name] = "Correo electrónico inválido";
        }
        if (name === "sitioWeb" && formData[name] && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData[name])) {
          newErrors[name] = "URL inválida";
        }
        if (name === "telefono" && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(formData[name])) {
          newErrors[name] = "Teléfono inválido";
        }
        if (name === "codigoPostal" && !/^\d{5}$/.test(formData[name])) {
          newErrors[name] = "Código postal debe tener 5 dígitos";
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Contraseña actual requerida";
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = "Nueva contraseña requerida";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Mínimo 8 caracteres";
    }
    
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

  const completeSection = () => {
    if (activeTab === 0) {
      // Sección de seguridad se maneja aparte con handleSavePassword
      return true;
    } else if (validateCurrentSection()) {
      setCompletedSections(prev => ({
        ...prev,
        [sections[activeTab].key]: true
      }));
      return true;
    }
    return false;
  };

  const handleNext = () => {
    if (activeTab < sections.length - 1) {
      if (activeTab === 0 || completeSection()) {
        setActiveTab(activeTab + 1);
      }
    }
  };

  const handlePrev = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  const handleTabChange = (event, newValue) => {
    if (newValue > activeTab && !completedSections[sections[activeTab].key] && activeTab !== 0) {
      if (!validateCurrentSection()) {
        return;
      }
      setCompletedSections(prev => ({
        ...prev,
        [sections[activeTab].key]: true
      }));
    }
    setActiveTab(newValue);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleTogglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Método para cambiar contraseña (sección 0)
  const handleSavePassword = async () => {
    if (!idUsuario) {
      setSnackbar({
        open: true,
        message: "No se encontró el ID del usuario",
        severity: "error",
      });
      return;
    }

    if (validatePasswordForm()) {
      setLoadingPassword(true);
      try {
        console.log(`Cambiando contraseña para usuario ${idUsuario}`);
        
        const response = await usuarioService.cambiarPassword(
          idUsuario,
          passwordData.currentPassword,
          passwordData.newPassword
        );
        
        console.log("Respuesta cambio de contraseña:", response);
        
        setPasswordChanged(true);
        setCompletedSections(prev => ({
          ...prev,
          seguridad: true
        }));
        
        // Limpiar el formulario
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        
        setSnackbar({
          open: true,
          message: "Contraseña actualizada exitosamente",
          severity: "success",
        });

        // Avanzar a la siguiente sección automáticamente
        setTimeout(() => {
          setActiveTab(1);
        }, 1500);
        
      } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        setSnackbar({
          open: true,
          message: error.message || error.error || "Error al cambiar la contraseña",
          severity: "error",
        });
      } finally {
        setLoadingPassword(false);
      }
    }
  };

  // Método para finalizar y guardar todo
  const handleCompleteProfile = async () => {
    if (!idAsociacion) {
      setSnackbar({
        open: true,
        message: "No se encontró el ID de la asociación",
        severity: "error",
      });
      return;
    }

    // Validar todas las secciones excepto seguridad
    let allValid = true;
    const newCompleted = { ...completedSections };
    
    sections.forEach((section) => {
      if (section.key === "seguridad") return;
      
      let sectionValid = true;
      section.fields.forEach(({ name, required }) => {
        if (required) {
          const value = formData[name];
          if (value === undefined || value === null || value.toString().trim() === "") {
            sectionValid = false;
            allValid = false;
          }
        }
      });
      newCompleted[section.key] = sectionValid;
    });
    
    setCompletedSections(newCompleted);
    
    if (!allValid) {
      setSnackbar({
        open: true,
        message: "Hay secciones incompletas. Por favor completa toda la información requerida.",
        severity: "warning",
      });
      return;
    }

    // Verificar que la contraseña fue cambiada
    if (!completedSections.seguridad) {
      setSnackbar({
        open: true,
        message: "Debes cambiar tu contraseña primero",
        severity: "warning",
      });
      setActiveTab(0);
      return;
    }

    // Preparar DTO para actualización
    const asociacionDTO = {
      codigo: formData.codigo,
      nombre: formData.nombre,
      cif: formData.cif,
      activa: formData.activa,
      regimenFiscal: formData.regimenFiscal,
      numeroCertificacionSat: formData.numeroCertificacionSat,
      vigenciaCertificacionSat: formData.vigenciaCertificacionSat,
      fechaConstitucion: formData.fechaConstitucion,
      representanteLegal: formData.representanteLegal,
      rfcRepresentanteLegal: formData.rfcRepresentanteLegal,
      email: formData.email,
      telefono: formData.telefono,
      sitioWeb: formData.sitioWeb,
      direccion: formData.direccion,
      colonia: formData.colonia,
      ciudad: formData.ciudad,
      estado: formData.estado,
      codigoPostal: formData.codigoPostal,
      pais: formData.pais,
      logoUrl: formData.logoUrl,
    };

    setLoadingSave(true);
    try {
      console.log(`Completando perfil de asociación ${idAsociacion}:`, asociacionDTO);
      // Usar completarPerfil en lugar de update
      const response = await asociacionService.completarPerfil(idAsociacion, asociacionDTO);
      console.log("Respuesta de completar perfil:", response);
      
      // Actualizar el contexto para que el modal no vuelva a aparecer
      updateUser({ perfilCompleto: true });
      
      setSnackbar({
        open: true,
        message: "¡Perfil completado exitosamente! Redirigiendo...",
        severity: "success",
      });

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      
    } catch (error) {
      console.error("Error al completar perfil:", error);
      setSnackbar({
        open: true,
        message: error.message || "Error al guardar el perfil",
        severity: "error",
      });
    } finally {
      setLoadingSave(false);
    }
  };

  const completedCount = Object.values(completedSections).filter(Boolean).length;
  const progress = (completedCount / sections.length) * 100;
  const allDone = completedCount === sections.length;

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return palette.error;
    if (passwordStrength < 75) return palette.warning;
    return palette.success;
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 50) return "Débil";
    if (passwordStrength < 75) return "Media";
    return "Fuerte";
  };

  const renderField = (field) => {
    const { name, label, type, required, placeholder } = field;
    const value = formData[name] || "";
    
    if (type === "switch") {
      return (
        <FormControlLabel
          control={
            <Switch
              checked={formData[name] ?? field.default}
              onChange={handleChange}
              name={name}
              color="primary"
            />
          }
          label={label}
        />
      );
    }

    return (
      <Box sx={{ mb: 2.5 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: palette.textMuted,
            fontWeight: 600,
            display: "block",
            mb: 0.5,
          }}
        >
          {label}
          {required && <span style={{ color: palette.error, marginLeft: 2 }}>*</span>}
        </Typography>
        <TextField
          fullWidth
          size="small"
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          type={type}
          error={!!errors[name]}
          helperText={errors[name]}
          required={required}
          InputLabelProps={type === "date" ? { shrink: true } : undefined}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "white",
              "& fieldset": {
                borderColor: errors[name] ? palette.error : palette.border,
              },
              "&:hover fieldset": {
                borderColor: palette.primary,
              },
              "&.Mui-focused fieldset": {
                borderColor: palette.primary,
              },
            },
            "& .MuiFormHelperText-root": {
              color: palette.error,
              fontSize: "0.7rem",
              mt: 0.5,
            },
          }}
        />
      </Box>
    );
  };

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
          <Avatar sx={{ bgcolor: palette.primary }}>
            <KeyIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="600">
              Cambiar Contraseña
            </Typography>
            <Typography variant="caption" color="textSecondary">
              La contraseña debe tener al menos 8 caracteres
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="currentPassword"
              label="Contraseña Actual"
              type={showPassword.current ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              error={!!passwordErrors.currentPassword}
              helperText={passwordErrors.currentPassword}
              disabled={loadingPassword || completedSections.seguridad}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePasswordVisibility('current')}
                      edge="end"
                      disabled={loadingPassword || completedSections.seguridad}
                    >
                      {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="newPassword"
              label="Nueva Contraseña"
              type={showPassword.new ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              error={!!passwordErrors.newPassword}
              helperText={passwordErrors.newPassword}
              disabled={loadingPassword || completedSections.seguridad}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePasswordVisibility('new')}
                      edge="end"
                      disabled={loadingPassword || completedSections.seguridad}
                    >
                      {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            {passwordData.newPassword && !loadingPassword && !completedSections.seguridad && (
              <Box sx={{ mt: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                  <Typography variant="caption" color="textSecondary">
                    Fortaleza: {getPasswordStrengthText()}
                  </Typography>
                  <Typography variant="caption" fontWeight="bold" sx={{ color: getPasswordStrengthColor() }}>
                    {passwordStrength}%
                  </Typography>
                </Stack>
                <Box sx={{ height: 4, bgcolor: palette.borderLight, borderRadius: 2, mt: 0.5, overflow: "hidden" }}>
                  <Box sx={{
                    height: "100%",
                    width: `${passwordStrength}%`,
                    bgcolor: getPasswordStrengthColor(),
                    borderRadius: 2,
                    transition: "width 0.3s ease",
                  }} />
                </Box>
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="confirmPassword"
              label="Confirmar Nueva Contraseña"
              type={showPassword.confirm ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              error={!!passwordErrors.confirmPassword}
              helperText={passwordErrors.confirmPassword}
              disabled={loadingPassword || completedSections.seguridad}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePasswordVisibility('confirm')}
                      edge="end"
                      disabled={loadingPassword || completedSections.seguridad}
                    >
                      {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
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

  if (loadingAsociacion) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "#F4F7FB" }}>
      {/* Header con progreso */}
      <Paper elevation={0} sx={{ borderRadius: 0, borderBottom: `1px solid ${palette.border}`, px: 4, py: 2.5 }}>
        <Box sx={{ maxWidth: 1300, mx: "auto" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: palette.primary, width: 48, height: 48 }}>
                <BusinessIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="700" sx={{ color: palette.text }}>
                  Completa tu Perfil
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
              <Typography variant="caption" fontWeight="600" sx={{ color: palette.textMuted }}>
                Progreso
              </Typography>
              <Typography variant="caption" fontWeight="700" sx={{ color: palette.primary }}>
                {completedCount} de {sections.length} pasos
              </Typography>
            </Stack>
            <Box sx={{ height: 6, bgcolor: palette.borderLight, borderRadius: 3, overflow: "hidden" }}>
              <Box sx={{
                height: "100%",
                bgcolor: palette.success,
                width: `${progress}%`,
                transition: "width 0.3s ease",
                borderRadius: 3,
              }} />
            </Box>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeTab} alternativeLabel sx={{ mt: 3 }}>
            {sections.map((section, index) => (
              <Step key={section.key} completed={completedSections[section.key]}>
                <StepLabel
                  StepIconProps={{
                    completed: completedSections[section.key],
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {section.label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Paper>

      {/* Contenido principal */}
      <Box sx={{ maxWidth: 1300, mx: "auto", p: 4 }}>
        {/* Alerta de progreso */}
        {!allDone && (
          <Alert 
            severity="info" 
            sx={{ mb: 3, borderRadius: 2 }}
            icon={<WarningIcon />}
          >
            <AlertTitle>Completa todos los pasos</AlertTitle>
            {activeTab === 0 
              ? "Primero debes cambiar tu contraseña por seguridad." 
              : `Paso ${activeTab + 1} de ${sections.length}: ${sections[activeTab].label}`}
            Los campos marcados con <strong>*</strong> son obligatorios.
          </Alert>
        )}

        {/* Contenido de tabs */}
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
                    <Grid 
                      item 
                      xs={12} 
                      md={field.name.includes("direccion") || field.name.includes("nombre") ? 12 : 6} 
                      key={field.name}
                    >
                      {renderField(field)}
                    </Grid>
                  ))}
                </Grid>

                {/* Campos calculados */}
                {activeTab === 4 && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: palette.primaryBg, borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight="600" sx={{ color: palette.text, mb: 1 }}>
                      Contacto Principal (vista previa)
                    </Typography>
                    <Typography variant="body2" sx={{ color: palette.textMuted }}>
                      {contactoPrincipal || "Completa los datos de contacto"}
                    </Typography>
                  </Box>
                )}

                {activeTab === 5 && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: palette.primaryBg, borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight="600" sx={{ color: palette.text, mb: 1 }}>
                      Dirección Completa (vista previa)
                    </Typography>
                    <Typography variant="body2" sx={{ color: palette.textMuted }}>
                      {direccionCompleta || "Completa la dirección"}
                    </Typography>
                  </Box>
                )}
              </>
            )}

            {/* Botones de navegación */}
            {activeTab > 0 && (
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
                <Button
                  startIcon={<PrevIcon />}
                  onClick={handlePrev}
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

                {activeTab < sections.length - 1 ? (
                  <Button
                    endIcon={<NextIcon />}
                    onClick={handleNext}
                    variant="contained"
                    sx={{
                      bgcolor: palette.primary,
                      textTransform: "none",
                      px: 3,
                      "&:hover": { bgcolor: palette.primaryLight },
                    }}
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    endIcon={<DoneAllIcon />}
                    onClick={handleCompleteProfile}
                    variant="contained"
                    color="success"
                    disabled={loadingSave || !allDone}
                    sx={{
                      textTransform: "none",
                      px: 4,
                      py: 1,
                    }}
                  >
                    {loadingSave ? "Guardando..." : "Completar Perfil"}
                  </Button>
                )}
              </Stack>
            )}
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

export default AssociationProfile;