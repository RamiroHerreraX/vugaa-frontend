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
  Badge,
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
import { parseISO, differenceInYears } from "date-fns";

import asociacionService from "../../services/asociacion";
import AssociateUserDialog from "../../components/asociados/AssociateUserDialog";
import AddCertificationDialog from "../../components/asociados/AddCertificationDialog";
import UserDetailsDialog from "../../components/asociados/UserDetailsDialog";
import DocumentsDialog from "../../components/asociados/DocumentsDialog";
import UploadDocumentsDialog from "../../components/asociados/UploadDocumentsDialog";
import usuarioService from "../../services/usuarioService";

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

  return {
    id: apiUser.id,
    nombre: apiUser.nombre,
    email: apiUser.email,
    estado: apiUser.estado,
    permisoAsociacion: apiUser.permisoAsociacion || false,
    regionNombre: apiUser.regionNombre || "Sin región",
    avatar: initials || "?",
    // Mantenemos la estructura para certificaciones aunque venga vacía del backend
    associationCertifications: [],
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
  const [openCertificationDialog, setOpenCertificationDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const rowsPerPage = 10;
  const [users, setUsers] = useState([]);

  // Estado diálogo confirmación quitar usuario
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    user: null,
  });
  const [removingUser, setRemovingUser] = useState(false);

  const [newCertification, setNewCertification] = useState({
    name: "",
    type: "operativa",
    hoursValue: "",
  });
  const [certificationFiles, setCertificationFiles] = useState([]);
  const [certificationUploading, setCertificationUploading] = useState(false);
  const [certificationUploadProgress, setCertificationUploadProgress] = useState(0);
  const [uploadFiles, setUploadFiles] = useState([]);

  // Mantenemos las definiciones necesarias para los diálogos
  const certificationTypes = [
    { value: "etica_cumplimiento", label: "Formación ética y cumplimiento", color: "#455a64" },
    { value: "actualizacion_aduanera", label: "Actualización técnica aduanera", color: "#1565c0" },
    { value: "operativa", label: "Operativa", color: institutionalColors.primary },
    { value: "fiscal", label: "Fiscal", color: institutionalColors.success },
    { value: "legal", label: "Legal", color: "#9c27b0" },
    { value: "administrativa", label: "Administrativa", color: institutionalColors.warning },
    { value: "seguridad", label: "Seguridad", color: institutionalColors.error },
  ];

  const recognitionLevels = [
    { value: 1, label: "Nivel I", color: "#6b7280", icon: "I", minCertifications: 1, maxCertifications: 3 },
    { value: 2, label: "Nivel II", color: "#4b5563", icon: "II", minCertifications: 4, maxCertifications: 7 },
    { value: 3, label: "Nivel III", color: "#1f2937", icon: "III", minCertifications: 8, maxCertifications: Infinity },
  ];

  const getRoleColorStatic = (role) => {
    const colors = {
      admin: institutionalColors.success,
      comite: institutionalColors.primary,
      agente: "#526F78",
      profesionista: "#2e7d32",
      empresario: "#ed6c02",
    };
    return colors[role] || institutionalColors.textSecondary;
  };

  // Funciones necesarias para los diálogos
  const getRecognitionLevel = (user) => 1; // Valor por defecto
  const getRecognitionLevelInfo = (level) => recognitionLevels[0];
  const getMembershipDuration = () => "N/A";
  const getFileIcon = (fileType) => null;
  const formatFileSize = (bytes) => "0 Bytes";
  const getRoleColor = (role) => getRoleColorStatic(role);
  const getCertificationColor = (type) =>
    certificationTypes.find((t) => t.value === type)?.color || institutionalColors.textSecondary;

  // Obtener idAsociacion
  useEffect(() => {
    const cargarAsociacion = async () => {
      setLoadingAsociacion(true);
      try {
        const idUsuario = getIdUsuarioFromStorage();
        if (!idUsuario) {
          setSnackbar({
            open: true,
            message: "No se encontró sesión activa. Por favor inicia sesión nuevamente.",
            severity: "error",
          });
          return;
        }
        const asociacion = await asociacionService.findByUsuarioId(idUsuario);
        setIdAsociacion(asociacion.idAsociacion);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "No se pudo obtener la asociación del usuario. Verifica tu sesión.",
          severity: "error",
        });
      } finally {
        setLoadingAsociacion(false);
      }
    };
    cargarAsociacion();
  }, []);

  // Cargar usuarios
  const cargarUsuarios = useCallback(async () => {
    if (!idAsociacion) return;
    setLoadingUsers(true);

    try {
      const data = await usuarioService.findUsuariosDeMiAsociacion(idAsociacion);
      const usuariosMapeados = data.map(mapApiUserToLocal);
      setUsers(usuariosMapeados);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.error || "Error al cargar los usuarios de la asociación",
        severity: "error",
      });
    } finally {
      setLoadingUsers(false);
    }
  }, [idAsociacion]);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = users.length;
    const conPermiso = users.filter((u) => u.estado === "CON_PERMISO").length;
    const sinPermiso = users.filter((u) => u.estado === "SIN_PERMISO").length;
    return { total, conPermiso, sinPermiso };
  }, [users]);

  // Filtrar usuarios
  const filteredUsers = useMemo(() => {
    let filtrados = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtrados = filtrados.filter(
        (u) =>
          u.nombre?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term) ||
          u.regionNombre?.toLowerCase().includes(term)
      );
    }

    if (selectedTab === "con-permisos") {
      filtrados = filtrados.filter((u) => u.estado === "CON_PERMISO");
    } else if (selectedTab === "sin-permisos") {
      filtrados = filtrados.filter((u) => u.estado === "SIN_PERMISO");
    }

    return [...filtrados].sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
  }, [users, searchTerm, selectedTab]);

  // Paginación
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, page]);

  // Handlers
  const handleAddExistingUser = () => setOpenAddUserDialog(true);

  const handleAddUserToAssociation = (user) => {
    const nuevoUsuario = mapApiUserToLocal(user);
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

  const handleConfirmRemoveUser = (user) => {
    setConfirmDialog({ open: true, user });
  };

  const handleRemoveUserFromAssociation = async () => {
    const user = confirmDialog.user;
    if (!user) return;

    setRemovingUser(true);
    try {
      await usuarioService.quitarAsociacionUsuario(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
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

  const handleAddCertification = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user.estado !== "CON_PERMISO") {
      setSnackbar({
        open: true,
        message: "No puedes subir certificaciones. Este usuario no tiene permiso.",
        severity: "warning",
      });
      return;
    }
    setSelectedUser(user);
    setNewCertification({ name: "", type: "operativa", hoursValue: "" });
    setCertificationFiles([]);
    setOpenCertificationDialog(true);
  };

  const handleCertificationFileSelect = (e) =>
    setCertificationFiles((p) => [...p, ...Array.from(e.target.files)]);

  const handleRemoveCertificationFile = (i) =>
    setCertificationFiles((p) => p.filter((_, idx) => idx !== i));

  const handleSaveCertification = async () => {
    if (!newCertification.name) {
      setSnackbar({
        open: true,
        message: "El nombre de la certificación es obligatorio",
        severity: "warning",
      });
      return;
    }
    
    setLoading(true);
    try {
      // Simulamos la subida de archivos
      let documents = [];
      if (certificationFiles.length > 0) {
        setCertificationUploading(true);
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((r) => setTimeout(r, 100));
          setCertificationUploadProgress(i);
        }
        documents = certificationFiles.map((file, idx) => ({
          id: Date.now() + idx,
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
          size: file.size,
          uploadDate: new Date().toISOString(),
          uploadedBy: "admin@asociacion.com",
        }));
        setCertificationUploading(false);
      }

      const certification = {
        id: Date.now(),
        ...newCertification,
        hoursValue: newCertification.hoursValue ? parseInt(newCertification.hoursValue) : 0,
        status: "active",
        documents,
      };

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                associationCertifications: [...(u.associationCertifications || []), certification],
              }
            : u
        )
      );

      setOpenCertificationDialog(false);
      setCertificationFiles([]);
      setSnackbar({
        open: true,
        message: documents.length > 0
          ? `Certificación agregada con ${documents.length} documento(s)`
          : "Certificación agregada correctamente",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error al guardar la certificación",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setCertificationUploading(false);
    }
  };

  const handleEditCertification = (user, certification) => {
    if (user.estado !== "CON_PERMISO") {
      setSnackbar({
        open: true,
        message: "No puedes editar certificaciones. Este usuario no tiene permiso.",
        severity: "warning",
      });
      return;
    }
    setSelectedUser(user);
    setSelectedCertification(certification);
    setNewCertification({
      name: certification.name,
      type: certification.type,
      hoursValue: certification.hoursValue || "",
    });
    setCertificationFiles([]);
    setOpenCertificationDialog(true);
  };

  const handleDeleteCertification = async (userId, certificationId) => {
    const user = users.find((u) => u.id === userId);
    if (user.estado !== "CON_PERMISO") {
      setSnackbar({
        open: true,
        message: "No puedes eliminar certificaciones. Este usuario no tiene permiso.",
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
                  (c) => c.id !== certificationId
                ),
              }
            : u
        )
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

  const handleUploadDocuments = (user, certification) => {
    if (user.estado !== "CON_PERMISO") {
      setSnackbar({
        open: true,
        message: "No puedes subir documentos. El usuario no tiene permiso.",
        severity: "warning",
      });
      return;
    }
    setSelectedUser(user);
    setSelectedCertification(certification);
    setUploadFiles([]);
    setUploadProgress(0);
    setOpenUploadDialog(true);
  };

  const handleFileSelect = (e) =>
    setUploadFiles((p) => [...p, ...Array.from(e.target.files)]);

  const handleRemoveFile = (i) =>
    setUploadFiles((p) => p.filter((_, idx) => idx !== i));

  const handleUploadFiles = async () => {
    if (uploadFiles.length === 0) {
      setSnackbar({
        open: true,
        message: "Selecciona al menos un archivo para subir",
        severity: "warning",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((r) => setTimeout(r, 200));
        setUploadProgress(i);
      }

      const newDocuments = uploadFiles.map((file, idx) => ({
        id: Date.now() + idx,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        uploadedBy: "admin@asociacion.com",
      }));

      setUsers((prev) =>
        prev.map((user) =>
          user.id !== selectedUser.id
            ? user
            : {
                ...user,
                associationCertifications: user.associationCertifications.map((cert) =>
                  cert.id === selectedCertification.id
                    ? { ...cert, documents: [...(cert.documents || []), ...newDocuments] }
                    : cert
                ),
              }
        )
      );

      setSnackbar({
        open: true,
        message: `${uploadFiles.length} archivo(s) subido(s) correctamente`,
        severity: "success",
      });
      setOpenUploadDialog(false);
    } catch {
      setSnackbar({
        open: true,
        message: "Error al subir los archivos",
        severity: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleViewDocuments = (user, certification) => {
    setSelectedUser(user);
    setSelectedCertification(certification);
    setOpenDocumentDialog(true);
  };

  const handleDeleteDocument = async (documentId) => {
    if (!selectedUser || !selectedCertification) return;
    
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setUsers((prev) =>
        prev.map((user) =>
          user.id !== selectedUser.id
            ? user
            : {
                ...user,
                associationCertifications: user.associationCertifications.map((cert) =>
                  cert.id === selectedCertification.id
                    ? { ...cert, documents: cert.documents.filter((doc) => doc.id !== documentId) }
                    : cert
                ),
              }
        )
      );
      setSelectedCertification((prev) => ({
        ...prev,
        documents: prev.documents.filter((doc) => doc.id !== documentId),
      }));
      setSnackbar({
        open: true,
        message: "Documento eliminado correctamente",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error al eliminar el documento",
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
      Certificaciones: u.associationCertifications?.length || 0,
    }));

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(","));
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `asociados_${new Date().toISOString().split("T")[0]}.csv`);
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

      {/* Diálogo de confirmación quitar usuario */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => !removingUser && setConfirmDialog({ open: false, user: null })}
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
            startIcon={removingUser ? <CircularProgress size={16} color="inherit" /> : <PersonRemoveIcon />}
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
                disabled={loading || loadingUsers || isInitializing || filteredUsers.length === 0}
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
                disabled={loading || loadingUsers || isInitializing}
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
                  <CloseIcon sx={{ color: institutionalColors.textSecondary }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>

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
          {isInitializing || loadingUsers ? (
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
              <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
                {isInitializing ? "Cargando información de la asociación..." : "Cargando usuarios asociados..."}
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
                  <TableCell sx={{ fontWeight: "bold", color: institutionalColors.primary }}>
                    Usuario
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: institutionalColors.primary }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: institutionalColors.primary }}>
                    Región
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: institutionalColors.primary }}>
                    Estado
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: institutionalColors.primary }}>
                    Permiso dispositivo
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: institutionalColors.primary }}>
                    Certificaciones
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", color: institutionalColors.primary }}
                    align="center"
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} hover>
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
                      <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocationIcon
                          fontSize="small"
                          sx={{ color: institutionalColors.textSecondary }}
                        />
                        <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
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
                      <Typography variant="body1" fontWeight="bold">
                        {user.associationCertifications?.length || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
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
                                if (user.estado === "CON_PERMISO") {
                                  handleAddCertification(user.id);
                                } else {
                                  setSnackbar({
                                    open: true,
                                    message: "No puedes gestionar certificaciones. El usuario no tiene permiso.",
                                    severity: "warning",
                                  });
                                }
                              }}
                              sx={{
                                color: user.estado === "CON_PERMISO"
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

        {filteredUsers.length > 0 && !loadingUsers && !isInitializing && (
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
            <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
              Mostrando {(page - 1) * rowsPerPage + 1} -{" "}
              {Math.min(page * rowsPerPage, filteredUsers.length)} de {filteredUsers.length} usuarios
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

      <AssociateUserDialog
        open={openAddUserDialog}
        onClose={() => setOpenAddUserDialog(false)}
        onAddUser={handleAddUserToAssociation}
      />

      <AddCertificationDialog
        open={openCertificationDialog}
        onClose={() => {
          setOpenCertificationDialog(false);
          setSelectedCertification(null);
          setCertificationFiles([]);
        }}
        selectedUser={selectedUser}
        selectedCertification={selectedCertification}
        newCertification={newCertification}
        onCertificationChange={setNewCertification}
        certificationFiles={certificationFiles}
        onFileSelect={handleCertificationFileSelect}
        onRemoveFile={handleRemoveCertificationFile}
        onSave={handleSaveCertification}
        loading={loading}
        certificationUploading={certificationUploading}
        certificationUploadProgress={certificationUploadProgress}
        certificationTypes={certificationTypes}
        getFileIcon={getFileIcon}
        formatFileSize={formatFileSize}
      />

      <UserDetailsDialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        selectedUser={selectedUser}
        getRecognitionLevel={getRecognitionLevel}
        getRecognitionLevelInfo={getRecognitionLevelInfo}
        getRoleColor={getRoleColor}
        getCertificationColor={getCertificationColor}
        getMembershipDuration={getMembershipDuration}
        certificationTypes={certificationTypes}
        onEditCertification={handleEditCertification}
        onDeleteCertification={handleDeleteCertification}
        onViewDocuments={handleViewDocuments}
        onUploadDocuments={handleUploadDocuments}
      />

      <DocumentsDialog
        open={openDocumentDialog}
        onClose={() => setOpenDocumentDialog(false)}
        selectedUser={selectedUser}
        selectedCertification={selectedCertification}
        onDeleteDocument={handleDeleteDocument}
        onUploadDocuments={() => {
          setOpenDocumentDialog(false);
          handleUploadDocuments(selectedUser, selectedCertification);
        }}
        getFileIcon={getFileIcon}
        formatFileSize={formatFileSize}
      />

      <UploadDocumentsDialog
        open={openUploadDialog}
        onClose={() => !uploading && setOpenUploadDialog(false)}
        selectedUser={selectedUser}
        selectedCertification={selectedCertification}
        uploadFiles={uploadFiles}
        onFileSelect={handleFileSelect}
        onRemoveFile={handleRemoveFile}
        onUpload={handleUploadFiles}
        uploading={uploading}
        uploadProgress={uploadProgress}
        getFileIcon={getFileIcon}
        formatFileSize={formatFileSize}
      />
    </Box>
  );
};

export default UserManagement;