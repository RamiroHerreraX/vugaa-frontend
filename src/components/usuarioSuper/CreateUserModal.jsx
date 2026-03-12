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
  Typography,
  Alert,
} from "@mui/material";

import {
  Close as CloseIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";

import RolService from "../../services/rol";
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
  const [instancias, setInstancias] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingInstancias, setLoadingInstancias] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingRoles(true);
        setLoadingInstancias(true);

        const rolesData = await RolService.findAll();
        const rolesFiltrados = rolesData
          .map((r) => r.nombre)
          .filter((nombre) =>
            ROLES_PERMITIDOS.some((rol) => nombre?.toUpperCase() === rol)
          );
        setRoles(rolesFiltrados);

        const instanciasData = await getInstancias();
        setInstancias(instanciasData);
      } catch (error) {
        console.error("❌ Error cargando datos:", error);
      } finally {
        setLoadingRoles(false);
        setLoadingInstancias(false);
      }
    };

    if (open) cargarDatos();
  }, [open]);

  useEffect(() => {
    if (user) {
      setLocalUser({
        ...user,
        instanciaId: user.instanciaId || userInstanciaId || "",
        instanciaNombre: user.instanciaNombre || userInstanciaNombre || "",
      });
    } else {
      setLocalUser({
        nombre: "",
        email: "",
        rolNombre: "",
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
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleInstanciaChange = (instanciaId) => {
    const instancia = instancias.find(
      (i) => i.id === instanciaId || i.id_instancia === instanciaId
    );
    setLocalUser((prev) => ({
      ...prev,
      instanciaId,
      instanciaNombre: instancia?.nombre || "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!localUser.nombre || localUser.nombre.trim().length < 3)
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    if (!localUser.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localUser.email))
      newErrors.email = "Ingrese un email válido";
    if (mode === "add" && !password)
      newErrors.password = "La contraseña es obligatoria";
    if (!localUser.rolNombre) newErrors.rolNombre = "Seleccione un rol";
    if (!localUser.instanciaId) newErrors.instanciaId = "Seleccione instancia";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Solo valida y pasa los datos al padre — el padre crea, recarga y cierra
  const handleSave = async () => {
    if (!validateForm()) return;
    if (onSave) await onSave(localUser, password);
  };

  const isFormValid = () =>
    localUser.nombre &&
    localUser.email &&
    localUser.rolNombre &&
    localUser.instanciaId &&
    (mode !== "add" || password);

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
<br />
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
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControl fullWidth size="small" error={!!errors.rolNombre}>
              <InputLabel>Rol</InputLabel>
              <Select
                value={localUser.rolNombre}
                label="Rol"
                onChange={(e) => handleChange("rolNombre", e.target.value)}
              >
                {roles.map((rol) => (
                  <MenuItem key={rol} value={rol}>{rol}</MenuItem>
                ))}
              </Select>
              {errors.rolNombre && (
                <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>
                  {errors.rolNombre}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth size="small" error={!!errors.instanciaId}>
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
              {errors.instanciaId && (
                <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>
                  {errors.instanciaId}
                </Typography>
              )}
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
          sx={{ bgcolor: "#133B6B", "&:hover": { bgcolor: "#0D2A4D" } }}
        >
          {mode === "add" ? "Crear Administrador" : "Guardar Cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserModal;