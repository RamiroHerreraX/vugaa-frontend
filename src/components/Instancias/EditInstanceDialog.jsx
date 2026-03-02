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
  MenuItem
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

// Colores institucionales
const institutionalColors = {
  primary: '#133B6B',      // Azul oscuro principal
  secondary: '#1a4c7a',    // Azul medio
  accent: '#e9e9e9',       // Color para acentos (gris claro)
  background: '#f8f9fa',   // Fondo claro
  lightBlue: 'rgba(19, 59, 107, 0.08)',  // Azul transparente para hover
  darkBlue: '#0D2A4D',     // Azul más oscuro
  textPrimary: '#2c3e50',  // Texto principal
  textSecondary: '#7f8c8d', // Texto secundario
  success: '#27ae60',      // Verde para éxito
  warning: '#f39c12',      // Naranja para advertencias
  error: '#e74c3c',        // Rojo para errores
  info: '#3498db',         // Azul para información
};

const EditInstanceDialog = ({ open, onClose, instance }) => {

  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    descripcion: "",
    estado: "active",
    activa: true,
    colorPrimario: institutionalColors.primary,
    colorSecundario: institutionalColors.secondary,
    colorAcento: institutionalColors.success,
    logoUrl: "",
    adminNombre: "",
    adminEmail: ""
  });

  useEffect(() => {
    if (instance) {
      setFormData({
        nombre: instance.nombre || "",
        codigo: instance.codigo || "",
        descripcion: instance.descripcion || "",
        estado: instance.estado || "active",
        activa: instance.activa ?? true,
        colorPrimario: instance.colorPrimario || institutionalColors.primary,
        colorSecundario: instance.colorSecundario || institutionalColors.secondary,
        colorAcento: instance.colorAcento || institutionalColors.success,
        logoUrl: instance.logoUrl || "",
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

  const handleSave = () => {
    console.log("Datos actualizados:", formData);

    // aquí luego llamas tu API
    // updateInstance(formData)

    onClose();
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
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Nombre *
            </Typography>

            <TextField
              fullWidth
              size="small"
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: institutionalColors.primary,
                  },
                },
              }}
            />
          </Grid>

          {/* Código */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Código *
            </Typography>

            <TextField
              fullWidth
              size="small"
              value={formData.codigo}
              onChange={(e) => handleChange("codigo", e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: institutionalColors.primary,
                  },
                },
              }}
            />
          </Grid>

          {/* Estado */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Estado
            </Typography>

            <FormControl fullWidth size="small">
              <Select
                value={formData.estado}
                onChange={(e) => handleChange("estado", e.target.value)}
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: institutionalColors.primary,
                  },
                }}
              >
                <MenuItem value="active">Activa</MenuItem>
                <MenuItem value="inactive">Inactiva</MenuItem>
                <MenuItem value="suspended">Suspendida</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Activa */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Activa
            </Typography>

            <FormControl fullWidth size="small">
              <Select
                value={formData.activa}
                onChange={(e) => handleChange("activa", e.target.value)}
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: institutionalColors.primary,
                  },
                }}
              >
                <MenuItem value={true}>Sí</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Color Primario */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Color Primario
            </Typography>

            <TextField
              type="color"
              fullWidth
              size="small"
              value={formData.colorPrimario}
              onChange={(e) => handleChange("colorPrimario", e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: institutionalColors.primary,
                  },
                },
              }}
            />
          </Grid>

          {/* Color Secundario */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Color Secundario
            </Typography>

            <TextField
              type="color"
              fullWidth
              size="small"
              value={formData.colorSecundario}
              onChange={(e) => handleChange("colorSecundario", e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: institutionalColors.primary,
                  },
                },
              }}
            />
          </Grid>

          {/* Color Acento */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Color Acento
            </Typography>

            <TextField
              type="color"
              fullWidth
              size="small"
              value={formData.colorAcento}
              onChange={(e) => handleChange("colorAcento", e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: institutionalColors.primary,
                  },
                },
              }}
            />
          </Grid>

          {/* Logo URL */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Logo URL
            </Typography>

            <TextField
              fullWidth
              size="small"
              value={formData.logoUrl}
              onChange={(e) => handleChange("logoUrl", e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: institutionalColors.primary,
                  },
                },
              }}
            />
          </Grid>

          {/* Admin Nombre */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Nombre del Administrador
            </Typography>

            <TextField
              fullWidth
              size="small"
              value={formData.adminNombre}
              onChange={(e) => handleChange("adminNombre", e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: institutionalColors.primary,
                  },
                },
              }}
            />
          </Grid>

          {/* Admin Email */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Email del Administrador
            </Typography>

            <TextField
              fullWidth
              size="small"
              type="email"
              value={formData.adminEmail}
              onChange={(e) => handleChange("adminEmail", e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: institutionalColors.primary,
                  },
                },
              }}
            />
          </Grid>

          {/* Descripción */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: institutionalColors.textPrimary, mb: 1 }}>
              Descripción
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              value={formData.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: institutionalColors.primary,
                  },
                },
              }}
            />
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: institutionalColors.background }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{
            borderColor: institutionalColors.primary,
            color: institutionalColors.primary,
            '&:hover': {
              borderColor: institutionalColors.secondary,
              bgcolor: institutionalColors.lightBlue,
            }
          }}
        >
          Cancelar
        </Button>

        <Button 
          variant="contained" 
          onClick={handleSave}
          sx={{
            bgcolor: institutionalColors.primary,
            '&:hover': {
              bgcolor: institutionalColors.secondary,
            }
          }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditInstanceDialog;