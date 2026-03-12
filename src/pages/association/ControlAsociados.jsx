import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  InputAdornment,
  Avatar,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Pagination,
  Tabs,
  Tab,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Group as GroupIcon,
  PersonAdd as PersonAddIcon,
  VerifiedUser as VerifiedIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocationOn as LocationIcon,
  PersonRemove as PersonRemoveIcon,
} from "@mui/icons-material";

import asociacionService from "../../services/asociacion";
import AssociateUserDialog from "../../components/asociados/AssociateUserDialog";
import UserDetailsDialog from "../../components/asociados/UserDetailsDialog";
import usuarioService from "../../services/usuarioService";
import AddCertificationModal from "../../components/asociados/AddCertificationModal";
import { getExpedienteByUsuarioId } from "../../services/expediente";
import { getCertificacionesPorExpediente } from "../../services/certificaciones"; // 👈 Método correcto

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
  accent: "#e9e9e9",
  background: "#f4f6f8",
  lightBlue: "rgba(19, 59, 107, 0.08)",
  darkBlue: "#0D2A4D",
  textPrimary: "#111827",
  textSecondary: "#6b7280",
  success: "#059669",
  warning: "#d97706",
  error: "#dc2626",
  info: "#1976d2",
};

const getEstadoColor = (estado) => {
  const colors = {
    CON_PERMISO: institutionalColors.success,
    SIN_PERMISO: institutionalColors.warning,
  };
  return colors[estado] || institutionalColors.textSecondary;
};

const getEstadoIcon = (estado) => {
  if (estado === "CON_PERMISO") return <CheckCircleIcon fontSize="small" />;
  if (estado === "SIN_PERMISO") return <CancelIcon fontSize="small" />;
  return null;
};

const getEstadoTexto = (estado) => {
  const textos = {
    CON_PERMISO: "Con permiso",
    SIN_PERMISO: "Sin permiso",
  };
  return textos[estado] || estado;
};

const mapApiUserToLocal = (apiUser) => {
  const nombreCompleto = apiUser.nombre || "";
  const initials = nombreCompleto
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const normalizeEstado = (estado, permiso) => {
    if (estado === "CON_PERMISO" || estado === "SIN_PERMISO") return estado;
    return permiso ? "CON_PERMISO" : "SIN_PERMISO";
  };

  return {
    id: apiUser.id,
    nombre: apiUser.nombre,
    email: apiUser.email,
    instanciaId: apiUser.instanciaId,
    estado: normalizeEstado(apiUser.estado, apiUser.permisoAsociacion),
    permisoAsociacion: apiUser.permisoAsociacion || false,
    regionNombre: apiUser.regionNombre || "Sin región",
    avatar: initials || "?",
    associationCertifications: [],
    certificacionesCount: 0,
  };
};

const getIdUsuarioFromStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr)?.id || null;
  } catch (e) {
    return null;
  }
};

const UserManagement = () => {
  const [idAsociacion, setIdAsociacion] = useState(null);
  const [loadingAsociacion, setLoadingAsociacion] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("todos");
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);

  // ── Modales de certificación ─────────────────────────────────────
  const [openCertificationDialog, setOpenCertificationDialog] = useState(false);
  const [openBulkCertificationDialog, setOpenBulkCertificationDialog] =
    useState(false);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsersForBulk, setSelectedUsersForBulk] = useState([]);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingCertificaciones, setLoadingCertificaciones] = useState(false);
  const rowsPerPage = 10;
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    user: null,
  });
  const [removingUser, setRemovingUser] = useState(false);

  // ── Función para obtener el número de certificaciones de un usuario ──
  const obtenerCertificacionesCount = async (usuarioId) => {
    try {
      console.log(
        `🔍 Obteniendo certificaciones para usuario ID: ${usuarioId}`,
      );

      // 1. Obtener el expediente del usuario
      const expediente = await getExpedienteByUsuarioId(usuarioId);
      console.log(
        `📄 Expediente obtenido para usuario ${usuarioId}:`,
        expediente,
      );

      if (!expediente || !expediente.id) {
        console.log(`⚠️ No se encontró expediente para usuario ${usuarioId}`);
        return 0;
      }

      // 2. Obtener las certificaciones del expediente usando el método correcto
      console.log(
        `🔍 Buscando certificaciones para expediente ID: ${expediente.id}`,
      );
      const certificaciones = await getCertificacionesPorExpediente(
        expediente.id,
      );
      console.log(
        `📋 Certificaciones para usuario ${usuarioId}:`,
        certificaciones,
      );

      return certificaciones?.length || 0;
    } catch (error) {
      console.error(
        `❌ Error al obtener certificaciones para usuario ${usuarioId}:`,
        error,
      );
      return 0;
    }
  };

  // ── Función para cargar todas las certificaciones de todos los usuarios ──
  const cargarTodasLasCertificaciones = async (usuarios) => {
    setLoadingCertificaciones(true);
    try {
      const usuariosConCertificaciones = await Promise.all(
        usuarios.map(async (usuario) => {
          const count = await obtenerCertificacionesCount(usuario.id);
          return {
            ...usuario,
            certificacionesCount: count,
          };
        }),
      );
      setUsers(usuariosConCertificaciones);
    } catch (error) {
      console.error("❌ Error al cargar certificaciones:", error);
    } finally {
      setLoadingCertificaciones(false);
    }
  };

  // ── Cargar asociación ────────────────────────────────────────────
  useEffect(() => {
    const cargarAsociacion = async () => {
      setLoadingAsociacion(true);
      try {
        const idUsuario = getIdUsuarioFromStorage();
        if (!idUsuario) {
          setSnackbar({
            open: true,
            message:
              "No se encontró sesión activa. Por favor inicia sesión nuevamente.",
            severity: "error",
          });
          return;
        }
        const asociacion = await asociacionService.findByUsuarioId(idUsuario);
        setIdAsociacion(asociacion.idAsociacion);
      } catch (error) {
        setSnackbar({
          open: true,
          message:
            "No se pudo obtener la asociación del usuario. Verifica tu sesión.",
          severity: "error",
        });
      } finally {
        setLoadingAsociacion(false);
      }
    };
    cargarAsociacion();
  }, []);

  // ── Cargar usuarios ──────────────────────────────────────────────
  const cargarUsuarios = useCallback(async () => {
    if (!idAsociacion) return;
    setLoadingUsers(true);
    try {
      const data =
        await usuarioService.findUsuariosDeMiAsociacion(idAsociacion);
      console.log("📥 Datos recibidos del backend:", data);
      const usuariosMapeados = data.map(mapApiUserToLocal);
      console.log("🔄 Usuarios mapeados:", usuariosMapeados);

      // Después de mapear los usuarios, cargamos sus certificaciones
      setUsers(usuariosMapeados);
      await cargarTodasLasCertificaciones(usuariosMapeados);
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error?.error || "Error al cargar los usuarios de la asociación",
        severity: "error",
      });
    } finally {
      setLoadingUsers(false);
    }
  }, [idAsociacion]);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  useEffect(() => {
    setSelectedUserIds(new Set());
  }, [selectedTab, searchTerm]);

  // ── Estadísticas ─────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: users.length,
      conPermiso: users.filter((u) => u.estado === "CON_PERMISO").length,
      sinPermiso: users.filter((u) => u.estado === "SIN_PERMISO").length,
      totalCertificaciones: users.reduce(
        (acc, u) => acc + (u.certificacionesCount || 0),
        0,
      ),
    }),
    [users],
  );

  // ── Filtrado ─────────────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    let filtrados = users;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtrados = filtrados.filter(
        (u) =>
          u.nombre?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term) ||
          u.regionNombre?.toLowerCase().includes(term),
      );
    }
    if (selectedTab === "con-permisos")
      filtrados = filtrados.filter((u) => u.estado === "CON_PERMISO");
    else if (selectedTab === "sin-permisos")
      filtrados = filtrados.filter((u) => u.estado === "SIN_PERMISO");
    return [...filtrados].sort((a, b) =>
      (a.nombre || "").localeCompare(b.nombre || ""),
    );
  }, [users, searchTerm, selectedTab]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, page]);

  // ── Selección múltiple ───────────────────────────────────────────
  const handleSelectAll = (event) => {
    setSelectedUserIds(
      event.target.checked
        ? new Set(paginatedUsers.map((u) => u.id))
        : new Set(),
    );
  };

  const handleSelectUser = (userId) => {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(userId) ? newSet.delete(userId) : newSet.add(userId);
      return newSet;
    });
  };

  // ── Certificación masiva ─────────────────────────────────────────
  const handleBulkCertification = () => {
    const selectedUsersList = users.filter((u) => selectedUserIds.has(u.id));
    const sinPermiso = selectedUsersList.filter(
      (u) => u.estado !== "CON_PERMISO",
    );

    if (sinPermiso.length > 0) {
      setSnackbar({
        open: true,
        message: `${sinPermiso.length} usuario(s) seleccionado(s) no tienen permiso para certificaciones.`,
        severity: "warning",
      });
      return;
    }
    if (selectedUsersList.length === 0) {
      setSnackbar({
        open: true,
        message: "Selecciona al menos un usuario para asignar certificación.",
        severity: "warning",
      });
      return;
    }
    console.log(
      "📋 Usuarios seleccionados para certificación masiva:",
      selectedUsersList,
    );
    setSelectedUsersForBulk(selectedUsersList);
    setOpenBulkCertificationDialog(true);
  };

  // ── Callbacks de guardado exitoso ────────────────────────────────

  // handleCertSaved — modo individual (ahora recibe array de 1)
  const handleCertSaved = (resultados) => {
    resultados.forEach(({ usuario, cert }) => {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === usuario.id
            ? {
                ...u,
                associationCertifications: [
                  ...(u.associationCertifications || []),
                  cert,
                ],
                certificacionesCount: (u.certificacionesCount || 0) + 1,
              }
            : u,
        ),
      );
    });
    setSnackbar({
      open: true,
      message: `Certificación agregada correctamente.`,
      severity: "success",
    });
  };

  const handleBulkCertSaved = (resultados) => {
    resultados.forEach(({ usuario, cert }) => {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === usuario.id
            ? {
                ...u,
                associationCertifications: [
                  ...(u.associationCertifications || []),
                  cert,
                ],
                certificacionesCount: (u.certificacionesCount || 0) + 1,
              }
            : u,
        ),
      );
    });
    setSnackbar({
      open: true,
      message: `Certificación asignada a ${resultados.length} usuario(s).`,
      severity: "success",
    });
    setSelectedUserIds(new Set());
  };

  // ── Handlers existentes ──────────────────────────────────────────
  const handleAddExistingUser = () => setOpenAddUserDialog(true);

  const handleAddUserToAssociation = (user) => {
    const nuevoUsuario = mapApiUserToLocal(user);
    console.log("➕ Usuario agregado a la asociación:", nuevoUsuario);

    setUsers((prev) => {
      if (prev.some((u) => u.id === nuevoUsuario.id)) return prev;
      return [...prev, nuevoUsuario];
    });
    setOpenAddUserDialog(false);
    setSnackbar({
      open: true,
      message: `Usuario ${nuevoUsuario.nombre} agregado a la asociación correctamente.`,
      severity: "success",
    });
  };

  const handleConfirmRemoveUser = (user) =>
    setConfirmDialog({ open: true, user });

  const handleRemoveUserFromAssociation = async () => {
    const user = confirmDialog.user;
    if (!user) return;
    setRemovingUser(true);
    try {
      await usuarioService.quitarAsociacionUsuario(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setSelectedUserIds((prev) => {
        const s = new Set(prev);
        s.delete(user.id);
        return s;
      });
      setSnackbar({
        open: true,
        message: `${user.nombre} fue removido de la asociación correctamente.`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.error || "Error al quitar el usuario de la asociación.",
        severity: "error",
      });
    } finally {
      setRemovingUser(false);
      setConfirmDialog({ open: false, user: null });
    }
  };

  const handleAddCertification = (user) => {
    if (user.estado !== "CON_PERMISO") {
      setSnackbar({
        open: true,
        message:
          "No puedes subir certificaciones. Este usuario no tiene permiso.",
        severity: "warning",
      });
      return;
    }

    console.log("🎯 Abriendo modal de certificación para usuario:", user);
    console.log("   - ID:", user.id);
    console.log("   - Nombre:", user.nombre);
    console.log("   - Email:", user.email);
    console.log("   - Instancia ID:", user.instanciaId);
    console.log("   - Estado:", user.estado);
    console.log("   - Certificaciones actuales:", user.certificacionesCount);

    setSelectedUser(user);
    setSelectedCertification(null);
    setOpenCertificationDialog(true);
  };

  const handleEditCertification = (user, certification) => {
    if (user.estado !== "CON_PERMISO") {
      setSnackbar({
        open: true,
        message:
          "No puedes editar certificaciones. Este usuario no tiene permiso.",
        severity: "warning",
      });
      return;
    }
    setSelectedUser(user);
    setSelectedCertification(certification);
    setOpenCertificationDialog(true);
  };

  const handleDeleteCertification = async (userId, certificationId) => {
    const user = users.find((u) => u.id === userId);
    if (user?.estado !== "CON_PERMISO") {
      setSnackbar({
        open: true,
        message:
          "No puedes eliminar certificaciones. Este usuario no tiene permiso.",
        severity: "warning",
      });
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                associationCertifications: u.associationCertifications.filter(
                  (c) => c.id !== certificationId,
                ),
                certificacionesCount: Math.max(
                  0,
                  (u.certificacionesCount || 0) - 1,
                ),
              }
            : u,
        ),
      );
      setSnackbar({
        open: true,
        message: "Certificación eliminada correctamente",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error al eliminar la certificación",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!filteredUsers.length) return;
    const data = filteredUsers.map((u) => ({
      Nombre: u.nombre || "",
      Email: u.email || "",
      Región: u.regionNombre || "",
      Estado: u.estado === "CON_PERMISO" ? "Con permiso" : "Sin permiso",
      "Permiso dispositivo": u.permisoAsociacion ? "Sí" : "No",
      Certificaciones: u.certificacionesCount || 0,
    }));
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(","));
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute(
      "download",
      `asociados_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSnackbar({
      open: true,
      message: "Datos exportados correctamente",
      severity: "success",
    });
  };

  const tabs = [
    { value: "todos", label: `TODOS (${stats.total})`, icon: <GroupIcon /> },
    {
      value: "con-permisos",
      label: `CON PERMISO (${stats.conPermiso})`,
      icon: <CheckCircleIcon />,
    },
    {
      value: "sin-permisos",
      label: `SIN PERMISO (${stats.sinPermiso})`,
      icon: <CancelIcon />,
    },
  ];

  const isInitializing = loadingAsociacion;

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        bgcolor: institutionalColors.background,
        p: 2,
      }}
    >
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Diálogo confirmación quitar usuario */}
      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          !removingUser && setConfirmDialog({ open: false, user: null })
        }
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            color: institutionalColors.error,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <PersonRemoveIcon /> Quitar de la asociación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas quitar a{" "}
            <strong>{confirmDialog.user?.nombre}</strong> de la asociación?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setConfirmDialog({ open: false, user: null })}
            disabled={removingUser}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleRemoveUserFromAssociation}
            disabled={removingUser}
            variant="contained"
            color="error"
            startIcon={
              removingUser ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <PersonRemoveIcon />
              )
            }
          >
            {removingUser ? "Quitando..." : "Quitar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <Paper
        elevation={0}
        sx={{ p: 3, bgcolor: "background.paper", border: "1px solid #e5e7eb" }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              sx={{
                color: institutionalColors.primary,
                fontWeight: "bold",
                mb: 0.5,
              }}
            >
              Control de Asociados
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: institutionalColors.textSecondary }}
            >
              Gestión de usuarios asociados, permisos y certificaciones
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: institutionalColors.primary, mt: 1 }}
            >
              Total certificaciones: {stats.totalCertificaciones}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="flex-end"
              flexWrap="wrap"
            >
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExportCSV}
                disabled={
                  loading ||
                  loadingUsers ||
                  loadingCertificaciones ||
                  isInitializing ||
                  filteredUsers.length === 0
                }
                sx={{
                  borderColor: institutionalColors.primary,
                  color: institutionalColors.primary,
                  "&:hover": {
                    borderColor: institutionalColors.secondary,
                    bgcolor: institutionalColors.lightBlue,
                  },
                }}
              >
                Exportar CSV
              </Button>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={handleAddExistingUser}
                disabled={
                  loading ||
                  loadingUsers ||
                  loadingCertificaciones ||
                  isInitializing
                }
                sx={{
                  bgcolor: institutionalColors.primary,
                  "&:hover": { bgcolor: institutionalColors.secondary },
                }}
              >
                Agregar Asociado
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Búsqueda */}
      <Paper elevation={1} sx={{ p: 2, border: "1px solid #e5e7eb" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar asociados por nombre, email o región..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: institutionalColors.textSecondary }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm("")}>
                  <CloseIcon
                    sx={{ color: institutionalColors.textSecondary }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Acciones masivas */}
      {selectedUserIds.size > 0 && !loadingUsers && !isInitializing && (
        <Paper
          elevation={2}
          sx={{
            p: 1.5,
            bgcolor: institutionalColors.lightBlue,
            border: `1px solid ${institutionalColors.primary}30`,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography
              variant="body2"
              sx={{ color: institutionalColors.primary }}
            >
              <strong>{selectedUserIds.size}</strong> usuario(s) seleccionado(s)
            </Typography>
            <Button
              size="small"
              variant="contained"
              startIcon={<VerifiedIcon />}
              onClick={handleBulkCertification}
              disabled={loading || loadingCertificaciones}
              sx={{
                bgcolor: institutionalColors.primary,
                "&:hover": { bgcolor: institutionalColors.secondary },
              }}
            >
              Asignar certificación
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setSelectedUserIds(new Set())}
              disabled={loading || loadingCertificaciones}
              sx={{
                borderColor: institutionalColors.textSecondary,
                color: institutionalColors.textSecondary,
              }}
            >
              Limpiar selección
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Tabla */}
      <Paper
        elevation={1}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={(e, v) => {
            setSelectedTab(v);
            setPage(1);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            "& .MuiTab-root.Mui-selected": {
              color:
                selectedTab === "con-permisos"
                  ? institutionalColors.success
                  : selectedTab === "sin-permisos"
                    ? institutionalColors.warning
                    : institutionalColors.primary,
            },
            "& .MuiTabs-indicator": {
              backgroundColor:
                selectedTab === "con-permisos"
                  ? institutionalColors.success
                  : selectedTab === "sin-permisos"
                    ? institutionalColors.warning
                    : institutionalColors.primary,
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              iconPosition="start"
              label={tab.label}
              sx={{ minHeight: 48 }}
            />
          ))}
        </Tabs>

        <TableContainer sx={{ flex: 1 }}>
          {isInitializing || loadingUsers || loadingCertificaciones ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: 300,
                gap: 2,
              }}
            >
              <CircularProgress sx={{ color: institutionalColors.primary }} />
              <Typography
                variant="body2"
                sx={{ color: institutionalColors.textSecondary }}
              >
                {isInitializing
                  ? "Cargando información de la asociación..."
                  : loadingUsers
                    ? "Cargando usuarios asociados..."
                    : "Cargando certificaciones..."}
              </Typography>
            </Box>
          ) : filteredUsers.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 8,
                flex: 1,
              }}
            >
              <GroupIcon
                sx={{
                  fontSize: 64,
                  color: institutionalColors.textSecondary,
                  mb: 2,
                }}
              />
              <Typography
                variant="h6"
                sx={{ color: institutionalColors.textSecondary }}
                gutterBottom
              >
                No se encontraron usuarios
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: institutionalColors.textSecondary, mb: 3 }}
              >
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : selectedTab === "todos"
                    ? "No hay usuarios en la asociación"
                    : selectedTab === "con-permisos"
                      ? "No hay usuarios con permiso"
                      : "No hay usuarios sin permiso"}
              </Typography>
              <Button
                variant="contained"
                onClick={handleAddExistingUser}
                sx={{
                  bgcolor: institutionalColors.primary,
                  "&:hover": { bgcolor: institutionalColors.secondary },
                }}
              >
                Agregar Usuario
              </Button>
            </Box>
          ) : (
            <Table stickyHeader size="medium">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={
                        paginatedUsers.length > 0 &&
                        selectedUserIds.size === paginatedUsers.length
                      }
                      indeterminate={
                        selectedUserIds.size > 0 &&
                        selectedUserIds.size < paginatedUsers.length
                      }
                      onChange={handleSelectAll}
                      sx={{ color: institutionalColors.primary }}
                    />
                  </TableCell>
                  {[
                    "Usuario",
                    "Email",
                    "Región",
                    "Estado",
                    "Permiso dispositivo",
                    "Certificaciones",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontWeight: "bold",
                        color: institutionalColors.primary,
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: institutionalColors.primary,
                    }}
                    align="center"
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUserIds.has(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        disabled={user.estado !== "CON_PERMISO"}
                        sx={{
                          color:
                            user.estado === "CON_PERMISO"
                              ? institutionalColors.primary
                              : institutionalColors.textSecondary,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: institutionalColors.primary,
                            fontWeight: "bold",
                            color: "white",
                          }}
                        >
                          {user.avatar}
                        </Avatar>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          sx={{ color: institutionalColors.textPrimary }}
                        >
                          {user.nombre}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: institutionalColors.textPrimary }}
                      >
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocationIcon
                          fontSize="small"
                          sx={{ color: institutionalColors.textSecondary }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: institutionalColors.textPrimary }}
                        >
                          {user.regionNombre}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getEstadoIcon(user.estado)}
                        label={getEstadoTexto(user.estado)}
                        size="small"
                        sx={{
                          bgcolor: `${getEstadoColor(user.estado)}15`,
                          color: getEstadoColor(user.estado),
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.permisoAsociacion ? "Sí" : "No"}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: user.permisoAsociacion
                            ? institutionalColors.success
                            : institutionalColors.textSecondary,
                          color: user.permisoAsociacion
                            ? institutionalColors.success
                            : institutionalColors.textSecondary,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ color: institutionalColors.primary }}
                      >
                        {user.certificacionesCount || 0}
                      </Typography>
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
                              setSelectedUser(user);
                              setOpenDetailsDialog(true);
                            }}
                            sx={{ color: institutionalColors.primary }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={
                            user.estado === "CON_PERMISO"
                              ? "Gestionar certificaciones"
                              : "Sin permiso para gestionar certificaciones"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => {
                                if (user.estado === "CON_PERMISO")
                                  handleAddCertification(user);
                                else
                                  setSnackbar({
                                    open: true,
                                    message:
                                      "No puedes gestionar certificaciones. El usuario no tiene permiso.",
                                    severity: "warning",
                                  });
                              }}
                              sx={{
                                color:
                                  user.estado === "CON_PERMISO"
                                    ? institutionalColors.success
                                    : institutionalColors.textSecondary,
                              }}
                            >
                              <VerifiedIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Quitar de la asociación">
                          <IconButton
                            size="small"
                            onClick={() => handleConfirmRemoveUser(user)}
                            sx={{
                              color: institutionalColors.error,
                              "&:hover": {
                                bgcolor: `${institutionalColors.error}15`,
                              },
                            }}
                          >
                            <PersonRemoveIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {filteredUsers.length > 0 &&
          !loadingUsers &&
          !isInitializing &&
          !loadingCertificaciones && (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                p: 2,
                borderTop: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: institutionalColors.textSecondary }}
              >
                Mostrando {(page - 1) * rowsPerPage + 1} –{" "}
                {Math.min(page * rowsPerPage, filteredUsers.length)} de{" "}
                {filteredUsers.length} usuarios
              </Typography>
              <Pagination
                count={Math.ceil(filteredUsers.length / rowsPerPage)}
                page={page}
                onChange={(e, v) => setPage(v)}
                color="primary"
                size="small"
                sx={{
                  "& .MuiPaginationItem-root.Mui-selected": {
                    bgcolor: institutionalColors.primary,
                    color: "white",
                    "&:hover": { bgcolor: institutionalColors.secondary },
                  },
                }}
              />
            </Stack>
          )}
      </Paper>

      {/* ── Diálogos ─────────────────────────────────────────────── */}

      <AssociateUserDialog
        open={openAddUserDialog}
        onClose={() => setOpenAddUserDialog(false)}
        onAddUser={handleAddUserToAssociation}
      />

      <AddCertificationModal
        open={openCertificationDialog}
        onClose={() => {
          console.log("🔒 Cerrando modal de certificación individual");
          setOpenCertificationDialog(false);
          setSelectedCertification(null);
        }}
        onSaved={handleCertSaved}
        selectedUser={selectedUser}
      />

      <AddCertificationModal
        open={openBulkCertificationDialog}
        onClose={() => {
          setOpenBulkCertificationDialog(false);
          setSelectedUsersForBulk([]);
        }}
        onSaved={handleBulkCertSaved}
        selectedUser={selectedUsersForBulk[0] ?? null}
        selectedUsers={selectedUsersForBulk} // ← NUEVO
      />

      <UserDetailsDialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        user={selectedUser}
        onEditCertification={handleEditCertification}
        onDeleteCertification={handleDeleteCertification}
      />
    </Box>
  );
};

export default UserManagement;
