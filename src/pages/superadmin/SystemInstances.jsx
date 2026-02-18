import React, { useState } from "react";
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

  // Datos de las instancias del sistema
  const systemInstances = [
    {
      id: 1,
      name: "Área de Ingeniería",
      code: "ENG-001",
      description: "Sistema de certificaciones para la Facultad de Ingeniería",
      status: "active",
      users: 245,
      certifications: 15,
      courses: 8,
      colors: {
        primary: "#1b5e20",
        secondary: "#4caf50",
        accent: "#8bc34a",
      },
      created: "10/01/2024",
      admin: "Dr. Carlos Méndez",
      email: "carlos.mendez@institucion.edu",
    },
    {
      id: 2,
      name: "Área de Medicina",
      code: "MED-001",
      description: "Sistema para certificaciones médicas y especialidades",
      status: "active",
      users: 189,
      certifications: 12,
      courses: 6,
      colors: {
        primary: "#0d47a1",
        secondary: "#2196f3",
        accent: "#64b5f6",
      },
      created: "15/03/2024",
      admin: "Dra. Ana López",
      email: "ana.lopez@institucion.edu",
    },
    {
      id: 3,
      name: "Programa de Posgrado",
      code: "POS-001",
      description: "Gestión de certificaciones para programas de posgrado",
      status: "maintenance",
      users: 78,
      certifications: 8,
      courses: 4,
      colors: {
        primary: "#4a148c",
        secondary: "#7b1fa2",
        accent: "#ba68c8",
      },
      created: "20/06/2024",
      admin: "Mtro. Roberto Díaz",
      email: "roberto.diaz@institucion.edu",
    },
    {
      id: 4,
      name: "Área de Derecho",
      code: "LAW-001",
      description: "Certificaciones y colegiaturas para abogados",
      status: "inactive",
      users: 156,
      certifications: 10,
      courses: 5,
      colors: {
        primary: "#bf360c",
        secondary: "#e64a19",
        accent: "#ff8a65",
      },
      created: "05/09/2024",
      admin: "Lic. Fernando Gómez",
      email: "fernando.gomez@institucion.edu",
    },
    {
      id: 5,
      name: "Campus Virtual",
      code: "VIR-001",
      description: "Plataforma de certificaciones en línea",
      status: "active",
      users: 342,
      certifications: 20,
      courses: 15,
      colors: {
        primary: "#00695c",
        secondary: "#009688",
        accent: "#4db6ac",
      },
      created: "12/11/2024",
      admin: "Ing. Sofía Ramírez",
      email: "sofia.ramirez@institucion.edu",
    },
    {
      id: 6,
      name: "Departamento de Ciencias",
      code: "SCI-001",
      description: "Certificaciones para ciencias básicas y aplicadas",
      status: "active",
      users: 198,
      certifications: 14,
      courses: 9,
      colors: {
        primary: "#827717",
        secondary: "#9e9d24",
        accent: "#cddc39",
      },
      created: "22/02/2024",
      admin: "Dr. Miguel Ángel Ruiz",
      email: "miguel.ruiz@institucion.edu",
    },
    {
      id: 7,
      name: "Programa de Extensión",
      code: "EXT-001",
      description: "Certificaciones para cursos de extensión universitaria",
      status: "draft",
      users: 45,
      certifications: 3,
      courses: 2,
      colors: {
        primary: "#37474f",
        secondary: "#546e7a",
        accent: "#78909c",
      },
      created: "30/12/2024",
      admin: "Lic. Patricia Castro",
      email: "patricia.castro@institucion.edu",
    },
    {
      id: 8,
      name: "Área de Arquitectura",
      code: "ARC-001",
      description: "Sistema para colegiaturas y certificaciones profesionales",
      status: "active",
      users: 167,
      certifications: 11,
      courses: 7,
      colors: {
        primary: "#3e2723",
        secondary: "#5d4037",
        accent: "#8d6e63",
      },
      created: "18/07/2024",
      admin: "Arq. Luis Fernando Morales",
      email: "luis.morales@institucion.edu",
    },
  ];

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
                                    setSelectedInstance(instance);
                                    setOpenViewDialog(true);
                                  }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>

                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedInstance(instance);
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
        onClose={() => setOpenCreateDialog(false)}
      />

      <ViewInstanceDialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        instance={selectedInstance}
      />

      <EditInstanceDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        instance={selectedInstance}
      />
    </Box>
  );
};

export default SystemInstances;
