import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Avatar,
  Badge,
  Zoom,
  Fade,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Folder as FolderIcon,
  Description as DescriptionIcon,
  ExpandMore as ExpandMoreIcon,
  Timer as TimerIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
  Code as CodeIcon,
  Computer as ComputerIcon,
  VisibilityOff as VisibilityOffIcon,
  Public as PublicIcon,
  Business as BusinessIcon,
  Visibility as VisibilityIcon,
  PowerSettingsNew as PowerIcon,
  Restore as RestoreIcon,
  Warning as WarningIcon,
  VerifiedUser as VerifiedUserIcon,
  GppGood as GppGoodIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

import { useAuth } from "../../context/AuthContext";

import {
  getApartadosPorInstanciaConGlobales,
  cambiarEstadoApartado,
} from "../../services/apartado";

import {
  getDocumentosPorApartado,
  toggleEstadoDocumento,
} from "../../services/documentoExpediente";

import CreateCategoryDialogAdmin from "../../components/expedienteAdmin/CreateCategoryDialogAdmin";
import EditCategoryDialogAdmin from "../../components/expedienteAdmin/EditCategoryDialogAdmin";
import CreateDocumentDialogAdmin from "../../components/expedienteAdmin/CreateDocumentDialogAdmin";
import EditDocumentDialogAdmin from "../../components/expedienteAdmin/EditDocumentDialogAdmin";

import CreateProgramaDialogAdmin from "../../components/programasAdmin/CreateProgramaDialogAdmin";
import EditProgramaDialogAdmin from "../../components/programasAdmin/EditProgramaDialogAdmin";

import { getProgramasPorApartado, cambiarEstadoPrograma } from "../../services/programas";

import {
  institutionalColors,
  getDefaultIcon,
  getCategoryColor,
} from "../../utils/iconosUtils";

// Modal de confirmación personalizado
const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", severity = "warning" }) => {
  const getColorBySeverity = () => {
    switch (severity) {
      case 'error': return institutionalColors.error;
      case 'success': return institutionalColors.success;
      case 'info': return institutionalColors.info;
      default: return institutionalColors.warning;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 3,
          minWidth: 400,
        }
      }}
    >
      <DialogTitle id="confirm-dialog-title" sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        borderBottom: `1px solid ${alpha(institutionalColors.primary, 0.1)}`,
        pb: 2
      }}>
        <WarningIcon sx={{ color: getColorBySeverity() }} />
        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <DialogContentText id="confirm-dialog-description" sx={{ color: institutionalColors.textPrimary }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: institutionalColors.border,
            color: institutionalColors.textSecondary,
            textTransform: 'none',
            '&:hover': {
              borderColor: institutionalColors.primary,
              bgcolor: alpha(institutionalColors.primary, 0.04),
            }
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant="contained"
          autoFocus
          sx={{
            bgcolor: getColorBySeverity(),
            textTransform: 'none',
            '&:hover': {
              bgcolor: alpha(getColorBySeverity(), 0.8),
            }
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Utilidad: normalizar un programa recibido del backend ───────────────────
const normalizePrograma = (programa) => {
  const id =
    programa?.id ||
    programa?.idPrograma ||
    programa?.programaId ||
    null;

  return {
    ...programa,
    id,
    idPrograma: id,
    nombre: programa?.nombre || "",
    descripcion: programa?.descripcion || "",
    horasRequeridas: programa?.horasRequeridas || 0,
    tipo: programa?.tipo || "VIDEO",
    activo: programa?.activo !== undefined ? programa.activo : true,
    configuracionJson: programa?.configuracionJson || "",
    requiereValidacion: programa?.requiereValidacion || false,
    idInstancia: programa?.idInstancia || null,
    idApartado: programa?.idApartado || null,
  };
};

const ConfigExpediente = () => {
  const { user } = useAuth();

  const [apartadosGlobales, setApartadosGlobales] = useState([]);
  const [apartadosInstancia, setApartadosInstancia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [activeTab, setActiveTab] = useState(0);
  const [activeView, setActiveView] = useState(0);

  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [openCreateDocument, setOpenCreateDocument] = useState(false);
  const [openEditDocument, setOpenEditDocument] = useState(false);

  const [openCreatePrograma, setOpenCreatePrograma] = useState(false);
  const [openEditPrograma, setOpenEditPrograma] = useState(false);

  // Estado para el modal de confirmación
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
    severity: "warning",
    confirmText: "Confirmar",
  });

  const [currentApartado, setCurrentApartado] = useState(null);
  const [currentDocumento, setCurrentDocumento] = useState(null);
  const [currentPrograma, setCurrentPrograma] = useState(null);
  const [selectedApartadoId, setSelectedApartadoId] = useState(null);

  const [expandedCategory, setExpandedCategory] = useState(null);

  // ─── Permisos ─────────────────────────────────────────────────────────────
  const canEditCategory = (apartado) =>
    !!(user && !apartado.esGlobal && user.instanciaId === apartado.idInstancia);

  const canToggleCategoryStatus = (apartado) =>
    !!(user && !apartado.esGlobal && user.instanciaId === apartado.idInstancia);

  const canModifyDocument = (apartado) =>
    !!(user && !apartado.esGlobal && user.instanciaId === apartado.idInstancia);

  const canAddDocument = (apartado) =>
    !!(user && !apartado.esGlobal && user.instanciaId === apartado.idInstancia);

  const canModifyPrograma = (apartado) =>
    !!(user && !apartado.esGlobal && user.instanciaId === apartado.idInstancia);

  const canAddPrograma = (apartado) =>
    !!(user && !apartado.esGlobal && user.instanciaId === apartado.idInstancia);

  // ─── Carga de datos (solo al montar) ─────────────────────────────────────
  useEffect(() => {
    cargarApartados();
  }, []);

  const cargarApartados = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.instanciaId) {
        setError("No se pudo determinar la instancia del usuario");
        setLoading(false);
        return;
      }

      const apartadosData = await getApartadosPorInstanciaConGlobales(
        user.instanciaId
      );

      const apartadosConDatos = await Promise.all(
        apartadosData.map(async (apartado) => {
          try {
            const [documentos, programas] = await Promise.all([
              getDocumentosPorApartado(apartado.idApartado),
              getProgramasPorApartado(apartado.idApartado),
            ]);

            return {
              ...apartado,
              documentos: documentos || [],
              programas: (programas || []).map(normalizePrograma),
            };
          } catch (err) {
            console.error(
              `Error cargando datos para apartado ${apartado.idApartado}:`,
              err
            );
            return { ...apartado, documentos: [], programas: [] };
          }
        })
      );

      const globales = apartadosConDatos
        .filter((ap) => ap.idInstancia == null)
        .sort((a, b) => (a.orden || 0) - (b.orden || 0))
        .map((ap) => ({ ...ap, esGlobal: true }));

      const deInstancia = apartadosConDatos
        .filter(
          (ap) =>
            ap.idInstancia != null && ap.idInstancia === user.instanciaId
        )
        .sort((a, b) => (a.orden || 0) - (b.orden || 0))
        .map((ap) => ({ ...ap, esGlobal: false }));

      setApartadosGlobales(globales);
      setApartadosInstancia(deInstancia);

      const primeros = activeView === 0 ? deInstancia : globales;
      if (primeros.length > 0) {
        setExpandedCategory(primeros[0].idApartado);
      }
    } catch (err) {
      console.error("Error general cargando apartados:", err);
      setError("Error al cargar las categorías. Por favor, intente de nuevo.");
      showSnackbar("Error al cargar datos", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const getCurrentApartados = () =>
    activeView === 0 ? apartadosInstancia : apartadosGlobales;

  const getCurrentStats = () => {
    const list = activeView === 0 ? apartadosInstancia : apartadosGlobales;
    return {
      totalCategories: list.length,
      activeCategories: list.filter((ap) => ap.activo !== false).length,
      inactiveCategories: list.filter((ap) => ap.activo === false).length,
      totalDocuments: list.reduce(
        (t, ap) => t + (ap.documentos?.length || 0),
        0
      ),
      totalProgramas: list.reduce(
        (t, ap) => t + (ap.programas?.length || 0),
        0
      ),
      requiredCategories: list.filter((ap) => ap.obligatorio).length,
    };
  };

  const stats = getCurrentStats();

  // Función para mostrar el modal de confirmación
  const showConfirmDialog = (title, message, onConfirm, severity = "warning", confirmText = "Confirmar") => {
    setConfirmDialog({
      open: true,
      title,
      message,
      onConfirm: () => onConfirm(),
      severity,
      confirmText,
    });
  };

  // ─── Helpers de actualización local ──────────────────────────────────────
  // Actualiza un apartado en ambas listas sin recargar
  const updateApartadoEnListas = (idApartado, updater) => {
    setApartadosInstancia((prev) =>
      prev.map((ap) => ap.idApartado === idApartado ? updater(ap) : ap)
    );
    setApartadosGlobales((prev) =>
      prev.map((ap) => ap.idApartado === idApartado ? updater(ap) : ap)
    );
  };

  // ─── Categorías ───────────────────────────────────────────────────────────
  const handleAddCategory = () => setOpenCreateCategory(true);

  const handleEditCategory = (apartado) => {
    setCurrentApartado(apartado);
    setOpenEditCategory(true);
  };

  const handleToggleCategoryStatus = async (apartado) => {
    const nuevoEstado = apartado.activo === false;
    const accion = nuevoEstado ? "activar" : "desactivar";
    
    showConfirmDialog(
      `${accion === "activar" ? "Activar" : "Desactivar"} Categoría`,
      `¿Está seguro de ${accion} la categoría "${apartado.nombre}"?`,
      async () => {
        // Actualización optimista inmediata
        updateApartadoEnListas(apartado.idApartado, (ap) => ({ ...ap, activo: nuevoEstado }));

        try {
          await cambiarEstadoApartado(apartado.idApartado, nuevoEstado);
          showSnackbar(
            nuevoEstado
              ? "Categoría activada exitosamente"
              : "Categoría desactivada exitosamente"
          );
        } catch (err) {
          console.error("Error cambiando estado de la categoría:", err);
          // Revertir en caso de error
          updateApartadoEnListas(apartado.idApartado, (ap) => ({ ...ap, activo: !nuevoEstado }));
          showSnackbar("Error al cambiar el estado de la categoría", "error");
        }
      },
      nuevoEstado ? "success" : "warning",
      accion === "activar" ? "Activar" : "Desactivar"
    );
  };

  const handleCreateCategorySuccess = (nuevoApartado) => {
    const completo = { 
      ...nuevoApartado, 
      documentos: [], 
      programas: [], 
      esGlobal: false,
      activo: true 
    };
    setApartadosInstancia((prev) =>
      [...prev, completo].sort((a, b) => (a.orden || 0) - (b.orden || 0))
    );
    setOpenCreateCategory(false);
    showSnackbar("Categoría creada exitosamente");
    setExpandedCategory(nuevoApartado.idApartado);
  };

  const handleUpdateCategorySuccess = (apartadoActualizado) => {
    const update = (list) =>
      list
        .map((ap) =>
          ap.idApartado === apartadoActualizado.idApartado
            ? {
                ...apartadoActualizado,
                documentos: ap.documentos || [],
                programas: ap.programas || [],
                esGlobal: ap.esGlobal,
                activo: apartadoActualizado.activo !== undefined
                  ? apartadoActualizado.activo
                  : ap.activo,
              }
            : ap
        )
        .sort((a, b) => (a.orden || 0) - (b.orden || 0));

    setApartadosInstancia((prev) => update(prev));
    setApartadosGlobales((prev) => update(prev));
    setOpenEditCategory(false);
    setCurrentApartado(null);
    showSnackbar("Categoría actualizada exitosamente");
  };

  // ─── Documentos ───────────────────────────────────────────────────────────
  const handleAddDocument = (apartadoId) => {
    const apartado = getCurrentApartados().find(
      (ap) => ap.idApartado === apartadoId
    );
    setCurrentApartado(apartado);
    setSelectedApartadoId(apartadoId);
    setOpenCreateDocument(true);
  };

  const handleEditDocument = (apartado, documento) => {
    setCurrentApartado(apartado);
    setCurrentDocumento(documento);
    setOpenEditDocument(true);
  };

  const handleCreateDocumentSuccess = (apartadoId, nuevoDocumento) => {
    updateApartadoEnListas(apartadoId, (ap) => ({
      ...ap,
      documentos: [...(ap.documentos || []), nuevoDocumento].sort(
        (a, b) => (a.orden || 0) - (b.orden || 0)
      ),
    }));
    setOpenCreateDocument(false);
    setCurrentApartado(null);
    showSnackbar("Documento creado exitosamente");
  };

  const handleUpdateDocumentSuccess = (apartadoId, documentoActualizado) => {
    updateApartadoEnListas(apartadoId, (ap) => ({
      ...ap,
      documentos: (ap.documentos || [])
        .map((doc) =>
          doc.idDocumento === documentoActualizado.idDocumento
            ? { ...doc, ...documentoActualizado }
            : doc
        )
        .sort((a, b) => (a.orden || 0) - (b.orden || 0)),
    }));
    setOpenEditDocument(false);
    setCurrentApartado(null);
    setCurrentDocumento(null);
    showSnackbar("Documento actualizado exitosamente");
  };

  const handleToggleDocumentStatus = async (apartadoId, documento) => {
    const documentoId = documento.idDocumento;
    const nuevoEstado = !documento.activo;
    const accion = nuevoEstado ? "activar" : "desactivar";

    showConfirmDialog(
      `${accion === "activar" ? "Activar" : "Desactivar"} Documento`,
      `¿Está seguro de ${accion} el documento "${documento.nombreArchivo}"?`,
      async () => {
        // Actualización optimista inmediata
        updateApartadoEnListas(apartadoId, (ap) => ({
          ...ap,
          documentos: (ap.documentos || []).map((doc) =>
            doc.idDocumento === documentoId ? { ...doc, activo: nuevoEstado } : doc
          ),
        }));

        try {
          await toggleEstadoDocumento(documentoId);
          showSnackbar(
            nuevoEstado
              ? "Documento activado exitosamente"
              : "Documento desactivado exitosamente"
          );
        } catch (err) {
          console.error("Error cambiando estado del documento:", err);
          // Revertir en caso de error
          updateApartadoEnListas(apartadoId, (ap) => ({
            ...ap,
            documentos: (ap.documentos || []).map((doc) =>
              doc.idDocumento === documentoId ? { ...doc, activo: !nuevoEstado } : doc
            ),
          }));
          showSnackbar("Error al cambiar el estado del documento", "error");
        }
      },
      nuevoEstado ? "success" : "warning",
      accion === "activar" ? "Activar" : "Desactivar"
    );
  };

  // ─── Programas ────────────────────────────────────────────────────────────
  const handleAddPrograma = (apartadoId) => {
    const apartado = getCurrentApartados().find(
      (ap) => ap.idApartado === apartadoId
    );
    setCurrentApartado(apartado);
    setSelectedApartadoId(apartadoId);
    setOpenCreatePrograma(true);
  };

  const handleEditPrograma = (apartado, programa) => {
    setCurrentApartado(apartado);
    setCurrentPrograma(programa);
    setOpenEditPrograma(true);
  };

  const handleToggleProgramaStatus = async (apartadoId, programa) => {
    const nuevoEstado = !programa.activo;
    const accion = nuevoEstado ? "activar" : "desactivar";
    
    showConfirmDialog(
      `${accion === "activar" ? "Activar" : "Desactivar"} Programa`,
      `¿Está seguro de ${accion} el programa "${programa.nombre}"?`,
      async () => {
        // Actualización optimista inmediata
        updateApartadoEnListas(apartadoId, (ap) => ({
          ...ap,
          programas: (ap.programas || []).map((prog) =>
            prog.id === programa.id ? { ...prog, activo: nuevoEstado } : prog
          ),
        }));

        try {
          await cambiarEstadoPrograma(programa.id, nuevoEstado);
          showSnackbar(`Programa ${accion}do exitosamente`);
        } catch (err) {
          console.error(`Error al ${accion} programa:`, err);
          // Revertir en caso de error
          updateApartadoEnListas(apartadoId, (ap) => ({
            ...ap,
            programas: (ap.programas || []).map((prog) =>
              prog.id === programa.id ? { ...prog, activo: !nuevoEstado } : prog
            ),
          }));
          showSnackbar(`Error al ${accion} el programa`, "error");
        }
      },
      nuevoEstado ? "success" : "warning",
      accion === "activar" ? "Activar" : "Desactivar"
    );
  };

  const handleCreateProgramaSuccess = (apartadoId, nuevoPrograma) => {
    if (!apartadoId) {
      console.error("handleCreateProgramaSuccess: apartadoId es null");
      showSnackbar("Error al registrar el programa en la lista", "error");
      return;
    }

    const programaNormalizado = normalizePrograma(nuevoPrograma);

    updateApartadoEnListas(apartadoId, (ap) => ({
      ...ap,
      programas: [
        ...(Array.isArray(ap.programas) ? ap.programas : []),
        programaNormalizado,
      ].sort((a, b) => (a.id || 0) - (b.id || 0)),
    }));

    setOpenCreatePrograma(false);
    setCurrentApartado(null);
    setSelectedApartadoId(null);
    showSnackbar("Programa creado exitosamente");
  };

  const handleUpdateProgramaSuccess = (programaActualizado) => {
    const apartadoId = currentApartado?.idApartado;

    if (!apartadoId) {
      console.error("handleUpdateProgramaSuccess: apartadoId es null");
      showSnackbar("Error al actualizar el programa en la lista", "error");
      return;
    }

    const programaNormalizado = normalizePrograma(programaActualizado);

    updateApartadoEnListas(apartadoId, (ap) => ({
      ...ap,
      programas: (Array.isArray(ap.programas) ? ap.programas : [])
        .map((prog) =>
          prog.id === programaNormalizado.id ||
          prog.idPrograma === programaNormalizado.id
            ? { ...prog, ...programaNormalizado }
            : prog
        )
        .sort((a, b) => (a.id || 0) - (b.id || 0)),
    }));

    setOpenEditPrograma(false);
    setCurrentApartado(null);
    setCurrentPrograma(null);
    showSnackbar("Programa actualizado exitosamente");
  };

  // ─── Helpers de UI ────────────────────────────────────────────────────────
  const handleTabChange = (_, v) => setActiveTab(v);

  const handleViewChange = (_, v) => {
    setActiveView(v);
    setExpandedCategory(null);
    const next = v === 0 ? apartadosInstancia : apartadosGlobales;
    if (next.length > 0) setExpandedCategory(next[0].idApartado);
  };

  const handleCategoryExpand = (id) =>
    setExpandedCategory((prev) => (prev === id ? null : id));

  const handleRefresh = () => cargarApartados();

  const getReviewDescription = (documento) => {
    const days = parseInt(documento.periodoRevision);
    if (!days || days === 0) return "No requiere revisión periódica";
    if (days === 30) return "Revisión mensual";
    if (days === 60) return "Revisión bimestral";
    if (days === 90) return "Revisión trimestral";
    if (days === 180) return "Revisión semestral";
    if (days === 365) return "Revisión anual";
    if (days === 730) return "Revisión bianual";
    return `Revisión cada ${days} días`;
  };

  const getReviewIcon = (days) => {
    if (days <= 30) return <ScheduleIcon fontSize="small" />;
    if (days <= 90) return <TimerIcon fontSize="small" />;
    return <ScheduleIcon fontSize="small" />;
  };

  const getTipoProgramaColor = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case "video":
        return institutionalColors.info;
      case "documento":
        return institutionalColors.success;
      default:
        return institutionalColors.primary;
    }
  };

  const getTipoProgramaIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'video':
        return <ComputerIcon fontSize="small" />;
      case 'documento':
        return <DescriptionIcon fontSize="small" />;
      default:
        return <CodeIcon fontSize="small" />;
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: `linear-gradient(135deg, ${alpha(institutionalColors.background, 0.5)} 0%, ${institutionalColors.background} 100%)`,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="textSecondary">
            Cargando configuración...
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: institutionalColors.background,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3, p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ color: institutionalColors.primary, fontWeight: "bold", mb: 0.5 }}
            >
              Configuración de Expedientes
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: institutionalColors.textSecondary }}
            >
              Panel de Administración - Gestión de categorías, documentos y programas
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Chip
                icon={<AdminPanelSettingsIcon />}
                label="Administrador"
                size="small"
                sx={{
                  bgcolor: institutionalColors.primary,
                  color: "white",
                  fontWeight: "bold",
                }}
              />
              <Tooltip title="Recargar datos">
                <IconButton
                  size="small"
                  onClick={handleRefresh}
                  sx={{ color: institutionalColors.primary }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Stack direction="row" spacing={1}>
            {activeView === 0 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddCategory}
                sx={{
                  bgcolor: institutionalColors.primary,
                  "&:hover": { bgcolor: institutionalColors.secondary },
                }}
              >
                Nueva Categoría
              </Button>
            )}
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Tabs vista instancia / globales */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={activeView}
            onChange={handleViewChange}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "0.9rem",
                minHeight: 48,
              },
              "& .Mui-selected": { color: institutionalColors.primary },
              "& .MuiTabs-indicator": {
                backgroundColor: institutionalColors.primary,
              },
            }}
          >
            <Tab
              icon={<BusinessIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label={`Mi Instancia (${apartadosInstancia.length})`}
            />
            <Tab
              icon={<PublicIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label={`Globales (${apartadosGlobales.length})`}
            />
          </Tabs>
        </Box>

        {/* Stats */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 2,
            mb: 3,
            width: "100%",
            "@media (max-width: 1100px)": { gridTemplateColumns: "repeat(2, 1fr)" },
            "@media (max-width: 600px)": { gridTemplateColumns: "1fr" },
          }}
        >
          <Card
            sx={{
              borderLeft: `4px solid ${institutionalColors.primary}`,
              height: 120,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                p: 1.5,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ color: institutionalColors.primary }}>
                    <FolderIcon />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: institutionalColors.textSecondary,
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      lineHeight: 1.2,
                    }}
                  >
                    Categorías {activeView === 0 ? "de Instancia" : "Globales"}
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: institutionalColors.textPrimary,
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    lineHeight: 1,
                    textAlign: "right",
                  }}
                >
                  {stats.totalCategories}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: institutionalColors.textSecondary,
                    fontSize: "0.7rem",
                    lineHeight: 1.2,
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {stats.activeCategories} activas · {stats.inactiveCategories} inactivas
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderLeft: `4px solid ${institutionalColors.success}`,
              height: 120,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                p: 1.5,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ color: institutionalColors.success }}>
                    <DescriptionIcon />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: institutionalColors.textSecondary,
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      lineHeight: 1.2,
                    }}
                  >
                    Documentos Totales
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: institutionalColors.textPrimary,
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    lineHeight: 1,
                    textAlign: "right",
                  }}
                >
                  {stats.totalDocuments}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderLeft: `4px solid ${institutionalColors.warning}`,
              height: 120,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                p: 1.5,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ color: institutionalColors.warning }}>
                    <CodeIcon />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: institutionalColors.textSecondary,
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      lineHeight: 1.2,
                    }}
                  >
                    Programas Totales
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: institutionalColors.textPrimary,
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    lineHeight: 1,
                    textAlign: "right",
                  }}
                >
                  {stats.totalProgramas}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderLeft: `4px solid ${institutionalColors.info}`,
              height: 120,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                p: 1.5,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ color: institutionalColors.info }}>
                    <SaveIcon />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: institutionalColors.textSecondary,
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      lineHeight: 1.2,
                    }}
                  >
                    Categorías Obligatorias
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: institutionalColors.textPrimary,
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    lineHeight: 1,
                    textAlign: "right",
                  }}
                >
                  {stats.requiredCategories}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: institutionalColors.textSecondary,
                    fontSize: "0.7rem",
                    lineHeight: 1.2,
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  De {stats.totalCategories} categorías totales
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Contenido principal */}
      <Box
        sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, px: 3, pb: 3 }}
      >
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: 3,
            height: "100%",
          }}
        >
          <Box
            sx={{
              p: 2.5,
              borderBottom: `1px solid ${alpha(institutionalColors.primary, 0.1)}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "#fff",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: institutionalColors.primary,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CategoryIcon />
              {activeView === 0
                ? "Categorías de mi Instancia"
                : "Categorías Globales"}
            </Typography>
          </Box>

          {/* Tabs documentos / programas */}
          <Box
            sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#fff", px: 2.5 }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  minHeight: 48,
                },
                "& .Mui-selected": { color: institutionalColors.primary },
                "& .MuiTabs-indicator": {
                  backgroundColor: institutionalColors.primary,
                },
              }}
            >
              <Tab
                icon={<DescriptionIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label={`Documentos (${stats.totalDocuments})`}
              />
              <Tab
                icon={<CodeIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label={`Programas (${stats.totalProgramas})`}
              />
            </Tabs>
          </Box>

          {/* Lista de apartados */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2.5,
              bgcolor: institutionalColors.background,
            }}
          >
            {getCurrentApartados().length === 0 ? (
              <Fade in>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    p: 4,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: alpha(institutionalColors.primary, 0.1),
                      color: institutionalColors.primary,
                      mb: 3,
                    }}
                  >
                    {activeView === 0 ? (
                      <BusinessIcon sx={{ fontSize: 60 }} />
                    ) : (
                      <PublicIcon sx={{ fontSize: 60 }} />
                    )}
                  </Avatar>
                  <Typography
                    variant="h5"
                    sx={{
                      color: institutionalColors.textPrimary,
                      mb: 1,
                      fontWeight: "bold",
                    }}
                  >
                    No hay categorías{" "}
                    {activeView === 0 ? "de instancia" : "globales"} configuradas
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: institutionalColors.textSecondary,
                      mb: 3,
                      textAlign: "center",
                    }}
                  >
                    {activeView === 0
                      ? "Comience creando una nueva categoría para organizar los documentos y programas de su instancia"
                      : "Las categorías globales son configuradas por el administrador del sistema"}
                  </Typography>
                  {activeView === 0 && (
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AddIcon />}
                      onClick={handleAddCategory}
                      sx={{
                        bgcolor: institutionalColors.primary,
                        "&:hover": {
                          bgcolor: institutionalColors.secondary,
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.2s",
                        boxShadow: 2,
                      }}
                    >
                      Crear primera categoría
                    </Button>
                  )}
                </Box>
              </Fade>
            ) : (
              getCurrentApartados()
                .sort((a, b) => (a.orden || 0) - (b.orden || 0))
                .map((apartado, index) => (
                  <Zoom
                    key={apartado.idApartado}
                    in
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <Accordion
                      expanded={expandedCategory === apartado.idApartado}
                      onChange={() => handleCategoryExpand(apartado.idApartado)}
                      sx={{
                        mb: 2,
                        borderRadius: "12px !important",
                        overflow: "hidden",
                        border: `1px solid ${alpha(institutionalColors.primary, 0.1)}`,
                        boxShadow: 2,
                        "&:before": { display: "none" },
                        transition: "all 0.2s",
                        "&:hover": { boxShadow: 4 },
                        opacity: apartado.activo === false ? 0.7 : 1,
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          bgcolor: apartado.activo === false 
                            ? alpha(institutionalColors.error, 0.05)
                            : "#fff",
                          "&:hover": {
                            bgcolor: alpha(institutionalColors.primary, 0.02),
                          },
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", width: "100%" }}
                        >
                          <Badge
                            badgeContent={
                              activeTab === 0
                                ? apartado.documentos?.length || 0
                                : apartado.programas?.length || 0
                            }
                            color="primary"
                            sx={{ mr: 2 }}
                          >
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                bgcolor: alpha(
                                  getCategoryColor(apartado.nombre),
                                  0.1
                                ),
                                color: getCategoryColor(apartado.nombre),
                              }}
                            >
                              <Typography variant="h5">
                                {apartado.icono || getDefaultIcon(apartado.nombre)}
                              </Typography>
                            </Avatar>
                          </Badge>

                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 0.5,
                                flexWrap: "wrap",
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: "bold",
                                  color: apartado.activo === false ? institutionalColors.textMuted : institutionalColors.textPrimary,
                                  textDecoration: apartado.activo === false ? "line-through" : "none",
                                }}
                              >
                                {apartado.nombre}
                              </Typography>
                              
                              {apartado.activo === false && (
                                <Chip
                                  label="INACTIVO"
                                  size="small"
                                  sx={{
                                    height: 22,
                                    fontSize: "0.7rem",
                                    fontWeight: "bold",
                                    bgcolor: alpha(institutionalColors.error, 0.1),
                                    color: institutionalColors.error,
                                  }}
                                />
                              )}
                              
                              {apartado.obligatorio && (
                                <Chip
                                  label="OBLIGATORIO"
                                  size="small"
                                  color="error"
                                  sx={{ height: 22, fontSize: "0.7rem", fontWeight: "bold" }}
                                />
                              )}
                              <Chip
                                size="small"
                                icon={
                                  activeTab === 0 ? (
                                    <DescriptionIcon />
                                  ) : (
                                    <CodeIcon />
                                  )
                                }
                                label={
                                  activeTab === 0
                                    ? `${apartado.documentos?.length || 0} documentos`
                                    : `${apartado.programas?.length || 0} programas`
                                }
                                sx={{
                                  height: 22,
                                  fontSize: "0.7rem",
                                  bgcolor: alpha(
                                    activeTab === 0
                                      ? institutionalColors.success
                                      : institutionalColors.warning,
                                    0.1
                                  ),
                                  color:
                                    activeTab === 0
                                      ? institutionalColors.success
                                      : institutionalColors.warning,
                                }}
                              />
                              {apartado.esGlobal && (
                                <Chip
                                  size="small"
                                  icon={<PublicIcon />}
                                  label="GLOBAL"
                                  sx={{
                                    height: 22,
                                    fontSize: "0.7rem",
                                    bgcolor: alpha(institutionalColors.info, 0.1),
                                    color: institutionalColors.info,
                                  }}
                                />
                              )}
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{ color: institutionalColors.textSecondary }}
                            >
                              {apartado.descripcion}
                            </Typography>
                          </Box>

                          <Stack direction="row" spacing={1}>
                            {!apartado.esGlobal && canEditCategory(apartado) && (
                              <Tooltip title="Editar categoría" arrow>
                                <IconButton
                                  component="span"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCategory(apartado);
                                  }}
                                  sx={{
                                    color: institutionalColors.primary,
                                    "&:hover": {
                                      bgcolor: alpha(institutionalColors.primary, 0.1),
                                    },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            {!apartado.esGlobal && canToggleCategoryStatus(apartado) && (
                              <Tooltip
                                title={apartado.activo === false ? "Activar categoría" : "Desactivar categoría"}
                                arrow
                              >
                                <IconButton
                                  component="span"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleCategoryStatus(apartado);
                                  }}
                                  sx={{
                                    color: apartado.activo === false 
                                      ? institutionalColors.success 
                                      : institutionalColors.warning,
                                    "&:hover": {
                                      bgcolor: alpha(
                                        apartado.activo === false 
                                          ? institutionalColors.success 
                                          : institutionalColors.warning, 
                                        0.1
                                      ),
                                    },
                                  }}
                                >
                                  {apartado.activo === false ? (
                                    <RestoreIcon fontSize="small" />
                                  ) : (
                                    <PowerIcon fontSize="small" />
                                  )}
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails sx={{ bgcolor: "#fff", p: 3 }}>
                        <Box sx={{ pl: 7 }}>
                          {activeTab === 0 ? (
                            // ── Documentos ────────────────────────────────
                            <>
                              <List sx={{ p: 0 }}>
                                {(apartado.documentos || [])
                                  .sort((a, b) => (a.orden || 0) - (b.orden || 0))
                                  .map((documento, docIndex) => (
                                    <Fade
                                      key={documento.idDocumento}
                                      in
                                      style={{ transitionDelay: `${docIndex * 30}ms` }}
                                    >
                                      <ListItem
                                        sx={{
                                          p: 2,
                                          mb: 2,
                                          borderRadius: 2,
                                          bgcolor: institutionalColors.background,
                                          border: `1px solid ${alpha(institutionalColors.primary, 0.1)}`,
                                          borderLeft: `4px solid ${institutionalColors.primary}`,
                                          alignItems: "flex-start",
                                          transition: "all 0.2s",
                                          opacity: documento.activo === false ? 0.7 : 1,
                                          "&:hover": {
                                            transform: "translateX(4px)",
                                            boxShadow: 2,
                                          },
                                        }}
                                      >
                                        <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                                          <Avatar
                                            sx={{
                                              width: 32,
                                              height: 32,
                                              bgcolor: alpha(institutionalColors.primary, 0.1),
                                              color: institutionalColors.primary,
                                            }}
                                          >
                                            <DescriptionIcon fontSize="small" />
                                          </Avatar>
                                        </ListItemIcon>

                                        <Box sx={{ flex: 1 }}>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              flexWrap: "wrap",
                                              gap: 1,
                                              mb: 1,
                                            }}
                                          >
                                            <Typography
                                              variant="subtitle1"
                                              sx={{
                                                fontWeight: "bold",
                                                color: institutionalColors.textPrimary,
                                                textDecoration: documento.activo === false ? "line-through" : "none",
                                              }}
                                            >
                                              {documento.nombreArchivo}
                                            </Typography>

                                            {documento.activo === false ? (
                                              <Chip
                                                size="small"
                                                label="INACTIVO"
                                                sx={{
                                                  height: 24,
                                                  bgcolor: alpha(institutionalColors.error, 0.1),
                                                  color: institutionalColors.error,
                                                }}
                                              />
                                            ) : (
                                              <Chip
                                                size="small"
                                                label="ACTIVO"
                                                sx={{
                                                  height: 24,
                                                  bgcolor: alpha(institutionalColors.success, 0.1),
                                                  color: institutionalColors.success,
                                                }}
                                              />
                                            )}

                                            {documento.periodoRevision > 0 && (
                                              <Tooltip
                                                title={getReviewDescription(documento)}
                                                arrow
                                              >
                                                <Chip
                                                  size="small"
                                                  icon={getReviewIcon(
                                                    documento.periodoRevision
                                                  )}
                                                  label={getReviewDescription(documento)}
                                                  sx={{
                                                    height: 24,
                                                    bgcolor: alpha(
                                                      institutionalColors.info,
                                                      0.1
                                                    ),
                                                    color: institutionalColors.info,
                                                    "& .MuiChip-icon": {
                                                      color: institutionalColors.info,
                                                    },
                                                  }}
                                                />
                                              </Tooltip>
                                            )}
                                          </Box>
                                        </Box>

                                        <ListItemSecondaryAction>
                                          <Stack direction="row" spacing={1}>
                                            {!apartado.esGlobal &&
                                              canModifyDocument(apartado) && (
                                                <Tooltip title="Editar documento" arrow>
                                                  <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                      handleEditDocument(apartado, documento)
                                                    }
                                                    sx={{
                                                      color: institutionalColors.primary,
                                                      "&:hover": {
                                                        bgcolor: alpha(
                                                          institutionalColors.primary,
                                                          0.1
                                                        ),
                                                      },
                                                    }}
                                                  >
                                                    <EditIcon fontSize="small" />
                                                  </IconButton>
                                                </Tooltip>
                                              )}

                                            {!apartado.esGlobal &&
                                              canModifyDocument(apartado) && (
                                                <Tooltip
                                                  title={
                                                    documento.activo === false
                                                      ? "Activar documento"
                                                      : "Desactivar documento"
                                                  }
                                                  arrow
                                                >
                                                  <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                      handleToggleDocumentStatus(
                                                        apartado.idApartado,
                                                        documento
                                                      )
                                                    }
                                                    sx={{
                                                      color:
                                                        documento.activo === false
                                                          ? institutionalColors.success
                                                          : institutionalColors.warning,
                                                      "&:hover": {
                                                        bgcolor: alpha(
                                                          documento.activo === false
                                                            ? institutionalColors.success
                                                            : institutionalColors.warning,
                                                          0.1
                                                        ),
                                                      },
                                                    }}
                                                  >
                                                    {documento.activo === false ? (
                                                      <RestoreIcon fontSize="small" />
                                                    ) : (
                                                      <PowerIcon fontSize="small" />
                                                    )}
                                                  </IconButton>
                                                </Tooltip>
                                              )}
                                          </Stack>
                                        </ListItemSecondaryAction>
                                      </ListItem>
                                    </Fade>
                                  ))}
                              </List>

                              {!apartado.esGlobal && canAddDocument(apartado) && apartado.activo !== false && (
                                <Button
                                  variant="outlined"
                                  startIcon={<AddIcon />}
                                  size="medium"
                                  onClick={() => handleAddDocument(apartado.idApartado)}
                                  disabled={apartado.activo === false}
                                  sx={{
                                    mt: 2,
                                    color: institutionalColors.primary,
                                    borderColor: institutionalColors.primary,
                                    "&:hover": {
                                      borderColor: institutionalColors.secondary,
                                      bgcolor: alpha(institutionalColors.primary, 0.04),
                                    },
                                  }}
                                >
                                  Agregar Documento a esta Categoría
                                </Button>
                              )}
                              
                              {apartado.activo === false && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    mt: 2,
                                    color: institutionalColors.error,
                                    fontStyle: "italic",
                                  }}
                                >
                                  * Esta categoría está inactiva. No se pueden agregar nuevos documentos hasta que se active.
                                </Typography>
                              )}
                            </>
                          ) : (
                            // ── Programas ─────────────────────────────────
                            <>
                              <List sx={{ p: 0 }}>
                                {(apartado.programas || [])
                                  .sort((a, b) => (a.id || 0) - (b.id || 0))
                                  .map((programa, progIndex) => (
                                    <Fade
                                      key={programa.id ?? progIndex}
                                      in
                                      style={{ transitionDelay: `${progIndex * 30}ms` }}
                                    >
                                      <ListItem
                                        sx={{
                                          p: 2,
                                          mb: 2,
                                          borderRadius: 2,
                                          bgcolor: institutionalColors.background,
                                          border: `1px solid ${alpha(institutionalColors.primary, 0.1)}`,
                                          borderLeft: `4px solid ${getTipoProgramaColor(programa.tipo)}`,
                                          alignItems: "flex-start",
                                          transition: "all 0.2s",
                                          opacity: programa.activo === false ? 0.7 : 1,
                                          "&:hover": {
                                            transform: "translateX(4px)",
                                            boxShadow: 2,
                                          },
                                        }}
                                      >
                                        <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                                          <Avatar
                                            sx={{
                                              width: 32,
                                              height: 32,
                                              bgcolor: alpha(
                                                getTipoProgramaColor(programa.tipo),
                                                0.1
                                              ),
                                              color: getTipoProgramaColor(programa.tipo),
                                            }}
                                          >
                                            {getTipoProgramaIcon(programa.tipo)}
                                          </Avatar>
                                        </ListItemIcon>

                                        <Box sx={{ flex: 1 }}>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              flexWrap: "wrap",
                                              gap: 1,
                                              mb: 1,
                                            }}
                                          >
                                            <Typography
                                              variant="subtitle1"
                                              sx={{
                                                fontWeight: "bold",
                                                color: institutionalColors.textPrimary,
                                                textDecoration: programa.activo === false ? "line-through" : "none",
                                              }}
                                            >
                                              {programa.nombre}
                                            </Typography>

                                            <Chip
                                              size="small"
                                              icon={getTipoProgramaIcon(programa.tipo)}
                                              label={programa.tipo || "Sin tipo"}
                                              sx={{
                                                height: 24,
                                                bgcolor: alpha(
                                                  getTipoProgramaColor(programa.tipo),
                                                  0.1
                                                ),
                                                color: getTipoProgramaColor(programa.tipo),
                                                "& .MuiChip-icon": {
                                                  color: getTipoProgramaColor(programa.tipo),
                                                },
                                              }}
                                            />

                                            {programa.activo === false && (
                                              <Chip
                                                size="small"
                                                label="INACTIVO"
                                                sx={{
                                                  height: 24,
                                                  bgcolor: alpha(institutionalColors.error, 0.1),
                                                  color: institutionalColors.error,
                                                }}
                                              />
                                            )}

                                            {/* ✅ NUEVO: Chip para Requiere Validación */}
                                            {programa.requiereValidacion && (
                                              <Tooltip title="Requiere validación por comité" arrow>
                                                <Chip
                                                  size="small"
                                                  icon={<GppGoodIcon fontSize="small" />}
                                                  label="REQUIERE VALIDACIÓN"
                                                  sx={{
                                                    height: 24,
                                                    bgcolor: alpha(institutionalColors.info, 0.1),
                                                    color: institutionalColors.info,
                                                    "& .MuiChip-icon": {
                                                      color: institutionalColors.info,
                                                    },
                                                  }}
                                                />
                                              </Tooltip>
                                            )}
                                          </Box>

                                          <Typography
                                            variant="body2"
                                            sx={{
                                              color: institutionalColors.textSecondary,
                                              mb: 1.5,
                                            }}
                                          >
                                            {programa.descripcion || "Sin descripción"}
                                          </Typography>

                                          <Box
                                            sx={{
                                              display: "grid",
                                              gridTemplateColumns: "repeat(3, 1fr)",
                                              gap: 1,
                                              mt: 1,
                                              p: 1.5,
                                              borderRadius: 2,
                                              bgcolor: alpha(institutionalColors.primary, 0.03),
                                              fontSize: "0.75rem",
                                            }}
                                          >
                                            <Box>
                                              <Typography
                                                variant="caption"
                                                color="textSecondary"
                                                display="block"
                                              >
                                                Horas Requeridas
                                              </Typography>
                                              <Typography variant="body2" fontWeight="medium">
                                                {programa.horasRequeridas || 0} horas
                                              </Typography>
                                            </Box>
                                            <Box>
                                              <Typography
                                                variant="caption"
                                                color="textSecondary"
                                                display="block"
                                              >
                                                ID Programa
                                              </Typography>
                                              <Typography
                                                variant="body2"
                                                fontWeight="medium"
                                                sx={{ fontFamily: "monospace" }}
                                              >
                                                #{programa.id}
                                              </Typography>
                                            </Box>
                                            <Box>
                                              <Typography
                                                variant="caption"
                                                color="textSecondary"
                                                display="block"
                                              >
                                                Configuración
                                              </Typography>
                                              <Typography variant="body2" fontWeight="medium">
                                                {programa.configuracionJson
                                                  ? "✓ Configurado"
                                                  : "Sin configurar"}
                                              </Typography>
                                            </Box>
                                          </Box>

                                          {programa.configuracionJson && (
                                            <Box
                                              sx={{
                                                mt: 1,
                                                p: 1,
                                                borderRadius: 1,
                                                bgcolor: alpha(institutionalColors.info, 0.05),
                                                border: `1px solid ${alpha(institutionalColors.info, 0.2)}`,
                                              }}
                                            >
                                              <Typography
                                                variant="caption"
                                                color="textSecondary"
                                                display="block"
                                                sx={{ mb: 0.5 }}
                                              >
                                                Configuración:
                                              </Typography>
                                              <Typography
                                                variant="caption"
                                                sx={{
                                                  fontFamily: "monospace",
                                                  fontSize: "0.7rem",
                                                  whiteSpace: "pre-wrap",
                                                  wordBreak: "break-all",
                                                }}
                                              >
                                                {programa.configuracionJson}
                                              </Typography>
                                            </Box>
                                          )}
                                        </Box>

                                        <ListItemSecondaryAction>
                                          <Stack direction="row" spacing={1}>
                                            {!apartado.esGlobal &&
                                              canModifyPrograma(apartado) && (
                                                <Tooltip title="Editar programa" arrow>
                                                  <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                      handleEditPrograma(apartado, programa)
                                                    }
                                                    sx={{
                                                      color: institutionalColors.primary,
                                                      "&:hover": {
                                                        bgcolor: alpha(
                                                          institutionalColors.primary,
                                                          0.1
                                                        ),
                                                      },
                                                    }}
                                                  >
                                                    <EditIcon fontSize="small" />
                                                  </IconButton>
                                                </Tooltip>
                                              )}

                                            {!apartado.esGlobal &&
                                              canModifyPrograma(apartado) && (
                                                <Tooltip
                                                  title={
                                                    programa.activo === false
                                                      ? "Activar programa"
                                                      : "Desactivar programa"
                                                  }
                                                  arrow
                                                >
                                                  <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                      handleToggleProgramaStatus(
                                                        apartado.idApartado,
                                                        programa
                                                      )
                                                    }
                                                    sx={{
                                                      color:
                                                        programa.activo === false
                                                          ? institutionalColors.success
                                                          : institutionalColors.warning,
                                                      "&:hover": {
                                                        bgcolor: alpha(
                                                          programa.activo === false
                                                            ? institutionalColors.success
                                                            : institutionalColors.warning,
                                                          0.1
                                                        ),
                                                      },
                                                    }}
                                                  >
                                                    {programa.activo === false ? (
                                                      <RestoreIcon fontSize="small" />
                                                    ) : (
                                                      <PowerIcon fontSize="small" />
                                                    )}
                                                  </IconButton>
                                                </Tooltip>
                                              )}
                                          </Stack>
                                        </ListItemSecondaryAction>
                                      </ListItem>
                                    </Fade>
                                  ))}
                              </List>

                              {!apartado.esGlobal && canAddPrograma(apartado) && apartado.activo !== false && (
                                <Button
                                  variant="outlined"
                                  startIcon={<AddIcon />}
                                  size="medium"
                                  onClick={() => handleAddPrograma(apartado.idApartado)}
                                  disabled={apartado.activo === false}
                                  sx={{
                                    mt: 2,
                                    color: institutionalColors.warning,
                                    borderColor: institutionalColors.warning,
                                    "&:hover": {
                                      borderColor: institutionalColors.secondary,
                                      bgcolor: alpha(institutionalColors.warning, 0.04),
                                    },
                                  }}
                                >
                                  Agregar Programa a esta Categoría
                                </Button>
                              )}
                              
                              {apartado.activo === false && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    mt: 2,
                                    color: institutionalColors.error,
                                    fontStyle: "italic",
                                  }}
                                >
                                  * Esta categoría está inactiva. No se pueden agregar nuevos programas hasta que se active.
                                </Typography>
                              )}
                            </>
                          )}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Zoom>
                ))
            )}
          </Box>
        </Paper>
      </Box>

      {/* Modal de Confirmación Personalizado */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText="Cancelar"
        severity={confirmDialog.severity}
      />

      {/* ── Modales ── */}
      <CreateCategoryDialogAdmin
        open={openCreateCategory}
        onClose={() => setOpenCreateCategory(false)}
        onSuccess={handleCreateCategorySuccess}
        isAdmin
        instanciaId={user?.instanciaId}
      />

      <EditCategoryDialogAdmin
        open={openEditCategory}
        onClose={() => {
          setOpenEditCategory(false);
          setCurrentApartado(null);
        }}
        onSuccess={handleUpdateCategorySuccess}
        category={currentApartado}
        isAdmin
      />

      <CreateDocumentDialogAdmin
        open={openCreateDocument}
        onClose={() => {
          setOpenCreateDocument(false);
          setCurrentApartado(null);
        }}
        onSuccess={handleCreateDocumentSuccess}
        apartadoId={selectedApartadoId}
        apartado={currentApartado}
      />

      <EditDocumentDialogAdmin
        open={openEditDocument}
        onClose={() => {
          setOpenEditDocument(false);
          setCurrentApartado(null);
          setCurrentDocumento(null);
        }}
        onSuccess={handleUpdateDocumentSuccess}
        apartadoId={currentApartado?.idApartado}
        documento={currentDocumento}
        apartado={currentApartado}
      />

      <CreateProgramaDialogAdmin
        open={openCreatePrograma}
        onClose={() => {
          setOpenCreatePrograma(false);
          setCurrentApartado(null);
          setSelectedApartadoId(null);
        }}
        onSuccess={handleCreateProgramaSuccess}
        apartadoId={selectedApartadoId}
        esGlobal={false}
      />

      <EditProgramaDialogAdmin
        open={openEditPrograma}
        onClose={() => {
          setOpenEditPrograma(false);
          setCurrentApartado(null);
          setCurrentPrograma(null);
        }}
        onSuccess={handleUpdateProgramaSuccess}
        apartadoId={currentApartado?.idApartado}
        programa={currentPrograma}
        esGlobal={currentApartado?.esGlobal || false}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Zoom}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: 3,
            "& .MuiAlert-icon": { fontSize: 24 },
          }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfigExpediente;