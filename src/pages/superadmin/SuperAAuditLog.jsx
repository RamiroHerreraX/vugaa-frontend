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
  Avatar,
  Pagination,
  Alert,
  Snackbar,
  Menu,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  History as HistoryIcon,
  Security as SecurityIcon,
  Description as DescriptionIcon,
  Gavel as GavelIcon,
  Settings as SettingsIcon,
  Login as LoginIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Computer as ComputerIcon,
  Fingerprint as FingerprintIcon,
  Info as InfoIcon,
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PictureAsPdfIcon,
  TableChart as TableChartIcon,
  TextSnippet as TextSnippetIcon,
} from "@mui/icons-material";
import ActivityDetailModal from "../../components/audit/ActivityDetailModal";

// Colores institucionales
const institutionalColors = {
  primary: '#133B6B',      // Azul oscuro principal
  secondary: '#1a4c7a',    // Azul medio
  accent: '#e9e9e9',       // Color para acentos (gris claro)
  background: '#f8f9fa',   // Fondo claro
  lightBlue: 'rgba(19, 59, 107, 0.08)',  // Azul transparente para hover
  darkBlue: '#0D2A4D',     // Azul más oscuro
  textPrimary: '#2c3e50',  // Texto principal
  textSecondary: '#7f8c8d', // Texto secundario
  success: '#27ae60',      // Verde para éxito
  warning: '#f39c12',      // Naranja para advertencias
  error: '#e74c3c',        // Rojo para errores
  info: '#3498db',         // Azul para información
};

// Importar el componente del modal

const AuditLog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const [filterInstance, setFilterInstance] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");
  const [exportScope, setExportScope] = useState("filtered");
  const rowsPerPage = 10;

  // Lista de instancias disponibles
  const instances = [
    {
      id: "all",
      name: "Todas las instancias",
      description: "Todas las áreas del sistema",
    },
    {
      id: "instancia-administrativa",
      name: "Instancia Administrativa",
      description: "Área administrativa principal",
    },
    {
      id: "instancia-ingenieria",
      name: "Instancia de Ingeniería",
      description: "Departamento de ingeniería y desarrollo",
    },
    {
      id: "instancia-finanzas",
      name: "Instancia de Finanzas",
      description: "Gestión financiera y contable",
    },
    {
      id: "instancia-recursos-humanos",
      name: "Instancia de Recursos Humanos",
      description: "Gestión de personal y nóminas",
    },
    {
      id: "instancia-operaciones",
      name: "Instancia de Operaciones",
      description: "Operaciones y logística",
    },
    {
      id: "instancia-calidad",
      name: "Instancia de Calidad",
      description: "Control de calidad y auditoría interna",
    },
    {
      id: "instancia-comercial",
      name: "Instancia Comercial",
      description: "Ventas y atención al cliente",
    },
    {
      id: "instancia-legal",
      name: "Instancia Legal",
      description: "Asuntos jurídicos y cumplimiento",
    },
    {
      id: "instancia-soporte",
      name: "Instancia de Soporte",
      description: "Soporte técnico y TI",
    },
  ];

  // Datos de auditoría de ejemplo con campo de instancia
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      timestamp: "15/01/2026 10:30:15",
      user: {
        name: "Admin Sistema",
        role: "admin",
        avatar: "AS",
        email: "admin@sistema.com",
      },
      action: "LOGIN_SUCCESS",
      actionName: "Inicio de sesión exitoso",
      entity: "Sistema",
      entityId: "N/A",
      details: "Inicio de sesión desde IP 192.168.1.100",
      ip: "192.168.1.100",
      severity: "info",
      instance: "instancia-administrativa",
      instanceName: "Instancia Administrativa",
      icon: <LoginIcon />,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "Ciudad de México, México",
      sessionId: "SESS-123456789",
    },
    {
      id: 2,
      timestamp: "15/01/2026 09:45:22",
      user: {
        name: "Luis Rodríguez",
        role: "agente",
        avatar: "LR",
        email: "luis.rodriguez@empresa.com",
      },
      action: "CERTIFICATION_CREATE",
      actionName: "Certificación creada",
      entity: "Certificación",
      entityId: "CERT-2026-00145",
      details: "Patente Aduanal creada para expediente EXP-2024-567",
      ip: "192.168.1.150",
      severity: "success",
      instance: "instancia-ingenieria",
      instanceName: "Instancia de Ingeniería",
      icon: <AddIcon />,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "Monterrey, México",
      sessionId: "SESS-987654321",
    },
    {
      id: 3,
      timestamp: "15/01/2026 08:20:18",
      user: {
        name: "María González",
        role: "comite",
        avatar: "MG",
        email: "maria.gonzalez@empresa.com",
      },
      action: "CERTIFICATION_APPROVE",
      actionName: "Certificación aprobada",
      entity: "Certificación",
      entityId: "CERT-2026-00123",
      details: "Cédula profesional aprobada con observaciones",
      ip: "192.168.1.120",
      severity: "success",
      instance: "instancia-calidad",
      instanceName: "Instancia de Calidad",
      icon: <GavelIcon />,
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      location: "Guadalajara, México",
      sessionId: "SESS-456789123",
    },
    {
      id: 4,
      timestamp: "14/01/2026 16:45:33",
      user: {
        name: "Admin Sistema",
        role: "admin",
        avatar: "AS",
        email: "admin@sistema.com",
      },
      action: "USER_UPDATE",
      actionName: "Usuario actualizado",
      entity: "Usuario",
      entityId: "USR-001",
      details: "Estado cambiado de activo a inactivo",
      ip: "192.168.1.100",
      severity: "warning",
      instance: "instancia-recursos-humanos",
      instanceName: "Instancia de Recursos Humanos",
      icon: <EditIcon />,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "Ciudad de México, México",
      sessionId: "SESS-123456789",
    },
    {
      id: 5,
      timestamp: "14/01/2026 14:10:55",
      user: {
        name: "Carlos Martínez",
        role: "profesionista",
        avatar: "CM",
        email: "carlos.martinez@empresa.com",
      },
      action: "DOCUMENT_UPLOAD",
      actionName: "Documento cargado",
      entity: "Documento",
      entityId: "DOC-2026-78901",
      details: "Comprobante de domicilio actualizado",
      ip: "192.168.1.130",
      severity: "info",
      instance: "instancia-finanzas",
      instanceName: "Instancia de Finanzas",
      icon: <DescriptionIcon />,
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
      location: "Puebla, México",
      sessionId: "SESS-321654987",
    },
    {
      id: 6,
      timestamp: "14/01/2026 11:30:42",
      user: {
        name: "María González",
        role: "comite",
        avatar: "MG",
        email: "maria.gonzalez@empresa.com",
      },
      action: "CERTIFICATION_REJECT",
      actionName: "Certificación rechazada",
      entity: "Certificación",
      entityId: "CERT-2026-00111",
      details: "Documentación insuficiente para patente aduanal",
      ip: "192.168.1.120",
      severity: "error",
      instance: "instancia-legal",
      instanceName: "Instancia Legal",
      icon: <DeleteIcon />,
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      location: "Guadalajara, México",
      sessionId: "SESS-456789123",
    },
    {
      id: 7,
      timestamp: "13/01/2026 18:15:28",
      user: {
        name: "Admin Sistema",
        role: "admin",
        avatar: "AS",
        email: "admin@sistema.com",
      },
      action: "SYSTEM_CONFIG_UPDATE",
      actionName: "Configuración actualizada",
      entity: "Sistema",
      entityId: "CONFIG-001",
      details: "Umbral del semáforo cambiado a 90%",
      ip: "192.168.1.100",
      severity: "warning",
      instance: "instancia-soporte",
      instanceName: "Instancia de Soporte",
      icon: <SettingsIcon />,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "Ciudad de México, México",
      sessionId: "SESS-123456789",
    },
    {
      id: 8,
      timestamp: "13/01/2026 15:40:19",
      user: {
        name: "Ana López",
        role: "empresario",
        avatar: "AL",
        email: "ana.lopez@empresa.com",
      },
      action: "PASSWORD_CHANGE",
      actionName: "Contraseña cambiada",
      entity: "Usuario",
      entityId: "USR-004",
      details: "Cambio de contraseña exitoso",
      ip: "192.168.1.140",
      severity: "info",
      instance: "instancia-operaciones",
      instanceName: "Instancia de Operaciones",
      icon: <SecurityIcon />,
      userAgent:
        "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
      location: "Querétaro, México",
      sessionId: "SESS-789123456",
    },
    {
      id: 9,
      timestamp: "13/01/2026 12:05:37",
      user: {
        name: "Luis Rodríguez",
        role: "agente",
        avatar: "LR",
        email: "luis.rodriguez@empresa.com",
      },
      action: "CERTIFICATION_UPDATE",
      actionName: "Certificación actualizada",
      entity: "Certificación",
      entityId: "CERT-2026-00122",
      details: "Fecha de vencimiento extendida",
      ip: "192.168.1.150",
      severity: "info",
      instance: "instancia-comercial",
      instanceName: "Instancia Comercial",
      icon: <EditIcon />,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "Monterrey, México",
      sessionId: "SESS-987654321",
    },
    {
      id: 10,
      timestamp: "12/01/2026 17:25:44",
      user: {
        name: "Admin Sistema",
        role: "admin",
        avatar: "AS",
        email: "admin@sistema.com",
      },
      action: "USER_CREATE",
      actionName: "Usuario creado",
      entity: "Usuario",
      entityId: "USR-009",
      details: "Nuevo usuario registrado: Pedro Sánchez",
      ip: "192.168.1.100",
      severity: "success",
      instance: "instancia-administrativa",
      instanceName: "Instancia Administrativa",
      icon: <AddIcon />,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "Ciudad de México, México",
      sessionId: "SESS-123456789",
    },
  ]);

  const actionTypes = [
    { value: "all", label: "Todas las acciones" },
    { value: "LOGIN", label: "Accesos al sistema" },
    { value: "USER", label: "Gestión de usuarios" },
    { value: "CERTIFICATION", label: "Certificaciones" },
    { value: "DOCUMENT", label: "Documentos" },
    { value: "SYSTEM", label: "Configuración del sistema" },
    { value: "SECURITY", label: "Seguridad" },
  ];

  const users = [
    { value: "all", label: "Todos los usuarios" },
    { value: "admin", label: "Administradores" },
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
      default:
        return institutionalColors.textSecondary;
    }
  };

  const getInstanceColor = (instanceId) => {
    const colors = {
      "instancia-administrativa": institutionalColors.success,
      "instancia-ingenieria": institutionalColors.primary,
      "instancia-finanzas": "#8e24aa",
      "instancia-recursos-humanos": "#ff6f00",
      "instancia-operaciones": "#00838f",
      "instancia-calidad": "#c62828",
      "instancia-comercial": "#6a1b9a",
      "instancia-legal": institutionalColors.success,
      "instancia-soporte": "#37474f",
    };
    return colors[instanceId] || institutionalColors.textSecondary;
  };

  // Función para actualizar los datos
  const handleRefresh = () => {
    setLoading(true);

    // Simular una carga de datos
    setTimeout(() => {
      setLoading(false);
      showSnackbar("Datos actualizados correctamente", "success");
    }, 1000);
  };

  // Función para mostrar snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Función para abrir el modal con los detalles
  const handleOpenModal = (log) => {
    setSelectedLog(log);
    setModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLog(null);
  };

  // Función para cerrar el snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Funciones para el menú de descarga
  const handleDownloadClick = (event) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null);
  };

  const handleExportOptionClick = (format) => {
    setExportFormat(format);
    setExportDialogOpen(true);
    handleDownloadClose();
  };

  const handleExportDialogClose = () => {
    setExportDialogOpen(false);
  };

  const handleExportConfirm = () => {
    const dataToExport = exportScope === "filtered" ? filteredLogs : auditLogs;
    exportLogs(dataToExport, exportFormat);
    setExportDialogOpen(false);
    showSnackbar(
      `Logs exportados exitosamente en formato ${exportFormat.toUpperCase()}`,
      "success",
    );
  };

  // Función para exportar logs
  const exportLogs = (data, format) => {
    let content = "";
    let fileName = `audit-logs-${new Date().toISOString().split("T")[0]}`;
    let mimeType = "";

    // Preparar los datos para exportación
    const exportData = data.map((log) => ({
      ID: log.id,
      Fecha: log.timestamp,
      Usuario: log.user.name,
      Rol: log.user.role,
      Email: log.user.email,
      Acción: log.actionName,
      Instancia: log.instanceName,
      Entidad: log.entity,
      "ID Entidad": log.entityId,
      Detalles: log.details,
      IP: log.ip,
      Severidad: log.severity,
      Ubicación: log.location,
      "ID Sesión": log.sessionId,
      "User Agent": log.userAgent,
    }));

    switch (format) {
      case "csv":
        // Crear CSV
        const headers = Object.keys(exportData[0]).join(",");
        const rows = exportData
          .map((row) =>
            Object.values(row)
              .map((value) => `"${value}"`)
              .join(","),
          )
          .join("\n");
        content = `${headers}\n${rows}`;
        mimeType = "text/csv";
        fileName += ".csv";
        break;

      case "json":
        // Crear JSON
        content = JSON.stringify(exportData, null, 2);
        mimeType = "application/json";
        fileName += ".json";
        break;

      case "txt":
        // Crear TXT
        content = exportData
          .map((row) =>
            Object.entries(row)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n"),
          )
          .join("\n\n" + "=".repeat(50) + "\n\n");
        mimeType = "text/plain";
        fileName += ".txt";
        break;

      default:
        return;
    }

    // Crear y descargar el archivo
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.instanceName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "all" ? true : log.action.includes(filterType);

    const matchesUser =
      filterUser === "all" ? true : log.user.role === filterUser;

    const matchesInstance =
      filterInstance === "all" ? true : log.instance === filterInstance;

    return matchesSearch && matchesType && matchesUser && matchesInstance;
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
    bySeverity: {
      info: auditLogs.filter((log) => log.severity === "info").length,
      success: auditLogs.filter((log) => log.severity === "success").length,
      warning: auditLogs.filter((log) => log.severity === "warning").length,
      error: auditLogs.filter((log) => log.severity === "error").length,
    },
    byUserType: {
      admin: auditLogs.filter((log) => log.user.role === "admin").length,
      comite: auditLogs.filter((log) => log.user.role === "comite").length,
      agente: auditLogs.filter((log) => log.user.role === "agente").length,
      profesionista: auditLogs.filter(
        (log) => log.user.role === "profesionista",
      ).length,
      empresario: auditLogs.filter((log) => log.user.role === "empresario")
        .length,
    },
    byInstance: instances.reduce((acc, instance) => {
      if (instance.id !== "all") {
        acc[instance.id] = auditLogs.filter(
          (log) => log.instance === instance.id,
        ).length;
      }
      return acc;
    }, {}),
  };

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterUser("all");
    setFilterInstance("all");
    setPage(1);
    showSnackbar("Filtros limpiados", "info");
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: institutionalColors.background }}>
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
              sx={{ color: institutionalColors.primary, fontWeight: "bold", mb: 0.5 }}
            >
              Auditoría y Trazabilidad
            </Typography>
            <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
              Registro completo de todas las acciones realizadas en el sistema
              por instancia
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              size="small"
              onClick={handleDownloadClick}
              aria-controls="download-menu"
              aria-haspopup="true"
              sx={{
                borderColor: institutionalColors.primary,
                color: institutionalColors.primary,
                '&:hover': {
                  borderColor: institutionalColors.secondary,
                  bgcolor: institutionalColors.lightBlue,
                }
              }}
            >
              Exportar Logs
            </Button>
            <Menu
              id="download-menu"
              anchorEl={downloadAnchorEl}
              open={Boolean(downloadAnchorEl)}
              onClose={handleDownloadClose}
            >
              <MenuItem onClick={() => handleExportOptionClick("csv")}>
                <ListItemIcon>
                  <TableChartIcon fontSize="small" sx={{ color: institutionalColors.primary }} />
                </ListItemIcon>
                <ListItemText primary="CSV (Excel)" />
              </MenuItem>
              <MenuItem onClick={() => handleExportOptionClick("json")}>
                <ListItemIcon>
                  <FileDownloadIcon fontSize="small" sx={{ color: institutionalColors.primary }} />
                </ListItemIcon>
                <ListItemText primary="JSON" />
              </MenuItem>
              <MenuItem onClick={() => handleExportOptionClick("txt")}>
                <ListItemIcon>
                  <TextSnippetIcon fontSize="small" sx={{ color: institutionalColors.primary }} />
                </ListItemIcon>
                <ListItemText primary="TXT" />
              </MenuItem>
            </Menu>

            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              size="small"
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                bgcolor: institutionalColors.primary,
                '&:hover': { bgcolor: institutionalColors.secondary }
              }}
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </Button>
          </Stack>
        </Box>

        {/* Diálogo de exportación */}
        <Dialog open={exportDialogOpen} onClose={handleExportDialogClose}>
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FileDownloadIcon sx={{ color: institutionalColors.primary }} />
              <Typography variant="h6" sx={{ color: institutionalColors.textPrimary }}>Exportar Logs</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ color: institutionalColors.textPrimary }}>Formato de exportación</FormLabel>
                <RadioGroup
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                >
                  <FormControlLabel
                    value="csv"
                    control={<Radio sx={{ color: institutionalColors.primary, '&.Mui-checked': { color: institutionalColors.primary } }} />}
                    label="CSV (Compatible con Excel)"
                  />
                  <FormControlLabel
                    value="json"
                    control={<Radio sx={{ color: institutionalColors.primary, '&.Mui-checked': { color: institutionalColors.primary } }} />}
                    label="JSON (Formato estructurado)"
                  />
                  <FormControlLabel
                    value="txt"
                    control={<Radio sx={{ color: institutionalColors.primary, '&.Mui-checked': { color: institutionalColors.primary } }} />}
                    label="TXT (Texto plano)"
                  />
                </RadioGroup>
              </FormControl>

              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ color: institutionalColors.textPrimary }}>
                  Alcance de la exportación
                </FormLabel>
                <RadioGroup
                  value={exportScope}
                  onChange={(e) => setExportScope(e.target.value)}
                >
                  <FormControlLabel
                    value="filtered"
                    control={<Radio sx={{ color: institutionalColors.primary, '&.Mui-checked': { color: institutionalColors.primary } }} />}
                    label={`Solo filtrados (${filteredLogs.length} registros)`}
                  />
                  <FormControlLabel
                    value="all"
                    control={<Radio sx={{ color: institutionalColors.primary, '&.Mui-checked': { color: institutionalColors.primary } }} />}
                    label={`Todos los logs (${auditLogs.length} registros)`}
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleExportDialogClose} sx={{ color: institutionalColors.textPrimary }}>Cancelar</Button>
            <Button
              onClick={handleExportConfirm}
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{
                bgcolor: institutionalColors.primary,
                '&:hover': { bgcolor: institutionalColors.secondary }
              }}
            >
              Exportar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Filtros */}
        <Paper elevation={0} sx={{ p: 2, bgcolor: "white", border: `1px solid #e5e7eb` }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar en auditoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ '&.Mui-focused': { color: institutionalColors.primary } }}>Tipo de Acción</InputLabel>
                <Select
                  value={filterType}
                  label="Tipo de Acción"
                  onChange={(e) => setFilterType(e.target.value)}
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: institutionalColors.primary,
                    }
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

            <Grid item xs={12} md={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ '&.Mui-focused': { color: institutionalColors.primary } }}>Tipo de Usuario</InputLabel>
                <Select
                  value={filterUser}
                  label="Tipo de Usuario"
                  onChange={(e) => setFilterUser(e.target.value)}
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: institutionalColors.primary,
                    }
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

            {/* Nuevo filtro por instancia */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ '&.Mui-focused': { color: institutionalColors.primary } }}>Instancia</InputLabel>
                <Select
                  value={filterInstance}
                  label="Instancia"
                  onChange={(e) => setFilterInstance(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <BusinessIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                    </InputAdornment>
                  }
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: institutionalColors.primary,
                    }
                  }}
                >
                  {instances.map((instance) => (
                    <MenuItem key={instance.id} value={instance.id}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>{instance.name}</Typography>
                        <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                          {instance.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={1}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={clearAllFilters}
                sx={{ 
                  height: "40px",
                  borderColor: institutionalColors.primary,
                  color: institutionalColors.primary,
                  '&:hover': {
                    borderColor: institutionalColors.secondary,
                    bgcolor: institutionalColors.lightBlue,
                  }
                }}
              >
                Limpiar
              </Button>
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
              bgcolor: "white",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: institutionalColors.textPrimary }}
            >
              Registro de Auditoría - {filteredLogs.length} eventos encontrados
            </Typography>

            <Stack direction="row" spacing={1}>
              {filterInstance !== "all" && (
                <Chip
                  label={
                    instances.find((i) => i.id === filterInstance)?.name ||
                    "Instancia"
                  }
                  size="small"
                  sx={{
                    bgcolor: institutionalColors.lightBlue,
                    color: institutionalColors.primary,
                  }}
                  onDelete={() => setFilterInstance("all")}
                  deleteIcon={<ArrowBackIcon sx={{ color: institutionalColors.primary }} />}
                />
              )}
              <Chip
                label={`${stats.today} eventos hoy`}
                size="small"
                sx={{
                  bgcolor: institutionalColors.lightBlue,
                  color: institutionalColors.primary,
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

          {/* Tabla de auditoría con columna de instancia */}
          <TableContainer sx={{ flex: 1 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: "13%", color: institutionalColors.primary }}>
                    Fecha y Hora
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "18%", color: institutionalColors.primary }}>
                    Usuario
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "18%", color: institutionalColors.primary }}>
                    Acción
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "15%", color: institutionalColors.primary }}>
                    Instancia
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "15%", color: institutionalColors.primary }}>
                    Entidad
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "25%", color: institutionalColors.primary }}>
                    Detalles
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", width: "3%", color: institutionalColors.primary }}
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
                          sx={{ fontWeight: "bold", color: institutionalColors.textPrimary }}
                        >
                          {log.timestamp.split(" ")[0]}
                        </Typography>
                        <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
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
                            sx={{ fontWeight: "medium", color: institutionalColors.textPrimary }}
                          >
                            {log.user.name}
                          </Typography>
                          <Chip
                            label={log.user.role}
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
                            sx={{ fontWeight: "medium", color: institutionalColors.textPrimary }}
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

                    {/* Nueva columna para instancia */}
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <BusinessIcon
                          fontSize="small"
                          sx={{ color: getInstanceColor(log.instance) }}
                        />
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "medium", color: institutionalColors.textPrimary }}
                          >
                            {log.instanceName.split(" ")[0]}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: institutionalColors.textSecondary }}
                          >
                            {log.instanceName.split(" ").slice(1).join(" ")}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium", color: institutionalColors.textPrimary }}
                        >
                          {log.entity}
                        </Typography>
                        <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                          ID: {log.entityId}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
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
                          onClick={() => handleOpenModal(log)}
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
              borderTop: `1px solid #e5e7eb`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "white",
            }}
          >
            <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
              Mostrando {(page - 1) * rowsPerPage + 1} -{" "}
              {Math.min(page * rowsPerPage, filteredLogs.length)} de{" "}
              {filteredLogs.length} eventos
              {filterInstance !== "all" &&
                ` en ${instances.find((i) => i.id === filterInstance)?.name}`}
            </Typography>
            <Pagination
              count={Math.ceil(filteredLogs.length / rowsPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
              size="small"
              color="primary"
              sx={{
                '& .MuiPaginationItem-root.Mui-selected': {
                  bgcolor: institutionalColors.primary,
                  color: 'white',
                  '&:hover': {
                    bgcolor: institutionalColors.secondary,
                  }
                }
              }}
            />
          </Box>
        </Paper>

        {/* Información de auditoría con distribución por instancia */}

      </Box>

      {/* Modal de detalles de la actividad (componente separado) */}
      <ActivityDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        activity={selectedLog}
      />

      {/* Snackbar de notificación */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuditLog;