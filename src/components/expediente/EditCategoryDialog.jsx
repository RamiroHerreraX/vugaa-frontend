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
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { editarApartado } from "../../services/apartado"; // 🔹 IMPORTANTE

const institutionalColors = {
  primary: "#133B6B",
  secondary: "#1a4c7a",
  textPrimary: "#2c3e50",
  textSecondary: "#7f8c8d",
  background: "#f5f7fa",
  lightBlue: "rgba(19, 59, 107, 0.08)",
};

const EditCategoryDialog = ({ open, onClose, category, onUpdated }) => {
  const [editedCategory, setEditedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setEditedCategory({ ...category });
    }
  }, [category]);

  const handleUpdate = async () => {
    if (!editedCategory?.name) return;

    setLoading(true);
    try {
      const updated = await editarApartado(
        editedCategory.id, // 🔹 ID del apartado
        editedCategory     // 🔹 datos actualizados
      );

      // 🔹 Actualiza la lista en el componente padre
      if (onUpdated) onUpdated(updated);

      onClose();
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
      alert("Ocurrió un error al actualizar la categoría.");
    } finally {
      setLoading(false);
    }
  };

  if (!editedCategory) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "12px" } }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EditIcon sx={{ color: institutionalColors.primary }} />
          <Typography variant="h6" sx={{ color: institutionalColors.textPrimary }}>
            Editar Categoría
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Nombre de la Categoría *"
            value={editedCategory.name}
            onChange={(e) =>
              setEditedCategory({ ...editedCategory, name: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Descripción"
            multiline
            rows={2}
            value={editedCategory.description}
            onChange={(e) =>
              setEditedCategory({ ...editedCategory, description: e.target.value })
            }
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Ícono"
              value={editedCategory.icon}
              onChange={(e) =>
                setEditedCategory({ ...editedCategory, icon: e.target.value })
              }
            />

            <TextField
              fullWidth
              type="color"
              label="Color"
              value={editedCategory.color || "#133B6B"}
              onChange={(e) =>
                setEditedCategory({ ...editedCategory, color: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <TextField
            fullWidth
            label="Orden"
            type="number"
            value={editedCategory.order}
            onChange={(e) =>
              setEditedCategory({
                ...editedCategory,
                order: parseInt(e.target.value),
              })
            }
            inputProps={{ min: 1 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={editedCategory.required}
                onChange={(e) =>
                  setEditedCategory({
                    ...editedCategory,
                    required: e.target.checked,
                  })
                }
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: institutionalColors.primary,
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: institutionalColors.primary,
                  },
                }}
              />
            }
            label="Categoría Obligatoria"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ color: institutionalColors.textSecondary }}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleUpdate}
          variant="contained"
          disabled={!editedCategory.name || loading}
          sx={{
            bgcolor: institutionalColors.primary,
            "&:hover": { bgcolor: institutionalColors.secondary },
          }}
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCategoryDialog;