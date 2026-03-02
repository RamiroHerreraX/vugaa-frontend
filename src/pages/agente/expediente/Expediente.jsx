import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Snackbar,
  Tooltip
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
  Send as SendIcon,
  School as SchoolIcon,
  Update as UpdateIcon,
  Info as InfoIcon,
  FilePresent as FilePresentIcon
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

const Expediente = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [expanded, setExpanded] = useState('panel1');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Estado para certificados con subsecciones y horas - COMPLETAMENTE VACÍO
  const [certificadosData, setCertificadosData] = useState({
    formacionEtica: {
      titulo: 'Formación Ética y Cumplimiento',
      horasRequeridas: 20,
      horasAcumuladas: 0,
      certificaciones: []
    },
    actualizacionTecnica: {
      titulo: 'Actualización Técnica y Aduanera',
      horasRequeridas: 80,
      horasAcumuladas: 0,
      certificaciones: []
    }
  });

  const [formData, setFormData] = useState({
    nombre: '',
    curp: '',
    rfc: '',
    fechaNacimiento: '',
    lugarNacimiento: '',
    nacionalidad: '',
    estadoCivil: '',
    domicilioFiscal: '',
    domicilioParticular: '',
    telefono: '',
    email: ''
  });

  // Estados para Cumplimiento Organizacional - COMPLETAMENTE VACÍO
  const [cumplimientoData, setCumplimientoData] = useState({
    seguridadCadenaSuministro: {
      descripcion: '',
      vigencia: '',
      documento: null,
      estado: 'pendiente',
      fechaRevision: null,
      nombreDocumento: ''
    },
    antisobornos: {
      descripcion: '',
      vigencia: '',
      documento: null,
      estado: 'pendiente',
      fechaRevision: null,
      nombreDocumento: ''
    }
  });

  // Estados para otras secciones - COMPLETAMENTE VACÍO
  const [documentosData, setDocumentosData] = useState({
    documentacion: [],
    profesional: [],
    legal: [],
    laboral: [],
    seguridad: [],
    digital: [],
    otros: []
  });

  const [addDialog, setAddDialog] = useState({
    open: false,
    sectionId: '',
    subseccion: '',
    tipoDocumento: '',
    archivo: null,
    nombreArchivo: '',
    fecha: new Date().toISOString().split('T')[0],
    horas: '',
    institucion: '',
    itemName: ''
  });

  const [validacionDialog, setValidacionDialog] = useState({
    open: false,
    apartado: '',
    titulo: '',
    fecha: ''
  });

  const [uploadDialog, setUploadDialog] = useState({
    open: false,
    tipo: '',
    titulo: '',
    archivo: null,
    nombreArchivo: ''
  });

  const [estadosValidacion, setEstadosValidacion] = useState({});

  // Estado para vista previa de documentos
  const [previewDialog, setPreviewDialog] = useState({
    open: false,
    documento: null,
    nombre: '',
    tipo: '',
    seccion: ''
  });

  // Estado para confirmación de eliminación
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    seccion: '',
    subseccion: '',
    documentoId: null,
    tipo: '',
    nombre: '',
    horas: 0,
    itemName: '',
    itemIndex: null
  });

  // Definición de documentos únicos (solo se permite uno) - SOLO PARA LÓGICA INTERNA
  const documentosUnicos = [
    'Identificación oficial (INE, pasaporte)',
    'Comprobante de domicilio (reciente)',
    'Acta de nacimiento',
    'Fotografía digital reciente',
    'CV Actualizado',
    'Constancia de Situación Fiscal',
    'Opinión de Cumplimiento',
    'Certificado de Antecedentes',
    'Declaración Patrimonial',
    'Constancia de No Inhabilitación',
    'Firma Digital',
    'Certificado Digital SAT',
    'Tokens de Seguridad'
  ];

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  // Función para abrir el diálogo de agregar documento
  const handleOpenAddDialog = (sectionId, itemName = '', subseccion = '') => {
    setAddDialog({
      open: true,
      sectionId: sectionId,
      subseccion: subseccion,
      tipoDocumento: '',
      archivo: null,
      nombreArchivo: '',
      fecha: new Date().toISOString().split('T')[0],
      horas: '',
      institucion: '',
      itemName: itemName
    });
  };

  // Función para manejar la selección de archivo
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

      setAddDialog({
        ...addDialog,
        archivo: file,
        nombreArchivo: file.name
      });
    }
  };

  // Función para reiniciar estado de validación de una sección
  const reiniciarEstadoValidacion = (sectionId) => {
    setEstadosValidacion(prev => {
      const newState = { ...prev };
      delete newState[sectionId];
      return newState;
    });
  };

  // Función para guardar nuevo documento en cualquier sección
  const handleGuardarDocumento = () => {
    if (addDialog.archivo) {
      const nuevoDocumento = {
        id: Date.now(),
        nombre: addDialog.itemName || addDialog.tipoDocumento,
        nombreArchivo: addDialog.nombreArchivo,
        archivo: addDialog.archivo,
        fecha: addDialog.fecha,
        tipo: addDialog.tipoDocumento,
        institucion: addDialog.institucion,
        horas: addDialog.horas ? parseInt(addDialog.horas) : 0,
        estado: 'completo',
        fechaSubida: new Date().toLocaleDateString('es-MX')
      };

      // Actualizar según la sección
      const sectionId = addDialog.sectionId;
      const itemName = addDialog.itemName;
      
      // Reiniciar estado de validación para esta sección si existe
      reiniciarEstadoValidacion(sectionId);
      
      if (sectionId === 'certificados') {
        // Manejar certificados (múltiples documentos permitidos)
        if (addDialog.subseccion === 'formacionEtica') {
          setCertificadosData(prev => ({
            ...prev,
            formacionEtica: {
              ...prev.formacionEtica,
              certificaciones: [...prev.formacionEtica.certificaciones, nuevoDocumento],
              horasAcumuladas: prev.formacionEtica.horasAcumuladas + (addDialog.horas ? parseInt(addDialog.horas) : 0)
            }
          }));
        } else if (addDialog.subseccion === 'actualizacionTecnica') {
          setCertificadosData(prev => ({
            ...prev,
            actualizacionTecnica: {
              ...prev.actualizacionTecnica,
              certificaciones: [...prev.actualizacionTecnica.certificaciones, nuevoDocumento],
              horasAcumuladas: prev.actualizacionTecnica.horasAcumuladas + (addDialog.horas ? parseInt(addDialog.horas) : 0)
            }
          }));
        }
      } else if (sectionId === 'cumplimiento_organizacional') {
        // Manejar cumplimiento organizacional (únicos por tipo)
        if (addDialog.subseccion === 'seguridadCadenaSuministro') {
          setCumplimientoData(prev => ({
            ...prev,
            seguridadCadenaSuministro: {
              ...prev.seguridadCadenaSuministro,
              documento: nuevoDocumento.archivo,
              estado: 'pendiente',
              fechaRevision: nuevoDocumento.fechaSubida,
              nombreDocumento: nuevoDocumento.nombreArchivo
            }
          }));
        } else if (addDialog.subseccion === 'antisobornos') {
          setCumplimientoData(prev => ({
            ...prev,
            antisobornos: {
              ...prev.antisobornos,
              documento: nuevoDocumento.archivo,
              estado: 'pendiente',
              fechaRevision: nuevoDocumento.fechaSubida,
              nombreDocumento: nuevoDocumento.nombreArchivo
            }
          }));
        }
      } else {
        // Otras secciones
        // Verificar si es un documento único (solo para lógica interna)
        const esUnico = documentosUnicos.includes(itemName);
        
        if (esUnico) {
          // Para documentos únicos, reemplazar el existente
          const documentosExistentes = documentosData[sectionId]?.filter(doc => doc.nombre === itemName) || [];
          
          if (documentosExistentes.length > 0) {
            // Preguntar si desea reemplazar
            if (window.confirm(`Ya existe un documento para "${itemName}". ¿Desea reemplazarlo?`)) {
              // Eliminar el documento existente
              const nuevosDocumentos = documentosData[sectionId]?.filter(doc => doc.nombre !== itemName) || [];
              // Agregar el nuevo
              setDocumentosData(prev => ({
                ...prev,
                [sectionId]: [...nuevosDocumentos, nuevoDocumento]
              }));
            } else {
              setSnackbar({
                open: true,
                message: 'Operación cancelada',
                severity: 'info'
              });
              setAddDialog({
                open: false,
                sectionId: '',
                subseccion: '',
                tipoDocumento: '',
                archivo: null,
                nombreArchivo: '',
                fecha: new Date().toISOString().split('T')[0],
                horas: '',
                institucion: '',
                itemName: ''
              });
              return;
            }
          } else {
            // No existe documento, agregar normalmente
            setDocumentosData(prev => ({
              ...prev,
              [sectionId]: [...(prev[sectionId] || []), nuevoDocumento]
            }));
          }
        } else {
          // Para documentos múltiples, siempre agregar
          setDocumentosData(prev => ({
            ...prev,
            [sectionId]: [...(prev[sectionId] || []), nuevoDocumento]
          }));
        }

        // Actualizar el status del item en informacionComplementaria
        const updatedSections = informacionComplementaria.map(section => {
          if (section.id === sectionId) {
            return {
              ...section,
              items: section.items.map(item => {
                if (item.name === addDialog.itemName) {
                  return { ...item, status: 'completo' };
                }
                return item;
              })
            };
          }
          return section;
        });
        setInformacionComplementaria(updatedSections);
      }

      setSnackbar({
        open: true,
        message: ` Documento agregado correctamente`,
        severity: 'success'
      });

      // Cerrar el diálogo
      setAddDialog({
        open: false,
        sectionId: '',
        subseccion: '',
        tipoDocumento: '',
        archivo: null,
        nombreArchivo: '',
        fecha: new Date().toISOString().split('T')[0],
        horas: '',
        institucion: '',
        itemName: ''
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Por favor seleccione un archivo',
        severity: 'warning'
      });
    }
  };

  // Función para ver documento
  const handleVerDocumento = (documento, seccion) => {
    setPreviewDialog({
      open: true,
      documento: documento.archivo || null,
      nombre: documento.nombreArchivo || documento.documento || 'documento.pdf',
      tipo: seccion,
      seccion: seccion
    });
  };

  // Función para descargar documento
  const handleDescargarDocumento = (documento) => {
    setSnackbar({
      open: true,
      message: `Descargando ${documento.nombreArchivo || documento.documento}...`,
      severity: 'info'
    });
    
    setTimeout(() => {
      setSnackbar({
        open: true,
        message: ` Documento descargado correctamente`,
        severity: 'success'
      });
    }, 1000);
  };

  // Función para eliminar documento
  const handleEliminarDocumento = (seccion, documentoId, documento, itemName, horas = 0, index = null) => {
    setDeleteDialog({
      open: true,
      seccion: seccion,
      documentoId: documentoId,
      tipo: 'documento',
      nombre: documento.nombreArchivo || documento.documento || documento.nombre,
      horas: horas,
      itemName: itemName,
      itemIndex: index
    });
  };

  // Función para confirmar eliminación
  const handleConfirmarEliminacion = () => {
    const { seccion, documentoId, horas, itemName, itemIndex } = deleteDialog;

    if (seccion === 'formacionEtica') {
      setCertificadosData(prev => {
        const certificacion = prev.formacionEtica.certificaciones.find(c => c.id === documentoId);
        return {
          ...prev,
          formacionEtica: {
            ...prev.formacionEtica,
            certificaciones: prev.formacionEtica.certificaciones.filter(c => c.id !== documentoId),
            horasAcumuladas: prev.formacionEtica.horasAcumuladas - (certificacion?.horas || 0)
          }
        };
      });
      // Reiniciar estado de validación para certificados
      reiniciarEstadoValidacion('certificados');
    } else if (seccion === 'actualizacionTecnica') {
      setCertificadosData(prev => {
        const certificacion = prev.actualizacionTecnica.certificaciones.find(c => c.id === documentoId);
        return {
          ...prev,
          actualizacionTecnica: {
            ...prev.actualizacionTecnica,
            certificaciones: prev.actualizacionTecnica.certificaciones.filter(c => c.id !== documentoId),
            horasAcumuladas: prev.actualizacionTecnica.horasAcumuladas - (certificacion?.horas || 0)
          }
        };
      });
      // Reiniciar estado de validación para certificados
      reiniciarEstadoValidacion('certificados');
    } else if (seccion === 'seguridadCadenaSuministro' || seccion === 'antisobornos') {
      setCumplimientoData(prev => ({
        ...prev,
        [seccion]: {
          ...prev[seccion],
          documento: null,
          estado: 'pendiente',
          fechaRevision: null,
          nombreDocumento: ''
        }
      }));
      // Reiniciar estado de validación para cumplimiento organizacional
      reiniciarEstadoValidacion('cumplimiento_organizacional');
    } else {
      // Otras secciones
      setDocumentosData(prev => ({
        ...prev,
        [seccion]: (prev[seccion] || []).filter((_, idx) => idx !== itemIndex)
      }));

      // Reiniciar estado de validación para esta sección
      reiniciarEstadoValidacion(seccion);

      // Verificar si quedan documentos para este item
      const documentosRestantes = documentosData[seccion]?.filter((_, idx) => idx !== itemIndex).filter(doc => doc.nombre === itemName) || [];
      
      // Actualizar el status del item en informacionComplementaria
      const updatedSections = informacionComplementaria.map(section => {
        if (section.id === seccion && itemName) {
          return {
            ...section,
            items: section.items.map(item => {
              if (item.name === itemName) {
                // Si no quedan documentos, poner status pendiente
                return { ...item, status: documentosRestantes.length === 0 ? 'pendiente' : 'completo' };
              }
              return item;
            })
          };
        }
        return section;
      });
      setInformacionComplementaria(updatedSections);
    }

    setSnackbar({
      open: true,
      message: ' Documento eliminado correctamente',
      severity: 'success'
    });

    setDeleteDialog({
      open: false,
      seccion: '',
      subseccion: '',
      documentoId: null,
      tipo: '',
      nombre: '',
      horas: 0,
      itemName: '',
      itemIndex: null
    });
  };

  // Funciones para Cumplimiento Organizacional
  const handleDescripcionChange = (tipo, valor) => {
    const nuevoEstado = {
      ...cumplimientoData,
      [tipo]: {
        ...cumplimientoData[tipo],
        descripcion: valor
      }
    };
    setCumplimientoData(nuevoEstado);
  };

  const handleVigenciaChange = (tipo, valor) => {
    const nuevoEstado = {
      ...cumplimientoData,
      [tipo]: {
        ...cumplimientoData[tipo],
        vigencia: valor
      }
    };
    setCumplimientoData(nuevoEstado);
  };

  const handleOpenUploadDialog = (tipo, titulo) => {
    setUploadDialog({
      open: true,
      tipo: tipo,
      titulo: titulo,
      archivo: null,
      nombreArchivo: ''
    });
  };

  const handleCumplimientoFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setSnackbar({ open: true, message: 'El archivo no puede ser mayor a 10MB', severity: 'error' });
        return;
      }

      const tiposPermitidos = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!tiposPermitidos.includes(file.type)) {
        setSnackbar({ open: true, message: 'Formato no permitido. Use PDF, DOC o DOCX', severity: 'error' });
        return;
      }

      setUploadDialog({ ...uploadDialog, archivo: file, nombreArchivo: file.name });
    }
  };

  const handleGuardarDocumentoCumplimiento = () => {
    if (uploadDialog.archivo) {
      const tipo = uploadDialog.tipo;
      const nuevoDocumento = {
        id: Date.now(),
        nombreArchivo: uploadDialog.nombreArchivo,
        archivo: uploadDialog.archivo,
        fechaSubida: new Date().toLocaleDateString('es-MX')
      };

      setCumplimientoData(prev => ({
        ...prev,
        [tipo]: {
          ...prev[tipo],
          documento: nuevoDocumento.archivo,
          estado: 'pendiente',
          fechaRevision: nuevoDocumento.fechaSubida,
          nombreDocumento: nuevoDocumento.nombreArchivo
        }
      }));

      // Reiniciar estado de validación para cumplimiento organizacional
      reiniciarEstadoValidacion('cumplimiento_organizacional');

      setSnackbar({
        open: true,
        message: ` Documento "${uploadDialog.nombreArchivo}" subido correctamente`,
        severity: 'success'
      });

      setUploadDialog({ open: false, tipo: '', titulo: '', archivo: null, nombreArchivo: '' });
    }
  };

  const handleVerDocumentoCumplimiento = (tipo) => {
    const doc = cumplimientoData[tipo];
    if (doc && doc.documento) {
      setPreviewDialog({
        open: true,
        documento: doc.documento,
        nombre: doc.nombreDocumento || 'documento.pdf',
        tipo: tipo
      });
    }
  };

  const handleEliminarDocumentoCumplimiento = (tipo) => {
    setDeleteDialog({
      open: true,
      seccion: tipo,
      tipo: 'cumplimiento',
      nombre: cumplimientoData[tipo].nombreDocumento || 'documento'
    });
  };

  // Función para abrir el diálogo de validación
  const handleAbrirValidacionDialog = (apartado, titulo) => {
    const fechaActual = new Date().toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    setValidacionDialog({
      open: true,
      apartado,
      titulo,
      fecha: fechaActual
    });
  };

  const handleCerrarValidacionDialog = () => {
    setValidacionDialog({ open: false, apartado: '', titulo: '', fecha: '' });
  };

  const handleConfirmarValidacion = () => {
    const { apartado, fecha } = validacionDialog;
    
    setEstadosValidacion(prev => ({
      ...prev,
      [apartado]: { enviado: true, fechaEnvio: fecha, estado: 'enviado' }
    }));

    setSnackbar({
      open: true,
      message: ` Documentos de ${validacionDialog.titulo} enviados`,
      severity: 'success'
    });

    handleCerrarValidacionDialog();
  };

  const obtenerEstadoValidacion = (apartado) => {
    return estadosValidacion[apartado] || { enviado: false, fechaEnvio: null, estado: 'pendiente' };
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Lista de apartados - TODOS CON STATUS PENDIENTE
  const [informacionComplementaria, setInformacionComplementaria] = useState([
  
    { 
      id: 'documentacion',
      title: 'DOCUMENTACIÓN OFICIAL',
      icon: <DescriptionIcon />,
      items: [
        { name: 'Identificación oficial (INE, pasaporte)', status: 'pendiente' },
        { name: 'Comprobante de domicilio (reciente)', status: 'pendiente' },
        { name: 'Acta de nacimiento', status: 'pendiente' },
        { name: 'Fotografía digital reciente', status: 'pendiente' }
      ]
    },
    { 
      id: 'profesional',
      title: 'INFORMACIÓN PROFESIONAL',
      icon: <WorkIcon />,
      items: [
        { name: 'CV Actualizado', status: 'pendiente' },
        { name: 'Títulos Profesionales', status: 'pendiente' },
        { name: 'Cursos y Certificaciones', status: 'pendiente' }
      ]
    },
    { 
      id: 'legal',
      title: 'DOCUMENTACIÓN LEGAL Y FISCAL',
      icon: <BusinessIcon />,
      items: [
        { name: 'Constancia de Situación Fiscal', status: 'pendiente' },
        { name: 'Opinión de Cumplimiento', status: 'pendiente' },
        { name: 'Poderes Notariales', status: 'pendiente' }
      ]
    },
    { 
      id: 'laboral',
      title: 'INFORMACIÓN LABORAL',
      icon: <WorkIcon />,
      items: [
        { name: 'Contrato Laboral', status: 'pendiente' },
        { name: 'Cartas Recomendación', status: 'pendiente' },
        { name: 'Historial Laboral', status: 'pendiente' }
      ]
    },
    { 
      id: 'seguridad',
      title: 'INFORMACIÓN DE SEGURIDAD Y CUMPLIMIENTO',
      icon: <SecurityIcon />,
      items: [
        { name: 'Certificado de Antecedentes', status: 'pendiente' },
        { name: 'Declaración Patrimonial', status: 'pendiente' },
        { name: 'Constancia de No Inhabilitación', status: 'pendiente' }
      ]
    },
    { 
      id: 'digital',
      title: 'DOCUMENTACIÓN DIGITAL',
      icon: <CloudUploadIcon />,
      items: [
        { name: 'Firma Digital', status: 'pendiente' },
        { name: 'Certificado Digital SAT', status: 'pendiente' },
        { name: 'Tokens de Seguridad', status: 'pendiente' }
      ]
    },
      { 
      id: 'certificados',
      title: 'CERTIFICADOS DE NIVEL GREMIAL',
      icon: <DescriptionIcon />,
      items: []
    },
    { 
      id: 'cumplimiento_organizacional',
      title: 'CUMPLIMIENTO ORGANIZACIONAL',
      icon: <VerifiedIcon />,
      items: []
    },
    { 
      id: 'otros',
      title: 'OTROS ELEMENTOS RECOMENDADOS',
      icon: <AddIcon />,
      items: [
        { name: 'Pólizas de Seguro', status: 'pendiente' },
        { name: 'Referencias Bancarias', status: 'pendiente' },
        { name: 'Cartas de Presentación', status: 'pendiente' }
      ]
    }
  ]);

  const calculateCompliance = () => {
    // Calcular cumplimiento basado en certificados
    const totalHorasFormacion = certificadosData.formacionEtica.horasRequeridas;
    const horasFormacion = certificadosData.formacionEtica.horasAcumuladas;
    const porcentajeFormacion = totalHorasFormacion > 0 ? (horasFormacion / totalHorasFormacion) * 25 : 0;
    
    const totalHorasTecnica = certificadosData.actualizacionTecnica.horasRequeridas;
    const horasTecnica = certificadosData.actualizacionTecnica.horasAcumuladas;
    const porcentajeTecnica = totalHorasTecnica > 0 ? (horasTecnica / totalHorasTecnica) * 25 : 0;
    
    // Documentos de cumplimiento (10% cada uno)
    const porcentajeSeguridad = cumplimientoData.seguridadCadenaSuministro.documento ? 10 : 0;
    const porcentajeAntisobornos = cumplimientoData.antisobornos.documento ? 10 : 0;
    
    // Otras secciones (30% restante)
    const otrasSecciones = informacionComplementaria.filter(s => s.id !== 'certificados' && s.id !== 'cumplimiento_organizacional');
    let totalItems = 0;
    let itemsCompletados = 0;
    
    otrasSecciones.forEach(section => {
      section.items.forEach(item => {
        totalItems++;
        // Verificar si hay documentos cargados para este item
        const tieneDocumento = documentosData[section.id]?.some(doc => doc.nombre === item.name);
        if (tieneDocumento || item.status === 'completo') {
          itemsCompletados++;
        }
      });
    });
    
    const porcentajeOtros = totalItems > 0 ? (itemsCompletados / totalItems) * 30 : 0;
    
    return Math.min(100, Math.round(porcentajeFormacion + porcentajeTecnica + porcentajeSeguridad + porcentajeAntisobornos + porcentajeOtros));
  };

  const compliance = calculateCompliance();

  // Función para verificar si un documento existe
  const tieneDocumento = (sectionId, itemName) => {
    if (sectionId === 'certificados' || sectionId === 'cumplimiento_organizacional') {
      return false;
    }
    return documentosData[sectionId]?.some(doc => doc.nombre === itemName) || false;
  };

  // Función para obtener los documentos de un item
  const getDocumentosPorItem = (sectionId, itemName) => {
    return documentosData[sectionId]?.filter(doc => doc.nombre === itemName) || [];
  };

  // Función para verificar si un documento es único (solo para lógica interna)
  const esDocumentoUnico = (itemName) => {
    return documentosUnicos.includes(itemName);
  };

  // Función para contar documentos totales en certificados
  const certificadosTienenDocumentos = () => {
    return certificadosData.formacionEtica.certificaciones.length > 0 || certificadosData.actualizacionTecnica.certificaciones.length > 0;
  };

  // Función para contar documentos totales en cumplimiento organizacional
  const cumplimientoTieneDocumentos = () => {
    return cumplimientoData.seguridadCadenaSuministro.documento !== null || cumplimientoData.antisobornos.documento !== null;
  };

  // Función para renderizar Certificados
  const renderCertificados = () => {
    const section = informacionComplementaria.find(s => s.id === 'certificados');
    const estadoValidacion = obtenerEstadoValidacion(section.id);
    
    const formacionCompleta = certificadosData.formacionEtica.horasAcumuladas >= certificadosData.formacionEtica.horasRequeridas;
    const tecnicaCompleta = certificadosData.actualizacionTecnica.horasAcumuladas >= certificadosData.actualizacionTecnica.horasRequeridas;
    const progresoFormacion = certificadosData.formacionEtica.horasRequeridas > 0 
      ? Math.min(100, Math.round((certificadosData.formacionEtica.horasAcumuladas / certificadosData.formacionEtica.horasRequeridas) * 100))
      : 0;
    const progresoTecnica = certificadosData.actualizacionTecnica.horasRequeridas > 0
      ? Math.min(100, Math.round((certificadosData.actualizacionTecnica.horasAcumuladas / certificadosData.actualizacionTecnica.horasRequeridas) * 100))
      : 0;
    
    const tieneDocumentos = certificadosTienenDocumentos();
    
    return (
      <Accordion 
        key={section.id}
        expanded={expanded === section.id}
        onChange={handleAccordionChange(section.id)}
        sx={{ 
          mb: 2,
          border: '2px solid',
          borderColor: (formacionCompleta && tecnicaCompleta) ? colors.status.success : colors.accents.blue,
          borderRadius: '8px !important',
          boxShadow: `0 2px 12px ${(formacionCompleta && tecnicaCompleta) ? colors.status.success + '20' : colors.accents.blue + '20'}`,
          '&:before': { display: 'none' }
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            backgroundColor: expanded === section.id ? '#e3f2fd' : 'white',
            borderRadius: '8px',
            minHeight: '70px'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: (formacionCompleta && tecnicaCompleta) ? '#e8f5e9' : '#e3f2fd',
              color: (formacionCompleta && tecnicaCompleta) ? colors.status.success : colors.accents.blue
            }}>
              {section.icon}
            </Box>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ fontWeight: '700', color: colors.text.primary, fontSize: '1rem', mb: 0.5 }}>
                {section.title}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                {formacionCompleta && tecnicaCompleta ? 'Completado' : 'En progreso'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Formación Ética / Actualización Técnica">
                <Chip 
                  label={`${certificadosData.formacionEtica.certificaciones.length + certificadosData.actualizacionTecnica.certificaciones.length} certs`}
                  size="small"
                  color={formacionCompleta && tecnicaCompleta ? "success" : "primary"}
                  sx={{ height: '24px', fontSize: '0.75rem', fontWeight: '600' }}
                />
              </Tooltip>
              {estadoValidacion.enviado && (
                <Chip icon={<CheckCircleIcon />} label="Enviado" size="small" color="info" sx={{ height: '24px' }} />
              )}
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 3, pb: 3 }}>
          
          {estadoValidacion.enviado && (
            <Alert severity="info" sx={{ mb: 3, backgroundColor: '#e3f2fd' }} icon={<VerifiedIcon />}>
              <Typography variant="body2"><strong>Documentos enviados</strong></Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>Los documentos de esta sección se enviaron el {estadoValidacion.fechaEnvio}</Typography>
            </Alert>
          )}
          
          {/* Subsección 1: Formación Ética y Cumplimiento */}
          <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 2, border: `2px solid ${formacionCompleta ? colors.status.success + '80' : colors.accents.blue + '80'}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: '600', color: colors.text.primary, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SchoolIcon sx={{ color: formacionCompleta ? colors.status.success : colors.accents.blue }} />
                Formación Ética y Cumplimiento
                {formacionCompleta && <Chip icon={<CheckCircleIcon />} label="Completado" size="small" color="success" sx={{ ml: 1, height: '24px' }} />}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Horas: <strong>{certificadosData.formacionEtica.horasAcumuladas}/{certificadosData.formacionEtica.horasRequeridas}</strong>
                  </Typography>
                </Box>
                <Box sx={{ width: '100px' }}>
                  <Tooltip title={`${progresoFormacion}% completado`}>
                    <LinearProgress variant="determinate" value={progresoFormacion} sx={{ height: 8, borderRadius: 4, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: formacionCompleta ? colors.status.success : colors.accents.blue } }} />
                  </Tooltip>
                </Box>
              </Box>
            </Box>
            
            {certificadosData.formacionEtica.certificaciones.length > 0 ? (
              <List dense sx={{ py: 0, mb: 2 }}>
                {certificadosData.formacionEtica.certificaciones.map((cert) => (
                  <ListItem key={cert.id} sx={{ py: 1.5, px: 2, mb: 1, borderRadius: 1, backgroundColor: '#fff', border: `1px solid ${colors.primary.main}20`, '&:hover': { backgroundColor: '#f8f9fa', borderColor: colors.primary.main } }}
                    secondaryAction={
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Ver documento">
                          <IconButton size="small" onClick={() => handleVerDocumento(cert, 'certificados')} sx={{ color: colors.primary.main, backgroundColor: `${colors.primary.main}15`, '&:hover': { backgroundColor: `${colors.primary.main}25` } }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Descargar">
                          <IconButton size="small" onClick={() => handleDescargarDocumento(cert)} sx={{ color: colors.status.success, backgroundColor: '#e8f5e9', '&:hover': { backgroundColor: '#c8e6c9' } }}>
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton size="small" onClick={() => handleEliminarDocumento('formacionEtica', cert.id, cert, cert.nombre, cert.horas)} sx={{ color: colors.status.error, backgroundColor: '#ffebee', '&:hover': { backgroundColor: '#ffcdd2' } }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 44 }}>
                      <CheckCircleIcon sx={{ color: colors.status.success, fontSize: '1.5rem', backgroundColor: '#e8f5e9', borderRadius: '50%', p: 0.5 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="body2" sx={{ fontWeight: '600' }}>{cert.nombre}</Typography>
                          <Chip label={`${cert.horas} hrs`} size="small" sx={{ height: '20px', fontSize: '0.7rem', backgroundColor: colors.accents.blue, color: 'white' }} />
                        </Box>
                      }
                      secondary={<Typography variant="caption" sx={{ color: colors.text.secondary }}>{cert.institucion} • {new Date(cert.fecha).toLocaleDateString('es-MX')} • Subido: {cert.fechaSubida}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="info" sx={{ mb: 3 }} icon={<InfoIcon />}>
                No hay certificaciones cargadas en esta sección. Usa el botón "Agregar Certificación" para comenzar.
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, backgroundColor: '#f8f9fa', borderRadius: 2, border: `1px solid ${colors.primary.main}20` }}>
              <Button startIcon={<AddIcon />} size="small" variant="outlined" onClick={() => handleOpenAddDialog('certificados', '', 'formacionEtica')} sx={{ fontSize: '0.85rem', textTransform: 'none', px: 3, color: colors.primary.main, borderColor: colors.primary.main }}>
                Agregar Certificación
              </Button>
            </Box>
          </Paper>

          {/* Subsección 2: Actualización Técnica y Aduanera */}
          <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2, border: `2px solid ${tecnicaCompleta ? colors.status.success + '80' : colors.secondary.main + '80'}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: '600', color: colors.text.primary, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <UpdateIcon sx={{ color: tecnicaCompleta ? colors.status.success : colors.secondary.main }} />
                Actualización Técnica y Aduanera
                {tecnicaCompleta && <Chip icon={<CheckCircleIcon />} label="Completado" size="small" color="success" sx={{ ml: 1, height: '24px' }} />}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Horas: <strong>{certificadosData.actualizacionTecnica.horasAcumuladas}/{certificadosData.actualizacionTecnica.horasRequeridas}</strong>
                  </Typography>
                </Box>
                <Box sx={{ width: '100px' }}>
                  <Tooltip title={`${progresoTecnica}% completado`}>
                    <LinearProgress variant="determinate" value={progresoTecnica} sx={{ height: 8, borderRadius: 4, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: tecnicaCompleta ? colors.status.success : colors.secondary.main } }} />
                  </Tooltip>
                </Box>
              </Box>
            </Box>
            
            {certificadosData.actualizacionTecnica.certificaciones.length > 0 ? (
              <List dense sx={{ py: 0, mb: 2 }}>
                {certificadosData.actualizacionTecnica.certificaciones.map((cert) => (
                  <ListItem key={cert.id} sx={{ py: 1.5, px: 2, mb: 1, borderRadius: 1, backgroundColor: '#fff', border: `1px solid ${colors.primary.main}20`, '&:hover': { backgroundColor: '#f8f9fa', borderColor: colors.primary.main } }}
                    secondaryAction={
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Ver documento">
                          <IconButton size="small" onClick={() => handleVerDocumento(cert, 'certificados')} sx={{ color: colors.primary.main, backgroundColor: `${colors.primary.main}15`, '&:hover': { backgroundColor: `${colors.primary.main}25` } }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Descargar">
                          <IconButton size="small" onClick={() => handleDescargarDocumento(cert)} sx={{ color: colors.status.success, backgroundColor: '#e8f5e9', '&:hover': { backgroundColor: '#c8e6c9' } }}>
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton size="small" onClick={() => handleEliminarDocumento('actualizacionTecnica', cert.id, cert, cert.nombre, cert.horas)} sx={{ color: colors.status.error, backgroundColor: '#ffebee', '&:hover': { backgroundColor: '#ffcdd2' } }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 44 }}>
                      <CheckCircleIcon sx={{ color: colors.status.success, fontSize: '1.5rem', backgroundColor: '#e8f5e9', borderRadius: '50%', p: 0.5 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="body2" sx={{ fontWeight: '600' }}>{cert.nombre}</Typography>
                          <Chip label={`${cert.horas} hrs`} size="small" sx={{ height: '20px', fontSize: '0.7rem', backgroundColor: colors.secondary.main, color: 'white' }} />
                        </Box>
                      }
                      secondary={<Typography variant="caption" sx={{ color: colors.text.secondary }}>{cert.institucion} • {new Date(cert.fecha).toLocaleDateString('es-MX')} • Subido: {cert.fechaSubida}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="info" sx={{ mb: 3 }} icon={<InfoIcon />}>
                No hay certificaciones cargadas en esta sección. Usa el botón "Agregar Certificación" para comenzar.
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, backgroundColor: '#f8f9fa', borderRadius: 2, border: `1px solid ${colors.primary.main}20` }}>
              <Button startIcon={<AddIcon />} size="small" variant="outlined" onClick={() => handleOpenAddDialog('certificados', '', 'actualizacionTecnica')} sx={{ fontSize: '0.85rem', textTransform: 'none', px: 3, color: colors.primary.main, borderColor: colors.primary.main }}>
                Agregar Certificación
              </Button>
            </Box>
          </Paper>
          
          <Box sx={{ mt: 3, p: 2.5, backgroundColor: '#f8f9fa', borderRadius: 2, border: `1px solid ${colors.primary.main}20` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: '600', color: colors.text.primary, mb: 0.5 }}>
                  Validación de Certificaciones
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  Envíe las certificaciones para su registro
                </Typography>
              </Box>
              
              <Button variant="contained" startIcon={<SendIcon />} onClick={() => handleAbrirValidacionDialog(section.id, section.title)}
                disabled={estadoValidacion.enviado || !tieneDocumentos}
                sx={{ textTransform: 'none', px: 3, py: 1, bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark }, '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#9e9e9e' } }}>
                {estadoValidacion.enviado ? 'Enviado' : 'Enviar'}
              </Button>
            </Box>
            
            {!tieneDocumentos && !estadoValidacion.enviado && (
              <Alert severity="warning" sx={{ mt: 2, py: 1 }}>
                <Typography variant="body2">Agregue al menos una certificación antes de enviar</Typography>
              </Alert>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  // Función para renderizar Cumplimiento Organizacional
  const renderCumplimientoOrganizacional = () => {
    const section = informacionComplementaria.find(s => s.id === 'cumplimiento_organizacional');
    const estadoValidacion = obtenerEstadoValidacion(section.id);
    
    const seguridadCompleta = cumplimientoData.seguridadCadenaSuministro.documento !== null;
    const antisobornosCompleto = cumplimientoData.antisobornos.documento !== null;
    
    const tieneDocumentos = cumplimientoTieneDocumentos();
    
    return (
      <Accordion 
        key={section.id}
        expanded={expanded === section.id}
        onChange={handleAccordionChange(section.id)}
        sx={{ 
          mb: 2,
          border: '2px solid',
          borderColor: (seguridadCompleta && antisobornosCompleto) ? colors.status.success : colors.status.warning,
          borderRadius: '8px !important',
          boxShadow: `0 2px 12px ${(seguridadCompleta && antisobornosCompleto) ? colors.status.success + '20' : colors.status.warning + '20'}`,
          '&:before': { display: 'none' }
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            backgroundColor: expanded === section.id ? '#f1f8e9' : 'white',
            borderRadius: '8px',
            minHeight: '70px'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: (seguridadCompleta && antisobornosCompleto) ? '#e8f5e9' : '#fff3e0',
              color: (seguridadCompleta && antisobornosCompleto) ? colors.status.success : colors.status.warning
            }}>
              {section.icon}
            </Box>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ fontWeight: '700', color: colors.text.primary, fontSize: '1rem', mb: 0.5 }}>
                {section.title}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Seguridad / Antisobornos">
                <Chip label={`${(seguridadCompleta ? 1 : 0) + (antisobornosCompleto ? 1 : 0)}/2`} size="small" color={(seguridadCompleta && antisobornosCompleto) ? "success" : "warning"} sx={{ height: '24px', fontSize: '0.75rem', fontWeight: '600' }} />
              </Tooltip>
              {estadoValidacion.enviado && <Chip icon={<CheckCircleIcon />} label="Enviado" size="small" color="info" sx={{ height: '24px' }} />}
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 3, pb: 3 }}>
          
          {estadoValidacion.enviado && (
            <Alert severity="info" sx={{ mb: 3, backgroundColor: '#e3f2fd' }} icon={<VerifiedIcon />}>
              <Typography variant="body2"><strong>Documentos enviados</strong></Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>Los documentos de esta sección se enviaron el {estadoValidacion.fechaEnvio}</Typography>
            </Alert>
          )}
          
          <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2, border: `2px solid ${seguridadCompleta ? colors.status.success + '80' : colors.primary.main + '20'}` }}>
            <Typography variant="h6" sx={{ fontWeight: '600', color: colors.text.primary, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <SecurityIcon sx={{ color: seguridadCompleta ? colors.status.success : colors.text.secondary }} />
              Sistema de seguridad de Cadena de Suministros
              {seguridadCompleta && <Chip icon={<CheckCircleIcon />} label="Completado" size="small" color="success" sx={{ ml: 1, height: '24px' }} />}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={4} label="Descripción del Sistema" value={cumplimientoData.seguridadCadenaSuministro.descripcion} onChange={(e) => handleDescripcionChange('seguridadCadenaSuministro', e.target.value)} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} helperText="Describa el sistema de gestión de seguridad para la cadena de suministro" />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField fullWidth type="date" label="Fecha de Vigencia" value={cumplimientoData.seguridadCadenaSuministro.vigencia || ''} onChange={(e) => handleVigenciaChange('seguridadCadenaSuministro', e.target.value)} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} helperText="Fecha hasta la cual es válido el sistema" />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                  {cumplimientoData.seguridadCadenaSuministro.documento ? (
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
                        <FilePresentIcon sx={{ color: colors.status.success, fontSize: '1.2rem' }} />
                        <Typography variant="body2" sx={{ color: colors.text.primary, fontWeight: '500', flex: 1 }}>
                          {cumplimientoData.seguridadCadenaSuministro.nombreDocumento}
                        </Typography>
                        <Chip label="PENDIENTE" size="small" color="warning" sx={{ height: '20px', fontSize: '0.7rem' }} />
                      </Box>
                      {cumplimientoData.seguridadCadenaSuministro.fechaRevision && (
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 2 }}>
                          Subido: {cumplimientoData.seguridadCadenaSuministro.fechaRevision}
                        </Typography>
                      )}
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Ver documento">
                          <IconButton size="small" onClick={() => handleVerDocumentoCumplimiento('seguridadCadenaSuministro')} sx={{ color: colors.primary.main, backgroundColor: `${colors.primary.main}15`, '&:hover': { backgroundColor: `${colors.primary.main}25` } }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Descargar">
                          <IconButton size="small" onClick={() => handleDescargarDocumento({ nombreArchivo: cumplimientoData.seguridadCadenaSuministro.nombreDocumento })} sx={{ color: colors.status.success, backgroundColor: '#e8f5e9', '&:hover': { backgroundColor: '#c8e6c9' } }}>
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton size="small" onClick={() => handleEliminarDocumentoCumplimiento('seguridadCadenaSuministro')} sx={{ color: colors.status.error, backgroundColor: '#ffebee', '&:hover': { backgroundColor: '#ffcdd2' } }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Box>
                  ) : (
                    <Button fullWidth startIcon={<CloudUploadIcon />} variant="outlined" onClick={() => handleOpenUploadDialog('seguridadCadenaSuministro', 'Sistema de seguridad de Cadena de Suministros')} sx={{ textTransform: 'none', py: 1.5, color: colors.primary.main, borderColor: colors.primary.main }}>
                      Cargar Documento del Sistema
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, border: `2px solid ${antisobornosCompleto ? colors.status.success + '80' : colors.primary.main + '20'}` }}>
            <Typography variant="h6" sx={{ fontWeight: '600', color: colors.text.primary, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <GavelIcon sx={{ color: antisobornosCompleto ? colors.status.success : colors.text.secondary }} />
              Políticas Antisobornos
              {antisobornosCompleto && <Chip icon={<CheckCircleIcon />} label="Completado" size="small" color="success" sx={{ ml: 1, height: '24px' }} />}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={4} label="Descripción de las Políticas" value={cumplimientoData.antisobornos.descripcion} onChange={(e) => handleDescripcionChange('antisobornos', e.target.value)} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} helperText="Describa las políticas y procedimientos antisoborno" />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField fullWidth type="date" label="Fecha de Vigencia" value={cumplimientoData.antisobornos.vigencia || ''} onChange={(e) => handleVigenciaChange('antisobornos', e.target.value)} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} helperText="Fecha hasta la cual son válidas las políticas" />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                  {cumplimientoData.antisobornos.documento ? (
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
                        <FilePresentIcon sx={{ color: colors.status.success, fontSize: '1.2rem' }} />
                        <Typography variant="body2" sx={{ color: colors.text.primary, fontWeight: '500', flex: 1 }}>
                          {cumplimientoData.antisobornos.nombreDocumento}
                        </Typography>
                        <Chip label="PENDIENTE" size="small" color="warning" sx={{ height: '20px', fontSize: '0.7rem' }} />
                      </Box>
                      {cumplimientoData.antisobornos.fechaRevision && (
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 2 }}>
                          Subido: {cumplimientoData.antisobornos.fechaRevision}
                        </Typography>
                      )}
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Ver documento">
                          <IconButton size="small" onClick={() => handleVerDocumentoCumplimiento('antisobornos')} sx={{ color: colors.primary.main, backgroundColor: `${colors.primary.main}15`, '&:hover': { backgroundColor: `${colors.primary.main}25` } }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Descargar">
                          <IconButton size="small" onClick={() => handleDescargarDocumento({ nombreArchivo: cumplimientoData.antisobornos.nombreDocumento })} sx={{ color: colors.status.success, backgroundColor: '#e8f5e9', '&:hover': { backgroundColor: '#c8e6c9' } }}>
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton size="small" onClick={() => handleEliminarDocumentoCumplimiento('antisobornos')} sx={{ color: colors.status.error, backgroundColor: '#ffebee', '&:hover': { backgroundColor: '#ffcdd2' } }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Box>
                  ) : (
                    <Button fullWidth startIcon={<CloudUploadIcon />} variant="outlined" onClick={() => handleOpenUploadDialog('antisobornos', 'Políticas Antisobornos')} sx={{ textTransform: 'none', py: 1.5, color: colors.primary.main, borderColor: colors.primary.main }}>
                      Cargar Documento de Políticas
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          <Box sx={{ mt: 3, p: 2.5, backgroundColor: '#f8f9fa', borderRadius: 2, border: `1px solid ${colors.primary.main}20` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: '600', color: colors.text.primary, mb: 0.5 }}>
                  Validación de Documentos
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  Envíe los documentos para su registro
                </Typography>
              </Box>
              
              <Button variant="contained" startIcon={<SendIcon />} onClick={() => handleAbrirValidacionDialog(section.id, section.title)}
                disabled={estadoValidacion.enviado || !tieneDocumentos}
                sx={{ textTransform: 'none', px: 3, py: 1, bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark }, '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#9e9e9e' } }}>
                {estadoValidacion.enviado ? 'Enviado' : 'Enviar'}
              </Button>
            </Box>
            
            {!tieneDocumentos && !estadoValidacion.enviado && (
              <Alert severity="warning" sx={{ mt: 2, py: 1 }}>
                <Typography variant="body2">Agregue al menos un documento antes de enviar</Typography>
              </Alert>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  // Función para renderizar cualquier sección con items
  const renderSeccionConItems = (section) => {
    const estadoValidacion = obtenerEstadoValidacion(section.id);
    
    // Calcular progreso basado en documentos subidos
    let completedItems = 0;
    section.items.forEach(item => {
      const tieneDoc = tieneDocumento(section.id, item.name);
      if (tieneDoc) completedItems++;
    });
    
    const totalItems = section.items.length;
    const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    
    const tieneDocumentos = completedItems > 0;
    
    return (
      <Accordion 
        key={section.id}
        expanded={expanded === section.id}
        onChange={handleAccordionChange(section.id)}
        sx={{ 
          mb: 2,
          border: '2px solid',
          borderColor: completionPercentage === 100 ? colors.status.success : colors.status.warning,
          borderRadius: '8px !important',
          boxShadow: `0 2px 12px ${completionPercentage === 100 ? colors.status.success + '20' : colors.status.warning + '20'}`,
          '&:before': { display: 'none' }
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            backgroundColor: expanded === section.id ? '#f8f9fa' : 'white',
            borderRadius: '8px',
            minHeight: '70px',
            transition: 'all 0.2s'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: completionPercentage === 100 ? '#e8f5e9' : '#fff3e0',
              color: completionPercentage === 100 ? colors.status.success : colors.status.warning
            }}>
              {section.icon}
            </Box>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ fontWeight: '700', color: colors.text.primary, fontSize: '1rem', mb: 0.5 }}>
                {section.title}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'center', minWidth: '60px' }}>
                <Typography variant="h6" sx={{ color: completionPercentage === 100 ? colors.status.success : colors.status.warning, fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {Math.round(completionPercentage)}%
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.7rem' }}>
                  Completado
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label={`${completedItems}/${totalItems}`} size="small" color={completionPercentage === 100 ? "success" : "warning"} sx={{ height: '24px', fontSize: '0.75rem', fontWeight: '600' }} />
                {estadoValidacion.enviado && <Chip icon={<CheckCircleIcon />} label="Enviado" size="small" color="info" sx={{ height: '24px' }} />}
              </Box>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 3, pb: 3 }}>
          
          {estadoValidacion.enviado && (
            <Alert severity="info" sx={{ mb: 3, backgroundColor: '#f8f9fa' }} icon={<VerifiedIcon />}>
              <Typography variant="body2"><strong>Documentos enviados</strong></Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>Los documentos de esta sección se enviaron el {estadoValidacion.fechaEnvio}</Typography>
            </Alert>
          )}
          
          <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 3, lineHeight: 1.6 }}>
            Documentación requerida para el expediente. Seleccione cada documento para cargarlo.
          </Typography>
          
          <List dense sx={{ py: 0, mb: 3 }}>
            {section.items.map((item, index) => {
              const documentosItem = getDocumentosPorItem(section.id, item.name);
              const tieneDoc = documentosItem.length > 0;
              // Solo usar esDocumentoUnico para lógica interna, no para mostrar
              
              return (
                <ListItem 
                  key={index}
                  sx={{ 
                    py: 2,
                    px: 2,
                    mb: 1,
                    borderRadius: 1,
                    backgroundColor: '#fff',
                    border: `1px solid ${colors.primary.main}20`,
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    '&:hover': {
                      backgroundColor: '#f8f9fa',
                      borderColor: colors.primary.main
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: tieneDoc ? 1 : 0 }}>
                    <ListItemIcon sx={{ minWidth: 44 }}>
                      {tieneDoc ? (
                        <CheckCircleIcon sx={{ color: colors.status.success, fontSize: '1.5rem', backgroundColor: '#e8f5e9', borderRadius: '50%', p: 0.5 }} />
                      ) : (
                        <WarningIcon sx={{ color: colors.status.warning, fontSize: '1.5rem', backgroundColor: '#fff3e0', borderRadius: '50%', p: 0.5 }} />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography sx={{
                          color: tieneDoc ? colors.text.primary : colors.text.secondary,
                          fontWeight: tieneDoc ? '600' : '500',
                          fontSize: '0.95rem',
                          lineHeight: 1.4
                        }}>
                          {item.name}
                        </Typography>
                      }
                    />
                    
                    {/* Botón para agregar documento - la lógica de único se aplica internamente */}
                    <Button
                      startIcon={<AddIcon />}
                      size="small"
                      variant="outlined"
                      onClick={() => handleOpenAddDialog(section.id, item.name)}
                      disabled={esDocumentoUnico(item.name) && tieneDoc}
                      sx={{ 
                        fontSize: '0.75rem', 
                        textTransform: 'none',
                        ml: 2,
                        color: colors.primary.main,
                        borderColor: colors.primary.main,
                        '&.Mui-disabled': {
                          backgroundColor: '#f5f5f5',
                          color: '#bdbdbd',
                          borderColor: '#e0e0e0'
                        }
                      }}
                    >
                      {tieneDoc ? 'Agregar otro' : 'Agregar'}
                    </Button>
                  </Box>

                  {/* Mostrar documentos subidos para este item */}
                  {tieneDoc && (
                    <Box sx={{ pl: 7, pr: 2, pb: 1 }}>
                      {documentosItem.map((doc, docIndex) => (
                        <Paper key={docIndex} variant="outlined" sx={{ p: 1.5, mb: 1, backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FilePresentIcon sx={{ color: colors.primary.main, fontSize: '1.2rem' }} />
                            <Box>
                              <Typography variant="caption" sx={{ fontWeight: '600', display: 'block' }}>
                                {doc.nombreArchivo}
                              </Typography>
                              <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.7rem' }}>
                                Subido: {doc.fechaSubida}
                              </Typography>
                            </Box>
                          </Box>
                          <Box>
                            <Tooltip title="Ver">
                              <IconButton size="small" onClick={() => handleVerDocumento(doc, section.id)} sx={{ color: colors.primary.main }}>
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Descargar">
                              <IconButton size="small" onClick={() => handleDescargarDocumento(doc)} sx={{ color: colors.status.success }}>
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton size="small" onClick={() => handleEliminarDocumento(section.id, doc.id, doc, item.name, 0, docIndex)} sx={{ color: colors.status.error }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  )}
                </ListItem>
              );
            })}
          </List>
          
          <Box sx={{ mt: 3, p: 2.5, backgroundColor: '#f8f9fa', borderRadius: 2, border: `1px solid ${colors.primary.main}20` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: '600', color: colors.text.primary, mb: 0.5 }}>
                  Validación de Documentos
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  Envíe los documentos para su registro
                </Typography>
              </Box>
              
              <Button variant="contained" startIcon={<SendIcon />} onClick={() => handleAbrirValidacionDialog(section.id, section.title)}
                disabled={estadoValidacion.enviado || !tieneDocumentos}
                sx={{ textTransform: 'none', px: 3, py: 1, bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}>
                {estadoValidacion.enviado ? 'Enviados' : 'Enviar'}
              </Button>
            </Box>
            
            {!tieneDocumentos && !estadoValidacion.enviado && (
              <Alert severity="warning" sx={{ mt: 2, py: 1 }}>
                <Typography variant="body2">Agregue al menos un documento antes de enviar</Typography>
              </Alert>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ color: colors.primary.dark, fontWeight: 'bold', mb: 1 }}>
            Expediente Digital
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text.secondary }}>
            Comienza a construir tu expediente cargando tus certificaciones y documentos
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2}>
          <Button variant={editMode ? "contained" : "outlined"} startIcon={<EditIcon />} onClick={() => setEditMode(!editMode)} sx={{ textTransform: 'none', color: editMode ? 'white' : colors.primary.main, borderColor: colors.primary.main, bgcolor: editMode ? colors.primary.main : 'transparent', '&:hover': { bgcolor: editMode ? colors.primary.dark : `${colors.primary.main}10` } }}>
            {editMode ? 'Guardar Cambios' : 'Modo Edición'}
          </Button>
        </Stack>
      </Box>

      {/* Nivel de Cumplimiento */}
      <Card sx={{ mb: 4, bgcolor: compliance >= 70 ? '#e8f5e9' : compliance >= 30 ? '#fff3e0' : '#ffebee' }}>
        <CardContent>
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} md={7}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4} sm={3} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ color: compliance >= 70 ? colors.status.success : compliance >= 30 ? colors.status.warning : colors.status.error, fontWeight: 'bold', mb: 0.5, fontSize: { xs: '3rem', sm: '3.5rem' } }}>
                      {compliance}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: '500' }}>
                      Cumplimiento
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs="auto" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Divider orientation="vertical" sx={{ height: '60px' }} />
                </Grid>
                
                <Grid item xs={8} sm={8} md={8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: 'bold', fontSize: '1.1rem' }}>
                      Progreso General
                    </Typography>
                    <Chip label={compliance >= 70 ? 'BUEN PROGRESO' : compliance >= 30 ? 'EN PROCESO' : 'POR COMENZAR'} color={compliance >= 70 ? 'success' : compliance >= 30 ? 'warning' : 'error'} size="small" sx={{ height: '24px' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
                    {compliance >= 70 ? 'Excelente avance en tu expediente' : compliance >= 30 ? 'Continúa agregando documentos' : 'Comienza cargando tu primera certificación'}
                  </Typography>
                  
                  <LinearProgress variant="determinate" value={compliance} sx={{ height: 8, borderRadius: 5, backgroundColor: '#f0f0f0', '& .MuiLinearProgress-bar': { backgroundColor: compliance >= 70 ? colors.status.success : compliance >= 30 ? colors.status.warning : colors.status.error } }} />
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs="auto" sx={{ display: { xs: 'none', md: 'block' } }}>
              <Divider orientation="vertical" sx={{ height: '80px' }} />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, height: '100%' }}>
                    <Typography variant="h5" sx={{ color: colors.primary.main, fontWeight: 'bold', mb: 0.5 }}>
                      {certificadosData.formacionEtica.certificaciones.length + certificadosData.actualizacionTecnica.certificaciones.length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: '500', fontSize: '0.7rem' }}>
                      Certificaciones
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, height: '100%' }}>
                    <Typography variant="h5" sx={{ color: colors.status.warning, fontWeight: 'bold', mb: 0.5 }}>
                      {(cumplimientoData.seguridadCadenaSuministro.documento ? 1 : 0) + (cumplimientoData.antisobornos.documento ? 1 : 0)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: '500', fontSize: '0.7rem' }}>
                      Docs. Cumplimiento
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, height: '100%' }}>
                    <Typography variant="h5" sx={{ color: colors.status.error, fontWeight: 'bold', mb: 0.5 }}>
                      {Object.values(documentosData).flat().length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: '500', fontSize: '0.7rem' }}>
                      Documentos
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, height: '100%' }}>
                    <Typography variant="h6" sx={{ color: colors.accents.purple, fontWeight: 'bold', mb: 0.5, fontSize: '1rem' }}>
                      {new Date().toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: '500', fontSize: '0.7rem' }}>
                      Última actualización
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ textAlign: 'center' }}>
            <Button component={Link} to="/certifications" sx={{ color: colors.primary.main, fontSize: '0.85rem', fontWeight: '600', textTransform: 'none', textDecoration: 'underline', '&:hover': { color: colors.primary.dark, textDecoration: 'underline' } }}>
              Ver todas las certificaciones
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Lista de apartados */}
      <Box>
        <Typography variant="h5" sx={{ color: colors.primary.dark, mb: 3, fontWeight: 'bold', borderBottom: `3px solid ${colors.primary.dark}`, pb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          # INFORMACIÓN COMPLEMENTARIA
        </Typography>
        
        {/* Renderizar apartados */}
        {informacionComplementaria.map((section) => {
          if (section.id === 'certificados') {
            return renderCertificados();
          } else if (section.id === 'cumplimiento_organizacional') {
            return renderCumplimientoOrganizacional();
          } else {
            return renderSeccionConItems(section);
          }
        })}
      </Box>

      {/* Diálogo para agregar documento */}
      <Dialog open={addDialog.open} onClose={() => setAddDialog({...addDialog, open: false})} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary.main}20`, pb: 2, display: 'flex', alignItems: 'center', gap: 1, color: colors.primary.dark, fontWeight: 'bold' }}>
          <CloudUploadIcon sx={{ color: colors.primary.main }} />
          Subir Documento
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Grid container spacing={2.5}>
            {/* Nombre del documento (solo si es de una sección con items) */}
            {addDialog.itemName && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                  Documento
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: '600', color: colors.primary.main }}>
                  {addDialog.itemName}
                </Typography>
              </Grid>
            )}

            {/* Campos específicos para certificaciones */}
            {addDialog.sectionId === 'certificados' && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                    Subsección <span style={{ color: colors.status.error }}>*</span>
                  </Typography>
                  <TextField select fullWidth size="small" value={addDialog.subseccion} onChange={(e) => setAddDialog({...addDialog, subseccion: e.target.value})} required>
                    <MenuItem value="formacionEtica">Formación Ética y Cumplimiento</MenuItem>
                    <MenuItem value="actualizacionTecnica">Actualización Técnica y Aduanera</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                    Nombre de la Certificación <span style={{ color: colors.status.error }}>*</span>
                  </Typography>
                  <TextField fullWidth size="small" value={addDialog.tipoDocumento} onChange={(e) => setAddDialog({...addDialog, tipoDocumento: e.target.value})} placeholder="Ej: Diplomado en Comercio Exterior" required />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                    Institución <span style={{ color: colors.status.error }}>*</span>
                  </Typography>
                  <TextField fullWidth size="small" value={addDialog.institucion} onChange={(e) => setAddDialog({...addDialog, institucion: e.target.value})} placeholder="Ej: Universidad Nacional" required />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                    Horas <span style={{ color: colors.status.error }}>*</span>
                  </Typography>
                  <TextField fullWidth type="number" size="small" value={addDialog.horas} onChange={(e) => setAddDialog({...addDialog, horas: e.target.value})} placeholder="Ej: 20" required inputProps={{ min: 1 }} />
                </Grid>
              </>
            )}

            {/* Archivo - siempre presente */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                Archivo <span style={{ color: colors.status.error }}>*</span>
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 3, border: `2px dashed ${addDialog.archivo ? colors.status.success : colors.primary.main}40`, borderRadius: 2, backgroundColor: addDialog.archivo ? '#f8f9fa' : 'transparent', transition: 'all 0.2s', cursor: 'pointer', textAlign: 'center', '&:hover': { borderColor: colors.primary.main, backgroundColor: '#f8f9fa' } }}
                onClick={() => document.getElementById('file-upload').click()}>
                <input id="file-upload" type="file" style={{ display: 'none' }} onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                
                {addDialog.archivo ? (
                  <>
                    <CheckCircleIcon sx={{ color: colors.status.success, fontSize: 40, mb: 1 }} />
                    <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: '500' }}>{addDialog.nombreArchivo}</Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mt: 1 }}>Archivo seleccionado correctamente</Typography>
                    <Button size="small" variant="outlined" onClick={(e) => { e.stopPropagation(); setAddDialog({...addDialog, archivo: null, nombreArchivo: ''}); }} sx={{ mt: 1, color: colors.status.error, borderColor: colors.status.error }}>
                      Quitar archivo
                    </Button>
                  </>
                ) : (
                  <>
                    <CloudUploadIcon sx={{ color: colors.primary.main, fontSize: 40, mb: 1 }} />
                    <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: '500' }}>Haz clic para seleccionar un archivo</Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mt: 1 }}>Formatos: PDF, DOC, DOCX, JPG, PNG (Máx. 10MB)</Typography>
                  </>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info" sx={{ backgroundColor: `${colors.primary.main}10`, fontSize: '0.85rem' }}>
                <Typography variant="body2"><strong>Nota:</strong> Los documentos se agregarán temporalmente y actualizarán automáticamente el progreso.</Typography>
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${colors.primary.main}20` }}>
          <Button onClick={() => setAddDialog({...addDialog, open: false})} variant="outlined" sx={{ textTransform: 'none', color: colors.primary.main, borderColor: colors.primary.main }}>
            Cancelar
          </Button>
          <Button onClick={handleGuardarDocumento} variant="contained" disabled={!addDialog.archivo} sx={{ textTransform: 'none', bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark }, '&.Mui-disabled': { bgcolor: '#e0e0e0' } }}>
            Subir Documento
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para subir documento de cumplimiento */}
      <Dialog open={uploadDialog.open} onClose={() => setUploadDialog({ open: false, tipo: '', titulo: '', archivo: null, nombreArchivo: '' })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary.main}20`, pb: 2, display: 'flex', alignItems: 'center', gap: 1, color: colors.primary.dark, fontWeight: 'bold' }}>
          <CloudUploadIcon sx={{ color: colors.primary.main }} />
          Subir Documento: {uploadDialog.titulo}
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                Fecha de Vigencia
              </Typography>
              <TextField fullWidth type="date" size="small" value={cumplimientoData[uploadDialog.tipo]?.vigencia || ''} onChange={(e) => handleVigenciaChange(uploadDialog.tipo, e.target.value)} InputLabelProps={{ shrink: true }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                Archivo <span style={{ color: colors.status.error }}>*</span>
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 3, border: `2px dashed ${uploadDialog.archivo ? colors.status.success : colors.primary.main}40`, borderRadius: 2, backgroundColor: uploadDialog.archivo ? '#f8f9fa' : 'transparent', transition: 'all 0.2s', cursor: 'pointer', textAlign: 'center', '&:hover': { borderColor: colors.primary.main, backgroundColor: '#f8f9fa' } }}
                onClick={() => document.getElementById('cumplimiento-file-upload').click()}>
                <input id="cumplimiento-file-upload" type="file" style={{ display: 'none' }} accept=".pdf,.doc,.docx" onChange={handleCumplimientoFileSelect} />
                
                {uploadDialog.archivo ? (
                  <>
                    <CheckCircleIcon sx={{ color: colors.status.success, fontSize: 40, mb: 1 }} />
                    <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: '500' }}>{uploadDialog.nombreArchivo}</Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mt: 1 }}>Archivo seleccionado correctamente</Typography>
                    <Button size="small" variant="outlined" onClick={(e) => { e.stopPropagation(); setUploadDialog({ ...uploadDialog, archivo: null, nombreArchivo: '' }); }} sx={{ mt: 1, color: colors.status.error, borderColor: colors.status.error }}>
                      Quitar archivo
                    </Button>
                  </>
                ) : (
                  <>
                    <CloudUploadIcon sx={{ color: colors.primary.main, fontSize: 40, mb: 1 }} />
                    <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: '500' }}>Haz clic para seleccionar un archivo</Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mt: 1 }}>Formatos: PDF, DOC, DOCX (Máx. 10MB)</Typography>
                  </>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info" sx={{ backgroundColor: `${colors.primary.main}10`, fontSize: '0.85rem' }}>
                <Typography variant="body2"><strong>Nota:</strong> Los documentos se agregarán temporalmente.</Typography>
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${colors.primary.main}20` }}>
          <Button onClick={() => setUploadDialog({ open: false, tipo: '', titulo: '', archivo: null, nombreArchivo: '' })} variant="outlined" sx={{ textTransform: 'none', color: colors.primary.main, borderColor: colors.primary.main }}>
            Cancelar
          </Button>
          <Button onClick={handleGuardarDocumentoCumplimiento} variant="contained" disabled={!uploadDialog.archivo} sx={{ textTransform: 'none', bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark }, '&.Mui-disabled': { bgcolor: '#e0e0e0' } }}>
            Subir Documento
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de validación */}
      <Dialog open={validacionDialog.open} onClose={handleCerrarValidacionDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary.main}20`, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SendIcon sx={{ color: colors.primary.main }} />
            <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: '600' }}>
              Enviar Documentos
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Alert severity="info" sx={{ mb: 3, backgroundColor: '#e3f2fd' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', color: colors.primary.main }}>Confirmación de Envío</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>¿Está seguro de enviar los documentos?</Typography>
          </Alert>
          
          <Paper variant="outlined" sx={{ p: 2.5, mb: 3, backgroundColor: '#f8f9fa' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: '500', mb: 0.5 }}>Apartado a enviar:</Typography>
                <Typography variant="body1" sx={{ color: colors.primary.dark, fontWeight: '600' }}>{validacionDialog.titulo}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: '500', mb: 0.5 }}>Fecha de envío:</Typography>
                <Typography variant="body1" sx={{ color: colors.primary.dark, fontWeight: '600' }}>{validacionDialog.fecha}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${colors.primary.main}20` }}>
          <Button onClick={handleCerrarValidacionDialog} variant="outlined" sx={{ textTransform: 'none', color: colors.primary.main, borderColor: colors.primary.main }}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmarValidacion} variant="contained" startIcon={<SendIcon />} sx={{ textTransform: 'none', bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}>
            Confirmar Envío
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de vista previa */}
      <Dialog open={previewDialog.open} onClose={() => setPreviewDialog({ open: false, documento: null, nombre: '', tipo: '', seccion: '' })} maxWidth="md" fullWidth>
        <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary.main}20` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <DescriptionIcon sx={{ color: colors.primary.main }} />
            <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: '600' }}>
              Vista Previa: {previewDialog.nombre}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, minHeight: '400px' }}>
          <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', backgroundColor: '#f8f9fa', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <FilePresentIcon sx={{ fontSize: 80, color: colors.primary.main, mb: 2 }} />
            <Typography variant="h6" sx={{ color: colors.text.primary, mb: 1 }}>{previewDialog.nombre}</Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 3 }}>Documento</Typography>
            <Alert severity="info" sx={{ maxWidth: '400px' }}>
              <Typography variant="body2">Vista previa temporal. En una implementación real, aquí se mostraría el contenido del documento.</Typography>
            </Alert>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${colors.primary.main}20` }}>
          <Button onClick={() => setPreviewDialog({ open: false, documento: null, nombre: '', tipo: '', seccion: '' })} variant="outlined" sx={{ textTransform: 'none', color: colors.primary.main, borderColor: colors.primary.main }}>
            Cerrar
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={() => { setSnackbar({ open: true, message: `Descargando ${previewDialog.nombre}...`, severity: 'info' }); setPreviewDialog({ open: false, documento: null, nombre: '', tipo: '', seccion: '' }); }} sx={{ textTransform: 'none', bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}>
            Descargar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, seccion: '', subseccion: '', documentoId: null, tipo: '', nombre: '', horas: 0, itemName: '', itemIndex: null })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary.main}20`, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <DeleteIcon sx={{ color: colors.status.error }} />
            <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: '600' }}>
              Confirmar Eliminación
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">¿Está seguro que desea eliminar <strong>"{deleteDialog.nombre}"</strong>?</Typography>
            {deleteDialog.horas > 0 && (
              <Typography variant="body2" sx={{ mt: 1 }}>Esta acción restará <strong>{deleteDialog.horas} horas</strong> de las horas acumuladas en la sección.</Typography>
            )}
          </Alert>
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${colors.primary.main}20` }}>
          <Button onClick={() => setDeleteDialog({ open: false, seccion: '', subseccion: '', documentoId: null, tipo: '', nombre: '', horas: 0, itemName: '', itemIndex: null })} variant="outlined" sx={{ textTransform: 'none', color: colors.primary.main, borderColor: colors.primary.main }}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmarEliminacion} variant="contained" color="error" startIcon={<DeleteIcon />} sx={{ textTransform: 'none', bgcolor: colors.status.error, '&:hover': { bgcolor: '#d32f2f' } }}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Expediente;