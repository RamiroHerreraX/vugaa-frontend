import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearCertificacionCompleta } from '../../../services/certificaciones';
import { useAuth } from "../../../context/AuthContext";
import AddCertificationModal from '../../../components/subirCertificacion/AddCertificationModal';
// Agrega al import del service
import { getCertificacionesPorExpediente, eliminarCertificacionCompleta ,editarCertificacionCompleta   } from '../../../services/certificaciones';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Tooltip,
  Avatar,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Security as SecurityIcon,
  CloudUpload as CloudUploadIcon,
  Gavel as GavelIcon,
  Verified as VerifiedIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Send as SendIcon,
  School as SchoolIcon,
  Update as UpdateIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Group as GroupIcon,
  VerifiedUser as VerifiedUserIcon,
  WarningAmber as WarningAmberIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
  History as HistoryIcon,
  Comment as CommentIcon,
  AttachFile as AttachFileIcon,
  FactCheck as FactCheckIcon,
  ArrowForward as ArrowForwardIcon
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



// ========== CONSTANTES ==========
const PROGRAMAS = {
  formacionEtica: 1,
  actualizacionTecnica: 2,
  otros: 3
};

// ========== MODAL MODIFICADO ==========


const EditCertificationModal = ({
  open,
  onClose,
  onSave,
  editForm,
  onFieldChange,
  colors
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
    PaperProps={{ sx: { borderRadius: 2 } }}>
    <DialogTitle sx={{ bgcolor: colors.status.warning, color: 'white', py: 2, px: 3,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <EditIcon />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Editar Certificación</Typography>
      </Box>
      <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>

    <DialogContent sx={{ py: 3, px: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Tipo de certificación" size="small" margin="normal"
            value={editForm.tipo}
            onChange={(e) => onFieldChange('tipo', e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Número de certificación" size="small" margin="normal"
            value={editForm.numero}
            onChange={(e) => onFieldChange('numero', e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Subsección" size="small" margin="normal"
            value={editForm.subseccion}
            onChange={(e) => onFieldChange('subseccion', e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Fecha de emisión" type="date" size="small"
            margin="normal" InputLabelProps={{ shrink: true }}
            value={editForm.fechaEmision}
            onChange={(e) => onFieldChange('fechaEmision', e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Autoridad emisora" size="small" margin="normal"
            value={editForm.autoridad}
            onChange={(e) => onFieldChange('autoridad', e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Horas" type="number" size="small" margin="normal"
            value={editForm.horasAcreditadas}
            onChange={(e) => onFieldChange('horasAcreditadas', e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Comentarios" multiline rows={3} size="small"
            margin="normal"
            value={editForm.descripcion}
            onChange={(e) => onFieldChange('descripcion', e.target.value)} />
        </Grid>
      </Grid>
    </DialogContent>

    <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${colors.primary.main}20` }}>
      <Button onClick={onClose} variant="outlined"
        sx={{ color: colors.primary.main, borderColor: colors.primary.main }}>
        Cancelar
      </Button>
      <Button onClick={onSave} variant="contained"
        sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}>
        Guardar Cambios
      </Button>
    </DialogActions>
  </Dialog>
);

const Certifications = () => {
  const { user } = useAuth(); // Asumiendo que tienes el usuario en contexto
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleEditFormChange = (campo, valor) => {
    setEditForm({ ...editForm, [campo]: valor });
  };

  // Estados para modales
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewCert, setPreviewCert] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCert, setEditCert] = useState(null);
  const [editForm, setEditForm] = useState({
  tipo:             '',
  numero:           '',
  subseccion:       '',
  fechaEmision:     '',
  autoridad:        '',
  horasAcreditadas: '',
  descripcion:      ''
});
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [deleteCert, setDeleteCert] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Estado para nueva certificación
  const [nuevaCertificacion, setNuevaCertificacion] = useState({
    subseccion: '',
    tipoDocumento: '',
    institucion: '',
    fecha: new Date().toISOString().split('T')[0],
    horas: '',
    archivo: null,
    nombreArchivo: ''
  });

  // Estado para simular carga de archivos
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Datos de autorización de la asociación
  const associationDetails = {
    name: 'Asociación de Agentes Aduanales del Estado',
    role: 'Rol auxiliar - Entidad Asociativa',
    permissions: [
      'Cargar evidencias institucionales (constancias, certificados)',
      'Subir documentación de cursos y capacitaciones',
      'Enviar documentación de pertenencia a la asociación',
      'Visualizar información general de agentes asociados',
      'Centralizar documentación común a varios agentes'
    ],
    restrictions: [
      'No puede validar certificaciones individuales',
      'No puede modificar expedientes personales',
      'No sustituye la responsabilidad individual del agente',
      'Acceso limitado a información específica',
      'No puede tomar decisiones en nombre del agente'
    ]
  };

  // Estado para el diálogo de asociación
  const [associationDialog, setAssociationDialog] = useState(true);
  const [associationConsent, setAssociationConsent] = useState(null);

  // Función para manejar el consentimiento de la asociación
  const handleAssociationConsent = (consent) => {
    setAssociationConsent(consent);
    setAssociationDialog(false);
   
  };



  // Datos de certificaciones - SOLO LAS DOS SOLICITADAS
 const [certifications, setCertifications] = useState([]);

 const idExpediente = 1; // ← ficticio por ahora

useEffect(() => {
  const cargarCertificaciones = async () => {
    try {
      const data = await getCertificacionesPorExpediente(idExpediente);
      const mapped = data.map(cert => ({
        id:          cert.idCertExp,
        idCertificacion: cert.idCertificacion,
        type:        cert.nombreCertificacion?.toUpperCase() || '—',
        number:      `CERT-${cert.idCertExp}`,
        issueDate:       cert.fechaEmision ? new Date(cert.fechaEmision).toLocaleDateString('es-MX') : '—',
        issueDateRaw:    cert.fechaEmision || '',
        expirationDate: cert.fechaExpiracion || '—',
        status:      cert.estado === 'EN_REVISION' ? 'En revisión' :
                     cert.estado === 'VIGENTE'     ? 'Aceptados'   :
                     cert.estado === 'RECHAZADA'   ? 'Rechazado'   : cert.estado,
        progress:    cert.estado === 'VIGENTE' ? 100 : 30,
        documents:   1,
        lastUpdate:  cert.fechaCreacion || '—',
        subseccion:  cert.nombrePrograma || '—',
        horas:       cert.horasAcreditadas || 0,
        tipo:        cert.nombreCertificacion || '—',
        autoridad:   cert.institucion || '—',
        vigencia:    '3 años',
        ambito:      'Nacional',
        comentarios: cert.descripcion || '',
        documentosAsociados: [{
          id:     cert.mongoDocumentoId || `d${cert.idCertExp}`,
          nombre: cert.nombreArchivo || 'documento',
          tipo:   'PDF',
          tamaño: '—',
          fecha:  cert.fechaEmision || '—'
        }]
      }));
      setCertifications(mapped);
    } catch (error) {
      console.error('Error cargando certificaciones:', error);
    }
  };

  cargarCertificaciones();
}, []);

  // Función para simular carga de archivo
  const simulateUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Funciones para abrir modales
  const handleOpenPreview = (cert) => {
    setPreviewCert(cert);
    setPreviewModalOpen(true);
  };

  const handleOpenEdit = (cert) => {
  setEditCert(cert);
  setEditForm({
    tipo:             cert.type || '',
    numero:           cert.number || '',
    subseccion:       cert.subseccion || '',
    fechaEmision:     cert.issueDateRaw || '',
    autoridad:        cert.autoridad || '',
    horasAcreditadas: cert.horas || '',
    descripcion:      cert.comentarios || ''
  });
  setEditModalOpen(true);
};

  const handleOpenDelete = (cert) => {
    setDeleteCert(cert);
    setDeleteConfirmModalOpen(true);
  };

  const handleOpenAdd = () => {
    setAddModalOpen(true);
  };

  // Funciones para cerrar modales
  const handleClosePreview = () => {
    setPreviewModalOpen(false);
    setPreviewCert(null);
  };

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setEditCert(null);
  };

  const handleCloseDelete = () => {
    setDeleteConfirmModalOpen(false);
    setDeleteCert(null);
  };

  const handleCloseAdd = () => {
    setAddModalOpen(false);
    setNuevaCertificacion({
      subseccion: '',
      tipoDocumento: '',
      institucion: '',
      fecha: new Date().toISOString().split('T')[0],
      horas: '',
      archivo: null,
      nombreArchivo: ''
    });
  };

  // Función para manejar cambios en el formulario de nueva certificación
  const handleNuevaCertificacionChange = (campo) => (event) => {
    setNuevaCertificacion({
      ...nuevaCertificacion,
      [campo]: event.target.value
    });
  };

  // Función para manejar selección de archivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño (máx 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'El archivo no puede ser mayor a 10MB',
          severity: 'error'
        });
        return;
      }

      // Validar tipo de archivo
      const tiposPermitidos = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!tiposPermitidos.includes(file.type)) {
        setSnackbar({
          open: true,
          message: 'Formato no permitido. Use PDF, DOC, DOCX, JPG o PNG',
          severity: 'error'
        });
        return;
      }

      setNuevaCertificacion({
        ...nuevaCertificacion,
        archivo: file,
        nombreArchivo: file.name
      });

      // Simular carga
      simulateUpload();
    }
  };

  // Función para guardar nueva certificación
  const handleGuardarNuevaCertificacion = async () => {
  // Validar campos requeridos
  if (!nuevaCertificacion.subseccion || !nuevaCertificacion.tipoDocumento || 
      !nuevaCertificacion.institucion || !nuevaCertificacion.horas || 
      !nuevaCertificacion.archivo) {
    setSnackbar({
      open: true,
      message: 'Por favor complete todos los campos requeridos',
      severity: 'warning'
    });
    return;
  }

  setSaving(true);
  
  try {
    // PASO 1: Simular subida a MongoDB (aquí iría tu servicio real)
    // En producción, aquí llamarías a un servicio que sube a MongoDB
    // y retorna el mongoDocumentoId
    const mongoDocumentoId = `mock-mongo-${Date.now()}`;
    
    // PASO 2: Obtener IDs del contexto de autenticación
    const idInstancia = user?.instanciaId; // Ajusta según tu contexto
    const idExpediente = 1; // Ajusta según tu contexto
    const idPrograma = PROGRAMAS[nuevaCertificacion.subseccion] || PROGRAMAS.otros;

    // PASO 3: Llamar al servicio que crea la certificación completa
    const nuevaCert = await crearCertificacionCompleta(
      {
        nombre: nuevaCertificacion.tipoDocumento,
        institucion: nuevaCertificacion.institucion,
        horas: parseInt(nuevaCertificacion.horas),
        fecha: nuevaCertificacion.fecha,
        nombreArchivo: nuevaCertificacion.nombreArchivo,
        descripcion: '' // Campo opcional
      },
      idInstancia,
      idExpediente,
      idPrograma,
      nuevaCertificacion.archivo 
    );

    // PASO 4: Agregar a la lista local para feedback inmediato
    const nuevaCertLocal = {
      id: nuevaCert.idCertExp || certifications.length + 1,
      idCertificacion: nuevaCert.idCertificacion,
      type: nuevaCertificacion.tipoDocumento.toUpperCase(),
      number: `CERT-${new Date().getFullYear()}-${String(certifications.length + 1).padStart(3, '0')}`,
      issueDate: new Date(nuevaCertificacion.fecha).toLocaleDateString('es-MX'),
      expirationDate: nuevaCert.fechaExpiracion || '—',
      status: 'En revisión',
      progress: 30,
      documents: 1,
      lastUpdate: new Date().toLocaleDateString('es-MX'),
      subseccion: nuevaCert.nombrePrograma || 
                 (nuevaCertificacion.subseccion === 'formacionEtica' ? 'Formación Ética y Cumplimiento' : 'Actualización Técnica y Aduanera'),
      horas: parseInt(nuevaCertificacion.horas),
      tipo: nuevaCertificacion.tipoDocumento,
      autoridad: nuevaCertificacion.institucion,
      vigencia: '3 años',
      ambito: 'Nacional',
      comentarios: 'Certificación en proceso de validación',
      documentosAsociados: [
        { 
          id: nuevaCert.mongoDocumentoId || `d${Date.now()}`, 
          nombre: nuevaCertificacion.nombreArchivo, 
          tipo: nuevaCertificacion.archivo?.type?.includes('pdf') ? 'PDF' : 'Documento', 
          tamaño: `${Math.round(nuevaCertificacion.archivo?.size / 1024 / 1024 * 10) / 10} MB`, 
          fecha: new Date().toLocaleDateString('es-MX') 
        }
      ]
    };

    setCertifications([...certifications, nuevaCertLocal]);
    
    setSnackbar({
      open: true,
      message: 'Certificación agregada correctamente',
      severity: 'success'
    });

    handleCloseAdd();

  } catch (error) {
    console.error('Error al guardar certificación:', error);
    setSnackbar({
      open: true,
      message: error.response?.data?.message || 'Error al guardar la certificación',
      severity: 'error'
    });
  } finally {
    setSaving(false);
  }
};

 const handleSaveEdit = async () => {
  if (!editCert) return;

   console.log('editCert completo:', editCert); // ← agrega esto
  console.log('idCertificacion:', editCert.idCertificacion);
  console.log('idCertExp (id):', editCert.id);

  try {
    await editarCertificacionCompleta({
      idCertificacion: editCert.idCertificacion,
      idCertExp:       editCert.id,
      nombre:          editForm.tipo,
      institucion:     editForm.autoridad,
      horas:           parseInt(editForm.horasAcreditadas),
      fechaEmision:    editForm.fechaEmision,
      descripcion:     editForm.descripcion ?? '',
    });

    // Actualiza la lista local para reflejar los cambios sin recargar
    setCertifications(certifications.map(c =>
      c.id === editCert.id
        ? {
            ...c,
            type:        editForm.tipo.toUpperCase(),
            autoridad:   editForm.autoridad,
            subseccion:  editForm.subseccion,
            issueDate:   editForm.fechaEmision,
            horas:       parseInt(editForm.horasAcreditadas),
            comentarios: editForm.descripcion,
          }
        : c
    ));

    setSnackbar({
      open:     true,
      message:  'Certificación actualizada correctamente',
      severity: 'success'
    });

    handleCloseEdit();

  } catch (error) {
    console.error('Error al actualizar:', error);
    setSnackbar({
      open:     true,
      message:  error.response?.data?.message || 'Error al actualizar la certificación',
      severity: 'error'
    });
  }
};
  // Función para confirmar eliminación
 const handleConfirmDelete = async () => {
  if (!deleteCert) return;
  try {
    await eliminarCertificacionCompleta(deleteCert.id, deleteCert.idCertificacion);

    setCertifications(certifications.filter(c => c.id !== deleteCert.id));

    setSnackbar({
      open:     true,
      message:  'Certificación eliminada correctamente',
      severity: 'success'
    });

    handleCloseDelete();
  } catch (error) {
    console.error('Error al eliminar:', error);
    setSnackbar({
      open:     true,
      message:  error.response?.data?.message || 'Error al eliminar la certificación',
      severity: 'error'
    });
  }
};

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Estadísticas
  const stats = {
    total: certifications.length,
    valid: certifications.filter(c => c.status === 'Aceptados').length,
    expiring: certifications.filter(c => c.status === 'Por Vencer').length,
    review: certifications.filter(c => c.status === 'En revisión' || c.status === 'Información adicional').length,
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Registro': return 'info';
      case 'En revisión': return 'warning';
      case 'Aceptados': return 'success';
      case 'Información adicional': return 'primary';
      case 'Rechazado': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Registro': return <DescriptionIcon />;
      case 'En revisión': return <VisibilityIcon />;
      case 'Aceptados': return <CheckCircleIcon />;
      case 'Información adicional': return <InfoIcon />;
      case 'Rechazado': return <CancelIcon />;
      default: return <HelpIcon />;
    }
  };

  const filteredCerts = certifications.filter(cert => {
    const matchesSearch = 
      cert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || cert.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Modal de autorización de la asociación
  const AssociationDialog = () => (
    <Dialog 
  open={associationDialog} 
  maxWidth="lg"
  fullWidth
  PaperProps={{
    sx: { 
      borderRadius: 2,
      maxHeight: '90vh'
    }
  }}
>
  <DialogTitle sx={{ 
    bgcolor: colors.primary.dark, 
    color: 'white',
    py: 2
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <SecurityIcon sx={{ fontSize: 28 }} />
      <Box>
        <Typography variant="h6" fontWeight="bold">
          Autorización para Asociación de Agentes Aduanales
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', opacity: 0.9 }}>
          Decisión importante para la gestión de tus certificaciones
        </Typography>
      </Box>
    </Box>
  </DialogTitle>
  
  <DialogContent dividers sx={{ py: 3, px: 3 }}>

    {/* Información de la asociación */}
    <Alert severity="info" sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <GroupIcon />
        <Typography variant="subtitle2" fontWeight="bold">
          {associationDetails.name}
        </Typography>
      </Box>
      <Typography variant="body2">
        Esta asociación funciona como entidad auxiliar dentro del sistema, permitiendo centralizar información común y documentación compartida, sin sustituir tu responsabilidad individual.
      </Typography>
    </Alert>

    {/* COMPARACIÓN LADO A LADO */}
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>

      {/* COLUMNA IZQUIERDA - ACEPTAR */}
      <Box sx={{ flex: 1 }}>
        <Paper 
          elevation={3}
          sx={{ 
            border: `2px solid ${colors.status.success}`,
            borderRadius: 2,
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ bgcolor: colors.status.success, p: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              <CheckIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              SI ACEPTAS LA AUTORIZACIÓN
            </Typography>
          </Box>
          <Box sx={{ p: 2, flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: colors.status.success, mb: 1.5, display: 'flex', alignItems: 'center' }}>
              <ArrowForwardIcon sx={{ mr: 1, fontSize: 18 }} />
              Tu asociación PODRÁ:
            </Typography>
            <Box sx={{ pl: 1 }}>
              {associationDetails.permissions.map((permission, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                  <CheckCircleIcon sx={{ color: colors.status.success, mr: 1.5, mt: 0.2, fontSize: 16 }} />
                  <Typography variant="body2" color={colors.text.primary}>
                    {permission}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight="bold">
                Ventaja clave: Reduce carga administrativa y centraliza evidencias comunes
              </Typography>
            </Alert>
          </Box>
        </Paper>
      </Box>

      {/* COLUMNA DERECHA - RECHAZAR */}
      <Box sx={{ flex: 1 }}>
        <Paper 
          elevation={3}
          sx={{ 
            border: `2px solid ${colors.status.error}`,
            borderRadius: 2,
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ bgcolor: colors.status.error, p: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              <CloseIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              SI RECHAZAS LA AUTORIZACIÓN
            </Typography>
          </Box>
          <Box sx={{ p: 2, flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: colors.status.error, mb: 1.5, display: 'flex', alignItems: 'center' }}>
              <ArrowForwardIcon sx={{ mr: 1, fontSize: 18 }} />
              Tu asociación NO PODRÁ:
            </Typography>
            <Box sx={{ pl: 1 }}>
              {associationDetails.restrictions.map((restriction, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                  <CancelIcon sx={{ color: colors.status.error, mr: 1.5, mt: 0.2, fontSize: 16 }} />
                  <Typography variant="body2" color={colors.text.primary}>
                    {restriction}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight="bold">
                Consideración clave: Gestión completamente individual de toda la documentación
              </Typography>
            </Alert>
          </Box>
        </Paper>
      </Box>

    </Box>

    {/* Nota importante */}
    <Paper elevation={0} sx={{ p: 2, bgcolor: '#e8f4fd', border: '1px solid #90caf9', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <InfoIcon sx={{ color: colors.primary.main }} />
        <Box>
          <Typography variant="subtitle2" sx={{ color: colors.primary.main, fontWeight: 'bold', mb: 0.5 }}>
            Nota importante sobre responsabilidades
          </Typography>
          <Typography variant="body2" color={colors.text.secondary}>
            Independientemente de tu decisión, <strong>eres el único responsable</strong> del cumplimiento de tus obligaciones como agente aduanal.
            La asociación funciona como entidad auxiliar y <strong>NO sustituye tu responsabilidad individual</strong>.
            Esta autorización puede ser modificada en cualquier momento desde la sección de configuración de tu cuenta.
          </Typography>
        </Box>
      </Box>
    </Paper>

  </DialogContent>

  {/* Acciones del diálogo */}
  <DialogActions sx={{ 
    justifyContent: 'space-between', 
    p: 2.5,
    bgcolor: '#f8f9fa',
    borderTop: `1px solid ${colors.primary.main}20`
  }}>
    <Button 
      onClick={() => handleAssociationConsent(false)}
      variant="contained"
      startIcon={<CloseIcon />}
      sx={{ 
        px: 3,
        fontWeight: 'bold',
        minWidth: 140,
        bgcolor: colors.status.error,
        '&:hover': { bgcolor: colors.primary.dark }
      }}
    >
      No Autorizar
    </Button>
    
    <Button 
      onClick={() => setAssociationDialog(false)}
      variant="outlined"
      sx={{ 
        px: 3,
        fontWeight: 'bold',
        color: colors.primary.main,
        borderColor: colors.primary.main
      }}
    >
      Decidir después
    </Button>
    
    <Button 
      onClick={() => handleAssociationConsent(true)}
      variant="contained"
      startIcon={<CheckIcon />}
      sx={{ 
        px: 3,
        fontWeight: 'bold',
        minWidth: 140,
        bgcolor: colors.status.success,
        '&:hover': { bgcolor: colors.primary.dark }
      }}
    >
      Autorizar
    </Button>
  </DialogActions>
</Dialog>
  );

  // Modal para agregar nueva certificación
 

  // Modal de vista previa
  const PreviewModal = () => (
    <Dialog 
      open={previewModalOpen} 
      onClose={handleClosePreview}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2.5,
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }
      }}
    >
      {previewCert && (
        <>
          <DialogTitle sx={{ 
            background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.primary.main} 100%)`,
            color: 'white',
            py: 2.5,
            px: 3,
            position: 'relative'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  borderRadius: '50%', 
                  width: 48, 
                  height: 48, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <VerifiedIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                    {previewCert.type}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                    {previewCert.number}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  label={previewCert.status}
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                    height: 24,
                    '& .MuiChip-label': { px: 1.5 }
                  }}
                />
                <IconButton onClick={handleClosePreview} size="small" sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ p: 3, bgcolor: '#f8fafc' }}>
            {/* Tarjeta de métricas clave */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: 'white', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'rgba(0,0,0,0.05)'
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Estado
                    </Typography>
                    <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'center' }}>
                      <Chip 
                        label={previewCert.status}
                        size="small"
                        sx={{ 
                          bgcolor: previewCert.status === 'Aceptados' ? '#e8f5e9' : 
                                  previewCert.status === 'En revisión' ? '#fff3e0' :
                                  previewCert.status === 'Información adicional' ? '#e3f2fd' : '#ffebee',
                          color: previewCert.status === 'Aceptados' ? colors.status.success : 
                                 previewCert.status === 'En revisión' ? colors.status.warning :
                                 previewCert.status === 'Información adicional' ? colors.primary.main : colors.status.error,
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                          height: 24
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Emisión
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5, fontSize: '0.85rem' }}>
                      {previewCert.issueDate}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* SECCIÓN DE INFORMACIÓN */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 3, 
                bgcolor: 'white', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'rgba(0,0,0,0.05)',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ 
                px: 2.5, 
                py: 1.5, 
                borderBottom: '1px solid',
                borderColor: 'rgba(0,0,0,0.05)',
                bgcolor: '#f9f9f9'
              }}>
                <Typography variant="subtitle2" sx={{ color: colors.primary.main, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FactCheckIcon sx={{ fontSize: 18 }} />
                  Detalles de la Certificación
                </Typography>
              </Box>
              
              <Box sx={{ p: 2.5 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.3px', mb: 0.5 }}>
                        Subsección
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: '500', fontSize: '0.9rem' }}>
                        {previewCert.subseccion}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.3px', mb: 0.5 }}>
                        Número
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: '500', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {previewCert.number}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.3px', mb: 0.5 }}>
                        Autoridad
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                        {previewCert.autoridad}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.3px', mb: 0.5 }}>
                        Horas
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1rem', color: colors.primary.main }}>
                        {previewCert.horas} hrs
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                    
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.3px', mb: 0.5 }}>
                        Última actualización
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                        {previewCert.lastUpdate}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* Documentos asociados */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 3, 
                bgcolor: 'white', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'rgba(0,0,0,0.05)',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ 
                px: 2.5, 
                py: 1.5, 
                borderBottom: '1px solid',
                borderColor: 'rgba(0,0,0,0.05)',
                bgcolor: '#f9f9f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="subtitle2" sx={{ color: colors.primary.main, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachFileIcon sx={{ fontSize: 18 }} />
                  Documentos ({previewCert.documents})
                </Typography>
              </Box>
              
              <Box sx={{ p: 1.5 }}>
                {previewCert.documentosAsociados.map((doc, index) => (
                  <Box 
                    key={doc.id || index}
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.5,
                      borderRadius: 1,
                      '&:hover': { bgcolor: '#f5f5f5' },
                      borderBottom: index < previewCert.documentosAsociados.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {doc.tipo === 'PDF' ? 
                        <PdfIcon sx={{ color: colors.status.error, fontSize: 20 }} /> : 
                        <FileIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
                      }
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: '500', fontSize: '0.85rem' }}>
                          {doc.nombre}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.65rem' }}>
                          {doc.tamaño} • {doc.fecha}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Tooltip title="Descargar">
                        <IconButton size="small" sx={{ color: colors.primary.main }}>
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Comentarios */}
            {previewCert.comentarios && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  bgcolor: '#fff9e6', 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: '#ffd966',
                  display: 'flex',
                  gap: 1.5
                }}
              >
                <CommentIcon sx={{ color: '#f1c40f', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#b36b00', display: 'block', mb: 0.5, fontWeight: 'bold', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    Observaciones
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f4f00', fontSize: '0.85rem' }}>
                    {previewCert.comentarios}
                  </Typography>
                </Box>
              </Paper>
            )}
          </DialogContent>
          
          <DialogActions sx={{ 
            p: 2, 
            borderTop: '1px solid rgba(0,0,0,0.05)',
            bgcolor: '#f8fafc',
            justifyContent: 'flex-end'
          }}>
            <Button 
              onClick={handleClosePreview}
              variant="contained"
              sx={{ 
                textTransform: 'none',
                bgcolor: colors.primary.main,
                '&:hover': { bgcolor: colors.primary.dark },
                px: 3
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  

  // Modal de confirmación de eliminación
  const DeleteConfirmModal = () => (
    <Dialog 
      open={deleteConfirmModalOpen} 
      onClose={handleCloseDelete}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      {deleteCert && (
        <>
          <DialogTitle sx={{ 
            bgcolor: colors.status.error,
            color: 'white',
            py: 2,
            px: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <DeleteIcon />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Confirmar Eliminación
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDelete} size="small" sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ py: 3, px: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                bgcolor: `${colors.status.error}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <WarningAmberIcon sx={{ fontSize: 40, color: colors.status.error }} />
              </Box>
              <Typography variant="h6" sx={{ color: colors.text.primary, mb: 1 }}>
                ¿Estás seguro de eliminar esta certificación?
              </Typography>
            </Box>

            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 1, 
                  bgcolor: colors.primary.main + '15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <DescriptionIcon sx={{ color: colors.primary.main }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {deleteCert.type}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                    {deleteCert.number}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                    Fecha de emisión
                  </Typography>
                  <Typography variant="body2">{deleteCert.issueDate}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                    Fecha de vencimiento
                  </Typography>
                  <Typography variant="body2">{deleteCert.expirationDate}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                    Subsección
                  </Typography>
                  <Typography variant="body2">{deleteCert.subseccion}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                    Horas
                  </Typography>
                  <Typography variant="body2">{deleteCert.horas} hrs</Typography>
                </Grid>
              </Grid>
            </Paper>

            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Se eliminará {deleteCert.documents} documento asociado
              </Typography>
            </Alert>

            <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', textAlign: 'center' }}>
              Esta certificación y sus documentos serán eliminados permanentemente del sistema.
            </Typography>
          </DialogContent>
          
          <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${colors.primary.main}20` }}>
            <Button 
              onClick={handleCloseDelete} 
              variant="outlined" 
              fullWidth
              sx={{ color: colors.primary.main, borderColor: colors.primary.main }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmDelete} 
              variant="contained" 
              fullWidth
              startIcon={<DeleteIcon />}
              sx={{ bgcolor: colors.status.error, '&:hover': { bgcolor: colors.primary.dark } }}
            >
              Eliminar Permanentemente
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Modal de autorización de la asociación */}
      <AssociationDialog />

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ color: colors.primary.dark, fontWeight: 'bold', mb: 1 }}>
            Mis Certificaciones
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text.secondary }}>
            Gestiona tus certificaciones de formación ética y actualización técnica
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2}>
          {/* Mostrar estado de autorización si ya se decidió */}
          {associationConsent !== null && (
            <Chip
              icon={associationConsent ? <VerifiedUserIcon /> : <WarningAmberIcon />}
              label={`Autorización: ${associationConsent ? 'ACTIVA' : 'INACTIVA'}`}
              color={associationConsent ? "success" : "warning"}
              size="small"
              variant="outlined"
              sx={{ mr: 2 }}
            />
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{ 
              bgcolor: colors.primary.main, 
              '&:hover': { bgcolor: colors.primary.dark } 
            }}
          >
            Nueva Certificación
          </Button>
        </Stack>
      </Box>

      {/* Estadísticas + Filtros en la misma fila */}
<Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'stretch' }}>

  {/* Estadísticas */}
  <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
    {[
      { value: stats.total, label: 'Total', color: colors.primary.main },
      { value: stats.valid, label: 'Vigentes', color: colors.status.success },
      { value: stats.expiring, label: 'Por Vencer', color: colors.status.warning },
      { value: stats.review, label: 'En Revisión', color: colors.status.error }
    ].map((stat) => (
      <Card key={stat.label} sx={{ borderLeft: `4px solid ${stat.color}`, flex: 1 }}>
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Typography variant="h4" sx={{ color: stat.color, fontWeight: 'bold', mb: 0.5 }}>
            {stat.value}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            {stat.label}
          </Typography>
        </CardContent>
      </Card>
    ))}
  </Box>

  {/* Filtros */}
  <Paper elevation={1} sx={{ p: 2, display: 'flex', flexDirection: 'row', gap: 1.5, minWidth: 420, alignItems: 'center' }}>
    <TextField
      fullWidth
      size="small"
      placeholder="Buscar por tipo o número..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: colors.primary.main }} />
          </InputAdornment>
        ),
      }}
    />
    <TextField
      fullWidth
      size="small"
      select
      label="Filtrar por estado"
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FilterIcon sx={{ color: colors.primary.main }} />
          </InputAdornment>
        ),
      }}
    >
      <MenuItem value="all">Todos los estados</MenuItem>
      <MenuItem value="Aceptados">Vigentes</MenuItem>
      <MenuItem value="En revisión">En Revisión</MenuItem>
    </TextField>
  </Paper>

</Box>

      {/* Tabla de certificaciones */}
      <Paper elevation={1}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f7fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark }}>Tipo de Certificación</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark }}>Número</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark }}>Emisión / Vencimiento</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark }}>Progreso</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark }}>Docs</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.primary.dark }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCerts.map((cert) => (
                <TableRow key={cert.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                      {cert.type}
                    </Typography>
                    <Chip 
                      label={cert.subseccion}
                      size="small"
                      sx={{ 
                        mt: 0.5,
                        fontSize: '0.7rem',
                        height: '20px',
                        backgroundColor: cert.subseccion === 'Formación Ética y Cumplimiento' ? colors.accents.blue : colors.secondary.main,
                        color: 'white'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      {cert.number}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.primary.main, display: 'block' }}>
                      {cert.horas} horas
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                        Emisión: {cert.issueDate}
                      </Typography>
                      
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={cert.status}
                      color={getStatusColor(cert.status)}
                      icon={getStatusIcon(cert.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box 
                          sx={{ 
                            height: 8, 
                            width: '100%', 
                            bgcolor: `${colors.primary.main}15`,
                            borderRadius: 4,
                            overflow: 'hidden'
                          }}
                        >
                          <Box 
                            sx={{ 
                              height: '100%', 
                              width: `${cert.progress}%`,
                              bgcolor: colors.status.success
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                        {cert.progress}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography align="center" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                      {cert.documents}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack 
                      direction="row" 
                      spacing={0.5} 
                      justifyContent="center"
                      sx={{
                        '& .MuiIconButton-root': {
                          width: 32,
                          height: 32,
                          backgroundColor: '#f8f9fa',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          }
                        }
                      }}
                    >
                      <Tooltip title="Ver detalles">
                        <IconButton 
                          size="small"
                          onClick={() => handleOpenPreview(cert)}
                          sx={{ 
                            color: colors.primary.main,
                            '&:hover': { backgroundColor: `${colors.primary.main}15` }
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton 
                          size="small"
                          onClick={() => handleOpenEdit(cert)}
                          sx={{ 
                            color: colors.status.warning,
                            '&:hover': { backgroundColor: `${colors.status.warning}15` }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton 
                          size="small"
                          onClick={() => handleOpenDelete(cert)}
                          sx={{ 
                            color: colors.status.error,
                            '&:hover': { backgroundColor: `${colors.status.error}15` }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Información adicional */}
      <Paper elevation={1} sx={{ p: 3, mt: 3, bgcolor: '#f8f9fa' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ color: colors.primary.dark, mb: 2, fontWeight: 'bold' }}>
              Guía Rápida
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              • <strong style={{ color: colors.status.success }}>Aceptados:</strong> Certificación validada y activa<br />
              • <strong style={{ color: colors.status.warning }}>En revisión:</strong> En proceso de validación por el comité<br />
              • <strong style={{ color: colors.accents.blue }}>Formación Ética:</strong> Requisito: 20 horas<br />
              • <strong style={{ color: colors.secondary.main }}>Actualización Técnica:</strong> Requisito: 80 horas
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ color: colors.primary.dark, mb: 2, fontWeight: 'bold' }}>
              Resumen de Horas
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              • <strong style={{ color: colors.accents.blue }}>Formación Ética:</strong> 0/20 horas <CheckCircleIcon sx={{ color: colors.status.success, fontSize: 14, verticalAlign: 'middle', ml: 1 }} /><br />
              • <strong style={{ color: colors.secondary.main }}>Actualización Técnica:</strong> 0/80 horas <CheckCircleIcon sx={{ color: colors.status.success, fontSize: 14, verticalAlign: 'middle', ml: 1 }} /><br />
              • <strong>Total:</strong> 100 horas requeridas <br />
              • <strong style={{ color: colors.status.success }}>Estado general: En proceso</strong>
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Modales */}
    <AddCertificationModal
  open={addModalOpen}
  onClose={handleCloseAdd}
  onSave={handleGuardarNuevaCertificacion}
  nuevaCertificacion={nuevaCertificacion}
  onFieldChange={handleNuevaCertificacionChange}
  onFileChange={handleFileChange}
  onRemoveFile={() => setNuevaCertificacion({...nuevaCertificacion, archivo: null, nombreArchivo: ''})}
  uploading={uploading}
  uploadProgress={uploadProgress}
  saving={saving}
/>
      <PreviewModal />
      <EditCertificationModal
        open={editModalOpen}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
        editForm={editForm}
        onFieldChange={handleEditFormChange}
        colors={colors}
      />
      <DeleteConfirmModal />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Certifications;