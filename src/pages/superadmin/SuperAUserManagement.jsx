import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
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
  Switch,
  FormControlLabel,
  LinearProgress,
  Tabs,
  Tab,
  Pagination,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationIcon,
  Security as SecurityIcon,
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  SwapHoriz as SwapHorizIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import usuarioService from "../../services/usuarioService";
import rolService from "../../services/rol";
import regionesService from "../../services/regiones";
import UserViewModal from "../../components/usuarioSuper/UserViewModal";
import { getInstancias, cambiarInstanciaUsuario } from "../../services/Instancia";
import CreateUserModal from "../../components/usuarioSuper/CreateUserModal"; // <-- Importamos el nuevo modal

const colors = {
  primary: { dark: "#0D2A4D", main: "#133B6B", light: "#3A6EA5" },
  secondary: { main: "#00A8A8", light: "#00C2D1" },
  accents: { blue: "#0099FF", purple: "#6C5CE7" },
  status: { success: "#00A8A8", error: "#0099FF", info: "#3A6EA5" },
  text: { primary: "#0D2A4D", secondary: "#3A6EA5" },
};

// Función para normalizar y comparar si es rol comité
const esRolComite = (rolNombre) => {
  if (!rolNombre) return false;
  const normalizado = rolNombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
  return normalizado === "COMITE";
};

const getRoleColor = (rolNombre) => {
  if (!rolNombre) return colors.text.secondary;
  if (esRolComite(rolNombre)) return colors.accents.purple;
  switch (rolNombre.toLowerCase()) {
    case "administrador":
      return colors.primary.dark;
    case "agente aduanal":
      return colors.primary.main;
    case "profesionista":
      return colors.accents.blue;
    case "empresario":
      return colors.secondary.main;
    default:
      return colors.accents.blue;
  }
};

// Modal para cambiar instancia
const ChangeInstanciaModal = ({ open, onClose, user, onSave, availableInstancias }) => {
  const [selectedInstancia, setSelectedInstancia] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedInstancia(user.instanciaId?.toString() || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!selectedInstancia) {
      return;
    }
    setLoading(true);
    try {
      await onSave(user.id, parseInt(selectedInstancia));
      onClose();
    } catch (error) {
      console.error("Error al cambiar instancia:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: 'bold' }}>
          Cambiar Instancia
        </Typography>
        <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 0.5 }}>
          Usuario: {user.nombre}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Seleccionar Instancia</InputLabel>
          <Select
            value={selectedInstancia}
            label="Seleccionar Instancia"
            onChange={(e) => setSelectedInstancia(e.target.value)}
          >
            {availableInstancias.map((instancia) => (
              <MenuItem key={instancia.id || instancia.id_instancia} value={instancia.id?.toString() || instancia.id_instancia?.toString()}>
                {instancia.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: '#f8f9fa' }}>
        <Button onClick={onClose} variant="outlined" sx={{ color: colors.text.secondary }}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!selectedInstancia || loading}
          sx={{
            bgcolor: colors.primary.main,
            '&:hover': { bgcolor: colors.primary.dark },
            '&.Mui-disabled': { bgcolor: colors.primary.light }
          }}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedInstancia, setSelectedInstancia] = useState("all");
  const [availableInstancias, setAvailableInstancias] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openChangeInstanciaModal, setOpenChangeInstanciaModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserForView, setSelectedUserForView] = useState(null);
  const [selectedUserForInstancia, setSelectedUserForInstancia] = useState(null);
  const [page, setPage] = useState(1);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [instanciasList, setInstanciasList] = useState([]);

  const rowsPerPage = 10;

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
    cargarTodasInstancias();
  }, []);

  useEffect(() => {
    if (user?.instanciaId) {
      cargarRegiones(user.instanciaId);
    }
  }, [user]);

  const cargarTodasInstancias = async () => {
    try {
      const instancias = await getInstancias();
      setInstanciasList(instancias);
    } catch (error) {
      console.error("Error cargando instancias:", error);
    }
  };

  const cargarUsuarios = async () => {
    try {
      setLoading(true);

      const data = await usuarioService.findAgrupadosPorInstancia();

      // data viene como { instanciaId: [usuarios] }
      const usuarios = Object.values(data).flat();

      setUsers(usuarios);

      console.log("Usuarios con instancia:", usuarios);

      // Obtener instancias únicas
      const instancias = [
        ...new Set(usuarios.map((u) => u.instanciaNombre).filter(Boolean)),
      ];

      setAvailableInstancias(instancias);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      mostrarSnackbar("Error al cargar usuarios", "error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarRoles = async () => {
    try {
      setLoadingRoles(true);
      const roles = await rolService.findAll();
      const roleNames = roles.map((rol) => rol.nombre).filter(Boolean);
      setAvailableRoles(roleNames);
    } catch (error) {
      console.error("Error cargando roles:", error);
      setAvailableRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  };

  const cargarRegiones = async (idInstancia) => {
    try {
      setLoadingRegions(true);
      const regiones =
        await regionesService.findActivasByInstanciaId(idInstancia);
      if (regiones && regiones.length > 0) {
        setAvailableRegions(regiones.map((r) => r.nombre).filter(Boolean));
      } else {
        setAvailableRegions([]);
      }
    } catch (error) {
      console.error("Error cargando regiones:", error);
      try {
        const todas = await regionesService.findAll();
        const activas = (todas || []).filter((r) => r.activa === true);
        setAvailableRegions(activas.map((r) => r.nombre).filter(Boolean));
      } catch {
        setAvailableRegions([]);
      }
    } finally {
      setLoadingRegions(false);
    }
  };

  useEffect(() => {
    if (users.length > 0 && availableRoles.length === 0) {
      const roles = [...new Set(users.map((u) => u.rolNombre).filter(Boolean))];
      setAvailableRoles(roles);
    }
  }, [users, availableRoles.length]);

  useEffect(() => {
    if (users.length > 0 && availableRegions.length === 0 && !loadingRegions) {
      const regions = [
        ...new Set(users.map((u) => u.regionNombre).filter(Boolean)),
      ];
      setAvailableRegions(regions);
    }
  }, [users, availableRegions.length, loadingRegions]);

  // Obtener cargos ocupados del comité
  const getCargosOcupados = (excludeUserId = null) => {
    return users
      .filter(
        (u) =>
          esRolComite(u.rolNombre) && u.rolEspecifico && u.id !== excludeUserId,
      )
      .map((u) => u.rolEspecifico);
  };

  const stats = useMemo(() => {
    const s = {
      total: users.length,
      active: users.filter((u) => u.estado === "ACTIVO").length,
      inactive: users.filter((u) => u.estado === "INACTIVO").length,
      byRole: {},
    };
    users.forEach((u) => {
      if (u.rolNombre) s.byRole[u.rolNombre] = (s.byRole[u.rolNombre] || 0) + 1;
    });
    return s;
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !searchTerm ||
        (u.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (u.rolNombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (u.regionNombre?.toLowerCase() || "").includes(
          searchTerm.toLowerCase(),
        ) ||
        (u.instanciaNombre?.toLowerCase() || "").includes(
          searchTerm.toLowerCase(),
        );

      const matchesTab =
        selectedTab === "all"
          ? true
          : selectedTab === "active"
            ? u.estado === "ACTIVO"
            : selectedTab === "inactive"
              ? u.estado === "INACTIVO"
              : u.rolNombre === selectedTab;

      const matchesInstancia =
        selectedInstancia === "all"
          ? true
          : u.instanciaNombre === selectedInstancia;

      return matchesSearch && matchesTab && matchesInstancia;
    });
  }, [users, searchTerm, selectedTab, selectedInstancia]);

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [filteredUsers, page]);

  const tabs = useMemo(() => {
    const list = [
      { value: "all", label: `Todos (${stats.total})`, icon: <SecurityIcon /> },
      {
        value: "active",
        label: `Activos (${stats.active})`,
        icon: <CheckCircleIcon />,
      },
      {
        value: "inactive",
        label: `Inactivos (${stats.inactive})`,
        icon: <CancelIcon />,
      },
    ];
    availableRoles.forEach((rol) => {
      if (rol?.trim()) {
        list.push({
          value: rol,
          label: `${rol} (${stats.byRole[rol] || 0})`,
          icon: <PersonIcon />,
        });
      }
    });
    return list;
  }, [stats, availableRoles]);

  const mostrarSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setPassword("");
    setOpenCreateModal(true);
  };

  const handleViewUser = (user) => {
    setSelectedUserForView(user);
    setOpenViewModal(true);
  };

  const handleChangeInstancia = (user) => {
    setSelectedUserForInstancia(user);
    setOpenChangeInstanciaModal(true);
  };

  const handleSaveInstancia = async (userId, newInstanciaId) => {
    try {
      await cambiarInstanciaUsuario(userId, newInstanciaId);
      await cargarUsuarios();
      mostrarSnackbar("Instancia actualizada exitosamente", "success");
      setOpenChangeInstanciaModal(false);
      setSelectedUserForInstancia(null);
    } catch (error) {
      console.error("Error al cambiar instancia:", error);
      mostrarSnackbar(error.error || "Error al cambiar la instancia", "error");
    }
  };

  const handleCloseModals = () => {
    setOpenCreateModal(false);
    setOpenViewModal(false);
    setOpenChangeInstanciaModal(false);
    setSelectedUser(null);
    setSelectedUserForView(null);
    setSelectedUserForInstancia(null);
    setPassword("");
    setShowPassword(false);
  };

  // Guardar usuario usando el nuevo modal
  const handleCreateUser = async (userData, passwordValue) => {
    try {
      // El userData ya viene con instanciaId incluido desde el modal
      const newUserDTO = {
        email: userData.email,
        password: passwordValue,
        nombre: userData.nombre,
        activo: userData.activo,
        rolNombre: userData.rolNombre,
        regionNombre: userData.regionNombre,
        instanciaId: userData.instanciaId,
        rolEspecifico: null, // Los admins no tienen rol específico
      };

      console.log("📤 Creando usuario:", newUserDTO);
      await usuarioService.create(newUserDTO);
      await cargarUsuarios();
      mostrarSnackbar("Administrador creado exitosamente", "success");
      handleCloseModals();
    } catch (error) {
      console.error("Error en creación:", error);
      mostrarSnackbar(error.error || "Error al crear el administrador", "error");
    }
  };

  const handleToggleStatus = async (id) => {
    const u = users.find((u) => u.id === id);
    const nuevoEstado = !(u.estado === "ACTIVO");
    try {
      await usuarioService.cambiarEstadoActivo(id, nuevoEstado);
      await cargarUsuarios();
      mostrarSnackbar("Estado del usuario actualizado", "success");
    } catch {
      mostrarSnackbar("Error al cambiar el estado", "error");
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const formatUltimoAcceso = (ultimoAcceso) =>
    usuarioService.formatUltimoAcceso(ultimoAcceso);

  return (
    <Box
      sx={{ height: "100%", display: "flex", flexDirection: "column", p: 3 }}
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
              sx={{ color: colors.primary.dark, fontWeight: "bold", mb: 0.5 }}
            >
              Gestión de Usuarios
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Administre los usuarios del sistema - {filteredUsers.length}{" "}
              usuarios encontrados
              {user?.instanciaNombre && ` - Instancia: ${user.instanciaNombre}`}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleAddUser}
            sx={{
              bgcolor: colors.primary.main,
              "&:hover": { bgcolor: colors.primary.dark },
            }}
          >
            Nuevo Administrador
          </Button>
        </Box>

        <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8f9fa" }}>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              sx={{ flex: 2 }}
              size="small"
              placeholder="Buscar por nombre, email, rol o región..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      fontSize="small"
                      sx={{ color: colors.primary.main }}
                    />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <CancelIcon
                        fontSize="small"
                        sx={{ color: colors.text.secondary }}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ flex: 1 }}>
              <InputLabel id="instancia-filter-label">
                Filtrar por instancia
              </InputLabel>
              <Select
                labelId="instancia-filter-label"
                value={selectedInstancia}
                label="Filtrar por instancia"
                onChange={(e) => {
                  setSelectedInstancia(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="all">Todas las instancias</MenuItem>
                {availableInstancias.map((instancia) => (
                  <MenuItem key={instancia} value={instancia}>
                    {instancia}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Paper>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, v) => {
            setSelectedTab(v);
            setPage(1);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              color: colors.text.secondary,
              "&.Mui-selected": { color: colors.primary.main },
            },
            "& .MuiTabs-indicator": { backgroundColor: colors.primary.main },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              iconPosition="start"
              label={tab.label}
              sx={{ minHeight: 48, textTransform: "none" }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Tabla */}
      <Paper
        elevation={1}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <TableContainer sx={{ flex: 1 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: colors.primary.dark,
                    width: "23%",
                  }}
                >
                  Usuario
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: colors.primary.dark,
                    width: "12%",
                  }}
                >
                  Rol
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: colors.primary.dark,
                    width: "12%",
                  }}
                >
                  Región
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: colors.primary.dark,
                    width: "15%",
                  }}
                >
                  Instancia
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: colors.primary.dark,
                    width: "15%",
                  }}
                >
                  Último Acceso
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: colors.primary.dark,
                    width: "8%",
                  }}
                >
                  Estado
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: colors.primary.dark,
                    width: "15%",
                  }}
                  align="center"
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <LinearProgress />
                    <Typography sx={{ mt: 2 }}>Cargando usuarios...</Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography>No se encontraron usuarios</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((u) => (
                  <TableRow
                    key={u.id}
                    hover
                    sx={{
                      "&:hover": { bgcolor: "#f8f9fa" },
                      opacity: u.estado === "INACTIVO" ? 0.7 : 1,
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: getRoleColor(u.rolNombre),
                            fontSize: "0.9rem",
                            fontWeight: "bold",
                          }}
                        >
                          {u.nombre
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase() || "U"}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "bold",
                              color: colors.primary.dark,
                            }}
                          >
                            {u.nombre}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: colors.text.secondary,
                              display: "block",
                            }}
                          >
                            {u.email}
                          </Typography>
                          {u.rolEspecifico && (
                            <Chip
                              label={u.rolEspecifico}
                              size="small"
                              sx={{
                                mt: 0.5,
                                height: 18,
                                fontSize: "0.65rem",
                                bgcolor: colors.accents.purple + "20",
                                color: colors.accents.purple,
                                border: `1px solid ${colors.accents.purple}30`,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      {u.rolNombre ? (
                        <Chip
                          label={u.rolNombre}
                          size="small"
                          sx={{
                            bgcolor: `${getRoleColor(u.rolNombre)}15`,
                            color: getRoleColor(u.rolNombre),
                            fontWeight: 600,
                            border: `1px solid ${getRoleColor(u.rolNombre)}30`,
                          }}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.text.secondary,
                            fontStyle: "italic",
                          }}
                        >
                          —
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <LocationIcon
                          sx={{ fontSize: 14, color: colors.text.secondary }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: colors.primary.dark }}
                        >
                          {u.regionNombre || "—"}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: colors.primary.dark }}
                      >
                        {u.instanciaNombre || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: colors.primary.dark }}
                      >
                        {formatUltimoAcceso(u.ultimoAcceso)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={u.estado || "DESCONOCIDO"}
                        size="small"
                        sx={{
                          bgcolor:
                            u.estado === "ACTIVO"
                              ? colors.secondary.main
                              : colors.primary.light,
                          color: "white",
                          fontSize: "0.75rem",
                        }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                      >
                        <Tooltip title="Ver perfil">
                          <IconButton
                            size="small"
                            onClick={() => handleViewUser(u)}
                            sx={{ color: colors.primary.main }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Cambiar instancia">
                          <IconButton
                            size="small"
                            onClick={() => handleChangeInstancia(u)}
                            sx={{ color: colors.accents.blue }}
                          >
                            <SwapHorizIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title={
                            u.estado === "ACTIVO" ? "Desactivar" : "Activar"
                          }
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                size="small"
                                checked={u.estado === "ACTIVO"}
                                onChange={() => handleToggleStatus(u.id)}
                                sx={{
                                  "& .MuiSwitch-switchBase.Mui-checked": {
                                    color: colors.secondary.main,
                                  },
                                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                    { backgroundColor: colors.secondary.main },
                                }}
                              />
                            }
                            label=""
                          />
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            Mostrando{" "}
            {filteredUsers.length > 0 ? (page - 1) * rowsPerPage + 1 : 0} -{" "}
            {Math.min(page * rowsPerPage, filteredUsers.length)} de{" "}
            {filteredUsers.length} usuarios
          </Typography>
          <Pagination
            count={Math.ceil(filteredUsers.length / rowsPerPage)}
            page={page}
            onChange={(e, v) => setPage(v)}
            size="small"
            sx={{
              "& .MuiPaginationItem-root": {
                color: colors.primary.main,
                "&.Mui-selected": {
                  backgroundColor: colors.primary.main,
                  color: "white",
                },
              },
            }}
          />
        </Box>
      </Paper>

      {/* Modal para crear usuario - NUEVO MODAL */}
      <CreateUserModal
        open={openCreateModal}
        onClose={handleCloseModals}
        onSave={handleCreateUser}
        mode="add"
        password={password}
        onPasswordChange={(e) => setPassword(e.target.value)}
        showPassword={showPassword}
        onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
        userInstanciaId={user?.instanciaId}
        userInstanciaNombre={user?.instanciaNombre}
      />

      {/* Modal para ver usuario */}
      <UserViewModal
        open={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
          setSelectedUserForView(null);
        }}
        user={selectedUserForView}
      />

      {/* Modal para cambiar instancia */}
      <ChangeInstanciaModal
        open={openChangeInstanciaModal}
        onClose={() => {
          setOpenChangeInstanciaModal(false);
          setSelectedUserForInstancia(null);
        }}
        user={selectedUserForInstancia}
        onSave={handleSaveInstancia}
        availableInstancias={instanciasList}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;