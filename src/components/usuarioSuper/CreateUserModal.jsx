import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  Alert,
  FormHelperText,
} from "@mui/material";

import {
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";

import UsuarioService from "../../services/usuarioService";
import RolService from "../../services/rol";
import RegionesService from "../../services/regiones";
import { getInstancias } from "../../services/Instancia";

const ROLES_PERMITIDOS = ["ADMIN", "SUPERADMIN"];

const CreateUserModal = ({
  open,
  onClose,
  onSave,
  mode = "add",
  user,
  password,
  onPasswordChange,
  showPassword,
  onTogglePasswordVisibility,
  userInstanciaId,
  userInstanciaNombre,
}) => {
  const [localUser, setLocalUser] = useState(null);
  const [errors, setErrors] = useState({});

  const [roles, setRoles] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [instancias, setInstancias] = useState([]);

  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingInstancias, setLoadingInstancias] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingRoles(true);
        setLoadingRegions(true);
        setLoadingInstancias(true);

        /* =========================
           ROLES
        ========================== */

        const rolesData = await RolService.findAll();

        console.log("🔵 ROLES CRUDOS DESDE BD:", rolesData);

        const rolesFiltrados = rolesData
          .map((r) => r.nombre)
          .filter((nombre) =>
            ROLES_PERMITIDOS.some((rol) => nombre?.toUpperCase() === rol)
          );

        console.log("🟢 ROLES FILTRADOS:", rolesFiltrados);

        setRoles(rolesFiltrados);

        /* =========================
           REGIONES
        ========================== */

        const regionesData = await RegionesService.findAll();

        console.log("🔵 REGIONES CRUDAS DESDE BD:", regionesData);

        const regionesMap = regionesData.map((r) => r.nombre);

        console.log("🟢 REGIONES PROCESADAS:", regionesMap);

        setRegiones(regionesMap);

        /* =========================
           INSTANCIAS
        ========================== */

        const instanciasData = await getInstancias();

        console.log("🔵 INSTANCIAS CRUDAS DESDE BD:", instanciasData);

        setInstancias(instanciasData);
      } catch (error) {
        console.error("❌ Error cargando datos:", error);
      } finally {
        setLoadingRoles(false);
        setLoadingRegions(false);
        setLoadingInstancias(false);
      }
    };

    if (open) {
      cargarDatos();
    }
  }, [open]);

  useEffect(() => {
    if (user) {
      console.log("🟡 USER EDITANDO:", user);

      setLocalUser({
        ...user,
        instanciaId: user.instanciaId || userInstanciaId || "",
        instanciaNombre: user.instanciaNombre || userInstanciaNombre || "",
      });
    } else {
      console.log("🟡 CREANDO NUEVO USUARIO");

      setLocalUser({
        nombre: "",
        email: "",
        rolNombre: "",
        regionNombre: "",
        instanciaId: userInstanciaId || "",
        instanciaNombre: userInstanciaNombre || "",
        activo: true,
      });
    }
  }, [user, open, userInstanciaId, userInstanciaNombre]);

  useEffect(() => {
    if (!open) setErrors({});
  }, [open]);

  if (!localUser) return null;

  const handleChange = (field, value) => {
    setLocalUser((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleInstanciaChange = (instanciaId) => {
    console.log("📌 Instancia seleccionada:", instanciaId);

    const instancia = instancias.find(
      (i) => i.id === instanciaId || i.id_instancia === instanciaId
    );

    console.log("📌 Instancia encontrada:", instancia);

    setLocalUser((prev) => ({
      ...prev,
      instanciaId,
      instanciaNombre: instancia?.nombre || "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!localUser.nombre || localUser.nombre.trim().length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    if (!localUser.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localUser.email)) {
      newErrors.email = "Ingrese un email válido";
    }

    if (mode === "add" && !password) {
      newErrors.password = "La contraseña es obligatoria";
    }

    if (!localUser.rolNombre) newErrors.rolNombre = "Seleccione un rol";
    if (!localUser.regionNombre) newErrors.regionNombre = "Seleccione región";
    if (!localUser.instanciaId) newErrors.instanciaId = "Seleccione instancia";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const usuarioDTO = {
        nombre: localUser.nombre,
        email: localUser.email,
        rolNombre: localUser.rolNombre,
        regionNombre: localUser.regionNombre,
        instanciaId: localUser.instanciaId,
        rolEspecifico: null,
        activo: localUser.activo,
      };

      console.log("📤 ENVIANDO USUARIO:", usuarioDTO);

      if (mode === "add") {
        usuarioDTO.password = password;
        await UsuarioService.create(usuarioDTO);
      } else {
        await UsuarioService.update(localUser.id, usuarioDTO);
      }

      if (onSave) onSave();
      onClose();
    } catch (error) {
      console.error("❌ Error guardando usuario:", error);

      setErrors({
        ...errors,
        general: error.error || "Error al guardar el usuario",
      });
    }
  };

  const isFormValid = () => {
    return (
      localUser.nombre &&
      localUser.email &&
      localUser.rolNombre &&
      localUser.regionNombre &&
      localUser.instanciaId &&
      (mode !== "add" || password)
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "#133B6B",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">
          {mode === "add" ? "Crear Administrador" : "Editar Administrador"}
        </Typography>

        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.general}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre completo"
              size="small"
              value={localUser.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              error={!!errors.nombre}
              helperText={errors.nombre}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              size="small"
              value={localUser.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          {mode === "add" && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña"
                size="small"
                type={showPassword ? "text" : "password"}
                value={password || ""}
                onChange={onPasswordChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={onTogglePasswordVisibility}>
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}

          {/* ROL */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Rol</InputLabel>

              <Select
                value={localUser.rolNombre}
                label="Rol"
                onChange={(e) => handleChange("rolNombre", e.target.value)}
              >
                {roles.map((rol) => (
                  <MenuItem key={rol} value={rol}>
                    {rol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* REGION */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Región</InputLabel>

              <Select
                value={localUser.regionNombre}
                label="Región"
                onChange={(e) => handleChange("regionNombre", e.target.value)}
              >
                {regiones.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* INSTANCIA */}
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Instancia</InputLabel>

              <Select
                value={localUser.instanciaId}
                label="Instancia"
                onChange={(e) => handleInstanciaChange(e.target.value)}
              >
                {instancias.map((instancia) => (
                  <MenuItem
                    key={instancia.id || instancia.id_instancia}
                    value={instancia.id || instancia.id_instancia}
                  >
                    {instancia.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={localUser.activo !== false}
                  onChange={(e) => handleChange("activo", e.target.checked)}
                />
              }
              label="Usuario activo"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>

        <Button
          variant="contained"
          disabled={!isFormValid()}
          onClick={handleSave}
        >
          {mode === "add" ? "Crear Administrador" : "Guardar Cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserModal;