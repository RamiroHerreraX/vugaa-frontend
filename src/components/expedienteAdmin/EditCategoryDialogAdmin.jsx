import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  FormControlLabel,
  Switch,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Edit as EditIcon } from "@mui/icons-material";
import { IconSelector, IconPreview } from "./IconComponents";
import { editarApartado, editarApartadoGlobal } from "../../services/apartado";

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
};

const USER_TYPES = [
  { value: 'AGENTE', label: 'Agentes Aduanales' },
  { value: 'ASOCIACION', label: 'Asociaciones' }
];

const EditCategoryDialogAdmin = ({ open, onClose, category, onSuccess }) => {
  const [editedCategory, setEditedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (category && open) {
      setEditedCategory({
        idApartado: category.idApartado,
        nombre: category.nombre || "",
        descripcion: category.descripcion || "",
        icono: category.icono || "📁",
        obligatorio: category.obligatorio || false,
        esGlobal: category.tipo === 'global' || !category.idInstancia,
        usuariosDestinados: category.usuariosDestinados
          ? (typeof category.usuariosDestinados === 'string'
              ? category.usuariosDestinados.split(',').filter(Boolean)
              : Array.isArray(category.usuariosDestinados)
                ? category.usuariosDestinados
                : [])
          : [],
      });
      setError(null);
    }
  }, [category, open]);

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleUpdate = async () => {
    if (!editedCategory?.nombre.trim()) {
      setError("El nombre de la categoría es requerido");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        nombre: editedCategory.nombre.trim(),
        descripcion: editedCategory.descripcion.trim() || null,
        icono: editedCategory.icono || "📁",
        obligatorio: editedCategory.obligatorio,
        activo: true,
        usuariosDestinados:
          editedCategory.usuariosDestinados?.length > 0
            ? editedCategory.usuariosDestinados.join(',')
            : null,
      };

      let updated;
      if (editedCategory.esGlobal) {
        updated = await editarApartadoGlobal(editedCategory.idApartado, payload);
      } else {
        updated = await editarApartado(editedCategory.idApartado, payload);
      }

      // ✅ Llamamos onSuccess ANTES de cerrar para que el padre actualice
      // el estado con los datos frescos del servidor inmediatamente
      if (onSuccess) {
        onSuccess({
          ...category,           // conservar campos que el backend no devuelve (ej: idInstancia)
          ...updated,            // sobrescribir con lo que devolvió el servidor
          idApartado: editedCategory.idApartado,
          nombre: payload.nombre,
          descripcion: payload.descripcion,
          icono: payload.icono,
          obligatorio: payload.obligatorio,
          usuariosDestinados: editedCategory.usuariosDestinados,
        });
      }

      handleClose();

    } catch (error) {
      console.error("❌ Error al actualizar categoría:", error);

      let errorMessage = "Ocurrió un error al actualizar la categoría.";

      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = "No tienes permisos suficientes para editar esta categoría. Se requiere rol de SUPERADMIN.";
        } else {
          errorMessage =
            error.response.data?.message ||
            error.response.data?.mensaje ||
            `Error ${error.response.status}: ${error.response.statusText}`;
        }
      } else if (error.request) {
        errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EditIcon sx={{ color: institutionalColors.primary }} />
          <Typography variant="h6">
            Editar Categoría {category?.tipo === 'global' ? 'Global' : ''}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {editedCategory && (
          <Stack spacing={3} sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {editedCategory.esGlobal && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Esta es una categoría global. Los cambios afectarán a todas las instancias.
              </Alert>
            )}

            {/* ========== SECCIÓN 1: INFORMACIÓN BÁSICA ========== */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: institutionalColors.primary, mb: 1, fontWeight: 600, fontSize: '0.9rem' }}
              >
                Información Básica
              </Typography>

              <TextField
                fullWidth
                label="Nombre de la Categoría *"
                value={editedCategory.nombre}
                onChange={(e) =>
                  setEditedCategory({ ...editedCategory, nombre: e.target.value })
                }
                disabled={loading}
                error={!editedCategory.nombre.trim() && !!error}
                helperText={!editedCategory.nombre.trim() && "El nombre es requerido"}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                multiline
                rows={2}
                label="Descripción"
                value={editedCategory.descripcion}
                onChange={(e) =>
                  setEditedCategory({ ...editedCategory, descripcion: e.target.value })
                }
                disabled={loading}
                sx={{ mb: 2 }}
              />

              <Box sx={{ mb: 1 }}>
                <IconSelector
                  value={editedCategory.icono}
                  onChange={(newIcon) =>
                    setEditedCategory({ ...editedCategory, icono: newIcon })
                  }
                  disabled={loading}
                />
                <Box sx={{ mt: 1 }}>
                  <IconPreview icon={editedCategory.icono} />
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* ========== SECCIÓN 2: CONFIGURACIÓN ========== */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: institutionalColors.primary, mb: 1, fontWeight: 600, fontSize: '0.9rem' }}
              >
                Configuración
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="usuarios-destinados-label">Asignar a</InputLabel>
                <Select
                  labelId="usuarios-destinados-label"
                  multiple
                  value={editedCategory.usuariosDestinados}
                  onChange={(e) =>
                    setEditedCategory({ ...editedCategory, usuariosDestinados: e.target.value })
                  }
                  input={<OutlinedInput label="Asignar a" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={USER_TYPES.find(t => t.value === value)?.label || value}
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                  disabled={loading}
                >
                  {USER_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Checkbox checked={editedCategory.usuariosDestinados.indexOf(type.value) > -1} />
                      <ListItemText primary={type.label} />
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                  Selecciona a qué tipo de usuarios estará disponible esta categoría
                </Typography>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={editedCategory.obligatorio}
                    onChange={(e) =>
                      setEditedCategory({ ...editedCategory, obligatorio: e.target.checked })
                    }
                    disabled={loading}
                  />
                }
                label="Categoría Obligatoria"
              />
            </Box>
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleUpdate}
          variant="contained"
          disabled={!editedCategory?.nombre.trim() || loading}
          sx={{
            bgcolor: institutionalColors.primary,
            "&:hover": { bgcolor: institutionalColors.secondary },
            "&.Mui-disabled": { bgcolor: alpha(institutionalColors.primary, 0.5) },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Guardar Cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCategoryDialogAdmin;