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
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { IconSelector, IconPreview } from "./IconComponents";
import { editarApartadoGlobal } from "../../services/apartado";

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
};

const EditCategoryDialog = ({ open, onClose, category, onUpdated }) => {
  const [editedCategory, setEditedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 estados para alertas bonitas
  const [alertState, setAlertState] = useState({
    open: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    if (category) {
      setEditedCategory({
        idApartado: category.idApartado,
        nombre: category.nombre || "",
        descripcion: category.descripcion || "",
        icono: category.icono || "📁",
        obligatorio: category.obligatorio || false,
      });
    }
  }, [category]);

  const handleUpdate = async () => {
    if (!editedCategory?.nombre.trim()) return;

    setLoading(true);
    try {
      const payload = {
        nombre: editedCategory.nombre,
        descripcion: editedCategory.descripcion,
        icono: editedCategory.icono,
        obligatorio: editedCategory.obligatorio,
        activo: true,
      };

      const updated = await editarApartadoGlobal(
        editedCategory.idApartado,
        payload
      );

      if (onUpdated) onUpdated(updated);

      setAlertState({
        open: true,
        type: "success",
        message: "Categoría actualizada correctamente 🎉",
      });

      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error) {
      console.error("Error al actualizar categoría:", error);

      setAlertState({
        open: true,
        type: "error",
        message: "Ocurrió un error al actualizar la categoría.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!editedCategory) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EditIcon sx={{ color: institutionalColors.primary }} />
            <Typography variant="h6">
              Editar Categoría
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={editedCategory.obligatorio}
                  onChange={(e) =>
                    setEditedCategory({
                      ...editedCategory,
                      obligatorio: e.target.checked,
                    })
                  }
                />
              }
              label="Categoría Obligatoria"
            />

            <TextField
              fullWidth
              label="Nombre de la Categoría *"
              value={editedCategory.nombre}
              onChange={(e) =>
                setEditedCategory({
                  ...editedCategory,
                  nombre: e.target.value,
                })
              }
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Descripción"
              value={editedCategory.descripcion}
              onChange={(e) =>
                setEditedCategory({
                  ...editedCategory,
                  descripcion: e.target.value,
                })
              }
            />

            <IconSelector
              value={editedCategory.icono}
              onChange={(newIcon) =>
                setEditedCategory({
                  ...editedCategory,
                  icono: newIcon,
                })
              }
            />

            <IconPreview icon={editedCategory.icono} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>
            Cancelar
          </Button>

          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={!editedCategory.nombre.trim() || loading}
            sx={{
              bgcolor: institutionalColors.primary,
              "&:hover": { bgcolor: institutionalColors.secondary },
            }}
          >
            {loading ? <CircularProgress size={22} /> : "Guardar Cambios"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🔥 Snackbar bonito */}
      <Snackbar
        open={alertState.open}
        autoHideDuration={4000}
        onClose={() => setAlertState({ ...alertState, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={alertState.type}
          variant="filled"
          onClose={() => setAlertState({ ...alertState, open: false })}
          sx={{ borderRadius: 2 }}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditCategoryDialog;