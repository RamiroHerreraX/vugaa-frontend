import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Snackbar
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

const Certifications = () => {
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

  // Estados para modales
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewCert, setPreviewCert] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCert, setEditCert] = useState(null);
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
  const [certifications, setCertifications] = useState([
    { 
      id: 1, 
      type: 'CURSO DE ÉTICA PROFESIONAL Y CÓDIGO DE CONDUCTA', 
      number: 'CET-2025-001', 
      issueDate: '20/02/2026', 
      expirationDate: '20/02/2028', 
      status: 'En revisión',
      progress: 100,
      documents: 1,
      lastUpdate: '24/02/2026',
      subseccion: 'Formación Ética y Cumplimiento',
      horas: 20,
      tipo: 'Curso de Ética',
      autoridad: 'Instituto de Ética Empresarial',
      vigencia: '3 años',
      ambito: 'Nacional',
      comentarios: 'Curso completado satisfactoriamente',
      historial: [
        { fecha: '15/06/2025', accion: 'Finalización', usuario: 'Usuario' },
        { fecha: '20/06/2025', accion: 'Certificación emitida', usuario: 'Instituto' }
      ],
      documentosAsociados: [
        { id: 'd1', nombre: 'certificado_etica_profesional.pdf', tipo: 'PDF', tamaño: '0.8 MB', fecha: '15/06/2025' }
      ]
    },
    { 
      id: 2, 
      type: 'DIPLOMADO EN COMERCIO EXTERIOR Y LEGISLACIÓN ADUANERA', 
      number: 'DCE-2025-002', 
      issueDate: '10/02/2026', 
      expirationDate: '10/02/2028', 
      status: 'En revisión',
      progress: 100,
      documents: 1,
      lastUpdate: '24/02/2026',
      subseccion: 'Actualización Técnica y Aduanera',
      horas: 80,
      tipo: 'Diplomado',
      autoridad: 'Universidad Aduanera de México',
      vigencia: '3 años',
      ambito: 'Internacional',
      comentarios: 'Diplomado completado con excelencia',
      historial: [
        { fecha: '10/02/2025', accion: 'Finalización', usuario: 'Usuario' },
        { fecha: '15/02/2025', accion: 'Certificación emitida', usuario: 'Universidad' }
      ],
      documentosAsociados: [
        { id: 'd2', nombre: 'diplomado_comercio_exterior.pdf', tipo: 'PDF', tamaño: '1.5 MB', fecha: '10/02/2025' }
      ]
    }
  ]);

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
  const handleGuardarNuevaCertificacion = () => {
    if (nuevaCertificacion.tipoDocumento && nuevaCertificacion.archivo && nuevaCertificacion.horas && nuevaCertificacion.institucion && nuevaCertificacion.subseccion) {
      
      const nuevaCert = {
        id: certifications.length + 1,
        type: nuevaCertificacion.tipoDocumento.toUpperCase(),
        number: `CERT-${new Date().getFullYear()}-${String(certifications.length + 1).padStart(3, '0')}`,
        issueDate: new Date(nuevaCertificacion.fecha).toLocaleDateString('es-MX'),
        expirationDate: new Date(new Date(nuevaCertificacion.fecha).setFullYear(new Date(nuevaCertificacion.fecha).getFullYear() + 3)).toLocaleDateString('es-MX'),
        status: 'En revisión',
        progress: 30,
        documents: 1,
        lastUpdate: new Date().toLocaleDateString('es-MX'),
        subseccion: nuevaCertificacion.subseccion === 'formacionEtica' ? 'Formación Ética y Cumplimiento' : 'Actualización Técnica y Aduanera',
        horas: parseInt(nuevaCertificacion.horas),
        tipo: nuevaCertificacion.tipoDocumento,
        autoridad: nuevaCertificacion.institucion,
        vigencia: '3 años',
        ambito: 'Nacional',
        comentarios: 'Certificación en proceso de validación',
        historial: [
          { fecha: new Date().toLocaleDateString('es-MX'), accion: 'Creación', usuario: 'Usuario' }
        ],
        documentosAsociados: [
          { 
            id: `d${Date.now()}`, 
            nombre: nuevaCertificacion.nombreArchivo, 
            tipo: nuevaCertificacion.archivo?.type?.includes('pdf') ? 'PDF' : 'Documento', 
            tamaño: `${Math.round(nuevaCertificacion.archivo?.size / 1024 / 1024 * 10) / 10} MB`, 
            fecha: new Date().toLocaleDateString('es-MX') 
          }
        ]
      };

      setCertifications([...certifications, nuevaCert]);
      
     

      handleCloseAdd();
    } else {
      setSnackbar({
        open: true,
        message: 'Por favor complete todos los campos requeridos',
        severity: 'warning'
      });
    }
  };

  // Función para guardar cambios en edición
  const handleSaveEdit = () => {
    // Simular guardado
    
    handleCloseEdit();
  };

  // Función para confirmar eliminación
  const handleConfirmDelete = () => {
    if (deleteCert) {
      setCertifications(certifications.filter(c => c.id !== deleteCert.id));
      
      handleCloseDelete();
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
        <Grid container spacing={3} sx={{ mb: 2 }}>
          {/* COLUMNA IZQUIERDA - ACEPTAR */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3}
              sx={{ 
                border: `2px solid ${colors.status.success}`,
                borderRadius: 2,
                overflow: 'hidden',
                height: '100%'
              }}
            >
              <Box sx={{ 
                bgcolor: colors.status.success, 
                p: 2,
                textAlign: 'center'
              }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                  <CheckIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  SI ACEPTAS LA AUTORIZACIÓN
                </Typography>
              </Box>

              <Box sx={{ p: 2.5 }}>
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
          </Grid>

          {/* COLUMNA DERECHA - RECHAZAR */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3}
              sx={{ 
                border: `2px solid ${colors.status.error}`,
                borderRadius: 2,
                overflow: 'hidden',
                height: '100%'
              }}
            >
              <Box sx={{ 
                bgcolor: colors.status.error, 
                p: 2,
                textAlign: 'center'
              }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                  <CloseIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  SI RECHAZAS LA AUTORIZACIÓN
                </Typography>
              </Box>

              <Box sx={{ p: 2.5 }}>
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
          </Grid>
        </Grid>

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
  const AddCertificationModal = () => (
    <Dialog 
      open={addModalOpen} 
      onClose={handleCloseAdd}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: colors.primary.main,
        color: 'white',
        py: 2,
        px: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AddIcon />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Agregar Nueva Certificación
          </Typography>
        </Box>
        <IconButton onClick={handleCloseAdd} size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ py: 3, px: 3 }}>
        <Grid container spacing={2.5}>
          {/* Subsección */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
              Subsección <span style={{ color: colors.status.error }}>*</span>
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={nuevaCertificacion.subseccion}
              onChange={handleNuevaCertificacionChange('subseccion')}
              required
            >
              <MenuItem value="formacionEtica">Formación Ética y Cumplimiento</MenuItem>
              <MenuItem value="actualizacionTecnica">Actualización Técnica y Aduanera</MenuItem>
              <MenuItem value="otros">Otros</MenuItem>
            </TextField>
          </Grid>

          {/* Nombre de la Certificación */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
              Nombre de la Certificación <span style={{ color: colors.status.error }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={nuevaCertificacion.tipoDocumento}
              onChange={handleNuevaCertificacionChange('tipoDocumento')}
              placeholder="Ej: Curso de Ética Profesional"
              required
            />
          </Grid>

          {/* Institución */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
              Institución <span style={{ color: colors.status.error }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={nuevaCertificacion.institucion}
              onChange={handleNuevaCertificacionChange('institucion')}
              placeholder="Ej: Instituto de Ética Empresarial"
              required
            />
          </Grid>

          {/* Horas */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
              Horas <span style={{ color: colors.status.error }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="number"
              size="small"
              value={nuevaCertificacion.horas}
              onChange={handleNuevaCertificacionChange('horas')}
              placeholder="Ej: 20"
              required
              inputProps={{ min: 1 }}
            />
          </Grid>

          {/* Fecha */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
              Fecha de Expedición
            </Typography>
            <TextField
              fullWidth
              type="date"
              size="small"
              value={nuevaCertificacion.fecha}
              onChange={handleNuevaCertificacionChange('fecha')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Archivo */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
              Archivo <span style={{ color: colors.status.error }}>*</span>
            </Typography>
            
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3,
                border: `2px dashed ${nuevaCertificacion.archivo ? colors.status.success : colors.primary.main}40`,
                borderRadius: 2,
                backgroundColor: nuevaCertificacion.archivo ? '#f8f9fa' : 'transparent',
                transition: 'all 0.2s',
                cursor: 'pointer',
                textAlign: 'center',
                '&:hover': {
                  borderColor: colors.primary.main,
                  backgroundColor: '#f8f9fa'
                }
              }}
              onClick={() => document.getElementById('add-file-upload').click()}
            >
              <input
                id="add-file-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              
              {nuevaCertificacion.archivo ? (
                <>
                  <CheckCircleIcon sx={{ color: colors.status.success, fontSize: 40, mb: 1 }} />
                  <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: '500' }}>
                    {nuevaCertificacion.nombreArchivo}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mt: 1 }}>
                    Archivo seleccionado correctamente
                  </Typography>
                  {uploading && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 6, borderRadius: 3 }} />
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                        {uploadProgress}% completado
                      </Typography>
                    </Box>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNuevaCertificacion({...nuevaCertificacion, archivo: null, nombreArchivo: ''});
                    }}
                    sx={{ mt: 1, color: colors.status.error, borderColor: colors.status.error }}
                  >
                    Quitar archivo
                  </Button>
                </>
              ) : (
                <>
                  <CloudUploadIcon sx={{ color: colors.primary.main, fontSize: 40, mb: 1 }} />
                  <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: '500' }}>
                    Haz clic para seleccionar un archivo
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mt: 1 }}>
                    Formatos: PDF, DOC, DOCX, JPG, PNG (Máx. 10MB)
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>

          {/* Información */}
          <Grid item xs={12}>
            <Alert severity="info" sx={{ backgroundColor: `${colors.primary.main}10`, fontSize: '0.85rem' }}>
              <Typography variant="body2">
                <strong>Nota:</strong> La certificación se agregará en estado "En revisión" hasta que sea validada por el comité.
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${colors.primary.main}20` }}>
        <Button 
          onClick={handleCloseAdd}
          variant="outlined"
          sx={{ 
            textTransform: 'none',
            color: colors.primary.main,
            borderColor: colors.primary.main
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleGuardarNuevaCertificacion}
          variant="contained"
          disabled={!nuevaCertificacion.tipoDocumento || !nuevaCertificacion.archivo || !nuevaCertificacion.horas || !nuevaCertificacion.institucion || !nuevaCertificacion.subseccion}
          sx={{ 
            textTransform: 'none',
            bgcolor: colors.primary.main,
            '&:hover': { bgcolor: colors.primary.dark },
            '&.Mui-disabled': {
              bgcolor: '#e0e0e0'
            }
          }}
        >
          Agregar Certificación
        </Button>
      </DialogActions>
    </Dialog>
  );

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

  // Modal de edición
  const EditModal = () => (
    <Dialog 
      open={editModalOpen} 
      onClose={handleCloseEdit}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      {editCert && (
        <>
          <DialogTitle sx={{ 
            bgcolor: colors.status.warning,
            color: 'white',
            py: 2,
            px: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <EditIcon />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Editar Certificación
              </Typography>
            </Box>
            <IconButton onClick={handleCloseEdit} size="small" sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ py: 3, px: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tipo de certificación"
                  defaultValue={editCert.type}
                  size="small"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número de certificación"
                  defaultValue={editCert.number}
                  size="small"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Subsección"
                  defaultValue={editCert.subseccion}
                  size="small"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha de emisión"
                  type="date"
                  defaultValue={editCert.issueDate.split('/').reverse().join('-')}
                  size="small"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
               
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Autoridad emisora"
                  defaultValue={editCert.autoridad}
                  size="small"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Horas"
                  type="number"
                  defaultValue={editCert.horas}
                  size="small"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Comentarios"
                  defaultValue={editCert.comentarios}
                  multiline
                  rows={3}
                  size="small"
                  margin="normal"
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${colors.primary.main}20` }}>
            <Button onClick={handleCloseEdit} variant="outlined" sx={{ color: colors.primary.main, borderColor: colors.primary.main }}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} variant="contained" sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}>
              Guardar Cambios
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

      {/* Estadísticas */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={7}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Card sx={{ borderLeft: `4px solid ${colors.primary.main}`, height: '100%' }}>
                <CardContent>
                  <Typography variant="h3" sx={{ color: colors.primary.main, fontWeight: 'bold', mb: 0.5 }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Total Certificaciones
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Card sx={{ borderLeft: `4px solid ${colors.status.success}`, height: '100%' }}>
                <CardContent>
                  <Typography variant="h3" sx={{ color: colors.status.success, fontWeight: 'bold', mb: 0.5 }}>
                    {stats.valid}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Vigentes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Card sx={{ borderLeft: `4px solid ${colors.status.warning}`, height: '100%' }}>
                <CardContent>
                  <Typography variant="h3" sx={{ color: colors.status.warning, fontWeight: 'bold', mb: 0.5 }}>
                    {stats.expiring}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Por Vencer
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Card sx={{ borderLeft: `4px solid ${colors.status.error}`, height: '100%' }}>
                <CardContent>
                  <Typography variant="h3" sx={{ color: colors.status.error, fontWeight: 'bold', mb: 0.5 }}>
                    {stats.review}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    En Revisión
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Búsqueda y filtros */}
        <Grid item xs={12} md={5}>
          <Paper elevation={1} sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

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
      <AddCertificationModal />
      <PreviewModal />
      <EditModal />
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