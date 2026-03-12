  import React, { useState, useEffect, useRef } from 'react';
  import { useNavigate, Link } from 'react-router-dom';
  import { useAuth } from "../../../context/AuthContext"; 
  import { getTodosApartados } from '../../../services/apartado';
  import { subirDocumento, getDocumentosSubidosPorApartado, eliminarDocumentoSubido, descargarArchivo , obtenerArchivoBlob} from '../../../services/documentoSubido';
  import { getDocumentosPorApartadoActivos,  getDocumentosPorApartado } from '../../../services/documentoExpediente';
  import { getMiExpediente } from '../../../services/expediente';
  import { getProgramasPorApartadoActivos } from '../../../services/programas';
  import AddCertificationModal from '../../../components/subirCertificacion/AddCertificationModal';
  import {
    crearCertificacionCompleta,
    getCertificacionesPorExpediente,
    obtenerArchivoBlobCertificacion,
    descargarArchivoCertificacion,
    eliminarCertificacionCompleta
  } from '../../../services/certificaciones';

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
    Tooltip,
    Fade,
    Zoom
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
    Folder as FolderIcon,
    AttachFile as AttachFileIcon,
    Assignment as AssignmentIcon,
    Assessment as AssessmentIcon,
    Timeline as TimelineIcon,
    Shield as ShieldIcon
  } from '@mui/icons-material';

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

  // ============================================================
  // COMPONENTE DE PROGRESO DE SUBIDA
  // ============================================================
  const UploadProgress = ({ progress, fileName, onComplete }) => {
    useEffect(() => {
      if (progress >= 100 && onComplete) {
        const timer = setTimeout(onComplete, 500);
        return () => clearTimeout(timer);
      }
    }, [progress, onComplete]);

    return (
      <Fade in={progress > 0 && progress < 100}>
        <Box sx={{ width: '100%', mt: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CloudUploadIcon sx={{ color: colors.primary.main, fontSize: '1rem' }} />
            <Typography variant="caption" sx={{ color: colors.text.secondary, flex: 1, fontWeight: 500 }}>
              Subiendo: {fileName}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: colors.primary.main }}>
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: colors.primary.main,
                transition: 'transform 0.2s linear',
                backgroundImage: `linear-gradient(90deg, ${colors.primary.main}, ${colors.secondary.main})`
              }
            }}
          />
        </Box>
      </Fade>
    );
  };

  // ============================================================
  // PRUEBA DE VIDA RECORDER
  // ============================================================
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
            recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
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
            const timer = setInterval(() => { segundos += 1; setTiempoGrabado(segundos); }, 1000);
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
        if (grabacionTimer) { clearInterval(grabacionTimer); setGrabacionTimer(null); }
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
        {/* Encabezado institucional mejorado */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 2, 
            background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.primary.main} 60%, ${colors.primary.light} 100%)`, 
            color: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              backgroundColor: 'rgba(255,255,255,0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexShrink: 0 
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
              { label: 'Base Legal', value: 'Art. 159 Ley Aduanera', icon: <GavelIcon sx={{ fontSize: '1rem' }} /> },
              { label: 'Autoridad Supervisora', value: 'SAT / AGA', icon: <SecurityIcon sx={{ fontSize: '1rem' }} /> },
              { label: 'Validez del Registro', value: 'Anual', icon: <UpdateIcon sx={{ fontSize: '1rem' }} /> },
              { label: 'Carácter', value: 'Obligatorio', icon: <WarningIcon sx={{ fontSize: '1rem' }} /> }
            ].map((dato) => (
              <Grid item xs={6} sm={3} key={dato.label}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 1, 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  textAlign: 'center',
                  backdropFilter: 'blur(5px)'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
                    {dato.icon}
                  </Box>
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

        {/* Alerta de requisitos previos mejorada */}
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            '& .MuiAlert-icon': { color: colors.status.warning }
          }} 
          icon={<WarningIcon />}
        >
          <Typography variant="body2" sx={{ fontWeight: '700', mb: 1 }}>ANTES DE INICIAR LA GRABACIÓN — Tenga a la mano los siguientes documentos:</Typography>
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

        {/* Requisitos del video - Diseño mejorado */}
        <Typography variant="subtitle1" sx={{ 
          fontWeight: '700', 
          color: colors.primary.dark, 
          mb: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}>
          <CheckCircleIcon sx={{ color: colors.primary.main, fontSize: '1.2rem' }} />
          CONTENIDO OBLIGATORIO DEL VIDEO
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {requisitosVideo.map((req) => (
            <Grid item xs={12} md={4} key={req.categoria}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  border: `1px solid ${req.color}30`, 
                  backgroundColor: `${req.color}05`,
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${req.color}20`
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Box sx={{ 
                    p: 0.7, 
                    borderRadius: 1, 
                    backgroundColor: `${req.color}15`, 
                    color: req.color, 
                    display: 'flex' 
                  }}>
                    {req.icono}
                  </Box>
                  <Typography variant="caption" sx={{ 
                    fontWeight: '700', 
                    color: req.color, 
                    letterSpacing: 0.5, 
                    textTransform: 'uppercase' 
                  }}>
                    {req.categoria}
                  </Typography>
                </Box>
                <Stack spacing={0.8}>
                  {req.items.map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ 
                        width: 18, 
                        height: 18, 
                        borderRadius: '50%', 
                        backgroundColor: `${req.color}15`, 
                        color: req.color, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        flexShrink: 0, 
                        mt: 0.1 
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
            </Grid>
          ))}
        </Grid>

        {/* ÁREA DE GRABACIÓN - Diseño mejorado */}
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                border: `2px solid ${colors.primary.main}40`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <Typography variant="h6" sx={{ 
                color: colors.primary.dark, 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                fontWeight: 600
              }}>
                <VideoCallIcon sx={{ color: colors.primary.main }} />
                Área de Grabación
              </Typography>

              {!cameraActive && !previewUrl && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 3 }}>
                    Asegúrese de haber leído todos los requisitos antes de iniciar.
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<VideoCallIcon />} 
                    onClick={startCamera} 
                    sx={{ 
                      textTransform: 'none', 
                      bgcolor: colors.primary.main, 
                      px: 4, 
                      py: 1.5,
                      '&:hover': {
                        bgcolor: colors.primary.dark
                      }
                    }}
                  >
                    Activar Cámara y Micrófono
                  </Button>
                </Box>
              )}

              {(cameraActive || previewUrl) && (
                <Box>
                  <Box sx={{ 
                    position: 'relative', 
                    backgroundColor: '#000', 
                    borderRadius: 2, 
                    overflow: 'hidden', 
                    aspectRatio: '4/3', 
                    mb: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    {previewUrl ? (
                      <video 
                        src={previewUrl} 
                        controls 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                      />
                    ) : (
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    )}
                    {countdown && (
                      <Box sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        backgroundColor: 'rgba(0,0,0,0.5)', 
                        color: 'white', 
                        fontSize: '5rem', 
                        fontWeight: 'bold' 
                      }}>
                        {countdown}
                      </Box>
                    )}
                    {recording && (
                      <Box sx={{ 
                        position: 'absolute', 
                        top: 10, 
                        right: 10, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        backgroundColor: 'rgba(0,0,0,0.7)', 
                        color: 'white', 
                        padding: '4px 10px', 
                        borderRadius: 4 
                      }}>
                        <FiberManualRecordIcon sx={{ color: '#f44336', fontSize: '1rem', animation: 'pulse 1s infinite' }} />
                        <Typography variant="caption" sx={{ fontWeight: '600', letterSpacing: 1 }}>
                          {String(Math.floor(tiempoGrabado / 60)).padStart(2, '0')}:{String(tiempoGrabado % 60).padStart(2, '0')}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {cameraActive && !recording && !previewUrl && (
                    <Alert severity="info" sx={{ mb: 2, py: 1, borderRadius: 2 }}>
                      <Typography variant="caption">Cámara activa. Asegúrese de tener buena iluminación y sus documentos a la mano.</Typography>
                    </Alert>
                  )}
                  {recording && (
                    <Alert severity="warning" sx={{ mb: 2, py: 1, borderRadius: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: '600' }}>GRABANDO — Declare sus datos y muestre su identificación oficial.</Typography>
                    </Alert>
                  )}
                  {previewUrl && (
                    <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2, borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: '600' }}>Video capturado correctamente</Typography>
                      <Typography variant="caption">Duración: {String(Math.floor(tiempoGrabado / 60)).padStart(2, '0')}:{String(tiempoGrabado % 60).padStart(2, '0')}</Typography>
                    </Alert>
                  )}

                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    {cameraActive && !recording && !previewUrl && (
                      <>
                        <Button 
                          variant="contained" 
                          startIcon={<FiberManualRecordIcon />} 
                          onClick={startRecording} 
                          fullWidth 
                          sx={{ 
                            textTransform: 'none', 
                            bgcolor: '#f44336', 
                            '&:hover': { bgcolor: '#d32f2f' }, 
                            py: 1.5 
                          }}
                        >
                          Iniciar Grabación
                        </Button>
                        <Button 
                          variant="outlined" 
                          startIcon={<CloseIcon />} 
                          onClick={stopCamera} 
                          fullWidth 
                          sx={{ 
                            textTransform: 'none', 
                            color: colors.status.error, 
                            borderColor: colors.status.error, 
                            py: 1.5 
                          }}
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
                        sx={{ 
                          textTransform: 'none', 
                          bgcolor: colors.status.warning, 
                          py: 1.5,
                          '&:hover': { bgcolor: colors.secondary.main }
                        }}
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
                          sx={{ 
                            textTransform: 'none', 
                            color: colors.primary.main, 
                            py: 1.5 
                          }}
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
                            setSnackbar({ open: true, message: '✓ Video enviado a validación correctamente', severity: 'success' }); 
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
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  backgroundColor: '#e8f5e9', 
                  borderRadius: 2,
                  border: `1px solid ${colors.status.success}40`
                }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ color: colors.status.success, fontSize: '1.2rem' }} />
                    Video registrado: {videoFile.name} — {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>

          {/* GUIÓN - Mejorado */}
          <Box sx={{ flex: '0 0 38%' }}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2.5, 
                borderRadius: 2, 
                backgroundColor: '#f8f9fa', 
                border: `1px dashed ${colors.primary.main}50`, 
                position: 'sticky', 
                top: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <Typography variant="subtitle2" sx={{ 
                fontWeight: '700', 
                color: colors.primary.dark, 
                mb: 1.5, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1 
              }}>
                <InfoIcon sx={{ fontSize: '1rem', color: colors.primary.main }} />
                GUIÓN SUGERIDO PARA LA DECLARACIÓN
              </Typography>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2.5, 
                  backgroundColor: 'white', 
                  borderRadius: 2, 
                  borderLeft: `4px solid ${colors.primary.main}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
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
                * Este guión es una referencia. Puede adaptarlo siempre que incluya todos los datos obligatorios.
              </Typography>
              {recording && (
                <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }} icon={<FiberManualRecordIcon sx={{ color: '#f44336' }} />}>
                  <Typography variant="caption" sx={{ fontWeight: '700' }}>Siga el guión mientras graba</Typography>
                </Alert>
              )}
            </Paper>
          </Box>
        </Box>

        <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
      </Box>
    );
  };

  const TextPreview = ({ objectUrl }) => {
    const [text, setText] = useState('');
    useEffect(() => {
      fetch(objectUrl).then(r => r.text()).then(setText).catch(() => setText('No se pudo leer el archivo.'));
    }, [objectUrl]);
    return (
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', fontSize: '0.85rem', margin: 0, color: '#333' }}>
        {text}
      </pre>
    );
  };

  // ============================================================
  // COMPONENTE PARA DOCUMENTOS SUBIDOS (SIN VALIDACIÓN)
  // ============================================================
  // ============================================================
  // COMPONENTE PARA DOCUMENTOS SUBIDOS (ANCHO COMPLETO)
  // ============================================================
  const DocumentoSubidoItem = ({ 
    documento, 
    onVer, 
    onDescargar, 
    onEliminar,
    mostrarFecha = true
  }) => {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        width: '100%', // Ocupa el 100% del ancho disponible
        p: 2,
        borderRadius: 2,
        backgroundColor: '#f8f9fa',
        border: `1px solid ${colors.primary.main}20`,
        transition: 'all 0.2s',
        '&:hover': {
          backgroundColor: '#ffffff',
          boxShadow: `0 4px 12px ${colors.primary.main}20`,
          borderColor: colors.primary.main
        }
      }}>
        <Box sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: `${colors.primary.main}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <FilePresentIcon sx={{ color: colors.primary.main, fontSize: '1.2rem' }} />
        </Box>
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ 
            fontWeight: '600', 
            color: colors.text.primary,
            mb: 0.5
          }}>
            {documento.nombreOriginal || documento.nombreArchivo}
          </Typography>
          {mostrarFecha && documento.fechaSubida && (
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Subido: {documento.fechaSubida}
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <Tooltip title="Ver documento" arrow>
            <IconButton 
              size="small" 
              onClick={() => onVer(documento)}
              sx={{ 
                color: colors.primary.main, 
                backgroundColor: `${colors.primary.main}15`,
                '&:hover': { backgroundColor: `${colors.primary.main}25` }
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Descargar" arrow>
            <IconButton 
              size="small" 
              onClick={() => onDescargar(documento)}
              sx={{ 
                color: colors.status.success, 
                backgroundColor: '#e8f5e9',
                '&:hover': { backgroundColor: '#c8e6c9' }
              }}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar" arrow>
            <IconButton 
              size="small" 
              onClick={() => onEliminar(documento)}
              sx={{ 
                color: colors.status.error, 
                backgroundColor: '#ffebee',
                '&:hover': { backgroundColor: '#ffcdd2' }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    );
  };

  // ============================================================
  // COMPONENTE PARA CERTIFICACIONES DE PROGRAMAS (CON VALIDACIÓN)
  // ============================================================
  const CertificacionProgramaItem = ({ 
    documento, 
    programa,
    onVer, 
    onDescargar, 
    onEliminar,
    onEnviarValidacion,
    estadoValidacion
  }) => {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        width: '100%',
        p: 2,
        borderRadius: 2,
        backgroundColor: '#f8f9fa',
        border: `1px solid ${colors.accents.purple}20`,
        transition: 'all 0.2s',
        '&:hover': {
          backgroundColor: '#ffffff',
          boxShadow: `0 4px 12px ${colors.accents.purple}20`,
          borderColor: colors.accents.purple
        }
      }}>
        <Box sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: `${colors.accents.purple}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <SchoolIcon sx={{ color: colors.accents.purple, fontSize: '1.2rem' }} />
        </Box>
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ 
            fontWeight: '600', 
            color: colors.text.primary,
            mb: 0.5
          }}>
            {documento.nombreArchivo || documento.nombre}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {documento.institucion && (
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                <strong>Institución:</strong> {documento.institucion}
              </Typography>
            )}
            {documento.horas && (
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                <strong>Horas:</strong> {documento.horas}
              </Typography>
            )}
            {documento.fecha && (
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                <strong>Fecha:</strong> {new Date(documento.fecha).toLocaleDateString('es-MX')}
              </Typography>
            )}
            {documento.estado && (
    <Chip
      label={documento.estado}
      size="small"
      sx={{
        height: '18px',
        fontSize: '0.65rem',
        fontWeight: '600',
        backgroundColor:
          documento.estado === 'aprobado' ? '#e8f5e9' :
          documento.estado === 'rechazado' ? '#ffebee' :
          '#fff3e0',
        color:
          documento.estado === 'aprobado' ? '#2e7d32' :
          documento.estado === 'rechazado' ? '#c62828' :
          '#e65100',
      }}
    />
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
          {estadoValidacion && (
            <Chip
              label={estadoValidacion.estado === 'enviado' ? 'ENVIADO' : 'PENDIENTE'}
              size="small"
              color={estadoValidacion.estado === 'enviado' ? 'success' : 'warning'}
              icon={estadoValidacion.estado === 'enviado' ? <CheckCircleIcon /> : <WarningIcon />}
              sx={{ height: '24px', fontSize: '0.7rem' }}
            />
          )}
          
          <Stack direction="row" spacing={1}>
            <Tooltip title="Ver certificado" arrow>
              <IconButton 
                size="small" 
                onClick={() => onVer(documento)}
                sx={{ 
                  color: colors.primary.main, 
                  backgroundColor: `${colors.primary.main}15`,
                  '&:hover': { backgroundColor: `${colors.primary.main}25` }
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Descargar" arrow>
              <IconButton 
                size="small" 
                onClick={() => onDescargar(documento)}
                sx={{ 
                  color: colors.status.success, 
                  backgroundColor: '#e8f5e9',
                  '&:hover': { backgroundColor: '#c8e6c9' }
                }}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar" arrow>
              <IconButton 
                size="small" 
                onClick={() => onEliminar(documento)}
                sx={{ 
                  color: colors.status.error, 
                  backgroundColor: '#ffebee',
                  '&:hover': { backgroundColor: '#ffcdd2' }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Box>
    );
  };

  // ============================================================
  // EXPEDIENTE PRINCIPAL
  // ============================================================
  const Expediente = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Estados nuevos:
    const [certModalOpen, setCertModalOpen] = useState(false);
    const [progSeleccionado, setProgSeleccionado] = useState(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [nuevaCertificacion, setNuevaCertificacion] = useState({
      subseccion: '', tipoDocumento: '', institucion: '',
      fecha: new Date().toISOString().split('T')[0],
      horas: '', archivo: null, nombreArchivo: ''
    });

    // Estados para documentos subidos en programas
    const [documentosProgramas, setDocumentosProgramas] = useState({});
    
    // Estados para validación de programas
    const [estadosValidacionProgramas, setEstadosValidacionProgramas] = useState({});

    // Handlers nuevos:
    const handleNuevaCertificacionChange = (campo) => (event) => {
      setNuevaCertificacion(prev => ({ ...prev, [campo]: event.target.value }));
    };

    const handleCertFileChange = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        setSnackbar({ open: true, message: 'El archivo no puede ser mayor a 10MB', severity: 'error' });
        return;
      }
      const tiposPermitidos = ['application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg', 'image/png'];
      if (!tiposPermitidos.includes(file.type)) {
        setSnackbar({ open: true, message: 'Formato no permitido. Use PDF, DOC, DOCX, JPG o PNG', severity: 'error' });
        return;
      }
      setNuevaCertificacion(prev => ({ ...prev, archivo: file, nombreArchivo: file.name }));
      // Simular progreso
      setUploading(true);
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) { clearInterval(interval); setUploading(false); return 100; }
          return prev + 10;
        });
      }, 300);
    };

    const handleGuardarCertDesdePrograma = async () => {
      if (!nuevaCertificacion.tipoDocumento || !nuevaCertificacion.institucion ||
          !nuevaCertificacion.horas || !nuevaCertificacion.archivo) {
        setSnackbar({ open: true, message: 'Complete todos los campos requeridos', severity: 'warning' });
        return;
      }
      setSaving(true);
      try {
        const nuevoDoc = await crearCertificacionCompleta(
          {
            nombre:        nuevaCertificacion.tipoDocumento,
            institucion:   nuevaCertificacion.institucion,
            horas:         parseInt(nuevaCertificacion.horas),
            fecha:         nuevaCertificacion.fecha,
            nombreArchivo: nuevaCertificacion.nombreArchivo,
            descripcion:   '',
          },
          user?.instanciaId,
          expediente?.id,
          progSeleccionado?.id,
          nuevaCertificacion.archivo
        );
        
        // Guardar el documento en el estado de documentosProgramas
        if (progSeleccionado) {
          setDocumentosProgramas(prev => ({
            ...prev,
            [progSeleccionado.id]: {
              id: nuevoDoc.idCertExp,
              idCertificacion: nuevoDoc.idCertificacion,
              nombreArchivo: nuevoDoc.nombreArchivo || nuevaCertificacion.nombreArchivo,
              nombre: nuevoDoc.nombreCertificacion || nuevaCertificacion.tipoDocumento,
              institucion: nuevoDoc.institucion || nuevaCertificacion.institucion,
              horas: nuevoDoc.horasAcreditadas || parseInt(nuevaCertificacion.horas),
              fecha: nuevoDoc.fechaEmision || nuevaCertificacion.fecha,
              idDocumentoSubido: nuevoDoc.mongoDocumentoId,
              estado: nuevoDoc.estado || 'pendiente',
            }
          }));
        }
        
        setSnackbar({ open: true, message: 'Certificación enviada para validación', severity: 'success' });
        setCertModalOpen(false);
        setProgSeleccionado(null);
        setNuevaCertificacion({
          subseccion: '', tipoDocumento: '', institucion: '',
          fecha: new Date().toISOString().split('T')[0],
          horas: '', archivo: null, nombreArchivo: ''
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || 'Error al guardar la certificación',
          severity: 'error'
        });
      } finally {
        setSaving(false);
      }
    };

    // ── Estados principales ──────────────────────────────────
    const [expediente, setExpediente] = useState(null);
    const [archivosSubidos, setArchivosSubidos] = useState({});
    const [apartadosDinamicos, setApartadosDinamicos] = useState([]);
    const [loadingApartados, setLoadingApartados] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [expanded, setExpanded] = useState('panel1');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // ── Prueba de vida ───────────────────────────────────────
    const [pruebaVida, setPruebaVida] = useState({ videoArchivo: null, fechaGrabacion: null, estado: 'pendiente' });

    const handleClosePreview = () => {
      if (previewDialog.objectUrl) URL.revokeObjectURL(previewDialog.objectUrl);
      setPreviewDialog({ open: false, documento: null, nombre: '', tipo: '', seccion: '', loading: false, objectUrl: null });
    };

    const handleVideoCaptured = (videoFile) => {
      setPruebaVida({
        videoArchivo: videoFile,
        fechaGrabacion: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        estado: 'completado'
      });
      setSnackbar({ open: true, message: '✓ Video de prueba de vida capturado correctamente', severity: 'success' });
    };

    // ── Certificados ─────────────────────────────────────────
    const [certificadosData, setCertificadosData] = useState({
      formacionEtica: { titulo: 'Formación Ética y Cumplimiento', horasRequeridas: 20, horasAcumuladas: 0, certificaciones: [] },
      actualizacionTecnica: { titulo: 'Actualización Técnica y Aduanera', horasRequeridas: 80, horasAcumuladas: 0, certificaciones: [] }
    });

    const [formData, setFormData] = useState({
      nombre: '', curp: '', rfc: '', fechaNacimiento: '', lugarNacimiento: '',
      nacionalidad: '', estadoCivil: '', domicilioFiscal: '', domicilioParticular: '',
      telefono: '', email: ''
    });

    // ── Cumplimiento organizacional ──────────────────────────
    const [cumplimientoData, setCumplimientoData] = useState({
      seguridadCadenaSuministro: { descripcion: '', vigencia: '', documento: null, estado: 'pendiente', fechaRevision: null, nombreDocumento: '' },
      antisobornos: { descripcion: '', vigencia: '', documento: null, estado: 'pendiente', fechaRevision: null, nombreDocumento: '' }
    });

    const [documentosData, setDocumentosData] = useState({});

    // ── Diálogos ─────────────────────────────────────────────
    const [addDialog, setAddDialog] = useState({
      open: false, sectionId: '', subseccion: '', tipoDocumento: '', archivo: null,
      nombreArchivo: '', fecha: new Date().toISOString().split('T')[0], horas: '', institucion: '', itemName: ''
    });

    const [validacionDialog, setValidacionDialog] = useState({ 
      open: false, 
      programa: null, 
      documento: null, 
      fecha: '' 
    });

    const [uploadDialog, setUploadDialog] = useState({
      open: false, tipo: '', titulo: '', archivo: null, nombreArchivo: '', idDocumentoPlantilla: null,
      uploading: false, progress: 0
    });

    const [previewDialog, setPreviewDialog] = useState({ open: false, documento: null, nombre: '', tipo: '', seccion: '', loading: false, objectUrl: null });

    const [deleteDialog, setDeleteDialog] = useState({
      open: false, seccion: '', subseccion: '', documentoId: null, tipo: '',
      nombre: '', horas: 0, itemName: '', itemIndex: null
    });

    const [informacionComplementaria] = useState([
      { id: 'certificados', title: 'CERTIFICADOS DE NIVEL GREMIAL', icon: <DescriptionIcon />, items: [] },
      { id: 'cumplimiento_organizacional', title: 'CUMPLIMIENTO ORGANIZACIONAL', icon: <VerifiedIcon />, items: [] }
    ]);

    // ============================================================
    // EFECTOS
    // ============================================================

    // useEffect 1 — cargar expediente
    useEffect(() => {
      const cargarExpediente = async () => {
        if (!user?.id || !user?.instanciaId) return;
        try {
          const miExpediente = await getMiExpediente();
          setExpediente(miExpediente);
        } catch (error) {
          console.error('Error cargando expediente:', error);
        }
      };
      cargarExpediente();
    }, [user?.id, user?.instanciaId]);

    // useEffect 2 — cargar apartados + documentos subidos (depende de expediente)
    useEffect(() => {
      const cargarApartados = async () => {
        if (!user?.instanciaId) return;
        setLoadingApartados(true);
        try {
          const todos = await getTodosApartados();
          const globales = todos.filter(a => !a.idInstancia || a.idInstancia === user.instanciaId);

          const apartadosTransformados = await Promise.all(
            globales.map(async (apartado) => {
              let programas = [];
              try {
                programas = await getProgramasPorApartadoActivos(apartado.idApartado);
                console.log(` Programas activos apartado ${apartado.idApartado}:`, programas);
              } catch (error) {
                console.error(`Error cargando programas del apartado ${apartado.idApartado}:`, error);
              }
              let documentos = [];
              try {
                documentos = await getDocumentosPorApartadoActivos(apartado.idApartado);
                console.log(`📄 Docs activos apartado ${apartado.idApartado}:`, documentos); 
              } catch (error) {
                console.error(`Error cargando docs del apartado ${apartado.idApartado}:`, error);
              }
              return {
                id: `apartado_${apartado.idApartado}`,
                idApartado: apartado.idApartado,
                nombre: apartado.nombre,
                titulo: apartado.nombre,
                descripcion: apartado.descripcion || '',
                icono: apartado.icono || 'description',
                orden: apartado.orden || 0,
                obligatorio: apartado.obligatorio || false,
                esGlobal: !apartado.idInstancia,
                documentos: documentos || [],
                programas: programas || [], 
              };
            })
          );

          setApartadosDinamicos(apartadosTransformados);

          // Cargar documentos ya subidos por el agente para cada apartado
          if (expediente?.id) {
            const subidosPorApartado = {};
            await Promise.all(
              globales.map(async (apartado) => {
                try {
                  const docs = await getDocumentosSubidosPorApartado(expediente.id, apartado.idApartado);
                  console.log('docs subidos:', docs);
                  if (docs?.length > 0) {
                    // Indexar por idDocumentoPlantilla
                    subidosPorApartado[apartado.idApartado] = {};
                    docs.forEach(doc => {
                      if (doc.idDocumentoPlantilla) {
                        subidosPorApartado[apartado.idApartado][doc.idDocumentoPlantilla] = doc;
                      }
                    });
                  }
                } catch (error) {
                  console.error(`Error cargando docs subidos del apartado ${apartado.idApartado}:`, error);
                }
              })
            );
            setArchivosSubidos(subidosPorApartado);
            try {
              const certs = await getCertificacionesPorExpediente(expediente.id);
              console.log('📦 RESPUESTA COMPLETA del backend:', JSON.stringify(certs, null, 2));
              
              const docsPrograma = {};
              certs.forEach(cert => {
                console.log('cert:', cert.idCertExp, 'idPrograma:', cert.idPrograma);
                if (cert.idPrograma) {
                  docsPrograma[cert.idPrograma] = {
                    id: cert.idCertExp,
                    idCertificacion: cert.idCertificacion,
                    nombreArchivo: cert.nombreArchivo || cert.nombreCertificacion || 'documento',
                    nombre: cert.nombreCertificacion,
                    institucion: cert.institucion,
                    horas: cert.horasAcreditadas,
                    fecha: cert.fechaEmision,
                    idDocumentoSubido: cert.mongoDocumentoId,
                    estado: cert.estado,
                  };
                }
              });
              setDocumentosProgramas(docsPrograma);
            } catch (error) {
              console.error('Error cargando certs de programas:', error);
            }
          }
        } catch (error) {
          console.error('Error cargando apartados:', error);
          setSnackbar({ open: true, message: 'Error al cargar los apartados', severity: 'error' });
        } finally {
          setLoadingApartados(false);
        }
      };
      cargarApartados();
    }, [user?.instanciaId, expediente?.id]);

    // ============================================================
    // HELPERS
    // ============================================================

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
        'assignment': <AssignmentIcon />, 
        'article': <DescriptionIcon />,
        'book': <SchoolIcon />, 
        'menu_book': <SchoolIcon />, 
        'fact_check': <VerifiedIcon />,
        'check_circle': <CheckCircleIcon />, 
        'warning': <WarningIcon />, 
        'error': <ErrorIcon />, 
        'info': <InfoIcon />,
        'timeline': <TimelineIcon />,
        'assessment': <AssessmentIcon />,
        'shield': <ShieldIcon />
      };
      return iconMap[icono?.toLowerCase()] || <DescriptionIcon />;
    };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    // ── Cálculo de cumplimiento ──────────────────────────────
    const calculateCompliance = () => {
      const porcentajeFormacion = certificadosData.formacionEtica.horasRequeridas > 0
        ? Math.min(100, (certificadosData.formacionEtica.horasAcumuladas / certificadosData.formacionEtica.horasRequeridas)) * 35 : 0;
      const porcentajeTecnica = certificadosData.actualizacionTecnica.horasRequeridas > 0
        ? Math.min(100, (certificadosData.actualizacionTecnica.horasAcumuladas / certificadosData.actualizacionTecnica.horasRequeridas)) * 35 : 0;
      const porcentajeSeguridad = cumplimientoData.seguridadCadenaSuministro.documento ? 15 : 0;
      const porcentajeAntisobornos = cumplimientoData.antisobornos.documento ? 15 : 0;
      return Math.min(100, Math.round(porcentajeFormacion + porcentajeTecnica + porcentajeSeguridad + porcentajeAntisobornos));
    };

    const compliance = calculateCompliance();
    const certificadosTienenDocumentos = () => certificadosData.formacionEtica.certificaciones.length > 0 || certificadosData.actualizacionTecnica.certificaciones.length > 0;
    const cumplimientoTieneDocumentos = () => cumplimientoData.seguridadCadenaSuministro.documento !== null || cumplimientoData.antisobornos.documento !== null;

    // ============================================================
    // HANDLERS DE DOCUMENTOS
    // ============================================================

    const handleInputChange = (field) => (event) => setFormData({ ...formData, [field]: event.target.value });

    const handleOpenAddDialog = (sectionId, itemName = '', subseccion = '') => {
      setAddDialog({ open: true, sectionId, subseccion, tipoDocumento: '', archivo: null, nombreArchivo: '', fecha: new Date().toISOString().split('T')[0], horas: '', institucion: '', itemName });
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) { setSnackbar({ open: true, message: 'El archivo no puede ser mayor a 10MB', severity: 'error' }); return; }
      const tiposPermitidos = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!tiposPermitidos.includes(file.type)) { setSnackbar({ open: true, message: 'Formato no permitido. Use PDF, DOC, DOCX, JPG o PNG', severity: 'error' }); return; }
      setAddDialog({ ...addDialog, archivo: file, nombreArchivo: file.name });
    };

    const handleGuardarDocumento = () => {
      if (!addDialog.archivo) { setSnackbar({ open: true, message: 'Por favor seleccione un archivo', severity: 'warning' }); return; }
      const nuevoDocumento = {
        id: Date.now(), nombre: addDialog.itemName || addDialog.tipoDocumento,
        nombreArchivo: addDialog.nombreArchivo, archivo: addDialog.archivo,
        fecha: addDialog.fecha, tipo: addDialog.tipoDocumento, institucion: addDialog.institucion,
        horas: addDialog.horas ? parseInt(addDialog.horas) : 0, estado: 'completo',
        fechaSubida: new Date().toLocaleDateString('es-MX')
      };
      const sectionId = addDialog.sectionId;
      if (sectionId === 'certificados') {
        if (addDialog.subseccion === 'formacionEtica') {
          setCertificadosData(prev => ({ ...prev, formacionEtica: { ...prev.formacionEtica, certificaciones: [...prev.formacionEtica.certificaciones, nuevoDocumento], horasAcumuladas: prev.formacionEtica.horasAcumuladas + (addDialog.horas ? parseInt(addDialog.horas) : 0) } }));
        } else if (addDialog.subseccion === 'actualizacionTecnica') {
          setCertificadosData(prev => ({ ...prev, actualizacionTecnica: { ...prev.actualizacionTecnica, certificaciones: [...prev.actualizacionTecnica.certificaciones, nuevoDocumento], horasAcumuladas: prev.actualizacionTecnica.horasAcumuladas + (addDialog.horas ? parseInt(addDialog.horas) : 0) } }));
        }
      } else if (sectionId === 'cumplimiento_organizacional') {
        if (addDialog.subseccion === 'seguridadCadenaSuministro') {
          setCumplimientoData(prev => ({ ...prev, seguridadCadenaSuministro: { ...prev.seguridadCadenaSuministro, documento: nuevoDocumento.archivo, estado: 'pendiente', fechaRevision: nuevoDocumento.fechaSubida, nombreDocumento: nuevoDocumento.nombreArchivo } }));
        } else if (addDialog.subseccion === 'antisobornos') {
          setCumplimientoData(prev => ({ ...prev, antisobornos: { ...prev.antisobornos, documento: nuevoDocumento.archivo, estado: 'pendiente', fechaRevision: nuevoDocumento.fechaSubida, nombreDocumento: nuevoDocumento.nombreArchivo } }));
        }
      }
      setSnackbar({ open: true, message: 'Documento agregado correctamente', severity: 'success' });
      setAddDialog({ open: false, sectionId: '', subseccion: '', tipoDocumento: '', archivo: null, nombreArchivo: '', fecha: new Date().toISOString().split('T')[0], horas: '', institucion: '', itemName: '' });
    };

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

    const handleVerDocumento = async (documento, seccion) => {
      const nombre = documento.nombreOriginal || documento.nombreArchivo || documento.documento || 'documento';

      // Documentos locales (certificados/cumplimiento) — sin backend
      if (!documento.idDocumentoSubido) {
        setPreviewDialog({ open: true, documento: null, nombre, tipo: detectarTipoArchivo(nombre), seccion, loading: false, objectUrl: null });
        return;
      }

      // Documentos desde MongoDB — abre modal con loading
      setPreviewDialog({ open: true, documento: null, nombre, tipo: detectarTipoArchivo(nombre), seccion, loading: true, objectUrl: null });

      try {
        const blob = await obtenerArchivoBlob(documento.idDocumentoSubido);
        const objectUrl = URL.createObjectURL(blob);
        setPreviewDialog(prev => ({ ...prev, loading: false, objectUrl }));
      } catch (error) {
        console.error('Error al cargar vista previa:', error);
        setSnackbar({ open: true, message: 'No se pudo cargar la vista previa', severity: 'error' });
        setPreviewDialog(prev => ({ ...prev, loading: false }));
      }
    };

    const handleDescargarDocumento = async (documento) => {
      // Si tiene idDocumentoSubido es un doc subido por el agente → descarga real desde Mongo
      if (documento.idDocumentoSubido) {
        try {
          setSnackbar({ open: true, message: 'Descargando archivo...', severity: 'info' });
          await descargarArchivo(documento.idDocumentoSubido, documento.nombreOriginal);
          setSnackbar({ open: true, message: 'Archivo descargado correctamente', severity: 'success' });
        } catch (error) {
          console.error('Error al descargar:', error);
          setSnackbar({ open: true, message: 'Error al descargar el archivo', severity: 'error' });
        }
        return;
      }

      // Documentos locales (certificados, cumplimiento) → comportamiento anterior
      setSnackbar({ open: true, message: `Descargando ${documento.nombreArchivo || documento.nombreOriginal}...`, severity: 'info' });
      setTimeout(() => setSnackbar({ open: true, message: 'Documento descargado correctamente', severity: 'success' }), 1000);
    };
    
    const handleEliminarDocumento = (seccion, documentoId, documento, itemName, horas = 0, index = null) => {
      setDeleteDialog({ open: true, seccion, documentoId, tipo: 'documento', nombre: documento.nombreArchivo || documento.documento || documento.nombre, horas, itemName, itemIndex: index });
    };

    // Eliminar documento subido de apartado dinámico
    const handleEliminarDocumentoSubido = (doc, idApartado) => {
      setDeleteDialog({
        open: true,
        seccion: 'documentoSubido',
        subseccion: doc.idDocumentoPlantilla,
        documentoId: doc.idDocumentoSubido,
        tipo: 'documentoSubido',
        nombre: doc.nombreOriginal,
        horas: 0,
        itemName: '',
        itemIndex: idApartado  // reutilizamos itemIndex para guardar el idApartado
      });
    };

    // Eliminar documento de programa
    const handleEliminarDocumentoPrograma = (programaId, documento) => {
      setDeleteDialog({
        open: true,
        seccion: 'programa',
        subseccion: documento.idCertificacion,
        documentoId: documento.id,
        tipo: 'programa',
        nombre: documento.nombreArchivo || documento.nombre,
        horas: 0,
        itemName: '',
        itemIndex: programaId
      });
    };

    // Enviar certificación de programa a validación
    const handleEnviarValidacionPrograma = (programa, documento) => {
      const fechaActual = new Date().toLocaleDateString('es-MX', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      setValidacionDialog({
        open: true,
        programa,
        documento,
        fecha: fechaActual
      });
    };

    const handleConfirmarValidacionPrograma = () => {
      const { programa, documento, fecha } = validacionDialog;
      
      // Guardar estado de validación para este programa
      setEstadosValidacionProgramas(prev => ({
        ...prev,
        [programa.id]: {
          enviado: true,
          fechaEnvio: fecha,
          estado: 'enviado',
          documentoId: documento.id
        }
      }));
      
      setSnackbar({ 
        open: true, 
        message: `Certificación enviada a validación correctamente`, 
        severity: 'success' 
      });
      
      setValidacionDialog({ open: false, programa: null, documento: null, fecha: '' });
    };

    const handleCerrarValidacionDialog = () => {
      setValidacionDialog({ open: false, programa: null, documento: null, fecha: '' });
    };

    const handleConfirmarEliminacion = async () => {
      const { seccion, documentoId, horas, itemName, itemIndex, subseccion } = deleteDialog;

      if (seccion === 'formacionEtica') {
        setCertificadosData(prev => {
          const cert = prev.formacionEtica.certificaciones.find(c => c.id === documentoId);
          return { ...prev, formacionEtica: { ...prev.formacionEtica, certificaciones: prev.formacionEtica.certificaciones.filter(c => c.id !== documentoId), horasAcumuladas: prev.formacionEtica.horasAcumuladas - (cert?.horas || 0) } };
        });
      } else if (seccion === 'actualizacionTecnica') {
        setCertificadosData(prev => {
          const cert = prev.actualizacionTecnica.certificaciones.find(c => c.id === documentoId);
          return { ...prev, actualizacionTecnica: { ...prev.actualizacionTecnica, certificaciones: prev.actualizacionTecnica.certificaciones.filter(c => c.id !== documentoId), horasAcumuladas: prev.actualizacionTecnica.horasAcumuladas - (cert?.horas || 0) } };
        });
      } else if (seccion === 'seguridadCadenaSuministro' || seccion === 'antisobornos') {
        setCumplimientoData(prev => ({ ...prev, [seccion]: { ...prev[seccion], documento: null, estado: 'pendiente', fechaRevision: null, nombreDocumento: '' } }));
      } else if (seccion === 'documentoSubido') {
        try {
          await eliminarDocumentoSubido(documentoId);
          const idApartado = itemIndex;
          const idPlantilla = subseccion;
          setArchivosSubidos(prev => {
            const apartadoDocs = { ...(prev[idApartado] || {}) };
            delete apartadoDocs[idPlantilla];
            return { ...prev, [idApartado]: apartadoDocs };
          });
        } catch (error) {
          console.error('Error al eliminar documento:', error);
          setSnackbar({ open: true, message: 'Error al eliminar el documento', severity: 'error' });
          setDeleteDialog({ open: false, seccion: '', subseccion: '', documentoId: null, tipo: '', nombre: '', horas: 0, itemName: '', itemIndex: null });
          return;
        }
      } else if (seccion === 'programa') {
        try {
          await eliminarCertificacionCompleta(documentoId, subseccion);
          const programaId = itemIndex;
          setDocumentosProgramas(prev => {
            const newDocs = { ...prev };
            delete newDocs[programaId];
            return newDocs;
          });
          
          // También eliminar el estado de validación si existe
          setEstadosValidacionProgramas(prev => {
            const newState = { ...prev };
            delete newState[programaId];
            return newState;
          });
        } catch (error) {
          console.error('Error al eliminar certificación:', error);
          setSnackbar({ open: true, message: 'Error al eliminar la certificación', severity: 'error' });
          setDeleteDialog({ open: false, seccion: '', subseccion: '', documentoId: null, tipo: '', nombre: '', horas: 0, itemName: '', itemIndex: null });
          return;
        }
      }

      setSnackbar({ open: true, message: 'Documento eliminado correctamente', severity: 'success' });
      setDeleteDialog({ open: false, seccion: '', subseccion: '', documentoId: null, tipo: '', nombre: '', horas: 0, itemName: '', itemIndex: null });
    };

    // ── Cumplimiento organizacional ──────────────────────────
    const handleDescripcionChange = (tipo, valor) => setCumplimientoData({ ...cumplimientoData, [tipo]: { ...cumplimientoData[tipo], descripcion: valor } });
    const handleVigenciaChange = (tipo, valor) => setCumplimientoData({ ...cumplimientoData, [tipo]: { ...cumplimientoData[tipo], vigencia: valor } });

    const handleOpenUploadDialog = (tipo, titulo, idDocumentoPlantilla = null) => {
      setUploadDialog({ 
        open: true, 
        tipo, 
        titulo, 
        archivo: null, 
        nombreArchivo: '',
        idDocumentoPlantilla,
        uploading: false,
        progress: 0
      });
    };

    const handleCumplimientoFileSelect = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) { setSnackbar({ open: true, message: 'El archivo no puede ser mayor a 10MB', severity: 'error' }); return; }
      const tiposPermitidos = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!tiposPermitidos.includes(file.type)) { setSnackbar({ open: true, message: 'Formato no permitido. Use PDF, DOC o DOCX', severity: 'error' }); return; }
      setUploadDialog({ ...uploadDialog, archivo: file, nombreArchivo: file.name });
    };

    const handleGuardarDocumentoCumplimiento = async () => {
      if (!uploadDialog.archivo) return;

      // Mostrar progreso de subida
      setUploadDialog(prev => ({ ...prev, uploading: true, progress: 0 }));
      
      // Simular progreso (en producción, esto vendría del servicio real)
      const progressInterval = setInterval(() => {
        setUploadDialog(prev => {
          if (prev.progress >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, progress: prev.progress + 10 };
        });
      }, 200);

      // ── Apartado dinámico ──────────────────────────────────
      if (uploadDialog.tipo?.startsWith('apartado_')) {
        const idApartado = parseInt(uploadDialog.tipo.replace('apartado_', ''));
        try {
          const payload = {
            idExpediente: expediente?.id,
            idInstancia: user.instanciaId,
            idApartado: idApartado,
            idDocumentoPlantilla: uploadDialog.idDocumentoPlantilla,
            nombreOriginal: uploadDialog.archivo.name,
            requiereValidacion: false, // Cambiado a false - no requiere validación
            usuarioCarga: user.id,
          };
          
          // Completar progreso
          clearInterval(progressInterval);
          setUploadDialog(prev => ({ ...prev, progress: 100 }));
          
          const documentoGuardado = await subirDocumento(payload, uploadDialog.archivo);
          
          setTimeout(() => {
            setArchivosSubidos(prev => ({
              ...prev,
              [idApartado]: {
                ...(prev[idApartado] || {}),
                [uploadDialog.idDocumentoPlantilla]: {
                  ...documentoGuardado,
                  fechaSubida: new Date().toLocaleDateString('es-MX')
                }
              }
            }));
            setSnackbar({ open: true, message: `Documento "${uploadDialog.archivo.name}" subido correctamente`, severity: 'success' });
            setUploadDialog({ open: false, tipo: '', titulo: '', archivo: null, nombreArchivo: '', uploading: false, progress: 0 });
          }, 500);
        } catch (error) {
          clearInterval(progressInterval);
          console.error('Error al subir documento:', error);
          setSnackbar({ open: true, message: 'Error al subir el documento', severity: 'error' });
          setUploadDialog(prev => ({ ...prev, uploading: false, progress: 0 }));
        }
        return;
      }

      // ── Cumplimiento organizacional ────────────────────────
      const tipo = uploadDialog.tipo;
      const nuevoDocumento = { 
        id: Date.now(), 
        nombreArchivo: uploadDialog.nombreArchivo, 
        archivo: uploadDialog.archivo, 
        fechaSubida: new Date().toLocaleDateString('es-MX') 
      };
      
      // Completar progreso
      clearInterval(progressInterval);
      setUploadDialog(prev => ({ ...prev, progress: 100 }));
      
      setTimeout(() => {
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
        setSnackbar({ open: true, message: `Documento "${uploadDialog.nombreArchivo}" subido correctamente`, severity: 'success' });
        setUploadDialog({ open: false, tipo: '', titulo: '', archivo: null, nombreArchivo: '', uploading: false, progress: 0 });
      }, 500);
    };

    const handleVerDocumentoCumplimiento = (tipo) => {
      const doc = cumplimientoData[tipo];
      if (doc?.documento) setPreviewDialog({ open: true, documento: doc.documento, nombre: doc.nombreDocumento || 'documento.pdf', tipo });
    };

    const handleEliminarDocumentoCumplimiento = (tipo) => {
      setDeleteDialog({ open: true, seccion: tipo, tipo: 'cumplimiento', nombre: cumplimientoData[tipo].nombreDocumento || 'documento' });
    };

    // ============================================================
    // RENDER APARTADO DINÁMICO (con diseño mejorado)
    // ============================================================
    const renderApartadoDinamico = (apartado) => {
      const tieneDocumentos = apartado.documentos?.length > 0;
      const tieneProgramas = apartado.programas?.length > 0;
      const documentosSubidosCount = Object.keys(archivosSubidos[apartado.idApartado] || {}).length;
      const programasCompletados = apartado.programas?.filter(p => documentosProgramas[p.id]).length || 0;
      
      const progresoTotal = tieneDocumentos || tieneProgramas 
        ? Math.round(((documentosSubidosCount + programasCompletados) / 
            ((tieneDocumentos ? apartado.documentos.length : 0) + (tieneProgramas ? apartado.programas.length : 0))) * 100)
        : 0;

      return (
        <Accordion
          key={apartado.id}
          expanded={expanded === apartado.id}
          onChange={handleAccordionChange(apartado.id)}
          sx={{ 
            mb: 2, 
            border: '1px solid', 
            borderColor: progresoTotal === 100 ? colors.status.success + '80' : colors.primary.light + '40',
            borderRadius: '8px !important', 
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            '&:before': { display: 'none' },
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: expanded === apartado.id ? '#f8f9fa' : 'white',
              '& .MuiAccordionSummary-content': {
                alignItems: 'center'
              }
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
                backgroundColor: progresoTotal === 100 ? '#e8f5e9' : (apartado.esGlobal ? '#f3e5f5' : '#e3f2fd'),
                color: progresoTotal === 100 ? colors.status.success : (apartado.esGlobal ? colors.accents.purple : colors.primary.main)
              }}>
                {getIconForApartado(apartado.icono)}
              </Box>
              
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: '700', color: colors.text.primary, fontSize: '1rem' }}>
                  {apartado.nombre}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', mt: 0.5 }}>
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

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {progresoTotal > 0 && (
                  <Box sx={{ width: '80px', display: { xs: 'none', sm: 'block' } }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={progresoTotal} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: '#f0f0f0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: progresoTotal === 100 ? colors.status.success : colors.primary.main
                        }
                      }} 
                    />
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {tieneDocumentos && (
                    <Tooltip title="Documentos requeridos">
                      <Chip
                        icon={<DescriptionIcon sx={{ fontSize: '0.8rem !important' }} />}
                        label={`${documentosSubidosCount}/${apartado.documentos.length}`}
                        size="small"
                        color={documentosSubidosCount === apartado.documentos.length ? "success" : "default"}
                        sx={{ height: '24px', fontSize: '0.7rem' }}
                      />
                    </Tooltip>
                  )}
                  {tieneProgramas && (
                    <Tooltip title="Programas">
                      <Chip
                        icon={<SchoolIcon sx={{ fontSize: '0.8rem !important' }} />}
                        label={`${programasCompletados}/${apartado.programas.length}`}
                        size="small"
                        color={programasCompletados === apartado.programas.length ? "success" : "primary"}
                        sx={{ height: '24px', fontSize: '0.7rem' }}
                      />
                    </Tooltip>
                  )}
                  {apartado.obligatorio && (
                    <Chip 
                      label="Obligatorio" 
                      size="small" 
                      color="error" 
                      sx={{ height: '20px', fontSize: '0.65rem' }} 
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails sx={{ pt: 3, pb: 3, backgroundColor: '#fafafa' }}>
            
            {/* ── DOCUMENTOS REQUERIDOS ── */}
            {tieneDocumentos && (
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 3, 
                  mb: tieneProgramas ? 3 : 0, 
                  borderRadius: 2,
                  border: `2px solid ${documentosSubidosCount === apartado.documentos.length ? colors.status.success + '80' : colors.primary.main + '20'}`
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: '600', 
                    color: colors.text.primary, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5 
                  }}>
                    <DescriptionIcon sx={{ color: documentosSubidosCount === apartado.documentos.length ? colors.status.success : colors.primary.main }} />
                    Documentos Requeridos
                    {documentosSubidosCount === apartado.documentos.length && (
                      <Chip 
                        icon={<CheckCircleIcon />} 
                        label="Completado" 
                        size="small" 
                        color="success" 
                        sx={{ ml: 1, height: '24px' }} 
                      />
                    )}
                  </Typography>
                </Box>

                {/* CAMBIO: Stack en lugar de Grid container */}
                <Stack spacing={2}>
                  {apartado.documentos.map((doc) => {
                    const docSubido = archivosSubidos[apartado.idApartado]?.[doc.idDocumento];
                    
                    return (
                      <Paper 
                        key={doc.idDocumento}
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          width: '100%',
                          boxSizing: 'border-box',
                          border: `1px solid ${docSubido ? colors.status.success + '40' : colors.primary.main + '20'}`,
                          borderLeft: `4px solid ${docSubido ? colors.status.success : colors.primary.main}`,
                          backgroundColor: 'white'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            backgroundColor: docSubido ? '#e8f5e9' : `${colors.primary.main}10`,
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {docSubido ? (
                              <CheckCircleIcon sx={{ color: colors.status.success, fontSize: '1.2rem' }} />
                            ) : (
                              <DescriptionIcon sx={{ color: colors.primary.main, fontSize: '1.2rem' }} />
                            )}
                          </Box>

                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: '700', color: colors.text.primary }}>
                                  {doc.nombreArchivo}
                                </Typography>
                                {doc.descripcion && (
                                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mt: 0.5 }}>
                                    {doc.descripcion}
                                  </Typography>
                                )}
                              </Box>
                              
                              {doc.obligatorio && (
                                <Chip 
                                  label="Obligatorio" 
                                  size="small" 
                                  color="error" 
                                  sx={{ height: '20px', fontSize: '0.65rem', flexShrink: 0 }} 
                                />
                              )}
                            </Box>

                            {docSubido ? (
                              <DocumentoSubidoItem
                                documento={docSubido}
                                onVer={handleVerDocumento}
                                onDescargar={handleDescargarDocumento}
                                onEliminar={(doc) => handleEliminarDocumentoSubido(doc, apartado.idApartado)}
                                mostrarFecha={true}
                              />
                            ) : (
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<CloudUploadIcon />}
                                  onClick={() => handleOpenUploadDialog(
                                    `apartado_${apartado.idApartado}`,
                                    doc.nombreArchivo,
                                    doc.idDocumento
                                  )}
                                  sx={{ 
                                    textTransform: 'none', 
                                    fontSize: '0.8rem', 
                                    color: colors.primary.main, 
                                    borderColor: colors.primary.main,
                                    '&:hover': {
                                      backgroundColor: `${colors.primary.main}10`
                                    }
                                  }}
                                >
                                  Subir Documento
                                </Button>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    );
                  })}
                </Stack>
              </Paper>
            )}

            {/* ── PROGRAMAS Y CERTIFICACIONES ── */}
            {tieneProgramas && (
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: `2px solid ${programasCompletados === apartado.programas.length ? colors.status.success + '80' : colors.accents.purple + '20'}`
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: '600', 
                    color: colors.text.primary, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5 
                  }}>
                    <SchoolIcon sx={{ color: programasCompletados === apartado.programas.length ? colors.status.success : colors.accents.purple }} />
                    Programas y Certificaciones
                    {programasCompletados === apartado.programas.length && (
                      <Chip 
                        icon={<CheckCircleIcon />} 
                        label="Completado" 
                        size="small" 
                        color="success" 
                        sx={{ ml: 1, height: '24px' }} 
                      />
                    )}
                  </Typography>
                </Box>

                {/* CAMBIO: Stack en lugar de Grid container */}
                <Stack spacing={2}>
                  {apartado.programas.map((prog) => {
                    const docPrograma = documentosProgramas[prog.id];
                    const estadoValidacion = estadosValidacionProgramas[prog.id];
                    
                    return (
                      <Paper 
                        key={prog.id}
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          width: '100%',
                          boxSizing: 'border-box',
                          border: `1px solid ${docPrograma ? colors.status.success + '40' : colors.accents.purple + '20'}`,
                          borderLeft: `4px solid ${docPrograma ? colors.status.success : colors.accents.purple}`,
                          backgroundColor: 'white'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            backgroundColor: docPrograma ? '#e8f5e9' : `${colors.accents.purple}10`,
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {docPrograma ? (
                              <CheckCircleIcon sx={{ color: colors.status.success, fontSize: '1.2rem' }} />
                            ) : (
                              <SchoolIcon sx={{ color: colors.accents.purple, fontSize: '1.2rem' }} />
                            )}
                          </Box>

                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: '700', color: colors.text.primary }}>
                                  {prog.nombre}
                                </Typography>
                                {prog.descripcion && (
                                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mt: 0.5 }}>
                                    {prog.descripcion}
                                  </Typography>
                                )}
                              </Box>
                              
                              <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                                
                                {prog.horasRequeridas && (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-end' }}>
                                    <Chip 
                                      label={`Horas requeridas: ${prog.horasRequeridas} hrs`} 
                                      size="small" 
                                      sx={{ 
                                        height: '20px', 
                                        fontSize: '0.65rem', 
                                        backgroundColor: `${colors.accents.purple}15`, 
                                        color: colors.accents.purple
                                      }} 
                                    />
                                    <Chip 
                                      label={
                                        docPrograma
                                          ? docPrograma.horas >= prog.horasRequeridas
                                            ? '✓ Horas completas'
                                            : `Horas faltantes: ${prog.horasRequeridas - docPrograma.horas} hrs`
                                          : `Horas faltantes: ${prog.horasRequeridas} hrs`
                                      }
                                      size="small" 
                                      sx={{ 
                                        height: '20px', 
                                        fontSize: '0.65rem', 
                                        backgroundColor: docPrograma && docPrograma.horas >= prog.horasRequeridas 
                                          ? '#e8f5e9' 
                                          : '#fff3e0',
                                        color: docPrograma && docPrograma.horas >= prog.horasRequeridas 
                                          ? colors.status.success 
                                          : '#e65100'
                                      }} 
                                    />
                                  </Box>
                                )}
                              </Box>
                            </Box>

                            {docPrograma ? (
                              <CertificacionProgramaItem
                                documento={docPrograma}
                                programa={prog}
                                onVer={(doc) => {
                                  setPreviewDialog({
                                    open: true, 
                                    documento: null,
                                    nombre: doc.nombreArchivo,
                                    tipo: detectarTipoArchivo(doc.nombreArchivo),
                                    seccion: prog.nombre, 
                                    loading: true, 
                                    objectUrl: null
                                  });
                                  obtenerArchivoBlobCertificacion(doc.id)
                                    .then(blob => {
                                      const objectUrl = URL.createObjectURL(blob);
                                      setPreviewDialog(prev => ({ ...prev, loading: false, objectUrl }));
                                    })
                                    .catch(error => {
                                      setSnackbar({ 
                                        open: true, 
                                        message: `Error ${error.response?.status}: No se pudo cargar el archivo`, 
                                        severity: 'error' 
                                      });
                                      setPreviewDialog(prev => ({ ...prev, loading: false }));
                                    });
                                }}
                                onDescargar={(doc) => {
                                  descargarArchivoCertificacion(doc.id, doc.nombreArchivo)
                                    .catch(error => {
                                      setSnackbar({ 
                                        open: true, 
                                        message: 'Error al descargar el archivo', 
                                        severity: 'error' 
                                      });
                                    });
                                }}
                                onEliminar={(doc) => handleEliminarDocumentoPrograma(prog.id, doc)}
                                onEnviarValidacion={handleEnviarValidacionPrograma}
                                estadoValidacion={estadoValidacion}
                              />
                            ) : (
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  startIcon={<CloudUploadIcon sx={{ fontSize: '0.8rem' }} />}
                                  onClick={() => { 
                                    setProgSeleccionado(prog); 
                                    setCertModalOpen(true); 
                                  }}
                                  sx={{
                                    textTransform: 'none', 
                                    fontSize: '0.75rem',
                                    bgcolor: colors.accents.purple,
                                    '&:hover': { bgcolor: '#5a4bd1' },
                                    height: '32px', 
                                    px: 2
                                  }}
                                >
                                  Subir Certificación
                                </Button>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    );
                  })}
                </Stack>
              </Paper>
            )}
          </AccordionDetails>
        </Accordion>
      );
    };

    // ============================================================
    // RENDER CERTIFICADOS
    // ============================================================
    const renderCertificados = () => {
      const section = informacionComplementaria.find(s => s.id === 'certificados');
      const formacionCompleta = certificadosData.formacionEtica.horasAcumuladas >= certificadosData.formacionEtica.horasRequeridas;
      const tecnicaCompleta = certificadosData.actualizacionTecnica.horasAcumuladas >= certificadosData.actualizacionTecnica.horasRequeridas;
      const progresoFormacion = certificadosData.formacionEtica.horasRequeridas > 0 ? Math.min(100, Math.round((certificadosData.formacionEtica.horasAcumuladas / certificadosData.formacionEtica.horasRequeridas) * 100)) : 0;
      const progresoTecnica = certificadosData.actualizacionTecnica.horasRequeridas > 0 ? Math.min(100, Math.round((certificadosData.actualizacionTecnica.horasAcumuladas / certificadosData.actualizacionTecnica.horasRequeridas) * 100)) : 0;
      const tieneDocumentos = certificadosTienenDocumentos();
      const totalCompletado = formacionCompleta && tecnicaCompleta;

      return (
        <Accordion 
          key={section.id} 
          expanded={expanded === section.id} 
          onChange={handleAccordionChange(section.id)}
          sx={{ 
            mb: 2, 
            border: '1px solid', 
            borderColor: totalCompletado ? colors.status.success + '80' : colors.accents.blue + '40',
            borderRadius: '8px !important', 
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            '&:before': { display: 'none' },
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />} 
            sx={{
              backgroundColor: expanded === section.id ? '#f8f9fa' : 'white',
              '& .MuiAccordionSummary-content': {
                alignItems: 'center'
              }
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
                backgroundColor: totalCompletado ? '#e8f5e9' : '#e3f2fd',
                color: totalCompletado ? colors.status.success : colors.accents.blue 
              }}>
                {section.icon}
              </Box>
              
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: '700', color: colors.text.primary, fontSize: '1rem', mb: 0.5 }}>
                  {section.title}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  {totalCompletado ? 'Completado' : 'En progreso'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Barra de progreso general */}
                <Box sx={{ width: '100px', display: { xs: 'none', md: 'block' } }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(progresoFormacion + progresoTecnica) / 2} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: '#f0f0f0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: totalCompletado ? colors.status.success : colors.accents.blue
                      }
                    }} 
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={`${certificadosData.formacionEtica.certificaciones.length + certificadosData.actualizacionTecnica.certificaciones.length} certs`} 
                    size="small" 
                    color={totalCompletado ? "success" : "primary"} 
                    sx={{ height: '24px', fontSize: '0.75rem', fontWeight: '600' }} 
                  />
                </Box>
              </Box>
            </Box>
          </AccordionSummary>
          
          <AccordionDetails sx={{ pt: 3, pb: 3, backgroundColor: '#fafafa' }}>
            {/* Formación Ética */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 2, 
                border: `2px solid ${formacionCompleta ? colors.status.success + '80' : colors.accents.blue + '20'}`,
                backgroundColor: 'white'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: '600', 
                  color: colors.text.primary, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5 
                }}>
                  <SchoolIcon sx={{ color: formacionCompleta ? colors.status.success : colors.accents.blue }} />
                  Formación Ética y Cumplimiento
                  {formacionCompleta && (
                    <Chip 
                      icon={<CheckCircleIcon />} 
                      label="Completado" 
                      size="small" 
                      color="success" 
                      sx={{ ml: 1, height: '24px' }} 
                    />
                  )}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Horas: <strong>{certificadosData.formacionEtica.horasAcumuladas}/{certificadosData.formacionEtica.horasRequeridas}</strong>
                  </Typography>
                  <Box sx={{ width: '100px' }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={progresoFormacion} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4, 
                        backgroundColor: '#e0e0e0', 
                        '& .MuiLinearProgress-bar': { 
                          backgroundColor: formacionCompleta ? colors.status.success : colors.accents.blue 
                        } 
                      }} 
                    />
                  </Box>
                </Box>
              </Box>

              {certificadosData.formacionEtica.certificaciones.length > 0 ? (
                <List dense sx={{ py: 0, mb: 2 }}>
                  {certificadosData.formacionEtica.certificaciones.map((cert) => (
                    <ListItem 
                      key={cert.id} 
                      sx={{ 
                        py: 1.5, 
                        px: 2, 
                        mb: 1, 
                        borderRadius: 2, 
                        backgroundColor: '#fff', 
                        border: `1px solid ${colors.primary.main}20`,
                        '&:hover': { backgroundColor: '#f8f9fa' } 
                      }}
                      secondaryAction={
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Ver documento">
                            <IconButton 
                              size="small" 
                              onClick={() => handleVerDocumento(cert, 'certificados')} 
                              sx={{ color: colors.primary.main, backgroundColor: `${colors.primary.main}15` }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Descargar">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDescargarDocumento(cert)} 
                              sx={{ color: colors.status.success, backgroundColor: '#e8f5e9' }}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton 
                              size="small" 
                              onClick={() => handleEliminarDocumento('formacionEtica', cert.id, cert, cert.nombre, cert.horas)} 
                              sx={{ color: colors.status.error, backgroundColor: '#ffebee' }}
                            >
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: '600' }}>{cert.nombre}</Typography>
                            <Chip 
                              label={`${cert.horas} hrs`} 
                              size="small" 
                              sx={{ height: '20px', fontSize: '0.7rem', backgroundColor: colors.accents.blue, color: 'white' }} 
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            {cert.institucion} •{cert.estado} • {new Date(cert.fecha).toLocaleDateString('es-MX')} • Subido: {cert.fechaSubida}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }} icon={<InfoIcon />}>
                  No hay certificaciones cargadas. Usa "Agregar Certificación" para comenzar.
                </Alert>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                <Button 
                  startIcon={<AddIcon />} 
                  size="small" 
                  variant="outlined" 
                  onClick={() => handleOpenAddDialog('certificados', '', 'formacionEtica')} 
                  sx={{ 
                    textTransform: 'none', 
                    px: 3, 
                    color: colors.primary.main, 
                    borderColor: colors.primary.main,
                    '&:hover': {
                      backgroundColor: `${colors.primary.main}10`
                    }
                  }}
                >
                  Agregar Certificación
                </Button>
              </Box>
            </Paper>

            {/* Actualización Técnica */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 2, 
                border: `2px solid ${tecnicaCompleta ? colors.status.success + '80' : colors.secondary.main + '20'}`,
                backgroundColor: 'white'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: '600', 
                  color: colors.text.primary, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5 
                }}>
                  <UpdateIcon sx={{ color: tecnicaCompleta ? colors.status.success : colors.secondary.main }} />
                  Actualización Técnica y Aduanera
                  {tecnicaCompleta && (
                    <Chip 
                      icon={<CheckCircleIcon />} 
                      label="Completado" 
                      size="small" 
                      color="success" 
                      sx={{ ml: 1, height: '24px' }} 
                    />
                  )}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Horas: <strong>{certificadosData.actualizacionTecnica.horasAcumuladas}/{certificadosData.actualizacionTecnica.horasRequeridas}</strong>
                  </Typography>
                  <Box sx={{ width: '100px' }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={progresoTecnica} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4, 
                        backgroundColor: '#e0e0e0', 
                        '& .MuiLinearProgress-bar': { 
                          backgroundColor: tecnicaCompleta ? colors.status.success : colors.secondary.main 
                        } 
                      }} 
                    />
                  </Box>
                </Box>
              </Box>

              {certificadosData.actualizacionTecnica.certificaciones.length > 0 ? (
                <List dense sx={{ py: 0, mb: 2 }}>
                  {certificadosData.actualizacionTecnica.certificaciones.map((cert) => (
                    <ListItem 
                      key={cert.id} 
                      sx={{ 
                        py: 1.5, 
                        px: 2, 
                        mb: 1, 
                        borderRadius: 2, 
                        backgroundColor: '#fff', 
                        border: `1px solid ${colors.primary.main}20`,
                        '&:hover': { backgroundColor: '#f8f9fa' } 
                      }}
                      secondaryAction={
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Ver documento">
                            <IconButton 
                              size="small" 
                              onClick={() => handleVerDocumento(cert, 'certificados')} 
                              sx={{ color: colors.primary.main, backgroundColor: `${colors.primary.main}15` }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Descargar">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDescargarDocumento(cert)} 
                              sx={{ color: colors.status.success, backgroundColor: '#e8f5e9' }}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton 
                              size="small" 
                              onClick={() => handleEliminarDocumento('actualizacionTecnica', cert.id, cert, cert.nombre, cert.horas)} 
                              sx={{ color: colors.status.error, backgroundColor: '#ffebee' }}
                            >
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: '600' }}>{cert.nombre}</Typography>
                            <Chip 
                              label={`${cert.horas} hrs`} 
                              size="small" 
                              sx={{ height: '20px', fontSize: '0.7rem', backgroundColor: colors.secondary.main, color: 'white' }} 
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            {cert.institucion} • {new Date(cert.fecha).toLocaleDateString('es-MX')} • Subido: {cert.fechaSubida}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }} icon={<InfoIcon />}>
                  No hay certificaciones cargadas. Usa "Agregar Certificación" para comenzar.
                </Alert>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                <Button 
                  startIcon={<AddIcon />} 
                  size="small" 
                  variant="outlined" 
                  onClick={() => handleOpenAddDialog('certificados', '', 'actualizacionTecnica')} 
                  sx={{ 
                    textTransform: 'none', 
                    px: 3, 
                    color: colors.primary.main, 
                    borderColor: colors.primary.main,
                    '&:hover': {
                      backgroundColor: `${colors.primary.main}10`
                    }
                  }}
                >
                  Agregar Certificación
                </Button>
              </Box>
            </Paper>
          </AccordionDetails>
        </Accordion>
      );
    };

    // ============================================================
    // RENDER CUMPLIMIENTO ORGANIZACIONAL
    // ============================================================
    const renderCumplimientoOrganizacional = () => {
      const section = informacionComplementaria.find(s => s.id === 'cumplimiento_organizacional');
      const seguridadCompleta = cumplimientoData.seguridadCadenaSuministro.documento !== null;
      const antisobornosCompleto = cumplimientoData.antisobornos.documento !== null;
      const tieneDocumentos = cumplimientoTieneDocumentos();
      const totalCompletado = seguridadCompleta && antisobornosCompleto;

      return (
        <Accordion 
          key={section.id} 
          expanded={expanded === section.id} 
          onChange={handleAccordionChange(section.id)}
          sx={{ 
            mb: 2, 
            border: '1px solid', 
            borderColor: totalCompletado ? colors.status.success + '80' : colors.status.warning + '40',
            borderRadius: '8px !important', 
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            '&:before': { display: 'none' },
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />} 
            sx={{
              backgroundColor: expanded === section.id ? '#f8f9fa' : 'white',
              '& .MuiAccordionSummary-content': {
                alignItems: 'center'
              }
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
                backgroundColor: totalCompletado ? '#e8f5e9' : '#fff3e0',
                color: totalCompletado ? colors.status.success : colors.status.warning 
              }}>
                {section.icon}
              </Box>
              
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: '700', color: colors.text.primary, fontSize: '1rem', mb: 0.5 }}>
                  {section.title}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  label={`${(seguridadCompleta ? 1 : 0) + (antisobornosCompleto ? 1 : 0)}/2`} 
                  size="small" 
                  color={totalCompletado ? "success" : "warning"} 
                  sx={{ height: '24px', fontSize: '0.75rem', fontWeight: '600' }} 
                />
              </Box>
            </Box>
          </AccordionSummary>
          
          <AccordionDetails sx={{ pt: 3, pb: 3, backgroundColor: '#fafafa' }}>
            {/* Seguridad Cadena de Suministros */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 2, 
                border: `2px solid ${seguridadCompleta ? colors.status.success + '80' : colors.primary.main + '20'}`,
                backgroundColor: 'white'
              }}
            >
              <Typography variant="h6" sx={{ 
                fontWeight: '600', 
                color: colors.text.primary, 
                mb: 3, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5 
              }}>
                <SecurityIcon sx={{ color: seguridadCompleta ? colors.status.success : colors.text.secondary }} />
                Sistema de seguridad de Cadena de Suministros
                {seguridadCompleta && (
                  <Chip 
                    icon={<CheckCircleIcon />} 
                    label="Completado" 
                    size="small" 
                    color="success" 
                    sx={{ ml: 1, height: '24px' }} 
                  />
                )}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    multiline 
                    rows={4} 
                    label="Descripción del Sistema" 
                    value={cumplimientoData.seguridadCadenaSuministro.descripcion} 
                    onChange={(e) => handleDescripcionChange('seguridadCadenaSuministro', e.target.value)} 
                    sx={{ mb: 2 }} 
                    InputLabelProps={{ shrink: true }} 
                    helperText="Describa el sistema de gestión de seguridad para la cadena de suministro"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    type="date" 
                    label="Fecha de Vigencia" 
                    value={cumplimientoData.seguridadCadenaSuministro.vigencia || ''} 
                    onChange={(e) => handleVigenciaChange('seguridadCadenaSuministro', e.target.value)} 
                    sx={{ mb: 2 }} 
                    InputLabelProps={{ shrink: true }} 
                    helperText="Fecha hasta la cual es válido el sistema" 
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    {cumplimientoData.seguridadCadenaSuministro.documento ? (
                      <DocumentoSubidoItem
                        documento={{
                          nombreArchivo: cumplimientoData.seguridadCadenaSuministro.nombreDocumento,
                          fechaSubida: cumplimientoData.seguridadCadenaSuministro.fechaRevision
                        }}
                        onVer={() => handleVerDocumentoCumplimiento('seguridadCadenaSuministro')}
                        onDescargar={() => handleDescargarDocumento({ 
                          nombreArchivo: cumplimientoData.seguridadCadenaSuministro.nombreDocumento 
                        })}
                        onEliminar={() => handleEliminarDocumentoCumplimiento('seguridadCadenaSuministro')}
                        mostrarFecha={true}
                      />
                    ) : (
                      <Button 
                        fullWidth 
                        startIcon={<CloudUploadIcon />} 
                        variant="outlined" 
                        onClick={() => handleOpenUploadDialog('seguridadCadenaSuministro', 'Sistema de seguridad de Cadena de Suministros')} 
                        sx={{ 
                          textTransform: 'none', 
                          py: 1.5, 
                          color: colors.primary.main, 
                          borderColor: colors.primary.main,
                          '&:hover': {
                            backgroundColor: `${colors.primary.main}10`
                          }
                        }}
                      >
                        Cargar Documento del Sistema
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Antisobornos */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                border: `2px solid ${antisobornosCompleto ? colors.status.success + '80' : colors.primary.main + '20'}`,
                backgroundColor: 'white'
              }}
            >
              <Typography variant="h6" sx={{ 
                fontWeight: '600', 
                color: colors.text.primary, 
                mb: 3, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5 
              }}>
                <GavelIcon sx={{ color: antisobornosCompleto ? colors.status.success : colors.text.secondary }} />
                Políticas Antisobornos
                {antisobornosCompleto && (
                  <Chip 
                    icon={<CheckCircleIcon />} 
                    label="Completado" 
                    size="small" 
                    color="success" 
                    sx={{ ml: 1, height: '24px' }} 
                  />
                )}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    multiline 
                    rows={4} 
                    label="Descripción de las Políticas" 
                    value={cumplimientoData.antisobornos.descripcion} 
                    onChange={(e) => handleDescripcionChange('antisobornos', e.target.value)} 
                    sx={{ mb: 2 }} 
                    InputLabelProps={{ shrink: true }} 
                    helperText="Describa las políticas y procedimientos antisoborno" 
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    type="date" 
                    label="Fecha de Vigencia" 
                    value={cumplimientoData.antisobornos.vigencia || ''} 
                    onChange={(e) => handleVigenciaChange('antisobornos', e.target.value)} 
                    sx={{ mb: 2 }} 
                    InputLabelProps={{ shrink: true }} 
                    helperText="Fecha hasta la cual son válidas las políticas" 
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    {cumplimientoData.antisobornos.documento ? (
                      <DocumentoSubidoItem
                        documento={{
                          nombreArchivo: cumplimientoData.antisobornos.nombreDocumento,
                          fechaSubida: cumplimientoData.antisobornos.fechaRevision
                        }}
                        onVer={() => handleVerDocumentoCumplimiento('antisobornos')}
                        onDescargar={() => handleDescargarDocumento({ 
                          nombreArchivo: cumplimientoData.antisobornos.nombreDocumento 
                        })}
                        onEliminar={() => handleEliminarDocumentoCumplimiento('antisobornos')}
                        mostrarFecha={true}
                      />
                    ) : (
                      <Button 
                        fullWidth 
                        startIcon={<CloudUploadIcon />} 
                        variant="outlined" 
                        onClick={() => handleOpenUploadDialog('antisobornos', 'Políticas Antisobornos')} 
                        sx={{ 
                          textTransform: 'none', 
                          py: 1.5, 
                          color: colors.primary.main, 
                          borderColor: colors.primary.main,
                          '&:hover': {
                            backgroundColor: `${colors.primary.main}10`
                          }
                        }}
                      >
                        Cargar Documento de Políticas
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </AccordionDetails>
        </Accordion>
      );
    };

    // ============================================================
    // RETURN PRINCIPAL
    // ============================================================
    return (
      <Box>
        {/* Header mejorado */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          pb: 2,
          borderBottom: `2px solid ${colors.primary.main}20`
        }}>
          <Box>
            <Typography variant="h4" sx={{ 
              color: colors.primary.dark, 
              fontWeight: 'bold', 
              mb: 1,
              letterSpacing: '-0.5px'
            }}>
              Expediente Digital
            </Typography>
            <Typography variant="body1" sx={{ color: colors.text.secondary }}>
              Comienza a construir tu expediente cargando tus certificaciones y documentos
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button 
              variant={editMode ? "contained" : "outlined"} 
              startIcon={<EditIcon />} 
              onClick={() => setEditMode(!editMode)}
              sx={{ 
                textTransform: 'none', 
                color: editMode ? 'white' : colors.primary.main, 
                borderColor: colors.primary.main, 
                bgcolor: editMode ? colors.primary.main : 'transparent', 
                '&:hover': { 
                  bgcolor: editMode ? colors.primary.dark : `${colors.primary.main}10` 
                } 
              }}
            >
              {editMode ? 'Guardar Cambios' : 'Modo Edición'}
            </Button>
          </Stack>
        </Box>

        {/* Nivel de Cumplimiento - Mejorado */}
        <Card sx={{ 
          mb: 4, 
          bgcolor: compliance >= 70 ? '#e8f5e9' : compliance >= 30 ? '#fff3e0' : '#ffebee',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container alignItems="center" spacing={3}>
              <Grid item xs={12} md={7}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4} sm={3} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography 
                        variant="h2" 
                        sx={{ 
                          color: compliance >= 70 ? colors.status.success : compliance >= 30 ? colors.status.warning : colors.status.error, 
                          fontWeight: 'bold', 
                          mb: 0.5, 
                          fontSize: { xs: '3rem', sm: '3.5rem' } 
                        }}
                      >
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
                      <Chip 
                        label={compliance >= 70 ? 'BUEN PROGRESO' : compliance >= 30 ? 'EN PROCESO' : 'POR COMENZAR'} 
                        color={compliance >= 70 ? 'success' : compliance >= 30 ? 'warning' : 'error'} 
                        size="small" 
                        sx={{ height: '24px' }} 
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
                      {compliance >= 70 
                        ? 'Excelente avance en tu expediente' 
                        : compliance >= 30 
                          ? 'Continúa agregando documentos' 
                          : 'Comienza cargando tu primera certificación'}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={compliance} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 5, 
                        backgroundColor: '#f0f0f0', 
                        '& .MuiLinearProgress-bar': { 
                          backgroundColor: compliance >= 70 ? colors.status.success : compliance >= 30 ? colors.status.warning : colors.status.error,
                          backgroundImage: compliance >= 70 ? `linear-gradient(90deg, ${colors.status.success}, ${colors.secondary.main})` : undefined
                        } 
                      }} 
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs="auto" sx={{ display: { xs: 'none', md: 'block' } }}>
                <Divider orientation="vertical" sx={{ height: '80px' }} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container spacing={1.5}>
                  {[
                    { 
                      value: certificadosData.formacionEtica.certificaciones.length + certificadosData.actualizacionTecnica.certificaciones.length, 
                      label: 'Certificaciones', 
                      color: colors.primary.main,
                      icon: <SchoolIcon sx={{ fontSize: '1rem' }} />
                    },
                    { 
                      value: (cumplimientoData.seguridadCadenaSuministro.documento ? 1 : 0) + (cumplimientoData.antisobornos.documento ? 1 : 0), 
                      label: 'Docs. Cumplimiento', 
                      color: colors.status.warning,
                      icon: <VerifiedIcon sx={{ fontSize: '1rem' }} />
                    },
                    { 
                      value: Object.values(archivosSubidos).reduce((acc, apartado) => acc + Object.keys(apartado).length, 0), 
                      label: 'Documentos', 
                      color: colors.status.error,
                      icon: <DescriptionIcon sx={{ fontSize: '1rem' }} />
                    },
                    { 
                      value: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' }), 
                      label: 'Última actualización', 
                      color: colors.accents.purple,
                      icon: <UpdateIcon sx={{ fontSize: '1rem' }} />
                    }
                  ].map((item, i) => (
                    <Grid item xs={6} key={i}>
                      <Paper sx={{ 
                        p: 1.5, 
                        textAlign: 'center', 
                        borderRadius: 2, 
                        height: '100%',
                        border: `1px solid ${item.color}20`,
                        backgroundColor: 'white',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 8px ${item.color}20`
                        }
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
                          <Box sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            backgroundColor: `${item.color}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: item.color
                          }}>
                            {item.icon}
                          </Box>
                        </Box>
                        <Typography 
                          variant={i === 3 ? 'h6' : 'h5'} 
                          sx={{ 
                            color: item.color, 
                            fontWeight: 'bold', 
                            mb: 0.5, 
                            fontSize: i === 3 ? '1rem' : undefined 
                          }}
                        >
                          {item.value}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: '500', fontSize: '0.7rem' }}>
                          {item.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: 'center' }}>
              <Button 
                component={Link} 
                to="/certifications" 
                sx={{ 
                  color: colors.primary.main, 
                  fontSize: '0.85rem', 
                  fontWeight: '600', 
                  textTransform: 'none', 
                  textDecoration: 'underline',
                  '&:hover': {
                    color: colors.primary.dark
                  }
                }}
              >
                Ver todas las certificaciones
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Lista de apartados */}
        <Box>
          <Typography variant="h5" sx={{ 
            color: colors.primary.dark, 
            mb: 3, 
            fontWeight: 'bold', 
            borderBottom: `3px solid ${colors.primary.dark}`, 
            pb: 1.5,
            letterSpacing: '-0.5px'
          }}>
            # INFORMACIÓN COMPLEMENTARIA
          </Typography>

          {loadingApartados && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <LinearProgress sx={{ maxWidth: '300px', mx: 'auto', mb: 2 }} />
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>Cargando apartados...</Typography>
            </Box>
          )}

        {!loadingApartados && apartadosDinamicos.length > 0 && (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle2" sx={{ color: colors.primary.main, mb: 2, fontWeight: '600' }}>
        Apartados disponibles ({apartadosDinamicos.length})
      </Typography>
      <Box sx={{ width: '100%' }}>
        {apartadosDinamicos.map(apartado => (
          <Box key={apartado.id} sx={{ width: '100%', mb: 2 }}>
            {renderApartadoDinamico(apartado)}
          </Box>
        ))}
      </Box>
    </Box>
  )}

          {!loadingApartados && apartadosDinamicos.length === 0 && user?.instanciaId && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              No hay apartados configurados para esta instancia
            </Alert>
          )}

          {/* Prueba de Vida - Mejorado */}
          <Accordion 
            expanded={expanded === 'prueba_vida'} 
            onChange={handleAccordionChange('prueba_vida')}
            sx={{ 
              mb: 2, 
              border: '1px solid', 
              borderColor: pruebaVida.estado === 'completado' ? colors.status.success + '80' : colors.status.warning + '40',
              borderRadius: '8px !important', 
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              '&:before': { display: 'none' },
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />} 
              sx={{
                backgroundColor: expanded === 'prueba_vida' ? '#f8f9fa' : 'white',
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center'
                }
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
                    {pruebaVida.estado === 'completado' ? `Completado • ${pruebaVida.fechaGrabacion}` : 'Grabación de video requerida'}
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
            
            <AccordionDetails sx={{ pt: 3, pb: 3, backgroundColor: '#fafafa' }}>
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 3, 
                  backgroundColor: `${colors.primary.main}10`,
                  borderRadius: 2
                }}
              >
                <Typography variant="body2">
                  <strong>Requisito para agentes:</strong> Capture un video corto para verificar su identidad y presencia.
                </Typography>
              </Alert>
              
              <PruebaVidaRecorder
                onVideoCaptured={handleVideoCaptured}
                videoFile={pruebaVida.videoArchivo}
                setVideoFile={(file) => setPruebaVida(prev => ({ ...prev, videoArchivo: file }))}
                setSnackbar={setSnackbar}
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
                    sx={{ 
                      textTransform: 'none', 
                      color: colors.primary.main,
                      borderColor: colors.primary.main,
                      '&:hover': {
                        backgroundColor: `${colors.primary.main}10`
                      }
                    }}
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
                      setSnackbar({ open: true, message: '✓ Descargando video...', severity: 'success' }); 
                    }} 
                    sx={{ 
                      textTransform: 'none', 
                      color: colors.status.success,
                      borderColor: colors.status.success,
                      '&:hover': {
                        backgroundColor: '#e8f5e9'
                      }
                    }}
                  >
                    Descargar
                  </Button>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Apartados fijos */}
          {informacionComplementaria.map((section) => {
            if (section.id === 'certificados') return renderCertificados();
            if (section.id === 'cumplimiento_organizacional') return renderCumplimientoOrganizacional();
            return null;
          })}
        </Box>

        {/* ── DIÁLOGOS ─────────────────────────────────────────── */}

        {/* Agregar documento (certificados) */}
        <Dialog 
          open={addDialog.open} 
          onClose={() => setAddDialog({ ...addDialog, open: false })} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: `1px solid ${colors.primary.main}20`, 
            pb: 2, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            color: colors.primary.dark, 
            fontWeight: 'bold' 
          }}>
            <CloudUploadIcon sx={{ color: colors.primary.main }} />
            Subir Documento
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            <Grid container spacing={2.5}>
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
              {addDialog.sectionId === 'certificados' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                      Subsección <span style={{ color: colors.status.error }}>*</span>
                    </Typography>
                    <TextField 
                      select 
                      fullWidth 
                      size="small" 
                      value={addDialog.subseccion} 
                      onChange={(e) => setAddDialog({ ...addDialog, subseccion: e.target.value })} 
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                    >
                      <MenuItem value="formacionEtica">Formación Ética y Cumplimiento</MenuItem>
                      <MenuItem value="actualizacionTecnica">Actualización Técnica y Aduanera</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                      Nombre de la Certificación <span style={{ color: colors.status.error }}>*</span>
                    </Typography>
                    <TextField 
                      fullWidth 
                      size="small" 
                      value={addDialog.tipoDocumento} 
                      onChange={(e) => setAddDialog({ ...addDialog, tipoDocumento: e.target.value })} 
                      placeholder="Ej: Diplomado en Comercio Exterior" 
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                      Institución <span style={{ color: colors.status.error }}>*</span>
                    </Typography>
                    <TextField 
                      fullWidth 
                      size="small" 
                      value={addDialog.institucion} 
                      onChange={(e) => setAddDialog({ ...addDialog, institucion: e.target.value })} 
                      placeholder="Ej: Universidad Nacional" 
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                      Horas <span style={{ color: colors.status.error }}>*</span>
                    </Typography>
                    <TextField 
                      fullWidth 
                      type="number" 
                      size="small" 
                      value={addDialog.horas} 
                      onChange={(e) => setAddDialog({ ...addDialog, horas: e.target.value })} 
                      placeholder="Ej: 20" 
                      required 
                      inputProps={{ min: 1 }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                  Archivo <span style={{ color: colors.status.error }}>*</span>
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 3, 
                    border: `2px dashed ${addDialog.archivo ? colors.status.success : colors.primary.main}40`, 
                    borderRadius: 2, 
                    cursor: 'pointer', 
                    textAlign: 'center', 
                    transition: 'all 0.2s',
                    '&:hover': { 
                      borderColor: colors.primary.main, 
                      backgroundColor: '#f8f9fa' 
                    } 
                  }}
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <input 
                    id="file-upload" 
                    type="file" 
                    style={{ display: 'none' }} 
                    onChange={handleFileChange} 
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                  />
                  {addDialog.archivo ? (
                    <>
                      <CheckCircleIcon sx={{ color: colors.status.success, fontSize: 40, mb: 1 }} />
                      <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: '500' }}>
                        {addDialog.nombreArchivo}
                      </Typography>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        onClick={(e) => { e.stopPropagation(); setAddDialog({ ...addDialog, archivo: null, nombreArchivo: '' }); }} 
                        sx={{ 
                          mt: 1, 
                          color: colors.status.error, 
                          borderColor: colors.status.error,
                          '&:hover': {
                            backgroundColor: '#ffebee'
                          }
                        }}
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
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${colors.primary.main}20` }}>
            <Button 
              onClick={() => setAddDialog({ ...addDialog, open: false })} 
              variant="outlined" 
              sx={{ 
                textTransform: 'none', 
                color: colors.primary.main, 
                borderColor: colors.primary.main,
                '&:hover': {
                  backgroundColor: `${colors.primary.main}10`
                }
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleGuardarDocumento} 
              variant="contained" 
              disabled={!addDialog.archivo} 
              sx={{ 
                textTransform: 'none', 
                bgcolor: colors.primary.main, 
                '&:hover': { bgcolor: colors.primary.dark }, 
                '&.Mui-disabled': { bgcolor: '#e0e0e0' } 
              }}
            >
              Subir Documento
            </Button>
          </DialogActions>
        </Dialog>

        {/* Upload dialog (apartados dinámicos + cumplimiento) con progreso mejorado */}
        <Dialog 
          open={uploadDialog.open} 
          onClose={() => setUploadDialog({ open: false, tipo: '', titulo: '', archivo: null, nombreArchivo: '', uploading: false, progress: 0 })} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: `1px solid ${colors.primary.main}20`, 
            pb: 2, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            color: colors.primary.dark, 
            fontWeight: 'bold' 
          }}>
            <CloudUploadIcon sx={{ color: colors.primary.main }} />
            Subir Documento: {uploadDialog.titulo}
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            <Grid container spacing={2.5}>
              {/* Fecha de vigencia solo para cumplimiento organizacional */}
              {!uploadDialog.tipo?.startsWith('apartado_') && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                    Fecha de Vigencia
                  </Typography>
                  <TextField 
                    fullWidth 
                    type="date" 
                    size="small" 
                    value={cumplimientoData[uploadDialog.tipo]?.vigencia || ''} 
                    onChange={(e) => handleVigenciaChange(uploadDialog.tipo, e.target.value)} 
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, fontWeight: '600' }}>
                  Archivo <span style={{ color: colors.status.error }}>*</span>
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 3, 
                    border: `2px dashed ${uploadDialog.archivo ? colors.status.success : colors.primary.main}40`, 
                    borderRadius: 2, 
                    cursor: uploadDialog.uploading ? 'default' : 'pointer', 
                    textAlign: 'center', 
                    transition: 'all 0.2s',
                    opacity: uploadDialog.uploading ? 0.7 : 1,
                    '&:hover': { 
                      borderColor: uploadDialog.uploading ? undefined : colors.primary.main, 
                      backgroundColor: uploadDialog.uploading ? undefined : '#f8f9fa' 
                    } 
                  }}
                  onClick={() => !uploadDialog.uploading && document.getElementById('cumplimiento-file-upload').click()}
                >
                  <input 
                    id="cumplimiento-file-upload" 
                    type="file" 
                    style={{ display: 'none' }} 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleCumplimientoFileSelect} 
                    disabled={uploadDialog.uploading} 
                  />
                  {uploadDialog.archivo ? (
                    <>
                      <CheckCircleIcon sx={{ color: colors.status.success, fontSize: 40, mb: 1 }} />
                      <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: '500' }}>
                        {uploadDialog.nombreArchivo}
                      </Typography>
                      {!uploadDialog.uploading && (
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={(e) => { e.stopPropagation(); setUploadDialog({ ...uploadDialog, archivo: null, nombreArchivo: '' }); }} 
                          sx={{ 
                            mt: 1, 
                            color: colors.status.error, 
                            borderColor: colors.status.error,
                            '&:hover': {
                              backgroundColor: '#ffebee'
                            }
                          }}
                        >
                          Quitar archivo
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <CloudUploadIcon sx={{ color: colors.primary.main, fontSize: 40, mb: 1 }} />
                      <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: '500' }}>
                        Haz clic para seleccionar un archivo
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mt: 1 }}>
                        Formatos: PDF, DOC, DOCX (Máx. 10MB)
                      </Typography>
                    </>
                  )}
                </Paper>
                
                {/* Barra de progreso mejorada */}
                {uploadDialog.uploading && (
                  <UploadProgress 
                    progress={uploadDialog.progress} 
                    fileName={uploadDialog.nombreArchivo}
                    onComplete={() => {}}
                  />
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${colors.primary.main}20` }}>
            <Button 
              onClick={() => setUploadDialog({ open: false, tipo: '', titulo: '', archivo: null, nombreArchivo: '', uploading: false, progress: 0 })} 
              variant="outlined" 
              disabled={uploadDialog.uploading}
              sx={{ 
                textTransform: 'none', 
                color: colors.primary.main, 
                borderColor: colors.primary.main,
                '&:hover': {
                  backgroundColor: `${colors.primary.main}10`
                }
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleGuardarDocumentoCumplimiento} 
              variant="contained" 
              disabled={!uploadDialog.archivo || uploadDialog.uploading}
              sx={{ 
                textTransform: 'none', 
                bgcolor: colors.primary.main, 
                '&:hover': { bgcolor: colors.primary.dark }, 
                '&.Mui-disabled': { bgcolor: '#e0e0e0' } 
              }}
            >
              {uploadDialog.uploading ? 'Subiendo...' : 'Subir Documento'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo de validación para programas */}
        <Dialog 
          open={validacionDialog.open} 
          onClose={handleCerrarValidacionDialog} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary.main}20`, pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <SendIcon sx={{ color: colors.primary.main }} />
              <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: '600' }}>
                Enviar Certificación a Validación
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            <Alert severity="info" sx={{ mb: 3, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: '600', color: colors.primary.main }}>
                Confirmación de Envío
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                ¿Está seguro de enviar esta certificación para su validación?
              </Typography>
            </Alert>
            <Paper variant="outlined" sx={{ p: 2.5, mb: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: '500', mb: 0.5 }}>
                    Programa:
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.primary.dark, fontWeight: '600' }}>
                    {validacionDialog.programa?.nombre}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: '500', mb: 0.5 }}>
                    Documento:
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.primary.dark, fontWeight: '600' }}>
                    {validacionDialog.documento?.nombreArchivo}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: '500', mb: 0.5 }}>
                    Fecha de envío:
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.primary.dark, fontWeight: '600' }}>
                    {validacionDialog.fecha}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${colors.primary.main}20` }}>
            <Button 
              onClick={handleCerrarValidacionDialog} 
              variant="outlined" 
              sx={{ 
                textTransform: 'none', 
                color: colors.primary.main, 
                borderColor: colors.primary.main,
                '&:hover': {
                  backgroundColor: `${colors.primary.main}10`
                }
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmarValidacionPrograma} 
              variant="contained" 
              startIcon={<SendIcon />} 
              sx={{ 
                textTransform: 'none', 
                bgcolor: colors.primary.main, 
                '&:hover': { bgcolor: colors.primary.dark } 
              }}
            >
              Confirmar Envío
            </Button>
          </DialogActions>
        </Dialog>

        {/* Vista previa */}
        <Dialog
          open={previewDialog.open}
          onClose={handleClosePreview}
          maxWidth="lg"
          fullWidth
          PaperProps={{ 
            sx: { 
              height: '90vh', 
              maxHeight: '90vh', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 2,
              overflow: 'hidden'
            } 
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: `1px solid ${colors.primary.main}20`, 
            py: 1.5, 
            flexShrink: 0,
            backgroundColor: '#f8f9fa'
          }}>
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

          <DialogContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0, backgroundColor: '#f5f5f5' }}>

            {/* Loading */}
            {previewDialog.loading && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 2 }}>
                <LinearProgress sx={{ width: '200px' }} />
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>Cargando vista previa...</Typography>
              </Box>
            )}

            {/* Sin archivo (documentos locales) */}
            {!previewDialog.loading && !previewDialog.objectUrl && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 2, p: 3 }}>
                <FilePresentIcon sx={{ fontSize: 80, color: colors.primary.main }} />
                <Typography variant="h6" sx={{ color: colors.text.primary }}>{previewDialog.nombre}</Typography>
                <Alert severity="info" sx={{ maxWidth: '400px', borderRadius: 2 }}>
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

            {/* Office (DOCX, XLSX, PPTX) — Google Docs Viewer */}
            {!previewDialog.loading && previewDialog.objectUrl && previewDialog.tipo === 'office' && (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, gap: 2 }}>
                <FilePresentIcon sx={{ fontSize: 60, color: colors.primary.main }} />
                <Typography variant="body1" sx={{ color: colors.text.primary }}>{previewDialog.nombre}</Typography>
                <Alert severity="info" sx={{ maxWidth: '400px', borderRadius: 2 }}>
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

            {/* Video MP4 */}
            {!previewDialog.loading && previewDialog.objectUrl && previewDialog.tipo === 'video' && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: '#000' }}>
                <video src={previewDialog.objectUrl} controls style={{ maxWidth: '100%', maxHeight: '100%' }} />
              </Box>
            )}

            {/* Audio MP3 */}
            {!previewDialog.loading && previewDialog.objectUrl && previewDialog.tipo === 'audio' && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, p: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <FilePresentIcon sx={{ fontSize: 80, color: colors.primary.main, mb: 2 }} />
                  <Typography variant="body1" sx={{ mb: 3, color: colors.text.primary }}>{previewDialog.nombre}</Typography>
                  <audio src={previewDialog.objectUrl} controls style={{ width: '100%', minWidth: '300px' }} />
                </Box>
              </Box>
            )}

          </DialogContent>

          <DialogActions sx={{ 
            px: 3, 
            py: 1.5, 
            borderTop: `1px solid ${colors.primary.main}20`, 
            flexShrink: 0,
            backgroundColor: '#f8f9fa'
          }}>
            <Button 
              onClick={handleClosePreview} 
              variant="outlined" 
              sx={{ 
                textTransform: 'none', 
                color: colors.primary.main, 
                borderColor: colors.primary.main,
                '&:hover': {
                  backgroundColor: `${colors.primary.main}10`
                }
              }}
            >
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
                sx={{ 
                  textTransform: 'none', 
                  bgcolor: colors.primary.main, 
                  '&:hover': { bgcolor: colors.primary.dark } 
                }}
              >
                Descargar
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Confirmar eliminación */}
        <Dialog 
          open={deleteDialog.open} 
          onClose={() => setDeleteDialog({ open: false, seccion: '', subseccion: '', documentoId: null, tipo: '', nombre: '', horas: 0, itemName: '', itemIndex: null })} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary.main}20`, pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <DeleteIcon sx={{ color: colors.status.error }} />
              <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: '600' }}>
                Confirmar Eliminación
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="body2">
                ¿Está seguro que desea eliminar <strong>"{deleteDialog.nombre}"</strong>?
              </Typography>
              {deleteDialog.horas > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Esta acción restará <strong>{deleteDialog.horas} horas</strong> de las horas acumuladas.
                </Typography>
              )}
            </Alert>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${colors.primary.main}20` }}>
            <Button 
              onClick={() => setDeleteDialog({ open: false, seccion: '', subseccion: '', documentoId: null, tipo: '', nombre: '', horas: 0, itemName: '', itemIndex: null })} 
              variant="outlined" 
              sx={{ 
                textTransform: 'none', 
                color: colors.primary.main, 
                borderColor: colors.primary.main,
                '&:hover': {
                  backgroundColor: `${colors.primary.main}10`
                }
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmarEliminacion} 
              variant="contained" 
              color="error" 
              startIcon={<DeleteIcon />} 
              sx={{ 
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#d32f2f'
                }
              }}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        <AddCertificationModal
          open={certModalOpen}
          onClose={() => {
            if (saving) return;
            setCertModalOpen(false);
            setProgSeleccionado(null);
            setNuevaCertificacion({
              subseccion: '', tipoDocumento: '', institucion: '',
              fecha: new Date().toISOString().split('T')[0],
              horas: '', archivo: null, nombreArchivo: ''
              
            });
          }}
          onSave={handleGuardarCertDesdePrograma}
          nuevaCertificacion={nuevaCertificacion}
          onFieldChange={handleNuevaCertificacionChange}
          onFileChange={handleCertFileChange}
          onRemoveFile={() => setNuevaCertificacion(prev => ({ ...prev, archivo: null, nombreArchivo: '' }))}
          uploading={uploading}
          uploadProgress={uploadProgress}
          saving={saving}
          subseccionFija={progSeleccionado?.nombre}
          titulo="Enviar Certificación para Validación"
          labelBotonGuardar="Enviar para Validación"
        />

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
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderRadius: 2
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  };

  export default Expediente;