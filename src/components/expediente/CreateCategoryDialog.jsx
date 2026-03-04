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
};

const CreateCategoryDialog = ({
  open,
  onClose,
  onSuccess,
  isSuperAdmin,
}) => {
  const [category, setCategory] = useState({
    nombre: "",
    descripcion: "",
    icono: "📁",
    obligatorio: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pendingSuccess = useRef(null);

  useEffect(() => {
    if (open) {
      setCategory({
        nombre: "",
        descripcion: "",
        icono: "📁",
        obligatorio: false,
      });
      setError(null);
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  const handleSave = async () => {
    if (!category.nombre.trim()) {
      setError("El nombre de la categoría es requerido");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        nombre: category.nombre,
        descripcion: category.descripcion,
        icono: category.icono,
        obligatorio: category.obligatorio,
        activo: true, // Siempre activo al crear
      };

      const newCategory = await crearApartadoGlobal(payload);

      pendingSuccess.current = newCategory;
      handleClose();
    } catch (error) {
      console.error("Error al crear categoría:", error);
      setError(
        error.response?.data?.message ||
          "Ocurrió un error al crear la categoría."
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
      disableEscapeKeyDown={loading}
      TransitionProps={{
        onExited: () => {
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
          <Typography variant="h6">
            Nueva Categoría {isSuperAdmin ? "Global" : ""}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {/* Obligatorio arriba */}
          <FormControlLabel
            control={
              <Switch
                checked={category.obligatorio}
                onChange={(e) =>
                  setCategory({
                    ...category,
                    obligatorio: e.target.checked,
                  })
                }
                disabled={loading}
              />
            }
            label="Categoría Obligatoria"
          />

          {/* Nombre */}
          <TextField
            fullWidth
            label="Nombre de la Categoría *"
            value={category.nombre}
            onChange={(e) =>
              setCategory({ ...category, nombre: e.target.value })
            }
            disabled={loading}
          />

          {/* Descripción */}
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Descripción"
            value={category.descripcion}
            onChange={(e) =>
              setCategory({ ...category, descripcion: e.target.value })
            }
            disabled={loading}
          />

          {/* Icono */}
          <IconSelector
            value={category.icono}
            onChange={(newIcon) =>
              setCategory({ ...category, icono: newIcon })
            }
            disabled={loading}
          />
          <IconPreview icon={category.icono} />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>

        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!category.nombre.trim() || loading}
          sx={{
            bgcolor: institutionalColors.primary,
            "&:hover": { bgcolor: institutionalColors.secondary },
          }}
        >
          {loading ? <CircularProgress size={22} /> : "Crear Categoría"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCategoryDialog;