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
} from "@mui/icons-material";

// Importar servicios de API
import { getTodosApartados, desactivarApartado } from "../../services/apartado";

import {
  getDocumentosPorApartado,
  editarDocumento,
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

      // Obtener TODOS los apartados (sin filtrar por instancia)
      const apartadosData = await getTodosApartados();
    
      const apartadosConDocumentos = await Promise.all(
        apartadosData.map(async (apartado) => {
          try {
            const documentos = await getDocumentosPorApartado(
              apartado.idApartado,
            );
            return {
              ...apartado,
              documentos: documentos || [],
            };
           
          } catch (error) {
            console.error(
              `Error cargando documentos para apartado ${apartado.idApartado}:`,
              error,
            );
            return {
              ...apartado,
              documentos: [],
            };
          }
        }),
      );

      // Filtrar solo apartados activos y ordenar
      const apartadosActivos = apartadosConDocumentos
        .filter((ap) => ap.activo !== false)
        .sort((a, b) => (a.orden || 0) - (b.orden || 0));

      setApartados(apartadosActivos);

      // Expandir primera categoría por defecto si existe
      if (apartadosActivos.length > 0) {
        setExpandedCategory(apartadosActivos[0].idApartado);
      }
      
    } catch (error) {
      console.error("Error cargando apartados:", error);
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
    const documento = (apartados.find(a => a.idApartado === apartadoId)?.documentos || [])
                      .find(doc => doc.idDocumento === documentoId);

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
                  (doc) => doc.idDocumento !== documentoId
                ),
              };
            }
            return apartado;
          })
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
      !documento.periodo_revision ||
      parseInt(documento.periodo_revision) === 0
    )
      return "No requiere revisión periódica";
    const days = parseInt(documento.periodo_revision);
    if (days === 30) return "Revisión mensual";
    if (days === 60) return "Revisión bimestral";
    if (days === 90) return "Revisión trimestral";
    if (days === 180) return "Revisión semestral";
    if (days === 365) return "Revisión anual";
    if (days === 730) return "Revisión bianual";
    return `Revisión cada ${documento.periodo_revision} días`;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
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
          p: 2.5,
          pt: 0,
        }}
      >
        <Paper
          elevation={1}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: "8px",
            height: "100%",
            border: `1px solid #e5e7eb`,
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid #e5e7eb`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "#fff",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: institutionalColors.primary, fontWeight: "bold" }}
            >
              Estructura Global del Expediente
            </Typography>
          </Box>

          {/* Lista de apartados */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              bgcolor: institutionalColors.background,
            }}
          >
            {apartados.length === 0 ? (
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
                <FolderIcon
                  sx={{
                    fontSize: 48,
                    color: institutionalColors.textSecondary,
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: institutionalColors.textSecondary, mb: 1 }}
                >
                  No hay categorías configuradas
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: institutionalColors.textSecondary, mb: 3 }}
                >
                  Comience creando una nueva categoría global para organizar los
                  documentos del expediente
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddCategory}
                  sx={{
                    bgcolor: institutionalColors.primary,
                    "&:hover": { bgcolor: institutionalColors.secondary },
                  }}
                >
                  Crear primera categoría
                </Button>
              </Box>
            ) : (
              apartados
                .sort((a, b) => (a.orden || 0) - (b.orden || 0))
                .map((apartado) => (
                  <Accordion
                    key={apartado.idApartado}
                    expanded={expandedCategory === apartado.idApartado}
                    onChange={() => handleCategoryExpand(apartado.idApartado)}
                    sx={{
                      mb: 2,
                      borderRadius: "8px !important",
                      overflow: "hidden",
                      border: `1px solid #e5e7eb`,
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ bgcolor: "#fff" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "8px",
                            bgcolor: `${getCategoryColor(apartado.nombre)}20`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 2,
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{ color: getCategoryColor(apartado.nombre) }}
                          >
                            {apartado.icono || getDefaultIcon(apartado.nombre)}
                          </Typography>
                        </Box>

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
                              variant="subtitle1"
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
                                sx={{ height: 20, fontSize: "0.65rem" }}
                              />
                            )}
                            <Chip
                              label={`${apartado.documentos?.length || 0} docs`}
                              size="small"
                              variant="outlined"
                              sx={{
                                height: 20,
                                fontSize: "0.65rem",
                                borderColor: institutionalColors.textSecondary,
                                color: institutionalColors.textSecondary,
                              }}
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{ color: institutionalColors.textSecondary }}
                          >
                            {apartado.descripcion}
                          </Typography>
                          {apartado.id_instancia && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: institutionalColors.info,
                                display: "block",
                                mt: 0.5,
                              }}
                            >
                              Instancia ID: {apartado.id_instancia}
                            </Typography>
                          )}
                        </Box>

                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Editar categoría">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCategory(apartado);
                              }}
                              sx={{ color: institutionalColors.primary }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar categoría">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(apartado.idApartado);
                              }}
                              sx={{ color: institutionalColors.error }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails sx={{ bgcolor: "#fff" }}>
                      <Box sx={{ pl: 6 }}>
                        <List sx={{ p: 0 }}>
                          {(apartado.documentos || [])
                            .sort((a, b) => (a.orden || 0) - (b.orden || 0))
                            .map((documento) => (
                              <ListItem
                                key={documento.idDocumento}
                                sx={{
                                  p: 1.5,
                                  mb: 1,
                                  borderRadius: "6px",
                                  bgcolor: institutionalColors.background,
                                  borderLeft: `3px solid ${institutionalColors.textSecondary}`,
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  <DragIndicatorIcon
                                    sx={{
                                      color: institutionalColors.textSecondary,
                                    }}
                                  />
                                </ListItemIcon>

                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  <DescriptionIcon
                                    sx={{
                                      color: institutionalColors.textSecondary,
                                    }}
                                  />
                                </ListItemIcon>

                                <Box sx={{ flex: 1 }}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      mb: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontWeight: "bold",
                                        color: institutionalColors.textPrimary,
                                        fontSize: "1rem",
                                      }}
                                    >
                                      {documento.nombre_archivo}
                                    </Typography>
                                    {documento.periodo_revision > 0 && (
                                      <Tooltip
                                        title={getReviewDescription(documento)}
                                      >
                                        <TimerIcon
                                          sx={{
                                            fontSize: 18,
                                            color: institutionalColors.info,
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
                                    {documento.descripcion || "Sin descripción"}
                                  </Typography>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 2,
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    {documento.periodo_revision > 0 && (
                                      <Typography
                                        variant="caption"
                                        sx={{ 
                                          color: institutionalColors.info,
                                          bgcolor: `${institutionalColors.info}10`,
                                          px: 1,
                                          py: 0.5,
                                          borderRadius: "4px",
                                        }}
                                      >
                                        {getReviewDescription(documento)}
                                      </Typography>
                                    )}
                                    {documento.horas_requeridas > 0 && (
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: institutionalColors.success,
                                          bgcolor: `${institutionalColors.success}10`,
                                          px: 1,
                                          py: 0.5,
                                          borderRadius: "4px",
                                        }}
                                      >
                                        {documento.horas_requeridas} horas requeridas
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>

                                <ListItemSecondaryAction>
                                  <Stack direction="row" spacing={0.5}>
                                    <Tooltip title="Editar documento">
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
                                        }}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar documento">
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
                                        }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Stack>
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))}
                        </List>

                        <Button
                          startIcon={<AddIcon />}
                          size="small"
                          onClick={() => handleAddDocument(apartado.idApartado)}
                          sx={{
                            mt: 2,
                            color: institutionalColors.primary,
                            "&:hover": {
                              bgcolor: institutionalColors.lightBlue,
                            },
                          }}
                        >
                          Agregar Documento a esta Categoría
                        </Button>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
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

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfigExpediente;