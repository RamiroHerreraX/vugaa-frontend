import React, { useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import { Folder as FolderIcon } from "@mui/icons-material";
import { IconSelector, IconPreview } from "./IconComponents";
import { crearApartadoGlobal } from "../../services/apartado";

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
  textPrimary: "#2c3e50",
  textSecondary: "#7f8c8d",
  background: "#f5f7fa",
  lightBlue: "rgba(19, 59, 107, 0.08)",
};

const CreateCategoryDialog = ({
  open,
  onClose,
  onSuccess, // Cambiado de onCreated a onSuccess
  isSuperAdmin,
}) => {
  const [category, setCategory] = useState({
    name: "",
    description: "",
    icon: "📁",
    required: false,
    order: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref para guardar el success temporalmente
  const pendingSuccess = useRef(null);

  // Resetear el formulario cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      setCategory({
        name: "",
        description: "",
        icon: "📁",
        required: false,
        order: 1,
      });
      setError(null);
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  const handleSave = async () => {
    if (!category.name.trim()) {
      setError("El nombre de la categoría es requerido");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        nombre: category.name,
        descripcion: category.description,
        icono: category.icon,
        obligatorio: category.required,
        orden: category.order,
      };

      const newCategory = await crearApartadoGlobal(payload);

      // Guardamos el resultado para usarlo después de cerrar el modal
      pendingSuccess.current = newCategory;

      // Cerramos el modal
      handleClose();
    } catch (error) {
      console.error("Error al crear categoría:", error);
      setError(
        error.response?.data?.message || "Ocurrió un error al crear la categoría."
      );
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
      PaperProps={{ sx: { borderRadius: "12px" } }}
      disableEscapeKeyDown={loading}
      TransitionProps={{
        onExited: () => {
          // Esto se ejecuta después de que el modal se cierre completamente
          if (pendingSuccess.current) {
            onSuccess(pendingSuccess.current);
            pendingSuccess.current = null;
          }
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FolderIcon sx={{ color: institutionalColors.primary }} />
          <Typography
            variant="h6"
            sx={{ color: institutionalColors.textPrimary }}
          >
            Nueva Categoría {isSuperAdmin ? "Global" : ""}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Nombre de la Categoría *"
            value={category.name}
            onChange={(e) =>
              setCategory({ ...category, name: e.target.value })
            }
            helperText="Ej: Documentación Personal"
            error={!category.name && error}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Descripción"
            multiline
            rows={2}
            value={category.description}
            onChange={(e) =>
              setCategory({ ...category, description: e.target.value })
            }
            helperText="Describe el propósito de esta categoría"
            disabled={loading}
          />

          <IconSelector
            value={category.icon}
            onChange={(newIcon) =>
              setCategory({ ...category, icon: newIcon })
            }
            disabled={loading}
          />
          <IconPreview icon={category.icon} />

          <TextField
            fullWidth
            label="Orden"
            type="number"
            value={category.order}
            onChange={(e) =>
              setCategory({ ...category, order: parseInt(e.target.value) || 1 })
            }
            helperText="Número de orden en la lista"
            inputProps={{ min: 1 }}
            disabled={loading}
          />

          <FormControlLabel
            control={
              <Switch
                checked={category.required}
                onChange={(e) =>
                  setCategory({ ...category, required: e.target.checked })
                }
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: institutionalColors.primary,
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: institutionalColors.primary,
                  },
                }}
                disabled={loading}
              />
            }
            label="Categoría Obligatoria"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{ color: institutionalColors.textSecondary }}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!category.name.trim() || loading}
          sx={{
            bgcolor: institutionalColors.primary,
            "&:hover": { bgcolor: institutionalColors.secondary },
            minWidth: "120px",
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Crear Categoría"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCategoryDialog;