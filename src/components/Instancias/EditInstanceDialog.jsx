// src/pages/superadmin/components/EditInstanceDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  Stack,
  FormControl,
  Select,
  MenuItem,
  CircularProgress
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { editarInstancia } from "../../services/Instancia";

// Colores institucionales
const institutionalColors = {
  primary: '#133B6B',
  secondary: '#1a4c7a',
  accent: '#e9e9e9',
  background: '#f8f9fa',
  lightBlue: 'rgba(19, 59, 107, 0.08)',
  darkBlue: '#0D2A4D',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  success: '#27ae60',
  warning: '#f39c12',
  error: '#e74c3c',
  info: '#3498db',
};

const EditInstanceDialog = ({ open, onClose, instance, onUpdated }) => {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    descripcion: "",
    activa: true,
    colorPrimario: institutionalColors.primary,
    colorSecundario: institutionalColors.secondary,
    colorAcento: institutionalColors.success,
    adminNombre: "",
    adminEmail: ""
  });

  useEffect(() => {
    if (instance) {
      setFormData({
        nombre: instance.nombre || "",
        codigo: instance.codigo || "",
        descripcion: instance.descripcion || "",
        activa: instance.activa ?? true,
        colorPrimario: instance.colorPrimario || institutionalColors.primary,
        colorSecundario: instance.colorSecundario || institutionalColors.secondary,
        colorAcento: instance.colorAcento || institutionalColors.success,
        adminNombre: instance.adminNombre || "",
        adminEmail: instance.adminEmail || ""
      });
    }
  }, [instance]);

  if (!instance) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await editarInstancia(instance.codigo, formData);

      if (onUpdated) onUpdated();

      onClose();
    } catch (error) {
      console.error("Error al actualizar instancia:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `1px solid ${institutionalColors.lightBlue}`,
        },
      }}
    >
      <DialogTitle sx={{ bgcolor: institutionalColors.background }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <EditIcon sx={{ color: institutionalColors.primary }} />
          <Typography variant="h6" fontWeight={600} sx={{ color: institutionalColors.primary }}>
            Editar Instancia
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: institutionalColors.lightBlue }}>
        <Grid container spacing={3} sx={{ mt: 1 }}>

          {/* Nombre */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Nombre *
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
            />
          </Grid>

          {/* Código */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Código *
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.codigo}
              onChange={(e) => handleChange("codigo", e.target.value)}
            />
          </Grid>

          {/* Activa */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Activa
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={formData.activa}
                onChange={(e) => handleChange("activa", e.target.value === true || e.target.value === "true")}
              >
                <MenuItem value={true}>Sí</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Colores */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Color Primario
            </Typography>
            <TextField
              type="color"
              fullWidth
              size="small"
              value={formData.colorPrimario}
              onChange={(e) => handleChange("colorPrimario", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Color Secundario
            </Typography>
            <TextField
              type="color"
              fullWidth
              size="small"
              value={formData.colorSecundario}
              onChange={(e) => handleChange("colorSecundario", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Color Acento
            </Typography>
            <TextField
              type="color"
              fullWidth
              size="small"
              value={formData.colorAcento}
              onChange={(e) => handleChange("colorAcento", e.target.value)}
            />
          </Grid>

          {/* Admin */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Nombre del Administrador
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.adminNombre}
              onChange={(e) => handleChange("adminNombre", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Email del Administrador
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="email"
              value={formData.adminEmail}
              onChange={(e) => handleChange("adminEmail", e.target.value)}
            />
          </Grid>

          {/* Descripción */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Descripción
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              value={formData.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
            />
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: institutionalColors.background }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          sx={{ bgcolor: institutionalColors.primary }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Guardar Cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditInstanceDialog;