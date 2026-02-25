import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  CloudUpload as CloudUploadIcon,
  Security as SecurityIcon,
  Description as DescriptionIcon,
  Verified as VerifiedIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Gavel as GavelIcon,
  MeetingRoom as MeetingRoomIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';

// Colores institucionales
const institutionalColors = {
  primary: '#133B6B',      // Azul oscuro principal
  secondary: '#1a4c7a',    // Azul medio
  accent: '#e9e9e9',       // Color para acentos (gris claro)
  background: '#f4f6f8',   // Fondo claro
  lightBlue: 'rgba(19, 59, 107, 0.08)',  // Azul transparente para hover
  darkBlue: '#0D2A4D',     // Azul más oscuro
  textPrimary: '#2c3e50',  // Texto principal
  textSecondary: '#7f8c8d', // Texto secundario
  success: '#1a4c7a',      // Verde para éxito
  warning: '#1a4c7a',      // Naranja para advertencias
  error: '#1a4c7a',        // Rojo para errores
  info: '#1a4c7a',         // Azul para información
};

// ============================================
// DATOS SIMULADOS DE BASE DE DATOS
// ============================================

// Configuración de tipos de campos dinámicos
const tiposCampos = {
  texto: 'texto',
  texto_largo: 'texto_largo',
  fecha: 'fecha',
  archivo: 'archivo',
  numero: 'numero',
  seleccion: 'seleccion'
};

// Configuración de tipos de apartados
const tiposApartados = {
  documento_simple: 'documento_simple',
  documento_con_campos: 'documento_con_campos',
  registro_tabla: 'registro_tabla',
  sistema_complejo: 'sistema_complejo'
};

// Iconos para diferentes tipos de apartados
const iconosApartados = {
  'documento_simple': DescriptionIcon,
  'documento_con_campos': BusinessIcon,
  'registro_tabla': MeetingRoomIcon,
  'sistema_complejo': SecurityIcon,
  'antisoborno': GavelIcon,
  'presidente': PersonIcon,
  'reuniones': MeetingRoomIcon,
  'certificacion': VerifiedIcon
};

// Colores para diferentes tipos de apartados - ACTUALIZADOS CON AZULES INSTITUCIONALES
const coloresApartados = {
  'documento_simple': institutionalColors.primary,
  'documento_con_campos': '#1a4c7a',
  'registro_tabla': institutionalColors.success,
  'sistema_complejo': institutionalColors.error,
  'antisoborno': institutionalColors.warning,
  'presidente': '#1a4c7a',
  'reuniones': institutionalColors.info,
  'certificacion': institutionalColors.success
};

// ============================================
// DATOS DE APARTADOS DESDE "BASE DE DATOS"
// ============================================
const apartadosDesdeBD = [
  {
    id: 'acta_presidente',
    titulo: 'ACTA CON PRESIDENTE ACTUAL',
    subtitulo: 'Certificación del presidente actual en funciones',
    tipo: 'presidente',
    obligatorio: true,
    dinamico: true,
    estado: 'pendiente',
    documento: null,
    fechaRevision: null,
    campos: [
      {
        id: 'presidente_actual',
        label: 'Presidente Actual en Funciones',
        tipo: tiposCampos.texto,
        valor: '',
        requerido: true
      },
      {
        id: 'fecha_designacion',
        label: 'Fecha de Designación',
        tipo: tiposCampos.fecha,
        valor: '',
        requerido: true
      },
      {
        id: 'descripcion',
        label: 'Descripción del Acta',
        tipo: tiposCampos.texto_largo,
        valor: 'Acta oficial que certifica la designación del presidente actual en funciones. Debe incluir firma, sello oficial y fecha de emisión.',
        requerido: false,
        filas: 3
      }
    ],
    descripcion: 'Documento dinámico que debe actualizarse cada vez que haya un cambio en la presidencia.'
  },
  {
    id: 'politicas_antisoborno',
    titulo: 'POLÍTICAS ANTISOBORNO',
    subtitulo: 'Sistema de prevención de sobornos y corrupción',
    tipo: 'antisoborno',
    obligatorio: true,
    estado: 'pendiente',
    documento: null,
    fechaRevision: null,
    campos: [
      {
        id: 'descripcion',
        label: 'Descripción de las Políticas',
        tipo: tiposCampos.texto_largo,
        valor: 'Políticas y procedimientos para prevenir, detectar y responder a actos de soborno y corrupción. Incluye código de conducta, canales de denuncia y medidas disciplinarias.',
        requerido: true,
        filas: 4
      },
      {
        id: 'vigencia',
        label: 'Fecha de Vigencia',
        tipo: tiposCampos.fecha,
        valor: '',
        requerido: true
      },
      {
        id: 'ultima_capacitacion',
        label: 'Última Capacitación',
        tipo: tiposCampos.fecha,
        valor: '',
        requerido: false
      },
      {
        id: 'nivel_implementacion',
        label: 'Nivel de Implementación',
        tipo: tiposCampos.seleccion,
        valor: '',
        requerido: true,
        opciones: [
          { valor: 'basico', etiqueta: 'Básico' },
          { valor: 'intermedio', etiqueta: 'Intermedio' },
          { valor: 'avanzado', etiqueta: 'Avanzado' },
          { valor: 'completo', etiqueta: 'Completo' }
        ]
      }
    ],
    descripcion: 'Sistema integral para prevenir, detectar y responder a actos de soborno, corrupción y conductas antiéticas en la organización.'
  },
  {
    id: 'registro_reuniones',
    titulo: 'REGISTRO DE REUNIONES Y COASES',
    subtitulo: 'Actas y acuerdos de reuniones formales',
    tipo: 'reuniones',
    obligatorio: true,
    estado: 'pendiente',
    documento: null,
    fechaRevision: null,
    esTabla: true,
    datosTabla: [
      {
        id: 1,
        fecha: '2024-01-15',
        tipo: 'Junta Directiva',
        asunto: 'Aprobación de presupuesto anual',
        participantes: '5',
        acuerdos: '3',
        documento: 'acta_junta_001.pdf',
        estado: 'aprobado'
      },
      {
        id: 2,
        fecha: '2024-02-10',
        tipo: 'Comité de Ética',
        asunto: 'Revisión de políticas antisoborno',
        participantes: '7',
        acuerdos: '5',
        documento: 'acta_etica_001.pdf',
        estado: 'pendiente'
      }
    ],
    descripcion: 'Sistema para el registro formal de reuniones, coases (acuerdos) y actas. Incluye seguimiento de acuerdos y documentación de decisiones.'
  },
  {
    id: 'certificacion_cumplimiento',
    titulo: 'CERTIFICACIÓN DE CUMPLIMIENTO',
    subtitulo: 'Certificación oficial de cumplimiento normativo',
    tipo: 'certificacion',
    obligatorio: false,
    estado: 'pendiente',
    documento: null,
    fechaRevision: null,
    campos: [
      {
        id: 'organismo',
        label: 'Organismo Certificador',
        tipo: tiposCampos.texto,
        valor: '',
        requerido: true
      },
      {
        id: 'numero_certificado',
        label: 'Número de Certificado',
        tipo: tiposCampos.texto,
        valor: '',
        requerido: true
      },
      {
        id: 'fecha_emision',
        label: 'Fecha de Emisión',
        tipo: tiposCampos.fecha,
        valor: '',
        requerido: true
      },
      {
        id: 'fecha_vencimiento',
        label: 'Fecha de Vencimiento',
        tipo: tiposCampos.fecha,
        valor: '',
        requerido: true
      },
      {
        id: 'alcance',
        label: 'Alcance de la Certificación',
        tipo: tiposCampos.texto_largo,
        valor: '',
        requerido: true,
        filas: 3
      }
    ],
    descripcion: 'Certificación oficial emitida por organismo autorizado que acredita el cumplimiento de normativas específicas.'
  }
];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const Expediente = () => {
  const [expanded, setExpanded] = useState(null);
  const [apartados, setApartados] = useState([]);
  const [validacionDialog, setValidacionDialog] = useState({
    open: false,
    apartadoId: '',
    titulo: '',
    fecha: ''
  });
  const [estadosValidacion, setEstadosValidacion] = useState({});
  const [reunionDialog, setReunionDialog] = useState({
    open: false,
    apartadoId: '',
    reunion: null,
    editing: false
  });
  const [nuevaReunion, setNuevaReunion] = useState({
    fecha: '',
    tipo: '',
    asunto: '',
    participantes: '',
    acuerdos: '',
    documento: null
  });

  // Cargar datos desde "base de datos" al iniciar
  useEffect(() => {
    // Simular carga desde API
    setApartados(apartadosDesdeBD);
  }, []);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleDocumentoUpload = (apartadoId) => {
    const fechaActual = new Date().toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    setApartados(prev => prev.map(apartado => {
      if (apartado.id === apartadoId) {
        return {
          ...apartado,
          documento: `${apartado.id}_${Date.now()}.pdf`,
          estado: 'en_revision',
          fechaRevision: fechaActual
        };
      }
      return apartado;
    }));
  };

  const handleCampoChange = (apartadoId, campoId, valor) => {
    setApartados(prev => prev.map(apartado => {
      if (apartado.id === apartadoId) {
        return {
          ...apartado,
          campos: apartado.campos?.map(campo => 
            campo.id === campoId ? { ...campo, valor } : campo
          )
        };
      }
      return apartado;
    }));
  };

  const handleVerDocumento = (documento) => {
    console.log(`Ver documento: ${documento}`);
    // Aquí iría la lógica para ver el documento
  };

  const handleAbrirValidacionDialog = (apartadoId, titulo) => {
    const fechaActual = new Date().toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    setValidacionDialog({
      open: true,
      apartadoId,
      titulo,
      fecha: fechaActual
    });
  };

  const handleCerrarValidacionDialog = () => {
    setValidacionDialog({
      open: false,
      apartadoId: '',
      titulo: '',
      fecha: ''
    });
  };

  const handleConfirmarValidacion = () => {
    const { apartadoId, fecha } = validacionDialog;
    
    setEstadosValidacion(prev => ({
      ...prev,
      [apartadoId]: {
        enviado: true,
        fechaEnvio: fecha,
        estado: 'en_revision'
      }
    }));

    handleCerrarValidacionDialog();
  };

  const obtenerEstadoValidacion = (apartadoId) => {
    return estadosValidacion[apartadoId] || { enviado: false, fechaEnvio: null, estado: 'pendiente' };
  };

  // Funciones para Reuniones (apartados con tabla)
  const handleAbrirDialogReunion = (apartadoId, reunion = null) => {
    if (reunion) {
      setNuevaReunion({ ...reunion });
      setReunionDialog({ open: true, apartadoId, reunion, editing: true });
    } else {
      setNuevaReunion({
        fecha: '',
        tipo: '',
        asunto: '',
        participantes: '',
        acuerdos: '',
        documento: null
      });
      setReunionDialog({ open: true, apartadoId, reunion: null, editing: false });
    }
  };

  const handleCerrarDialogReunion = () => {
    setReunionDialog({ open: false, apartadoId: '', reunion: null, editing: false });
  };

  const handleAgregarReunion = () => {
    const { apartadoId, editing } = reunionDialog;
    
    setApartados(prev => prev.map(apartado => {
      if (apartado.id === apartadoId && apartado.esTabla) {
        const nuevasReuniones = editing
          ? apartado.datosTabla.map(r => 
              r.id === reunionDialog.reunion.id ? { ...nuevaReunion, id: r.id } : r
            )
          : [...apartado.datosTabla, { ...nuevaReunion, id: Date.now(), estado: 'pendiente' }];
        
        return {
          ...apartado,
          datosTabla: nuevasReuniones
        };
      }
      return apartado;
    }));
    
    handleCerrarDialogReunion();
  };

  const handleEliminarReunion = (apartadoId, reunionId) => {
    setApartados(prev => prev.map(apartado => {
      if (apartado.id === apartadoId && apartado.esTabla) {
        return {
          ...apartado,
          datosTabla: apartado.datosTabla.filter(r => r.id !== reunionId)
        };
      }
      return apartado;
    }));
  };

  // Calcular cumplimiento basado en documentos subidos
  const calculateCompliance = () => {
    const obligatorios = apartados.filter(a => a.obligatorio);
    if (obligatorios.length === 0) return 0;
    
    const completados = obligatorios.filter(a => a.documento).length;
    return Math.round((completados / obligatorios.length) * 100);
  };

  const compliance = calculateCompliance();

  // Renderizar campo según tipo
  const renderCampo = (apartadoId, campo) => {
    const commonProps = {
      fullWidth: true,
      label: campo.label,
      value: campo.valor || '',
      onChange: (e) => handleCampoChange(apartadoId, campo.id, e.target.value),
      sx: { mb: 2 },
      InputLabelProps: { shrink: true },
      required: campo.requerido
    };

    switch (campo.tipo) {
      case tiposCampos.texto_largo:
        return (
          <TextField
            {...commonProps}
            multiline
            rows={campo.filas || 4}
            helperText={campo.descripcion || ''}
          />
        );
      
      case tiposCampos.fecha:
        return (
          <TextField
            {...commonProps}
            type="date"
            helperText={campo.descripcion || ''}
          />
        );
      
      case tiposCampos.seleccion:
        return (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel shrink sx={{ '&.Mui-focused': { color: institutionalColors.primary } }}>{campo.label}</InputLabel>
            <Select
              value={campo.valor || ''}
              onChange={(e) => handleCampoChange(apartadoId, campo.id, e.target.value)}
              label={campo.label}
              required={campo.requerido}
              sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: institutionalColors.primary,
                }
              }}
            >
              {campo.opciones?.map((opcion, index) => (
                <MenuItem key={index} value={opcion.valor}>
                  {opcion.etiqueta}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      
      case tiposCampos.numero:
        return (
          <TextField
            {...commonProps}
            type="number"
            helperText={campo.descripcion || ''}
          />
        );
      
      default: // texto
        return (
          <TextField
            {...commonProps}
            helperText={campo.descripcion || ''}
          />
        );
    }
  };

  // Renderizar apartado dinámico
  const renderApartado = (apartado) => {
    const estadoValidacion = obtenerEstadoValidacion(apartado.id);
    const Icono = iconosApartados[apartado.tipo] || DescriptionIcon;
    const color = coloresApartados[apartado.tipo] || institutionalColors.primary;
    const tieneDocumento = !!apartado.documento;
    
    return (
      <Accordion 
        key={apartado.id}
        expanded={expanded === apartado.id}
        onChange={handleAccordionChange(apartado.id)}
        sx={{ 
          mb: 3,
          border: '2px solid',
          borderColor: tieneDocumento ? color : institutionalColors.warning,
          borderRadius: '8px !important',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          '&:before': { display: 'none' }
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            backgroundColor: expanded === apartado.id ? 
              (tieneDocumento ? `${color}10` : '#fff3e0') : 'white',
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
              backgroundColor: tieneDocumento ? `${color}20` : '#fff3e0',
              color: tieneDocumento ? color : institutionalColors.warning
            }}>
              <Icono />
            </Box>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ 
                fontWeight: '700', 
                color: institutionalColors.textPrimary,
                fontSize: '1rem',
                mb: 0.5
              }}>
                {apartado.titulo} {apartado.obligatorio && '(OBLIGATORIO)'}
              </Typography>
              <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                {apartado.subtitulo}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {apartado.dinamico && (
                <Chip 
                  label="DINÁMICO"
                  size="small"
                  sx={{ 
                    bgcolor: institutionalColors.lightBlue,
                    color: institutionalColors.primary,
                    height: '24px', 
                    fontSize: '0.7rem' 
                  }}
                />
              )}
              {apartado.esTabla && (
                <Chip 
                  label={`${apartado.datosTabla?.length || 0} REGISTROS`}
                  size="small"
                  sx={{ 
                    bgcolor: institutionalColors.lightBlue,
                    color: institutionalColors.primary,
                    height: '24px' 
                  }}
                />
              )}
              <Chip 
                label={tieneDocumento ? "DOCUMENTO SUBIDO" : "PENDIENTE"}
                size="small"
                color={tieneDocumento ? "success" : "warning"}
                sx={{ height: '24px' }}
              />
              {estadoValidacion.enviado && (
                <Chip 
                  icon={<CheckCircleIcon />}
                  label="En revisión"
                  size="small"
                  sx={{ 
                    bgcolor: institutionalColors.lightBlue,
                    color: institutionalColors.primary,
                    height: '24px' 
                  }}
                />
              )}
            </Box>
          </Box>
        </AccordionSummary>
        
        <AccordionDetails sx={{ pt: 3, pb: 3 }}>
          {/* Estado de validación */}
          {estadoValidacion.enviado && (
            <Alert 
              severity="info" 
              sx={{ mb: 3, bgcolor: institutionalColors.lightBlue }}
              icon={<VerifiedIcon sx={{ color: institutionalColors.primary }} />}
            >
              <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                <strong>Documento enviado a revisión por el comité</strong>
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: institutionalColors.textSecondary }}>
                Enviado el {estadoValidacion.fechaEnvio}
              </Typography>
            </Alert>
          )}
          
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              mb: 3,
              borderRadius: 2,
              border: '2px solid #e0e0e0',
              '&:hover': {
                borderColor: color
              }
            }}
          >
            <Typography variant="h6" sx={{ 
              fontWeight: '600',
              color: institutionalColors.primary,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
              <Icono sx={{ color }} />
              {apartado.titulo.replace('(OBLIGATORIO)', '').trim()}
            </Typography>
            
            {/* Descripción del apartado */}
            {apartado.descripcion && (
              <Typography variant="body2" sx={{ color: institutionalColors.textSecondary, mb: 3, lineHeight: 1.6 }}>
                {apartado.descripcion}
              </Typography>
            )}
            
            {/* Campos del apartado */}
            {apartado.campos && apartado.campos.length > 0 && (
              <Grid container spacing={3} sx={{ mb: 3 }}>
                {apartado.campos.map((campo) => (
                  <Grid item xs={12} md={campo.tipo === tiposCampos.texto_largo ? 12 : 6} key={campo.id}>
                    {renderCampo(apartado.id, campo)}
                  </Grid>
                ))}
              </Grid>
            )}
            
            {/* Tabla para apartados con datos tabulares */}
            {apartado.esTabla && apartado.datosTabla && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: '600', color: institutionalColors.textPrimary }}>
                    Registros
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    size="small"
                    onClick={() => handleAbrirDialogReunion(apartado.id)}
                    sx={{ 
                      textTransform: 'none', 
                      backgroundColor: color,
                      '&:hover': { backgroundColor: institutionalColors.secondary }
                    }}
                  >
                    Agregar Registro
                  </Button>
                </Box>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: '600', color: institutionalColors.primary }}>Fecha</TableCell>
                        <TableCell sx={{ fontWeight: '600', color: institutionalColors.primary }}>Tipo</TableCell>
                        <TableCell sx={{ fontWeight: '600', color: institutionalColors.primary }}>Asunto</TableCell>
                        <TableCell sx={{ fontWeight: '600', color: institutionalColors.primary }}>Participantes</TableCell>
                        <TableCell sx={{ fontWeight: '600', color: institutionalColors.primary }}>Acuerdos</TableCell>
                        <TableCell sx={{ fontWeight: '600', color: institutionalColors.primary }}>Estado</TableCell>
                        <TableCell sx={{ fontWeight: '600', color: institutionalColors.primary }}>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apartado.datosTabla.map((reunion) => (
                        <TableRow key={reunion.id} hover>
                          <TableCell sx={{ color: institutionalColors.textPrimary }}>{reunion.fecha}</TableCell>
                          <TableCell sx={{ color: institutionalColors.textPrimary }}>{reunion.tipo}</TableCell>
                          <TableCell sx={{ color: institutionalColors.textPrimary }}>{reunion.asunto}</TableCell>
                          <TableCell sx={{ color: institutionalColors.textPrimary }}>{reunion.participantes}</TableCell>
                          <TableCell sx={{ color: institutionalColors.textPrimary }}>{reunion.acuerdos}</TableCell>
                          <TableCell>
                            <Chip 
                              label={reunion.estado === 'aprobado' ? 'APROBADO' : 'PENDIENTE'}
                              size="small"
                              color={reunion.estado === 'aprobado' ? 'success' : 'warning'}
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <IconButton 
                                size="small"
                                onClick={() => handleAbrirDialogReunion(apartado.id, reunion)}
                                sx={{ color: institutionalColors.primary }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small"
                                onClick={() => handleEliminarReunion(apartado.id, reunion.id)}
                                sx={{ color: institutionalColors.error }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                              {reunion.documento && (
                                <IconButton 
                                  size="small"
                                  onClick={() => handleVerDocumento(reunion.documento)}
                                  sx={{ color: institutionalColors.success }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
            
            {/* Upload de documento */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: '600', color: institutionalColors.textPrimary, mb: 2 }}>
                Documento del Sistema
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                {apartado.documento ? (
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: institutionalColors.textPrimary, fontWeight: '500', flex: 1 }}>
                        Documento cargado: {apartado.documento}
                      </Typography>
                      <Chip 
                        label={apartado.estado === 'en_revision' ? "EN REVISIÓN" : "APROBADO"}
                        size="small"
                        color={apartado.estado === 'en_revision' ? "warning" : "success"}
                      />
                    </Box>
                    {apartado.fechaRevision && (
                      <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, display: 'block', mb: 2 }}>
                        Última revisión: {apartado.fechaRevision}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={2}>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        variant="outlined"
                        onClick={() => handleVerDocumento(apartado.documento)}
                        sx={{ 
                          textTransform: 'none',
                          borderColor: institutionalColors.primary,
                          color: institutionalColors.primary,
                          '&:hover': {
                            borderColor: institutionalColors.secondary,
                            bgcolor: institutionalColors.lightBlue
                          }
                        }}
                      >
                        Ver Documento
                      </Button>
                      <Button
                        size="small"
                        startIcon={<CloudUploadIcon />}
                        variant="outlined"
                        sx={{ 
                          textTransform: 'none', 
                          borderColor: color, 
                          color: color,
                          '&:hover': {
                            borderColor: institutionalColors.secondary,
                            bgcolor: institutionalColors.lightBlue
                          }
                        }}
                        onClick={() => handleDocumentoUpload(apartado.id)}
                      >
                        Reemplazar
                      </Button>
                    </Stack>
                  </Box>
                ) : (
                  <Button
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    variant="contained"
                    sx={{ 
                      textTransform: 'none', 
                      py: 1.5,
                      backgroundColor: color,
                      '&:hover': { backgroundColor: institutionalColors.secondary }
                    }}
                    onClick={() => handleDocumentoUpload(apartado.id)}
                  >
                    SUBIR DOCUMENTO {apartado.obligatorio ? '(OBLIGATORIO)' : ''}
                  </Button>
                )}
              </Box>
            </Box>
            
            {/* Alertas específicas por tipo */}
            {apartado.obligatorio && (
              <Alert severity="warning" sx={{ mt: 3, backgroundColor: '#fff3e0' }}>
                <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                  <strong>Importante:</strong> Este documento es obligatorio para completar su expediente. 
                  Debe ser aprobado por el comité antes de continuar.
                </Typography>
              </Alert>
            )}
          </Paper>
          
          {/* Botón de validación */}
          <Box sx={{ 
            mt: 3, 
            p: 2.5, 
            backgroundColor: '#f8f9fa', 
            borderRadius: 2,
            border: '1px solid #e0e0e0'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: '600', color: institutionalColors.textPrimary, mb: 0.5 }}>
                  Validación del Documento
                </Typography>
                <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
                  Envíe el documento para revisión formal
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={() => handleAbrirValidacionDialog(apartado.id, apartado.titulo)}
                disabled={
                  estadoValidacion.enviado || 
                  !apartado.documento || 
                  (apartado.campos && apartado.campos.some(c => c.requerido && !c.valor)) ||
                  (apartado.esTabla && (!apartado.datosTabla || apartado.datosTabla.length === 0))
                }
                sx={{ 
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  bgcolor: institutionalColors.primary,
                  '&:hover': { bgcolor: institutionalColors.secondary }
                }}
              >
                {estadoValidacion.enviado ? 'Enviado para Revisión' : 'Enviar para Validación'}
              </Button>
            </Box>
            
            {/* Validaciones de campos requeridos */}
            {!estadoValidacion.enviado && (
              <Box sx={{ mt: 2 }}>
                {!apartado.documento && (
                  <Alert severity="warning" sx={{ py: 1, mb: 1 }}>
                    <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                      Debe subir el documento primero
                    </Typography>
                  </Alert>
                )}
                {apartado.campos && apartado.campos.some(c => c.requerido && !c.valor) && (
                  <Alert severity="warning" sx={{ py: 1, mb: 1 }}>
                    <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                      Complete todos los campos requeridos
                    </Typography>
                  </Alert>
                )}
                {apartado.esTabla && (!apartado.datosTabla || apartado.datosTabla.length === 0) && (
                  <Alert severity="warning" sx={{ py: 1 }}>
                    <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                      Debe agregar al menos un registro a la tabla
                    </Typography>
                  </Alert>
                )}
              </Box>
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
          <Typography variant="h4" sx={{ color: institutionalColors.primary, fontWeight: 'bold', mb: 1 }}>
            Expediente Digital
          </Typography>
          <Typography variant="body1" sx={{ color: institutionalColors.textSecondary }}>
            Sistema dinámico de cumplimiento y control documental
          </Typography>
        </Box>
      </Box>

      {/* Nivel de Cumplimiento */}
      <Card sx={{ 
        mb: 4, 
        bgcolor: compliance === 100 ? '#e8f5e9' : 
               compliance >= 75 ? '#fffde7' : 
               compliance >= 50 ? '#fff3e0' : '#ffebee' 
      }}>
        <CardContent>
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4} sm={3} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ 
                      color: compliance === 100 ? institutionalColors.success : 
                             compliance >= 75 ? institutionalColors.warning : 
                             compliance >= 50 ? '#1a4c7a' : institutionalColors.error,
                      fontWeight: 'bold',
                      mb: 0.5,
                      fontSize: { xs: '3rem', sm: '3.5rem' }
                    }}>
                      {compliance}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: institutionalColors.textSecondary, fontWeight: '500' }}>
                      Cumplimiento
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={8} sm={8} md={8}>
                  <Typography variant="h6" sx={{ color: institutionalColors.textPrimary, fontWeight: 'bold', mb: 1, fontSize: '1.1rem' }}>
                    Progreso de Documentos Obligatorios
                  </Typography>
                  <Typography variant="body2" sx={{ color: institutionalColors.textSecondary, mb: 2 }}>
                    {compliance === 100 ? 'Todos los documentos obligatorios están completos' : 
                     compliance >= 75 ? 'Mayoría de documentos completados' : 
                     compliance >= 50 ? 'Documentos básicos completados' : 
                     'Documentos en fase inicial'}
                  </Typography>
                  
                  <LinearProgress 
                    variant="determinate" 
                    value={compliance}
                    sx={{ 
                      height: 8,
                      borderRadius: 5,
                      backgroundColor: '#f0f0f0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: compliance === 100 ? institutionalColors.success : 
                                         compliance >= 75 ? institutionalColors.warning : 
                                         compliance >= 50 ? '#1a4c7a' : institutionalColors.error
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Grid container spacing={1.5}>
                {apartados.slice(0, 4).map((apartado) => {
                  const color = apartado.documento ? institutionalColors.success : institutionalColors.error;
                  return (
                    <Grid item xs={6} key={apartado.id}>
                      <Paper sx={{ 
                        p: 1.5, 
                        textAlign: 'center', 
                        borderRadius: 2, 
                        height: '100%',
                        border: `2px solid ${color}30`
                      }}>
                        <Typography variant="h5" sx={{ 
                          color, 
                          fontWeight: 'bold', 
                          mb: 0.5 
                        }}>
                          {apartado.documento ? '1' : '0'}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: institutionalColors.textSecondary, 
                          fontSize: '0.7rem',
                          fontWeight: '500'
                        }}>
                          {apartado.titulo.split(' ')[0]}
                        </Typography>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Apartados Dinámicos */}
      <Box>
        <Typography variant="h5" sx={{ 
          color: institutionalColors.primary, 
          mb: 3, 
          fontWeight: 'bold',
          borderBottom: `3px solid ${institutionalColors.primary}`,
          pb: 1.5
        }}>
          SISTEMAS DE CUMPLIMIENTO Y CONTROL
        </Typography>
        
        {apartados.map((apartado) => renderApartado(apartado))}
      </Box>

      {/* Diálogo para agregar/editar registro en tabla */}
      <Dialog open={reunionDialog.open} onClose={handleCerrarDialogReunion} maxWidth="md" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {reunionDialog.editing ? <EditIcon sx={{ color: institutionalColors.primary }} /> : <AddIcon sx={{ color: institutionalColors.primary }} />}
            <Typography variant="h6" sx={{ color: institutionalColors.textPrimary, fontWeight: '600' }}>
              {reunionDialog.editing ? 'Editar Registro' : 'Agregar Nuevo Registro'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha"
                value={nuevaReunion.fecha || ''}
                onChange={(e) => setNuevaReunion({...nuevaReunion, fecha: e.target.value})}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tipo"
                value={nuevaReunion.tipo || ''}
                onChange={(e) => setNuevaReunion({...nuevaReunion, tipo: e.target.value})}
                placeholder="Ej: Junta Directiva, Comité, Reunión de Trabajo"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Asunto/Agenda"
                value={nuevaReunion.asunto || ''}
                onChange={(e) => setNuevaReunion({...nuevaReunion, asunto: e.target.value})}
                multiline
                rows={2}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Número de Participantes"
                value={nuevaReunion.participantes || ''}
                onChange={(e) => setNuevaReunion({...nuevaReunion, participantes: e.target.value})}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Acuerdos Tomados"
                value={nuevaReunion.acuerdos || ''}
                onChange={(e) => setNuevaReunion({...nuevaReunion, acuerdos: e.target.value})}
                placeholder="Número de acuerdos"
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                startIcon={<CloudUploadIcon />}
                variant="outlined"
                fullWidth
                sx={{ 
                  py: 1.5,
                  borderColor: institutionalColors.primary,
                  color: institutionalColors.primary,
                  '&:hover': {
                    borderColor: institutionalColors.secondary,
                    bgcolor: institutionalColors.lightBlue
                  }
                }}
              >
                Adjuntar Documento
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button 
            onClick={handleCerrarDialogReunion}
            variant="outlined"
            sx={{ 
              textTransform: 'none',
              borderColor: institutionalColors.primary,
              color: institutionalColors.primary,
              '&:hover': {
                borderColor: institutionalColors.secondary,
                bgcolor: institutionalColors.lightBlue
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAgregarReunion}
            variant="contained"
            sx={{ 
              textTransform: 'none',
              bgcolor: institutionalColors.primary,
              '&:hover': { bgcolor: institutionalColors.secondary }
            }}
            disabled={!nuevaReunion.fecha || !nuevaReunion.tipo || !nuevaReunion.asunto}
          >
            {reunionDialog.editing ? 'Actualizar Registro' : 'Agregar Registro'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de validación */}
      <Dialog open={validacionDialog.open} onClose={handleCerrarValidacionDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SendIcon sx={{ color: institutionalColors.primary }} />
            <Typography variant="h6" sx={{ color: institutionalColors.textPrimary, fontWeight: '600' }}>
              Enviar Documento para Validación
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Alert severity="info" sx={{ mb: 3, bgcolor: institutionalColors.lightBlue }}>
            <Typography variant="body2" sx={{ fontWeight: '600', color: institutionalColors.primary }}>
              Confirmación de Envío
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: institutionalColors.textSecondary }}>
              ¿Está seguro de enviar el documento para revisión por el comité?
            </Typography>
          </Alert>
          
          <Paper variant="outlined" sx={{ p: 2.5, mb: 3, backgroundColor: '#f8f9fa' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: institutionalColors.textSecondary, fontWeight: '500', mb: 0.5 }}>
                  Documento a validar:
                </Typography>
                <Typography variant="body1" sx={{ color: institutionalColors.textPrimary, fontWeight: '600' }}>
                  {validacionDialog.titulo}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: institutionalColors.textSecondary, fontWeight: '500', mb: 0.5 }}>
                  Fecha de envío:
                </Typography>
                <Typography variant="body1" sx={{ color: institutionalColors.textPrimary, fontWeight: '600' }}>
                  {validacionDialog.fecha}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
          
          <Alert severity="warning" sx={{ backgroundColor: '#fff8e1' }}>
            <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
              <strong>Nota importante:</strong> Una vez enviado, el documento no podrá ser modificado hasta que el comité complete la revisión.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button 
            onClick={handleCerrarValidacionDialog}
            variant="outlined"
            sx={{ 
              textTransform: 'none',
              borderColor: institutionalColors.primary,
              color: institutionalColors.primary,
              '&:hover': {
                borderColor: institutionalColors.secondary,
                bgcolor: institutionalColors.lightBlue
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmarValidacion}
            variant="contained"
            startIcon={<SendIcon />}
            sx={{ 
              textTransform: 'none',
              bgcolor: institutionalColors.primary,
              '&:hover': { bgcolor: institutionalColors.secondary }
            }}
          >
            Confirmar Envío
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Expediente;