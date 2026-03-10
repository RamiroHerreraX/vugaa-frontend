import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '../../../context/AuthContext'; 
import usuarioService from '../../../services/usuarioService';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Button,
  TextField,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  IconButton,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  LinearProgress, Alert, Snackbar, Fade, Collapse
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Save as SaveIcon,
  CameraAlt as CameraIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  AddCircle as AddCircleIcon,
  LocationCity as LocationCityIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Language as LanguageIcon,
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccountBalance as AccountBalanceIcon,
  LocationOn as LocationIcon,
  ContactPhone as ContactPhoneIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon, ArrowBack as ArrowBackIcon,
  Lock as LockIcon, Person as PersonIcon, Home as HomeIcon,
   VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

// Paleta corporativa del UserManagement
const colors = {
  primary: {
    dark: '#0D2A4D',
    main: '#133B6B',
    light: '#3A6EA5'
  },
  secondary: {
    main: '#00A8A8',
    light: '#00C2D1',
    lighter: '#35D0FF'
  },
  accents: {
    blue: '#0099FF',
    purple: '#6C5CE7'
  },
  status: {
    success: '#00A8A8',
    warning: '#00C2D1',
    error: '#0099FF',
    info: '#3A6EA5'
  },
  text: {
    primary: '#0D2A4D',
    secondary: '#3A6EA5',
    light: '#6C5CE7'
  }
};

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [aduanaDialog, setAduanaDialog] = useState(false);
  const [certificadoDialog, setCertificadoDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const { user, updateUser } = useAuth();
  // Nuevos estados
const [activeStep, setActiveStep]         = useState(0);
const [showSuggestion, setShowSuggestion] = useState(false);
const [saving, setSaving]                 = useState(false);
const [showPass, setShowPass]             = useState({ actual: false, nuevo: false, confirmar: false });
const [snackbar, setSnackbar]             = useState({ open: false, message: '', severity: 'success' });
const [fieldErrors, setFieldErrors]       = useState({}); // Nuevo estado para errores de campos

// Constantes fuera del componente (antes del const Profile = ...)
const STEPS = [
  { id: 0, label: 'Datos Personales', icon: <PersonIcon />,  fields: ['nombre','curp','rfc','patenteAduanal','fechaNacimiento','lugarNacimiento','nacionalidad','estadoCivil'] },
  { id: 1, label: 'Contacto',         icon: <PhoneIcon />,   fields: ['telefono','telefonoAlternativo','emailAlternativo'] },
  { id: 2, label: 'Domicilios',       icon: <HomeIcon />,    fields: ['domicilioFiscal','domicilioParticular'] },
  { id: 3, label: 'Seguridad',        icon: <LockIcon />,    fields: ['passwordActual','passwordNuevo','confirmarPassword'] },
];

const getStepCompletion = (step, formData) => {
  if (step.id === 3) return null;
  const relevant = step.fields.filter(f => !['passwordActual','passwordNuevo','confirmarPassword'].includes(f));
  const filled = relevant.filter(f => formData[f] && formData[f].toString().trim() !== '');
  return Math.round((filled.length / relevant.length) * 100);
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '&:hover fieldset': { borderColor: colors.primary.light },
    '&.Mui-focused fieldset': { borderColor: colors.primary.main },
    '&.Mui-disabled': { bgcolor: `${colors.primary.main}04` }
  },
  '& .MuiInputLabel-root.Mui-focused': { color: colors.primary.main }
};

// ===== FUNCIONES DE VALIDACIÓN =====
const validateRequiredFields = () => {
  const errors = {};
  const requiredFields = [
    { field: 'curp', label: 'CURP' },
    { field: 'rfc', label: 'RFC' },
    { field: 'patenteAduanal', label: 'Patente Aduanal' },
    { field: 'fechaNacimiento', label: 'Fecha de nacimiento' },
    { field: 'lugarNacimiento', label: 'Lugar de nacimiento' },
    { field: 'nacionalidad', label: 'Nacionalidad' },
    { field: 'telefono', label: 'Teléfono principal' }
  ];

  requiredFields.forEach(item => {
    if (!formData[item.field] || formData[item.field].toString().trim() === '') {
      errors[item.field] = `${item.label} es obligatorio`;
    }
  });

  setFieldErrors(errors);
  return Object.keys(errors).length === 0;
};

const getStepWithErrors = () => {
  // Determinar qué paso tiene el primer error para navegar automáticamente
  if (fieldErrors.curp || fieldErrors.rfc || fieldErrors.patenteAduanal || 
      fieldErrors.fechaNacimiento || fieldErrors.lugarNacimiento || fieldErrors.nacionalidad) {
    return 0; // Paso de Datos Personales
  }
  if (fieldErrors.telefono) {
    return 1; // Paso de Contacto
  }
  return null;
};

useEffect(() => {
  const cargarPerfil = async () => {
    if (!user?.id) return;

    // Cargar datos de usuarios (nombre, email)
    setFormData(prev => ({
      ...prev,
      nombre: user.nombre || '',
    }));

    // Cargar datos de perfil_agente
    const perfil = await usuarioService.obtenerPerfilAgente(user.id);
    if (perfil) {
      setFormData(prev => ({
        ...prev,
        curp:                perfil.curp                || '',
        rfc:                 perfil.rfc                 || '',
        patenteAduanal:      perfil.patenteAduanal      || '',
        fechaNacimiento:     perfil.fechaNacimiento     || '',
        lugarNacimiento:     perfil.lugarNacimiento     || '',
        nacionalidad:        perfil.nacionalidad        || '',
        estadoCivil:         perfil.estadoCivil         || '',
        domicilioFiscal:     perfil.domicilioFiscal     || '',
        domicilioParticular: perfil.domicilioParticular || '',
        telefono:            perfil.telefono            || '',
        telefonoAlternativo: perfil.telefonoAlternativo || '',
        emailAlternativo:    perfil.emailAlternativo    || '',
      }));
    }

    // Cargar datos del profile card
    setProfile(prev => ({
      ...prev,
      nombre:       user.nombre        || '',
      email:        user.email         || '',
      rol:          user.rol           || '',
      region:       user.regionNombre  || '',
    }));
  };

  cargarPerfil();
}, [user]);

  const [newAduana, setNewAduana] = useState({
    nombre: '',
    tipo: 'Secundaria',
    numeroRegistro: '',
    fechaRegistro: '',
    estado: 'Activa'
  });

  const [aduanaList, setAduanaList] = useState([
    { 
      id: 1, 
      nombre: 'Aduana de Querétaro', 
      tipo: 'Principal', 
      numeroRegistro: 'ADQ-2024-00123', 
      fechaRegistro: '15/01/2024',
      estado: 'Activa'
    },
    
  ]);

  const [profile, setProfile] = useState({
    nombre: 'Luis Rodríguez López',
    email: 'luis.rodriguez@ejemplo.com',
    telefono: '+52 55 1234 5678',
    rol: 'Agente Aduanal',
    nivel:'Nivel I',
    des_Nivel: 'Sistema Gremial Básico',
    region: 'Norte',
    fechaRegistro: '24/02/2026',
    ultimoAcceso: '24/02/2026 10:30 AM'
  });
  
  const [formData, setFormData] = useState({
  nombre:              '',
  curp:                '',
  rfc:                 '',
  patenteAduanal:      '',
  fechaNacimiento:     '',
  lugarNacimiento:     '',
  nacionalidad:        '',
  estadoCivil:         '',
  domicilioFiscal:     '',
  domicilioParticular: '',
  telefono:            '',
  telefonoAlternativo: '',
  emailAlternativo:    '',
  passwordActual:      '',
  passwordNuevo:       '',
  confirmarPassword:   '',
});

  const [preferences, setPreferences] = useState({
    idioma: 'es',
    zonaHoraria: 'America/Mexico_City',
    privacidad: 'publico',
    notificacionesEmail: true,
    notificacionesSMS: false,
    tema: 'claro'
  });

  const handleChange = (field) => (e) => {
    setProfile({
      ...profile,
      [field]: e.target.value
    });
  };

  const handleInputChange = (field) => (event) => {
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (fieldErrors[field]) {
      setFieldErrors({
        ...fieldErrors,
        [field]: null
      });
    }
    
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handlePreferenceChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setPreferences({
      ...preferences,
      [field]: value
    });
  };

const handleSave = async () => {
  // Validar campos requeridos primero
  if (!validateRequiredFields()) {
    // Mostrar mensaje de error
    setSnackbar({
      open: true,
      message: 'Por favor completa todos los campos obligatorios',
      severity: 'error'
    });
    
    // Navegar al paso que contiene el primer error
    const stepWithError = getStepWithErrors();
    if (stepWithError !== null) {
      setActiveStep(stepWithError);
    }
    
    return;
  }

  // Validar contraseña si se quiere cambiar
  if (formData.passwordNuevo) {
    if (!formData.passwordActual) {
      setSnackbar({
        open: true,
        message: 'Debes ingresar tu contraseña actual',
        severity: 'error'
      });
      return;
    }
    if (formData.passwordNuevo !== formData.confirmarPassword) {
      setSnackbar({
        open: true,
        message: 'Las contraseñas no coinciden',
        severity: 'error'
      });
      return;
    }
  }

  setSaving(true);
  
  try {
    // 1. Actualizar perfil_agente + expediente + perfilCompleto
    await usuarioService.completarPerfil(
      user.id,
      user.instanciaId,
      {
        curp:                formData.curp,
        rfc:                 formData.rfc,
        patenteAduanal:      formData.patenteAduanal,
        fechaNacimiento:     formData.fechaNacimiento,
        lugarNacimiento:     formData.lugarNacimiento,
        nacionalidad:        formData.nacionalidad,
        estadoCivil:         formData.estadoCivil,
        domicilioFiscal:     formData.domicilioFiscal,
        domicilioParticular: formData.domicilioParticular,
        telefono:            formData.telefono,
        telefonoAlternativo: formData.telefonoAlternativo,
        emailAlternativo:    formData.emailAlternativo,
      }
    );

    // 2. Actualizar nombre en usuarios
    await usuarioService.update(user.id, {
      id:               user.id,
      nombre:           formData.nombre,
      email:            user.email,
      activo:           true,
      bloqueado:        false,
      intentosFallidos: 0,
    });

    // 3. Cambiar contraseña si se proporcionó
    if (formData.passwordNuevo) {
      await usuarioService.cambiarPassword(
        user.id,
        formData.passwordActual,
        formData.passwordNuevo
      );
    }

    // 4. Actualizar localStorage
   updateUser({ 
  nombre: formData.nombre, 
  perfilCompleto: true 
});

    // 5. Limpiar campos de contraseña
    setFormData(prev => ({
      ...prev,
      passwordActual:    '',
      passwordNuevo:     '',
      confirmarPassword: '',
    }));

    setEditMode(false);
    
    // Mostrar mensaje de éxito
    setSnackbar({
      open: true,
      message: 'Perfil guardado exitosamente',
      severity: 'success'
    });

  } catch (error) {
    console.error('Error al guardar perfil:', error);
    setSnackbar({
      open: true,
      message: 'Error al guardar el perfil',
      severity: 'error'
    });
  } finally {
    setSaving(false);
  }
};

  const handleAduanaChange = (field) => (e) => {
    setNewAduana({
      ...newAduana,
      [field]: e.target.value
    });
  };

  const handleAddAduana = () => {
    if (newAduana.nombre && newAduana.numeroRegistro) {
      const hasPrincipal = aduanaList.some(aduana => aduana.tipo === 'Principal');
      
      const aduanaToAdd = {
        id: aduanaList.length + 1,
        ...newAduana,
        tipo: hasPrincipal && newAduana.tipo === 'Principal' ? 'Secundaria' : newAduana.tipo
      };

      setAduanaList([...aduanaList, aduanaToAdd]);
      setNewAduana({
        nombre: '',
        tipo: 'Secundaria',
        numeroRegistro: '',
        fechaRegistro: '',
        estado: 'Activa'
      });
      setAduanaDialog(false);
    }
  };

  const handleDeleteAduana = (id) => {
    setAduanaList(aduanaList.filter(aduana => aduana.id !== id));
  };

  const handleSetPrincipal = (id) => {
    const updatedAduanas = aduanaList.map(aduana => ({
      ...aduana,
      tipo: aduana.id === id ? 'Principal' : 'Secundaria'
    }));
    setAduanaList(updatedAduanas);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

const handleDownloadCertificate = async () => {
  try {
    setIsDownloading(true);
    
    const certificadoElement = document.getElementById('certificado-contenido');
    
    if (!certificadoElement) return;

    // Guardar estilos originales de los recuadros de fechas
    const fechaRecuadros = certificadoElement.querySelectorAll('.fecha-recuadro');
    const originalWidths = [];
    fechaRecuadros.forEach((recuadro, index) => {
      originalWidths[index] = recuadro.style.width;
      // Forzar ancho fijo antes de capturar
      recuadro.style.width = '180px';
      recuadro.style.minWidth = '180px';
      recuadro.style.maxWidth = '180px';
    });

    // Pequeña pausa para que se apliquen los estilos
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(certificadoElement, {
      scale: 3,
      backgroundColor: '#f5efe6',
      logging: false,
      allowTaint: false,
      useCORS: true,
      windowWidth: certificadoElement.scrollWidth,
      windowHeight: certificadoElement.scrollHeight,
      onclone: (clonedDoc) => {
        // En el clon también forzar el ancho fijo
        const clonedRecuadros = clonedDoc.querySelectorAll('.fecha-recuadro');
        clonedRecuadros.forEach(recuadro => {
          recuadro.style.width = '180px';
          recuadro.style.minWidth = '180px';
          recuadro.style.maxWidth = '180px';
        });
        
        const clonedElement = clonedDoc.getElementById('certificado-contenido');
        if (clonedElement) {
          clonedElement.style.backgroundColor = '#f5efe6';
        }
      }
    });

    // Restaurar estilos originales
    fechaRecuadros.forEach((recuadro, index) => {
      recuadro.style.width = originalWidths[index];
      recuadro.style.minWidth = '';
      recuadro.style.maxWidth = '';
    });

    // Generar PDF
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'SLOW');
    pdf.save(`Certificado_SICAG_${profile.nombre.replace(/\s+/g, '_')}.pdf`);
    
    setIsDownloading(false);

  } catch (error) {
    console.error('Error al generar PDF:', error);
    alert('Hubo un error al generar el PDF. Por favor intenta de nuevo.');
    setIsDownloading(false);
  }
};

  return (
    <Box>
      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: colors.primary.dark, fontWeight: 'bold' }}>
          Mi Perfil
        </Typography>
      </Box>

      {/* ===== FILA SUPERIOR ===== */}
<Grid 
  container 
  spacing={3} 
  sx={{ 
    mb: 4,
    width: '100%',
    mx: 0
  }}
>
  {/* 1. Foto de Perfil - 40% */}
  <Grid 
    item 
    xs={12} 
    md={4} 
    sx={{ 
      flexBasis: {
        md: '35%'
      },
      maxWidth: {
        md: '35%'
      }
    }}
  >
    <Card sx={{ 
      height: '100%',
      borderRadius: 2,
      boxShadow: `0 4px 12px ${colors.primary.main}15`,
      border: `1px solid ${colors.primary.main}20`,
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
    }}>
      <CardContent sx={{ 
        textAlign: 'center', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        py: 3,
        px: 2
      }}>
        {/* Avatar */}
        <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
          <Avatar sx={{ 
            width: 120, 
            height: 120, 
            fontSize: '2.8rem', 
            bgcolor: colors.primary.main,
            margin: '0 auto',
            border: `4px solid ${colors.primary.main}20`,
            boxShadow: `0 4px 12px ${colors.primary.main}30`
          }}>
            LR
          </Avatar>
          {editMode && (
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 'calc(50% - 60px)',
                bgcolor: 'white',
                border: '2px solid #fff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
              size="small"
            >
              <CameraIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Nombre */}
        <Typography variant="h6" fontWeight="bold" sx={{ 
          mt: 2,
          color: colors.text.primary,
          fontSize: '1.25rem',
          letterSpacing: '0.3px',
          textShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          {profile.nombre}
        </Typography>

        {/* Rol */}
        <Chip 
          label={profile.rol} 
          size="medium" 
          sx={{ 
            mt: 1.5, 
            mb: 2, 
            fontWeight: '600',
            fontSize: '0.85rem',
            height: '28px',
            borderRadius: '16px',
            boxShadow: `0 2px 4px ${colors.primary.main}30`,
            bgcolor: colors.primary.main,
            color: 'white'
          }} 
        />

        {/* Sección de información */}
        <Box sx={{ width: '100%', mb: 2 }}>
          {/* Nivel */}
          <Box sx={{ 
            mb: 2,
            p: 1.5,
            borderRadius: '10px',
            bgcolor: `${colors.primary.main}10`,
            borderLeft: `4px solid ${colors.primary.main}`
          }}>
            <Typography variant="body1" sx={{ 
              color: colors.text.primary, 
              fontWeight: '700',
              fontSize: '1.1rem',
              lineHeight: 1.2
            }}>
              {profile.nivel}
            </Typography>
            <Typography variant="body1" sx={{ 
              color: colors.text.primary, 
              fontWeight: '600',
              fontSize: '0.95rem',
              lineHeight: 1.3
            }}>
              {profile.des_Nivel}
            </Typography>
          </Box>

          {/* Botón Ver Certificado */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<PdfIcon />}
            onClick={() => setCertificadoDialog(true)}
            sx={{
              mb: 2,
              borderColor: colors.primary.main,
              color: colors.primary.main,
              '&:hover': {
                borderColor: colors.primary.dark,
                backgroundColor: `${colors.primary.main}10`
              }
            }}
          >
            Ver Reconocimiento
          </Button>
          
          {/* Región */}
          <Box sx={{ 
            p: 1.5,
            borderRadius: '10px',
            bgcolor: `${colors.accents.purple}10`,
            borderLeft: `4px solid ${colors.accents.purple}`
          }}>
            <Typography variant="body1" sx={{ 
              color: colors.text.primary, 
              fontWeight: '700',
              fontSize: '1.1rem',
              lineHeight: 1.2
            }}>
              Región {profile.region}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Grid>

  {/* 2. MIS ADUANAS - 35% (centro) */}
  <Grid 
    item 
    xs={12} 
    md={4} 
    sx={{ 
      flexBasis: {
        md: '35%'
      },
      maxWidth: {
        md: '35%'
      }
    }}
  >
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2.5
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            color: colors.text.primary,
            fontSize: '1rem'
          }}>
            Mis Aduanas
          </Typography>
          <Button 
            variant="contained" 
            size="small"
            startIcon={<AddCircleIcon />}
            onClick={() => setAduanaDialog(true)}
            disabled={aduanaList.length >= 4}
            sx={{ 
              fontSize: '0.7rem',
              fontWeight: 'bold',
              height: '28px',
              minWidth: '75px',
              p: '2px 10px',
              bgcolor: colors.primary.main,
              '&:hover': { bgcolor: colors.primary.dark }
            }}
          >
            Agregar
          </Button>
        </Box>

        <Box sx={{ 
          flex: 1,
          p: 1.5,
          borderRadius: 1,
          bgcolor: `${colors.primary.main}10`,
          border: `1px solid ${colors.primary.main}30`,
          overflow: 'auto',
          maxHeight: '340px'
        }}>
          <Stack spacing={1.5}>
            {aduanaList.map((aduana) => (
              <Paper 
                key={aduana.id}
                elevation={0}
                sx={{ 
                  p: 1.5,
                  borderRadius: 1,
                  border: `1px solid ${colors.primary.main}20`,
                  bgcolor: aduana.tipo === 'Principal' ? `${colors.status.warning}15` : 'white',
                  borderLeft: `4px solid ${aduana.tipo === 'Principal' ? colors.status.warning : colors.primary.main}`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: `0 2px 8px ${colors.primary.main}20`,
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationCityIcon sx={{ 
                        mr: 1, 
                        color: aduana.tipo === 'Principal' ? colors.status.warning : colors.primary.main,
                        fontSize: '1.1rem'
                      }} />
                      <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.9rem', color: colors.text.primary }}>
                        {aduana.nombre}
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={1} sx={{ pl: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.7rem', display: 'block' }}>
                          <strong>Registro:</strong>
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.text.primary, fontSize: '0.75rem', fontWeight: '500', display: 'block' }}>
                          {aduana.numeroRegistro}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.7rem', display: 'block' }}>
                          <strong>Fecha:</strong>
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.text.primary, fontSize: '0.75rem', fontWeight: '500', display: 'block' }}>
                          {aduana.fechaRegistro}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    {aduana.tipo === 'Principal' && (
                      <Box sx={{ mt: 1, pl: 2 }}>
                        <Chip
                          label="Principal"
                          size="small"
                          sx={{ 
                            height: 20, 
                            fontSize: '0.65rem',
                            bgcolor: colors.status.warning,
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Tooltip title={aduana.tipo === 'Principal' ? "Aduana principal" : "Establecer como principal"}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleSetPrincipal(aduana.id)}
                        disabled={aduana.tipo === 'Principal'}
                        sx={{ 
                          color: aduana.tipo === 'Principal' ? colors.status.warning : colors.text.secondary,
                          p: 0.5,
                          bgcolor: aduana.tipo === 'Principal' ? `${colors.status.warning}10` : 'transparent',
                          '&:hover': { bgcolor: aduana.tipo === 'Principal' ? `${colors.status.warning}20` : `${colors.primary.main}10` }
                        }}
                      >
                        {aduana.tipo === 'Principal' ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Eliminar">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteAduana(aduana.id)}
                        sx={{ 
                          color: colors.status.error,
                          p: 0.5,
                          '&:hover': { bgcolor: `${colors.status.error}10` }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  </Grid>

  {/* 3. Mi Actividad - REDUCIDO a 25% (derecha) */}
  <Grid 
    item 
    xs={12} 
    md={4} 
    sx={{ 
      flexBasis: {
        md: '25%'
      },
      maxWidth: {
        md: '25%'
      }
    }}
  >
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ 
          mb: 2,
          fontWeight: 'bold', 
          color: colors.text.primary,
          textAlign: 'center',
          fontSize: '1rem'
        }}>
          Mi Actividad
        </Typography>

        <Stack spacing={2}>
          <Box sx={{ 
            textAlign: 'center',
            p: 1.2,
            borderRadius: 1,
            bgcolor: '#f8f9fa'
          }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5, fontSize: '0.8rem' }}>
              Certificaciones Activas
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: colors.text.primary, fontSize: '2rem' }}>
              2
            </Typography>
          </Box>
          
          <Box sx={{ 
            textAlign: 'center',
            p: 1.2,
            borderRadius: 1,
            bgcolor: `${colors.status.warning}15`
          }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5, fontSize: '0.8rem' }}>
              En Revisión
            </Typography>
            <Typography variant="h4" sx={{ color: colors.status.warning, fontWeight: 'bold', fontSize: '2rem' }}>
              2
            </Typography>
          </Box>
          
          <Box sx={{ 
            textAlign: 'center',
            p: 1.2,
            borderRadius: 1,
            bgcolor: `${colors.status.error}15`
          }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5, fontSize: '0.8rem' }}>
              Por Vencer (30 días)
            </Typography>
            <Typography variant="h4" sx={{ color: colors.status.error, fontWeight: 'bold', fontSize: '2rem' }}>
              1
            </Typography>
          </Box>
          
          <Box sx={{ 
            pt: 1.2, 
            mt: 1.2,
            borderTop: `1px solid ${colors.primary.main}20`,
            textAlign: 'center'
          }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5, fontSize: '0.8rem' }}>
              Último Acceso
            </Typography>
            <Typography variant="body2" sx={{ 
              fontWeight: 'medium',
              color: colors.text.primary,
              fontSize: '0.9rem'
            }}>
              {profile.ultimoAcceso}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  </Grid>
</Grid>

      {/* ===== DATOS GENERALES ===== */}
     {/* ===== INFORMACIÓN DEL AGENTE ADUANAL - WIZARD ===== */}
<Card sx={{
  borderRadius: 3,
  boxShadow: `0 4px 24px ${colors.primary.main}12`,
  border: `1px solid ${colors.primary.main}15`,
  mb: 4
}}>
  <CardContent sx={{ p: 0 }}>

    {/* Cabecera con gradiente */}
    <Box sx={{
      p: 3,
      background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.primary.main} 100%)`,
      borderRadius: '12px 12px 0 0',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
          📋 Información del Agente Aduanal
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          Completa cada sección para tener un perfil completo
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {!editMode ? (
          <Button startIcon={<EditIcon />} onClick={() => setEditMode(true)}
            sx={{
              color: 'white', border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'white' }
            }}>
            Modificar
          </Button>
        ) : (
          <>
            <Button onClick={() => { setEditMode(false); setShowSuggestion(false); setFieldErrors({}); }}
              sx={{
                color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 2, textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
              }}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} startIcon={saving ? null : <SaveIcon />}
              sx={{
                bgcolor: colors.secondary.main, color: 'white',
                borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 2.5,
                '&:hover': { bgcolor: colors.secondary.light },
                '&:disabled': { bgcolor: `${colors.secondary.main}60`, color: 'white' }
              }}>
              {saving ? 'Guardando...' : 'Guardar Todo'}
            </Button>
          </>
        )}
      </Box>
    </Box>

    {/* Tabs de pasos */}
    <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${colors.primary.main}08`, bgcolor: '#F7FAFC' }}>
      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
        {STEPS.map((step, idx) => {
          const pct = step.id !== 3 ? getStepCompletion(step, formData) : null;
          const isActive = activeStep === idx;
          const isDone = pct === 100;
          return (
            <Box key={step.id} onClick={() => setActiveStep(idx)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                px: 2, py: 1.2, borderRadius: 2, cursor: 'pointer',
                minWidth: 'fit-content', transition: 'all 0.2s',
                bgcolor: isActive ? colors.primary.main
                  : isDone ? `${colors.secondary.main}12` : 'white',
                border: `1.5px solid ${isActive ? colors.primary.main
                  : isDone ? colors.secondary.main : colors.primary.main + '20'}`,
                '&:hover': { bgcolor: isActive ? colors.primary.main : `${colors.primary.main}08` }
              }}>
              <Box sx={{
                width: 28, height: 28, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: isActive ? 'rgba(255,255,255,0.2)'
                  : isDone ? colors.secondary.main : `${colors.primary.main}12`,
                color: isActive ? 'white' : isDone ? 'white' : colors.primary.main,
              }}>
                {isDone && !isActive
                  ? <CheckCircleIcon sx={{ fontSize: '0.9rem' }} />
                  : React.cloneElement(step.icon, { sx: { fontSize: '0.9rem' } })}
              </Box>
              <Box>
                <Typography variant="caption" fontWeight={700} sx={{
                  color: isActive ? 'white' : isDone ? colors.secondary.main : colors.primary.dark,
                  display: 'block', lineHeight: 1.2
                }}>
                  {step.label}
                </Typography>
                {pct !== null && (
                  <Typography variant="caption" sx={{
                    color: isActive ? 'rgba(255,255,255,0.7)' : '#8FA3B8',
                    fontSize: '0.65rem'
                  }}>
                    {pct}% completo
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>

    {/* Contenido del paso */}
    <Box sx={{ p: 3 }}>

      {/* Sugerencia de continuar */}
      <Collapse in={showSuggestion && editMode && activeStep < STEPS.length - 1}>
        <Alert severity="info"
          action={
            <Button size="small" endIcon={<ArrowForwardIcon />}
              onClick={() => { setActiveStep(s => s + 1); setShowSuggestion(false); }}
              sx={{ fontWeight: 700, textTransform: 'none' }}>
              Continuar con {STEPS[activeStep + 1]?.label}
            </Button>
          }
          onClose={() => setShowSuggestion(false)}
          sx={{
            mb: 3, borderRadius: 2,
            bgcolor: `${colors.secondary.main}10`,
            border: `1px solid ${colors.secondary.main}30`,
            color: colors.primary.dark
          }}>
          ¡Sección lista! ¿Quieres continuar con <strong>{STEPS[activeStep + 1]?.label}</strong>?
        </Alert>
      </Collapse>

      {/* PASO 0 - Datos Personales */}
      {activeStep === 0 && (
        <Fade in key="step0">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${colors.primary.main}15`, bgcolor: '#F7FAFC' }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: colors.primary.dark, mb: 2 }}>🪪 Identidad</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField 
                      label="Nombre Completo" 
                      fullWidth 
                      size="small" 
                      value={formData.nombre}
                      onChange={handleInputChange('nombre')} 
                      disabled={!editMode} 
                      sx={fieldSx} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="CURP" 
                      fullWidth 
                      size="small" 
                      value={formData.curp}
                      onChange={handleInputChange('curp')} 
                      disabled={!editMode}
                      error={!!fieldErrors.curp}
                      helperText={fieldErrors.curp}
                      required
                      sx={fieldSx} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="RFC" 
                      fullWidth 
                      size="small" 
                      value={formData.rfc}
                      onChange={handleInputChange('rfc')} 
                      disabled={!editMode}
                      error={!!fieldErrors.rfc}
                      helperText={fieldErrors.rfc}
                      required
                      sx={fieldSx} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="Patente Aduanal" 
                      fullWidth 
                      size="small" 
                      value={formData.patenteAduanal}
                      onChange={handleInputChange('patenteAduanal')} 
                      disabled={!editMode}
                      error={!!fieldErrors.patenteAduanal}
                      helperText={fieldErrors.patenteAduanal}
                      required
                      sx={fieldSx} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="Fecha de Nacimiento" 
                      type="date" 
                      fullWidth 
                      size="small"
                      value={formData.fechaNacimiento} 
                      onChange={handleInputChange('fechaNacimiento')}
                      disabled={!editMode}
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldErrors.fechaNacimiento}
                      helperText={fieldErrors.fechaNacimiento}
                      required
                      sx={fieldSx} 
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${colors.primary.main}15`, bgcolor: '#F7FAFC' }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: colors.primary.dark, mb: 2 }}>📝 Datos Adicionales</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="Lugar de Nacimiento" 
                      fullWidth 
                      size="small" 
                      value={formData.lugarNacimiento}
                      onChange={handleInputChange('lugarNacimiento')} 
                      disabled={!editMode}
                      error={!!fieldErrors.lugarNacimiento}
                      helperText={fieldErrors.lugarNacimiento}
                      required
                      sx={fieldSx} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="Nacionalidad" 
                      fullWidth 
                      size="small" 
                      value={formData.nacionalidad}
                      onChange={handleInputChange('nacionalidad')} 
                      disabled={!editMode}
                      error={!!fieldErrors.nacionalidad}
                      helperText={fieldErrors.nacionalidad}
                      required
                      sx={fieldSx} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      select 
                      label="Estado Civil" 
                      fullWidth 
                      size="small"
                      value={formData.estadoCivil} 
                      onChange={handleInputChange('estadoCivil')}
                      disabled={!editMode} 
                      sx={fieldSx}>
                      {['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión Libre'].map(v => (
                        <MenuItem key={v} value={v}>{v}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Fade>
      )}

      {/* PASO 1 - Contacto */}
      {activeStep === 1 && (
        <Fade in key="step1">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${colors.primary.main}15`, bgcolor: '#F7FAFC' }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: colors.primary.dark, mb: 2 }}>📱 Teléfonos</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField 
                      label="Teléfono Principal" 
                      fullWidth 
                      size="small" 
                      value={formData.telefono}
                      onChange={handleInputChange('telefono')} 
                      disabled={!editMode}
                      error={!!fieldErrors.telefono}
                      helperText={fieldErrors.telefono}
                      required
                      sx={fieldSx} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      label="Teléfono Alternativo" 
                      fullWidth 
                      size="small" 
                      value={formData.telefonoAlternativo}
                      onChange={handleInputChange('telefonoAlternativo')} 
                      disabled={!editMode} 
                      sx={fieldSx} 
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${colors.primary.main}15`, bgcolor: '#F7FAFC' }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: colors.primary.dark, mb: 2 }}>✉️ Correos Electrónicos</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField 
                      label="Correo Principal (no editable)" 
                      fullWidth 
                      size="small"
                      value={user?.email || ''} 
                      disabled 
                      sx={fieldSx} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      label="Correo Alternativo" 
                      type="email" 
                      fullWidth 
                      size="small"
                      value={formData.emailAlternativo} 
                      onChange={handleInputChange('emailAlternativo')}
                      disabled={!editMode} 
                      sx={fieldSx} 
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Fade>
      )}

      {/* PASO 2 - Domicilios */}
      {activeStep === 2 && (
        <Fade in key="step2">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${colors.primary.main}15`, bgcolor: '#F7FAFC' }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: colors.primary.dark, mb: 2 }}>🏢 Domicilio Fiscal</Typography>
                <TextField 
                  label="Dirección Fiscal Oficial" 
                  fullWidth 
                  size="small"
                  value={formData.domicilioFiscal} 
                  onChange={handleInputChange('domicilioFiscal')}
                  disabled={!editMode} 
                  multiline rows={4} 
                  sx={fieldSx} 
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${colors.primary.main}15`, bgcolor: '#F7FAFC' }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: colors.primary.dark, mb: 2 }}>🏠 Domicilio Particular</Typography>
                <TextField 
                  label="Dirección Particular" 
                  fullWidth 
                  size="small"
                  value={formData.domicilioParticular} 
                  onChange={handleInputChange('domicilioParticular')}
                  disabled={!editMode} 
                  multiline rows={4} 
                  sx={fieldSx} 
                />
              </Paper>
            </Grid>
          </Grid>
        </Fade>
      )}

      {/* PASO 3 - Seguridad */}
      {activeStep === 3 && (
        <Fade in key="step3">
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${colors.primary.main}15`, bgcolor: '#F7FAFC' }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: colors.primary.dark, mb: 0.5 }}>🔒 Cambio de Contraseña</Typography>
                <Typography variant="caption" sx={{ color: '#8FA3B8', display: 'block', mb: 2 }}>
                  Opcional — solo rellena si deseas cambiarla
                </Typography>
                <Stack spacing={2}>
                  <TextField 
                    label="Contraseña Actual" 
                    fullWidth 
                    size="small"
                    type={showPass.actual ? 'text' : 'password'}
                    value={formData.passwordActual} 
                    onChange={handleInputChange('passwordActual')}
                    disabled={!editMode}
                    InputProps={{
                      endAdornment: (
                        <IconButton size="small" onClick={() => setShowPass(p => ({ ...p, actual: !p.actual }))} edge="end">
                          {showPass.actual ? <VisibilityOffIcon sx={{ fontSize: '1rem' }} /> : <VisibilityIcon sx={{ fontSize: '1rem' }} />}
                        </IconButton>
                      )
                    }}
                    sx={fieldSx} 
                  />
                  <TextField 
                    label="Nueva Contraseña" 
                    fullWidth 
                    size="small"
                    type={showPass.nuevo ? 'text' : 'password'}
                    value={formData.passwordNuevo} 
                    onChange={handleInputChange('passwordNuevo')}
                    disabled={!editMode}
                    InputProps={{
                      endAdornment: (
                        <IconButton size="small" onClick={() => setShowPass(p => ({ ...p, nuevo: !p.nuevo }))} edge="end">
                          {showPass.nuevo ? <VisibilityOffIcon sx={{ fontSize: '1rem' }} /> : <VisibilityIcon sx={{ fontSize: '1rem' }} />}
                        </IconButton>
                      )
                    }}
                    sx={fieldSx} 
                  />
                  <TextField 
                    label="Confirmar Nueva Contraseña" 
                    fullWidth 
                    size="small"
                    type={showPass.confirmar ? 'text' : 'password'}
                    value={formData.confirmarPassword} 
                    onChange={handleInputChange('confirmarPassword')}
                    disabled={!editMode}
                    error={formData.passwordNuevo !== formData.confirmarPassword && formData.confirmarPassword !== ''}
                    helperText={formData.passwordNuevo !== formData.confirmarPassword && formData.confirmarPassword !== '' ? 'Las contraseñas no coinciden' : ''}
                    InputProps={{
                      endAdornment: (
                        <IconButton size="small" onClick={() => setShowPass(p => ({ ...p, confirmar: !p.confirmar }))} edge="end">
                          {showPass.confirmar ? <VisibilityOffIcon sx={{ fontSize: '1rem' }} /> : <VisibilityIcon sx={{ fontSize: '1rem' }} />}
                        </IconButton>
                      )
                    }}
                    sx={fieldSx} 
                  />
                  {formData.passwordNuevo && formData.passwordNuevo === formData.confirmarPassword && (
                    <Alert severity="success" sx={{ borderRadius: 2 }}>✅ Las contraseñas coinciden</Alert>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Fade>
      )}

      {/* Navegación entre pasos */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        mt: 4, pt: 3, borderTop: `1px solid ${colors.primary.main}10`
      }}>
        <Button startIcon={<ArrowBackIcon />}
          onClick={() => setActiveStep(s => Math.max(0, s - 1))}
          disabled={activeStep === 0}
          sx={{ color: colors.primary.main, textTransform: 'none', fontWeight: 600, '&:disabled': { color: '#8FA3B8' } }}>
          Anterior
        </Button>

        {/* Puntos indicadores */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {STEPS.map((_, idx) => (
            <Box key={idx} onClick={() => setActiveStep(idx)} sx={{
              width: activeStep === idx ? 24 : 8, height: 8,
              borderRadius: 4, cursor: 'pointer', transition: 'all 0.3s',
              bgcolor: activeStep === idx ? colors.primary.main : `${colors.primary.main}25`,
            }} />
          ))}
        </Box>

        {activeStep < STEPS.length - 1 ? (
          <Button endIcon={<ArrowForwardIcon />}
            onClick={() => { setShowSuggestion(true); setActiveStep(s => s + 1); }}
            sx={{
              bgcolor: colors.primary.main, color: 'white',
              borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.5,
              '&:hover': { bgcolor: colors.primary.dark }
            }}>
            Siguiente
          </Button>
        ) : (
          <Button endIcon={<CheckCircleIcon />}
            onClick={editMode ? handleSave : () => setEditMode(true)}
            sx={{
              bgcolor: colors.secondary.main, color: 'white',
              borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.5,
              '&:hover': { bgcolor: colors.secondary.light }
            }}>
            {editMode ? 'Guardar Todo' : 'Editar'}
          </Button>
        )}
      </Box>
    </Box>
  </CardContent>
</Card>

      {/* Diálogo para agregar nueva aduana */}
      <Dialog open={aduanaDialog} onClose={() => setAduanaDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: colors.text.primary }}>
            <AddCircleIcon sx={{ color: colors.primary.main }} />
            Agregar Nueva Aduana
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Nombre de la Aduana"
              fullWidth
              value={newAduana.nombre}
              onChange={handleAduanaChange('nombre')}
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Tipo de Aduana</InputLabel>
              <Select
                value={newAduana.tipo}
                onChange={handleAduanaChange('tipo')}
                label="Tipo de Aduana"
              >
                <MenuItem value="Principal">Principal</MenuItem>
                <MenuItem value="Secundaria">Secundaria</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Número de Registro"
              fullWidth
              value={newAduana.numeroRegistro}
              onChange={handleAduanaChange('numeroRegistro')}
              required
            />
            
            <TextField
              label="Fecha de Registro"
              type="date"
              fullWidth
              value={newAduana.fechaRegistro}
              onChange={handleAduanaChange('fechaRegistro')}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAduanaDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleAddAduana} 
            variant="contained" 
            disabled={!newAduana.nombre || !newAduana.numeroRegistro || aduanaList.length >= 4}
            sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo del Certificado */}
      <Dialog 
        open={certificadoDialog} 
        onClose={() => setCertificadoDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: '#f5efe6',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `2px solid ${colors.primary.dark}40`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: colors.primary.dark,
          color: 'white',
          py: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: 'white',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: colors.primary.dark,
              fontSize: '1.2rem'
            }}>
              S
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
              SICAG
            </Typography>
            <Typography variant="body2" sx={{ ml: 1, opacity: 0.9 }}>
              Sistema Integral de Consultoría y Asesoría Gremial
            </Typography>
          </Box>
          <IconButton onClick={() => setCertificadoDialog(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers sx={{ borderColor: `${colors.primary.dark}30` }}>
          {/* Contenido del Certificado */}
          <Box 
            id="certificado-contenido" 
            sx={{ 
              p: 4,
              position: 'relative',
              backgroundColor: '#f5efe6',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 20,
                left: 20,
                right: 20,
                bottom: 20,
                border: `2px solid ${colors.primary.dark}15`,
                borderRadius: 1,
                pointerEvents: 'none'
              }
            }}
          >
            {/* Escudo/Emblema decorativo */}
            <Box sx={{ 
              position: 'absolute',
              top: 60,
              left: 60,
              opacity: 0.1,
              fontSize: '8rem',
              transform: 'rotate(-15deg)',
              color: colors.primary.dark,
              fontFamily: 'serif'
            }}>
              ⚓
            </Box>

            {/* Título Principal */}
            <Typography variant="h3" align="center" sx={{ 
              color: colors.primary.dark,
              fontWeight: 'bold',
              mb: 1,
              fontSize: '2.2rem',
              letterSpacing: 2,
              textTransform: 'uppercase',
              borderBottom: `3px double ${colors.primary.main}`,
              pb: 2,
              mx: 'auto',
              maxWidth: '80%',
              position: 'relative',
              zIndex: 1
            }}>
              R E C O N O C I M I E N T O
            </Typography>

            <Typography variant="h5" align="center" sx={{ 
              color: colors.primary.light,
              mb: 4,
              fontWeight: 400,
              fontStyle: 'italic'
            }}>
              de Nivel Gremial
            </Typography>

            {/* Sello de agua SICAG */}
            <Typography variant="h2" align="center" sx={{ 
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-30deg)',
              fontSize: '6rem',
              opacity: 0.03,
              color: colors.primary.dark,
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 0
            }}>
              SICAG
            </Typography>

            {/* Otorgado a */}
            <Box sx={{ position: 'relative', zIndex: 1, mb: 4 }}>
              <Typography variant="body1" align="center" sx={{ 
                fontSize: '1.1rem',
                color: colors.text.primary,
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: 2
              }}>
                OTORGADO A:
              </Typography>
              
              <Typography variant="h3" align="center" sx={{ 
                color: colors.primary.dark,
                fontWeight: 'bold',
                mb: 1,
                fontSize: '2.5rem',
                borderBottom: `2px dotted ${colors.primary.main}`,
                borderTop: `2px dotted ${colors.primary.main}`,
                py: 2,
                mx: 'auto',
                maxWidth: 'fit-content',
                px: 4
              }}>
                {profile.nombre}
              </Typography>

              <Typography variant="h5" align="center" sx={{ 
                color: colors.secondary.main,
                fontWeight: '500',
                textTransform: 'uppercase'
              }}>
                Agente Aduanal
              </Typography>
            </Box>

            {/* Nivel */}
            <Box sx={{ 
              bgcolor: `${colors.primary.main}08`,
              border: `2px solid ${colors.primary.main}`,
              borderRadius: 2,
              p: 3,
              mb: 4,
              position: 'relative',
              zIndex: 1,
              boxShadow: `0 4px 12px ${colors.primary.main}20`
            }}>
              <Typography variant="h4" align="center" sx={{ 
                color: colors.primary.dark,
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                Nivel I - Sistema Gremial Basico
              </Typography>
            </Box>

   {/* Requisitos cumplidos - VERSIÓN CON FLEXBOX FORZADO */}
<Box 
  sx={{ 
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
    mb: 4,
    position: 'relative',
    zIndex: 1,
    width: '100%'
  }}
>
  {/* Bloque FORMACIÓN ESPECIALIZADA */}
<Box sx={{ 
  flex: 1, 
  width: '50%'
}}>
  <Paper sx={{ 
    p: 2.5, 
    bgcolor: 'white',
    borderLeft: `6px solid ${colors.primary.main}`,
    boxShadow: `0 2px 8px ${colors.primary.main}15`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Centra horizontalmente los hijos
    justifyContent: 'center' // Centra verticalmente los hijos
  }}>
    <Typography variant="h6" sx={{ 
      color: colors.primary.dark,
      fontWeight: 'bold',
      mb: 2,
      borderBottom: `1px solid ${colors.primary.main}30`,
      pb: 1,
      textAlign: 'center',
      width: '100%' // Ocupa todo el ancho para que el borde se extienda
    }}>
      FORMACIÓN ESPECIALIZADA
    </Typography>
    
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1, 
      mb: 1.5,
      width: '100%',
      justifyContent: 'center' // Centra el contenido de este Box
    }}>
      <Box sx={{ 
        width: 20, 
        height: 20, 
        borderRadius: '50%', 
        bgcolor: colors.status.success,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '0.8rem',
        fontWeight: 'bold'
      }}>
        ✓
      </Box>
      <Typography variant="body1">
        <strong>Formación Ética y Cumplimiento:</strong> 20 horas
      </Typography>
    </Box>
    
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      width: '100%',
      justifyContent: 'center' // Centra el contenido de este Box
    }}>
      <Box sx={{ 
        width: 20, 
        height: 20, 
        borderRadius: '50%', 
        bgcolor: colors.status.success,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '0.8rem',
        fontWeight: 'bold'
      }}>
        ✓
      </Box>
      <Typography variant="body1">
        <strong>Actualización Técnica Aduanera:</strong> 80 horas
      </Typography>
    </Box>
  </Paper>
</Box>

  
</Box>

            {/* Fechas y Vigencia */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 3, 
              mb: 4, 
              position: 'relative', 
              zIndex: 1,
              flexWrap: 'wrap'
            }}>
              <Paper sx={{ 
                p: 2, 
                textAlign: 'center', 
                bgcolor: 'white',
                border: `1px solid ${colors.primary.main}30`,
                minWidth: 180
              }}>
                <Typography variant="body2" sx={{ color: colors.text.secondary, textTransform: 'uppercase' }}>
                  Fecha de Emisión
                </Typography>
                <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: 'bold' }}>
                  24 de Febrero de 2026
                </Typography>
              </Paper>
              
              <Paper sx={{ 
                p: 2, 
                textAlign: 'center', 
                bgcolor: 'white',
                border: `1px solid ${colors.primary.main}30`,
                minWidth: 180
              }}>
                <Typography variant="body2" sx={{ color: colors.text.secondary, textTransform: 'uppercase' }}>
                  Vigencia del Nivel
                </Typography>
                <Typography variant="h6" sx={{ color: colors.status.warning, fontWeight: 'bold' }}>
                  365 días
                </Typography>
              </Paper>

              <Paper sx={{ 
                p: 2, 
                textAlign: 'center', 
                bgcolor: 'white',
                border: `1px solid ${colors.primary.main}30`,
                minWidth: 180
              }}>
                <Typography variant="body2" sx={{ color: colors.text.secondary, textTransform: 'uppercase' }}>
                  Vence el
                </Typography>
                <Typography variant="h6" sx={{ color: colors.status.error, fontWeight: 'bold' }}>
                  24 de Febrero de 2026
                </Typography>
              </Paper>
            </Box>

            {/* Firmas */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 8, 
              mt: 4, 
              mb: 4, 
              position: 'relative', 
              zIndex: 1,
              flexWrap: 'wrap'
            }}>
              <Box sx={{ textAlign: 'center', minWidth: 250 }}>
                <Box sx={{ 
                  borderBottom: `2px solid ${colors.primary.dark}`,
                  mb: 1,
                  pt: 2
                }}>
                  <Typography variant="body1" sx={{ 
                    color: colors.primary.dark,
                    fontWeight: 'bold',
                    fontFamily: 'cursive',
                    fontSize: '1.3rem',
                    lineHeight: 1.2
                  }}>
                    Dr. Juan Carlos Mendoza
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                  Presidente del Comité de Certificaciones
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', minWidth: 250 }}>
                <Box sx={{ 
                  borderBottom: `2px solid ${colors.primary.dark}`,
                  mb: 1,
                  pt: 2
                }}>
                  <Typography variant="body1" sx={{ 
                    color: colors.primary.dark,
                    fontWeight: 'bold',
                    fontFamily: 'cursive',
                    fontSize: '1.3rem',
                    lineHeight: 1.2
                  }}>
                    Lic. María Fernanda López
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                  Secretario Técnico
                </Typography>
              </Box>
            </Box>

            {/* Sello oficial SICAG y Código QR */}
            <Box sx={{ 
              mt: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              {/* Sello SICAG */}
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Box sx={{ 
                  position: 'relative',
                  width: 100,
                  height: 100
                }}>
                  <Box sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: `3px solid ${colors.primary.dark}`,
                    opacity: 0.3
                  }} />
                  
                  <Box sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: '80%',
                    height: '80%',
                    borderRadius: '50%',
                    border: `2px solid ${colors.primary.main}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: `${colors.primary.main}05`
                  }}>
                    <Typography variant="body2" sx={{ 
                      color: colors.primary.dark,
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      lineHeight: 1.2,
                      textAlign: 'center'
                    }}>
                      SICAG
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: colors.primary.dark,
                      fontSize: '0.6rem',
                      textAlign: 'center'
                    }}>
                      CERTIFICA
                    </Typography>
                  </Box>
                  
                  <Typography sx={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '15%',
                    color: colors.primary.dark,
                    fontSize: '1rem',
                    transform: 'rotate(15deg)'
                  }}>
                    ✦
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', fontWeight: 'bold' }}>
                    Folio: SICAG-CERT-2024-00123
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                    Válido en todo el territorio nacional
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.primary.main, display: 'block', mt: 0.5 }}>
                    Autenticado electrónicamente
                  </Typography>
                </Box>
              </Box>
              
              {/* Código QR */}
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 80,
                  height: 80,
                  bgcolor: 'white',
                  border: `2px solid ${colors.primary.dark}`,
                  borderRadius: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', p: 1 }}>
                    {[...Array(49)].map((_, i) => (
                      <Box key={i} sx={{
                        width: 6,
                        height: 6,
                        bgcolor: Math.random() > 0.5 ? colors.primary.dark : 'transparent',
                        border: Math.random() > 0.8 ? `1px solid ${colors.primary.dark}30` : 'none'
                      }} />
                    ))}
                  </Box>
                  <Box sx={{ position: 'absolute', top: 5, left: 5, width: 15, height: 15, border: `2px solid ${colors.primary.dark}`, borderRight: 'none', borderBottom: 'none' }} />
                  <Box sx={{ position: 'absolute', top: 5, right: 5, width: 15, height: 15, border: `2px solid ${colors.primary.dark}`, borderLeft: 'none', borderBottom: 'none' }} />
                  <Box sx={{ position: 'absolute', bottom: 5, left: 5, width: 15, height: 15, border: `2px solid ${colors.primary.dark}`, borderRight: 'none', borderTop: 'none' }} />
                </Box>
                <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mt: 0.5 }}>
                  Escanear para verificar
                </Typography>
              </Box>
            </Box>

            {/* Leyenda inferior */}
            <Typography variant="caption" align="center" sx={{ 
              display: 'block',
              mt: 3,
              pt: 2,
              borderTop: `1px solid ${colors.primary.main}30`,
              color: colors.text.secondary,
              fontStyle: 'italic',
              position: 'relative',
              zIndex: 1
            }}>
              Este certificado es propiedad de SICAG - Sistema Integral de Consultoría y Asesoría Gremial.
              Cualquier reproducción no autorizada viola los derechos de la institución.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          p: 3, 
          justifyContent: 'center', 
          gap: 2,
          bgcolor: colors.primary.dark,
          borderTop: `2px solid ${colors.secondary.main}`
        }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadCertificate}
            disabled={isDownloading}
            sx={{
              bgcolor: colors.secondary.main,
              color: colors.primary.dark,
              fontWeight: 'bold',
              '&:hover': { 
                bgcolor: colors.secondary.light,
              },
              '&:disabled': {
                bgcolor: `${colors.secondary.main}50`,
                color: colors.primary.dark
              },
              px: 4,
              py: 1
            }}
          >
            {isDownloading ? 'GENERANDO PDF...' : 'DESCARGAR CERTIFICADO'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => setCertificadoDialog(false)}
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': { 
                borderColor: colors.secondary.main,
                backgroundColor: 'rgba(255,255,255,0.1)'
              },
              px: 4
            }}
          >
            CERRAR
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;