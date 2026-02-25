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
  Divider,
} from "@mui/material";

const ViewInstanceDialog = ({ open, onClose, instance }) => {
  const safeInstance = instance || {};

  const estadoColor = {
    active: "success",
    inactive: "default",
    suspended: "error",
  };

  return (
    <Dialog
      open={open && !!instance}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      keepMounted
    >
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={safeInstance.logoUrl}
            sx={{
              bgcolor:
                safeInstance.colorPrimario || "primary.main",
              width: 50,
              height: 50,
            }}
          >
            {safeInstance.nombre?.charAt(0) || ""}
          </Avatar>

          <Box>
            <Typography variant="h6" fontWeight={700}>
              {safeInstance.nombre || ""}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Código: {safeInstance.codigo || ""}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Box>
            <Chip
              label={safeInstance.estado || "active"}
              color={
                estadoColor[safeInstance.estado] ||
                "default"
              }
              variant="outlined"
            />

            <Chip
              label={
                safeInstance.activa
                  ? "Activa"
                  : "Inactiva"
              }
              color={
                safeInstance.activa
                  ? "success"
                  : "default"
              }
              sx={{ ml: 1 }}
            />
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Descripción
            </Typography>

            <Typography>
              {safeInstance.descripcion ||
                "Sin descripción"}
            </Typography>
          </Box>

          <Divider />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Administrador
              </Typography>

              <Typography>
                {safeInstance.adminNombre ||
                  "No asignado"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Email Administrador
              </Typography>

              <Typography>
                {safeInstance.adminEmail ||
                  "No asignado"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Fecha de creación
              </Typography>

              <Typography>
                {safeInstance.fechaCreacion
                  ? new Date(
                      safeInstance.fechaCreacion
                    ).toLocaleString()
                  : "No disponible"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Logo URL
              </Typography>

              <Typography>
                {safeInstance.logoUrl ||
                  "No asignado"}
              </Typography>
            </Grid>
          </Grid>

          <Divider />

          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              gutterBottom
            >
              Colores del Sistema
            </Typography>

            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="caption">
                  Primario
                </Typography>

                <Box
                  sx={{
                    width: 40,
                    height: 20,
                    bgcolor:
                      safeInstance.colorPrimario ||
                      "#1976d2",
                    borderRadius: 1,
                  }}
                />
              </Box>

              <Box>
                <Typography variant="caption">
                  Secundario
                </Typography>

                <Box
                  sx={{
                    width: 40,
                    height: 20,
                    bgcolor:
                      safeInstance.colorSecundario ||
                      "#ff9800",
                    borderRadius: 1,
                  }}
                />
              </Box>

              <Box>
                <Typography variant="caption">
                  Acento
                </Typography>

                <Box
                  sx={{
                    width: 40,
                    height: 20,
                    bgcolor:
                      safeInstance.colorAcento ||
                      "#4caf50",
                    borderRadius: 1,
                  }}
                />
              </Box>
            </Stack>
          </Box>

          <Divider />

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Usuarios
              </Typography>

              <Typography variant="h6">
                {safeInstance.totalUsuarios || 0}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Certificaciones
              </Typography>

              <Typography variant="h6">
                {safeInstance.totalCertificaciones ||
                  0}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Cursos
              </Typography>

              <Typography variant="h6">
                {safeInstance.totalCursos || 0}
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
    </Dialog>
  );
};

export default ViewInstanceDialog;
