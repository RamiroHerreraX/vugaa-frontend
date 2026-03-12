import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  InputAdornment,
  Avatar,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Toolbar,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
  LinearProgress,
  Fade,
  Badge,
} from "@mui/material";

import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  PlayArrow as EnableIcon,
  Pause as DisableIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Domain as DomainIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  Description as DescriptionIcon,
  Verified as VerifiedIcon,
  People as PeopleIcon,
} from "@mui/icons-material";

import CreateInstanceDialog from "../../components/Instancias/CreateInstanceDialog";
import ViewInstanceDialog from "../../components/Instancias/ViewInstanceDialog";
import EditInstanceDialog from "../../components/Instancias/EditInstanceDialog";

import {
  getInstancias,
  getInstanciasConEstadisticas,
  getInstanciaConEstadisticas,
  actualizarContadoresInstancia,
  actualizarContadoresTodasInstancias,
  cambiarEstadoInstancia,
} from "../../services/Instancia";

import { useAuth } from "../../context/AuthContext";

// Colores institucionales
const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
  accent: "#e9e9e9",
  background: "#f8f9fa",
  lightBlue: "rgba(19, 59, 107, 0.08)",
  darkBlue: "#0D2A4D",
  textPrimary: "#2c3e50",
  textSecondary: "#7f8c8d",
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
  info: "#2196f3",
};

const SystemInstances = () => {
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [systemInstances, setSystemInstances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statsData, setStatsData] = useState(null);

  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [statusAction, setStatusAction] = useState(null);
  const [actionInstance, setActionInstance] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Cargar instancias con estadísticas
  const loadInstancias = async (useStats = false, showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      let data;
      if (useStats) {
        data = await getInstanciasConEstadisticas();
        console.log("📊 Instancias con estadísticas:", data);
      } else {
        data = await getInstancias();
      }

      const mapped = data.map((instancia) => ({
        id: instancia.id,
        name: instancia.nombre,
        code: instancia.codigo,
        description: instancia.descripcion || "Sin descripción",
        status: instancia.activa ? "active" : "inactive",
        users: instancia.totalUsuariosReal || instancia.totalUsuarios || 0,
        certifications:
          instancia.totalCertificacionesReal ||
          instancia.totalCertificaciones ||
          0,
        documents: instancia.totalDocumentosReal || 0,
        courses: instancia.totalCursos || 0,
        stats: {
          usuariosReal: instancia.totalUsuariosReal,
          certificacionesReal: instancia.totalCertificacionesReal,
          documentosReal: instancia.totalDocumentosReal,
        },
        colors: {
          primary: instancia.colorPrimario || institutionalColors.primary,
          secondary: instancia.colorSecundario || institutionalColors.secondary,
          accent: instancia.colorAcento || institutionalColors.accent,
        },
        created: instancia.fechaCreacion
          ? new Date(instancia.fechaCreacion).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "-",
        admin: instancia.adminNombre || "No asignado",
        email: instancia.adminEmail || "Sin email",
        rawData: instancia,
      }));

      setSystemInstances(mapped);

      if (showRefreshing) {
        setSnackbar({
          open: true,
          message: useStats
            ? "Estadísticas actualizadas correctamente"
            : "Instancias actualizadas correctamente",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error cargando instancias:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Error al cargar las instancias",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar estadísticas de una instancia específica
  const loadInstanciaStats = async (id) => {
    try {
      const data = await getInstanciaConEstadisticas(id);
      setStatsData(data);
      return data;
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
      setSnackbar({
        open: true,
        message: "Error al cargar estadísticas de la instancia",
        severity: "error",
      });
    }
  };

  // Actualizar contadores de una instancia
  const handleActualizarContadores = async (instance) => {
    try {
      await actualizarContadoresInstancia(instance.id);
      setSnackbar({
        open: true,
        message: `Contadores actualizados para ${instance.name}`,
        severity: "success",
      });
      await loadInstancias(true, false);
    } catch (error) {
      console.error("Error actualizando contadores:", error);
      setSnackbar({
        open: true,
        message: "Error al actualizar contadores",
        severity: "error",
      });
    }
  };

  // Actualizar contadores de todas las instancias
  const handleActualizarTodosLosContadores = async () => {
    try {
      setRefreshing(true);
      const resultado = await actualizarContadoresTodasInstancias();
      setSnackbar({
        open: true,
        message: `Contadores actualizados: ${resultado.exitos} exitosos, ${resultado.fallos} fallidos`,
        severity: resultado.fallos === 0 ? "success" : "warning",
      });
      await loadInstancias(true, false);
    } catch (error) {
      console.error("Error actualizando todos los contadores:", error);
      setSnackbar({
        open: true,
        message: "Error al actualizar contadores de todas las instancias",
        severity: "error",
      });
    } finally {
      setRefreshing(false);
    }
  };


  useEffect(() => {
    loadInstancias(true, false);
  }, []);

  const handleStatusChange = (instance, action) => {
    setActionInstance(instance);
    setStatusAction(action);
    setOpenStatusDialog(true);
  };

  const confirmStatusChange = async () => {
    if (!actionInstance) return;

    try {
      const activa = statusAction === "activate";
      await cambiarEstadoInstancia(actionInstance.id, activa);
      setSnackbar({
        open: true,
        message: `Instancia ${activa ? "activada" : "desactivada"} correctamente`,
        severity: "success",
      });
      await loadInstancias(true, false);
    } catch (error) {
      console.error("Error cambiando estado:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Error al cambiar el estado de la instancia",
        severity: "error",
      });
    }

    setOpenStatusDialog(false);
    setActionInstance(null);
    setStatusAction(null);
  };

  const handleRefresh = () => {
    loadInstancias(true, true);
  };

  const handleCreated = useCallback(() => {
    loadInstancias(true, false);
    setOpenCreateDialog(false);
  }, []);

  const handleUpdated = () => {
    loadInstancias(true, false);
    setOpenEditDialog(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return institutionalColors.success;
      case "inactive":
        return institutionalColors.error;
      case "maintenance":
        return institutionalColors.warning;
      case "draft":
        return "#9e9e9e";
      default:
        return "#757575";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircleIcon fontSize="small" />;
      case "inactive":
        return <ErrorIcon fontSize="small" />;
      case "maintenance":
        return <WarningIcon fontSize="small" />;
      case "draft":
        return <EditIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const instancesWithoutCurrent = systemInstances.filter(
    (instance) => instance.id !== user?.instanciaId,
  );

  const getFilteredByTab = () => {
    switch (selectedTab) {
      case 0:
        return instancesWithoutCurrent;
      case 1:
        return instancesWithoutCurrent.filter((i) => i.status === "active");
      case 2:
        return instancesWithoutCurrent.filter((i) => i.status === "inactive");
      default:
        return instancesWithoutCurrent;
    }
  };

  const filteredInstances = getFilteredByTab().filter((instance) => {
    return (
      instance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.admin.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPage(0);
  };

  const clearSearch = () => setSearchTerm("");

  const getTabTitle = () => {
    switch (selectedTab) {
      case 0:
        return "Todas las Instancias";
      case 1:
        return "Instancias Activas";
      case 2:
        return "Instancias Inactivas";
      default:
        return "Instancias";
    }
  };

  const StatsBadge = ({ instance }) => {
    const hasRealStats =
      instance.stats &&
      (instance.stats.usuariosReal !== instance.users ||
        instance.stats.certificacionesReal !== instance.certifications);

    return (
      <Tooltip
        title={
          <Box>
            <Typography variant="caption" display="block">
              <strong>Estadísticas en tiempo real:</strong>
            </Typography>
            <Typography variant="caption" display="block">
              👥 Usuarios: {instance.stats?.usuariosReal || instance.users}
            </Typography>
            <Typography variant="caption" display="block">
              📜 Certificaciones:{" "}
              {instance.stats?.certificacionesReal || instance.certifications}
            </Typography>
            <Typography variant="caption" display="block">
              📄 Documentos: {instance.stats?.documentosReal || 0}
            </Typography>
            {hasRealStats && (
              <Typography
                variant="caption"
                display="block"
                sx={{ color: institutionalColors.warning, mt: 1 }}
              >
                ⚡ Los datos mostrados son en tiempo real
              </Typography>
            )}
          </Box>
        }
      >
        <Badge
          color="info"
          variant="dot"
          invisible={!hasRealStats}
          sx={{
            "& .MuiBadge-badge": {
              bgcolor: institutionalColors.info,
              right: -2,
              top: 2,
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PersonIcon
              fontSize="small"
              sx={{ color: institutionalColors.textSecondary }}
            />
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ color: institutionalColors.textPrimary }}
            >
              {instance.users}
            </Typography>
          </Box>
        </Badge>
      </Tooltip>
    );
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: institutionalColors.background,
        p: 3,
      }}
    >
      {/* Header simplificado */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
              Super Administración - Instancias del Sistema
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: institutionalColors.textSecondary }}
            >
              Gestión de múltiples áreas, programas y entidades independientes
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Refrescar datos con estadísticas">
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  color: institutionalColors.primary,
                  animation: refreshing ? "spin 1s linear infinite" : "none",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Actualizar todos los contadores">
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                size="small"
                onClick={handleActualizarTodosLosContadores}
                disabled={refreshing}
                sx={{
                  color: institutionalColors.primary,
                  borderColor: institutionalColors.primary,
                  "&:hover": {
                    borderColor: institutionalColors.secondary,
                    bgcolor: institutionalColors.lightBlue,
                  },
                }}
              >
                Sincronizar
              </Button>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              onClick={() => setOpenCreateDialog(true)}
              sx={{
                bgcolor: institutionalColors.primary,
                "&:hover": { bgcolor: institutionalColors.secondary },
              }}
            >
              Nueva Instancia
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Contenido principal */}
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          border: `1px solid #e5e7eb`,
          position: "relative",
        }}
      >
        {(loading || refreshing) && (
          <Fade in={loading || refreshing}>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
              }}
            >
              <LinearProgress
                sx={{
                  height: 2,
                  bgcolor: institutionalColors.lightBlue,
                  "& .MuiLinearProgress-bar": {
                    bgcolor: institutionalColors.primary,
                  },
                }}
              />
            </Box>
          </Fade>
        )}

        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            bgcolor: alpha(institutionalColors.primary, 0.05),
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
            py: 1,
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 40,
              "& .MuiTab-root": {
                minHeight: 40,
                py: 0.5,
                px: 2,
                fontSize: "0.9rem",
              },
              "& .MuiTab-root.Mui-selected": {
                color: institutionalColors.primary,
                fontWeight: "bold",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: institutionalColors.primary,
                height: 2.5,
              },
            }}
          >
            <Tab
              icon={<DomainIcon sx={{ fontSize: 18 }} />}
              label={`Todas (${instancesWithoutCurrent.length})`}
              iconPosition="start"
            />
            <Tab
              icon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
              label={`Activas (${instancesWithoutCurrent.filter((i) => i.status === "active").length})`}
              iconPosition="start"
            />
            <Tab
              icon={<ErrorIcon sx={{ fontSize: 18 }} />}
              label={`Inactivas (${instancesWithoutCurrent.filter((i) => i.status === "inactive").length})`}
              iconPosition="start"
            />
          </Tabs>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <TextField
              size="small"
              placeholder={`Buscar en ${getTabTitle().toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 280 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      fontSize="small"
                      sx={{ color: institutionalColors.textSecondary }}
                    />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={clearSearch} edge="end">
                      <Typography
                        sx={{
                          fontSize: "1.2rem",
                          lineHeight: 1,
                          color: institutionalColors.textSecondary,
                        }}
                      >
                        ×
                      </Typography>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {searchTerm && (
              <Button
                size="small"
                onClick={clearSearch}
                variant="outlined"
                sx={{
                  color: institutionalColors.primary,
                  borderColor: institutionalColors.primary,
                  whiteSpace: "nowrap",
                  "&:hover": {
                    borderColor: institutionalColors.secondary,
                    bgcolor: institutionalColors.lightBlue,
                  },
                }}
              >
                Limpiar
              </Button>
            )}
            <Typography
              variant="body2"
              sx={{
                color: institutionalColors.textSecondary,
                fontWeight: "medium",
                whiteSpace: "nowrap",
                ml: 1,
              }}
            >
              {filteredInstances.length}{" "}
              {filteredInstances.length === 1 ? "instancia" : "instancias"}
            </Typography>
          </Box>
        </Toolbar>

        <TableContainer sx={{ flex: 1 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    color: institutionalColors.primary,
                    fontWeight: "bold",
                    width: "30%",
                  }}
                >
                  Instancia
                </TableCell>
                <TableCell
                  sx={{
                    color: institutionalColors.primary,
                    fontWeight: "bold",
                    width: "15%",
                  }}
                >
                  Estado
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: institutionalColors.primary,
                    fontWeight: "bold",
                    width: "10%",
                  }}
                >
                  Usuarios
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: institutionalColors.primary,
                    fontWeight: "bold",
                    width: "10%",
                  }}
                >
                  Certificaciones
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: institutionalColors.primary,
                    fontWeight: "bold",
                    width: "10%",
                  }}
                >
                  Documentos
                </TableCell>
                <TableCell
                  sx={{
                    color: institutionalColors.primary,
                    fontWeight: "bold",
                    width: "15%",
                  }}
                >
                  Administrador
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: institutionalColors.primary,
                    fontWeight: "bold",
                    width: "10%",
                  }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading &&
                filteredInstances
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((instance) => (
                    <TableRow hover key={instance.id}>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: instance.colors.primary,
                              fontSize: "1rem",
                              fontWeight: "bold",
                            }}
                          >
                            {instance.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              sx={{ color: institutionalColors.textPrimary }}
                            >
                              {instance.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: institutionalColors.textSecondary }}
                            >
                            
                              {instance.description.substring(0, 30)}
                              {instance.description.length > 30 ? "..." : ""}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: institutionalColors.textSecondary }}
                              display="block"
                            >
                              <CalendarIcon
                                sx={{
                                  fontSize: "0.8rem",
                                  verticalAlign: "middle",
                                  mr: 0.5,
                                  color: institutionalColors.textSecondary,
                                }}
                              />
                              Creada: {instance.created}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={
                            instance.status === "active"
                              ? "Activa"
                              : instance.status === "inactive"
                                ? "Inactiva"
                                : instance.status === "maintenance"
                                  ? "Mantenimiento"
                                  : "Borrador"
                          }
                          icon={getStatusIcon(instance.status)}
                          sx={{
                            bgcolor: `${getStatusColor(instance.status)}15`,
                            color: getStatusColor(instance.status),
                            fontWeight: "medium",
                            minWidth: 100,
                          }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <StatsBadge instance={instance} />
                      </TableCell>

                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <VerifiedIcon
                            fontSize="small"
                            sx={{ color: institutionalColors.textSecondary }}
                          />
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            sx={{ color: institutionalColors.textPrimary }}
                          >
                            {instance.certifications}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <DescriptionIcon
                            fontSize="small"
                            sx={{ color: institutionalColors.textSecondary }}
                          />
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            sx={{ color: institutionalColors.textPrimary }}
                          >
                            {instance.documents || 0}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              fontSize: "0.8rem",
                              bgcolor: institutionalColors.primary,
                            }}
                          >
                            {instance.admin.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ color: institutionalColors.textPrimary }}
                            >
                              {instance.admin}
                            </Typography>
                            <Tooltip title={instance.email} placement="top">
                              <Typography
                                variant="caption"
                                sx={{
                                  color: institutionalColors.textSecondary,
                                  display: "block",
                                  maxWidth: 150,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {instance.email}
                              </Typography>
                            </Tooltip>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="center"
                        >
                          <Tooltip title="Ver detalles">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedInstance(instance);
                                setOpenViewDialog(true);
                              }}
                              sx={{ color: institutionalColors.primary }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Actualizar contadores">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleActualizarContadores(instance)
                              }
                              sx={{ color: institutionalColors.warning }}
                            >
                              <RefreshIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedInstance(instance);
                                setOpenEditDialog(true);
                              }}
                              sx={{ color: institutionalColors.primary }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {instance.status === "inactive" ? (
                            <Tooltip title="Activar">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleStatusChange(instance, "activate")
                                }
                                sx={{ color: institutionalColors.success }}
                              >
                                <EnableIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : instance.status === "active" ? (
                            <Tooltip title="Desactivar">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleStatusChange(instance, "deactivate")
                                }
                                sx={{ color: institutionalColors.error }}
                              >
                                <DisableIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : null}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}

              {!loading && filteredInstances.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: "center" }}>
                      {selectedTab === 0 && (
                        <DomainIcon
                          sx={{
                            fontSize: 60,
                            color: institutionalColors.textSecondary,
                            mb: 2,
                          }}
                        />
                      )}
                      {selectedTab === 1 && (
                        <CheckCircleIcon
                          sx={{
                            fontSize: 60,
                            color: institutionalColors.success,
                            mb: 2,
                          }}
                        />
                      )}
                      {selectedTab === 2 && (
                        <ErrorIcon
                          sx={{
                            fontSize: 60,
                            color: institutionalColors.error,
                            mb: 2,
                          }}
                        />
                      )}
                      <Typography
                        variant="h6"
                        sx={{ color: institutionalColors.textPrimary }}
                        gutterBottom
                      >
                        No hay instancias{" "}
                        {selectedTab === 1
                          ? "activas"
                          : selectedTab === 2
                            ? "inactivas"
                            : ""}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: institutionalColors.textSecondary }}
                      >
                        {searchTerm
                          ? "No se encontraron resultados para tu búsqueda"
                          : selectedTab === 0
                            ? "Comienza creando una nueva instancia"
                            : `No hay instancias ${selectedTab === 1 ? "activas" : "inactivas"} en este momento`}
                      </Typography>
                      {!searchTerm && selectedTab === 0 && (
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => setOpenCreateDialog(true)}
                          sx={{ mt: 2, bgcolor: institutionalColors.primary }}
                        >
                          Crear Instancia
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <LinearProgress sx={{ width: 200 }} />
                      <Typography
                        variant="body2"
                        sx={{ color: institutionalColors.textSecondary }}
                      >
                        Cargando instancias...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredInstances.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
          sx={{
            borderTop: "1px solid #e5e7eb",
            "& .MuiTablePagination-select": {
              color: institutionalColors.textPrimary,
            },
            "& .MuiTablePagination-selectLabel": {
              color: institutionalColors.textPrimary,
            },
            "& .MuiTablePagination-displayedRows": {
              color: institutionalColors.textPrimary,
            },
            "& .MuiTablePagination-actions button": {
              color: institutionalColors.primary,
            },
          }}
        />
      </Paper>

      {/* Diálogo de confirmación de estado */}
      <Dialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
      >
        <DialogTitle>
          <Typography sx={{ color: institutionalColors.textPrimary }}>
            {statusAction === "activate" ? "Activar" : "Desactivar"} instancia
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: institutionalColors.textSecondary }}>
            {`¿Estás seguro de que deseas ${statusAction === "activate" ? "activar" : "desactivar"} la instancia "${actionInstance?.name}"?`}
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: alpha(institutionalColors.warning, 0.1),
                borderRadius: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: institutionalColors.warning }}
              >
                {statusAction === "deactivate"
                  ? "Al desactivar la instancia, los usuarios no podrán acceder a ella hasta que sea activada nuevamente."
                  : "Al activar la instancia, los usuarios podrán acceder nuevamente a ella."}
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenStatusDialog(false)}
            sx={{ color: institutionalColors.textSecondary }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmStatusChange}
            variant="contained"
            sx={{
              bgcolor:
                statusAction === "activate"
                  ? institutionalColors.success
                  : institutionalColors.error,
              "&:hover": {
                bgcolor: statusAction === "activate" ? "#3d8b40" : "#d32f2f",
              },
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Diálogos */}
      <CreateInstanceDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onCreated={handleCreated}
      />
      <ViewInstanceDialog
        open={openViewDialog}
        onClose={() => {
          setOpenViewDialog(false);
          setSelectedInstance(null);
          setStatsData(null);
        }}
        instance={selectedInstance}
        statsData={statsData}
        onRefreshStats={loadInstanciaStats}
      />
      <EditInstanceDialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedInstance(null);
        }}
        instance={selectedInstance}
        onUpdated={handleUpdated}
      />
    </Box>
  );
};

export default SystemInstances;
