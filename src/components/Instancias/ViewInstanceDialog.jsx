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

const ViewInstanceDialog = ({ open, onClose, instance }) => {

  const estadoColor = {
    active: "success",
    inactive: "default",
    suspended: "error"
  };

  return (
    <Dialog
      open={open && instance !== null}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >

      {instance && (
        <>

          {/* HEADER */}
          <DialogTitle>

            <Stack direction="row" spacing={2} alignItems="center">

              <Avatar
                src={instance.logoUrl}
                sx={{
                  bgcolor: instance.colorPrimario || "primary.main",
                  width: 50,
                  height: 50
                }}
              >
                {instance.nombre?.charAt(0)}
              </Avatar>

              <Box>

                <Typography variant="h6" fontWeight={700}>
                  {instance.nombre}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Código: {instance.codigo}
                </Typography>

              </Box>

            </Stack>

          </DialogTitle>


          <DialogContent dividers>

            <Stack spacing={3}>

              {/* Estado */}
              <Box>

                <Chip
                  label={instance.estado || "active"}
                  color={estadoColor[instance.estado] || "default"}
                  variant="outlined"
                />

                <Chip
                  label={instance.activa ? "Activa" : "Inactiva"}
                  color={instance.activa ? "success" : "default"}
                  sx={{ ml: 1 }}
                />

              </Box>


              {/* Descripción */}
              <Box>

                <Typography variant="subtitle2" color="text.secondary">
                  Descripción
                </Typography>

                <Typography>
                  {instance.descripcion || "Sin descripción"}
                </Typography>

              </Box>


              <Divider />


              {/* Información general */}
              <Grid container spacing={2}>

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

              </Grid>


              <Divider />


              {/* Colores */}
              <Box>

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Colores del Sistema
                </Typography>

                <Stack direction="row" spacing={2}>

                  <Box>
                    <Typography variant="caption">Primario</Typography>

                    <Box
                      sx={{
                        width: 40,
                        height: 20,
                        bgcolor: instance.colorPrimario,
                        borderRadius: 1
                      }}
                    />
                  </Box>


                  <Box>
                    <Typography variant="caption">Secundario</Typography>

                    <Box
                      sx={{
                        width: 40,
                        height: 20,
                        bgcolor: instance.colorSecundario,
                        borderRadius: 1
                      }}
                    />
                  </Box>


                  <Box>
                    <Typography variant="caption">Acento</Typography>

                    <Box
                      sx={{
                        width: 40,
                        height: 20,
                        bgcolor: instance.colorAcento,
                        borderRadius: 1
                      }}
                    />
                  </Box>

                </Stack>

              </Box>


              <Divider />


              {/* Estadísticas */}
              <Grid container spacing={2}>

                <Grid item xs={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Usuarios
                  </Typography>

                  <Typography variant="h6">
                    {instance.totalUsuarios || 0}
                  </Typography>
                </Grid>


                <Grid item xs={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Certificaciones
                  </Typography>

                  <Typography variant="h6">
                    {instance.totalCertificaciones || 0}
                  </Typography>
                </Grid>


                <Grid item xs={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Cursos
                  </Typography>

                  <Typography variant="h6">
                    {instance.totalCursos || 0}
                  </Typography>
                </Grid>

              </Grid>

            </Stack>

          </DialogContent>


          <DialogActions>

            <Button
              variant="contained"
              onClick={onClose}
            >
              Cerrar
            </Button>

          </DialogActions>

        </>
      )}

    </Dialog>
  );
};

export default ViewInstanceDialog;
