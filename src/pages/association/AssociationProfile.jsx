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
} from "@mui/material";

import {
  Edit as EditIcon,
  Save as SaveIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  AccountBalance as BalanceIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Groups as GroupsIcon,
  Image as ImageIcon,
  Lock as LockIcon,
} from "@mui/icons-material";

import asociacionService from "../../services/asociacion";
import CambiarContraseñaModal from "../../components/cambioContraseña/CambiarContraseñaModal"; // Ajusta la ruta según tu estructura

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

// Configuración de secciones (sin Relaciones)
const sections = [
  {
    key: "identificacion",
    label: "Identificación",
    icon: BusinessIcon,
    description: "Datos básicos de identificación",
    fields: [
      { name: "codigo", label: "Código Interno", type: "text" },
      { name: "nombre", label: "Nombre de la Asociación", type: "text" },
      { name: "cif", label: "RFC / CIF", type: "text" },
      { name: "activa", label: "Asociación Activa", type: "switch" },
    ],
  },
  {
    key: "fiscal",
    label: "Datos Fiscales",
    icon: BalanceIcon,
    description: "Información fiscal y certificaciones",
    fields: [
      { name: "regimenFiscal", label: "Régimen Fiscal", type: "text" },
      { name: "numeroCertificacionSat", label: "Número de Certificación SAT", type: "text" },
      { name: "vigenciaCertificacionSat", label: "Vigencia de Certificación", type: "date" },
      { name: "fechaConstitucion", label: "Fecha de Constitución", type: "date" },
    ],
  },
  {
    key: "representacion",
    label: "Representación Legal",
    icon: PersonIcon,
    description: "Datos del representante legal",
    fields: [
      { name: "representanteLegal", label: "Nombre del Representante", type: "text" },
      { name: "rfcRepresentanteLegal", label: "RFC del Representante", type: "text" },
    ],
  },
  {
    key: "contacto",
    label: "Contacto",
    icon: PhoneIcon,
    description: "Información de contacto principal",
    fields: [
      { name: "email", label: "Correo Electrónico", type: "email" },
      { name: "telefono", label: "Teléfono", type: "tel" },
      { name: "sitioWeb", label: "Sitio Web", type: "url" },
    ],
  },
  {
    key: "ubicacion",
    label: "Ubicación",
    icon: LocationIcon,
    description: "Dirección fiscal completa",
    fields: [
      { name: "direccion", label: "Calle y Número", type: "text" },
      { name: "colonia", label: "Colonia", type: "text" },
      { name: "ciudad", label: "Ciudad", type: "text" },
      { name: "estado", label: "Estado", type: "text" },
      { name: "codigoPostal", label: "Código Postal", type: "text" },
      { name: "pais", label: "País", type: "text" },
    ],
  },
  {
    key: "estadisticas",
    label: "Estadísticas",
    icon: GroupsIcon,
    description: "Datos estadísticos",
    fields: [
      { name: "miembros", label: "Número de Miembros", type: "number" },
    ],
  },
  {
    key: "multimedia",
    label: "Logo",
    icon: ImageIcon,
    description: "Logo de la asociación",
    fields: [
      { name: "logoUrl", label: "URL del Logo", type: "url" },
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
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [idAsociacion, setIdAsociacion] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const [loadingAsociacion, setLoadingAsociacion] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
  // Estado para el modal de cambio de contraseña
  const [modalPasswordOpen, setModalPasswordOpen] = useState(false);
  
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
    
    // Estadísticas
    miembros: 0,
    
    // Multimedia
    logoUrl: "",
    
    // Fechas de sistema
    fechaRegistro: "",
    fechaActualizacion: "",
  });

  const [errors, setErrors] = useState({});
  const [direccionCompleta, setDireccionCompleta] = useState("");
  const [contactoPrincipal, setContactoPrincipal] = useState("");
  const [datosOriginales, setDatosOriginales] = useState(null);

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
          
          // Estadísticas
          miembros: asociacion.miembros || 0,
          
          // Multimedia
          logoUrl: asociacion.logoUrl || "",
          
          // Fechas de sistema
          fechaRegistro: asociacion.fechaRegistro || "",
          fechaActualizacion: asociacion.fechaActualizacion || "",
        };
        
        setFormData(mappedData);
        setDatosOriginales(mappedData);
        
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
    // Calcular dirección completa
    const direccionParts = [];
    if (formData.direccion) direccionParts.push(formData.direccion);
    if (formData.colonia) direccionParts.push(formData.colonia);
    if (formData.ciudad) direccionParts.push(formData.ciudad);
    if (formData.estado) direccionParts.push(formData.estado);
    
    let direccionStr = direccionParts.join(", ");
    if (formData.codigoPostal) direccionStr += ` - CP: ${formData.codigoPostal}`;
    if (formData.pais && formData.pais !== "México") direccionStr += ` - ${formData.pais}`;
    
    setDireccionCompleta(direccionStr);

    // Calcular contacto principal
    const contactoParts = [];
    if (formData.email) contactoParts.push(`Email: ${formData.email}`);
    if (formData.telefono) contactoParts.push(`Tel: ${formData.telefono}`);
    setContactoPrincipal(contactoParts.join(" | "));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validaciones básicas
    if (!formData.nombre) newErrors.nombre = "El nombre es requerido";
    if (!formData.cif) newErrors.cif = "El RFC es requerido";
    if (!formData.email) newErrors.email = "El email es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.telefono) newErrors.telefono = "El teléfono es requerido";
    if (!formData.representanteLegal) newErrors.representanteLegal = "El representante es requerido";
    if (!formData.fechaConstitucion) newErrors.fechaConstitucion = "La fecha de constitución es requerida";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Método update para guardar los cambios
  const handleSave = async () => {
    if (!idAsociacion) {
      setSnackbar({
        open: true,
        message: "No se encontró el ID de la asociación",
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
      miembros: formData.miembros,
      logoUrl: formData.logoUrl,
    };

    setLoadingSave(true);
    try {
      console.log(`Actualizando asociación ${idAsociacion}:`, asociacionDTO);
      const response = await asociacionService.update(idAsociacion, asociacionDTO);
      console.log("Respuesta de actualización:", response);
      
      setEditMode(false);
      setDatosOriginales(formData);
      
      setSnackbar({
        open: true,
        message: "Perfil actualizado exitosamente",
        severity: "success",
      });
    } catch (error) {
      console.error("Error en update:", error);
      setSnackbar({
        open: true,
        message: error.message || "Error al actualizar el perfil",
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

  const renderField = (name, label, type = "text") => {
    const value = formData[name] || "";
    
    if (type === "switch") {
      return (
        <FormControlLabel
          control={
            <Switch
              checked={formData[name] ?? true}
              onChange={handleChange}
              name={name}
              color="primary"
              disabled={!editMode}
            />
          }
          label={label}
        />
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

  if (loadingAsociacion) {
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
                <BusinessIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ color: institutionalColors.textPrimary }}>
                  Perfil de la Asociación
                </Typography>
                <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
                  {formData.nombre}
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
            {/* CABECERA SUPERIOR */}
            <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
              <Grid item xs={12} md="auto">
                <Avatar sx={{ width: 100, height: 100, bgcolor: institutionalColors.primary }}>
                  <BusinessIcon sx={{ fontSize: 50 }} />
                </Avatar>
              </Grid>

              <Grid item xs>
                <Typography variant="h4" fontWeight="bold" sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
                  {formData.nombre}
                </Typography>

                <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
                  <Chip
                    label={`RFC: ${formData.cif}`}
                    variant="outlined"
                    sx={{ borderColor: institutionalColors.primary, color: institutionalColors.primary }}
                  />
                  {formData.numeroCertificacionSat && (
                    <Chip
                      label="Certificada SAT"
                      sx={{ bgcolor: institutionalColors.successBg, color: institutionalColors.success }}
                      icon={<BadgeIcon />}
                    />
                  )}
                  {formData.activa ? (
                    <Chip label="Activa" color="success" size="small" />
                  ) : (
                    <Chip label="Inactiva" color="error" size="small" />
                  )}
                </Stack>

                <Stack direction="row" spacing={4} flexWrap="wrap">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                    <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                      <b>Representante:</b> {formData.representanteLegal}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                    <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                      <b>Constitución:</b> {formData.fechaConstitucion}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <GroupsIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                    <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                      <b>Miembros:</b> {formData.miembros}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

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
                    md={field.name.includes("direccion") || field.name.includes("nombre") ? 12 : 6} 
                    key={field.name}
                  >
                    {renderField(field.name, field.label, field.type)}
                  </Grid>
                ))}
              </Grid>

              {/* Información adicional para ciertas secciones */}
              {activeTab === 3 && (
                <Box sx={{ mt: 3, p: 2, bgcolor: institutionalColors.lightBlue, borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight="600" sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
                    Contacto Principal
                  </Typography>
                  <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
                    {contactoPrincipal || "Sin datos de contacto"}
                  </Typography>
                </Box>
              )}

              {activeTab === 4 && (
                <Box sx={{ mt: 3, p: 2, bgcolor: institutionalColors.lightBlue, borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight="600" sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
                    Dirección Completa
                  </Typography>
                  <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
                    {direccionCompleta || "Sin dirección completa"}
                  </Typography>
                </Box>
              )}

              {activeTab === 6 && (
                <Box sx={{ mt: 3, p: 2, bgcolor: institutionalColors.lightBlue, borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight="600" sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
                    Fechas de Sistema
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>Fecha de Registro:</Typography>
                      <Typography variant="body2">
                        {formData.fechaRegistro ? new Date(formData.fechaRegistro).toLocaleString() : "No registrado"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>Última Actualización:</Typography>
                      <Typography variant="body2">
                        {formData.fechaActualizacion ? new Date(formData.fechaActualizacion).toLocaleString() : "No registrado"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Certificación SAT (siempre visible) */}
        {formData.numeroCertificacionSat && (
          <Card sx={{ mt: 3, borderRadius: 3, bgcolor: institutionalColors.lightBlue }}>
            <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                  Certificación SAT
                </Typography>
                <Typography fontWeight="bold" sx={{ color: institutionalColors.primary }}>
                  {formData.numeroCertificacionSat}
                </Typography>
              </Box>
              <Chip
                sx={{ bgcolor: institutionalColors.successBg, color: institutionalColors.success }}
                label={`Vigente hasta ${formData.vigenciaCertificacionSat || "No especificada"}`}
              />
            </CardContent>
          </Card>
        )}
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

export default AssociationProfile;