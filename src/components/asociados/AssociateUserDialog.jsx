import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Stack,
  Avatar,
  Chip,
  CircularProgress,
  TextField,
  MenuItem,
  Alert,
  Snackbar,
} from "@mui/material";
import { PersonAdd as PersonAddIcon } from "@mui/icons-material";
import UsuarioService from "../../services/usuarioService";
import asociacionService from "../../services/asociacion";

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
  textSecondary: "#6b7280",
  textPrimary: "#111827",
};

const avatarRoleColor = "#1976d2";

const AssociateUserDialog = ({ open, onClose, onAddUser }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // ✅ idAsociacion como estado — se carga de forma asíncrona
  const [idAsociacion, setIdAsociacion] = useState(null);
  const [loadingAsociacion, setLoadingAsociacion] = useState(false);

  // ── Leer datos del usuario desde localStorage ────────────────────────────
  const getFromStorage = (key) => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      return JSON.parse(userStr)?.[key] || null;
    } catch (e) {
      console.error(`Error al leer "${key}" desde localStorage:`, e);
      return null;
    }
  };

  // ── Paso 1: cargar idAsociacion cuando se abre el dialog ─────────────────
  // Se dispara cada vez que `open` cambia a true y aún no tenemos idAsociacion.
  useEffect(() => {
    if (!open) return;

    // Si ya lo tenemos en localStorage (guardado por findByUsuarioId) lo usamos directo
    const idAsociacionCached = getFromStorage("idAsociacion");
    if (idAsociacionCached) {
      setIdAsociacion(idAsociacionCached);
      return;
    }

    // Si no está en caché, lo pedimos al backend
    const idUsuario = getFromStorage("id");
    if (!idUsuario) {
      setSnackbar({
        open: true,
        message: "No se encontró sesión activa. Por favor inicia sesión nuevamente.",
        severity: "error",
      });
      return;
    }

    const cargarAsociacion = async () => {
      setLoadingAsociacion(true);
      try {
        // findByUsuarioId también guarda idAsociacion en localStorage
        const asociacion = await asociacionService.findByUsuarioId(idUsuario);
        console.log("Asociación cargada en AssociateUserDialog:", asociacion);
        setIdAsociacion(asociacion.idAsociacion);
      } catch (error) {
        console.error("Error al cargar asociación:", error);
        setSnackbar({
          open: true,
          message: "No se pudo obtener la asociación del usuario.",
          severity: "error",
        });
      } finally {
        setLoadingAsociacion(false);
      }
    };

    cargarAsociacion();
  }, [open]);

  // ── Paso 2: cargar usuarios sin asociación cuando tenemos instanciaId ────
  useEffect(() => {
    if (!open) return;

    const instanciaId = getFromStorage("instanciaId");
    if (!instanciaId) return;

    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const usuarios = await UsuarioService.findUsuariosSinAsociacion(instanciaId);
        console.log("Usuarios sin asociación traídos desde la base de datos:", usuarios);
        setAvailableUsers(usuarios);
      } catch (error) {
        console.error("Error al cargar usuarios sin asociación:", error);
        setAvailableUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [open]);

  // ── Agregar usuario a la asociación ──────────────────────────────────────
  const handleAgregarUsuario = async (user) => {
    if (!idAsociacion) {
      setSnackbar({
        open: true,
        message: "No se encontró el ID de la asociación. Por favor inicia sesión nuevamente.",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await UsuarioService.actualizarAsociacionUsuario(user.id, idAsociacion);
      console.log(`Usuario ${user.nombre} agregado a la asociación ${idAsociacion}`);

      // Quitar al usuario de la lista para que no aparezca de nuevo
      setAvailableUsers((prev) => prev.filter((u) => u.id !== user.id));

      setSnackbar({
        open: true,
        message: `${user.nombre} agregado a la asociación correctamente.`,
        severity: "success",
      });

      // Notificar al componente padre
      onAddUser(user);
    } catch (error) {
      console.error("Error al agregar usuario a la asociación:", error);
      setSnackbar({
        open: true,
        message: error?.error || "Error al agregar el usuario a la asociación.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Regiones únicas para el filtro ──────────────────────────────────────
  const regiones = useMemo(() => {
    const set = new Set(availableUsers.map((u) => u.regionNombre).filter(Boolean));
    return Array.from(set);
  }, [availableUsers]);

  // ── Filtrado por texto ───────────────────────────────────────────────────
  const filteredByText = useMemo(() => {
    if (!searchTerm) return availableUsers;
    const term = searchTerm.toLowerCase();
    return availableUsers.filter(
      (u) =>
        (u.nombre && u.nombre.toLowerCase().includes(term)) ||
        (u.email  && u.email.toLowerCase().includes(term)),
    );
  }, [availableUsers, searchTerm]);

  // ── Filtrado final por región ────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    if (!regionFilter) return filteredByText;
    return filteredByText.filter((u) => u.regionNombre === regionFilter);
  }, [filteredByText, regionFilter]);

  // Está inicializando si aún no tiene idAsociacion y lo está cargando
  const isInitializing = loadingAsociacion && !idAsociacion;

  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" spacing={2} alignItems="center">
            <PersonAddIcon sx={{ color: institutionalColors.primary }} />
            <Typography variant="h6" sx={{ color: institutionalColors.textPrimary }}>
              Agregar Usuario Existente a la Asociación
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }} paragraph>
            Selecciona un usuario existente en el sistema para agregarlo a tu
            asociación. <strong>IMPORTANTE:</strong> El permiso para subir documentos lo
            debe dar el usuario desde su dispositivo.
          </Typography>

          {/* Filtros */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
            <Stack spacing={0.5} flex={1}>
              <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                Buscar por nombre o email
              </Typography>
              <TextField
                fullWidth size="small" variant="outlined"
                placeholder="Escribe nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Stack>

            <Stack spacing={0.5} flex={1}>
              <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                Filtrar por región
              </Typography>
              <TextField select fullWidth size="small" variant="outlined"
                value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
                <MenuItem value="">Todas las regiones</MenuItem>
                {regiones.map((region) => (
                  <MenuItem key={region} value={region}>{region}</MenuItem>
                ))}
              </TextField>
            </Stack>
          </Stack>

          {/* Spinner de inicialización o de carga de usuarios */}
          {isInitializing || loading ? (
            <Stack alignItems="center" mt={3} mb={3} spacing={1}>
              <CircularProgress />
              <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                {isInitializing ? "Cargando información de la asociación..." : "Cargando usuarios..."}
              </Typography>
            </Stack>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: institutionalColors.primary }}>Usuario</TableCell>
                    <TableCell sx={{ color: institutionalColors.primary }}>Email</TableCell>
                    <TableCell sx={{ color: institutionalColors.primary }}>Rol</TableCell>
                    <TableCell sx={{ color: institutionalColors.primary }}>Región</TableCell>
                    <TableCell align="right" sx={{ color: institutionalColors.primary }}>Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarRoleColor, fontWeight: "bold", color: "white" }}>
                            {user.nombre?.split(" ").map((n) => n[0]).join("") || "U"}
                          </Avatar>
                          <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                            {user.nombre || "Usuario sin nombre"}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
                          {user.email || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={user.rolEspecifico || "-"} size="small"
                          sx={{ bgcolor: `${avatarRoleColor}15`, color: avatarRoleColor }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
                          {user.regionNombre || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" variant="contained"
                          onClick={() => handleAgregarUsuario(user)}
                          disabled={loading || !idAsociacion}
                          sx={{ bgcolor: institutionalColors.primary, "&:hover": { bgcolor: institutionalColors.secondary } }}>
                          Agregar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ color: institutionalColors.textSecondary }}>
                        No se encontraron usuarios.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssociateUserDialog;