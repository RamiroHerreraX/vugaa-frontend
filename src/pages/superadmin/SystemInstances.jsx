import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
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
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TablePagination,
  Toolbar,
  alpha,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  PlayArrow as EnableIcon,
  Pause as DisableIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Domain as DomainIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Book as BookIcon,
} from "@mui/icons-material";
import CreateInstanceDialog from "../../components/Instancias/CreateInstanceDialog";
import ViewInstanceDialog from "../../components/Instancias/ViewInstanceDialog";
import EditInstanceDialog from "../../components/Instancias/EditInstanceDialog";
import { getInstancias } from "../../services/Instancia";

const SystemInstances = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTab, setSelectedTab] = useState(0);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [systemInstances, setSystemInstances] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadInstancias = async () => {
    try {
      setLoading(true);

      const data = await getInstancias();

      // convertir formato backend → frontend
      const formatted = data.map((inst) => ({
        id: inst.id,

        // formato frontend (tabla)
        name: inst.nombre,
        code: inst.codigo,
        description: inst.descripcion || "",
        status: inst.estado || "draft",
        users: inst.totalUsuarios || 0,
        certifications: inst.totalCertificaciones || 0,
        courses: inst.totalCursos || 0,
        admin: inst.adminNombre || "Sin asignar",
        email: inst.adminEmail || "",
        created: inst.fechaCreacion
          ? new Date(inst.fechaCreacion).toLocaleDateString()
          : "",

        colors: {
          primary: inst.colorPrimario || "#1976d2",
          secondary: inst.colorSecundario || "#ff9800",
          accent: inst.colorAcento || "#4caf50",
        },

        // 👇 IMPORTANTE: guardar original backend
        original: inst,
      }));

      setSystemInstances(formatted);
    } catch (error) {
      console.error("Error cargando instancias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstancias();
  }, []);

  const statusOptions = [
    { value: "all", label: "Todos los estados" },
    { value: "active", label: "Activas", color: "#4caf50" },
    { value: "inactive", label: "Inactivas", color: "#f44336" },
    { value: "maintenance", label: "En mantenimiento", color: "#ff9800" },
    { value: "draft", label: "Borrador", color: "#9e9e9e" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#4caf50";
      case "inactive":
        return "#f44336";
      case "maintenance":
        return "#ff9800";
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

  const filteredInstances = systemInstances.filter((instance) => {
    const matchesSearch =
      instance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.admin.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ? true : instance.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleCreateInstance = () => {
    setOpenCreateDialog(true);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredInstances.map((n) => n.id);
      setSelectedRows(newSelected);
      return;
    }
    setSelectedRows([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }

    setSelectedRows(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selectedRows.indexOf(id) !== -1;

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
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
              sx={{ color: "#2c3e50", fontWeight: "bold", mb: 0.5 }}
            >
              Super Administración - Instancias del Sistema
            </Typography>
            <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
              Gestión de múltiples áreas, programas y entidades independientes
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              onClick={handleCreateInstance}
            >
              Nueva Instancia
            </Button>
          </Stack>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 2 }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<DomainIcon />} label="Todas las Instancias" />
          </Tabs>
        </Paper>

        {/* Filtros y búsqueda */}
        <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8f9fa" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar por nombre, código, administrador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filterStatus}
                  label="Estado"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {option.color && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: option.color,
                            }}
                          />
                        )}
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setSelectedRows([]);
                }}
              >
                Limpiar Filtros
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Contenido principal */}
      {selectedTab === 0 && (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Tabla de instancias */}
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Toolbar
              sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              }}
            >
              <Box sx={{ flex: "1 1 100%" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Instancias del Sistema
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {filteredInstances.length} instancias encontradas
                </Typography>
              </Box>

              {selectedRows.length > 0 && (
                <Stack direction="row" spacing={1}>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {selectedRows.length} seleccionados
                  </Typography>
                  <IconButton size="small">
                    <EnableIcon />
                  </IconButton>
                  <IconButton size="small">
                    <DisableIcon />
                  </IconButton>
                  <IconButton size="small">
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              )}
            </Toolbar>

            <TableContainer sx={{ flex: 1 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedRows.length > 0 &&
                          selectedRows.length < filteredInstances.length
                        }
                        checked={
                          filteredInstances.length > 0 &&
                          selectedRows.length === filteredInstances.length
                        }
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    <TableCell>Instancia</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="center">Usuarios</TableCell>
                    <TableCell align="center">Certificaciones</TableCell>
                    <TableCell>Administrador</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInstances
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((instance) => {
                      const isItemSelected = isSelected(instance.id);

                      return (
                        <TableRow
                          hover
                          key={instance.id}
                          selected={isItemSelected}
                          onClick={(event) => handleClick(event, instance.id)}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} />
                          </TableCell>

                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
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
                                <Typography variant="body2" fontWeight="bold">
                                  {instance.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {instance.code} • {instance.description}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  <CalendarIcon
                                    sx={{
                                      fontSize: "0.8rem",
                                      verticalAlign: "middle",
                                      mr: 0.5,
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
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                              }}
                            >
                              <PersonIcon fontSize="small" color="action" />
                              <Typography variant="body2" fontWeight="bold">
                                {instance.users}
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
                              <BookIcon fontSize="small" color="action" />
                              <Typography variant="body2" fontWeight="bold">
                                {instance.certifications}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 28,
                                  height: 28,
                                  fontSize: "0.8rem",
                                }}
                              >
                                {instance.admin.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2">
                                  {instance.admin}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {instance.email}
                                </Typography>
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedInstance(instance.original); // 👈 usar original
                                    setOpenViewDialog(true);
                                  }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Editar instancia">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedInstance(instance.original); // 👈 usar original
                                    setOpenEditDialog(true);
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                  {filteredInstances.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Box sx={{ textAlign: "center" }}>
                          <DomainIcon
                            sx={{ fontSize: 60, color: "#e0e0e0", mb: 2 }}
                          />
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            gutterBottom
                          >
                            No se encontraron instancias
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Intenta con otros términos de búsqueda o filtros
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
            />
          </Paper>
        </Box>
      )}

      {/* Diálogo de creación */}
      <CreateInstanceDialog
        open={openCreateDialog}
        onClose={() => {
          setOpenCreateDialog(false);
          loadInstancias(); // refrescar tabla
        }}
      />

      <ViewInstanceDialog
        open={openViewDialog}
        onClose={() => {
          setOpenViewDialog(false);
          setSelectedInstance(null);
        }}
        instance={selectedInstance}
      />

      <EditInstanceDialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedInstance(null);
        }}
        instance={selectedInstance}
      />
    </Box>
  );
};

export default SystemInstances;
