import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  crearCertificacionCompleta, 
  obtenerArchivoBlobCertificacion,
  descargarArchivoCertificacion,
  getCertificacionesPorExpediente, 
  eliminarCertificacionCompleta,
  editarCertificacionCompleta
} from '../../../services/certificaciones';
import { useAuth } from "../../../context/AuthContext";
import AddCertificationModal from '../../../components/subirCertificacion/AddCertificationModal';
import { getMiExpediente } from '../../../services/expediente';
import { getTodosApartados } from '../../../services/apartado';
import { getProgramasPorApartadoActivos } from '../../../services/programas';
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

// ========== MODAL DE EDICIÓN ==========
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

// ========== COMPONENTE PRINCIPAL ==========
const Certifications = () => {
  const { user } = useAuth(); 
  const [idExpediente, setIdExpediente] = useState(null);
  const [programasDisponibles, setProgramasDisponibles] = useState([]);
  const [programasActivos, setProgramasActivos] = useState({});
  const [apartados, setApartados] = useState([]);
  const [apartadosActivos, setApartadosActivos] = useState({});
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

  // Estados para modales
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCert, setEditCert] = useState(null);
  const [editForm, setEditForm] = useState({
    tipo: '',
    numero: '',
    subseccion: '',
    fechaEmision: '',
    autoridad: '',
    horasAcreditadas: '',
    descripcion: ''
  });
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [deleteCert, setDeleteCert] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Estado para vista previa de documentos
  const [previewDialog, setPreviewDialog] = useState({
    open: false,
    documento: null,
    nombre: '',
    tipo: '',
    seccion: '',
    loading: false,
    objectUrl: null
  });

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

  // Datos de certificaciones
  const [certifications, setCertifications] = useState([]);

  // ========== FUNCIÓN PARA VERIFICAR SI LA CERTIFICACIÓN ESTÁ ACTIVA ==========
  const isCertificacionActiva = (cert) => {
    // Si no tiene idPrograma, es genérica y siempre está activa para operaciones
    if (!cert.idPrograma) {
      console.log(`🔍 Certificación genérica ${cert.id} - siempre activa para operaciones`);
      return true;
    }
    
    // Verificar si el programa está activo
    const programaActivo = programasActivos[cert.idPrograma];
    console.log(`🔍 Certificación ${cert.id} con programa ${cert.idPrograma} - programa activo: ${programaActivo}`);
    
    return programaActivo === true;
  };

  // ========== EFECTOS ==========
  useEffect(() => {
    const cargar = async () => {
      if (!user?.id) return;
      try {
        const exp = await getMiExpediente();
        setIdExpediente(exp.id);
      } catch (error) {
        console.error('Error cargando expediente:', error);
      }
    };
    cargar();
  }, [user?.id]);

  useEffect(() => {
    const cargarProgramas = async () => {
      if (!user?.instanciaId) return;
      try {
        console.log('🔍 ===== INICIO CARGA DE APARTADOS Y PROGRAMAS =====');
        console.log('🔍 user.instanciaId:', user.instanciaId);
        
        const todos = await getTodosApartados();
        console.log('📋 TODOS LOS APARTADOS:', todos);
        
        setApartados(todos);
        
        // Crear mapa de apartados activos
        const apartadosMap = {};
        todos.forEach(ap => {
          apartadosMap[ap.idApartado] = ap.activo === true;
        });
        setApartadosActivos(apartadosMap);
        console.log('🗺️ MAPA DE APARTADOS ACTIVOS:', apartadosMap);
        
        // Continuar con la carga de programas
        const globalesYDeInstancia = todos.filter(
          a => !a.idInstancia || a.idInstancia === user.instanciaId
        );

        const programas = [];
        const programasMap = {}; // Mapa de programas activos
        
        for (const apartado of globalesYDeInstancia) {
          try {
            const progs = await getProgramasPorApartadoActivos(apartado.idApartado);
            console.log(`📋 Programas del apartado ${apartado.idApartado} (${apartado.nombre}):`, progs);
            
            // Guardar programas en la lista
            programas.push(...progs);
            
            // Crear mapa de programas activos
            progs.forEach(prog => {
              programasMap[prog.id] = prog.activo === true;
            });
            
          } catch (e) {
            console.error(`Error cargando programas del apartado ${apartado.idApartado}:`, e);
          }
        }
        
        console.log('🗺️ MAPA DE PROGRAMAS ACTIVOS:', programasMap);
        setProgramasActivos(programasMap);
        
        // Agregar opción "Otros" al final
        programas.push({ id: null, nombre: 'Otros' });
        setProgramasDisponibles(programas);
        
        console.log('🔍 ===== FIN CARGA DE APARTADOS Y PROGRAMAS =====');
      } catch (error) {
        console.error('Error cargando programas:', error);
      }
    };
    cargarProgramas();
  }, [user?.instanciaId]);

  useEffect(() => {
    const cargarCertificaciones = async () => {
      if (!idExpediente) return;
      try {
        console.log('📦 ===== INICIO CARGA DE CERTIFICACIONES =====');
        console.log('📦 idExpediente:', idExpediente);
        
        const data = await getCertificacionesPorExpediente(idExpediente);
        console.log('📦 CERTIFICACIONES CRUDAS:', data);
        
        // Mostrar cada certificación con su idPrograma
        data.forEach(cert => {
          console.log(`📄 Certificación ID: ${cert.idCertExp}, Programa: ${cert.nombrePrograma || 'Ninguno'}, idPrograma: ${cert.idPrograma}`);
        });
        
        const mapped = data.map(cert => ({
          id: cert.idCertExp,
          idCertificacion: cert.idCertificacion,
          idPrograma: cert.idPrograma,
          idApartado: cert.idApartado,
          type: cert.nombreCertificacion?.toUpperCase() || '—',
          number: `CERT-${cert.idCertExp}`,
          issueDate: cert.fechaEmision ? new Date(cert.fechaEmision).toLocaleDateString('es-MX') : '—',
          issueDateRaw: cert.fechaEmision || '',
          expirationDate: cert.fechaExpiracion || '—',
          status: cert.estado === 'EN_REVISION' ? 'En revisión' :
                  cert.estado === 'VIGENTE' ? 'Aceptados' :
                  cert.estado === 'RECHAZADA' ? 'Rechazado' : cert.estado,
          progress: cert.estado === 'VIGENTE' ? 100 : 30,
          documents: 1,
          lastUpdate: cert.fechaCreacion || '—',
          subseccion: cert.nombrePrograma || 'Genéricas',
          horas: cert.horasAcreditadas || 0,
          tipo: cert.nombreCertificacion || '—',
          autoridad: cert.institucion || '—',
          vigencia: '3 años',
          ambito: 'Nacional',
          comentarios: cert.descripcion || '',
          documentosAsociados: [{
            id: cert.mongoDocumentoId || `d${cert.idCertExp}`,
            nombre: cert.nombreArchivo || 'documento',
            tipo: 'PDF',
            tamaño: '—',
            fecha: cert.fechaEmision || '—'
          }]
        }));
        
        console.log('📋 CERTIFICACIONES MAPEADAS:', mapped);
        
        // Verificar el estado de los programas para cada certificación
        mapped.forEach(cert => {
          if (cert.idPrograma) {
            const estadoPrograma = programasActivos[cert.idPrograma];
            console.log(`🔍 Certificación "${cert.type}" - Programa ID: ${cert.idPrograma}, Estado del programa: ${estadoPrograma ? 'ACTIVO' : 'INACTIVO'}`);
          } else {
            console.log(`🔍 Certificación "${cert.type}" - Sin programa (Genérica)`);
          }
        });
        
        setCertifications(mapped);
        console.log('📦 ===== FIN CARGA DE CERTIFICACIONES =====');
      } catch (error) {
        console.error('Error cargando certificaciones:', error);
      }
    };

    cargarCertificaciones();
  }, [idExpediente, programasActivos]);

  // useEffect para debug - mostrar cuando cambian los programas activos
  useEffect(() => {
    console.log('🔄 ESTADO programasActivos ACTUALIZADO:', programasActivos);
    
    // Verificar cada certificación con los nuevos programas
    certifications.forEach(cert => {
      if (cert.idPrograma) {
        console.log(`📊 Certificación ${cert.id} - Programa ${cert.idPrograma} está ${programasActivos[cert.idPrograma] ? 'ACTIVO' : 'INACTIVO'}`);
      }
    });
  }, [programasActivos, certifications]);

  // ========== FUNCIONES UTILITARIAS ==========
  const detectarTipoArchivo = (nombreArchivo) => {
    const ext = nombreArchivo?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) return 'image';
    if (['docx', 'xlsx', 'pptx'].includes(ext)) return 'office';
    if (['txt', 'csv'].includes(ext)) return 'text';
    if (ext === 'mp4') return 'video';
    if (ext === 'mp3') return 'audio';
    return 'unknown';
  };

  const handleEditFormChange = (campo, valor) => {
    setEditForm({ ...editForm, [campo]: valor });
  };

  // ========== FUNCIONES DE APERTURA/CIERRE ==========
  const handleOpenEdit = (cert) => {
    setEditCert(cert);
    setEditForm({
      tipo: cert.type || '',
      numero: cert.number || '',
      subseccion: cert.subseccion || '',
      fechaEmision: cert.issueDateRaw || '',
      autoridad: cert.autoridad || '',
      horasAcreditadas: cert.horas || '',
      descripcion: cert.comentarios || ''
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

  // ========== FUNCIONES DE VISTA PREVIA ==========
  const handleVerDocumento = async (cert) => {
    console.log('📄 Ver certificación:', cert);
    console.log('📄 ID usado (idCertExp):', cert.id);
    
    if (!cert.id) {
      setSnackbar({
        open: true,
        message: 'La certificación no tiene un ID válido',
        severity: 'error'
      });
      return;
    }

    const nombre = cert.documentosAsociados?.[0]?.nombre || cert.type || 'documento';

    setPreviewDialog({
      open: true,
      documento: null,
      nombre,
      tipo: detectarTipoArchivo(nombre),
      seccion: cert.type,
      loading: true,
      objectUrl: null
    });

    try {
      const blob = await obtenerArchivoBlobCertificacion(cert.id);
      const objectUrl = URL.createObjectURL(blob);
      setPreviewDialog(prev => ({ ...prev, loading: false, objectUrl }));
    } catch (error) {
      console.error('❌ Error al cargar vista previa:', error);
      setSnackbar({
        open: true,
        message: error.response?.status === 404 
          ? 'Archivo no encontrado en el servidor' 
          : error.response?.data?.message || 'No se pudo cargar la vista previa',
        severity: 'error'
      });
      setPreviewDialog(prev => ({ ...prev, loading: false }));
    }
  };

  const handleClosePreview = () => {
    if (previewDialog.objectUrl) {
      URL.revokeObjectURL(previewDialog.objectUrl);
    }
    setPreviewDialog({
      open: false,
      documento: null,
      nombre: '',
      tipo: '',
      seccion: '',
      loading: false,
      objectUrl: null
    });
  };

  // ========== FUNCIONES CRUD ==========
  const handleGuardarNuevaCertificacion = async () => {
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
      const idInstancia = user?.instanciaId;
      const idPrograma = nuevaCertificacion.subseccion !== 'otros' 
        ? nuevaCertificacion.subseccion
        : null;

      const nuevaCert = await crearCertificacionCompleta(
        {
          nombre: nuevaCertificacion.tipoDocumento,
          institucion: nuevaCertificacion.institucion,
          horas: parseInt(nuevaCertificacion.horas),
          fecha: nuevaCertificacion.fecha,
          nombreArchivo: nuevaCertificacion.nombreArchivo,
          descripcion: ''
        },
        idInstancia,
        idExpediente,
        idPrograma,
        nuevaCertificacion.archivo 
      );

      const nuevaCertLocal = {
        id: nuevaCert.idCertExp || certifications.length + 1,
        idCertificacion: nuevaCert.idCertificacion,
        idPrograma: idPrograma,
        idApartado: nuevaCert.idApartado,
        type: nuevaCertificacion.tipoDocumento.toUpperCase(),
        number: `CERT-${new Date().getFullYear()}-${String(certifications.length + 1).padStart(3, '0')}`,
        issueDate: new Date(nuevaCertificacion.fecha).toLocaleDateString('es-MX'),
        expirationDate: nuevaCert.fechaExpiracion || '—',
        status: 'En revisión',
        progress: 30,
        documents: 1,
        lastUpdate: new Date().toLocaleDateString('es-MX'),
        subseccion: nuevaCert.nombrePrograma || 'Genéricas',
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

    try {
      await editarCertificacionCompleta({
        idCertificacion: editCert.idCertificacion,
        idCertExp: editCert.id,
        nombre: editForm.tipo,
        institucion: editForm.autoridad,
        horas: parseInt(editForm.horasAcreditadas),
        fechaEmision: editForm.fechaEmision,
        descripcion: editForm.descripcion ?? '',
      });

      setCertifications(certifications.map(c =>
        c.id === editCert.id
          ? {
              ...c,
              type: editForm.tipo.toUpperCase(),
              autoridad: editForm.autoridad,
              subseccion: editForm.subseccion,
              issueDate: editForm.fechaEmision,
              horas: parseInt(editForm.horasAcreditadas),
              comentarios: editForm.descripcion,
            }
          : c
      ));

      setSnackbar({
        open: true,
        message: 'Certificación actualizada correctamente',
        severity: 'success'
      });

      handleCloseEdit();

    } catch (error) {
      console.error('Error al actualizar:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al actualizar la certificación',
        severity: 'error'
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCert) return;
    try {
      await eliminarCertificacionCompleta(deleteCert.id, deleteCert.idCertificacion);

      setCertifications(certifications.filter(c => c.id !== deleteCert.id));

      setSnackbar({
        open: true,
        message: 'Certificación eliminada correctamente',
        severity: 'success'
      });

      handleCloseDelete();
    } catch (error) {
      console.error('Error al eliminar:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al eliminar la certificación',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAssociationConsent = (consent) => {
    setAssociationConsent(consent);
    setAssociationDialog(false);
  };

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'El archivo no puede ser mayor a 10MB',
          severity: 'error'
        });
        return;
      }

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

      simulateUpload();
    }
  };

  const handleNuevaCertificacionChange = (campo) => (event) => {
    setNuevaCertificacion({
      ...nuevaCertificacion,
      [campo]: event.target.value
    });
  };

  // ========== ESTADÍSTICAS ==========
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

  // MOSTRAR TODAS las certificaciones, sin filtrar por estado de programa
  const certificacionesVisibles = certifications;

  // Solo contar inactivas para el banner informativo
  const certificacionesInactivas = certifications.filter(cert => 
    cert.idPrograma && programasActivos[cert.idPrograma] === false
  ).length;

  const filteredCerts = certificacionesVisibles.filter(cert => {
    const matchesSearch = 
      cert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || cert.status === filter;
    return matchesSearch && matchesFilter;
  });

  // ========== COMPONENTES INTERNOS ==========
  const TextPreview = ({ objectUrl }) => {
    const [text, setText] = useState('');
    useEffect(() => {
      fetch(objectUrl)
        .then(r => r.text())
        .then(setText)
        .catch(() => setText('No se pudo leer el archivo.'));
    }, [objectUrl]);
    return (
      <pre style={{ 
        whiteSpace: 'pre-wrap', 
        wordBreak: 'break-word', 
        fontFamily: 'monospace', 
        fontSize: '0.85rem', 
        margin: 0, 
        color: '#333' 
      }}>
        {text}
      </pre>
    );
  };

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

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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

  const PreviewModal = () => {
    if (!previewDialog.open) return null;
    
    return (
      <Dialog 
        open={previewDialog.open} 
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { height: '90vh', maxHeight: '90vh', display: 'flex', flexDirection: 'column' } }}
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary.main}20`, py: 1.5, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <DescriptionIcon sx={{ color: colors.primary.main }} />
              <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: '600', fontSize: '1rem' }}>
                {previewDialog.nombre}
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleClosePreview}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>

          {/* Loading */}
          {previewDialog.loading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 2 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>Cargando vista previa...</Typography>
            </Box>
          )}

          {/* Sin archivo */}
          {!previewDialog.loading && !previewDialog.objectUrl && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 2, p: 3 }}>
              <DescriptionIcon sx={{ fontSize: 80, color: colors.primary.main }} />
              <Typography variant="h6" sx={{ color: colors.text.primary }}>{previewDialog.nombre}</Typography>
              <Alert severity="info" sx={{ maxWidth: '400px' }}>
                <Typography variant="body2">Vista previa no disponible para este documento.</Typography>
              </Alert>
            </Box>
          )}

          {/* PDF */}
          {!previewDialog.loading && previewDialog.objectUrl && previewDialog.tipo === 'pdf' && (
            <iframe 
              src={previewDialog.objectUrl} 
              style={{ width: '100%', flex: 1, border: 'none', minHeight: 0 }} 
              title={previewDialog.nombre} 
            />
          )}

          {/* Imagen */}
          {!previewDialog.loading && previewDialog.objectUrl && previewDialog.tipo === 'image' && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, p: 2, backgroundColor: '#f0f0f0', overflow: 'auto' }}>
              <img 
                src={previewDialog.objectUrl} 
                alt={previewDialog.nombre} 
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }} 
              />
            </Box>
          )}

          {/* Office */}
          {!previewDialog.loading && previewDialog.objectUrl && previewDialog.tipo === 'office' && (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, gap: 2 }}>
              <DescriptionIcon sx={{ fontSize: 60, color: colors.primary.main }} />
              <Typography variant="body1" sx={{ color: colors.text.primary }}>{previewDialog.nombre}</Typography>
              <Alert severity="info" sx={{ maxWidth: '400px' }}>
                <Typography variant="body2">
                  Los archivos Office no se pueden previsualizar directamente. Usa el botón <strong>Descargar</strong> para abrirlo.
                </Typography>
              </Alert>
            </Box>
          )}

          {/* TXT / CSV */}
          {!previewDialog.loading && previewDialog.objectUrl && previewDialog.tipo === 'text' && (
            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
              <TextPreview objectUrl={previewDialog.objectUrl} />
            </Box>
          )}

          {/* Video */}
          {!previewDialog.loading && previewDialog.objectUrl && previewDialog.tipo === 'video' && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: '#000' }}>
              <video src={previewDialog.objectUrl} controls style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </Box>
          )}

          {/* Audio */}
          {!previewDialog.loading && previewDialog.objectUrl && previewDialog.tipo === 'audio' && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, p: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <DescriptionIcon sx={{ fontSize: 80, color: colors.primary.main, mb: 2 }} />
                <Typography variant="body1" sx={{ mb: 3, color: colors.text.primary }}>{previewDialog.nombre}</Typography>
                <audio src={previewDialog.objectUrl} controls style={{ width: '100%', minWidth: '300px' }} />
              </Box>
            </Box>
          )}

        </DialogContent>

        <DialogActions sx={{ px: 3, py: 1.5, borderTop: `1px solid ${colors.primary.main}20`, flexShrink: 0 }}>
          <Button onClick={handleClosePreview} variant="outlined" sx={{ textTransform: 'none', color: colors.primary.main, borderColor: colors.primary.main }}>
            Cerrar
          </Button>
          {previewDialog.objectUrl && (
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => {
                const a = document.createElement('a');
                a.href = previewDialog.objectUrl;
                a.download = previewDialog.nombre;
                a.click();
              }}
              sx={{ textTransform: 'none', bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}
            >
              Descargar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  };

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

  // ========== RENDER ==========
  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <AssociationDialog />

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

      <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'stretch' }}>
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

      {/* Banner informativo */}
      {certificacionesInactivas > 0 && (
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
          icon={<InfoIcon />}
        >
          <Typography variant="body2">
            <strong>{certificacionesInactivas}</strong> certificaciones pertenecen a programas que actualmente están desactivados.
            Estas certificaciones se muestran con fondo amarillo y solo permiten ver el documento.
          </Typography>
        </Alert>
      )}

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
              {filteredCerts.length > 0 ? (
                filteredCerts.map((cert) => {
                  const certificacionActiva = isCertificacionActiva(cert);
                  
                  console.log(`🔄 Renderizando certificación ${cert.id} - Activa para operaciones: ${certificacionActiva}`);
                  
                  return (
                    <TableRow 
                      key={cert.id} 
                      hover
                      sx={{
                        backgroundColor: !certificacionActiva ? '#fff9e6' : 'inherit',
                        '&:hover': {
                          backgroundColor: !certificacionActiva ? '#fff2cc' : '#f5f5f5'
                        }
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                            {cert.type}
                          </Typography>
                          {!certificacionActiva && (
                            <Chip 
                              label="PROGRAMA DESACTIVADO"
                              size="small"
                              icon={<WarningAmberIcon sx={{ fontSize: '0.7rem !important' }} />}
                              sx={{ 
                                mt: 0.5,
                                fontSize: '0.6rem',
                                height: '18px',
                                backgroundColor: colors.status.warning,
                                color: 'white',
                                '& .MuiChip-icon': {
                                  color: 'white',
                                  fontSize: '0.7rem'
                                }
                              }}
                            />
                          )}
                        </Box>
                        <Chip 
                          label={cert.subseccion}
                          size="small"
                          sx={{ 
                            mt: 0.5,
                            fontSize: '0.7rem',
                            height: '20px',
                            backgroundColor: cert.subseccion === 'Genéricas' 
                              ? colors.text.secondary
                              : cert.subseccion === 'Formación Ética y Cumplimiento' 
                                ? colors.accents.blue 
                                : colors.secondary.main,
                            color: 'white',
                            opacity: !certificacionActiva ? 0.7 : 1
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
                          {/* VER - Siempre habilitado */}
                          <Tooltip title="Ver detalles">
                            <IconButton 
                              size="small"
                              onClick={() => handleVerDocumento(cert)}
                              sx={{ 
                                color: colors.primary.main,
                                '&:hover': { backgroundColor: `${colors.primary.main}15` }
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          {/* EDITAR - Deshabilitado si la certificación no está activa */}
                          <Tooltip title={!certificacionActiva ? "No disponible - Programa desactivado" : "Editar"}>
                            <span>
                              <IconButton 
                                size="small"
                                onClick={() => certificacionActiva && handleOpenEdit(cert)}
                                disabled={!certificacionActiva}
                                sx={{ 
                                  color: colors.status.warning,
                                  '&:hover': { backgroundColor: `${colors.status.warning}15` },
                                  '&.Mui-disabled': { 
                                    opacity: 0.3,
                                    backgroundColor: '#f0f0f0'
                                  }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          
                          {/* ELIMINAR - Deshabilitado si la certificación no está activa */}
                          <Tooltip title={!certificacionActiva ? "No disponible - Programa desactivado" : "Eliminar"}>
                            <span>
                              <IconButton 
                                size="small"
                                onClick={() => certificacionActiva && handleOpenDelete(cert)}
                                disabled={!certificacionActiva}
                                sx={{ 
                                  color: colors.status.error,
                                  '&:hover': { backgroundColor: `${colors.status.error}15` },
                                  '&.Mui-disabled': { 
                                    opacity: 0.3,
                                    backgroundColor: '#f0f0f0'
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <InfoIcon sx={{ fontSize: 48, color: colors.text.secondary, mb: 2 }} />
                      <Typography variant="h6" sx={{ color: colors.text.primary, mb: 1 }}>
                        No hay certificaciones
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Comienza agregando una nueva certificación usando el botón "Nueva Certificación"
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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
        programasDisponibles={programasDisponibles}
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