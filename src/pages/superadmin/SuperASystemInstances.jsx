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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
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
  success: '#4caf50',      // Verde para éxito
  warning: '#ff9800',      // Naranja para advertencias
  error: '#f44336',        // Rojo para errores
  info: '#2196f3',         // Azul para información
};

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
  
  // Estados para diálogos de confirmación
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [statusAction, setStatusAction] = useState(null); // 'activate' o 'deactivate'
  const [actionInstance, setActionInstance] = useState(null);
  const [bulkAction, setBulkAction] = useState(false);
  
  // Estado para notificaciones
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Datos de las instancias del sistema (ahora como estado para poder modificarlas)
  const [systemInstances, setSystemInstances] = useState([
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
        primary: institutionalColors.success,
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
        primary: institutionalColors.primary,
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
      status: "active",
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
      status: "active",
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
  ]);

  const statusOptions = [
    { value: "all", label: "Todos los estados" },
    { value: "active", label: "Activas", color: institutionalColors.success },
    { value: "inactive", label: "Inactivas", color: institutionalColors.error },
    { value: "maintenance", label: "En mantenimiento", color: institutionalColors.warning },
    { value: "draft", label: "Borrador", color: "#9e9e9e" },
  ];

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

  // Función para cambiar el estado de una instancia
  const handleStatusChange = (instance, action) => {
    setActionInstance(instance);
    setStatusAction(action);
    setBulkAction(false);
    setOpenStatusDialog(true);
  };

  // Función para cambiar el estado de múltiples instancias
  const handleBulkStatusChange = (action) => {
    if (selectedRows.length === 0) {
      setSnackbar({
        open: true,
        message: 'Selecciona al menos una instancia',
        severity: 'warning'
      });
      return;
    }
    setStatusAction(action);
    setBulkAction(true);
    setOpenStatusDialog(true);
  };

  // Función para confirmar el cambio de estado
  const confirmStatusChange = () => {
    if (bulkAction) {
      // Acción masiva
      setSystemInstances(prevInstances => 
        prevInstances.map(instance => {
          if (selectedRows.includes(instance.id)) {
            const newStatus = statusAction === 'activate' ? 'active' : 'inactive';
            return { ...instance, status: newStatus };
          }
          return instance;
        })
      );

      const actionText = statusAction === 'activate' ? 'activadas' : 'desactivadas';
      setSnackbar({
        open: true,
        message: `${selectedRows.length} instancias ${actionText} correctamente`,
        severity: 'success'
      });
      setSelectedRows([]);
    } else if (actionInstance) {
      // Acción individual
      setSystemInstances(prevInstances => 
        prevInstances.map(instance => {
          if (instance.id === actionInstance.id) {
            const newStatus = statusAction === 'activate' ? 'active' : 'inactive';
            return { ...instance, status: newStatus };
          }
          return instance;
        })
      );

      const actionText = statusAction === 'activate' ? 'activada' : 'desactivada';
      setSnackbar({
        open: true,
        message: `Instancia ${actionText} correctamente`,
        severity: 'success'
      });
    }

    setOpenStatusDialog(false);
    setActionInstance(null);
    setStatusAction(null);
    setBulkAction(false);
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
              Super Administración - Instancias del Sistema
            </Typography>
            <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
              Gestión de múltiples áreas, programas y entidades independientes
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              onClick={handleCreateInstance}
              sx={{
                bgcolor: institutionalColors.primary,
                '&:hover': { bgcolor: institutionalColors.secondary }
              }}
            >
              Nueva Instancia
            </Button>
          </Stack>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 2, border: `1px solid #e5e7eb` }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root.Mui-selected': {
                color: institutionalColors.primary,
              },
              '& .MuiTabs-indicator': {
                backgroundColor: institutionalColors.primary,
              }
            }}
          >
            <Tab icon={<DomainIcon />} label="Todas las Instancias" />
          </Tabs>
        </Paper>

        {/* Filtros y búsqueda */}
        <Paper elevation={0} sx={{ p: 2, bgcolor: "white", border: `1px solid #e5e7eb` }}>
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
                      <SearchIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ '&.Mui-focused': { color: institutionalColors.primary } }}>Estado</InputLabel>
                <Select
                  value={filterStatus}
                  label="Estado"
                  onChange={(e) => setFilterStatus(e.target.value)}
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: institutionalColors.primary,
                    }
                  }}
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
                sx={{
                  borderColor: institutionalColors.primary,
                  color: institutionalColors.primary,
                  '&:hover': {
                    borderColor: institutionalColors.secondary,
                    bgcolor: institutionalColors.lightBlue,
                  }
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
              border: `1px solid #e5e7eb`,
            }}
          >
            <Toolbar
              sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                bgcolor: alpha(institutionalColors.primary, 0.05),
              }}
            >
              <Box sx={{ flex: "1 1 100%" }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: institutionalColors.textPrimary }}>
                  Instancias del Sistema
                </Typography>
                <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                  {filteredInstances.length} instancias encontradas
                </Typography>
              </Box>

              {selectedRows.length > 0 && (
                <Stack direction="row" spacing={1}>
                  <Typography
                    variant="body2"
                    sx={{ color: institutionalColors.primary, display: "flex", alignItems: "center" }}
                  >
                    {selectedRows.length} seleccionados
                  </Typography>
                  <Tooltip title="Activar seleccionadas">
                    <IconButton 
                      size="small"
                      onClick={() => handleBulkStatusChange('activate')}
                      sx={{ color: institutionalColors.primary }}
                    >
                      <EnableIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Desactivar seleccionadas">
                    <IconButton 
                      size="small"
                      onClick={() => handleBulkStatusChange('deactivate')}
                      sx={{ color: institutionalColors.primary }}
                    >
                      <DisableIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar seleccionadas">
                    <IconButton size="small" sx={{ color: institutionalColors.error }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
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
                        sx={{
                          color: institutionalColors.primary,
                          '&.Mui-checked': {
                            color: institutionalColors.primary,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: institutionalColors.primary, fontWeight: 'bold' }}>Instancia</TableCell>
                    <TableCell sx={{ color: institutionalColors.primary, fontWeight: 'bold' }}>Estado</TableCell>
                    <TableCell align="center" sx={{ color: institutionalColors.primary, fontWeight: 'bold' }}>Usuarios</TableCell>
                    <TableCell align="center" sx={{ color: institutionalColors.primary, fontWeight: 'bold' }}>Certificaciones</TableCell>
                    <TableCell sx={{ color: institutionalColors.primary, fontWeight: 'bold' }}>Administrador</TableCell>
                    <TableCell align="center" sx={{ color: institutionalColors.primary, fontWeight: 'bold' }}>Acciones</TableCell>
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
                            <Checkbox 
                              checked={isItemSelected}
                              sx={{
                                color: institutionalColors.primary,
                                '&.Mui-checked': {
                                  color: institutionalColors.primary,
                                },
                              }}
                            />
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
                                <Typography variant="body2" fontWeight="bold" sx={{ color: institutionalColors.textPrimary }}>
                                  {instance.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: institutionalColors.textSecondary }}
                                >
                                  {instance.code} • {instance.description}
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
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                              }}
                            >
                              <PersonIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                              <Typography variant="body2" fontWeight="bold" sx={{ color: institutionalColors.textPrimary }}>
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
                              <BookIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                              <Typography variant="body2" fontWeight="bold" sx={{ color: institutionalColors.textPrimary }}>
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
                                  bgcolor: institutionalColors.primary,
                                }}
                              >
                                {instance.admin.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                                  {instance.admin}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: institutionalColors.textSecondary }}
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
                                  sx={{ color: institutionalColors.primary }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Editar">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
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
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(instance, 'activate');
                                    }}
                                    sx={{ color: institutionalColors.success }}
                                  >
                                    <EnableIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              ) : instance.status === "active" ? (
                                <Tooltip title="Desactivar">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(instance, 'deactivate');
                                    }}
                                    sx={{ color: institutionalColors.error }}
                                  >
                                    <DisableIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              ) : null}
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
                            sx={{ fontSize: 60, color: institutionalColors.textSecondary, mb: 2 }}
                          />
                          <Typography
                            variant="body1"
                            sx={{ color: institutionalColors.textSecondary }}
                            gutterBottom
                          >
                            No se encontraron instancias
                          </Typography>
                          <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
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
              sx={{
                '& .MuiTablePagination-select': {
                  color: institutionalColors.textPrimary,
                },
                '& .MuiTablePagination-selectLabel': {
                  color: institutionalColors.textPrimary,
                },
                '& .MuiTablePagination-displayedRows': {
                  color: institutionalColors.textPrimary,
                },
                '& .MuiTablePagination-actions button': {
                  color: institutionalColors.primary,
                },
              }}
            />
          </Paper>
        </Box>
      )}

      {/* Diálogo de confirmación para cambiar estado */}
      <Dialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
      >
        <DialogTitle>
          <Typography sx={{ color: institutionalColors.textPrimary }}>
            {statusAction === 'activate' ? 'Activar' : 'Desactivar'} {bulkAction ? 'instancias' : 'instancia'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: institutionalColors.textSecondary }}>
            {bulkAction ? (
              `¿Estás seguro de que deseas ${statusAction === 'activate' ? 'activar' : 'desactivar'} las ${selectedRows.length} instancias seleccionadas?`
            ) : (
              `¿Estás seguro de que deseas ${statusAction === 'activate' ? 'activar' : 'desactivar'} la instancia "${actionInstance?.name}"?`
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)} sx={{ color: institutionalColors.textSecondary }}>Cancelar</Button>
          <Button 
            onClick={confirmStatusChange} 
            variant="contained" 
            sx={{
              bgcolor: statusAction === 'activate' ? institutionalColors.success : institutionalColors.error,
              '&:hover': {
                bgcolor: statusAction === 'activate' ? '#3d8b40' : '#d32f2f',
              }
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

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