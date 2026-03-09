import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Business as BusinessIcon,
  FileDownload as FileDownloadIcon,
  TableChart as TableChartIcon,
  TextSnippet as TextSnippetIcon,
} from "@mui/icons-material";
import ActivityDetailModal from "../../components/audit/ActivityDetailModal";
import auditoriaService from "../../services/auditoriaService";
import { useAuth } from "../../context/AuthContext";

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
  background: "#f8f9fa",
  lightBlue: "rgba(19, 59, 107, 0.08)",
  textPrimary: "#2c3e50",
  textSecondary: "#7f8c8d",
  success: "#27ae60",
  warning: "#f39c12",
  error: "#e74c3c",
  info: "#3498db",
};

const ACTION_TYPES = [
  { value: "all", label: "Todas las acciones" },
  { value: "LOGIN", label: "Accesos al sistema" },
  { value: "USER", label: "Gestión de usuarios" },
  { value: "CERTIFICATION", label: "Certificaciones" },
  { value: "DOCUMENT", label: "Documentos" },
  { value: "SYSTEM", label: "Configuración del sistema" },
  { value: "SECURITY", label: "Seguridad" },
];

const USER_TYPES = [
  { value: "all", label: "Todos los usuarios" },
  { value: "admin", label: "Administradores" },
  { value: "comite", label: "Comité" },
  { value: "agente", label: "Agentes" },
  { value: "profesionista", label: "Profesionistas" },
  { value: "empresario", label: "Empresarios" },
];

const getSeverityColor = (severity) => {
  const map = {
    success: institutionalColors.success,
    info: institutionalColors.info,
    warning: institutionalColors.warning,
    error: institutionalColors.error,
  };
  return map[severity] || institutionalColors.textSecondary;
};

// Mapea el campo `accion` del backend a una severidad visual
const severityFromAccion = (accion = "") => {
  if (!accion) return "info";
  const a = accion.toUpperCase();
  if (
    a.includes("ERROR") ||
    a.includes("REJECT") ||
    a.includes("BLOQUEADO") ||
    a.includes("FALLIDO")
  )
    return "error";
  if (a.includes("UPDATE") || a.includes("CONFIG") || a.includes("CAMBIO"))
    return "warning";
  if (a.includes("CREATE") || a.includes("APPROVE") || a.includes("EXITOSO"))
    return "success";
  return "info";
};

const AuditLog = () => {
  const { user } = useAuth();

  // ── datos ──────────────────────────────────────────────────────────────────
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // ── filtros ────────────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const [filterInstancia, setFilterInstancia] = useState("all");
  const [instancias, setInstancias] = useState([]);

  // ── paginación ─────────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // ── modal detalle ──────────────────────────────────────────────────────────
  const [selectedLog, setSelectedLog] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // ── snackbar ───────────────────────────────────────────────────────────────
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ── export ─────────────────────────────────────────────────────────────────
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");
  const [exportScope, setExportScope] = useState("filtered");

  // ── carga inicial ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await auditoriaService.findAll();

      // Más recientes primero
      const sorted = [...data].sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha),
      );

      setAuditLogs(sorted);

      const uniqueInstancias = [
        ...new Map(
          sorted
            .filter((l) => l.idInstancia)
            .map((l) => [
              l.idInstancia,
              {
                id: l.idInstancia,
                name: l.nombreInstancia || `Instancia ${l.idInstancia}`,
              },
            ]),
        ).values(),
      ];
      setInstancias(uniqueInstancias);

      showSnackbar("Datos cargados correctamente", "success");
    } catch (error) {
      showSnackbar(error.message || "Error al cargar auditorías", "error");
    } finally {
      setLoading(false);
    }
  };
  // ── helpers ────────────────────────────────────────────────────────────────
  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  // ── filtrado ───────────────────────────────────────────────────────────────
  const filteredLogs = auditLogs.filter((log) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (log.nombreUsuario || "").toLowerCase().includes(term) ||
      (log.accion || "").toLowerCase().includes(term) ||
      (log.entidadTipo || "").toLowerCase().includes(term) ||
      (log.nombreInstancia || "").toLowerCase().includes(term) ||
      String(log.idEntidad || "").includes(term);

    const matchesType =
      filterType === "all" ||
      (log.accion || "").toUpperCase().includes(filterType);

    const matchesUser = filterUser === "all"; // el backend no devuelve rol de usuario; ampliar si se agrega al DTO

    const matchesInstancia =
      filterInstancia === "all" ||
      String(log.idInstancia) === String(filterInstancia);

    return matchesSearch && matchesType && matchesUser && matchesInstancia;
  });

  const paginatedLogs = filteredLogs.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  // ── export ─────────────────────────────────────────────────────────────────
  const exportLogs = (data, format) => {
    const exportData = data.map((log) => ({
      ID: log.idAuditoria,
      Fecha: log.fecha,
      Usuario: log.nombreUsuario || log.idUsuario,
      Instancia: log.nombreInstancia || log.idInstancia,
      Acción: log.accion,
      EntidadTipo: log.entidadTipo,
      IDEntidad: log.idEntidad,
      IP: log.ipOrigen,
      UserAgent: log.userAgent,
    }));

    let content = "";
    let fileName = `audit-logs-${new Date().toISOString().split("T")[0]}`;
    let mimeType = "";

    if (format === "csv") {
      const headers = Object.keys(exportData[0]).join(",");
      const rows = exportData
        .map((r) =>
          Object.values(r)
            .map((v) => `"${v ?? ""}"`)
            .join(","),
        )
        .join("\n");
      content = `${headers}\n${rows}`;
      mimeType = "text/csv";
      fileName += ".csv";
    } else if (format === "json") {
      content = JSON.stringify(exportData, null, 2);
      mimeType = "application/json";
      fileName += ".json";
    } else {
      content = exportData
        .map((r) =>
          Object.entries(r)
            .map(([k, v]) => `${k}: ${v ?? ""}`)
            .join("\n"),
        )
        .join("\n\n" + "=".repeat(50) + "\n\n");
      mimeType = "text/plain";
      fileName += ".txt";
    }

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

  const handleExportConfirm = () => {
    exportLogs(
      exportScope === "filtered" ? filteredLogs : auditLogs,
      exportFormat,
    );
    setExportDialogOpen(false);
    showSnackbar(
      `Exportado en formato ${exportFormat.toUpperCase()}`,
      "success",
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterUser("all");
    setFilterInstancia("all");
    setPage(1);
    showSnackbar("Filtros limpiados", "info");
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        bgcolor: institutionalColors.background,
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
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
              Auditoría y Trazabilidad
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: institutionalColors.textSecondary }}
            >
              Registro completo de todas las acciones realizadas en el sistema
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            {/* Exportar */}
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              size="small"
              onClick={(e) => setDownloadAnchorEl(e.currentTarget)}
              sx={{
                borderColor: institutionalColors.primary,
                color: institutionalColors.primary,
                "&:hover": {
                  borderColor: institutionalColors.secondary,
                  bgcolor: institutionalColors.lightBlue,
                },
              }}
            >
              Exportar
            </Button>
            <Menu
              anchorEl={downloadAnchorEl}
              open={Boolean(downloadAnchorEl)}
              onClose={() => setDownloadAnchorEl(null)}
            >
              {[
                ["csv", "CSV (Excel)", <TableChartIcon />],
                ["json", "JSON", <FileDownloadIcon />],
                ["txt", "TXT", <TextSnippetIcon />],
              ].map(([fmt, label, icon]) => (
                <MenuItem
                  key={fmt}
                  onClick={() => {
                    setExportFormat(fmt);
                    setExportDialogOpen(true);
                    setDownloadAnchorEl(null);
                  }}
                >
                  <ListItemIcon sx={{ color: institutionalColors.primary }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={label} />
                </MenuItem>
              ))}
            </Menu>

            {/* Actualizar */}
            <Button
              variant="contained"
              startIcon={
                loading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <RefreshIcon />
                )
              }
              size="small"
              onClick={fetchLogs}
              disabled={loading}
              sx={{
                bgcolor: institutionalColors.primary,
                "&:hover": { bgcolor: institutionalColors.secondary },
              }}
            >
              {loading ? "Cargando..." : "Actualizar"}
            </Button>
          </Stack>
        </Box>

        {/* ── Filtros ──────────────────────────────────────────────────────── */}
        <Paper
          elevation={0}
          sx={{ p: 2, bgcolor: "white", border: "1px solid #e5e7eb" }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
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

            <Grid item xs={12} md={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Acción</InputLabel>
                <Select
                  value={filterType}
                  label="Tipo de Acción"
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setPage(1);
                  }}
                >
                  {ACTION_TYPES.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Usuario</InputLabel>
                <Select
                  value={filterUser}
                  label="Tipo de Usuario"
                  onChange={(e) => {
                    setFilterUser(e.target.value);
                    setPage(1);
                  }}
                >
                  {USER_TYPES.map((u) => (
                    <MenuItem key={u.value} value={u.value}>
                      {u.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Instancia</InputLabel>
                <Select
                  value={filterInstancia}
                  label="Instancia"
                  onChange={(e) => {
                    setFilterInstancia(e.target.value);
                    setPage(1);
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <BusinessIcon
                        fontSize="small"
                        sx={{ color: institutionalColors.textSecondary }}
                      />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="all">Todas las instancias</MenuItem>
                  {instancias.map((ins) => (
                    <MenuItem key={ins.id} value={ins.id}>
                      {ins.name}
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
                onClick={clearFilters}
                sx={{
                  height: 40,
                  borderColor: institutionalColors.primary,
                  color: institutionalColors.primary,
                  "&:hover": { bgcolor: institutionalColors.lightBlue },
                }}
              >
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* ── Tabla ──────────────────────────────────────────────────────────── */}
      <Paper
        elevation={1}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #e5e7eb",
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
            {filteredLogs.length} eventos encontrados
          </Typography>
          <Stack direction="row" spacing={1}>
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

        <TableContainer sx={{ flex: 1 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "Fecha",
                  "Usuario",
                  "Acción",
                  "Instancia",
                  "Entidad / ID",
                  "IP",
                  "",
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
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress
                      sx={{ color: institutionalColors.primary }}
                    />
                  </TableCell>
                </TableRow>
              ) : paginatedLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 6, color: institutionalColors.textSecondary }}
                  >
                    No se encontraron registros
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLogs.map((log) => {
                  const severity = severityFromAccion(log.accion);
                  const color = getSeverityColor(severity);
                  return (
                    <TableRow
                      key={log.idAuditoria}
                      hover
                      sx={{
                        "&:hover": { bgcolor: institutionalColors.lightBlue },
                        borderLeft: `3px solid ${color}`,
                      }}
                    >
                      {/* Fecha */}
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: "bold",
                            color: institutionalColors.textPrimary,
                          }}
                        >
                          {log.fecha
                            ? new Date(log.fecha).toLocaleDateString("es-MX")
                            : "—"}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: institutionalColors.textSecondary }}
                        >
                          {log.fecha
                            ? new Date(log.fecha).toLocaleTimeString("es-MX")
                            : ""}
                        </Typography>
                      </TableCell>

                      {/* Usuario */}
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: institutionalColors.primary,
                              fontSize: "0.8rem",
                              fontWeight: "bold",
                            }}
                          >
                            {(log.nombreUsuario || "?").charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography
                            variant="body2"
                            sx={{ color: institutionalColors.textPrimary }}
                          >
                            {log.nombreUsuario || `ID: ${log.idUsuario}`}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Acción */}
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: institutionalColors.textPrimary,
                          }}
                        >
                          {log.accion}
                        </Typography>
                        <Chip
                          label={severity}
                          size="small"
                          sx={{
                            bgcolor: `${color}15`,
                            color,
                            fontSize: "0.65rem",
                            height: 18,
                            mt: 0.5,
                          }}
                        />
                      </TableCell>

                      {/* Instancia */}
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <BusinessIcon
                            fontSize="small"
                            sx={{ color: institutionalColors.primary }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ color: institutionalColors.textPrimary }}
                          >
                            {log.nombreInstancia ||
                              (log.idInstancia
                                ? `ID: ${log.idInstancia}`
                                : "—")}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Entidad */}
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ color: institutionalColors.textPrimary }}
                        >
                          {log.entidadTipo || "—"}
                        </Typography>
                        {log.idEntidad && (
                          <Typography
                            variant="caption"
                            sx={{ color: institutionalColors.textSecondary }}
                          >
                            ID: {log.idEntidad}
                          </Typography>
                        )}
                      </TableCell>

                      {/* IP */}
                      <TableCell>
                        <Typography
                          variant="caption"
                          sx={{ color: institutionalColors.textSecondary }}
                        >
                          {log.ipOrigen || "—"}
                        </Typography>
                      </TableCell>

                      {/* Acción ver detalle */}
                      <TableCell>
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            sx={{ color: institutionalColors.primary }}
                            onClick={() => {
                              setSelectedLog(log);
                              setModalOpen(true);
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #e5e7eb",
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
            Mostrando{" "}
            {Math.min((page - 1) * rowsPerPage + 1, filteredLogs.length)}–
            {Math.min(page * rowsPerPage, filteredLogs.length)} de{" "}
            {filteredLogs.length}
          </Typography>
          <Pagination
            count={Math.ceil(filteredLogs.length / rowsPerPage)}
            page={page}
            onChange={(_, v) => setPage(v)}
            size="small"
            color="primary"
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: institutionalColors.primary,
                color: "white",
              },
            }}
          />
        </Box>
      </Paper>

      {/* ── Modal detalle ──────────────────────────────────────────────────── */}
      <ActivityDetailModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedLog(null);
        }}
        activity={selectedLog}
      />

      {/* ── Diálogo export ─────────────────────────────────────────────────── */}
      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FileDownloadIcon sx={{ color: institutionalColors.primary }} />
            <Typography variant="h6">Exportar Logs</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Formato</FormLabel>
              <RadioGroup
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                {[
                  ["csv", "CSV (Excel)"],
                  ["json", "JSON"],
                  ["txt", "Texto plano"],
                ].map(([v, l]) => (
                  <FormControlLabel
                    key={v}
                    value={v}
                    control={<Radio />}
                    label={l}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">Alcance</FormLabel>
              <RadioGroup
                value={exportScope}
                onChange={(e) => setExportScope(e.target.value)}
              >
                <FormControlLabel
                  value="filtered"
                  control={<Radio />}
                  label={`Solo filtrados (${filteredLogs.length})`}
                />
                <FormControlLabel
                  value="all"
                  control={<Radio />}
                  label={`Todos (${auditLogs.length})`}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleExportConfirm}
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              bgcolor: institutionalColors.primary,
              "&:hover": { bgcolor: institutionalColors.secondary },
            }}
          >
            Exportar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ───────────────────────────────────────────────────────── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuditLog;
