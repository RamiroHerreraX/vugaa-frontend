import React, { useState, useEffect } from "react";
import {
  Box, Paper, Typography, TextField, Button, Grid, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Stack, IconButton,
  Tooltip, InputAdornment, FormControl, InputLabel, Select, Avatar,
  Pagination, Alert, Snackbar, Menu, ListItemIcon, ListItemText, Dialog,
  DialogTitle, DialogContent, DialogActions, Radio, RadioGroup,
  FormControlLabel, FormLabel, CircularProgress, MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon, Download as DownloadIcon,
  Visibility as VisibilityIcon, Refresh as RefreshIcon,
  Business as BusinessIcon, FileDownload as FileDownloadIcon,
  TableChart as TableChartIcon, TextSnippet as TextSnippetIcon,
} from "@mui/icons-material";
import ActivityDetailModal from "../../components/audit/ActivityDetailModal";
import auditoriaService from "../../services/auditoriaService";
import { useAuth } from "../../context/AuthContext";

const institutionalColors = {
  primary: "#133B6B", secondary: "#1a4c7a", background: "#f8f9fa",
  lightBlue: "rgba(19, 59, 107, 0.08)", textPrimary: "#2c3e50",
  textSecondary: "#7f8c8d", success: "#27ae60", warning: "#f39c12",
  error: "#e74c3c", info: "#3498db",
};

const KNOWN_ACTION_PREFIXES = {
  LOGIN:         "Accesos al sistema",
  USUARIO:       "Usuarios",
  ASOCIACION:    "Asociaciones",
  DOCUMENTO:     "Documentos",
  INSTANCIA:     "Instancias",
  ROL:           "Roles",
  REGION:        "Regiones",
  APARTADO:      "Apartados",
  PROGRAMA:      "Programas",
  PERFIL:        "Perfiles",
  EXPEDIENTE:    "Expedientes",
  CERTIFICACION: "Certificaciones",
  NOTIFICACION:  "Notificaciones",
  AUDITORIA:     "Auditoría",
  SISTEMA:       "Sistema",
  SEGURIDAD:     "Seguridad",
};

const getRolColor = (rol = "") => {
  const r = rol.toUpperCase();
  if (r.includes("SUPER"))     return "#8e44ad";
  if (r.includes("ADMIN"))     return institutionalColors.success;
  if (r.includes("COMITE"))    return institutionalColors.primary;
  if (r.includes("AGENTE"))    return "#526F78";
  if (r.includes("PROFESION")) return "#2ecc71";
  if (r.includes("EMPRESA"))   return "#ed6c02";
  if (r.includes("ASOCIA"))    return "#16a085";
  return institutionalColors.textSecondary;
};

const getSeverityColor = (severity) => ({
  success: institutionalColors.success,
  info:    institutionalColors.info,
  warning: institutionalColors.warning,
  error:   institutionalColors.error,
}[severity] || institutionalColors.textSecondary);

const severityFromAccion = (accion = "") => {
  if (!accion) return "info";
  const a = accion.toUpperCase();
  if (a.includes("ELIMINAD") || a.includes("ERROR") || a.includes("RECHAZ") ||
      a.includes("BLOQUEADO") || a.includes("FALLIDO"))             return "error";
  if (a.includes("ACTUALIZ") || a.includes("CAMBIO") || a.includes("DESACTIV") ||
      a.includes("CONFIG"))                                          return "warning";
  if (a.includes("CREAD") || a.includes("APROBAD") || a.includes("COMPLETAD") ||
      a.includes("ACTIVAD") || a.includes("EXITOSO"))               return "success";
  return "info";
};

const getPrefijo = (accion = "") => accion.split("_")[0].toUpperCase();

const AuditLog = () => {
  const { user } = useAuth();

  const [auditLogs,       setAuditLogs]       = useState([]);
  const [loading,         setLoading]         = useState(false);
  const [searchTerm,      setSearchTerm]      = useState("");
  const [filterType,      setFilterType]      = useState("all");
  const [filterRol,       setFilterRol]       = useState("all");
  const [actionTypes,     setActionTypes]     = useState([{ value: "all", label: "Todas las acciones" }]);
  const [roleTypes,       setRoleTypes]       = useState([{ value: "all", label: "Todos los roles" }]);
  const [page,            setPage]            = useState(1);
  const rowsPerPage = 10;

  const [selectedLog,      setSelectedLog]      = useState(null);
  const [modalOpen,        setModalOpen]        = useState(false);
  const [snackbar,         setSnackbar]         = useState({ open: false, message: "", severity: "success" });
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat,     setExportFormat]     = useState("csv");
  const [exportScope,      setExportScope]      = useState("filtered");

  // Información de la instancia actual
  const [instanciaInfo, setInstanciaInfo] = useState({ id: null, nombre: null });

  useEffect(() => {
    if (user) {
      console.log("Usuario en AuditLog:", user);
      console.log("ID de instancia del usuario:", user.instanciaId);
      
      if (user.instanciaId) {
        setInstanciaInfo({
          id: user.instanciaId,
          nombre: user.instanciaNombre || `Instancia ${user.instanciaId}`
        });
        fetchLogsByInstancia(user.instanciaId);
      } else {
        console.warn("Usuario autenticado pero sin instanciaId:", user);
        showSnackbar("El usuario no tiene una instancia asignada", "warning");
        setLoading(false);
      }
    }
  }, [user]);

  const fetchLogsByInstancia = async (idInstancia) => {
    setLoading(true);
    try {
      console.log("Cargando logs para instancia:", idInstancia);
      const data = await auditoriaService.findByInstancia(idInstancia);
      console.log("Datos recibidos:", data);
      
      const sorted = [...data].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setAuditLogs(sorted);

      // Action types dinámicos
      const prefijosEncontrados = [...new Set(sorted.map(l => getPrefijo(l.accion)).filter(Boolean))];
      setActionTypes([
        { value: "all", label: "Todas las acciones" },
        ...prefijosEncontrados.map(p => ({
          value: p,
          label: KNOWN_ACTION_PREFIXES[p] || p.charAt(0) + p.slice(1).toLowerCase(),
        })).sort((a, b) => a.label.localeCompare(b.label)),
      ]);

      // Roles dinámicos desde nombreRol del DTO
      const rolesEncontrados = [
        ...new Set(
          sorted
            .map(l => l.nombreRol)
            .filter(Boolean)
        ),
      ].sort();
      setRoleTypes([
        { value: "all", label: "Todos los roles" },
        ...rolesEncontrados.map(r => ({ value: r, label: r })),
      ]);
      
      showSnackbar("Datos cargados correctamente", "success");
    } catch (error) {
      console.error("Error al cargar logs:", error);
      showSnackbar(error.message || "Error al cargar auditorías", "error");
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  // Filtrado (sin filtro de instancia)
  const filteredLogs = auditLogs.filter((log) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      (log.nombreUsuario   || "").toLowerCase().includes(term) ||
      (log.accion          || "").toLowerCase().includes(term) ||
      (log.entidadTipo     || "").toLowerCase().includes(term) ||
      (log.nombreInstancia || "").toLowerCase().includes(term) ||
      (log.nombreRol       || "").toLowerCase().includes(term) ||
      (log.valorNuevo?.descripcion || "").toLowerCase().includes(term) ||
      String(log.idEntidad || "").includes(term);

    const matchesType =
      filterType === "all" || getPrefijo(log.accion) === filterType;

    const matchesRol =
      filterRol === "all" || (log.nombreRol || "") === filterRol;

    return matchesSearch && matchesType && matchesRol;
  });

  const paginatedLogs = filteredLogs.slice(
    (page - 1) * rowsPerPage, page * rowsPerPage
  );

  // Export
  const exportLogs = (data, format) => {
    const exportData = data.map((log) => ({
      ID:          log.idAuditoria,
      Fecha:       log.fecha,
      Usuario:     log.nombreUsuario  || log.idUsuario,
      Rol:         log.nombreRol      || "—",
      Instancia:   log.nombreInstancia || log.idInstancia,
      Acción:      log.accion,
      EntidadTipo: log.entidadTipo,
      IDEntidad:   log.idEntidad,
      Descripcion: log.valorNuevo?.descripcion || "—",
      IP:          log.ipOrigen,
      UserAgent:   log.userAgent,
    }));

    let content = ""; let mimeType = "";
    let fileName = `audit-logs-${new Date().toISOString().split("T")[0]}`;

    if (format === "csv") {
      const headers = Object.keys(exportData[0]).join(",");
      const rows    = exportData.map(r => Object.values(r).map(v => `"${v ?? ""}"`).join(",")).join("\n");
      content = `${headers}\n${rows}`; mimeType = "text/csv"; fileName += ".csv";
    } else if (format === "json") {
      content = JSON.stringify(exportData, null, 2); mimeType = "application/json"; fileName += ".json";
    } else {
      content = exportData.map(r => Object.entries(r).map(([k,v]) => `${k}: ${v ?? ""}`).join("\n"))
                          .join("\n\n" + "=".repeat(50) + "\n\n");
      mimeType = "text/plain"; fileName += ".txt";
    }

    const blob = new Blob([content], { type: mimeType });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = fileName;
    document.body.appendChild(link); link.click();
    document.body.removeChild(link); URL.revokeObjectURL(url);
  };

  const handleExportConfirm = () => {
    exportLogs(exportScope === "filtered" ? filteredLogs : auditLogs, exportFormat);
    setExportDialogOpen(false);
    showSnackbar(`Exportado en formato ${exportFormat.toUpperCase()}`, "success");
  };

  const clearFilters = () => {
    setSearchTerm(""); 
    setFilterType("all"); 
    setFilterRol("all");
    setPage(1);
    showSnackbar("Filtros limpiados", "info");
  };

  // Función para refrescar los datos
  const handleRefresh = () => {
    if (user?.instanciaId) {
      fetchLogsByInstancia(user.instanciaId);
    }
  };

  // Si está cargando el usuario, mostrar indicador de carga
  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress sx={{ color: institutionalColors.primary }} />
      </Box>
    );
  }

  // Render
  return (
    <Box sx={{ bgcolor: institutionalColors.background, minHeight: "100%", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: institutionalColors.primary, fontWeight: "bold", mb: 0.5 }}>
              Auditoría y Trazabilidad
            </Typography>
            <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
              {instanciaInfo.id ? 
                `Registro de acciones de la instancia: ${instanciaInfo.nombre}` :
                "Registro de acciones del sistema"
              }
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<DownloadIcon />} size="small"
              onClick={(e) => setDownloadAnchorEl(e.currentTarget)}
              sx={{ borderColor: institutionalColors.primary, color: institutionalColors.primary,
                    "&:hover": { borderColor: institutionalColors.secondary, bgcolor: institutionalColors.lightBlue } }}>
              Exportar
            </Button>
            <Menu anchorEl={downloadAnchorEl} open={Boolean(downloadAnchorEl)} onClose={() => setDownloadAnchorEl(null)}>
              {[["csv","CSV (Excel)",<TableChartIcon />],["json","JSON",<FileDownloadIcon />],["txt","TXT",<TextSnippetIcon />]]
                .map(([fmt, label, icon]) => (
                  <MenuItem key={fmt} onClick={() => { setExportFormat(fmt); setExportDialogOpen(true); setDownloadAnchorEl(null); }}>
                    <ListItemIcon sx={{ color: institutionalColors.primary }}>{icon}</ListItemIcon>
                    <ListItemText primary={label} />
                  </MenuItem>
                ))}
            </Menu>

            <Button variant="contained" size="small" onClick={handleRefresh} disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
              sx={{ bgcolor: institutionalColors.primary, "&:hover": { bgcolor: institutionalColors.secondary } }}>
              {loading ? "Cargando..." : "Actualizar"}
            </Button>
          </Stack>
        </Box>

        {/* Filtros - Sin filtro de instancia */}
        <Paper elevation={0} sx={{ p: 2, bgcolor: "white", border: "1px solid #e5e7eb" }}>
          <Grid container spacing={2} alignItems="center">

            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" placeholder="Buscar por usuario, acción, entidad..." value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                InputProps={{ startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                  </InputAdornment>
                )}}
              />
            </Grid>

            <Grid item xs={12} md={3.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Acción</InputLabel>
                <Select value={filterType} label="Tipo de Acción"
                  onChange={(e) => { setFilterType(e.target.value); setPage(1); }}>
                  {actionTypes.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Rol</InputLabel>
                <Select value={filterRol} label="Rol"
                  onChange={(e) => { setFilterRol(e.target.value); setPage(1); }}>
                  {roleTypes.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={1}>
              <Button fullWidth variant="outlined" size="small" onClick={clearFilters}
                sx={{ height: 40, borderColor: institutionalColors.primary, color: institutionalColors.primary,
                      "&:hover": { bgcolor: institutionalColors.lightBlue } }}>
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Tabla */}
      <Paper elevation={1} sx={{ flex: 1, display: "flex", flexDirection: "column",
                                  border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #e5e7eb", display: "flex",
                   justifyContent: "space-between", alignItems: "center", bgcolor: "white" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: institutionalColors.textPrimary }}>
            {filteredLogs.length} eventos encontrados
          </Typography>
          <Chip label={`${paginatedLogs.length} mostrados`} size="small" variant="outlined"
            sx={{ borderColor: institutionalColors.textSecondary, color: institutionalColors.textSecondary }} />
        </Box>

        <TableContainer sx={{ flex: 1 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["Fecha", "Usuario / Rol", "Acción", "Instancia", "Entidad / ID", "IP", ""].map(h => (
                  <TableCell key={h} sx={{ fontWeight: "bold", color: institutionalColors.primary }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress sx={{ color: institutionalColors.primary }} />
                  </TableCell>
                </TableRow>
              ) : paginatedLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: institutionalColors.textSecondary }}>
                    No se encontraron registros para esta instancia
                  </TableCell>
                </TableRow>
              ) : paginatedLogs.map((log) => {
                const severity = severityFromAccion(log.accion);
                const color    = getSeverityColor(severity);
                const rol      = log.nombreRol || null;
                const rolColor = rol ? getRolColor(rol) : institutionalColors.textSecondary;

                return (
                  <TableRow key={log.idAuditoria} hover
                    sx={{ "&:hover": { bgcolor: institutionalColors.lightBlue }, borderLeft: `3px solid ${color}` }}>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: "bold", color: institutionalColors.textPrimary }}>
                        {log.fecha ? new Date(log.fecha).toLocaleDateString("es-MX") : "—"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                        {log.fecha ? new Date(log.fecha).toLocaleTimeString("es-MX") : ""}
                      </Typography>
                    </TableCell>

                    {/* Usuario + Rol */}
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32,
                          bgcolor: rol ? rolColor : institutionalColors.primary,
                          fontSize: "0.8rem", fontWeight: "bold" }}>
                          {(log.nombreUsuario || "?").charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                            {log.nombreUsuario || `ID: ${log.idUsuario}`}
                          </Typography>
                          {rol && (
                            <Chip label={rol} size="small"
                              sx={{ height: 18, fontSize: "0.6rem", mt: 0.3,
                                    bgcolor: rolColor + "20", color: rolColor,
                                    border: `1px solid ${rolColor}40` }} />
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: institutionalColors.textPrimary }}>
                        {log.accion}
                      </Typography>
                      <Chip label={severity} size="small"
                        sx={{ bgcolor: `${color}15`, color, fontSize: "0.65rem", height: 18, mt: 0.5 }} />
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <BusinessIcon fontSize="small" sx={{ color: institutionalColors.primary }} />
                        <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                          {log.nombreInstancia || (log.idInstancia ? `ID: ${log.idInstancia}` : "—")}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                        {log.entidadTipo || "—"}
                      </Typography>
                      {log.idEntidad && (
                        <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                          ID: {log.idEntidad}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                        {log.ipOrigen || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Tooltip title="Ver detalles">
                        <IconButton size="small" sx={{ color: institutionalColors.primary }}
                          onClick={() => { setSelectedLog(log); setModalOpen(true); }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ p: 2, borderTop: "1px solid #e5e7eb", display: "flex",
                   justifyContent: "space-between", alignItems: "center", bgcolor: "white" }}>
          <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
            Mostrando {Math.min((page - 1) * rowsPerPage + 1, filteredLogs.length)}–
            {Math.min(page * rowsPerPage, filteredLogs.length)} de {filteredLogs.length}
          </Typography>
          <Pagination count={Math.ceil(filteredLogs.length / rowsPerPage)} page={page}
            onChange={(_, v) => setPage(v)} size="small" color="primary"
            sx={{ "& .MuiPaginationItem-root.Mui-selected": { bgcolor: institutionalColors.primary, color: "white" } }} />
        </Box>
      </Paper>

      <ActivityDetailModal open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedLog(null); }}
        activity={selectedLog} />

      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
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
              <RadioGroup value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
                {[["csv","CSV (Excel)"],["json","JSON"],["txt","Texto plano"]].map(([v,l]) => (
                  <FormControlLabel key={v} value={v} control={<Radio />} label={l} />
                ))}
              </RadioGroup>
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">Alcance</FormLabel>
              <RadioGroup value={exportScope} onChange={(e) => setExportScope(e.target.value)}>
                <FormControlLabel value="filtered" control={<Radio />} label={`Solo filtrados (${filteredLogs.length})`} />
                <FormControlLabel value="all"      control={<Radio />} label={`Todos (${auditLogs.length})`} />
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleExportConfirm} variant="contained" startIcon={<DownloadIcon />}
            sx={{ bgcolor: institutionalColors.primary, "&:hover": { bgcolor: institutionalColors.secondary } }}>
            Exportar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar(p => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(p => ({ ...p, open: false }))} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuditLog;