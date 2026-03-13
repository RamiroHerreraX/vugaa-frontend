import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import declaracionesService from '../../../services/declaracion';
import { getMiExpediente } from '../../../services/expediente';
import {
  Box, Grid, Paper, Typography, Button, Card, CardContent, Chip, Stack,
  Divider, TextField, IconButton, Accordion, AccordionSummary, AccordionDetails,
  LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tooltip, Stepper, Step, StepLabel, CircularProgress
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
  Gavel as GavelIcon,
  Balance as BalanceIcon,
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Assessment as AssessmentIcon,
  RateReview as RateReviewIcon,
  Timeline as TimelineIcon,
  Help as HelpIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  VerifiedUser as VerifiedUserIcon,
  Gavel as LawIcon,
  Policy as PolicyIcon,
  PrivacyTip as PrivacyTipIcon,
  Handshake as HandshakeIcon,
  AssignmentLate as AssignmentLateIcon,
  FactCheck as FactCheckIcon,
} from '@mui/icons-material';

const colors = {
  primary: { dark: '#0D2A4D', main: '#133B6B', light: '#3A6EA5' },
  secondary: { main: '#00A8A8', light: '#00C2D1', lighter: '#35D0FF' },
  accents: { blue: '#0099FF', purple: '#6C5CE7' },
  status: { success: '#00A8A8', warning: '#F59E0B', error: '#EF4444', info: '#3A6EA5' },
  text: { primary: '#0D2A4D', secondary: '#3A6EA5', light: '#6C5CE7' }
};

const COLORES_APARTADOS = [
  colors.status.error,
  colors.primary.main,
  colors.status.success,
  colors.status.warning,
  colors.accents.purple,
  colors.accents.blue,
  colors.secondary.main,
];

const ICONOS_APARTADOS = [
  <PolicyIcon />,
  <BalanceIcon />,
  <PersonIcon />,
  <FactCheckIcon />,
  <SecurityIcon />,
  <AssignmentIcon />,
  <DescriptionIcon />,
];

const declaracionDTOToApartado = (dto, index) => {
  let checks = [];

  if (dto.configuracionJson) {
    try {
      const config = JSON.parse(dto.configuracionJson);
      if (Array.isArray(config.checks)) {
        checks = config.checks.map((c, i) => ({
          id:         c.id || i + 1,
          texto:      c.texto || c.text || `Declaración ${i + 1}`,
          checked:    false,
          respuesta:  null,   // 'si' | 'no' | null
          motivo:     '',
          puntos:     c.puntos || 20,
          fundamento: c.fundamento || dto.articuloReferencia || 'Fundamento legal',
        }));
      }
    } catch (e) {
      console.warn(`[declaracionDTOToApartado] configuracionJson inválido para id=${dto.idDeclaracion}`, e);
    }
  }

  if (checks.length === 0) {
    checks = [{
      id:         1,
      texto:      dto.descripcion || dto.nombre || 'Confirmo el cumplimiento de esta declaración.',
      checked:    false,
      respuesta:  null,
      motivo:     '',
      puntos:     100,
      fundamento: dto.articuloReferencia
        ? `Art. ${dto.articuloReferencia} - ${dto.nombre}`
        : dto.nombre,
    }];
  }

  const maxPuntos = checks.reduce((sum, c) => sum + (c.puntos || 0), 0) || 100;

  return {
    id:           `declaracion_${dto.idDeclaracion}`,
    idDeclaracion: dto.idDeclaracion,
    titulo:       dto.articuloReferencia
      ? `ARTÍCULO ${dto.articuloReferencia} - ${dto.nombre.toUpperCase()}`
      : dto.nombre.toUpperCase(),
    descripcion:  dto.descripcion || dto.nombre,
    articulo:     dto.articuloReferencia || String(dto.idDeclaracion),
    contenido:    dto.descripcion || null,
    checks,
    maxPuntos,
    estado:       'pendiente',
    guardado:     false,
    puntuacionTotal: 0,
    color:        COLORES_APARTADOS[index % COLORES_APARTADOS.length],
    icono:        ICONOS_APARTADOS[index % ICONOS_APARTADOS.length],
  };
};

const DeclaracionesCumplimientoAduanero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [expanded, setExpanded] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [declaracionModalOpen, setDeclaracionModalOpen] = useState(true);
  const [declaracionAceptada, setDeclaracionAceptada] = useState(false);

  const [apartadosData, setApartadosData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Expediente ────────────────────────────────────────────────────────────
  const [expediente, setExpediente] = useState(null);

  useEffect(() => {
    const cargarExpediente = async () => {
      if (!user?.id) return;
      try {
        const miExpediente = await getMiExpediente();
        setExpediente(miExpediente);
      } catch (error) {
        console.error('Error cargando expediente:', error);
      }
    };
    cargarExpediente();
  }, [user?.id]);

useEffect(() => {
  if (!declaracionAceptada || !user?.instanciaId) return;

  const cargarDeclaraciones = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Cargar declaraciones de la instancia
      const lista = await declaracionesService.findByInstancia(user.instanciaId);

      // 2. Convertir a mapa base (sin respuestas aún)
      const mapa = {};
      lista.forEach((dto, index) => {
        const apartado = declaracionDTOToApartado(dto, index);
        mapa[apartado.id] = apartado;
      });

      // 3. Cargar respuestas previas si tenemos expediente
      if (expediente?.id) {
        try {
          const respuestasPrevias = await declaracionesService.findRespuestasPorExpediente(expediente.id);

          // Para cada declaración, buscar su última respuesta
          respuestasPrevias.forEach(respuesta => {
            const key = `declaracion_${respuesta.idDeclaracion}`;
            if (!mapa[key]) return;

            // Parsear el respuesta_json
            let checksGuardados = [];
            try {
              const json = typeof respuesta.respuestaJson === 'string'
                ? JSON.parse(respuesta.respuestaJson)
                : respuesta.respuestaJson;
              checksGuardados = json.checks || [];
            } catch (e) {
              console.warn('Error parseando respuestaJson:', e);
              return;
            }

            // Aplicar respuestas guardadas a los checks del apartado
            const checksActualizados = mapa[key].checks.map(check => {
              const guardado = checksGuardados.find(c => c.id === check.id);
              if (!guardado) return check;
              return {
                ...check,
                respuesta: guardado.respuesta || (guardado.marcado ? 'si' : null),
                checked:   guardado.marcado || guardado.respuesta === 'si',
                motivo:    guardado.motivo || '',
              };
            });

            // Calcular puntuación
            const checksMarcados  = checksActualizados.filter(c => c.respuesta === 'si').length;
            const puntuacionTotal  = checksActualizados.reduce(
              (sum, c) => sum + (c.respuesta === 'si' ? (c.puntos || 0) : 0), 0
            );
            const porcentaje = Math.round((puntuacionTotal / (mapa[key].maxPuntos || 100)) * 100);
            const estado = porcentaje >= 80 ? 'cumple_totalmente'
                         : porcentaje >= 60 ? 'cumple_parcialmente'
                         : 'no_cumple';

            mapa[key] = {
              ...mapa[key],
              checks:         checksActualizados,
              guardado:       true,
              puntuacionTotal,
              estado,
            };
          });
        } catch (e) {
          // Si falla la carga de respuestas previas, continuamos sin ellas
          console.warn('No se pudieron cargar respuestas previas:', e);
        }
      }

      setApartadosData(mapa);
      const primerKey = Object.keys(mapa)[0];
      if (primerKey) setExpanded(primerKey);

    } catch (err) {
      console.error('Error cargando declaraciones:', err);
      setError('No se pudieron cargar las declaraciones. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  cargarDeclaraciones();
}, [declaracionAceptada, user?.instanciaId, expediente?.id]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAceptarDeclaracion = () => {
    setDeclaracionAceptada(true);
    setDeclaracionModalOpen(false);
  };

  const handleCerrarDeclaracion = () => {
    setDeclaracionModalOpen(false);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleRespuestaChange = (apartadoId, checkId, respuesta) => {
    setApartadosData(prev => {
      const apartado = prev[apartadoId];
      if (!apartado) return prev;
      return {
        ...prev,
        [apartadoId]: {
          ...apartado,
          checks: apartado.checks.map(c =>
            c.id === checkId
              ? { ...c, respuesta, checked: respuesta === 'si', motivo: respuesta === 'si' ? '' : c.motivo }
              : c
          ),
        },
      };
    });
  };

  const handleMotivoChange = (apartadoId, checkId, motivo) => {
    setApartadosData(prev => {
      const apartado = prev[apartadoId];
      if (!apartado) return prev;
      return {
        ...prev,
        [apartadoId]: {
          ...apartado,
          checks: apartado.checks.map(c =>
            c.id === checkId ? { ...c, motivo } : c
          ),
        },
      };
    });
  };

  const handleGuardarApartado = async (apartadoId) => {
    const apartado = apartadosData[apartadoId];
    if (!apartado) return;

    // Validar que todas tengan respuesta
    const sinResponder = apartado.checks.filter(c => c.respuesta === null);
    if (sinResponder.length > 0) {
      alert('Por favor responda todas las declaraciones antes de guardar.');
      return;
    }

    // Validar que los "No cumplo" tengan motivo
    const motivosPendientes = apartado.checks.filter(c => c.respuesta === 'no' && !c.motivo.trim());
    if (motivosPendientes.length > 0) {
      alert('Por favor indique el motivo de incumplimiento en las declaraciones marcadas como "No cumplo".');
      return;
    }

    const checksMarcados = apartado.checks.filter(c => c.checked).length;
    const puntuacionTotal = apartado.checks.reduce(
      (sum, c) => sum + (c.checked ? (c.puntos || 0) : 0), 0
    );
    const porcentaje = Math.round((puntuacionTotal / (apartado.maxPuntos || 100)) * 100);
    const estado = porcentaje >= 80 ? 'cumple_totalmente'
                 : porcentaje >= 60 ? 'cumple_parcialmente'
                 : 'no_cumple';

    // Actualizar estado local (UX inmediata)
    setApartadosData(prev => ({
      ...prev,
      [apartadoId]: { ...prev[apartadoId], puntuacionTotal, estado, guardado: true },
    }));

    // POST al backend
    if (expediente?.id) {
      try {
        await declaracionesService.guardarRespuesta({
          idDeclaracion:      apartado.idDeclaracion,
          idExpediente:       expediente.id,
          checks:             apartado.checks,
          declaracionBuenaFe: true,
        });
      } catch (error) {
        console.error('Error al guardar declaración en backend:', error);
        // No bloqueamos la UX
      }
    }

    // Avanzar stepper
    const keys = Object.keys(apartadosData);
    const currentIndex = keys.indexOf(apartadoId);
    if (currentIndex < keys.length - 1) {
      setActiveStep(currentIndex + 1);
      setExpanded(keys[currentIndex + 1]);
    }

    alert(`Declaración "${apartado.titulo}" guardada exitosamente.`);
  };

  // ── Cálculos ──────────────────────────────────────────────────────────────
  const calcularCumplimientoApartado = (apartado) => {
    if (!apartado?.guardado) return 0;
    return Math.round(((apartado.puntuacionTotal || 0) / (apartado.maxPuntos || 100)) * 100);
  };

  const calcularCumplimientoGeneral = () => {
    const lista = Object.values(apartadosData);
    if (!lista.length) return 0;
    const completados = lista.filter(a => a.guardado && a.estado !== 'pendiente').length;
    return Math.round((completados / lista.length) * 100);
  };

  const obtenerTextoEstado = (apartado) => {
    if (!apartado?.guardado) return 'PENDIENTE';
    const respondidos = apartado.checks.filter(c => c.respuesta !== null).length;
    if (respondidos === 0) return 'PENDIENTE';
    if (respondidos < apartado.checks.length) return 'EN PROCESO';
    const pct = calcularCumplimientoApartado(apartado);
    if (pct >= 80) return 'CUMPLE TOTALMENTE';
    if (pct >= 60) return 'CUMPLE PARCIALMENTE';
    return 'NO CUMPLE';
  };

  const obtenerColorEstado = (apartado) => {
    if (!apartado?.guardado) return 'default';
    const respondidos = apartado.checks.filter(c => c.respuesta !== null).length;
    if (respondidos === 0) return 'default';
    if (respondidos < apartado.checks.length) return 'warning';
    const pct = calcularCumplimientoApartado(apartado);
    if (pct >= 80) return 'success';
    if (pct >= 60) return 'warning';
    return 'error';
  };

  const calcularIndicadoresResumen = () => {
    const lista = Object.values(apartadosData);
    const guardados = lista.filter(a => a.guardado).length;
    const altoCumplimiento = lista.filter(a => a.guardado && calcularCumplimientoApartado(a) >= 80).length;
    const totalChecks = lista.reduce((s, a) => s + a.checks.length, 0);
    const checksMarcados = lista.reduce((s, a) => s + a.checks.filter(c => c.respuesta === 'si').length, 0);
    return {
      totalApartados: lista.length,
      guardados,
      altoCumplimiento,
      areasMejora: totalChecks - checksMarcados,
      totalChecks,
      checksMarcados,
      cumplimientoGeneral: calcularCumplimientoGeneral(),
    };
  };

  const cumplimientoGeneral = calcularCumplimientoGeneral();
  const indicadoresCalculados = calcularIndicadoresResumen();

  // ── Render de cada apartado ───────────────────────────────────────────────
  const renderApartado = (apartado) => {
    if (!apartado) return null;
    const cumplimiento = calcularCumplimientoApartado(apartado);
    const respondidos  = apartado.checks.filter(c => c.respuesta !== null).length;
    const cumplen      = apartado.checks.filter(c => c.respuesta === 'si').length;
    const noCumplen    = apartado.checks.filter(c => c.respuesta === 'no').length;
    const checksTotales = apartado.checks.length;

    return (
      <Accordion
        key={apartado.id}
        expanded={expanded === apartado.id}
        onChange={handleAccordionChange(apartado.id)}
        sx={{
          mb: 3,
          border: '2px solid',
          borderColor: apartado.color,
          borderRadius: '8px !important',
          boxShadow: `0 2px 12px ${apartado.color}20`,
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: expanded === apartado.id ? '#f8f9fa' : 'white',
            borderRadius: '8px',
            minHeight: '70px',
            '& .MuiAccordionSummary-content': { alignItems: 'center' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 40, height: 40, borderRadius: '50%',
              backgroundColor: `${apartado.color}15`,
              color: apartado.color,
            }}>
              {apartado.icono}
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ fontWeight: '700', color: colors.text.primary, fontSize: '1rem', mb: 0.5 }}>
                {apartado.titulo}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                {apartado.descripcion}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {apartado.guardado && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{
                    color: cumplimiento >= 80 ? colors.status.success
                         : cumplimiento >= 60 ? colors.status.warning
                         : colors.status.error,
                    fontWeight: 'bold',
                  }}>
                    {cumplimiento}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>Cumplimiento</Typography>
                </Box>
              )}
              <Chip
                label={obtenerTextoEstado(apartado)}
                size="small"
                color={obtenerColorEstado(apartado)}
                sx={{ fontWeight: '600' }}
              />
            </Box>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ pt: 3, pb: 3 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>

            {/* Cabecera interna */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ color: colors.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
                {apartado.icono} {apartado.titulo}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon fontSize="small" sx={{ color: colors.status.success }} />
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  {respondidos}/{checksTotales} respondidas
                </Typography>
              </Box>
            </Box>

            {/* Contenido del artículo */}
            {apartado.contenido && (
              <Alert severity="info" sx={{ mb: 3, backgroundColor: `${apartado.color}10`, whiteSpace: 'pre-line' }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {apartado.contenido}
                </Typography>
              </Alert>
            )}

            <Alert severity="success" sx={{ mb: 3, backgroundColor: `${colors.status.success}10` }}>
              <Typography variant="body2">
                <strong>Instrucciones:</strong> Para cada declaración, indique si cumple o no cumple.
                En caso de no cumplir, deberá explicar el motivo.
              </Typography>
            </Alert>

            {/* Lista de declaraciones con Sí/No */}
            {apartado.checks.map((check, index) => (
              <Box key={check.id} sx={{
                mb: 2, p: 2.5,
                border: `1px solid ${
                  check.respuesta === 'si' ? colors.status.success + '50'
                  : check.respuesta === 'no' ? colors.status.error + '50'
                  : colors.primary.main + '20'
                }`,
                borderLeft: `4px solid ${
                  check.respuesta === 'si' ? colors.status.success
                  : check.respuesta === 'no' ? colors.status.error
                  : colors.primary.main + '40'
                }`,
                borderRadius: 2,
                backgroundColor: check.respuesta === 'si' ? `${colors.status.success}08`
                               : check.respuesta === 'no' ? `${colors.status.error}08`
                               : 'white',
                transition: 'all 0.2s',
              }}>
                {/* Número + texto */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                  <Box sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    backgroundColor: check.respuesta === 'si' ? colors.status.success
                                   : check.respuesta === 'no' ? colors.status.error
                                   : `${apartado.color}30`,
                    color: 'white', fontWeight: 'bold',
                    transition: 'background-color 0.2s',
                  }}>
                    {index + 1}
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{
                      fontWeight: '600',
                      color: colors.text.primary,
                      lineHeight: 1.5,
                    }}>
                      {check.texto}
                    </Typography>
                    {check.fundamento && (
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          icon={<GavelIcon fontSize="small" />}
                          label={check.fundamento}
                          size="small"
                          sx={{
                            backgroundColor: `${apartado.color}20`,
                            color: apartado.color,
                            fontWeight: '500',
                            '& .MuiChip-icon': { color: apartado.color },
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Botones Sí / No */}
                <Box sx={{ display: 'flex', gap: 2, ml: 6 }}>
                  <Button
                    variant={check.respuesta === 'si' ? 'contained' : 'outlined'}
                    size="small"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleRespuestaChange(apartado.id, check.id, 'si')}
                    sx={{
                      textTransform: 'none',
                      fontWeight: '600',
                      borderColor: colors.status.success,
                      color: check.respuesta === 'si' ? 'white' : colors.status.success,
                      backgroundColor: check.respuesta === 'si' ? colors.status.success : 'transparent',
                      '&:hover': {
                        backgroundColor: check.respuesta === 'si' ? colors.status.success : `${colors.status.success}15`,
                        borderColor: colors.status.success,
                      },
                      px: 3,
                    }}
                  >
                    Sí, cumplo
                  </Button>

                  <Button
                    variant={check.respuesta === 'no' ? 'contained' : 'outlined'}
                    size="small"
                    startIcon={<CloseIcon />}
                    onClick={() => handleRespuestaChange(apartado.id, check.id, 'no')}
                    sx={{
                      textTransform: 'none',
                      fontWeight: '600',
                      borderColor: colors.status.error,
                      color: check.respuesta === 'no' ? 'white' : colors.status.error,
                      backgroundColor: check.respuesta === 'no' ? colors.status.error : 'transparent',
                      '&:hover': {
                        backgroundColor: check.respuesta === 'no' ? colors.status.error : `${colors.status.error}15`,
                        borderColor: colors.status.error,
                      },
                      px: 3,
                    }}
                  >
                    No cumplo
                  </Button>
                </Box>

                {/* Campo motivo — solo si respondió No */}
                {check.respuesta === 'no' && (
                  <Box sx={{ mt: 2, ml: 6 }}>
                    <Alert severity="warning" sx={{ mb: 1.5, py: 0.5, borderRadius: 1.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: '600' }}>
                        Indique el motivo de incumplimiento
                      </Typography>
                    </Alert>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      placeholder="Explique brevemente el motivo por el que no cumple con esta declaración..."
                      value={check.motivo || ''}
                      onChange={(e) => handleMotivoChange(apartado.id, check.id, e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: 'white',
                          '& fieldset': { borderColor: `${colors.status.error}60` },
                          '&:hover fieldset': { borderColor: colors.status.error },
                          '&.Mui-focused fieldset': { borderColor: colors.status.error },
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
            ))}

            <Divider sx={{ my: 3 }} />

            {/* Resumen + botón guardar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: '600', color: colors.text.primary, mb: 1 }}>
                  Resumen de la declaración:
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  {`Respondidas: ${respondidos}/${checksTotales} · Cumplen: ${cumplen} · No cumplen: ${noCumplen}`}
                </Typography>
                {apartado.guardado && (
                  <Box sx={{
                    mt: 1, p: 1.5, borderRadius: 2,
                    backgroundColor: cumplimiento >= 80 ? '#e8f5e9'
                                   : cumplimiento >= 60 ? '#fff3e0' : '#ffebee',
                    border: `2px solid ${cumplimiento >= 80 ? colors.status.success
                                       : cumplimiento >= 60 ? colors.status.warning
                                       : colors.status.error}`,
                  }}>
                    <Typography variant="body2" sx={{
                      fontWeight: '600',
                      color: cumplimiento >= 80 ? colors.status.success
                           : cumplimiento >= 60 ? colors.status.warning
                           : colors.status.error,
                    }}>
                      {cumplimiento >= 80 ? 'Nivel de cumplimiento: Óptimo'
                     : cumplimiento >= 60 ? 'Nivel de cumplimiento: Aceptable'
                     : 'Nivel de cumplimiento: Requiere atención'}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Button
                variant="contained"
                onClick={() => handleGuardarApartado(apartado.id)}
                disabled={respondidos === 0}
                startIcon={<AssignmentTurnedInIcon />}
                sx={{
                  textTransform: 'none', px: 4,
                  backgroundColor: apartado.color,
                  '&:hover': { backgroundColor: colors.primary.dark, opacity: 0.9 },
                }}
              >
                {apartado.guardado ? 'Actualizar Declaración' : 'Guardar Declaración'}
              </Button>
            </Box>
          </Paper>
        </AccordionDetails>
      </Accordion>
    );
  };

  // ── Render principal ──────────────────────────────────────────────────────
  const apartadosList = Object.values(apartadosData);

  return (
    <Box sx={{ p: 3 }}>

      {/* Modal de Declaración de Buena Fe */}
      <Dialog
        open={declaracionModalOpen}
        onClose={handleCerrarDeclaracion}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, border: `2px solid ${colors.primary.main}` } }}
      >
        <DialogTitle sx={{ bgcolor: colors.primary.main, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <VerifiedUserIcon />
          <Typography variant="h6">Declaración de Veracidad y Buena Fe</Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Lea atentamente la siguiente declaración antes de continuar:
            </Typography>
          </Alert>
          <Paper elevation={0} sx={{ p: 4, bgcolor: '#f9f9f9', border: `1px solid ${colors.primary.light}`, borderRadius: 2 }}>
            <Typography variant="body1" paragraph sx={{ fontWeight: '500', color: colors.text.primary }}>
              Por medio del presente, declaro que la información que proporcionaré a continuación es verdadera,
              completa y ha sido presentada de buena fe, conforme a los Estatutos de CAAAREM y la normativa aduanera aplicable.
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontWeight: '500', color: colors.text.primary }}>
              Estoy consciente de que cualquier omisión, falsedad o alteración en los datos proporcionados
              podrá dar lugar a las acciones administrativas y legales correspondientes, conforme a la normativa aplicable,
              incluyendo las sanciones previstas en el artículo 63 de los Estatutos.
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: '500', color: colors.text.primary }}>
              Al continuar, confirmo que la información que ingresaré es correcta y asumo la responsabilidad
              sobre su veracidad, bajo protesta de decir verdad.
            </Typography>
          </Paper>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Chip
              icon={<GavelIcon />}
              label="Artículo 92, fracción III - Obligación de declaración bajo protesta de decir verdad"
              sx={{ bgcolor: `${colors.primary.main}10`, color: colors.primary.main, fontWeight: '500', p: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button onClick={handleCerrarDeclaracion} variant="outlined" sx={{ textTransform: 'none', px: 4 }} startIcon={<CloseIcon />}>
            No Acepto
          </Button>
          <Button
            onClick={handleAceptarDeclaracion}
            variant="contained"
            autoFocus
            sx={{ textTransform: 'none', px: 4, bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}
            startIcon={<CheckCircleIcon />}
          >
            Acepto y Continúo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Contenido principal */}
      {declaracionAceptada && (
        <>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ color: colors.primary.dark, fontWeight: 'bold', mb: 1 }}>
                Declaraciones de Cumplimiento Aduanero
              </Typography>
              <Typography variant="body1" sx={{ color: colors.text.secondary }}>
                Declaraciones activas de tu instancia
              </Typography>
              <Chip
                icon={<VerifiedUserIcon />}
                label="Declaración de Buena Fe Aceptada"
                sx={{ mt: 1, bgcolor: colors.status.success, color: 'white', fontWeight: '600' }}
              />
            </Box>
            <Button
              variant="contained"
              startIcon={<VerifiedUserIcon />}
              sx={{ textTransform: 'none', bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}
              onClick={() => {
                const todasGuardadas = apartadosList.every(a => a.guardado);
                alert(todasGuardadas
                  ? 'Declaración anual enviada exitosamente para validación.'
                  : 'Debe completar y guardar todas las declaraciones antes de enviar.');
              }}
            >
              Enviar Declaración Anual
            </Button>
          </Box>

          {/* Stepper dinámico */}
          {apartadosList.length > 0 && (
            <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
              {apartadosList.map((ap, i) => (
                <Step key={ap.id}>
                  <StepLabel sx={{
                    '& .MuiStepLabel-label': {
                      color: activeStep === i ? colors.primary.main : colors.text.secondary,
                    },
                  }}>
                    {ap.articulo ? `Art. ${ap.articulo}` : ap.titulo.split(' - ')[0]}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          )}

          {/* Loading */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress sx={{ color: colors.primary.main }} />
              <Typography sx={{ ml: 2, color: colors.text.secondary }}>
                Cargando declaraciones de tu instancia...
              </Typography>
            </Box>
          )}

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} action={
              <Button color="inherit" size="small" onClick={() => { setDeclaracionAceptada(false); setTimeout(() => setDeclaracionAceptada(true), 50); }}>
                Reintentar
              </Button>
            }>
              {error}
            </Alert>
          )}

          {/* Sin declaraciones */}
          {!loading && !error && apartadosList.length === 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              No hay declaraciones activas configuradas para tu instancia.
              Contacta al administrador para crear las declaraciones correspondientes.
            </Alert>
          )}

          {/* Resumen de cumplimiento */}
          {!loading && apartadosList.length > 0 && (
            <Card sx={{ mb: 4, bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, color: colors.text.primary }}>
                  Mi Nivel de Cumplimiento General
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" sx={{
                      color: cumplimientoGeneral >= 70 ? colors.status.success : colors.status.warning,
                      fontWeight: 'bold',
                    }}>
                      {cumplimientoGeneral}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>Progreso Total</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={cumplimientoGeneral}
                    sx={{
                      flexGrow: 1, height: 20, borderRadius: 10, backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: cumplimientoGeneral >= 70 ? colors.status.success : colors.status.warning,
                        borderRadius: 10,
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LawIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
                      <Typography variant="body2">
                        {indicadoresCalculados.guardados} de {indicadoresCalculados.totalApartados} artículos declarados
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ color: colors.status.success, fontSize: 20 }} />
                      <Typography variant="body2">
                        {indicadoresCalculados.altoCumplimiento} con cumplimiento óptimo
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WarningIcon sx={{ color: colors.status.warning, fontSize: 20 }} />
                      <Typography variant="body2">
                        {indicadoresCalculados.areasMejora} declaraciones sin cumplir
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Tabla de progreso */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon sx={{ color: colors.primary.main }} /> Mi Progreso por Artículo
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                          <TableCell sx={{ fontWeight: '600' }}>Artículo</TableCell>
                          <TableCell sx={{ fontWeight: '600' }}>Descripción</TableCell>
                          <TableCell sx={{ fontWeight: '600' }} align="center">Cumplimiento</TableCell>
                          <TableCell sx={{ fontWeight: '600' }} align="center">Estado</TableCell>
                          <TableCell sx={{ fontWeight: '600' }} align="center">Sí / No / Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {apartadosList.map(apartado => {
                          const pct      = calcularCumplimientoApartado(apartado);
                          const cumplen  = apartado.checks.filter(c => c.respuesta === 'si').length;
                          const noCumplen = apartado.checks.filter(c => c.respuesta === 'no').length;
                          return (
                            <TableRow key={apartado.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Box sx={{ color: apartado.color }}>{apartado.icono}</Box>
                                  <Typography variant="body2" sx={{ fontWeight: '600' }}>
                                    Art. {apartado.articulo}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{apartado.descripcion}</Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                  <Typography variant="body2" sx={{
                                    fontWeight: '600',
                                    color: pct >= 80 ? colors.status.success : pct >= 60 ? colors.status.warning : colors.status.error,
                                  }}>
                                    {pct}%
                                  </Typography>
                                  <LinearProgress
                                    variant="determinate"
                                    value={pct}
                                    sx={{
                                      width: 60, height: 6, borderRadius: 3, backgroundColor: '#e0e0e0',
                                      '& .MuiLinearProgress-bar': {
                                        backgroundColor: pct >= 80 ? colors.status.success : pct >= 60 ? colors.status.warning : colors.status.error,
                                      },
                                    }}
                                  />
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Chip label={obtenerTextoEstado(apartado)} size="small" color={obtenerColorEstado(apartado)} sx={{ fontWeight: '500' }} />
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2">
                                  <span style={{ color: colors.status.success, fontWeight: 600 }}>{cumplen}✓</span>
                                  {' / '}
                                  <span style={{ color: colors.status.error, fontWeight: 600 }}>{noCumplen}✗</span>
                                  {' / '}
                                  {apartado.checks.length}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Acordeones */}
          {!loading && apartadosList.map(ap => renderApartado(ap))}

          {/* Nota legal */}
          {!loading && apartadosList.length > 0 && (
            <Alert severity="info" sx={{ mt: 4 }} icon={<HelpIcon />}>
              <Typography variant="body2">
                <strong>Instrucciones importantes:</strong> Esta declaración anual debe ser presentada
                conforme a los Estatutos de CAAAREM. La información está sujeta a verificación por el
                Comité de Cumplimiento y Autorregulación. Las declaraciones falsas u omisiones podrán
                ser sancionadas conforme al artículo 63.
              </Typography>
            </Alert>
          )}
        </>
      )}

      {/* Pantalla de espera si no aceptó */}
      {!declaracionAceptada && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Card sx={{ maxWidth: 600, p: 4, textAlign: 'center' }}>
            <VerifiedUserIcon sx={{ fontSize: 80, color: colors.primary.main, mb: 2 }} />
            <Typography variant="h5" sx={{ color: colors.primary.dark, mb: 2 }}>
              Declaración de Buena Fe Requerida
            </Typography>
            <Typography variant="body1" sx={{ color: colors.text.secondary, mb: 3 }}>
              Para continuar, debe aceptar la Declaración de Veracidad y Buena Fe.
            </Typography>
            <Button
              variant="contained"
              onClick={() => setDeclaracionModalOpen(true)}
              sx={{ textTransform: 'none', px: 4 }}
              startIcon={<VerifiedUserIcon />}
            >
              Ver Declaración
            </Button>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default DeclaracionesCumplimientoAduanero;