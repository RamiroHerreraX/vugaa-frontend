// src/pages/audit/AuditLog.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Pagination,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  Assignment as AssignmentIcon,
  GroupAdd as GroupAddIcon,
  Visibility as ProfileIcon,
  FileUpload as FileUploadIcon,
  PersonAdd as PersonAddIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import ActivityDetailModal from "../../components/audit/ActivityDetailModal";
import * as XLSX from "xlsx";

// Colores institucionales
const institutionalColors = {
  primary: "#133B6B", // Azul oscuro principal
  secondary: "#1a4c7a", // Azul medio
  accent: "#e9e9e9", // Color para acentos (gris claro)
  background: "#f8fafc", // Fondo claro
  lightBlue: "rgba(19, 59, 107, 0.08)", // Azul transparente para hover
  darkBlue: "#0D2A4D", // Azul más oscuro
  textPrimary: "#2c3e50", // Texto principal
  textSecondary: "#7f8c8d", // Texto secundario
  success: "#27ae60", // Verde para éxito
  warning: "#f39c12", // Naranja para advertencias
  error: "#e74c3c", // Rojo para errores
  info: "#3498db", // Azul para información
};

const AuditLog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const rowsPerPage = 10;

  // Datos de auditoría modificados con mensajes personales
  const auditLogs = [
    {
      id: 1,
      timestamp: "15/01/2026 10:45:10",
      user: {
        name: "Yo",
        role: "admin",
        avatar: "YO",
        email: "yo@institucion.edu",
      },
      action: "CERTIFICATION_ASSIGN",
      actionName: "Certificación subida",
      entity: "Certificación",
      entityId: "CERT-2026-00145",
      details: "Subí una certificación al usuario Luis Rodríguez",
      ip: "192.168.1.150",
      severity: "success",
      icon: <AssignmentIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 2,
      timestamp: "15/01/2026 10:30:15",
      user: {
        name: "Yo",
        role: "admin",
        avatar: "YO",
        email: "yo@institucion.edu",
      },
      action: "LOGIN_SUCCESS",
      actionName: "Inicio de sesión",
      entity: "Sistema",
      entityId: "N/A",
      details: "Inicié sesión en el sistema correctamente",
      ip: "192.168.1.100",
      severity: "info",
      icon: <LoginIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 3,
      timestamp: "15/01/2026 10:20:05",
      user: {
        name: "Luis Rodríguez",
        role: "agente",
        avatar: "LR",
        email: "luis.rodriguez@institucion.edu",
      },
      action: "PERMISSION_GRANT",
      actionName: "Permiso otorgado",
      entity: "Permisos",
      entityId: "PERM-003",
      details:
        "Luis Rodríguez me dio permiso para subir documentos en su nombre",
      ip: "192.168.1.160",
      severity: "success",
      icon: <LockIcon />,
      instanceName: "Instancia Principal",
    },

    {
      id: 4,
      timestamp: "15/01/2026 08:20:18",
      user: {
        name: "Yo",
        role: "admin",
        avatar: "YO",
        email: "yo@institucion.edu",
      },
      action: "PROFILE_VIEW",
      actionName: "Perfil consultado",
      entity: "Usuario",
      entityId: "USR-005",
      details: "Vi el perfil del usuario Carlos Martínez",
      ip: "192.168.1.100",
      severity: "info",
      icon: <ProfileIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 5,
      timestamp: "14/01/2026 16:45:33",
      user: {
        name: "Yo",
        role: "admin",
        avatar: "YO",
        email: "yo@institucion.edu",
      },
      action: "USER_ADD_ASSOCIATION",
      actionName: "Usuario agregado",
      entity: "Asociación",
      entityId: "ASSOC-023",
      details: "Agregué a María González a mi asociación",
      ip: "192.168.1.100",
      severity: "success",
      icon: <GroupAddIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 6,
      timestamp: "14/01/2026 14:10:55",
      user: {
        name: "Yo",
        role: "admin",
        avatar: "YO",
        email: "yo@institucion.edu",
      },
      action: "DOCUMENT_UPLOAD_SELF",
      actionName: "Documento subido",
      entity: "Mi Expediente",
      entityId: "DOC-2026-78901",
      details: "Subí un documento a mi expediente personal",
      ip: "192.168.1.130",
      severity: "info",
      icon: <FileUploadIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 7,
      timestamp: "14/01/2026 11:30:42",
      user: {
        name: "Yo",
        role: "admin",
        avatar: "YO",
        email: "yo@institucion.edu",
      },
      action: "USER_CREATE",
      actionName: "Usuario creado",
      entity: "Usuario",
      entityId: "USR-012",
      details: "Creé un nuevo usuario para Pedro Sánchez",
      ip: "192.168.1.100",
      severity: "success",
      icon: <PersonAddIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 8,
      timestamp: "13/01/2026 18:15:28",
      user: {
        name: "Yo",
        role: "admin",
        avatar: "YO",
        email: "yo@institucion.edu",
      },
      action: "LOGOUT",
      actionName: "Sesión finalizada",
      entity: "Sistema",
      entityId: "N/A",
      details: "Cerré sesión del sistema",
      ip: "192.168.1.100",
      severity: "info",
      icon: <LogoutIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 9,
      timestamp: "13/01/2026 15:40:19",
      user: {
        name: "Yo",
        role: "admin",
        avatar: "YO",
        email: "yo@institucion.edu",
      },
      action: "LOGIN_SUCCESS",
      actionName: "Inicio de sesión",
      entity: "Sistema",
      entityId: "N/A",
      details: "Inicié sesión nuevamente en el sistema",
      ip: "192.168.1.140",
      severity: "info",
      icon: <LoginIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 10,
      timestamp: "13/01/2026 12:05:37",
      user: {
        name: "Yo",
        role: "admin",
        avatar: "YO",
        email: "yo@institucion.edu",
      },
      action: "CERTIFICATION_ASSIGN",
      actionName: "Certificado asignado",
      entity: "Certificación",
      entityId: "CERT-2026-00122",
      details: "Le asigné un certificado a Ana López",
      ip: "192.168.1.150",
      severity: "info",
      icon: <AssignmentIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 11,
      timestamp: "13/01/2026 10:15:22",
      user: {
        name: "Yo",
        role: "admin",
        avatar: "YO",
        email: "yo@institucion.edu",
      },
      action: "PROFILE_VIEW",
      actionName: "Perfil consultado",
      entity: "Usuario",
      entityId: "USR-003",
      details: "Revisé el perfil de Luis Rodríguez",
      ip: "192.168.1.100",
      severity: "info",
      icon: <ProfileIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 12,
      timestamp: "12/01/2026 17:25:44",
      user: {
        name: "Yo",
        role: "admin",
        avatar: "YO",
        email: "yo@institucion.edu",
      },
      action: "USER_ADD_ASSOCIATION",
      actionName: "Usuario agregado",
      entity: "Asociación",
      entityId: "ASSOC-024",
      details: "Agregué a Juan Pérez a mi asociación",
      ip: "192.168.1.100",
      severity: "success",
      icon: <GroupAddIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 13,
      timestamp: "12/01/2026 14:30:10",
      user: {
        name: "Yo",
        role: "admin",
        avatar: "YO",
        email: "yo@institucion.edu",
      },
      action: "DOCUMENT_UPLOAD_SELF",
      actionName: "Documento subido",
      entity: "Mi Expediente",
      entityId: "DOC-2026-78902",
      details: "Subí mi certificado profesional a mi expediente",
      ip: "192.168.1.130",
      severity: "info",
      icon: <FileUploadIcon />,
      instanceName: "Instancia Principal",
    },
    {
      id: 14,
      timestamp: "12/01/2026 11:45:33",
      user: {
        name: "Fernanda López",
        role: "comite",
        avatar: "FL",
        email: "fernanda.lopez@institucion.edu",
      },
      action: "PERMISSION_GRANT",
      actionName: "Permisos otorgados",
      entity: "Permisos",
      entityId: "PERM-002",
      details: "Fernanda me autorizó para gestionar certificados",
      ip: "192.168.1.120",
      severity: "success",
      icon: <LockIcon />,
      instanceName: "Instancia de Comité",
    },
    {
      id: 15,
      timestamp: "12/01/2026 09:20:15",
      user: {
        name: "Yo",
        role: "admin",
        avatar: "YO",
        email: "yo@institucion.edu",
      },
      action: "LOGIN_SUCCESS",
      actionName: "Inicio de sesión",
      entity: "Sistema",
      entityId: "N/A",
      details: "Accedí al sistema desde mi computadora",
      ip: "192.168.1.100",
      severity: "info",
      icon: <LoginIcon />,
      instanceName: "Instancia Principal",
    },
  ];

  const actionTypes = [
    { value: "all", label: "Todas mis acciones" },
    { value: "LOGIN", label: "Mis accesos al sistema" },
    { value: "CERTIFICATION", label: "Certificados asignados" },
    { value: "PERMISSION", label: "Permisos recibidos" },
    { value: "PROFILE", label: "Perfiles consultados" },
    { value: "USER", label: "Usuarios gestionados" },
    { value: "DOCUMENT", label: "Documentos subidos" },
  ];

  const users = [
    { value: "all", label: "Todos los usuarios" },
    { value: "yo", label: "Mis acciones" },
    { value: "comite", label: "Comité" },
    { value: "agente", label: "Agentes" },
    { value: "profesionista", label: "Profesionistas" },
    { value: "empresario", label: "Empresarios" },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "success":
        return institutionalColors.success;
      case "info":
        return institutionalColors.info;
      case "warning":
        return institutionalColors.warning;
      case "error":
        return institutionalColors.error;
      default:
        return institutionalColors.textSecondary;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return institutionalColors.success;
      case "comite":
        return institutionalColors.primary;
      case "agente":
        return "#526F78";
      case "profesionista":
        return "#2ecc71";
      case "empresario":
        return "#ed6c02";
      case "yo":
        return institutionalColors.success;
      default:
        return institutionalColors.textSecondary;
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "all" ? true : log.action.includes(filterType);

    const matchesUser =
      filterUser === "all"
        ? true
        : filterUser === "yo"
          ? log.user.name === "Yo"
          : log.user.role === filterUser;

    return matchesSearch && matchesType && matchesUser;
  });

  const paginatedLogs = filteredLogs.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  // Estadísticas
  const stats = {
    total: auditLogs.length,
    today: auditLogs.filter((log) => log.timestamp.includes("15/01/2026"))
      .length,
    misAcciones: auditLogs.filter((log) => log.user.name === "Yo").length,
    permisosRecibidos: auditLogs.filter(
      (log) => log.action === "PERMISSION_GRANT",
    ).length,
    certificadosAsignados: auditLogs.filter(
      (log) => log.action === "CERTIFICATION_ASSIGN",
    ).length,
    documentosSubidos: auditLogs.filter(
      (log) => log.action === "DOCUMENT_UPLOAD_SELF",
    ).length,
  };

  // Función para abrir modal de detalles
  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    setModalOpen(true);
  };

  // Función para cerrar modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedActivity(null);
  };

  // Función para exportar a Excel
  const exportToExcel = () => {
    try {
      // Preparar los datos para Excel
      const excelData = filteredLogs.map((log) => ({
        Fecha: log.timestamp.split(" ")[0],
        Hora: log.timestamp.split(" ")[1],
        Usuario: log.user.name,
        Rol: log.user.name === "Yo" ? "Yo" : log.user.role,
        Email: log.user.email,
        Acción: log.actionName,
        Tipo: log.action,
        Entidad: log.entity,
        "ID Entidad": log.entityId,
        Detalles: log.details,
        Severidad: log.severity,
        IP: log.ip,
        Instancia: log.instanceName,
      }));

      // Crear hoja de trabajo
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Ajustar ancho de columnas
      const colWidths = [
        { wch: 12 }, // Fecha
        { wch: 10 }, // Hora
        { wch: 20 }, // Usuario
        { wch: 15 }, // Rol
        { wch: 30 }, // Email
        { wch: 25 }, // Acción
        { wch: 20 }, // Tipo
        { wch: 20 }, // Entidad
        { wch: 15 }, // ID Entidad
        { wch: 40 }, // Detalles
        { wch: 10 }, // Severidad
        { wch: 15 }, // IP
        { wch: 20 }, // Instancia
      ];
      ws["!cols"] = colWidths;

      // Crear libro de trabajo
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Actividades");

      // Generar archivo Excel
      const fecha = new Date().toISOString().split("T")[0];
      XLSX.writeFile(wb, `actividades_${fecha}.xlsx`);

      setSnackbar({
        open: true,
        message: "Excel exportado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      setSnackbar({
        open: true,
        message: "Error al exportar Excel",
        severity: "error",
      });
    }
  };

  const handleRefresh = () => {
    setSnackbar({
      open: true,
      message: "Datos actualizados correctamente",
      severity: "success",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: institutionalColors.background,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
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
              Mis Actividades y Acciones
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: institutionalColors.textSecondary }}
            >
              Registro personal de todas las acciones que he realizado y
              recibido
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              size="small"
              onClick={exportToExcel}
              sx={{
                borderColor: institutionalColors.primary,
                color: institutionalColors.primary,
                "&:hover": {
                  borderColor: institutionalColors.secondary,
                  bgcolor: institutionalColors.lightBlue,
                },
              }}
            >
              Exportar a Excel
            </Button>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              size="small"
              onClick={handleRefresh}
              sx={{
                bgcolor: institutionalColors.primary,
                "&:hover": {
                  bgcolor: institutionalColors.secondary,
                },
              }}
            >
              Actualizar
            </Button>
          </Stack>
        </Box>
        <Grid
          container
          spacing={2}
          sx={{
            mb: 3,
            width: "100%",
            flexWrap: "nowrap",
          }}
        >
          <Grid item sx={{ flex: 1 }}>
            <Card
              sx={{
                borderLeft: `4px solid ${institutionalColors.success}`,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 2, textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: institutionalColors.success,
                    fontWeight: "bold",
                  }}
                >
                  {stats.misAcciones}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: institutionalColors.textSecondary }}
                >
                  Mis Acciones
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item sx={{ flex: 1 }}>
            <Card
              sx={{
                borderLeft: `4px solid ${institutionalColors.info}`,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 2, textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{ color: institutionalColors.info, fontWeight: "bold" }}
                >
                  {stats.today}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: institutionalColors.textSecondary }}
                >
                  Hoy
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item sx={{ flex: 1 }}>
            <Card
              sx={{
                borderLeft: `4px solid ${institutionalColors.primary}`,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 2, textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: institutionalColors.primary,
                    fontWeight: "bold",
                  }}
                >
                  {stats.certificadosAsignados}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: institutionalColors.textSecondary }}
                >
                  Certificados Asignados
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item sx={{ flex: 1 }}>
            <Card
              sx={{
                borderLeft: `4px solid ${institutionalColors.warning}`,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 2, textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: institutionalColors.warning,
                    fontWeight: "bold",
                  }}
                >
                  {stats.permisosRecibidos}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: institutionalColors.textSecondary }}
                >
                  Permisos Recibidos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item sx={{ flex: 1 }}>
            <Card
              sx={{
                borderLeft: `4px solid ${institutionalColors.success}`,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 2, textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: institutionalColors.success,
                    fontWeight: "bold",
                  }}
                >
                  {stats.documentosSubidos}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: institutionalColors.textSecondary }}
                >
                  Documentos Subidos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item sx={{ flex: 1 }}>
            <Card
              sx={{
                borderLeft: `4px solid ${institutionalColors.primary}`,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 2, textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: institutionalColors.primary,
                    fontWeight: "bold",
                  }}
                >
                  {stats.total}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: institutionalColors.textSecondary }}
                >
                  Total de Eventos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Filtros */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: "white",
            border: `1px solid ${institutionalColors.lightBlue}`,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar en mis actividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        fontSize="small"
                        sx={{ color: institutionalColors.textSecondary }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel
                  sx={{
                    "&.Mui-focused": { color: institutionalColors.primary },
                  }}
                >
                  Tipo de Acción
                </InputLabel>
                <Select
                  value={filterType}
                  label="Tipo de Acción"
                  onChange={(e) => setFilterType(e.target.value)}
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: institutionalColors.primary,
                    },
                  }}
                >
                  {actionTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel
                  sx={{
                    "&.Mui-focused": { color: institutionalColors.primary },
                  }}
                >
                  Filtrar por Usuario
                </InputLabel>
                <Select
                  value={filterUser}
                  label="Filtrar por Usuario"
                  onChange={(e) => setFilterUser(e.target.value)}
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: institutionalColors.primary,
                    },
                  }}
                >
                  {users.map((user) => (
                    <MenuItem key={user.value} value={user.value}>
                      {user.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("all");
                    setFilterUser("all");
                    setPage(1);
                  }}
                  sx={{
                    borderColor: institutionalColors.primary,
                    color: institutionalColors.primary,
                    "&:hover": {
                      borderColor: institutionalColors.secondary,
                      bgcolor: institutionalColors.lightBlue,
                    },
                  }}
                >
                  Limpiar Filtros
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Contenido principal */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Paper
          elevation={1}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: `1px solid ${institutionalColors.lightBlue}`,
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${institutionalColors.lightBlue}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "white",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                color: institutionalColors.textPrimary,
              }}
            >
              Registro de Mis Actividades - {filteredLogs.length} eventos
              encontrados
            </Typography>

            <Stack direction="row" spacing={1}>
              <Chip
                label={`${stats.misAcciones} acciones mías`}
                size="small"
                sx={{
                  bgcolor: institutionalColors.lightBlue,
                  color: institutionalColors.primary,
                  borderColor: institutionalColors.primary,
                }}
                variant="outlined"
              />
              <Chip
                label={`${paginatedLogs.length} mostrados`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: institutionalColors.textSecondary,
                  color: institutionalColors.textSecondary,
                }}
              />
            </Stack>
          </Box>

          {/* Tabla de auditoría */}
          <TableContainer sx={{ flex: 1 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      width: "15%",
                      color: institutionalColors.primary,
                    }}
                  >
                    Fecha y Hora
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      width: "20%",
                      color: institutionalColors.primary,
                    }}
                  >
                    Usuario
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      width: "20%",
                      color: institutionalColors.primary,
                    }}
                  >
                    Acción
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      width: "15%",
                      color: institutionalColors.primary,
                    }}
                  >
                    Entidad
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      width: "25%",
                      color: institutionalColors.primary,
                    }}
                  >
                    Detalles
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      width: "5%",
                      color: institutionalColors.primary,
                    }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLogs.map((log) => (
                  <TableRow
                    key={log.id}
                    hover
                    sx={{
                      "&:hover": { bgcolor: institutionalColors.lightBlue },
                      borderLeft: `3px solid ${getSeverityColor(log.severity)}`,
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: "bold",
                            color: institutionalColors.textPrimary,
                          }}
                        >
                          {log.timestamp.split(" ")[0]}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: institutionalColors.textSecondary }}
                        >
                          {log.timestamp.split(" ")[1]}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: getRoleColor(log.user.role),
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                          }}
                        >
                          {log.user.avatar}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "medium",
                              color: institutionalColors.textPrimary,
                            }}
                          >
                            {log.user.name}
                          </Typography>
                          <Chip
                            label={
                              log.user.name === "Yo" ? "Yo" : log.user.role
                            }
                            size="small"
                            sx={{
                              bgcolor: `${getRoleColor(log.user.role)}15`,
                              color: getRoleColor(log.user.role),
                              fontSize: "0.65rem",
                              height: 18,
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box sx={{ color: getSeverityColor(log.severity) }}>
                          {log.icon}
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "medium",
                              color: institutionalColors.textPrimary,
                            }}
                          >
                            {log.actionName}
                          </Typography>
                          <Chip
                            label={log.severity}
                            size="small"
                            sx={{
                              bgcolor: `${getSeverityColor(log.severity)}15`,
                              color: getSeverityColor(log.severity),
                              fontSize: "0.65rem",
                              height: 18,
                              mt: 0.5,
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: "medium",
                            color: institutionalColors.textPrimary,
                          }}
                        >
                          {log.entity}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: institutionalColors.textSecondary }}
                        >
                          ID: {log.entityId}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: institutionalColors.textSecondary }}
                        >
                          {log.details}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: institutionalColors.textSecondary }}
                          >
                            IP: {log.ip}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(log)}
                          sx={{ color: institutionalColors.primary }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${institutionalColors.lightBlue}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "white",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: institutionalColors.textSecondary }}
            >
              Mostrando {(page - 1) * rowsPerPage + 1} -{" "}
              {Math.min(page * rowsPerPage, filteredLogs.length)} de{" "}
              {filteredLogs.length} eventos
            </Typography>
            <Pagination
              count={Math.ceil(filteredLogs.length / rowsPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
              size="small"
              color="primary"
              sx={{
                "& .MuiPaginationItem-root.Mui-selected": {
                  bgcolor: institutionalColors.primary,
                  color: "white",
                  "&:hover": {
                    bgcolor: institutionalColors.secondary,
                  },
                },
              }}
            />
          </Box>
        </Paper>

        {/* Información de auditoría */}
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "white",
            border: `1px solid ${institutionalColors.lightBlue}`,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: institutionalColors.primary,
              mb: 2,
              fontWeight: "bold",
            }}
          >
            Resumen de Mis Actividades Recientes
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: institutionalColors.textPrimary, mb: 1 }}
              >
                Distribución de Mis Acciones
              </Typography>
              <Stack spacing={1}>
                {Object.entries({
                  "Certificados asignados": stats.certificadosAsignados,
                  "Documentos subidos": stats.documentosSubidos,
                  "Usuarios agregados": auditLogs.filter(
                    (log) => log.action === "USER_ADD_ASSOCIATION",
                  ).length,
                  "Perfiles consultados": auditLogs.filter(
                    (log) => log.action === "PROFILE_VIEW",
                  ).length,
                  "Inicios de sesión": auditLogs.filter(
                    (log) => log.action === "LOGIN_SUCCESS",
                  ).length,
                }).map(([type, count]) => (
                  <Box
                    key={type}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: institutionalColors.textSecondary }}
                    >
                      {type}:
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        width: "60%",
                      }}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={(count / stats.misAcciones) * 100}
                        sx={{
                          flex: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: institutionalColors.primary,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: "bold",
                          minWidth: 24,
                          color: institutionalColors.primary,
                        }}
                      >
                        {count}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: institutionalColors.textPrimary, mb: 1 }}
              >
                Acciones de Otros Usuarios Relacionadas Conmigo
              </Typography>
              <Stack spacing={1}>
                {Object.entries({
                  "Permisos otorgados por Fernanda": auditLogs.filter(
                    (log) =>
                      log.action === "PERMISSION_GRANT" &&
                      log.user.name === "Fernanda López",
                  ).length,
                  "Acciones de comité": auditLogs.filter(
                    (log) =>
                      log.user.role === "comite" && log.user.name !== "Yo",
                  ).length,
                  "Acciones de agentes": auditLogs.filter(
                    (log) => log.user.role === "agente",
                  ).length,
                }).map(([type, count]) => (
                  <Box
                    key={type}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: institutionalColors.textSecondary }}
                    >
                      {type}:
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        width: "60%",
                      }}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={
                          (count / (stats.total - stats.misAcciones)) * 100
                        }
                        sx={{
                          flex: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: institutionalColors.info,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: "bold",
                          minWidth: 24,
                          color: institutionalColors.info,
                        }}
                      >
                        {count}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Modal de detalles */}
      <ActivityDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        activity={selectedActivity}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuditLog;
