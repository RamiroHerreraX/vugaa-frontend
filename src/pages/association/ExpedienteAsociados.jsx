import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTodosApartados } from "../../services/apartado";
import {
  subirDocumento,
  getDocumentosSubidosPorApartado,
  eliminarDocumentoSubido,
  descargarArchivo,
  obtenerArchivoBlob,
} from "../../services/documentoSubido";

import { getDocumentosPorApartadoActivos } from "../../services/documentoExpediente";
import { getMiExpediente } from "../../services/expediente";
import { getProgramasPorApartadoActivos } from "../../services/programas";

import AddCertificationModal from "../../components/subirCertificacion/AddCertificationModal";
import {
  crearCertificacionCompleta,
  getCertificacionesPorExpediente,
  obtenerArchivoBlobCertificacion,
  descargarArchivoCertificacion,
  eliminarCertificacionCompleta,
} from "../../services/certificaciones";

// Modales importados
import UploadDocumentModal from "../../components/AsociacionExpediente/UploadDocumentModal";
import PreviewDocumentModal from "../../components/AsociacionExpediente/PreviewDocumentModal";
import DeleteConfirmModal from "../../components/AsociacionExpediente/DeleteConfirmModal";
import ValidationSendModal from "../../components/AsociacionExpediente/ValidationSendModal";

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
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Alert,
  Snackbar,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Security as SecurityIcon,
  CloudUpload as CloudUploadIcon,
  Gavel as GavelIcon,
  Verified as VerifiedIcon,
  Send as SendIcon,
  School as SchoolIcon,
  Update as UpdateIcon,
  Info as InfoIcon,
  FilePresent as FilePresentIcon,
  Close as CloseIcon,
  Folder as FolderIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Shield as ShieldIcon,
} from "@mui/icons-material";

const colors = {
  primary: {
    dark: "#0D2A4D",
    main: "#133B6B",
    light: "#3A6EA5",
  },
  secondary: {
    main: "#00A8A8",
    light: "#00C2D1",
    lighter: "#35D0FF",
  },
  accents: {
    blue: "#0099FF",
    purple: "#6C5CE7",
  },
  status: {
    success: "#00A8A8",
    warning: "#00C2D1",
    error: "#0099FF",
    info: "#3A6EA5",
  },
  text: {
    primary: "#0D2A4D",
    secondary: "#3A6EA5",
    light: "#6C5CE7",
  },
};

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================

const DocumentoSubidoItem = ({
  documento,
  onVer,
  onDescargar,
  onEliminar,
  mostrarFecha = true,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        width: "100%",
        p: 2,
        borderRadius: 2,
        backgroundColor: "#f8f9fa",
        border: `1px solid ${colors.primary.main}20`,
        transition: "all 0.2s",
        "&:hover": {
          backgroundColor: "#ffffff",
          boxShadow: `0 4px 12px ${colors.primary.main}20`,
          borderColor: colors.primary.main,
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: `${colors.primary.main}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <FilePresentIcon
          sx={{ color: colors.primary.main, fontSize: "1.2rem" }}
        />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: "600", color: colors.text.primary, mb: 0.5 }}
        >
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
              "&:hover": { backgroundColor: `${colors.primary.main}25` },
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
              backgroundColor: "#e8f5e9",
              "&:hover": { backgroundColor: "#c8e6c9" },
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
              backgroundColor: "#ffebee",
              "&:hover": { backgroundColor: "#ffcdd2" },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
};

const CertificacionProgramaItem = ({
  documento,
  programa,
  onVer,
  onDescargar,
  onEliminar,
  onEnviarValidacion,
  estadoValidacion,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        width: "100%",
        p: 2,
        borderRadius: 2,
        backgroundColor: "#f8f9fa",
        border: `1px solid ${colors.accents.purple}20`,
        transition: "all 0.2s",
        "&:hover": {
          backgroundColor: "#ffffff",
          boxShadow: `0 4px 12px ${colors.accents.purple}20`,
          borderColor: colors.accents.purple,
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: `${colors.accents.purple}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <SchoolIcon sx={{ color: colors.accents.purple, fontSize: "1.2rem" }} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: "600", color: colors.text.primary, mb: 0.5 }}
        >
          {documento.nombreArchivo || documento.nombre}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
              <strong>Fecha:</strong>{" "}
              {new Date(documento.fecha).toLocaleDateString("es-MX")}
            </Typography>
          )}
          {documento.estado && (
            <Chip
              label={documento.estado}
              size="small"
              sx={{
                height: "18px",
                fontSize: "0.65rem",
                fontWeight: "600",
                backgroundColor:
                  documento.estado === "aprobado"
                    ? "#e8f5e9"
                    : documento.estado === "rechazado"
                      ? "#ffebee"
                      : "#fff3e0",
                color:
                  documento.estado === "aprobado"
                    ? "#2e7d32"
                    : documento.estado === "rechazado"
                      ? "#c62828"
                      : "#e65100",
              }}
            />
          )}
        </Box>
      </Box>

      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}
      >
        {estadoValidacion && (
          <Chip
            label={
              estadoValidacion.estado === "enviado" ? "ENVIADO" : "PENDIENTE"
            }
            size="small"
            color={
              estadoValidacion.estado === "enviado" ? "success" : "warning"
            }
            icon={
              estadoValidacion.estado === "enviado" ? (
                <CheckCircleIcon />
              ) : (
                <WarningIcon />
              )
            }
            sx={{ height: "24px", fontSize: "0.7rem" }}
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
                "&:hover": { backgroundColor: `${colors.primary.main}25` },
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
                backgroundColor: "#e8f5e9",
                "&:hover": { backgroundColor: "#c8e6c9" },
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
                backgroundColor: "#ffebee",
                "&:hover": { backgroundColor: "#ffcdd2" },
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

  // Estados principales
  const [expediente, setExpediente] = useState(null);
  const [archivosSubidos, setArchivosSubidos] = useState({});
  const [apartadosDinamicos, setApartadosDinamicos] = useState([]);
  const [loadingApartados, setLoadingApartados] = useState(false);
  const [expanded, setExpanded] = useState("panel1");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Estados para certificaciones de programas
  const [documentosProgramas, setDocumentosProgramas] = useState({});
  const [estadosValidacionProgramas, setEstadosValidacionProgramas] = useState(
    {},
  );
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [progSeleccionado, setProgSeleccionado] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [nuevaCertificacion, setNuevaCertificacion] = useState({
    subseccion: "",
    tipoDocumento: "",
    institucion: "",
    fecha: new Date().toISOString().split("T")[0],
    horas: "",
    archivo: null,
    nombreArchivo: "",
  });

  // Estados para modales
  const [uploadDialog, setUploadDialog] = useState({
    open: false,
    tipo: "",
    titulo: "",
    archivo: null,
    nombreArchivo: "",
    idDocumentoPlantilla: null,
    uploading: false,
    progress: 0,
  });

  const [previewDialog, setPreviewDialog] = useState({
    open: false,
    documento: null,
    nombre: "",
    tipo: "",
    seccion: "",
    loading: false,
    objectUrl: null,
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    seccion: "",
    subseccion: "",
    documentoId: null,
    tipo: "",
    nombre: "",
    horas: 0,
    itemName: "",
    itemIndex: null,
  });

  const [validacionDialog, setValidacionDialog] = useState({
    open: false,
    programa: null,
    documento: null,
    fecha: "",
  });

  // ============================================================
  // EFECTOS
  // ============================================================

  useEffect(() => {
    const cargarExpediente = async () => {
      if (!user?.id || !user?.instanciaId) return;
      try {
        const miExpediente = await getMiExpediente();
        setExpediente(miExpediente);
      } catch (error) {
        console.error("Error cargando expediente:", error);
      }
    };
    cargarExpediente();
  }, [user?.id, user?.instanciaId]);

  useEffect(() => {
    const cargarApartados = async () => {
      if (!user?.instanciaId) return;
      setLoadingApartados(true);
      try {
        const todos = await getTodosApartados();
        const globales = todos.filter(
          (a) => !a.idInstancia || a.idInstancia === user.instanciaId,
        );

        const apartadosTransformados = await Promise.all(
          globales.map(async (apartado) => {
            let programas = [];
            try {
              programas = await getProgramasPorApartadoActivos(
                apartado.idApartado,
              );
            } catch (error) {
              console.error(
                `Error cargando programas del apartado ${apartado.idApartado}:`,
                error,
              );
            }
            let documentos = [];
            try {
              documentos = await getDocumentosPorApartadoActivos(
                apartado.idApartado,
              );
            } catch (error) {
              console.error(
                `Error cargando docs del apartado ${apartado.idApartado}:`,
                error,
              );
            }
            return {
              id: `apartado_${apartado.idApartado}`,
              idApartado: apartado.idApartado,
              nombre: apartado.nombre,
              titulo: apartado.nombre,
              descripcion: apartado.descripcion || "",
              icono: apartado.icono || "description",
              orden: apartado.orden || 0,
              obligatorio: apartado.obligatorio || false,
              esGlobal: !apartado.idInstancia,
              documentos: documentos || [],
              programas: programas || [],
            };
          }),
        );

        setApartadosDinamicos(apartadosTransformados);

        if (expediente?.id) {
          const subidosPorApartado = {};
          await Promise.all(
            globales.map(async (apartado) => {
              try {
                const docs = await getDocumentosSubidosPorApartado(
                  expediente.id,
                  apartado.idApartado,
                );
                if (docs?.length > 0) {
                  subidosPorApartado[apartado.idApartado] = {};
                  docs.forEach((doc) => {
                    if (doc.idDocumentoPlantilla) {
                      subidosPorApartado[apartado.idApartado][
                        doc.idDocumentoPlantilla
                      ] = doc;
                    }
                  });
                }
              } catch (error) {
                console.error(
                  `Error cargando docs subidos del apartado ${apartado.idApartado}:`,
                  error,
                );
              }
            }),
          );
          setArchivosSubidos(subidosPorApartado);

          try {
            const certs = await getCertificacionesPorExpediente(expediente.id);
            const docsPrograma = {};
            certs.forEach((cert) => {
              if (cert.idPrograma) {
                docsPrograma[cert.idPrograma] = {
                  id: cert.idCertExp,
                  idCertificacion: cert.idCertificacion,
                  nombreArchivo:
                    cert.nombreArchivo ||
                    cert.nombreCertificacion ||
                    "documento",
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
            console.error("Error cargando certs de programas:", error);
          }
        }
      } catch (error) {
        console.error("Error cargando apartados:", error);
        setSnackbar({
          open: true,
          message: "Error al cargar los apartados",
          severity: "error",
        });
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
      description: <DescriptionIcon />,
      folder: <FolderIcon />,
      security: <SecurityIcon />,
      work: <WorkIcon />,
      business: <BusinessIcon />,
      cloud: <CloudUploadIcon />,
      verified: <VerifiedIcon />,
      person: <PersonIcon />,
      gavel: <GavelIcon />,
      school: <SchoolIcon />,
      file: <DescriptionIcon />,
      document: <DescriptionIcon />,
      certificate: <VerifiedIcon />,
      assignment: <AssignmentIcon />,
      article: <DescriptionIcon />,
      book: <SchoolIcon />,
      menu_book: <SchoolIcon />,
      fact_check: <VerifiedIcon />,
      check_circle: <CheckCircleIcon />,
      warning: <WarningIcon />,
      info: <InfoIcon />,
      timeline: <TimelineIcon />,
      assessment: <AssessmentIcon />,
      shield: <ShieldIcon />,
    };
    return iconMap[icono?.toLowerCase()] || <DescriptionIcon />;
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const detectarTipoArchivo = (nombreArchivo) => {
    const ext = nombreArchivo?.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "pdf";
    if (["png", "jpg", "jpeg", "gif"].includes(ext)) return "image";
    if (["docx", "xlsx", "pptx"].includes(ext)) return "office";
    if (["txt", "csv"].includes(ext)) return "text";
    if (ext === "mp4") return "video";
    if (ext === "mp3") return "audio";
    return "unknown";
  };

  // ============================================================
  // HANDLERS DE DOCUMENTOS
  // ============================================================

  const handleVerDocumento = async (documento, seccion) => {
    const nombre =
      documento.nombreOriginal ||
      documento.nombreArchivo ||
      documento.documento ||
      "documento";

    if (!documento.idDocumentoSubido) {
      setPreviewDialog({
        open: true,
        documento: null,
        nombre,
        tipo: detectarTipoArchivo(nombre),
        seccion,
        loading: false,
        objectUrl: null,
      });
      return;
    }

    setPreviewDialog({
      open: true,
      documento: null,
      nombre,
      tipo: detectarTipoArchivo(nombre),
      seccion,
      loading: true,
      objectUrl: null,
    });

    try {
      const blob = await obtenerArchivoBlob(documento.idDocumentoSubido);
      const objectUrl = URL.createObjectURL(blob);
      setPreviewDialog((prev) => ({ ...prev, loading: false, objectUrl }));
    } catch (error) {
      console.error("Error al cargar vista previa:", error);
      setSnackbar({
        open: true,
        message: "No se pudo cargar la vista previa",
        severity: "error",
      });
      setPreviewDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleDescargarDocumento = async (documento) => {
    if (documento.idDocumentoSubido) {
      try {
        setSnackbar({
          open: true,
          message: "Descargando archivo...",
          severity: "info",
        });
        await descargarArchivo(
          documento.idDocumentoSubido,
          documento.nombreOriginal,
        );
        setSnackbar({
          open: true,
          message: "Archivo descargado correctamente",
          severity: "success",
        });
      } catch (error) {
        console.error("Error al descargar:", error);
        setSnackbar({
          open: true,
          message: "Error al descargar el archivo",
          severity: "error",
        });
      }
      return;
    }
    setSnackbar({
      open: true,
      message: `Descargando ${documento.nombreArchivo || documento.nombreOriginal}...`,
      severity: "info",
    });
    setTimeout(
      () =>
        setSnackbar({
          open: true,
          message: "Documento descargado correctamente",
          severity: "success",
        }),
      1000,
    );
  };

  const handleEliminarDocumentoSubido = (doc, idApartado) => {
    setDeleteDialog({
      open: true,
      seccion: "documentoSubido",
      subseccion: doc.idDocumentoPlantilla,
      documentoId: doc.idDocumentoSubido,
      tipo: "documentoSubido",
      nombre: doc.nombreOriginal,
      horas: 0,
      itemName: "",
      itemIndex: idApartado,
    });
  };

  const handleEliminarDocumentoPrograma = (programaId, documento) => {
    setDeleteDialog({
      open: true,
      seccion: "programa",
      subseccion: documento.idCertificacion,
      documentoId: documento.id,
      tipo: "programa",
      nombre: documento.nombreArchivo || documento.nombre,
      horas: 0,
      itemName: "",
      itemIndex: programaId,
    });
  };

  const handleEnviarValidacionPrograma = (programa, documento) => {
    const fechaActual = new Date().toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setValidacionDialog({
      open: true,
      programa,
      documento,
      fecha: fechaActual,
    });
  };

  const handleConfirmarValidacionPrograma = () => {
    const { programa, documento, fecha } = validacionDialog;
    setEstadosValidacionProgramas((prev) => ({
      ...prev,
      [programa.id]: {
        enviado: true,
        fechaEnvio: fecha,
        estado: "enviado",
        documentoId: documento.id,
      },
    }));
    setSnackbar({
      open: true,
      message: `Certificación enviada a validación correctamente`,
      severity: "success",
    });
    setValidacionDialog({
      open: false,
      programa: null,
      documento: null,
      fecha: "",
    });
  };

  const handleCerrarValidacionDialog = () => {
    setValidacionDialog({
      open: false,
      programa: null,
      documento: null,
      fecha: "",
    });
  };

  const handleConfirmarEliminacion = async () => {
    const { seccion, documentoId, itemIndex, subseccion } = deleteDialog;

    if (seccion === "documentoSubido") {
      try {
        await eliminarDocumentoSubido(documentoId);
        const idApartado = itemIndex;
        const idPlantilla = subseccion;
        setArchivosSubidos((prev) => {
          const apartadoDocs = { ...(prev[idApartado] || {}) };
          delete apartadoDocs[idPlantilla];
          return { ...prev, [idApartado]: apartadoDocs };
        });
      } catch (error) {
        console.error("Error al eliminar documento:", error);
        setSnackbar({
          open: true,
          message: "Error al eliminar el documento",
          severity: "error",
        });
        setDeleteDialog({
          open: false,
          seccion: "",
          subseccion: "",
          documentoId: null,
          tipo: "",
          nombre: "",
          horas: 0,
          itemName: "",
          itemIndex: null,
        });
        return;
      }
    } else if (seccion === "programa") {
      try {
        await eliminarCertificacionCompleta(documentoId, subseccion);
        const programaId = itemIndex;
        setDocumentosProgramas((prev) => {
          const newDocs = { ...prev };
          delete newDocs[programaId];
          return newDocs;
        });
        setEstadosValidacionProgramas((prev) => {
          const newState = { ...prev };
          delete newState[programaId];
          return newState;
        });
      } catch (error) {
        console.error("Error al eliminar certificación:", error);
        setSnackbar({
          open: true,
          message: "Error al eliminar la certificación",
          severity: "error",
        });
        setDeleteDialog({
          open: false,
          seccion: "",
          subseccion: "",
          documentoId: null,
          tipo: "",
          nombre: "",
          horas: 0,
          itemName: "",
          itemIndex: null,
        });
        return;
      }
    }

    setSnackbar({
      open: true,
      message: "Documento eliminado correctamente",
      severity: "success",
    });
    setDeleteDialog({
      open: false,
      seccion: "",
      subseccion: "",
      documentoId: null,
      tipo: "",
      nombre: "",
      horas: 0,
      itemName: "",
      itemIndex: null,
    });
  };

  const handleOpenUploadDialog = (
    tipo,
    titulo,
    idDocumentoPlantilla = null,
  ) => {
    setUploadDialog({
      open: true,
      tipo,
      titulo,
      archivo: null,
      nombreArchivo: "",
      idDocumentoPlantilla,
      uploading: false,
      progress: 0,
    });
  };

  const handleCumplimientoFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: "El archivo no puede ser mayor a 10MB",
        severity: "error",
      });
      return;
    }
    const tiposPermitidos = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!tiposPermitidos.includes(file.type)) {
      setSnackbar({
        open: true,
        message: "Formato no permitido. Use PDF, DOC o DOCX",
        severity: "error",
      });
      return;
    }
    setUploadDialog({
      ...uploadDialog,
      archivo: file,
      nombreArchivo: file.name,
    });
  };

  const handleGuardarDocumentoCumplimiento = async () => {
    if (!uploadDialog.archivo) return;

    setUploadDialog((prev) => ({ ...prev, uploading: true, progress: 0 }));

    const progressInterval = setInterval(() => {
      setUploadDialog((prev) => {
        if (prev.progress >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return { ...prev, progress: prev.progress + 10 };
      });
    }, 200);

    if (uploadDialog.tipo?.startsWith("apartado_")) {
      const idApartado = parseInt(uploadDialog.tipo.replace("apartado_", ""));
      try {
        const payload = {
          idExpediente: expediente?.id,
          idInstancia: user.instanciaId,
          idApartado: idApartado,
          idDocumentoPlantilla: uploadDialog.idDocumentoPlantilla,
          nombreOriginal: uploadDialog.archivo.name,
          requiereValidacion: false,
          usuarioCarga: user.id,
        };

        clearInterval(progressInterval);
        setUploadDialog((prev) => ({ ...prev, progress: 100 }));

        const documentoGuardado = await subirDocumento(
          payload,
          uploadDialog.archivo,
        );

        setTimeout(() => {
          setArchivosSubidos((prev) => ({
            ...prev,
            [idApartado]: {
              ...(prev[idApartado] || {}),
              [uploadDialog.idDocumentoPlantilla]: {
                ...documentoGuardado,
                fechaSubida: new Date().toLocaleDateString("es-MX"),
              },
            },
          }));
          setSnackbar({
            open: true,
            message: `Documento "${uploadDialog.archivo.name}" subido correctamente`,
            severity: "success",
          });
          setUploadDialog({
            open: false,
            tipo: "",
            titulo: "",
            archivo: null,
            nombreArchivo: "",
            uploading: false,
            progress: 0,
          });
        }, 500);
      } catch (error) {
        clearInterval(progressInterval);
        console.error("Error al subir documento:", error);
        setSnackbar({
          open: true,
          message: "Error al subir el documento",
          severity: "error",
        });
        setUploadDialog((prev) => ({ ...prev, uploading: false, progress: 0 }));
      }
    }
  };

  // Handlers para certificaciones
  const handleNuevaCertificacionChange = (campo) => (event) => {
    setNuevaCertificacion((prev) => ({ ...prev, [campo]: event.target.value }));
  };

  const handleCertFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: "El archivo no puede ser mayor a 10MB",
        severity: "error",
      });
      return;
    }
    const tiposPermitidos = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    if (!tiposPermitidos.includes(file.type)) {
      setSnackbar({
        open: true,
        message: "Formato no permitido. Use PDF, DOC, DOCX, JPG o PNG",
        severity: "error",
      });
      return;
    }
    setNuevaCertificacion((prev) => ({
      ...prev,
      archivo: file,
      nombreArchivo: file.name,
    }));
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

  const handleGuardarCertDesdePrograma = async () => {
    if (
      !nuevaCertificacion.tipoDocumento ||
      !nuevaCertificacion.institucion ||
      !nuevaCertificacion.horas ||
      !nuevaCertificacion.archivo
    ) {
      setSnackbar({
        open: true,
        message: "Complete todos los campos requeridos",
        severity: "warning",
      });
      return;
    }
    setSaving(true);
    try {
      const nuevoDoc = await crearCertificacionCompleta(
        {
          nombre: nuevaCertificacion.tipoDocumento,
          institucion: nuevaCertificacion.institucion,
          horas: parseInt(nuevaCertificacion.horas),
          fecha: nuevaCertificacion.fecha,
          nombreArchivo: nuevaCertificacion.nombreArchivo,
          descripcion: "",
        },
        user?.instanciaId,
        expediente?.id,
        progSeleccionado?.id,
        nuevaCertificacion.archivo,
      );

      if (progSeleccionado) {
        setDocumentosProgramas((prev) => ({
          ...prev,
          [progSeleccionado.id]: {
            id: nuevoDoc.idCertExp,
            idCertificacion: nuevoDoc.idCertificacion,
            nombreArchivo:
              nuevoDoc.nombreArchivo || nuevaCertificacion.nombreArchivo,
            nombre:
              nuevoDoc.nombreCertificacion || nuevaCertificacion.tipoDocumento,
            institucion: nuevoDoc.institucion || nuevaCertificacion.institucion,
            horas:
              nuevoDoc.horasAcreditadas || parseInt(nuevaCertificacion.horas),
            fecha: nuevoDoc.fechaEmision || nuevaCertificacion.fecha,
            idDocumentoSubido: nuevoDoc.mongoDocumentoId,
            estado: nuevoDoc.estado || "pendiente",
          },
        }));
      }

      setSnackbar({
        open: true,
        message: "Certificación enviada para validación",
        severity: "success",
      });
      setCertModalOpen(false);
      setProgSeleccionado(null);
      setNuevaCertificacion({
        subseccion: "",
        tipoDocumento: "",
        institucion: "",
        fecha: new Date().toISOString().split("T")[0],
        horas: "",
        archivo: null,
        nombreArchivo: "",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Error al guardar la certificación",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // RENDER APARTADO DINÁMICO
  // ============================================================
  const renderApartadoDinamico = (apartado) => {
    const tieneDocumentos = apartado.documentos?.length > 0;
    const tieneProgramas = apartado.programas?.length > 0;
    const documentosSubidosCount = Object.keys(
      archivosSubidos[apartado.idApartado] || {},
    ).length;
    const programasCompletados =
      apartado.programas?.filter((p) => documentosProgramas[p.id]).length || 0;

    const progresoTotal =
      tieneDocumentos || tieneProgramas
        ? Math.round(
            ((documentosSubidosCount + programasCompletados) /
              ((tieneDocumentos ? apartado.documentos.length : 0) +
                (tieneProgramas ? apartado.programas.length : 0))) *
              100,
          )
        : 0;

    return (
      <Accordion
        key={apartado.id}
        expanded={expanded === apartado.id}
        onChange={handleAccordionChange(apartado.id)}
        sx={{
          mb: 2,
          border: "1px solid",
          borderColor:
            progresoTotal === 100
              ? colors.status.success + "80"
              : colors.primary.light + "40",
          borderRadius: "8px !important",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          "&:before": { display: "none" },
          "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: expanded === apartado.id ? "#f8f9fa" : "white",
            "& .MuiAccordionSummary-content": { alignItems: "center" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor:
                  progresoTotal === 100
                    ? "#e8f5e9"
                    : apartado.esGlobal
                      ? "#f3e5f5"
                      : "#e3f2fd",
                color:
                  progresoTotal === 100
                    ? colors.status.success
                    : apartado.esGlobal
                      ? colors.accents.purple
                      : colors.primary.main,
              }}
            >
              {getIconForApartado(apartado.icono)}
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography
                sx={{
                  fontWeight: "700",
                  color: colors.text.primary,
                  fontSize: "1rem",
                }}
              >
                {apartado.nombre}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  flexWrap: "wrap",
                  mt: 0.5,
                }}
              >
                {apartado.descripcion && (
                  <Typography
                    variant="caption"
                    sx={{ color: colors.text.secondary }}
                  >
                    {apartado.descripcion}
                  </Typography>
                )}
                {apartado.esGlobal && (
                  <Chip
                    label="Global"
                    size="small"
                    sx={{
                      height: "18px",
                      fontSize: "0.6rem",
                      backgroundColor: colors.accents.purple,
                      color: "white",
                    }}
                  />
                )}
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {progresoTotal > 0 && (
                <Box
                  sx={{ width: "80px", display: { xs: "none", sm: "block" } }}
                >
                  <LinearProgress
                    variant="determinate"
                    value={progresoTotal}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "#f0f0f0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          progresoTotal === 100
                            ? colors.status.success
                            : colors.primary.main,
                      },
                    }}
                  />
                </Box>
              )}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {tieneDocumentos && (
                  <Tooltip title="Documentos requeridos">
                    <Chip
                      icon={
                        <DescriptionIcon
                          sx={{ fontSize: "0.8rem !important" }}
                        />
                      }
                      label={`${documentosSubidosCount}/${apartado.documentos.length}`}
                      size="small"
                      color={
                        documentosSubidosCount === apartado.documentos.length
                          ? "success"
                          : "default"
                      }
                      sx={{ height: "24px", fontSize: "0.7rem" }}
                    />
                  </Tooltip>
                )}
                {tieneProgramas && (
                  <Tooltip title="Programas">
                    <Chip
                      icon={
                        <SchoolIcon sx={{ fontSize: "0.8rem !important" }} />
                      }
                      label={`${programasCompletados}/${apartado.programas.length}`}
                      size="small"
                      color={
                        programasCompletados === apartado.programas.length
                          ? "success"
                          : "primary"
                      }
                      sx={{ height: "24px", fontSize: "0.7rem" }}
                    />
                  </Tooltip>
                )}
                {apartado.obligatorio && (
                  <Chip
                    label="Obligatorio"
                    size="small"
                    color="error"
                    sx={{ height: "20px", fontSize: "0.65rem" }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ pt: 3, pb: 3, backgroundColor: "#fafafa" }}>
          {/* DOCUMENTOS REQUERIDOS */}
          {tieneDocumentos && (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                mb: tieneProgramas ? 3 : 0,
                borderRadius: 2,
                border: `2px solid ${documentosSubidosCount === apartado.documentos.length ? colors.status.success + "80" : colors.primary.main + "20"}`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "600",
                    color: colors.text.primary,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <DescriptionIcon
                    sx={{
                      color:
                        documentosSubidosCount === apartado.documentos.length
                          ? colors.status.success
                          : colors.primary.main,
                    }}
                  />
                  Documentos Requeridos
                  {documentosSubidosCount === apartado.documentos.length && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Completado"
                      size="small"
                      color="success"
                      sx={{ ml: 1, height: "24px" }}
                    />
                  )}
                </Typography>
              </Box>

              <Stack spacing={2}>
                {apartado.documentos.map((doc) => {
                  const docSubido =
                    archivosSubidos[apartado.idApartado]?.[doc.idDocumento];
                  return (
                    <Paper
                      key={doc.idDocumento}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        width: "100%",
                        boxSizing: "border-box",
                        border: `1px solid ${docSubido ? colors.status.success + "40" : colors.primary.main + "20"}`,
                        borderLeft: `4px solid ${docSubido ? colors.status.success : colors.primary.main}`,
                        backgroundColor: "white",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            flexShrink: 0,
                            backgroundColor: docSubido
                              ? "#e8f5e9"
                              : `${colors.primary.main}10`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {docSubido ? (
                            <CheckCircleIcon
                              sx={{
                                color: colors.status.success,
                                fontSize: "1.2rem",
                              }}
                            />
                          ) : (
                            <DescriptionIcon
                              sx={{
                                color: colors.primary.main,
                                fontSize: "1.2rem",
                              }}
                            />
                          )}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 1,
                            }}
                          >
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: "700",
                                  color: colors.text.primary,
                                }}
                              >
                                {doc.nombreArchivo}
                              </Typography>
                              {doc.descripcion && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: colors.text.secondary,
                                    display: "block",
                                    mt: 0.5,
                                  }}
                                >
                                  {doc.descripcion}
                                </Typography>
                              )}
                            </Box>
                            {doc.obligatorio && (
                              <Chip
                                label="Obligatorio"
                                size="small"
                                color="error"
                                sx={{
                                  height: "20px",
                                  fontSize: "0.65rem",
                                  flexShrink: 0,
                                }}
                              />
                            )}
                          </Box>
                          {docSubido ? (
                            <DocumentoSubidoItem
                              documento={docSubido}
                              onVer={handleVerDocumento}
                              onDescargar={handleDescargarDocumento}
                              onEliminar={(doc) =>
                                handleEliminarDocumentoSubido(
                                  doc,
                                  apartado.idApartado,
                                )
                              }
                              mostrarFecha={true}
                            />
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: 1,
                              }}
                            >
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<CloudUploadIcon />}
                                onClick={() =>
                                  handleOpenUploadDialog(
                                    `apartado_${apartado.idApartado}`,
                                    doc.nombreArchivo,
                                    doc.idDocumento,
                                  )
                                }
                                sx={{
                                  textTransform: "none",
                                  fontSize: "0.8rem",
                                  color: colors.primary.main,
                                  borderColor: colors.primary.main,
                                  "&:hover": {
                                    backgroundColor: `${colors.primary.main}10`,
                                  },
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

          {/* PROGRAMAS Y CERTIFICACIONES */}
          {tieneProgramas && (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 2,
                border: `2px solid ${programasCompletados === apartado.programas.length ? colors.status.success + "80" : colors.accents.purple + "20"}`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "600",
                    color: colors.text.primary,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <SchoolIcon
                    sx={{
                      color:
                        programasCompletados === apartado.programas.length
                          ? colors.status.success
                          : colors.accents.purple,
                    }}
                  />
                  Programas y Certificaciones
                  {programasCompletados === apartado.programas.length && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Completado"
                      size="small"
                      color="success"
                      sx={{ ml: 1, height: "24px" }}
                    />
                  )}
                </Typography>
              </Box>

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
                        width: "100%",
                        boxSizing: "border-box",
                        border: `1px solid ${docPrograma ? colors.status.success + "40" : colors.accents.purple + "20"}`,
                        borderLeft: `4px solid ${docPrograma ? colors.status.success : colors.accents.purple}`,
                        backgroundColor: "white",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            flexShrink: 0,
                            backgroundColor: docPrograma
                              ? "#e8f5e9"
                              : `${colors.accents.purple}10`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {docPrograma ? (
                            <CheckCircleIcon
                              sx={{
                                color: colors.status.success,
                                fontSize: "1.2rem",
                              }}
                            />
                          ) : (
                            <SchoolIcon
                              sx={{
                                color: colors.accents.purple,
                                fontSize: "1.2rem",
                              }}
                            />
                          )}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 1,
                            }}
                          >
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: "700",
                                  color: colors.text.primary,
                                }}
                              >
                                {prog.nombre}
                              </Typography>
                              {prog.descripcion && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: colors.text.secondary,
                                    display: "block",
                                    mt: 0.5,
                                  }}
                                >
                                  {prog.descripcion}
                                </Typography>
                              )}
                            </Box>
                            {prog.horasRequeridas && (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 0.5,
                                  alignItems: "flex-end",
                                }}
                              >
                                <Chip
                                  label={`Horas requeridas: ${prog.horasRequeridas} hrs`}
                                  size="small"
                                  sx={{
                                    height: "20px",
                                    fontSize: "0.65rem",
                                    backgroundColor: `${colors.accents.purple}15`,
                                    color: colors.accents.purple,
                                  }}
                                />
                                <Chip
                                  label={
                                    docPrograma
                                      ? docPrograma.horas >=
                                        prog.horasRequeridas
                                        ? "✓ Horas completas"
                                        : `Horas faltantes: ${prog.horasRequeridas - docPrograma.horas} hrs`
                                      : `Horas faltantes: ${prog.horasRequeridas} hrs`
                                  }
                                  size="small"
                                  sx={{
                                    height: "20px",
                                    fontSize: "0.65rem",
                                    backgroundColor:
                                      docPrograma &&
                                      docPrograma.horas >= prog.horasRequeridas
                                        ? "#e8f5e9"
                                        : "#fff3e0",
                                    color:
                                      docPrograma &&
                                      docPrograma.horas >= prog.horasRequeridas
                                        ? colors.status.success
                                        : "#e65100",
                                  }}
                                />
                              </Box>
                            )}
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
                                  objectUrl: null,
                                });
                                obtenerArchivoBlobCertificacion(doc.id)
                                  .then((blob) => {
                                    const objectUrl = URL.createObjectURL(blob);
                                    setPreviewDialog((prev) => ({
                                      ...prev,
                                      loading: false,
                                      objectUrl,
                                    }));
                                  })
                                  .catch((error) => {
                                    setSnackbar({
                                      open: true,
                                      message: `Error ${error.response?.status}: No se pudo cargar el archivo`,
                                      severity: "error",
                                    });
                                    setPreviewDialog((prev) => ({
                                      ...prev,
                                      loading: false,
                                    }));
                                  });
                              }}
                              onDescargar={(doc) => {
                                descargarArchivoCertificacion(
                                  doc.id,
                                  doc.nombreArchivo,
                                ).catch(() =>
                                  setSnackbar({
                                    open: true,
                                    message: "Error al descargar el archivo",
                                    severity: "error",
                                  }),
                                );
                              }}
                              onEliminar={(doc) =>
                                handleEliminarDocumentoPrograma(prog.id, doc)
                              }
                              onEnviarValidacion={
                                handleEnviarValidacionPrograma
                              }
                              estadoValidacion={estadoValidacion}
                            />
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: 1,
                              }}
                            >
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={
                                  <CloudUploadIcon
                                    sx={{ fontSize: "0.8rem" }}
                                  />
                                }
                                onClick={() => {
                                  setProgSeleccionado(prog);
                                  setCertModalOpen(true);
                                }}
                                sx={{
                                  textTransform: "none",
                                  fontSize: "0.75rem",
                                  bgcolor: colors.accents.purple,
                                  "&:hover": { bgcolor: "#5a4bd1" },
                                  height: "32px",
                                  px: 2,
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
  // CÁLCULO DE CUMPLIMIENTO
  // ============================================================
  const calculateCompliance = () => {
    const totalDocumentos = apartadosDinamicos.reduce(
      (acc, ap) => acc + (ap.documentos?.length || 0),
      0,
    );
    const totalProgramas = apartadosDinamicos.reduce(
      (acc, ap) => acc + (ap.programas?.length || 0),
      0,
    );
    const totalRequerido = totalDocumentos + totalProgramas;
    if (totalRequerido === 0) return 0;

    const docsSubidos = Object.values(archivosSubidos).reduce(
      (acc, ap) => acc + Object.keys(ap).length,
      0,
    );
    const programasSubidos = Object.keys(documentosProgramas).length;
    return Math.min(
      100,
      Math.round(((docsSubidos + programasSubidos) / totalRequerido) * 100),
    );
  };

  const compliance = calculateCompliance();

  // ============================================================
  // RETURN PRINCIPAL
  // ============================================================
  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          pb: 2,
          borderBottom: `2px solid ${colors.primary.main}20`,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: colors.primary.dark,
              fontWeight: "bold",
              mb: 1,
              letterSpacing: "-0.5px",
            }}
          >
            Expediente Digital
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text.secondary }}>
            Comienza a construir tu expediente cargando tus certificaciones y
            documentos
          </Typography>
        </Box>
      </Box>

      {/* Nivel de Cumplimiento */}
      <Card
        sx={{
          mb: 4,
          bgcolor:
            compliance >= 70
              ? "#e8f5e9"
              : compliance >= 30
                ? "#fff3e0"
                : "#ffebee",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} md={7}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4} sm={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h2"
                      sx={{
                        color:
                          compliance >= 70
                            ? colors.status.success
                            : compliance >= 30
                              ? colors.status.warning
                              : colors.status.error,
                        fontWeight: "bold",
                        mb: 0.5,
                        fontSize: { xs: "3rem", sm: "3.5rem" },
                      }}
                    >
                      {compliance}%
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.text.secondary, fontWeight: "500" }}
                    >
                      Cumplimiento
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs="auto"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  <Divider orientation="vertical" sx={{ height: "60px" }} />
                </Grid>
                <Grid item xs={8} sm={8}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: colors.primary.dark,
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      Progreso General
                    </Typography>
                    <Chip
                      label={
                        compliance >= 70
                          ? "BUEN PROGRESO"
                          : compliance >= 30
                            ? "EN PROCESO"
                            : "POR COMENZAR"
                      }
                      color={
                        compliance >= 70
                          ? "success"
                          : compliance >= 30
                            ? "warning"
                            : "error"
                      }
                      size="small"
                      sx={{ height: "24px" }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: colors.text.secondary, mb: 2 }}
                  >
                    {compliance >= 70
                      ? "Excelente avance en tu expediente"
                      : compliance >= 30
                        ? "Continúa agregando documentos"
                        : "Comienza cargando tu primera certificación"}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={compliance}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      backgroundColor: "#f0f0f0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          compliance >= 70
                            ? colors.status.success
                            : compliance >= 30
                              ? colors.status.warning
                              : colors.status.error,
                        backgroundImage:
                          compliance >= 70
                            ? `linear-gradient(90deg, ${colors.status.success}, ${colors.secondary.main})`
                            : undefined,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs="auto" sx={{ display: { xs: "none", md: "block" } }}>
              <Divider orientation="vertical" sx={{ height: "80px" }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={1.5}>
                {[
                  {
                    value: Object.keys(documentosProgramas).length,
                    label: "Certificaciones",
                    color: colors.primary.main,
                    icon: <SchoolIcon sx={{ fontSize: "1rem" }} />,
                  },
                  {
                    value: Object.values(archivosSubidos).reduce(
                      (acc, ap) => acc + Object.keys(ap).length,
                      0,
                    ),
                    label: "Documentos",
                    color: colors.status.error,
                    icon: <DescriptionIcon sx={{ fontSize: "1rem" }} />,
                  },
                  {
                    value: apartadosDinamicos.length,
                    label: "Apartados",
                    color: colors.accents.purple,
                    icon: <FolderIcon sx={{ fontSize: "1rem" }} />,
                  },
                  {
                    value: new Date().toLocaleDateString("es-MX", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    }),
                    label: "Última actualización",
                    color: colors.secondary.main,
                    icon: <UpdateIcon sx={{ fontSize: "1rem" }} />,
                  },
                ].map((item, i) => (
                  <Grid item xs={6} key={i}>
                    <Paper
                      sx={{
                        p: 1.5,
                        textAlign: "center",
                        borderRadius: 2,
                        height: "100%",
                        border: `1px solid ${item.color}20`,
                        backgroundColor: "white",
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: `0 4px 8px ${item.color}20`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mb: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            backgroundColor: `${item.color}15`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: item.color,
                          }}
                        >
                          {item.icon}
                        </Box>
                      </Box>
                      <Typography
                        variant={i === 3 ? "h6" : "h5"}
                        sx={{
                          color: item.color,
                          fontWeight: "bold",
                          mb: 0.5,
                          fontSize: i === 3 ? "1rem" : undefined,
                        }}
                      >
                        {item.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.text.secondary,
                          fontWeight: "500",
                          fontSize: "0.7rem",
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ textAlign: "center" }}>
            <Button
              component={Link}
              to="/certifications"
              sx={{
                color: colors.primary.main,
                fontSize: "0.85rem",
                fontWeight: "600",
                textTransform: "none",
                textDecoration: "underline",
                "&:hover": { color: colors.primary.dark },
              }}
            >
              Ver todas las certificaciones
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Lista de apartados */}
      <Box>
        <Typography
          variant="h5"
          sx={{
            color: colors.primary.dark,
            mb: 3,
            fontWeight: "bold",
            borderBottom: `3px solid ${colors.primary.dark}`,
            pb: 1.5,
            letterSpacing: "-0.5px",
          }}
        >
          # INFORMACIÓN COMPLEMENTARIA
        </Typography>

        {loadingApartados && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <LinearProgress sx={{ maxWidth: "300px", mx: "auto", mb: 2 }} />
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Cargando apartados...
            </Typography>
          </Box>
        )}

        {!loadingApartados && apartadosDinamicos.length > 0 && (
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="subtitle2"
              sx={{ color: colors.primary.main, mb: 2, fontWeight: "600" }}
            >
              Apartados disponibles ({apartadosDinamicos.length})
            </Typography>
            <Box sx={{ width: "100%" }}>
              {apartadosDinamicos.map((apartado) => (
                <Box key={apartado.id} sx={{ width: "100%", mb: 2 }}>
                  {renderApartadoDinamico(apartado)}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {!loadingApartados &&
          apartadosDinamicos.length === 0 &&
          user?.instanciaId && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              No hay apartados configurados para esta instancia
            </Alert>
          )}
      </Box>

      {/* MODALES */}
      <UploadDocumentModal
        open={uploadDialog.open}
        onClose={() =>
          setUploadDialog({
            open: false,
            tipo: "",
            titulo: "",
            archivo: null,
            nombreArchivo: "",
            uploading: false,
            progress: 0,
          })
        }
        titulo={uploadDialog.titulo}
        archivo={uploadDialog.archivo}
        nombreArchivo={uploadDialog.nombreArchivo}
        uploading={uploadDialog.uploading}
        progress={uploadDialog.progress}
        onFileSelect={handleCumplimientoFileSelect}
        onRemoveFile={() =>
          setUploadDialog({
            ...uploadDialog,
            archivo: null,
            nombreArchivo: "",
          })
        }
        onUpload={handleGuardarDocumentoCumplimiento}
      />

      <ValidationSendModal
        open={validacionDialog.open}
        onClose={handleCerrarValidacionDialog}
        onConfirm={handleConfirmarValidacionPrograma}
        programa={validacionDialog.programa}
        documento={validacionDialog.documento}
        fecha={validacionDialog.fecha}
      />

      <PreviewDocumentModal
        open={previewDialog.open}
        onClose={() => {
          if (previewDialog.objectUrl)
            URL.revokeObjectURL(previewDialog.objectUrl);
          setPreviewDialog({
            open: false,
            documento: null,
            nombre: "",
            tipo: "",
            seccion: "",
            loading: false,
            objectUrl: null,
          });
        }}
        nombre={previewDialog.nombre}
        tipo={previewDialog.tipo}
        loading={previewDialog.loading}
        objectUrl={previewDialog.objectUrl}
        onDownload={() => {
          const a = document.createElement("a");
          a.href = previewDialog.objectUrl;
          a.download = previewDialog.nombre;
          a.click();
        }}
      />

      <DeleteConfirmModal
        open={deleteDialog.open}
        onClose={() =>
          setDeleteDialog({
            open: false,
            seccion: "",
            subseccion: "",
            documentoId: null,
            tipo: "",
            nombre: "",
            horas: 0,
            itemName: "",
            itemIndex: null,
          })
        }
        onConfirm={handleConfirmarEliminacion}
        nombre={deleteDialog.nombre}
        tipo={deleteDialog.tipo}
      />

      <AddCertificationModal
        open={certModalOpen}
        onClose={() => {
          if (saving) return;
          setCertModalOpen(false);
          setProgSeleccionado(null);
          setNuevaCertificacion({
            subseccion: "",
            tipoDocumento: "",
            institucion: "",
            fecha: new Date().toISOString().split("T")[0],
            horas: "",
            archivo: null,
            nombreArchivo: "",
          });
        }}
        onSave={handleGuardarCertDesdePrograma}
        nuevaCertificacion={nuevaCertificacion}
        onFieldChange={handleNuevaCertificacionChange}
        onFileChange={handleCertFileChange}
        onRemoveFile={() =>
          setNuevaCertificacion((prev) => ({
            ...prev,
            archivo: null,
            nombreArchivo: "",
          }))
        }
        uploading={uploading}
        uploadProgress={uploadProgress}
        saving={saving}
        subseccionFija={progSeleccionado?.nombre}
        titulo="Enviar Certificación para Validación"
        labelBotonGuardar="Enviar para Validación"
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            borderRadius: 2,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Expediente;
