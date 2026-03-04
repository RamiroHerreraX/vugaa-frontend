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
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

// Importar servicios de API
import { getTodosApartados, desactivarApartado } from "../../services/apartado";

import {
  getDocumentosPorApartado,
  eliminarDocumento,
} from "../../services/documentoExpediente";

// Importar los modales
import CreateCategoryDialog from "../../components/expediente/CreateCategoryDialog";
import EditCategoryDialog from "../../components/expediente/EditCategoryDialog";
import CreateDocumentDialog from "../../components/expediente/CreateDocumentDialog";
import EditDocumentDialog from "../../components/expediente/EditDocumentDialog";

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

  // Estados para los diálogos
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [openCreateDocument, setOpenCreateDocument] = useState(false);
  const [openEditDocument, setOpenEditDocument] = useState(false);

  const [currentApartado, setCurrentApartado] = useState(null);
  const [currentDocumento, setCurrentDocumento] = useState(null);
  const [selectedApartadoId, setSelectedApartadoId] = useState(null);

  const [expandedCategory, setExpandedCategory] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    cargarApartados();
  }, []);

  const cargarApartados = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔵 Iniciando carga de apartados...");

      // 1️⃣ Obtener TODOS los apartados
      const apartadosData = await getTodosApartados();
      console.log("📂 Apartados obtenidos del backend:", apartadosData);

      const apartadosConDocumentos = await Promise.all(
        apartadosData.map(async (apartado) => {
          try {
            const documentos = await getDocumentosPorApartado(
              apartado.idApartado,
            );

            console.log(
              `📄 Documentos del apartado ${apartado.nombre} (ID: ${apartado.idApartado}):`,
              documentos,
            );
            console.log(
              "📄 Documentos completos:",
              JSON.stringify(documentos, null, 2),
            );

            return {
              ...apartado,
              documentos: documentos || [],
            };
          } catch (error) {
            console.error(
              `❌ Error cargando documentos para apartado ${apartado.idApartado}:`,
              error,
            );

            return {
              ...apartado,
              documentos: [],
            };
          }
        }),
      );

      console.log(
        "🟣 Apartados con documentos incluidos:",
        apartadosConDocumentos,
      );

      // 2️⃣ Filtrar activos y ordenar
      const apartadosActivos = apartadosConDocumentos
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

  // Calcular estadísticas (quitando requiredDocuments)
  const stats = {
    totalCategories: apartados.length,
    totalDocuments: apartados.reduce(
      (total, ap) => total + (ap.documentos?.length || 0),
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
  };

  const handleDeleteCategory = async (apartadoId) => {
    if (
      window.confirm(
        "¿Está seguro de eliminar esta categoría y todos sus documentos?",
      )
    ) {
      try {
        await desactivarApartado(apartadoId);
        setApartados(apartados.filter((ap) => ap.idApartado !== apartadoId));
        showSnackbar("Categoría eliminada exitosamente");
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
  };

  const handleDeleteDocument = async (apartadoId, documentoId) => {
    // Buscar el documento completo en el estado local
    const documento = (
      apartados.find((a) => a.idApartado === apartadoId)?.documentos || []
    ).find((doc) => doc.idDocumento === documentoId);

    console.log("Intentando eliminar documento:");
    console.log("apartadoId:", apartadoId);
    console.log("documentoId:", documentoId);
    console.log("Documento completo:", documento);

    if (!documentoId || !documento) {
      console.error("Error: documento no encontrado o ID indefinido");
      showSnackbar("No se puede eliminar: documento no encontrado", "error");
      return;
    }

    if (window.confirm("¿Está seguro de eliminar este documento?")) {
      try {
        await eliminarDocumento(documentoId);

        setApartados(
          apartados.map((apartado) => {
            if (apartado.idApartado === apartadoId) {
              return {
                ...apartado,
                documentos: (apartado.documentos || []).filter(
                  (doc) => doc.idDocumento !== documentoId,
                ),
              };
            }
            return apartado;
          }),
        );

        showSnackbar("Documento eliminado exitosamente");
      } catch (error) {
        console.error("Error eliminando documento:", error);
        showSnackbar("Error al eliminar el documento", "error");
      }
    }
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
    >{/* Header */}
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
              Panel de Super Administrador - Gestión global de categorías y
              documentos
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

        {/* 3 CARDS CON ESTADÍSTICAS (quitamos la de Rev. Comité) */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
            mb: 3,
            width: "100%",
            "@media (max-width: 900px)": {
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
                    documentos del expediente
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
                            badgeContent={apartado.documentos?.length || 0}
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
                                          {documento.nombreArchivo}
                                        </Typography>

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

                                      {/* Descripción */}
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          color: institutionalColors.textSecondary,
                                          mb: 1.5,
                                        }}
                                      >
                                        {documento.descripcion || "Sin descripción"}
                                      </Typography>

                                      {/* Chips informativos mejorados */}
                                      <Box
                                        sx={{
                                          display: "flex",
                                          gap: 1,
                                          flexWrap: "wrap",
                                          mb: 2,
                                        }}
                                      >
                                        {documento.formatoEsperado && (
                                          <Chip
                                            size="small"
                                            icon={<AttachFileIcon />}
                                            label={`Formato: ${documento.formatoEsperado}`}
                                            sx={{
                                              height: 24,
                                              bgcolor: alpha(institutionalColors.success, 0.1),
                                              color: institutionalColors.success,
                                            }}
                                          />
                                        )}

                                        {documento.etiquetas && (
                                          <Chip
                                            size="small"
                                            icon={<InfoIcon />}
                                            label={documento.etiquetas}
                                            sx={{
                                              height: 24,
                                              bgcolor: alpha(institutionalColors.warning, 0.1),
                                              color: institutionalColors.warning,
                                            }}
                                          />
                                        )}
                                      </Box>

                                      {/* Información técnica mejorada */}
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
                                            Fecha Carga
                                          </Typography>
                                          <Typography variant="body2" fontWeight="medium">
                                            {documento.fechaCarga || "N/A"}
                                          </Typography>
                                        </Box>

                                        <Box>
                                          <Typography variant="caption" color="textSecondary" display="block">
                                            Última Modificación
                                          </Typography>
                                          <Typography variant="body2" fontWeight="medium">
                                            {documento.fechaModificacion || "N/A"}
                                          </Typography>
                                        </Box>

                                        <Box>
                                          <Typography variant="caption" color="textSecondary" display="block">
                                            ID Documento
                                          </Typography>
                                          <Typography variant="body2" fontWeight="medium" sx={{ fontFamily: "monospace" }}>
                                            #{documento.idDocumento}
                                          </Typography>
                                        </Box>
                                      </Box>
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

                                        <Tooltip title="Eliminar documento" arrow>
                                          <IconButton
                                            size="small"
                                            onClick={() =>
                                              handleDeleteDocument(
                                                apartado.idApartado,
                                                documento.idDocumento,
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
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Zoom>
                ))
            )}
          </Box>
        </Paper>
      </Box>

      {/* Modales */}
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