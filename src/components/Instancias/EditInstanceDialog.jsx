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
  Avatar,
  Divider,
  Box,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { editarInstancia } from "../../services/Instancia";
import { alpha } from "@mui/material/styles";

const institutionalColors = {
  primary: '#133B6B',
  secondary: '#1a4c7a',
  background: '#f8f9fa',
  lightBlue: 'rgba(19, 59, 107, 0.08)',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  success: '#4caf50',
  error: '#f44336',
};

const EditInstanceDialog = ({ open, onClose, instance, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    descripcion: "",
    activa: true,
    colorPrimario: institutionalColors.primary,
    colorSecundario: institutionalColors.secondary,
    colorAcento: "#27ae60",
    adminNombre: "",
    adminEmail: ""
  });

  // Cargar datos cuando se abre el diálogo con una instancia
  useEffect(() => {
    if (instance && open) {
      // Determinar si es objeto mapeado o rawData
      const isMapped = instance.name !== undefined;
      
      setFormData({
        nombre: isMapped ? instance.name : instance.nombre || "",
        codigo: isMapped ? instance.code : instance.codigo || "",
        descripcion: isMapped ? instance.description : instance.descripcion || "",
        activa: isMapped ? instance.status === 'active' : instance.activa !== false,
        colorPrimario: isMapped 
          ? instance.colors?.primary || institutionalColors.primary 
          : instance.colorPrimario || institutionalColors.primary,
        colorSecundario: isMapped 
          ? instance.colors?.secondary || institutionalColors.secondary 
          : instance.colorSecundario || institutionalColors.secondary,
        colorAcento: isMapped 
          ? instance.colors?.accent || "#27ae60" 
          : instance.colorAcento || "#27ae60",
        adminNombre: isMapped ? instance.admin : instance.adminNombre || "",
        adminEmail: isMapped ? instance.email : instance.adminEmail || ""
      });
      setError("");
    }
  }, [instance, open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError("El nombre es requerido");
      return false;
    }
    if (!formData.codigo.trim()) {
      setError("El código es requerido");
      return false;
    }
    if (formData.adminEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
      setError("El email del administrador no es válido");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    if (!instance) return;

    try {
      setLoading(true);
      setError("");

      // Obtener el código correcto
      const codigo = instance.code || instance.codigo;
      
      await editarInstancia(codigo, formData);

      if (onUpdated) {
        onUpdated();
      }

      onClose();

    } catch (error) {
      console.error("Error al editar instancia:", error);
      setError(error.response?.data?.message || "Error al editar la instancia");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!instance) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `1px solid ${institutionalColors.lightBlue}`,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, bgcolor: institutionalColors.background }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: institutionalColors.lightBlue,
              color: institutionalColors.primary,
              width: 40,
              height: 40,
            }}
          >
            <EditIcon />
          </Avatar>

          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: institutionalColors.primary }}>
              Editar Instancia
            </Typography>
            <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
              {formData.nombre} ({formData.codigo})
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <Divider sx={{ borderColor: institutionalColors.lightBlue }} />

      <DialogContent sx={{ py: 4 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Nombre *
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              error={!!error && error.includes("nombre")}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Código *
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.codigo}
              onChange={(e) => handleChange("codigo", e.target.value)}
              error={!!error && error.includes("código")}
              disabled={loading}
            />
          </Grid>

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
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.activa}
                  onChange={(e) => handleChange("activa", e.target.checked)}
                  disabled={loading}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: institutionalColors.success,
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: institutionalColors.success,
                    }
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: formData.activa ? institutionalColors.success : institutionalColors.textSecondary }}>
                  {formData.activa ? "Instancia activa" : "Instancia inactiva"}
                </Typography>
              }
            />
          </Grid>

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
              disabled={loading}
              sx={{
                '& input': {
                  height: 40,
                  cursor: 'pointer',
                }
              }}
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
              disabled={loading}
              sx={{
                '& input': {
                  height: 40,
                  cursor: 'pointer',
                }
              }}
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
              disabled={loading}
              sx={{
                '& input': {
                  height: 40,
                  cursor: 'pointer',
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Nombre del Administrador
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.adminNombre}
              onChange={(e) => handleChange("adminNombre", e.target.value)}
              disabled={loading}
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
              disabled={loading}
            />
          </Grid>

          {/* Vista previa de colores */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Vista previa de colores
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box sx={{ width: 40, height: 40, bgcolor: formData.colorPrimario, borderRadius: 1 }} />
              <Box sx={{ width: 40, height: 40, bgcolor: formData.colorSecundario, borderRadius: 1 }} />
              <Box sx={{ width: 40, height: 40, bgcolor: formData.colorAcento, borderRadius: 1 }} />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider sx={{ borderColor: institutionalColors.lightBlue }} />

      <DialogActions sx={{ px: 3, py: 2, bgcolor: institutionalColors.background }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          sx={{ color: institutionalColors.textSecondary }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          sx={{
            px: 3,
            borderRadius: 2,
            bgcolor: institutionalColors.primary,
            minWidth: 140,
            '&:hover': { 
              bgcolor: institutionalColors.secondary 
            },
            '&.Mui-disabled': {
              bgcolor: alpha(institutionalColors.primary, 0.5),
            }
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              <Typography variant="button">Guardando...</Typography>
            </Box>
          ) : (
            "Guardar Cambios"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditInstanceDialog;