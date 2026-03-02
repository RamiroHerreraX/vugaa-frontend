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
  ToggleButtonGroup,
  ToggleButton,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Badge,
  Stepper,
  Step,
  StepLabel,
  Slider,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Collapse
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
  Gavel as GavelIcon,
  Balance as BalanceIcon,
  Verified as VerifiedIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Assessment as AssessmentIcon,
  RateReview as RateReviewIcon,
  Timeline as TimelineIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Upload as UploadIcon,
  History as HistoryIcon,
  Group as GroupIcon,
  Build as BuildIcon,
  TextFields as TextFieldsIcon,
  Description as DescriptionIcon2,
  HowToReg as HowToRegIcon,
  TrendingUp as TrendingUpIcon,
  Comment as CommentIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  Person as PersonIcon,
  VerifiedUser as VerifiedUserIcon,
  Gavel as LawIcon,
  AssignmentInd as MandateIcon,
  Policy as PolicyIcon,
  PrivacyTip as PrivacyTipIcon,
  Handshake as HandshakeIcon,
  AssignmentLate as AssignmentLateIcon,
  FactCheck as FactCheckIcon,
  Inventory as InventoryIcon
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

const DeclaracionesCumplimientoAduanero = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState('panel1');
  const [activeStep, setActiveStep] = useState(0);
  
  // Estado para el modal de declaración de buena fe
  const [declaracionModalOpen, setDeclaracionModalOpen] = useState(true);
  const [declaracionAceptada, setDeclaracionAceptada] = useState(false);

  // Definir la estructura base de los apartados con PUNTOS ASIGNADOS (ocultos para el usuario)
  // REORDENADO: Artículo 92 (Conflictos de Interés) al principio
  const estructuraBaseApartados = {
    conflictos_intereses: {
      id: 'conflictos_intereses',
      titulo: 'ARTÍCULO 92 - CONFLICTOS DE INTERÉS E INDEPENDENCIA PROFESIONAL',
      descripcion: 'Declaración anual de conflictos de interés e independencia profesional',
      articulo: '92',
      contenido: `I. Definición.
Se entiende que existe conflicto de interés: la posible afectación del desempeño imparcial,
objetivo y ético de las funciones gremiales en razón de intereses personales o de negocios.

II. Principio de independencia profesional.
El agente aduanal deberá mantener absoluta independencia en su actuación profesional,
evitando cualquier relación o vínculo que pueda comprometer la imparcialidad en el
cumplimiento de sus funciones, ya sea en el ámbito operativo o gremial.

III. Obligación de declaración y actualización.
Todos los asociados deberán presentar anualmente una Declaración de Conflicto de Interés
en la que manifiesten bajo protesta de decir verdad no encontrarse en los supuestos
previstos en las disposiciones de autorregulación gremial.

IV. Gestión y medidas preventivas.
El Comité de Cumplimiento y Autorregulación evaluará las declaraciones, a fin de detectar
posibles conflictos o incompatibilidades.

V. Confidencialidad y transparencia.
Las declaraciones serán tratadas con estricta confidencialidad y sólo podrán hacerse
públicas por resolución fundada del Comité de Cumplimiento y Autorregulación.`,
      checks: [
        {
          id: 1,
          texto: 'Declaro que no tengo intereses personales o de negocios que puedan afectar el desempeño imparcial, objetivo y ético de mis funciones gremiales.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 92, fracción I - Definición de conflicto de interés'
        },
        {
          id: 2,
          texto: 'Manifiesto que mantengo absoluta independencia en mi actuación profesional, evitando cualquier relación o vínculo que pueda comprometer la imparcialidad en el cumplimiento de mis funciones, y me comprometo a informar a CAAAREM cuando exista interacción con alguna autoridad federal que afecte el interés gremial.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 92, fracción II - Principio de independencia profesional'
        },
        {
          id: 3,
          texto: 'Declaro bajo protesta de decir verdad que no me encuentro en los supuestos previstos en las disposiciones de autorregulación gremial que pudieran generar conflicto de interés, cumpliendo con mi obligación de declaración anual.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 92, fracción III - Obligación de declaración'
        },
        {
          id: 4,
          texto: 'Acepto que el Comité de Cumplimiento y Autorregulación evalúe mi declaración a fin de detectar posibles conflictos o incompatibilidades, así como la falta de declaración, el ocultamiento de información o la participación en actos o decisiones estando en conflicto de interés.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 92, fracción IV - Gestión y medidas preventivas'
        },
        {
          id: 5,
          texto: 'Entiendo que mi declaración será tratada con estricta confidencialidad y solo podrá hacerse pública por resolución fundada del Comité de Cumplimiento y Autorregulación, y que se llevará un Registro de Conflictos de Interés garantizando la protección de mis datos personales.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 92, fracción V - Confidencialidad y transparencia'
        }
      ],
      estado: 'pendiente',
      guardado: false,
      puntuacionTotal: 0,
      maxPuntos: 100, // 5 checks de 20 puntos cada uno
      color: colors.status.error
    },

    principios_rectores: {
      id: 'principios_rectores',
      titulo: 'ARTÍCULO 95 - PRINCIPIOS RECTORES DEL CUMPLIMIENTO ADUANERO',
      descripcion: 'Principios que rigen el cumplimiento aduanero del agente aduanal',
      articulo: '95',
      contenido: `El agente aduanal, o las organizaciones mediante las cuales haga ejercicio de su patente
deberán regirse por los siguientes principios:
I. Legalidad reforzada
II. Materialidad
III. Trazabilidad
IV. Independencia profesional
V. Debida diligencia
VI. Responsabilidad profesional y transparencia`,
      checks: [
        {
          id: 1,
          texto: 'Aplico de manera estricta y proactiva la legislación aduanera y fiscal, superando los mínimos legales mediante controles internos preventivos.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 95, fracción I - Legalidad reforzada'
        },
        {
          id: 2,
          texto: 'Acredito la existencia real, legítima y verificable de cada operación, asegurando la correspondencia entre mercancía, documentos y mandante.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 95, fracción II - Materialidad'
        },
        {
          id: 3,
          texto: 'Conservo y mantengo disponible evidencia documental y digital completa que verifique la materialidad de cada despacho aduanero.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 95, fracción III - Trazabilidad'
        },
        {
          id: 4,
          texto: 'Actúo libre de intereses o vínculos que comprometan la imparcialidad del agente aduanal.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 95, fracción IV - Independencia profesional'
        },
        {
          id: 5,
          texto: 'Identifico, evalúo, comunico y gestiono los riesgos de mandantes, productos, países y operaciones.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 95, fracción V - Debida diligencia'
        },
        {
          id: 6,
          texto: 'Aseguro la integridad, exactitud y licitud de toda información transmitida a la autoridad.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 95, fracción VI - Responsabilidad profesional y transparencia'
        }
      ],
      estado: 'pendiente',
      guardado: false,
      puntuacionTotal: 0,
      maxPuntos: 120, // 6 checks de 20 puntos cada uno
      color: colors.primary.main
    },

    conocimiento_mandato: {
      id: 'conocimiento_mandato',
      titulo: 'ARTÍCULO 96 - CONOCIMIENTO DEL MANDANTE Y DEBIDA DILIGENCIA',
      descripcion: 'Lineamiento de Conocimiento del Cliente para prevención de riesgos',
      articulo: '96',
      contenido: `El agente aduanal deberá aplicar en su despacho un lineamiento de Conocimiento del
Cliente, como herramienta esencial para la prevención de riesgos y la verificación de
operaciones legítimas.
Este lineamiento incluirá, como mínimo:
I. Identificación plena del cliente y sus beneficiarios finales
II. Verificación de antecedentes legales, fiscales y aduaneros
III. Evaluación del riesgo operativo
IV. Clasificación del cliente en niveles de riesgo
V. Monitoreo continuo de clientes y operaciones
VI. Negativa de servicio o suspensión de representación`,
      checks: [
        {
          id: 1,
          texto: 'Identifico de manera plena a mis clientes y sus beneficiarios finales, mediante documentación oficial, registro fiscal y acreditación de actividad económica.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 96, fracción I - Identificación plena del cliente'
        },
        {
          id: 2,
          texto: 'Verifico los antecedentes legales, fiscales y aduaneros del cliente y de sus representantes.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 96, fracción II - Verificación de antecedentes'
        },
        {
          id: 3,
          texto: 'Evalúo el riesgo operativo considerando la naturaleza de la mercancía, país de origen, destino y comportamiento histórico.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 96, fracción III - Evaluación del riesgo operativo'
        },
        {
          id: 4,
          texto: 'Clasifico a mis clientes en niveles de riesgo (bajo, medio, alto) y aplico medidas específicas para los casos de mayor exposición.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 96, fracción IV - Clasificación del cliente'
        },
        {
          id: 5,
          texto: 'Realizo monitoreo continuo de clientes y operaciones, con actualización de datos periódica.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 96, fracción V - Monitoreo continuo'
        },
        {
          id: 6,
          texto: 'Me abstengo de prestar servicio o suspendo la representación cuando existan elementos que comprometan la legalidad o la reputación del gremio.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 96, fracción VI - Negativa de servicio'
        }
      ],
      estado: 'pendiente',
      guardado: false,
      puntuacionTotal: 0,
      maxPuntos: 120,
      color: colors.status.success
    },

    materialidad: {
      id: 'materialidad',
      titulo: 'ARTÍCULO 97 - MATERIALIDAD',
      descripcion: 'Acreditación de la existencia real, legítima y comprobable de las operaciones',
      articulo: '97',
      contenido: `Se entiende por materialidad la existencia real, legítima y comprobable de los elementos
que sustentan una operación de comercio exterior, incluyendo:
I. La existencia física y legal del mandante
II. El vínculo legal entre el agente aduanal y el mandante
III. La acreditación de la legítima posesión, propiedad o tenencia
IV. La congruencia entre descripción, clasificación arancelaria, valor, origen o destino
V. La comprobación del cumplimiento de las regulaciones y restricciones no arancelarias`,
      checks: [
        {
          id: 1,
          texto: 'Verifico la existencia física y legal del mandante en cada operación de comercio exterior.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 97, fracción I - Existencia física y legal del mandante'
        },
        {
          id: 2,
          texto: 'Compruebo el vínculo legal existente entre el agente aduanal y el mandante para cada operación.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 97, fracción II - Vínculo legal'
        },
        {
          id: 3,
          texto: 'Acredito la legítima posesión, propiedad o tenencia entre la instrucción otorgada y la documentación soporte.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 97, fracción III - Legítima posesión'
        },
        {
          id: 4,
          texto: 'Verifico la congruencia entre descripción, clasificación arancelaria, valor, origen o destino de las mercancías.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 97, fracción IV - Congruencia'
        },
        {
          id: 5,
          texto: 'Compruebo el cumplimiento de las regulaciones y restricciones no arancelarias y contribuciones aplicables.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 97, fracción V - Cumplimiento normativo'
        }
      ],
      estado: 'pendiente',
      guardado: false,
      puntuacionTotal: 0,
      maxPuntos: 100,
      color: colors.status.warning
    },

    reglas_minimas_seguridad: {
      id: 'reglas_minimas_seguridad',
      titulo: 'ARTÍCULO 98 - REGLAS MÍNIMAS DE SEGURIDAD Y CONTROL DEL DESPACHO ADUANAL',
      descripcion: 'Políticas y procedimientos de seguridad en el despacho aduanal',
      articulo: '98',
      contenido: `Cada operación en la que intervenga el agente aduanal cumplirá con políticas y procedimientos escritos que incluyan:
I. Recepción formal de instrucciones y documentos
II. Validación jurídica y documental previa a la transmisión
III. Bitácora digital de control
IV. Auditoría interna de cumplimiento anual
V. Plan de respuesta a incidentes y contingencias`,
      checks: [
        {
          id: 1,
          texto: 'Realizo recepción formal de instrucciones y documentos, mediante firma física o digital del mandante.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 98, fracción I - Recepción formal'
        },
        {
          id: 2,
          texto: 'Efectúo validación jurídica y documental previa a la transmisión del pedimento.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 98, fracción II - Validación previa'
        },
        {
          id: 3,
          texto: 'Mantengo una bitácora digital de control que registra cada etapa de la operación.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 98, fracción III - Bitácora digital'
        },
        {
          id: 4,
          texto: 'Realizo auditoría interna de cumplimiento anual, con reporte al Comité de Cumplimiento y Autorregulación de CAAAREM.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 98, fracción IV - Auditoría interna'
        },
        {
          id: 5,
          texto: 'Cuento con un plan de respuesta a incidentes y contingencias, que contempla corrección inmediata y comunicación a la autoridad cuando corresponda.',
          checked: false,
          puntos: 20,
          fundamento: 'Art. 98, fracción V - Plan de respuesta'
        }
      ],
      estado: 'pendiente',
      guardado: false,
      puntuacionTotal: 0,
      maxPuntos: 100,
      color: colors.accents.purple
    }
  };

  // Estados para los apartados principales
  const [apartadosData, setApartadosData] = useState(estructuraBaseApartados);

  // Indicadores para la tabla superior
  const [indicadoresSuperiores, setIndicadoresSuperiores] = useState({
    conflictosIntereses: {
      declaracionIntegra: { valor: 0, meta: 100 },
      independencia: { valor: 0, meta: 100 },
      gestionConflictos: { valor: 0, meta: 95 }
    },
    principiosRectores: {
      legalidadReforzada: { valor: 0, meta: 90 },
      trazabilidad: { valor: 0, meta: 85 },
      debidaDiligencia: { valor: 0, meta: 85 }
    },
    conocimientoMandato: {
      identificacionCliente: { valor: 0, meta: 95 },
      evaluacionRiesgos: { valor: 0, meta: 90 },
      monitoreoContinuo: { valor: 0, meta: 85 }
    },
    materialidad: {
      existenciaMandante: { valor: 0, meta: 80 },
      congruencia: { valor: 0, meta: 85 },
      cumplimientoRRNA: { valor: 0, meta: 90 }
    },
    reglasMinimasSeguridad: {
      validacionPrevia: { valor: 0, meta: 95 },
      bitacoraDigital: { valor: 0, meta: 90 },
      auditoriaInterna: { valor: 0, meta: 90 }
    }
  });

  // Función para manejar la aceptación de la declaración de buena fe
  const handleAceptarDeclaracion = () => {
    setDeclaracionAceptada(true);
    setDeclaracionModalOpen(false);
  };

  // Función para manejar el cierre del modal sin aceptar
  // Función para manejar el cierre del modal sin aceptar
const handleCerrarDeclaracion = () => {
  // Cerrar el modal primero
  setDeclaracionModalOpen(false);
  // Mostrar el alert y luego redirigir
  setTimeout(() => {
   
  }, 100);
};

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Función para manejar el cambio de checkboxes
  const handleCheckChange = (apartadoId, checkId, checked) => {
    setApartadosData(prev => {
      const apartadoActual = prev[apartadoId];
      if (!apartadoActual || !apartadoActual.checks) {
        console.error(`Apartado ${apartadoId} no encontrado`);
        return prev;
      }

      const nuevosChecks = apartadoActual.checks.map(check => {
        if (check && check.id === checkId) {
          return { ...check, checked };
        }
        return check;
      });

      return {
        ...prev,
        [apartadoId]: {
          ...apartadoActual,
          checks: nuevosChecks
        }
      };
    });
  };

  // Función para guardar apartado
  const handleGuardarApartado = (apartadoId) => {
    const apartado = apartadosData[apartadoId];
    
    if (!apartado || !apartado.checks) {
      alert(`Error: No se encontró el apartado ${apartadoId}`);
      return;
    }

    const checksMarcados = apartado.checks.filter(check => check && check.checked === true).length;
    
    if (checksMarcados === 0) {
      alert('Por favor marque al menos una declaración antes de guardar');
      return;
    }

    // Calcular puntuación (oculta para el usuario)
    let puntuacionTotal = 0;
    apartado.checks.forEach(check => {
      if (check && check.checked && check.puntos) {
        puntuacionTotal += check.puntos;
      }
    });

    // Calcular porcentaje
    const maxPuntos = apartado.maxPuntos || 100;
    const porcentaje = maxPuntos > 0 ? Math.round((puntuacionTotal / maxPuntos) * 100) : 0;

    // Determinar estado
    let estado = 'pendiente';
    if (checksMarcados > 0) {
      estado = porcentaje >= 80 ? 'cumple_totalmente' : 
               porcentaje >= 60 ? 'cumple_parcialmente' : 'no_cumple';
    }

    // Actualizar estado del apartado
    setApartadosData(prev => ({
      ...prev,
      [apartadoId]: {
        ...prev[apartadoId],
        puntuacionTotal,
        estado: estado,
        guardado: true
      }
    }));

    // Actualizar indicadores superiores
    actualizarIndicadoresSuperiores(apartadoId, porcentaje);

    alert(`Declaración del ${apartado.titulo} guardada exitosamente.`);
  };

  // Función para actualizar indicadores superiores
  const actualizarIndicadoresSuperiores = (apartadoId, porcentaje) => {
    setIndicadoresSuperiores(prev => {
      const nuevosIndicadores = { ...prev };
      
      switch(apartadoId) {
        case 'conflictos_intereses':
          nuevosIndicadores.conflictosIntereses.declaracionIntegra.valor = porcentaje;
          nuevosIndicadores.conflictosIntereses.independencia.valor = Math.min(porcentaje + 5, 100);
          nuevosIndicadores.conflictosIntereses.gestionConflictos.valor = Math.min(porcentaje + 3, 100);
          break;
        case 'principios_rectores':
          nuevosIndicadores.principiosRectores.legalidadReforzada.valor = porcentaje;
          nuevosIndicadores.principiosRectores.trazabilidad.valor = Math.min(porcentaje + 8, 100);
          nuevosIndicadores.principiosRectores.debidaDiligencia.valor = Math.min(porcentaje + 5, 100);
          break;
        case 'conocimiento_mandato':
          nuevosIndicadores.conocimientoMandato.identificacionCliente.valor = porcentaje;
          nuevosIndicadores.conocimientoMandato.evaluacionRiesgos.valor = Math.min(porcentaje + 10, 100);
          nuevosIndicadores.conocimientoMandato.monitoreoContinuo.valor = Math.min(porcentaje + 8, 100);
          break;
        case 'materialidad':
          nuevosIndicadores.materialidad.existenciaMandante.valor = porcentaje;
          nuevosIndicadores.materialidad.congruencia.valor = Math.min(porcentaje + 12, 100);
          nuevosIndicadores.materialidad.cumplimientoRRNA.valor = Math.min(porcentaje + 8, 100);
          break;
        case 'reglas_minimas_seguridad':
          nuevosIndicadores.reglasMinimasSeguridad.validacionPrevia.valor = porcentaje;
          nuevosIndicadores.reglasMinimasSeguridad.bitacoraDigital.valor = Math.min(porcentaje + 15, 100);
          nuevosIndicadores.reglasMinimasSeguridad.auditoriaInterna.valor = Math.min(porcentaje + 10, 100);
          break;
      }
      
      return nuevosIndicadores;
    });
  };

  // Calcular cumplimiento general
  const calcularCumplimientoGeneral = () => {
    try {
      const apartados = Object.values(apartadosData);
      if (!apartados || apartados.length === 0) return 0;
      
      const completados = apartados.filter(a => 
        a && a.estado && a.estado !== 'pendiente' && a.guardado
      ).length;
      
      return apartados.length > 0 ? Math.round((completados / apartados.length) * 100) : 0;
    } catch (error) {
      console.error('Error calculando cumplimiento general:', error);
      return 0;
    }
  };

  const cumplimientoGeneral = calcularCumplimientoGeneral();

  // Calcular cumplimiento por apartado
  const calcularCumplimientoApartado = (apartado) => {
    if (!apartado || !apartado.guardado) return 0;
    
    const puntuacionTotal = apartado.puntuacionTotal || 0;
    const maxPuntos = apartado.maxPuntos || 100;
    
    return maxPuntos > 0 ? Math.round((puntuacionTotal / maxPuntos) * 100) : 0;
  };

  // Obtener texto del estado
  const obtenerTextoEstado = (apartado) => {
    if (!apartado || !apartado.guardado) return 'PENDIENTE';
    
    const checks = apartado.checks || [];
    const checksMarcados = checks.filter(check => check && check.checked === true).length;
    
    if (checksMarcados === 0) return 'PENDIENTE';
    if (checksMarcados < checks.length) return 'EN PROCESO';
    
    const porcentaje = calcularCumplimientoApartado(apartado);
    if (porcentaje >= 80) return 'CUMPLE TOTALMENTE';
    if (porcentaje >= 60) return 'CUMPLE PARCIALMENTE';
    return 'NO CUMPLE';
  };

  // Obtener color del estado
  const obtenerColorEstado = (apartado) => {
    if (!apartado || !apartado.guardado) return 'default';
    
    const checks = apartado.checks || [];
    const checksMarcados = checks.filter(check => check && check.checked === true).length;
    
    if (checksMarcados === 0) return 'default';
    if (checksMarcados < checks.length) return 'warning';
    
    const porcentaje = calcularCumplimientoApartado(apartado);
    if (porcentaje >= 80) return 'success';
    if (porcentaje >= 60) return 'warning';
    return 'error';
  };

  // Función para obtener el icono según el apartado
  const obtenerIcono = (apartadoId) => {
    switch(apartadoId) {
      case 'conflictos_intereses':
        return <PolicyIcon />;
      case 'principios_rectores':
        return <BalanceIcon />;
      case 'conocimiento_mandato':
        return <PersonIcon />;
      case 'materialidad':
        return <FactCheckIcon />;
      case 'reglas_minimas_seguridad':
        return <SecurityIcon />;
      default:
        return <AssignmentIcon />;
    }
  };

  // Función para obtener el icono de fundamento
  const obtenerIconoFundamento = (fundamento) => {
    if (fundamento.includes('Definición') || fundamento.includes('Principio')) {
      return <GavelIcon fontSize="small" />;
    } else if (fundamento.includes('Obligación')) {
      return <AssignmentLateIcon fontSize="small" />;
    } else if (fundamento.includes('Confidencialidad')) {
      return <PrivacyTipIcon fontSize="small" />;
    } else if (fundamento.includes('Identificación') || fundamento.includes('Verificación')) {
      return <PersonIcon fontSize="small" />;
    } else if (fundamento.includes('Evaluación') || fundamento.includes('Clasificación')) {
      return <AssessmentIcon fontSize="small" />;
    } else if (fundamento.includes('Monitoreo')) {
      return <TimelineIcon fontSize="small" />;
    } else if (fundamento.includes('Existencia') || fundamento.includes('Vínculo')) {
      return <HandshakeIcon fontSize="small" />;
    } else if (fundamento.includes('Congruencia')) {
      return <BalanceIcon fontSize="small" />;
    } else if (fundamento.includes('Validación') || fundamento.includes('Bitácora')) {
      return <DescriptionIcon fontSize="small" />;
    } else if (fundamento.includes('Auditoría')) {
      return <RateReviewIcon fontSize="small" />;
    } else {
      return <CheckCircleIcon fontSize="small" />;
    }
  };

  // Calcular indicadores para la parte superior
  const calcularIndicadoresSuperioresResumen = () => {
    try {
      const apartados = Object.values(apartadosData);
      if (!apartados) return {
        totalApartados: 0,
        guardados: 0,
        altoCumplimiento: 0,
        areasMejora: 0,
        totalChecks: 0,
        checksMarcados: 0,
        cumplimientoGeneral: 0
      };
      
      const guardados = apartados.filter(a => a && a.guardado).length;
      
      const altoCumplimiento = apartados.filter(a => {
        if (!a || !a.guardado) return false;
        const cumplimiento = calcularCumplimientoApartado(a);
        return cumplimiento >= 80;
      }).length;
      
      const totalChecks = apartados.reduce((total, apartado) => {
        if (!apartado || !apartado.checks) return total;
        return total + apartado.checks.length;
      }, 0);
      
      const checksMarcados = apartados.reduce((total, apartado) => {
        if (!apartado || !apartado.checks) return total;
        return total + apartado.checks.filter(check => check && check.checked === true).length;
      }, 0);
      
      return {
        totalApartados: apartados.length,
        guardados,
        altoCumplimiento,
        areasMejora: totalChecks - checksMarcados,
        totalChecks,
        checksMarcados,
        cumplimientoGeneral
      };
    } catch (error) {
      console.error('Error calculando indicadores:', error);
      return {
        totalApartados: 0,
        guardados: 0,
        altoCumplimiento: 0,
        areasMejora: 0,
        totalChecks: 0,
        checksMarcados: 0,
        cumplimientoGeneral: 0
      };
    }
  };

  const indicadoresCalculados = calcularIndicadoresSuperioresResumen();

  // Función para renderizar cada apartado con checks (SIN CAMPOS DE COMENTARIOS Y SIN PUNTOS VISIBLES)
  const renderApartado = (apartado) => {
    if (!apartado) return null;
    
    const cumplimiento = calcularCumplimientoApartado(apartado);
    const checks = apartado.checks || [];
    const checksMarcados = checks.filter(check => check && check.checked === true).length;
    const checksTotales = checks.length;
    const textoEstado = obtenerTextoEstado(apartado);
    const colorEstado = obtenerColorEstado(apartado);
    
    return (
      <Accordion 
        expanded={expanded === apartado.id}
        onChange={handleAccordionChange(apartado.id)}
        sx={{ 
          mb: 3,
          border: '2px solid',
          borderColor: apartado.color || colors.primary.main,
          borderRadius: '8px !important',
          boxShadow: `0 2px 12px ${apartado.color || colors.primary.main}20`,
          '&:before': { display: 'none' }
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            backgroundColor: expanded === apartado.id ? '#f8f9fa' : 'white',
            borderRadius: '8px',
            minHeight: '70px',
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
              backgroundColor: `${apartado.color || colors.primary.main}15`,
              color: apartado.color || colors.primary.main
            }}>
              {obtenerIcono(apartado.id)}
            </Box>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ 
                fontWeight: '700', 
                color: colors.text.primary,
                fontSize: '1rem',
                mb: 0.5
              }}>
                {apartado.titulo || 'Artículo'}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                {apartado.descripcion || 'Descripción no disponible'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {apartado.guardado && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ 
                    color: cumplimiento >= 80 ? colors.status.success : 
                           cumplimiento >= 60 ? colors.status.warning : colors.status.error,
                    fontWeight: 'bold'
                  }}>
                    {cumplimiento}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                    Cumplimiento
                  </Typography>
                </Box>
              )}
              
              <Chip 
                label={textoEstado}
                size="small"
                color={colorEstado}
                sx={{ fontWeight: '600' }}
              />
            </Box>
          </Box>
        </AccordionSummary>
        
        <AccordionDetails sx={{ pt: 3, pb: 3 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ color: colors.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
                {obtenerIcono(apartado.id)}
                {apartado.titulo}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon fontSize="small" sx={{ color: colors.status.success }} />
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  {checksMarcados}/{checksTotales} declaraciones afirmativas
                </Typography>
              </Box>
            </Box>
            
            {/* Contenido del artículo */}
            {apartado.contenido && (
              <Alert severity="info" sx={{ mb: 3, backgroundColor: `${apartado.color || colors.primary.main}10`, whiteSpace: 'pre-line' }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {apartado.contenido}
                </Typography>
              </Alert>
            )}
            
            <Alert severity="success" sx={{ mb: 3, backgroundColor: `${colors.status.success}10` }}>
              <Typography variant="body2">
                <strong>Instrucciones:</strong> Marque cada declaración que aplique a su situación actual. 
                {apartado.id === 'conflictos_intereses' 
                  ? ' En conflictos de intereses, debe declarar bajo protesta de decir verdad.'
                  : ' Todas las declaraciones deben ser verificables y estar soportadas documentalmente.'}
              </Typography>
            </Alert>
            
            {checks.map((check, index) => {
              if (!check) return null;
              
              return (
                <Box key={check.id || index} sx={{ 
                  mb: 2, 
                  p: 2, 
                  border: `1px solid ${colors.primary.main}20`, 
                  borderRadius: 2,
                  backgroundColor: 'white'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: apartado.color || colors.primary.main,
                      color: 'white',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={check.checked || false}
                            onChange={(e) => handleCheckChange(apartado.id, check.id, e.target.checked)}
                            sx={{
                              color: apartado.color || colors.primary.main,
                              '&.Mui-checked': {
                                color: apartado.color || colors.primary.main,
                              },
                            }}
                          />
                        }
                        label={
                          <Typography variant="subtitle1" sx={{ 
                            fontWeight: check.checked ? '600' : '400', 
                            color: colors.text.primary 
                          }}>
                            {check.texto}
                          </Typography>
                        }
                        sx={{ alignItems: 'flex-start', m: 0 }}
                      />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, ml: 5 }}>
                        <Chip 
                          icon={obtenerIconoFundamento(check.fundamento)}
                          label={check.fundamento || 'Fundamento legal'}
                          size="small"
                          sx={{ 
                            backgroundColor: `${apartado.color || colors.primary.main}20`,
                            color: apartado.color || colors.primary.main,
                            fontWeight: '500',
                            '& .MuiChip-icon': {
                              color: apartado.color || colors.primary.main
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: '600', color: colors.text.primary, mb: 1 }}>
                  Resumen de la declaración:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Declaraciones afirmativas: {checksMarcados}/{checksTotales}
                    </Typography>
                  </Box>
                  
                  {apartado.guardado && (
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2,
                      backgroundColor: cumplimiento >= 80 ? '#e8f5e9' : 
                                     cumplimiento >= 60 ? '#fff3e0' : '#ffebee',
                      border: `2px solid ${cumplimiento >= 80 ? colors.status.success : 
                                               cumplimiento >= 60 ? colors.status.warning : colors.status.error}`
                    }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: '600',
                        color: cumplimiento >= 80 ? colors.status.success : 
                               cumplimiento >= 60 ? colors.status.warning : colors.status.error
                      }}>
                        {cumplimiento >= 80 ? 'Nivel de cumplimiento: Óptimo' :
                         cumplimiento >= 60 ? 'Nivel de cumplimiento: Aceptable' :
                         'Nivel de cumplimiento: Requiere atención'}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
              
              <Button
                variant="contained"
                sx={{ 
                  textTransform: 'none', 
                  px: 4,
                  backgroundColor: apartado.color || colors.primary.main,
                  '&:hover': {
                    backgroundColor: colors.primary.dark,
                    opacity: 0.9
                  }
                }}
                onClick={() => handleGuardarApartado(apartado.id)}
                disabled={checksMarcados === 0}
                startIcon={<AssignmentTurnedInIcon />}
              >
                {apartado.guardado ? 'Actualizar Declaración' : 'Guardar Declaración'}
              </Button>
            </Box>
          </Paper>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Modal de Declaración de Buena Fe */}
      <Dialog 
        open={declaracionModalOpen} 
        onClose={handleCerrarDeclaracion}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: `2px solid ${colors.primary.main}`
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: colors.primary.main, 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <VerifiedUserIcon />
          <Typography variant="h6">Declaración de Veracidad y Buena Fe</Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Lea atentamente la siguiente declaración antes de continuar:
            </Typography>
          </Alert>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              bgcolor: '#f9f9f9', 
              border: `1px solid ${colors.primary.light}`,
              borderRadius: 2,
              fontStyle: 'italic'
            }}
          >
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
              sx={{ 
                bgcolor: `${colors.primary.main}10`,
                color: colors.primary.main,
                fontWeight: '500',
                p: 1
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button 
            onClick={handleCerrarDeclaracion}
            variant="outlined"
            sx={{ textTransform: 'none', px: 4 }}
            startIcon={<CloseIcon />}
          >
            No Acepto
          </Button>
          <Button 
            onClick={handleAceptarDeclaracion}
            variant="contained"
            sx={{ 
              textTransform: 'none', 
              px: 4,
              bgcolor: colors.primary.main,
              '&:hover': { bgcolor: colors.primary.dark }
            }}
            startIcon={<CheckCircleIcon />}
            autoFocus
          >
            Acepto y Continúo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header - Solo visible si aceptó la declaración */}
      {declaracionAceptada && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ color: colors.primary.dark, fontWeight: 'bold', mb: 1 }}>
                Declaraciones de Cumplimiento Aduanero
              </Typography>
              <Typography variant="body1" sx={{ color: colors.text.secondary }}>
                Evaluación y declaración según Artículos 92, 95, 96, 97 y 98 de los Estatutos
              </Typography>
              <Chip 
                icon={<VerifiedUserIcon />}
                label="Declaración de Buena Fe Aceptada"
                sx={{ 
                  mt: 1,
                  bgcolor: colors.status.success,
                  color: 'white',
                  fontWeight: '600'
                }}
              />
            </Box>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<VerifiedUserIcon />}
                sx={{ 
                  textTransform: 'none',
                  bgcolor: colors.primary.main,
                  '&:hover': { bgcolor: colors.primary.dark }
                }}
                onClick={() => {
                  const todasGuardadas = Object.values(apartadosData).every(a => a.guardado);
                  if (todasGuardadas) {
                    alert('Declaración anual enviada exitosamente para validación por el Comité de Cumplimiento y Autorregulación.');
                  } else {
                    alert('Debe completar y guardar todas las declaraciones antes de enviar.');
                  }
                }}
              >
                Enviar Declaración Anual
              </Button>
            </Stack>
          </Box>

          {/* Stepper de progreso actualizado con Artículo 92 primero */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step>
              <StepLabel sx={{
                '& .MuiStepLabel-label': {
                  color: activeStep === 0 ? colors.primary.main : colors.text.secondary
                }
              }}>Artículo 92 - Conflictos de Interés</StepLabel>
            </Step>
            <Step>
              <StepLabel sx={{
                '& .MuiStepLabel-label': {
                  color: activeStep === 1 ? colors.primary.main : colors.text.secondary
                }
              }}>Artículo 95 - Principios Rectores</StepLabel>
            </Step>
            <Step>
              <StepLabel sx={{
                '& .MuiStepLabel-label': {
                  color: activeStep === 2 ? colors.primary.main : colors.text.secondary
                }
              }}>Artículo 96 - Conocimiento del Mandante</StepLabel>
            </Step>
            <Step>
              <StepLabel sx={{
                '& .MuiStepLabel-label': {
                  color: activeStep === 3 ? colors.primary.main : colors.text.secondary
                }
              }}>Artículo 97 - Materialidad</StepLabel>
            </Step>
            <Step>
              <StepLabel sx={{
                '& .MuiStepLabel-label': {
                  color: activeStep === 4 ? colors.primary.main : colors.text.secondary
                }
              }}>Artículo 98 - Reglas de Seguridad</StepLabel>
            </Step>
          </Stepper>

          {/* Nivel de Cumplimiento con indicadores */}
          <Card sx={{ mb: 4, bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ mb: 2, color: colors.text.primary }}>
                  Mi Nivel de Cumplimiento General
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ 
                      color: cumplimientoGeneral >= 70 ? colors.status.success : colors.status.warning,
                      fontWeight: 'bold'
                    }}>
                      {cumplimientoGeneral}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Progreso Total
                    </Typography>
                  </Box>
                  
                  <LinearProgress 
                    variant="determinate" 
                    value={cumplimientoGeneral}
                    sx={{ 
                      flexGrow: 1,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: cumplimientoGeneral >= 70 ? colors.status.success : colors.status.warning,
                        borderRadius: 10
                      }
                    }}
                  />
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LawIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: colors.text.primary }}>
                        {indicadoresCalculados.guardados} de {indicadoresCalculados.totalApartados} artículos declarados
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ color: colors.status.success, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: colors.text.primary }}>
                        {indicadoresCalculados.altoCumplimiento} artículos con cumplimiento óptimo
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WarningIcon sx={{ color: colors.status.warning, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: colors.text.primary }}>
                        {indicadoresCalculados.areasMejora} declaraciones pendientes
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              
              {/* Tabla de indicadores por apartado */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon sx={{ color: colors.primary.main }} /> Mi Progreso por Artículo
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: '600', color: colors.text.primary }}>Artículo</TableCell>
                        <TableCell sx={{ fontWeight: '600', color: colors.text.primary }}>Descripción</TableCell>
                        <TableCell sx={{ fontWeight: '600', color: colors.text.primary }} align="center">Cumplimiento</TableCell>
                        <TableCell sx={{ fontWeight: '600', color: colors.text.primary }} align="center">Estado</TableCell>
                        <TableCell sx={{ fontWeight: '600', color: colors.text.primary }} align="center">Declaraciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.values(apartadosData).map((apartado) => {
                        if (!apartado) return null;
                        
                        const cumplimiento = calcularCumplimientoApartado(apartado);
                        const checks = apartado.checks || [];
                        const checksMarcados = checks.filter(check => check && check.checked === true).length;
                        const checksTotales = checks.length;
                        const textoEstado = obtenerTextoEstado(apartado);
                        
                        return (
                          <TableRow key={apartado.id || 'unknown'} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ color: apartado.color || colors.primary.main }}>
                                  {obtenerIcono(apartado.id)}
                                </Box>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: '600', color: colors.text.primary }}>
                                    Art. {apartado.articulo || ''}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                    {apartado.titulo ? apartado.titulo.split(' - ')[1] || apartado.titulo : 'Apartado'}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ color: colors.text.primary }}>
                                {apartado.descripcion || 'Sin descripción'}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ 
                                  color: cumplimiento >= 80 ? colors.status.success : 
                                         cumplimiento >= 60 ? colors.status.warning : colors.status.error,
                                  fontWeight: '600'
                                }}>
                                  {cumplimiento}%
                                </Typography>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={cumplimiento}
                                  sx={{ 
                                    width: 60,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: '#e0e0e0',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: cumplimiento >= 80 ? colors.status.success : 
                                                     cumplimiento >= 60 ? colors.status.warning : colors.status.error
                                    }
                                  }}
                                />
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={textoEstado}
                                size="small"
                                color={obtenerColorEstado(apartado)}
                                sx={{ fontWeight: '500' }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" sx={{ color: colors.text.primary }}>
                                {checksMarcados}/{checksTotales}
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

          {/* Apartados principales con cuestionarios */}
          {Object.values(apartadosData).map((apartado) => (
            renderApartado(apartado)
          ))}

          {/* Información adicional */}
          <Alert 
            severity="info" 
            sx={{ mt: 4 }}
            icon={<HelpIcon />}
          >
            <Typography variant="body2">
              <strong>Instrucciones importantes:</strong> Esta declaración anual debe ser presentada conforme a los Artículos 92, 95, 96, 97 y 98 de los Estatutos. 
              Marque cada declaración que aplique a su situación actual. La información proporcionada está sujeta a verificación por el Comité de Cumplimiento y Autorregulación. 
              Las declaraciones falsas u omisiones podrán ser sancionadas conforme al artículo 63.
            </Typography>
          </Alert>
        </>
      )}

      {/* Mensaje si no ha aceptado la declaración */}
      {!declaracionAceptada && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Card sx={{ maxWidth: 600, p: 4, textAlign: 'center' }}>
            <VerifiedUserIcon sx={{ fontSize: 80, color: colors.primary.main, mb: 2 }} />
            <Typography variant="h5" sx={{ color: colors.primary.dark, mb: 2 }}>
              Declaración de Buena Fe Requerida
            </Typography>
            <Typography variant="body1" sx={{ color: colors.text.secondary, mb: 3 }}>
              Para continuar con el proceso de declaraciones, debe aceptar la Declaración de Veracidad y Buena Fe.
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