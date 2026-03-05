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
} from "@mui/material";
import { PersonAdd as PersonAddIcon } from "@mui/icons-material";
import UsuarioService from "../../services/usuarioService"; // Ajusta la ruta

// Colores institucionales
const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
  textSecondary: "#6b7280",
  textPrimary: "#111827",
};

// Color fijo para Avatares y Chips
const avatarRoleColor = "#1976d2";

const AssociateUserDialog = ({ open, onClose, onAddUser }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");

  const getInstanciaId = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      const userObj = JSON.parse(userStr);
      return userObj?.instanciaId || null;
    } catch (error) {
      console.error("Error al leer instanciaId desde localStorage:", error);
      return null;
    }
  };

  const instanciaId = getInstanciaId();

  // Cargar usuarios sin asociación
  useEffect(() => {
    if (!open || !instanciaId) return;

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
  }, [open, instanciaId]);

  // Obtener lista de regiones únicas
  const regiones = useMemo(() => {
    const regionesSet = new Set(availableUsers.map((u) => u.regionNombre).filter(Boolean));
    return Array.from(regionesSet);
  }, [availableUsers]);

  // Filtrado por nombre/email
  const filteredByText = useMemo(() => {
    if (!searchTerm) return availableUsers;
    const term = searchTerm.toLowerCase();
    return availableUsers.filter(
      (u) =>
        (u.nombre && u.nombre.toLowerCase().includes(term)) ||
        (u.email && u.email.toLowerCase().includes(term))
    );
  }, [availableUsers, searchTerm]);

  // Filtrado final por región
  const filteredUsers = useMemo(() => {
    if (!regionFilter) return filteredByText;
    return filteredByText.filter((u) => u.regionNombre === regionFilter);
  }, [filteredByText, regionFilter]);

  return (
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
        <Typography
          variant="body2"
          sx={{ color: institutionalColors.textSecondary }}
          paragraph
        >
          Selecciona un usuario existente en el sistema para agregarlo a tu
          asociación. <strong>IMPORTANTE:</strong> El permiso para subir documentos lo
          debe dar el usuario desde su dispositivo.
        </Typography>

        {/* Filtros con títulos */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
          <Stack spacing={0.5} flex={1}>
            <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
              Buscar por nombre o email
            </Typography>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Escribe nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Stack>

          <Stack spacing={0.5} flex={1}>
            <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
              Filtrar por región
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              variant="outlined"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              <MenuItem value="">Todas las regiones</MenuItem>
              {regiones.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>

        {loading ? (
          <Stack alignItems="center" mt={3} mb={3}>
            <CircularProgress />
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
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: avatarRoleColor,
                            fontWeight: "bold",
                            color: "white",
                          }}
                        >
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
                      <Chip
                        label={user.rolEspecifico || "-"}
                        size="small"
                        sx={{
                          bgcolor: `${avatarRoleColor}15`,
                          color: avatarRoleColor,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
                        {user.regionNombre || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => onAddUser(user)}
                        disabled={loading}
                        sx={{
                          bgcolor: institutionalColors.primary,
                          "&:hover": { bgcolor: institutionalColors.secondary },
                        }}
                      >
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
  );
};

export default AssociateUserDialog;