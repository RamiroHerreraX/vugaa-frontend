import React, { useState, useEffect, useRef } from "react";

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
  Snackbar,
} from "@mui/material";

import { alpha } from "@mui/material/styles";
import { FiberNew as NewIcon } from "@mui/icons-material";
import { crearInstancia } from "../../services/Instancia";

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

const CreateInstanceDialog = ({ open, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Usar useRef para evitar problemas con estado durante desmontaje
  const isMounted = useRef(true);

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

  // Resetear el formulario cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      setFormData({
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
      setError("");
    }
  }, [open]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error cuando el usuario empieza a escribir
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

    try {
      setLoading(true);
      setError("");

      await crearInstancia(formData);

      // Solo actualizar estado si el componente sigue montado
      if (isMounted.current) {
        setSnackbar({
          open: true,
          message: "Instancia creada exitosamente",
          severity: "success"
        });

        // Notificar al componente padre
        if (onCreated) {
          onCreated();
        }

        // Cerrar el diálogo después de un pequeño delay
        setTimeout(() => {
          if (isMounted.current) {
            onClose();
          }
        }, 500);
      }

    } catch (error) {
      console.error("Error al crear instancia:", error);
      if (isMounted.current) {
        setError(error.response?.data?.message || "Error al crear la instancia");
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Error al crear la instancia",
          severity: "error"
        });
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <>
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
              <NewIcon />
            </Avatar>

            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: institutionalColors.primary }}>
                Crear Nueva Instancia
              </Typography>
              <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
                Complete la información requerida
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
                <Typography variant="button">Creando...</Typography>
              </Box>
            ) : (
              "Crear Instancia"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateInstanceDialog;