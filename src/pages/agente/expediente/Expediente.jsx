import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../../../context/AuthContext"; 
import { getTodosApartados } from '../../../services/apartado';
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
  FilePresent as FilePresentIcon,
  VideoCall as VideoCallIcon,
  FiberManualRecord as FiberManualRecordIcon,
  Stop as StopIcon,
  Replay as ReplayIcon,
  Close as CloseIcon,
  Folder as FolderIcon
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



const PruebaVidaRecorder = ({ onVideoCaptured, videoFile, setVideoFile, setSnackbar }) => {
  const [recording, setRecording] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [tiempoGrabado, setTiempoGrabado] = useState(0);
  const [grabacionTimer, setGrabacionTimer] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  

  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: true
      });
      streamRef.current = stream;
      setMediaStream(stream);
      setCameraActive(true);
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      alert("No se pudo acceder a la cámara o micrófono. Asegúrate de tener permisos concedidos.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setMediaStream(null);
    setCameraActive(false);
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setCountdown(null);

          const recorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' });
          const chunks = [];

          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
          };

          recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            const file = new File([blob], `prueba_vida_${Date.now()}.webm`, { type: 'video/webm' });
            onVideoCaptured(file);
          };

          recorder.start();
          setMediaRecorder(recorder);
          setRecording(true);

          let segundos = 0;
          setTiempoGrabado(0);
          const timer = setInterval(() => {
            segundos += 1;
            setTiempoGrabado(segundos);
          }, 1000);
          setGrabacionTimer(timer);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setRecording(false);
      stopCamera();
      if (grabacionTimer) {
        clearInterval(grabacionTimer);
        setGrabacionTimer(null);
      }
    }
  };

  const resetRecording = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setVideoFile(null);
    setTiempoGrabado(0);
    setEnviado(false);
    startCamera();
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (grabacionTimer) clearInterval(grabacionTimer);
    };
  }, []);

  const requisitosVideo = [
    {
      categoria: 'Identificación Física',
      icono: <PersonIcon sx={{ fontSize: '1rem' }} />,
      color: colors.primary.main,
      items: [
        'Presentar INE vigente frente a la cámara (ambos lados)',
        'Presentar ID oficial de Agente Aduanal o patente',
        'Rostro completamente visible, sin obstrucciones',
        'Iluminación adecuada que permita lectura de documentos'
      ]
    },
    {
      categoria: 'Declaración Verbal Obligatoria',
      icono: <SecurityIcon sx={{ fontSize: '1rem' }} />,
      color: colors.accents.purple,
      items: [
        'Nombre completo tal como aparece en la patente',
        'Número de patente aduanal vigente',
        'Aduana(s) de adscripción actual',
        'Estatus operativo actual (activo / en trámite / suspendido)',
        'Fecha de la grabación en voz alta (día, mes y año)'
      ]
    },
    {
      categoria: 'Declaración de Capacidad Legal',
      icono: <GavelIcon sx={{ fontSize: '1rem' }} />,
      color: colors.status.warning,
      items: [
        'Declarar encontrarse en pleno uso de sus facultades',
        'Confirmar que no existe impedimento legal para ejercer',
        'Declarar que la información proporcionada es verídica',
        'Mencionar que el video se graba de forma voluntaria'
      ]
    }
  ];

  return (
    <Box sx={{ mt: 2, mb: 2 }}>

      {/* Encabezado institucional */}
      <Paper
        elevation={0}
        sx={{
          p: 3, mb: 3, borderRadius: 2,
          background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.primary.main} 60%, ${colors.primary.light} 100%)`,
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{
            p: 1.5, borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <VerifiedIcon sx={{ fontSize: '2rem', color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: '700', color: 'white', mb: 0.5, letterSpacing: 0.5 }}>
              VERIFICACIÓN DE EXISTENCIA Y CAPACIDAD LEGAL
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
              Este procedimiento tiene como finalidad acreditar de manera fehaciente que el Agente Aduanal
              se encuentra en vida, en pleno ejercicio de sus facultades legales y en condiciones óptimas
              para desempeñar las funciones propias de su patente aduanal conforme a la{' '}
              <strong>Ley Aduanera vigente</strong> y las disposiciones del{' '}
              <strong>Servicio de Administración Tributaria (SAT)</strong>.
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

        <Grid container spacing={2} justifyContent="center" sx={{ mt: 1 }}>
          {[
            { label: 'Base Legal', value: 'Art. 159 Ley Aduanera' },
            { label: 'Autoridad Supervisora', value: 'SAT / AGA' },
            { label: 'Validez del Registro', value: 'Anual' },
            { label: 'Carácter', value: 'Obligatorio' }
          ].map((dato) => (
            <Grid item xs={6} sm={3} key={dato.label}>
              <Box sx={{
                p: 1.5, borderRadius: 1,
                backgroundColor: 'rgba(255,255,255,0.1)',
                textAlign: 'center'
              }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 0.3 }}>
                  {dato.label}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: '700', fontSize: '0.8rem' }}>
                  {dato.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Alerta de requisitos previos */}
      <Alert severity="warning" sx={{ mb: 3 }} icon={<WarningIcon />}>
        <Typography variant="body2" sx={{ fontWeight: '700', mb: 1 }}>
          ANTES DE INICIAR LA GRABACIÓN — Tenga a la mano los siguientes documentos:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {['INE / IFE vigente', 'ID de Agente Aduanal'].map((doc) => (
            <Chip
              key={doc}
              label={doc}
              size="small"
              icon={<DescriptionIcon />}
              sx={{
                backgroundColor: '#fff3e0',
                color: '#e65100',
                fontWeight: '600',
                fontSize: '0.75rem',
                border: '1px solid #ffcc80'
              }}
            />
          ))}
        </Box>
      </Alert>

      {/* Requisitos del video */}
      <Typography variant="subtitle1" sx={{ fontWeight: '700', color: colors.primary.dark, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CheckCircleIcon sx={{ color: colors.primary.main, fontSize: '1.2rem' }} />
        CONTENIDO OBLIGATORIO DEL VIDEO
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {requisitosVideo.map((req) => (
          <Paper
            key={req.categoria}
            variant="outlined"
            sx={{
              p: 2, borderRadius: 2, flex: 1,
              border: `1px solid ${req.color}30`,
              backgroundColor: `${req.color}05`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Box sx={{
                p: 0.7, borderRadius: 1,
                backgroundColor: `${req.color}15`,
                color: req.color, display: 'flex'
              }}>
                {req.icono}
              </Box>
              <Typography variant="caption" sx={{ fontWeight: '700', color: req.color, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                {req.categoria}
              </Typography>
            </Box>
            <Stack spacing={0.8}>
              {req.items.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Box sx={{
                    width: 18, height: 18, borderRadius: '50%',
                    backgroundColor: `${req.color}15`, color: req.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, mt: 0.1
                  }}>
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: '700' }}>{i + 1}</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, lineHeight: 1.5 }}>
                    {item}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        ))}
      </Box>

      {/* CÁMARA (izquierda) + GUIÓN (derecha) */}
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>

        {/* ÁREA DE GRABACIÓN - lado izquierdo */}
        <Box sx={{ flex: 1 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, border: `2px solid ${colors.primary.main}40` }}>
            <Typography variant="h6" sx={{ color: colors.primary.dark, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <VideoCallIcon sx={{ color: colors.primary.main }} />
              Área de Grabación
            </Typography>

            {/* Estado inicial - sin cámara */}
            {!cameraActive && !previewUrl && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 3 }}>
                  Asegúrese de haber leído todos los requisitos antes de iniciar. Una vez activada la cámara,
                  tendrá una cuenta regresiva de 3 segundos antes de comenzar a grabar.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<VideoCallIcon />}
                  onClick={startCamera}
                  sx={{ textTransform: 'none', bgcolor: colors.primary.main, px: 4, py: 1.5 }}
                >
                  Activar Cámara y Micrófono
                </Button>
              </Box>
            )}

            {/* Cámara activa o preview */}
            {(cameraActive || previewUrl) && (
              <Box>
                {/* Video */}
                <Box sx={{
                  position: 'relative',
                  backgroundColor: '#000',
                  borderRadius: 2,
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  mb: 2
                }}>
                  {previewUrl ? (
                    <video src={previewUrl} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}

                  {countdown && (
                    <Box sx={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.5)', color: 'white',
                      fontSize: '5rem', fontWeight: 'bold'
                    }}>
                      {countdown}
                    </Box>
                  )}

                  {recording && (
                    <Box sx={{
                      position: 'absolute', top: 10, right: 10,
                      display: 'flex', alignItems: 'center', gap: 1,
                      backgroundColor: 'rgba(0,0,0,0.7)', color: 'white',
                      padding: '4px 10px', borderRadius: 4
                    }}>
                      <FiberManualRecordIcon sx={{ color: '#f44336', fontSize: '1rem', animation: 'pulse 1s infinite' }} />
                      <Typography variant="caption" sx={{ fontWeight: '600', letterSpacing: 1 }}>
                        {String(Math.floor(tiempoGrabado / 60)).padStart(2, '0')}:
                        {String(tiempoGrabado % 60).padStart(2, '0')}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Alerta de estado */}
                {cameraActive && !recording && !previewUrl && (
                  <Alert severity="info" sx={{ mb: 2, py: 1 }}>
                    <Typography variant="caption">
                      Cámara activa. Asegúrese de tener buena iluminación y sus documentos a la mano.
                    </Typography>
                  </Alert>
                )}

                {recording && (
                  <Alert severity="warning" sx={{ mb: 2, py: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: '600' }}>
                      GRABANDO — Declare sus datos y muestre su identificación oficial.
                    </Typography>
                  </Alert>
                )}

                {previewUrl && (
                  <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: '600' }}>
                      Video capturado correctamente
                    </Typography>
                    <Typography variant="caption">
                      Duración: {String(Math.floor(tiempoGrabado / 60)).padStart(2, '0')}:{String(tiempoGrabado % 60).padStart(2, '0')}
                    </Typography>
                  </Alert>
                )}

                {/* Botones en la parte inferior */}
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  {cameraActive && !recording && !previewUrl && (
                    <>
                      <Button
                        variant="contained"
                        startIcon={<FiberManualRecordIcon />}
                        onClick={startRecording}
                        fullWidth
                        sx={{ textTransform: 'none', bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' }, py: 1.5 }}
                      >
                        Iniciar Grabación
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CloseIcon />}
                        onClick={stopCamera}
                        fullWidth
                        sx={{ textTransform: 'none', color: colors.status.error, borderColor: colors.status.error, py: 1.5 }}
                      >
                        Cancelar
                      </Button>
                    </>
                  )}

                  {recording && (
                    <Button
                      variant="contained"
                      startIcon={<StopIcon />}
                      onClick={stopRecording}
                      fullWidth
                      sx={{ textTransform: 'none', bgcolor: colors.status.warning, py: 1.5 }}
                    >
                      Detener Grabación
                    </Button>
                  )}

                  {previewUrl && (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<ReplayIcon />}
                        onClick={resetRecording}
                        fullWidth
                        sx={{ textTransform: 'none', color: colors.primary.main, py: 1.5 }}
                      >
                        Grabar Nuevamente
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={enviado ? <CheckCircleIcon /> : <SendIcon />}
                        fullWidth
                        disabled={enviado}
                        onClick={() => {
                          setEnviado(true);
                          setSnackbar({
                            open: true,
                            message: '✓ Video enviado a validación correctamente',
                            severity: 'success'
                          });
                        }}
                        sx={{
                          textTransform: 'none',
                          bgcolor: enviado ? colors.status.success : colors.primary.main,
                          '&:hover': { bgcolor: enviado ? colors.status.success : colors.primary.dark },
                          '&.Mui-disabled': { bgcolor: '#e0e0e0' },
                          py: 1.5
                        }}
                      >
                        {enviado ? 'Enviado' : 'Enviar a Validación'}
                      </Button>
                    </>
                  )}
                </Stack>

              </Box>
            )}

            {videoFile && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: '#e8f5e9', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ color: colors.status.success, fontSize: '1.2rem' }} />
                  Video registrado: {videoFile.name} — {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* GUIÓN - lado derecho */}
        <Box sx={{ flex: '0 0 38%' }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: '#f3f4f6',
              border: `1px dashed ${colors.primary.main}50`,
              position: 'sticky',
              top: 0
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: '700', color: colors.primary.dark, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon sx={{ fontSize: '1rem', color: colors.primary.main }} />
              GUIÓN SUGERIDO PARA LA DECLARACIÓN
            </Typography>
            <Paper elevation={0} sx={{ p: 2, backgroundColor: 'white', borderRadius: 1, borderLeft: `4px solid ${colors.primary.main}` }}>
              <Typography variant="body2" sx={{ color: colors.text.primary, lineHeight: 2, fontStyle: 'italic' }}>
                "Yo, <strong>[Nombre completo]</strong>, titular de la Patente Aduanal número{' '}
                <strong>[Número de patente]</strong>, con RFC <strong>[RFC]</strong>, adscrito a la Aduana de{' '}
                <strong>[Aduana(s)]</strong>, me encuentro en pleno uso de mis facultades físicas y legales
                para el ejercicio de mi función como Agente Aduanal. El día de hoy,{' '}
                <strong>[fecha completa]</strong>, declaro que la información contenida en este expediente
                es verídica y que me encuentro en estatus <strong>[activo / en trámite]</strong> ante el
                Servicio de Administración Tributaria. Presento para su verificación mi{' '}
                <strong>identificación oficial</strong> [mostrar INE / ID de Agente Aduanal frente a cámara]."
              </Typography>
            </Paper>
            <Typography variant="caption" sx={{ color: colors.text.secondary, mt: 1.5, display: 'block' }}>
              * Este guión es una referencia. Puede adaptarlo siempre que incluya todos los datos obligatorios señalados anteriormente.
            </Typography>

            {/* Recordatorio visual mientras graba */}
            {recording && (
              <Alert severity="warning" sx={{ mt: 2 }} icon={<FiberManualRecordIcon sx={{ color: '#f44336' }} />}>
                <Typography variant="caption" sx={{ fontWeight: '700' }}>
                  Siga el guión mientras graba
                </Typography>
              </Alert>
            )}
          </Paper>
        </Box>

      </Box>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

const Expediente = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtener usuario del contexto
  
  // ==============================================
  // NUEVOS ESTADOS PARA APARTADOS DINÁMICOS
  // ==============================================
  const [apartadosDinamicos, setApartadosDinamicos] = useState([]);
  const [loadingApartados, setLoadingApartados] = useState(false);
  
  const [editMode, setEditMode] = useState(false);
  const [expanded, setExpanded] = useState('panel1');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Nuevo estado para Prueba de Vida
const [pruebaVida, setPruebaVida] = useState({
  videoArchivo: null,
  fechaGrabacion: null,
  estado: 'pendiente'
});

// Función para manejar video capturado
const handleVideoCaptured = (videoFile) => {
  setPruebaVida({
    videoFile: videoFile,
    fechaGrabacion: new Date().toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    estado: 'completado'
  });

  setSnackbar({
    open: true,
    message: '✓ Video de prueba de vida capturado correctamente',
    severity: 'success'
  });
};
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
  const [documentosData, setDocumentosData] = useState({});

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

  // ==============================================
  // EFECTO PARA CARGAR APARTADOS DINÁMICOS
  // ==============================================
  useEffect(() => {
  const cargarApartados = async () => {
    if (!user?.instanciaId) return;

    setLoadingApartados(true);

    try {
      const todos = await getTodosApartados();
      
      // Filtrar solo los que NO tienen instancia (globales)
      const globales = todos.filter(a => !a.idInstancia);
      
      const apartadosTransformados = globales.map(apartado => ({
        id: `apartado_${apartado.idApartado}`,
        idApartado: apartado.idApartado,
        nombre: apartado.nombre,
        titulo: apartado.nombre,
        descripcion: apartado.descripcion || '',
        icono: apartado.icono || 'description',
        orden: apartado.orden || 0,
        obligatorio: apartado.obligatorio || false,
        esGlobal: true,
        documentos: [],
      }));

      setApartadosDinamicos(apartadosTransformados);

    } catch (error) {
      console.error('Error cargando apartados:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar los apartados',
        severity: 'error'
      });
    } finally {
      setLoadingApartados(false);
    }
  };

  cargarApartados();
}, [user?.instanciaId]);

  // ==============================================
  // FUNCIÓN PARA OBTENER EL ICONO SEGÚN EL NOMBRE
  // ==============================================
  const getIconForApartado = (icono) => {
    const iconMap = {
      'description': <DescriptionIcon />,
      'folder': <FolderIcon />,
      'security': <SecurityIcon />,
      'work': <WorkIcon />,
      'business': <BusinessIcon />,
      'cloud': <CloudUploadIcon />,
      'verified': <VerifiedIcon />,
      'person': <PersonIcon />,
      'gavel': <GavelIcon />,
      'school': <SchoolIcon />,
      'file': <DescriptionIcon />,
      'document': <DescriptionIcon />,
      'certificate': <VerifiedIcon />,
      'assignment': <DescriptionIcon />,
      'article': <DescriptionIcon />,
      'book': <SchoolIcon />,
      'menu_book': <SchoolIcon />,
      'fact_check': <VerifiedIcon />,
      'check_circle': <CheckCircleIcon />,
      'warning': <WarningIcon />,
      'error': <ErrorIcon />,
      'info': <InfoIcon />
    };
    return iconMap[icono?.toLowerCase()] || <DescriptionIcon />;
  };

  // ==============================================
  // FUNCIÓN PARA RENDERIZAR APARTADO DINÁMICO
  // ==============================================
  const renderApartadoDinamico = (apartado) => {
    return (
      <Accordion
        key={apartado.id}
        expanded={expanded === apartado.id}
        onChange={handleAccordionChange(apartado.id)}
        sx={{
          mb: 2,
          border: '2px solid',
          borderColor: apartado.obligatorio ? colors.status.warning : colors.primary.light,
          borderRadius: '8px !important',
          '&:before': { display: 'none' }
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            {/* Icono */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: apartado.esGlobal ? '#f3e5f5' : '#e3f2fd',
              color: apartado.esGlobal ? colors.accents.purple : colors.primary.main
            }}>
              {getIconForApartado(apartado.icono)}
            </Box>
            
            {/* Título y descripción */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ fontWeight: '700', color: colors.text.primary }}>
                {apartado.nombre}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                {apartado.descripcion && (
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                    {apartado.descripcion}
                  </Typography>
                )}
                {apartado.esGlobal && (
                  <Chip 
                    label="Global" 
                    size="small" 
                    sx={{ 
                      height: '18px', 
                      fontSize: '0.6rem',
                      backgroundColor: colors.accents.purple,
                      color: 'white'
                    }} 
                  />
                )}
              </Box>
            </Box>
            
            {/* Badges */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {apartado.obligatorio && (
                <Chip 
                  label="Obligatorio" 
                  size="small" 
                  color="error" 
                  sx={{ height: '20px', fontSize: '0.65rem' }}
                />
              )}
              <Chip 
                label={`${apartado.documentos?.length || 0} docs`}
                size="small"
                color={apartado.documentos?.length > 0 ? "success" : "default"}
                sx={{ height: '24px' }}
              />
            </Box>
          </Box>
        </AccordionSummary>
        
        <AccordionDetails>
          {/* Contenido del apartado */}
          {apartado.documentos?.length > 0 ? (
            <List>
              {apartado.documentos.map((doc, idx) => (
                <ListItem key={idx}>
                  <ListItemIcon>
                    <DescriptionIcon sx={{ color: colors.primary.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={doc.nombre}
                    secondary={`Subido: ${doc.fechaSubida || 'fecha desconocida'}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info" sx={{ mb: 2 }}>
              No hay documentos cargados en este apartado
            </Alert>
          )}
          
          {/* Botón para agregar documento */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                console.log('Agregar documento a:', apartado.nombre);
                setSnackbar({
                  open: true,
                  message: `Funcionalidad para agregar documentos a "${apartado.nombre}"`,
                  severity: 'info'
                });
              }}
              sx={{ textTransform: 'none' }}
            >
              Agregar Documento
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

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

  // Lista de apartados fijos que se conservan
  const [informacionComplementaria, setInformacionComplementaria] = useState([
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
    }
  ]);

  const calculateCompliance = () => {
    // Calcular cumplimiento basado en certificados
    const totalHorasFormacion = certificadosData.formacionEtica.horasRequeridas;
    const horasFormacion = certificadosData.formacionEtica.horasAcumuladas;
    const porcentajeFormacion = totalHorasFormacion > 0 ? (horasFormacion / totalHorasFormacion) * 35 : 0;
    
    const totalHorasTecnica = certificadosData.actualizacionTecnica.horasRequeridas;
    const horasTecnica = certificadosData.actualizacionTecnica.horasAcumuladas;
    const porcentajeTecnica = totalHorasTecnica > 0 ? (horasTecnica / totalHorasTecnica) * 35 : 0;
    
    // Documentos de cumplimiento (15% cada uno)
    const porcentajeSeguridad = cumplimientoData.seguridadCadenaSuministro.documento ? 15 : 0;
    const porcentajeAntisobornos = cumplimientoData.antisobornos.documento ? 15 : 0;
    
    return Math.min(100, Math.round(porcentajeFormacion + porcentajeTecnica + porcentajeSeguridad + porcentajeAntisobornos));
  };

  const compliance = calculateCompliance();

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
                      {Object.values(documentosData).flat()?.length || 0}
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

        {/* Mostrar loading */}
        {loadingApartados && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <LinearProgress sx={{ maxWidth: '300px', mx: 'auto', mb: 2 }} />
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Cargando apartados...
            </Typography>
          </Box>
        )}

        {/* Renderizar apartados dinámicos */}
        {!loadingApartados && apartadosDinamicos.length > 0 && (
          <>
            <Typography variant="subtitle2" sx={{ color: colors.primary.main, mb: 2 }}>
              Apartados disponibles ({apartadosDinamicos.length})
            </Typography>
            {apartadosDinamicos.map(apartado => renderApartadoDinamico(apartado))}
          </>
        )}

        {/* Mensaje si no hay apartados dinámicos */}
        {!loadingApartados && apartadosDinamicos.length === 0 && user?.instanciaId && (
          <Alert severity="info" sx={{ mb: 3 }}>
            No hay apartados configurados para esta instancia
          </Alert>
        )}

        <Accordion
          expanded={expanded === 'prueba_vida'}
          onChange={handleAccordionChange('prueba_vida')}
          sx={{
            mb: 2,
            border: '2px solid',
            borderColor: pruebaVida.estado === 'completado'
              ? colors.status.success
              : colors.status.warning,
            borderRadius: '8px !important',
            boxShadow: `0 2px 12px ${pruebaVida.estado === 'completado'
              ? colors.status.success + '20'
              : colors.status.warning + '20'}`,
            '&:before': { display: 'none' }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: expanded === 'prueba_vida' ? '#f8f9fa' : 'white',
              borderRadius: '8px',
              minHeight: '70px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40, borderRadius: '50%',
                backgroundColor: pruebaVida.estado === 'completado' ? '#e8f5e9' : '#fff3e0',
                color: pruebaVida.estado === 'completado' ? colors.status.success : colors.status.warning
              }}>
                <VideoCallIcon />
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: '700', color: colors.text.primary, fontSize: '1rem', mb: 0.5 }}>
                  PRUEBA DE VIDA
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  {pruebaVida.estado === 'completado'
                    ? `Completado • ${pruebaVida.fechaGrabacion}`
                    : 'Grabación de video requerida'}
                </Typography>
              </Box>

              <Chip
                label={pruebaVida.estado === 'completado' ? 'COMPLETADO' : 'PENDIENTE'}
                size="small"
                color={pruebaVida.estado === 'completado' ? 'success' : 'warning'}
                icon={pruebaVida.estado === 'completado' ? <CheckCircleIcon /> : <WarningIcon />}
                sx={{ height: '24px', fontSize: '0.75rem', fontWeight: '600' }}
              />
            </Box>
          </AccordionSummary>

          <AccordionDetails sx={{ pt: 3, pb: 3 }}>
            <Alert severity="info" sx={{ mb: 3, backgroundColor: `${colors.primary.main}10` }}>
              <Typography variant="body2">
                <strong>Requisito para agentes:</strong> Capture un video corto para verificar
                su identidad y presencia.
                {pruebaVida.estado !== 'completado' &&
                  ' Complete este paso antes de continuar con el resto del expediente.'}
              </Typography>
            </Alert>

            <PruebaVidaRecorder
              onVideoCaptured={handleVideoCaptured}
              videoFile={pruebaVida.videoArchivo}
              setVideoFile={(file) => setPruebaVida(prev => ({ ...prev, videoArchivo: file }))}
            />

            {pruebaVida.videoArchivo && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={() => {
                    const url = URL.createObjectURL(pruebaVida.videoArchivo);
                    window.open(url, '_blank');
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                  }}
                  sx={{ textTransform: 'none', color: colors.primary.main }}
                >
                  Ver Video
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => {
                    const url = URL.createObjectURL(pruebaVida.videoArchivo);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = pruebaVida.videoArchivo.name;
                    a.click();
                    URL.revokeObjectURL(url);
                    setSnackbar({
                      open: true,
                      message: '✓ Descargando video...',
                      severity: 'success'
                    });
                  }}
                  sx={{ textTransform: 'none', color: colors.status.success }}
                >
                  Descargar
                </Button>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
        
        {/* Renderizar apartados fijos existentes */}
        {informacionComplementaria.map((section) => {
          if (section.id === 'certificados') {
            return renderCertificados();
          } else if (section.id === 'cumplimiento_organizacional') {
            return renderCumplimientoOrganizacional();
          } else {
            return null;
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