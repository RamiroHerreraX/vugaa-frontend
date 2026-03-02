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

  const estadoColor = {
    active: "success",
    inactive: "default",
    suspended: "error"
  };

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
            src={instance.logoUrl}
            sx={{
              bgcolor: instance.colorPrimario || institutionalColors.primary,
              width: 50,
              height: 50
            }}
          >
            {instance.nombre?.charAt(0)}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ color: institutionalColors.primary }}
            >
              {instance.nombre}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: institutionalColors.textSecondary }}
            >
              Código: {instance.codigo}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>


      {/* CONTENT */}
      <DialogContent
        dividers
        sx={{
          borderColor: institutionalColors.lightBlue,
          p: 3
        }}
      >

        <Grid container spacing={3}>

          {/* ESTADO */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <Chip
                label={instance.estado || "active"}
                color={estadoColor[instance.estado] || "default"}
                variant="outlined"
              />

              <Chip
                label={instance.activa ? "Activa" : "Inactiva"}
                sx={{
                  bgcolor: instance.activa
                    ? `${institutionalColors.success}15`
                    : `${institutionalColors.textSecondary}15`,
                  color: instance.activa
                    ? institutionalColors.success
                    : institutionalColors.textSecondary,
                }}
              />
            </Stack>
          </Grid>


          {/* DESCRIPCIÓN */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Descripción
            </Typography>

            <Typography color="text.primary">
              {instance.descripcion || "Sin descripción"}
            </Typography>
          </Grid>


          <Grid item xs={12}>
            <Divider sx={{ borderColor: institutionalColors.lightBlue }} />
          </Grid>


          {/* INFORMACIÓN GENERAL (2 COLUMNAS REALES) */}

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Administrador
            </Typography>

            <Typography>
              {instance.adminNombre || "No asignado"}
            </Typography>
          </Grid>


          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email Administrador
            </Typography>

            <Typography>
              {instance.adminEmail || "No asignado"}
            </Typography>
          </Grid>


          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Fecha de creación
            </Typography>

            <Typography>
              {instance.fechaCreacion
                ? new Date(instance.fechaCreacion).toLocaleString()
                : "No disponible"}
            </Typography>
          </Grid>


          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Logo URL
            </Typography>

            <Typography>
              {instance.logoUrl || "No asignado"}
            </Typography>
          </Grid>


          <Grid item xs={12}>
            <Divider sx={{ borderColor: institutionalColors.lightBlue }} />
          </Grid>


          {/* COLORES */}

          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Colores del Sistema
            </Typography>

            <Grid container spacing={3}>

              <Grid item>
                <Typography variant="caption">Primario</Typography>

                <Box
                  sx={{
                    width: 60,
                    height: 25,
                    bgcolor:
                      instance.colorPrimario ||
                      institutionalColors.primary,
                    borderRadius: 1,
                    border: `1px solid ${institutionalColors.lightBlue}`,
                  }}
                />
              </Grid>


              <Grid item>
                <Typography variant="caption">Secundario</Typography>

                <Box
                  sx={{
                    width: 60,
                    height: 25,
                    bgcolor:
                      instance.colorSecundario ||
                      institutionalColors.secondary,
                    borderRadius: 1,
                    border: `1px solid ${institutionalColors.lightBlue}`,
                  }}
                />
              </Grid>


              <Grid item>
                <Typography variant="caption">Acento</Typography>

                <Box
                  sx={{
                    width: 60,
                    height: 25,
                    bgcolor:
                      instance.colorAcento ||
                      institutionalColors.success,
                    borderRadius: 1,
                    border: `1px solid ${institutionalColors.lightBlue}`,
                  }}
                />
              </Grid>

            </Grid>

          </Grid>


          <Grid item xs={12}>
            <Divider sx={{ borderColor: institutionalColors.lightBlue }} />
          </Grid>


          {/* ESTADÍSTICAS (OCUPAN TODO EL ANCHO) */}

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Usuarios
            </Typography>

            <Typography
              variant="h5"
              fontWeight={700}
              color={institutionalColors.primary}
            >
              {instance.totalUsuarios || 0}
            </Typography>
          </Grid>


          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Certificaciones
            </Typography>

            <Typography
              variant="h5"
              fontWeight={700}
              color={institutionalColors.primary}
            >
              {instance.totalCertificaciones || 0}
            </Typography>
          </Grid>


          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Cursos
            </Typography>

            <Typography
              variant="h5"
              fontWeight={700}
              color={institutionalColors.primary}
            >
              {instance.totalCursos || 0}
            </Typography>
          </Grid>

        </Grid>

      </DialogContent>


      {/* FOOTER */}

      <DialogActions
        sx={{
          p: 2,
          bgcolor: institutionalColors.background
        }}
      >
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: institutionalColors.primary,
            px: 4,
            '&:hover': {
              bgcolor: institutionalColors.secondary,
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