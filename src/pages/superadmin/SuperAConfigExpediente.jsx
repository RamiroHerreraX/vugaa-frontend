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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  Save as SaveIcon,
  Folder as FolderIcon,
  Description as DescriptionIcon,
  ExpandMore as ExpandMoreIcon,
  Timer as TimerIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
  Visibility as VisibilityIcon,
  CloudUpload as CloudUploadIcon,
  AttachFile as AttachFileIcon,
  Info as InfoIcon,
  Code as CodeIcon,
  Computer as ComputerIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

// Importar servicios de API
import { getTodosApartados, desactivarApartado } from "../../services/apartado";

import {
  getDocumentosPorApartado,
  toggleEstadoDocumento,
} from "../../services/documentoExpediente";

// Importar los modales
import CreateCategoryDialog from "../../components/expediente/CreateCategoryDialog";
import EditCategoryDialog from "../../components/expediente/EditCategoryDialog";
import CreateDocumentDialog from "../../components/expediente/CreateDocumentDialog";
import EditDocumentDialog from "../../components/expediente/EditDocumentDialog";

import CreateProgramaDialog from "../../components/programas/CreateProgramaDialog";
import EditProgramaDialog from "../../components/programas/EditProgramaDialog";

import { getProgramasPorApartado, eliminarPrograma } from "../../services/programas";

// Importar iconos y colores desde el archivo de iconos
import {
  institutionalColors,
  getDefaultIcon,
  getCategoryColor,
} from "../../utils/iconosUtils";

const ConfigExpediente = () => {
  const [apartados, setApartados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Estado para controlar si hay una actualización pendiente
  const [pendingUpdate, setPendingUpdate] = useState(false);

  // Estado para controlar la pestaña activa (documentos o programas)
  const [activeTab, setActiveTab] = useState(0);

  // Estados para los diálogos de categorías y documentos
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [openCreateDocument, setOpenCreateDocument] = useState(false);
  const [openEditDocument, setOpenEditDocument] = useState(false);

  // Estados para los diálogos de programas
  const [openCreatePrograma, setOpenCreatePrograma] = useState(false);
  const [openEditPrograma, setOpenEditPrograma] = useState(false);

  const [currentApartado, setCurrentApartado] = useState(null);
  const [currentDocumento, setCurrentDocumento] = useState(null);
  const [currentPrograma, setCurrentPrograma] = useState(null);
  const [selectedApartadoId, setSelectedApartadoId] = useState(null);

  const [expandedCategory, setExpandedCategory] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    cargarApartados();
  }, []);

  // Efecto para actualizar la página después de 2 segundos cuando hay una actualización pendiente
  useEffect(() => {
    if (pendingUpdate) {
      const timer = setTimeout(() => {
        cargarApartados();
        setPendingUpdate(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [pendingUpdate]);

  const cargarApartados = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔵 Iniciando carga de apartados...");

      // 1️⃣ Obtener TODOS los apartados
      const apartadosData = await getTodosApartados();
      console.log("📂 Apartados obtenidos del backend:", apartadosData);

      const apartadosConDocumentosYProgramas = await Promise.all(
        apartadosData.map(async (apartado) => {
          try {
            // Cargar documentos
            const documentos = await getDocumentosPorApartado(
              apartado.idApartado,
            );

            // Cargar programas
            const programas = await getProgramasPorApartado(
              apartado.idApartado,
            );

            console.log(
              `📄 Documentos del apartado ${apartado.nombre} (ID: ${apartado.idApartado}):`,
              documentos,
            );
            console.log(
              `💻 Programas del apartado ${apartado.nombre} (ID: ${apartado.idApartado}):`,
              programas,
            );

            return {
              ...apartado,
              documentos: documentos || [],
              programas: programas || [],
            };
          } catch (error) {
            console.error(
              `❌ Error cargando datos para apartado ${apartado.idApartado}:`,
              error,
            );

            return {
              ...apartado,
              documentos: [],
              programas: [],
            };
          }
        }),
      );

      console.log(
        "🟣 Apartados con documentos y programas incluidos:",
        apartadosConDocumentosYProgramas,
      );

      // 2️⃣ Filtrar activos y ordenar
      const apartadosActivos = apartadosConDocumentosYProgramas
        .filter((ap) => ap.activo !== false)
        .sort((a, b) => (a.orden || 0) - (b.orden || 0));

      console.log("🟢 Apartados activos y ordenados:", apartadosActivos);

      setApartados(apartadosActivos);

      // Expandir primera categoría
      if (apartadosActivos.length > 0) {
        setExpandedCategory(apartadosActivos[0].idApartado);
      }

      console.log("✅ Carga completada correctamente");
    } catch (error) {
      console.error("🔥 Error general cargando apartados:", error);
      setError("Error al cargar las categorías. Por favor, intente de nuevo.");
      showSnackbar("Error al cargar datos", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Función para manejar la actualización después de 2 segundos
  const handleUpdateWithDelay = () => {
    setPendingUpdate(true);
  };

  // Calcular estadísticas
  const stats = {
    totalCategories: apartados.length,
    totalDocuments: apartados.reduce(
      (total, ap) => total + (ap.documentos?.length || 0),
      0,
    ),
    totalProgramas: apartados.reduce(
      (total, ap) => total + (ap.programas?.length || 0),
      0,
    ),
    requiredCategories: apartados.filter((ap) => ap.obligatorio).length,
  };

  // Handlers para categorías
  const handleAddCategory = () => {
    setOpenCreateCategory(true);
  };

  const handleEditCategory = (apartado) => {
    setCurrentApartado(apartado);
    setOpenEditCategory(true);
  };

  const handleCreateCategorySuccess = (nuevoApartado) => {
    setApartados([...apartados, nuevoApartado]);
    setOpenCreateCategory(false);
    showSnackbar("Categoría creada exitosamente");
    setExpandedCategory(nuevoApartado.idApartado);
    handleUpdateWithDelay(); // Programar actualización después de 2 segundos
  };

  const handleUpdateCategorySuccess = (apartadoActualizado) => {
    setApartados(
      apartados.map((ap) =>
        ap.idApartado === apartadoActualizado.idApartado
          ? apartadoActualizado
          : ap,
      ),
    );
    setOpenEditCategory(false);
    setCurrentApartado(null);
    showSnackbar("Categoría actualizada exitosamente");
    handleUpdateWithDelay(); // Programar actualización después de 2 segundos
  };

  const handleDeleteCategory = async (apartadoId) => {
    if (
      window.confirm(
        "¿Está seguro de eliminar esta categoría y todos sus documentos y programas?",
      )
    ) {
      try {
        await desactivarApartado(apartadoId);
        setApartados(apartados.filter((ap) => ap.idApartado !== apartadoId));
        showSnackbar("Categoría eliminada exitosamente");
        handleUpdateWithDelay(); // Programar actualización después de 2 segundos
      } catch (error) {
        console.error("Error eliminando categoría:", error);
        showSnackbar("Error al eliminar la categoría", "error");
      }
    }
  };

  // Handlers para documentos
  const handleAddDocument = (apartadoId) => {
    const apartado = apartados.find((ap) => ap.idApartado === apartadoId);
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
    setApartados(
      apartados.map((apartado) => {
        if (apartado.idApartado === apartadoId) {
          return {
            ...apartado,
            documentos: [...(apartado.documentos || []), nuevoDocumento],
          };
        }
        return apartado;
      }),
    );
    setOpenCreateDocument(false);
    setCurrentApartado(null);
    showSnackbar("Documento creado exitosamente");
    handleUpdateWithDelay(); // Programar actualización después de 2 segundos
  };

  const handleUpdateDocumentSuccess = (apartadoId, documentoActualizado) => {
    setApartados(
      apartados.map((apartado) => {
        if (apartado.idApartado === apartadoId) {
          return {
            ...apartado,
            documentos: (apartado.documentos || []).map((doc) =>
              doc.idDocumento === documentoActualizado.idDocumento
                ? documentoActualizado
                : doc,
            ),
          };
        }
        return apartado;
      }),
    );
    setOpenEditDocument(false);
    setCurrentApartado(null);
    setCurrentDocumento(null);
    showSnackbar("Documento actualizado exitosamente");
    handleUpdateWithDelay(); // Programar actualización después de 2 segundos
  };

  const handleDeleteDocument = async (apartadoId, documentoId) => {
    // Buscar el documento completo en el estado local
    const documento = (
      apartados.find((a) => a.idApartado === apartadoId)?.documentos || []
    ).find((doc) => doc.idDocumento === documentoId);

    console.log("Toggle de estado para documento:");
    console.log("apartadoId:", apartadoId);
    console.log("documentoId:", documentoId);
    console.log("Documento completo:", documento);
    console.log("Estado actual:", documento?.activo);

    if (!documentoId || !documento) {
      console.error("Error: documento no encontrado o ID indefinido");
      showSnackbar("No se puede modificar: documento no encontrado", "error");
      return;
    }

    // Mensaje diferente según si va a activar o desactivar
    const nuevaAccion = documento.activo === false ? "activar" : "desactivar";
    const mensajeConfirmacion = `¿Está seguro de ${nuevaAccion} este documento?`;

    if (window.confirm(mensajeConfirmacion)) {
      try {
        // Ahora toggleEstadoDocumento devuelve el documento actualizado
        const documentoActualizado = await toggleEstadoDocumento(documentoId);

        setApartados(
          apartados.map((apartado) => {
            if (apartado.idApartado === apartadoId) {
              return {
                ...apartado,
                documentos: (apartado.documentos || []).map((doc) =>
                  doc.idDocumento === documentoId ? documentoActualizado : doc
                ),
              };
            }
            return apartado;
          }),
        );

        // Mensaje diferente según la acción realizada
        const mensajeExito = documento.activo === false
          ? "Documento activado exitosamente"
          : "Documento desactivado exitosamente";

        showSnackbar(mensajeExito);
        handleUpdateWithDelay(); // Programar actualización después de 2 segundos
      } catch (error) {
        console.error("Error cambiando estado del documento:", error);
        showSnackbar("Error al cambiar el estado del documento", "error");
      }
    }
  };

  // Handlers para programas
  const handleAddPrograma = (apartadoId) => {
    const apartado = apartados.find((ap) => ap.idApartado === apartadoId);
    setCurrentApartado(apartado);
    setSelectedApartadoId(apartadoId);
    setOpenCreatePrograma(true);
  };

  const handleEditPrograma = (apartado, programa) => {
    setCurrentApartado(apartado);
    setCurrentPrograma(programa);
    setOpenEditPrograma(true);
  };

  const handleCreateProgramaSuccess = (apartadoId, nuevoPrograma) => {
    setApartados(
      apartados.map((apartado) => {
        if (apartado.idApartado === apartadoId) {
          return {
            ...apartado,
            programas: [...(apartado.programas || []), nuevoPrograma],
          };
        }
        return apartado;
      }),
    );
    setOpenCreatePrograma(false);
    setCurrentApartado(null);
    showSnackbar("Programa creado exitosamente");
    handleUpdateWithDelay(); // Programar actualización después de 2 segundos
  };

  const handleUpdateProgramaSuccess = (apartadoId, programaActualizado) => {
    setApartados(
      apartados.map((apartado) => {
        if (apartado.idApartado === apartadoId) {
          return {
            ...apartado,
            programas: (apartado.programas || []).map((prog) =>
              prog.id === programaActualizado.id
                ? programaActualizado
                : prog,
            ),
          };
        }
        return apartado;
      }),
    );
    setOpenEditPrograma(false);
    setCurrentApartado(null);
    setCurrentPrograma(null);
    showSnackbar("Programa actualizado exitosamente");
    handleUpdateWithDelay(); // Programar actualización después de 2 segundos
  };

  const handleDeletePrograma = async (apartadoId, programaId) => {
    // Buscar el programa completo en el estado local
    const programa = (
      apartados.find((a) => a.idApartado === apartadoId)?.programas || []
    ).find((prog) => prog.id === programaId);

    console.log("Intentando eliminar programa:");
    console.log("apartadoId:", apartadoId);
    console.log("programaId:", programaId);
    console.log("Programa completo:", programa);

    if (!programaId || !programa) {
      console.error("Error: programa no encontrado o ID indefinido");
      showSnackbar("No se puede eliminar: programa no encontrado", "error");
      return;
    }

    if (window.confirm("¿Está seguro de eliminar este programa?")) {
      try {
        await eliminarPrograma(programaId);

        setApartados(
          apartados.map((apartado) => {
            if (apartado.idApartado === apartadoId) {
              return {
                ...apartado,
                programas: (apartado.programas || []).filter(
                  (prog) => prog.id !== programaId,
                ),
              };
            }
            return apartado;
          }),
        );

        showSnackbar("Programa eliminado exitosamente");
        handleUpdateWithDelay(); // Programar actualización después de 2 segundos
      } catch (error) {
        console.error("Error eliminando programa:", error);
        showSnackbar("Error al eliminar el programa", "error");
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCategoryExpand = (apartadoId) => {
    setExpandedCategory(expandedCategory === apartadoId ? null : apartadoId);
  };

  const handleRefresh = () => {
    cargarApartados();
  };

  const getReviewDescription = (documento) => {
    if (
      !documento.periodoRevision ||
      parseInt(documento.periodoRevision) === 0
    )
      return "No requiere revisión periódica";
    const days = parseInt(documento.periodoRevision);
    if (days === 30) return "Revisión mensual";
    if (days === 60) return "Revisión bimestral";
    if (days === 90) return "Revisión trimestral";
    if (days === 180) return "Revisión semestral";
    if (days === 365) return "Revisión anual";
    if (days === 730) return "Revisión bianual";
    return `Revisión cada ${documento.periodoRevision} días`;
  };

  const getReviewIcon = (days) => {
    if (days <= 30) return <ScheduleIcon fontSize="small" />;
    if (days <= 90) return <TimerIcon fontSize="small" />;
    return <ScheduleIcon fontSize="small" />;
  };

  const getTipoProgramaColor = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'backend':
        return institutionalColors.success;
      case 'frontend':
        return institutionalColors.info;
      case 'fullstack':
        return institutionalColors.warning;
      default:
        return institutionalColors.primary;
    }
  };

  const getTipoProgramaIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'backend':
        return <CodeIcon fontSize="small" />;
      case 'frontend':
        return <ComputerIcon fontSize="small" />;
      case 'fullstack':
        return <CodeIcon fontSize="small" />;
      default:
        return <CodeIcon fontSize="small" />;
    }
  };

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
              sx={{
                color: institutionalColors.primary,
                fontWeight: "bold",
                mb: 0.5,
              }}
            >
              Configuración de Expedientes
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: institutionalColors.textSecondary }}
            >
              Panel de Super Administrador - Gestión global de categorías, documentos y programas
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Chip
                icon={<AdminPanelSettingsIcon />}
                label="Super Administrador"
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
              {pendingUpdate && (
                <Chip
                  size="small"
                  icon={<RefreshIcon />}
                  label="Actualizando en 2 segundos..."
                  sx={{
                    bgcolor: alpha(institutionalColors.warning, 0.1),
                    color: institutionalColors.warning,
                    animation: "pulse 1.5s infinite",
                    "@keyframes pulse": {
                      "0%": { opacity: 1 },
                      "50%": { opacity: 0.6 },
                      "100%": { opacity: 1 },
                    },
                  }}
                />
              )}
            </Box>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCategory}
              sx={{
                bgcolor: institutionalColors.primary,
                "&:hover": { bgcolor: institutionalColors.secondary },
              }}
            >
              Nueva Categoría Global
            </Button>
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* 4 CARDS CON ESTADÍSTICAS (incluyendo programas) */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 2,
            mb: 3,
            width: "100%",
            "@media (max-width: 1100px)": {
              gridTemplateColumns: "repeat(2, 1fr)",
            },
            "@media (max-width: 600px)": {
              gridTemplateColumns: "1fr",
            },
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
                    Categorías Totales
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
                  {stats.requiredCategories} obligatorias
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
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          px: 3,
          pb: 3,
        }}
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
              Estructura Global del Expediente
            </Typography>
          </Box>

          {/* Tabs para alternar entre Documentos y Programas */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fff', px: 2.5 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  minHeight: 48,
                },
                '& .Mui-selected': {
                  color: institutionalColors.primary,
                },
                '& .MuiTabs-indicator': {
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
            {apartados.length === 0 ? (
              <Fade in={true}>
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
                    <FolderIcon sx={{ fontSize: 60 }} />
                  </Avatar>
                  <Typography
                    variant="h5"
                    sx={{ color: institutionalColors.textPrimary, mb: 1, fontWeight: "bold" }}
                  >
                    No hay categorías configuradas
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: institutionalColors.textSecondary, mb: 3, textAlign: "center" }}
                  >
                    Comience creando una nueva categoría global para organizar los
                    documentos y programas del expediente
                  </Typography>
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
                </Box>
              </Fade>
            ) : (
              apartados
                .sort((a, b) => (a.orden || 0) - (b.orden || 0))
                .map((apartado, index) => (
                  <Zoom
                    key={apartado.idApartado}
                    in={true}
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
                        "&:hover": {
                          boxShadow: 4,
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          bgcolor: "#fff",
                          "&:hover": {
                            bgcolor: alpha(institutionalColors.primary, 0.02),
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Badge
                            badgeContent={activeTab === 0
                              ? (apartado.documentos?.length || 0)
                              : (apartado.programas?.length || 0)
                            }
                            color="primary"
                            sx={{ mr: 2 }}
                          >
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                bgcolor: alpha(getCategoryColor(apartado.nombre), 0.1),
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
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: "bold",
                                  color: institutionalColors.textPrimary,
                                }}
                              >
                                {apartado.nombre}
                              </Typography>
                              {apartado.obligatorio && (
                                <Chip
                                  label="OBLIGATORIO"
                                  size="small"
                                  color="error"
                                  sx={{
                                    height: 22,
                                    fontSize: "0.7rem",
                                    fontWeight: "bold",
                                  }}
                                />
                              )}
                              <Chip
                                size="small"
                                icon={activeTab === 0 ? <DescriptionIcon /> : <CodeIcon />}
                                label={activeTab === 0
                                  ? `${apartado.documentos?.length || 0} documentos`
                                  : `${apartado.programas?.length || 0} programas`
                                }
                                sx={{
                                  height: 22,
                                  fontSize: "0.7rem",
                                  bgcolor: alpha(activeTab === 0
                                    ? institutionalColors.success
                                    : institutionalColors.warning, 0.1),
                                  color: activeTab === 0
                                    ? institutionalColors.success
                                    : institutionalColors.warning,
                                }}
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{ color: institutionalColors.textSecondary }}
                            >
                              {apartado.descripcion}
                            </Typography>
                          </Box>

                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Editar categoría" arrow>
                              <IconButton
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
                            <Tooltip title="Eliminar categoría" arrow>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCategory(apartado.idApartado);
                                }}
                                sx={{
                                  color: institutionalColors.error,
                                  "&:hover": {
                                    bgcolor: alpha(institutionalColors.error, 0.1),
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails sx={{ bgcolor: "#fff", p: 3 }}>
                        <Box sx={{ pl: 7 }}>
                          {activeTab === 0 ? (
                            // SECCIÓN DE DOCUMENTOS
                            <>
                              <List sx={{ p: 0 }}>
                                {(apartado.documentos || [])
                                  .sort((a, b) => (a.orden || 0) - (b.orden || 0))
                                  .map((documento, docIndex) => (
                                    <Fade
                                      key={documento.idDocumento}
                                      in={true}
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

                                        {/* Título con badges */}
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
                                            }}
                                          >
                                            {documento.nombreArchivo}
                                          </Typography>

                                          {/* 👇 NUEVO - Badge de estado activo/inactivo */}
                                          {documento.activo === false ? (
                                            <Chip
                                              size="small"
                                              label="INACTIVO"
                                              color="default"
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
                                                icon={getReviewIcon(documento.periodoRevision)}
                                                label={getReviewDescription(documento)}
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

                                        <ListItemSecondaryAction>
                                          <Stack direction="row" spacing={1}>
                                            <Tooltip title="Editar documento" arrow>
                                              <IconButton
                                                size="small"
                                                onClick={() =>
                                                  handleEditDocument(
                                                    apartado,
                                                    documento,
                                                  )
                                                }
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

                                            <Tooltip
                                              title={documento.activo === false ? "Activar documento" : "Desactivar documento"}
                                              arrow
                                            >
                                              <IconButton
                                                size="small"
                                                onClick={() =>
                                                  handleDeleteDocument(
                                                    apartado.idApartado,
                                                    documento.idDocumento,
                                                  )
                                                }
                                                sx={{
                                                  color: documento.activo === false
                                                    ? institutionalColors.success  // Verde para activar
                                                    : institutionalColors.error,    // Rojo para desactivar
                                                  "&:hover": {
                                                    bgcolor: alpha(
                                                      documento.activo === false
                                                        ? institutionalColors.success
                                                        : institutionalColors.error,
                                                      0.1
                                                    ),
                                                  },
                                                }}
                                              >
                                                {documento.activo === false ? (
                                                  <CheckCircleIcon fontSize="small" /> // Icono de activar
                                                ) : (
                                                  <VisibilityOffIcon fontSize="small" />
                                                )}
                                              </IconButton>
                                            </Tooltip>
                                          </Stack>
                                        </ListItemSecondaryAction>
                                      </ListItem>
                                    </Fade>
                                  ))}
                              </List>

                              <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                size="medium"
                                onClick={() => handleAddDocument(apartado.idApartado)}
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
                            </>
                          ) : (
                            // SECCIÓN DE PROGRAMAS
                            <>
                              <List sx={{ p: 0 }}>
                                {(apartado.programas || [])
                                  .sort((a, b) => (a.id || 0) - (b.id || 0))
                                  .map((programa, progIndex) => (
                                    <Fade
                                      key={programa.id}
                                      in={true}
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
                                              bgcolor: alpha(getTipoProgramaColor(programa.tipo), 0.1),
                                              color: getTipoProgramaColor(programa.tipo),
                                            }}
                                          >
                                            {getTipoProgramaIcon(programa.tipo)}
                                          </Avatar>
                                        </ListItemIcon>

                                        <Box sx={{ flex: 1 }}>
                                          {/* Título con badges */}
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
                                              }}
                                            >
                                              {programa.nombre}
                                            </Typography>

                                            <Chip
                                              size="small"
                                              icon={getTipoProgramaIcon(programa.tipo)}
                                              label={programa.tipo || 'Sin tipo'}
                                              sx={{
                                                height: 24,
                                                bgcolor: alpha(getTipoProgramaColor(programa.tipo), 0.1),
                                                color: getTipoProgramaColor(programa.tipo),
                                                "& .MuiChip-icon": {
                                                  color: getTipoProgramaColor(programa.tipo),
                                                },
                                              }}
                                            />

                                            {programa.activo === false && (
                                              <Chip
                                                size="small"
                                                label="Inactivo"
                                                color="default"
                                                sx={{ height: 24 }}
                                              />
                                            )}
                                          </Box>

                                          {/* Descripción */}
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              color: institutionalColors.textSecondary,
                                              mb: 1.5,
                                            }}
                                          >
                                            {programa.descripcion || "Sin descripción"}
                                          </Typography>

                                          {/* Información del programa */}
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
                                              <Typography variant="caption" color="textSecondary" display="block">
                                                Horas Requeridas
                                              </Typography>
                                              <Typography variant="body2" fontWeight="medium">
                                                {programa.horasRequeridas || 0} horas
                                              </Typography>
                                            </Box>

                                            <Box>
                                              <Typography variant="caption" color="textSecondary" display="block">
                                                ID Programa
                                              </Typography>
                                              <Typography variant="body2" fontWeight="medium" sx={{ fontFamily: "monospace" }}>
                                                #{programa.id}
                                              </Typography>
                                            </Box>

                                            <Box>
                                              <Typography variant="caption" color="textSecondary" display="block">
                                                Configuración
                                              </Typography>
                                              <Typography variant="body2" fontWeight="medium">
                                                {programa.configuracionJson ? '✓ Configurado' : 'Sin configurar'}
                                              </Typography>
                                            </Box>
                                          </Box>

                                          {/* Mostrar configuración JSON si existe */}
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
                                              <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 0.5 }}>
                                                Configuración:
                                              </Typography>
                                              <Typography
                                                variant="caption"
                                                sx={{
                                                  fontFamily: 'monospace',
                                                  fontSize: '0.7rem',
                                                  whiteSpace: 'pre-wrap',
                                                  wordBreak: 'break-all',
                                                }}
                                              >
                                                {programa.configuracionJson}
                                              </Typography>
                                            </Box>
                                          )}
                                        </Box>

                                        <ListItemSecondaryAction>
                                          <Stack direction="row" spacing={1}>
                                            <Tooltip title="Editar programa" arrow>
                                              <IconButton
                                                size="small"
                                                onClick={() =>
                                                  handleEditPrograma(
                                                    apartado,
                                                    programa,
                                                  )
                                                }
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

                                            <Tooltip title="Eliminar programa" arrow>
                                              <IconButton
                                                size="small"
                                                onClick={() =>
                                                  handleDeletePrograma(
                                                    apartado.idApartado,
                                                    programa.id,
                                                  )
                                                }
                                                sx={{
                                                  color: institutionalColors.error,
                                                  "&:hover": {
                                                    bgcolor: alpha(institutionalColors.error, 0.1),
                                                  },
                                                }}
                                              >
                                                <DeleteIcon fontSize="small" />
                                              </IconButton>
                                            </Tooltip>
                                          </Stack>
                                        </ListItemSecondaryAction>
                                      </ListItem>
                                    </Fade>
                                  ))}
                              </List>

                              <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                size="medium"
                                onClick={() => handleAddPrograma(apartado.idApartado)}
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

      {/* Modales de Categorías */}
      <CreateCategoryDialog
        open={openCreateCategory}
        onClose={() => setOpenCreateCategory(false)}
        onSuccess={handleCreateCategorySuccess}
        isSuperAdmin={true}
      />

      <EditCategoryDialog
        open={openEditCategory}
        onClose={() => {
          setOpenEditCategory(false);
          setCurrentApartado(null);
        }}
        onSuccess={handleUpdateCategorySuccess}
        category={currentApartado}
        isSuperAdmin={true}
      />

      {/* Modales de Documentos */}
      <CreateDocumentDialog
        open={openCreateDocument}
        onClose={() => {
          setOpenCreateDocument(false);
          setCurrentApartado(null);
        }}
        onSuccess={handleCreateDocumentSuccess}
        apartadoId={selectedApartadoId}
        apartado={currentApartado}
      />

      <EditDocumentDialog
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

      {/* Modales de Programas */}
      <CreateProgramaDialog
        open={openCreatePrograma}
        onClose={() => {
          setOpenCreatePrograma(false);
          setCurrentApartado(null);
        }}
        onSuccess={handleCreateProgramaSuccess}
        apartadoId={selectedApartadoId}
        apartado={currentApartado}
      />

      <EditProgramaDialog
        open={openEditPrograma}
        onClose={() => {
          setOpenEditPrograma(false);
          setCurrentApartado(null);
          setCurrentPrograma(null);
        }}
        onSuccess={handleUpdateProgramaSuccess}
        apartadoId={currentApartado?.idApartado}
        programa={currentPrograma}
        apartado={currentApartado}
      />

      {/* Snackbar mejorado */}
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