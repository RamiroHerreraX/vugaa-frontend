// src/pages/superadmin/components/ViewInstanceDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Avatar,
  Chip,
  Box,
  Grid,
  Divider
} from "@mui/material";

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

const ViewInstanceDialog = ({ open, onClose, instance }) => {
  if (!instance) return null;

  // Determinar si estamos usando el objeto mapeado o el rawData
  const isMapped = instance.name !== undefined; // Si tiene 'name' es el objeto mapeado
  
  // Obtener valores según el tipo de objeto
  const nombre = isMapped ? instance.name : instance.nombre;
  const codigo = isMapped ? instance.code : instance.codigo;
  const descripcion = isMapped ? instance.description : instance.descripcion;
  const activa = isMapped ? instance.status === 'active' : instance.activa;
  const adminNombre = isMapped ? instance.admin : instance.adminNombre;
  const adminEmail = isMapped ? instance.email : instance.adminEmail;
  const fechaCreacion = isMapped ? instance.created : instance.fechaCreacion;
  const fechaActualizacion = isMapped ? null : instance.fechaActualizacion;
  const totalUsuarios = isMapped ? instance.users : instance.totalUsuarios;
  const totalCertificaciones = isMapped ? instance.certifications : instance.totalCertificaciones;
  const totalCursos = isMapped ? instance.courses : instance.totalCursos;
  
  // Colores
  const colorPrimario = isMapped 
    ? instance.colors?.primary || institutionalColors.primary 
    : instance.colorPrimario || institutionalColors.primary;
  const colorSecundario = isMapped 
    ? instance.colors?.secondary || institutionalColors.secondary 
    : instance.colorSecundario || institutionalColors.secondary;
  const colorAcento = isMapped 
    ? instance.colors?.accent || institutionalColors.success 
    : instance.colorAcento || institutionalColors.success;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `1px solid ${institutionalColors.lightBlue}`,
          width: "100%",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle sx={{ bgcolor: institutionalColors.background }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: colorPrimario,
              width: 50,
              height: 50
            }}
          >
            {nombre?.charAt(0)}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ color: institutionalColors.primary }}
            >
              {nombre}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: institutionalColors.textSecondary }}
            >
              Código: {codigo}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* ACTIVA */}
          <Grid item xs={12}>
            <Chip
              label={activa ? "Activa" : "Inactiva"}
              sx={{
                bgcolor: activa
                  ? `${institutionalColors.success}15`
                  : `${institutionalColors.textSecondary}15`,
                color: activa
                  ? institutionalColors.success
                  : institutionalColors.textSecondary,
              }}
            />
          </Grid>

          {/* DESCRIPCIÓN */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Descripción
            </Typography>
            <Typography>
              {descripcion || "Sin descripción"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ borderColor: institutionalColors.lightBlue }} />
          </Grid>

          {/* ADMIN */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Administrador
            </Typography>
            <Typography>
              {adminNombre || "No asignado"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email Administrador
            </Typography>
            <Typography>
              {adminEmail || "No asignado"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Fecha de creación
            </Typography>
            <Typography>
              {fechaCreacion
                ? isMapped 
                  ? fechaCreacion // Ya viene formateada
                  : new Date(fechaCreacion).toLocaleString()
                : "No disponible"}
            </Typography>
          </Grid>

          {!isMapped && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Última actualización
              </Typography>
              <Typography>
                {fechaActualizacion
                  ? new Date(fechaActualizacion).toLocaleString()
                  : "No disponible"}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider sx={{ borderColor: institutionalColors.lightBlue }} />
          </Grid>

          {/* COLORES */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Colores del Sistema
            </Typography>
            <Grid container spacing={3}>
              <Grid item>
                <Typography variant="caption">Primario</Typography>
                <Box sx={{
                  width: 60,
                  height: 25,
                  bgcolor: colorPrimario,
                  borderRadius: 1,
                  border: '1px solid rgba(0,0,0,0.1)'
                }} />
              </Grid>

              <Grid item>
                <Typography variant="caption">Secundario</Typography>
                <Box sx={{
                  width: 60,
                  height: 25,
                  bgcolor: colorSecundario,
                  borderRadius: 1,
                  border: '1px solid rgba(0,0,0,0.1)'
                }} />
              </Grid>

              <Grid item>
                <Typography variant="caption">Acento</Typography>
                <Box sx={{
                  width: 60,
                  height: 25,
                  bgcolor: colorAcento,
                  borderRadius: 1,
                  border: '1px solid rgba(0,0,0,0.1)'
                }} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ borderColor: institutionalColors.lightBlue }} />
          </Grid>

          {/* ESTADÍSTICAS */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2">Usuarios</Typography>
            <Typography variant="h5" fontWeight={700}>
              {totalUsuarios || 0}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2">Certificaciones</Typography>
            <Typography variant="h5" fontWeight={700}>
              {totalCertificaciones || 0}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2">Cursos</Typography>
            <Typography variant="h5" fontWeight={700}>
              {totalCursos || 0}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: institutionalColors.background }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ 
            bgcolor: institutionalColors.primary,
            '&:hover': {
              bgcolor: institutionalColors.secondary
            }
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewInstanceDialog;