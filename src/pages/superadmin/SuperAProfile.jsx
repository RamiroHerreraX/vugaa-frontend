import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  Paper,
  TextField,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  FormControlLabel,
  Switch,
  Snackbar,
  CircularProgress,
  MenuItem,
} from "@mui/material";

import {
  Edit as EditIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Business as BusinessIcon,
  Warning as WarningIcon,
  Lock as LockIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
} from "@mui/icons-material";

import {
  getPerfilAdministradorPorUsuario,
  editarPerfilAdministrador,
  crearPerfilAdministrador,
} from "../../services/Perfiladministrador";

import CambiarContraseñaModal from "../../components/cambioContraseña/CambiarContraseñaModal";

// Colores institucionales
const institutionalColors = {
  primary: '#133B6B',
  secondary: '#1a4c7a',
  accent: '#e9e9e9',
  background: '#f4f6f8',
  lightBlue: 'rgba(19, 59, 107, 0.08)',
  darkBlue: '#0D2A4D',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  info: '#1976d2',
  successBg: '#E8F5EE',
  successBorder: '#A3D4BC',
  activeBg: '#F0F6FF',
  activeBorder: '#93B8E0',
  pendingBg: '#F8F9FB',
  pendingBorder: '#E2E8F0',
};

// Configuración de secciones para administrador
const sections = [
  {
    key: "identificacion",
    label: "Identificación",
    icon: BadgeIcon,
    description: "Datos de identificación del administrador",
    fields: [
      { name: "numeroEmpleado", label: "Número de Empleado", type: "text" },
      { 
        name: "tipoAdmin", 
        label: "Tipo de Administrador", 
        type: "select",
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
    description: "Información de contacto",
    fields: [
      { name: "telefono", label: "Teléfono", type: "tel" },
      { name: "emailAlternativo", label: "Email Alternativo", type: "email" },
    ],
  },
  {
    key: "departamento",
    label: "Departamento",
    icon: BusinessIcon,
    description: "Información del departamento",
    fields: [
      { name: "departamento", label: "Departamento", type: "text" },
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

const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [idUsuario, setIdUsuario] = useState(null);
  const [userData, setUserData] = useState({
    email: "",
    nombre: "",
    activo: true,
    perfilCompleto: false,
    fechaCreacion: null,
    ultimoAcceso: null,
  });
  const [loadingPerfil, setLoadingPerfil] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
  // Estado para el modal de cambio de contraseña
  const [modalPasswordOpen, setModalPasswordOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    numeroEmpleado: "",
    tipoAdmin: "",
    telefono: "",
    emailAlternativo: "",
    departamento: "",
  });

  const [errors, setErrors] = useState({});
  const [datosOriginales, setDatosOriginales] = useState(null);

  // Obtener ID del usuario al inicio
  useEffect(() => {
    const user = getUserFromStorage();
    if (user) {
      const id = user.id || user.idUsuario;
      setIdUsuario(id);
      setUserData({
        email: user.email || "",
        nombre: user.nombre || "",
        activo: user.activo !== undefined ? user.activo : true,
        perfilCompleto: user.perfilCompleto || false,
        fechaCreacion: user.fechaCreacion || null,
        ultimoAcceso: user.ultimoAcceso || null,
      });
      console.log("ID Usuario:", id);
      console.log("Datos de usuario del storage:", user);
    } else {
      setSnackbar({
        open: true,
        message: "No se encontró sesión activa. Por favor inicia sesión nuevamente.",
        severity: "error",
      });
    }
  }, []);

  // Cargar datos del perfil del administrador
  useEffect(() => {
    if (!idUsuario) return;

    const cargarPerfilAdministrador = async () => {
      setLoadingPerfil(true);
      try {
        console.log("Buscando perfil de administrador para usuario:", idUsuario);
        const perfil = await getPerfilAdministradorPorUsuario(idUsuario);
        console.log("Perfil encontrado:", perfil);
        
        // Actualizar datos del usuario con los que vienen del perfil
        setUserData({
          email: perfil.email || userData.email,
          nombre: perfil.nombre || userData.nombre,
          activo: perfil.activo !== undefined ? perfil.activo : userData.activo,
          perfilCompleto: perfil.perfilCompleto || userData.perfilCompleto,
          fechaCreacion: perfil.fechaCreacion || userData.fechaCreacion,
          ultimoAcceso: perfil.ultimoAcceso || userData.ultimoAcceso,
        });
        
        // Mapear datos del perfil al formData
        const mappedData = {
          numeroEmpleado: perfil.numeroEmpleado || "",
          tipoAdmin: perfil.tipoAdmin || "ADMIN",
          telefono: perfil.telefono || "",
          emailAlternativo: perfil.emailAlternativo || "",
          departamento: perfil.departamento || "",
        };
        
        setFormData(mappedData);
        setDatosOriginales(mappedData);
        
      } catch (error) {
        console.log("No hay perfil existente, se creará uno nuevo");
        // Verificar si el error es 404 (no encontrado)
        if (error.response?.status === 404) {
          console.log("El perfil no existe, se creará uno nuevo");
        } else {
          console.error("Error al cargar perfil:", error);
        }
        
        // Establecemos valores por defecto
        const defaultData = {
          numeroEmpleado: "",
          tipoAdmin: "ADMIN",
          telefono: "",
          emailAlternativo: "",
          departamento: "",
        };
        setFormData(defaultData);
        setDatosOriginales(defaultData);
      } finally {
        setLoadingPerfil(false);
      }
    };
    
    cargarPerfilAdministrador();
  }, [idUsuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validaciones básicas
    if (!formData.numeroEmpleado) newErrors.numeroEmpleado = "El número de empleado es requerido";
    if (!formData.tipoAdmin) newErrors.tipoAdmin = "El tipo de administrador es requerido";
    
    if (formData.emailAlternativo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAlternativo)) {
      newErrors.emailAlternativo = "Email inválido";
    }
    if (formData.telefono && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(formData.telefono)) {
      newErrors.telefono = "Teléfono inválido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Método para guardar/actualizar el perfil
  const handleSave = async () => {
    if (!idUsuario) {
      setSnackbar({
        open: true,
        message: "No se encontró el ID del usuario",
        severity: "error",
      });
      return;
    }

    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Por favor corrige los errores antes de guardar",
        severity: "warning",
      });
      return;
    }

    // Preparar DTO para guardar/actualizar
    const perfilDTO = {
      idUsuario: idUsuario,
      numeroEmpleado: formData.numeroEmpleado,
      tipoAdmin: formData.tipoAdmin,
      telefono: formData.telefono,
      emailAlternativo: formData.emailAlternativo,
      departamento: formData.departamento,
    };

    setLoadingSave(true);
    try {
      let response;
      
      // Verificar si es creación o actualización basado en si tenemos datos guardados
      if (datosOriginales && datosOriginales.numeroEmpleado) {
        // Si ya existe un perfil, actualizamos
        console.log(`Actualizando perfil para usuario ${idUsuario}:`, perfilDTO);
        response = await editarPerfilAdministrador(idUsuario, perfilDTO);
        console.log("Respuesta de actualización:", response);
      } else {
        // Si no existe, creamos uno nuevo
        console.log(`Creando perfil para usuario ${idUsuario}:`, perfilDTO);
        response = await crearPerfilAdministrador(perfilDTO);
        console.log("Respuesta de creación:", response);
      }
      
      // Actualizar datos del usuario con la respuesta
      if (response) {
        setUserData({
          email: response.email || userData.email,
          nombre: response.nombre || userData.nombre,
          activo: response.activo !== undefined ? response.activo : userData.activo,
          perfilCompleto: response.perfilCompleto || true,
          fechaCreacion: response.fechaCreacion || userData.fechaCreacion,
          ultimoAcceso: response.ultimoAcceso || userData.ultimoAcceso,
        });
      }
      
      setEditMode(false);
      setDatosOriginales(formData);
      
      setSnackbar({
        open: true,
        message: "Perfil guardado exitosamente",
        severity: "success",
      });
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || "Error al guardar el perfil",
        severity: "error",
      });
    } finally {
      setLoadingSave(false);
    }
  };

  const handleCancel = () => {
    if (datosOriginales) {
      setFormData(datosOriginales);
    }
    setEditMode(false);
    setErrors({});
  };

  // Manejadores para el modal de cambio de contraseña
  const handleOpenPasswordModal = () => {
    setModalPasswordOpen(true);
  };

  const handleClosePasswordModal = () => {
    setModalPasswordOpen(false);
  };

  const handlePasswordChangeSuccess = () => {
    setSnackbar({
      open: true,
      message: "Contraseña actualizada exitosamente",
      severity: "success",
    });
  };

  const renderField = (field) => {
    const { name, label, type, options } = field;
    const value = formData[name] || "";
    
    if (type === "select") {
      return (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, fontWeight: 500, display: "block", mb: 0.5 }}>
            {label}
          </Typography>
          {editMode ? (
            <TextField
              fullWidth
              select
              size="small"
              name={name}
              value={value}
              onChange={handleChange}
              error={!!errors[name]}
              helperText={errors[name]}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                }
              }}
            >
              {options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          ) : (
            <Typography sx={{ color: institutionalColors.textPrimary }}>
              {options.find(opt => opt.value === value)?.label || value || "—"}
            </Typography>
          )}
        </Box>
      );
    }

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, fontWeight: 500, display: "block", mb: 0.5 }}>
          {label}
        </Typography>
        {editMode ? (
          <TextField
            fullWidth
            size="small"
            name={name}
            value={value}
            onChange={handleChange}
            type={type}
            error={!!errors[name]}
            helperText={errors[name]}
            InputLabelProps={type === "date" ? { shrink: true } : undefined}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              }
            }}
          />
        ) : (
          <Typography sx={{ color: institutionalColors.textPrimary }}>
            {value || "—"}
          </Typography>
        )}
      </Box>
    );
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  if (loadingPerfil) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: institutionalColors.background }}>
      {/* HEADER */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderBottom: `1px solid #e5e7eb`,
          bgcolor: "#fff",
        }}
      >
        <Box sx={{ maxWidth: 1400, mx: "auto" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: institutionalColors.primary, width: 48, height: 48 }}>
                <AdminPanelSettingsIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ color: institutionalColors.textPrimary }}>
                  Perfil del Administrador
                </Typography>
                <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
                  {userData.nombre || "Administrador"} • {userData.email}
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={2}>
              {/* Botón para cambiar contraseña */}
              <Button
                startIcon={<LockIcon />}
                variant="outlined"
                onClick={handleOpenPasswordModal}
                sx={{
                  borderColor: institutionalColors.primary,
                  color: institutionalColors.primary,
                  textTransform: "none",
                  '&:hover': {
                    borderColor: institutionalColors.secondary,
                    backgroundColor: institutionalColors.lightBlue,
                  }
                }}
              >
                Cambiar Contraseña
              </Button>

              {editMode ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={loadingSave}
                    sx={{ textTransform: "none", px: 3 }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    startIcon={loadingSave ? <CircularProgress size={20} /> : <SaveIcon />}
                    variant="contained"
                    color="success"
                    onClick={handleSave}
                    disabled={loadingSave}
                    sx={{ textTransform: "none", px: 3 }}
                  >
                    {loadingSave ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </>
              ) : (
                <Button
                  startIcon={<EditIcon />}
                  variant="contained"
                  onClick={() => setEditMode(true)}
                  sx={{
                    bgcolor: institutionalColors.primary,
                    textTransform: "none",
                    px: 3,
                    '&:hover': { bgcolor: institutionalColors.secondary }
                  }}
                >
                  Editar Perfil
                </Button>
              )}
            </Stack>
          </Box>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mt: 3,
              borderBottom: `1px solid ${institutionalColors.accent}`,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                minHeight: 48,
              },
              "& .Mui-selected": {
                color: institutionalColors.primary,
                fontWeight: 700,
              },
              "& .MuiTabs-indicator": {
                bgcolor: institutionalColors.primary,
                height: 3,
              },
            }}
          >
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Tab
                  key={section.key}
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Icon sx={{ fontSize: 18 }} />
                      <span>{section.label}</span>
                    </Stack>
                  }
                />
              );
            })}
          </Tabs>
        </Box>
      </Paper>

      {/* CONTENIDO */}
      <Box sx={{ maxWidth: 1400, mx: "auto", p: 3 }}>
        <Card sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            {/* CABECERA SUPERIOR - CON DATOS DEL USUARIO */}
            <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
              <Grid item xs={12} md="auto">
                <Avatar sx={{ width: 100, height: 100, bgcolor: institutionalColors.primary }}>
                  <AdminPanelSettingsIcon sx={{ fontSize: 50 }} />
                </Avatar>
              </Grid>

              <Grid item xs>
                <Typography variant="h4" fontWeight="bold" sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
                  {userData.nombre || "Administrador"}
                </Typography>

                <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
                  <Chip
                    label={formData.tipoAdmin === "SUPERADMIN" ? "Super Administrador" : "Administrador"}
                    sx={{ 
                      bgcolor: formData.tipoAdmin === "SUPERADMIN" 
                        ? institutionalColors.primary 
                        : institutionalColors.info,
                      color: "white",
                    }}
                    icon={<AdminPanelSettingsIcon />}
                  />
                  {userData.activo ? (
                    <Chip
                      label="Activo"
                      size="small"
                      sx={{ bgcolor: institutionalColors.successBg, color: institutionalColors.success }}
                    />
                  ) : (
                    <Chip
                      label="Inactivo"
                      size="small"
                      sx={{ bgcolor: institutionalColors.error, color: "white" }}
                    />
                  )}
                  {userData.perfilCompleto && (
                    <Chip
                      label="Perfil Completo"
                      size="small"
                      sx={{ bgcolor: institutionalColors.successBg, color: institutionalColors.success }}
                    />
                  )}
                  {formData.departamento && (
                    <Chip
                      label={formData.departamento}
                      variant="outlined"
                      sx={{ borderColor: institutionalColors.primary, color: institutionalColors.primary }}
                    />
                  )}
                </Stack>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EmailIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                      <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                        <b>Email:</b> {userData.email}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {formData.telefono && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                        <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                          <b>Teléfono:</b> {formData.telefono}
                        </Typography>
                      </Stack>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                      <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                        <b>Número de Empleado:</b> {formData.numeroEmpleado || "No asignado"}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BadgeIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                      <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                        <b>ID Usuario:</b> #{idUsuario}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Información adicional del usuario */}
            <Box sx={{ mb: 3, p: 2, bgcolor: institutionalColors.lightBlue, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ color: institutionalColors.textPrimary, mb: 2 }}>
                Información de la cuenta
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, display: "block" }}>
                    Fecha de Creación
                  </Typography>
                  <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                    {formatDate(userData.fechaCreacion)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, display: "block" }}>
                    Último Acceso
                  </Typography>
                  <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                    {formatDate(userData.ultimoAcceso)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, display: "block" }}>
                    Estado del Perfil
                  </Typography>
                  <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                    {userData.perfilCompleto ? "Completo" : "Incompleto"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* SECCIÓN ACTIVA */}
            <Box>
              <Typography variant="h6" fontWeight="600" sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
                {sections[activeTab].label}
              </Typography>
              <Typography variant="body2" sx={{ color: institutionalColors.textSecondary, mb: 3 }}>
                {sections[activeTab].description}
              </Typography>

              <Grid container spacing={3}>
                {sections[activeTab].fields.map((field) => (
                  <Grid 
                    item 
                    xs={12} 
                    md={6} 
                    key={field.name}
                  >
                    {renderField(field)}
                  </Grid>
                ))}
              </Grid>

              {/* Información adicional */}
              {activeTab === 1 && formData.emailAlternativo && (
                <Box sx={{ mt: 3, p: 2, bgcolor: institutionalColors.lightBlue, borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight="600" sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
                    Email Alternativo
                  </Typography>
                  <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
                    {formData.emailAlternativo}
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Modal de Cambio de Contraseña */}
      <CambiarContraseñaModal
        open={modalPasswordOpen}
        onClose={handleClosePasswordModal}
        userId={idUsuario}
        onSuccess={handlePasswordChangeSuccess}
      />

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

export default AdminProfile;