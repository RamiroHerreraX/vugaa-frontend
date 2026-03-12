import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  Domain as DomainIcon,
  People as PeopleIcon,
  Verified as VerifiedIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  AdminPanelSettings as AdminIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

const institutionalColors = {
  primary: '#133B6B',
  secondary: '#1a4c7a',
  textSecondary: '#7f8c8d',
  textPrimary: '#2c3e50',
  success: '#4caf50',
  error: '#f44336',
  info: '#2196f3',
};

const InstanceStatsDialog = ({ open, onClose, instance, statsData }) => {
  if (!instance || !statsData) return null;

  const stats = statsData;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ 
        bgcolor: institutionalColors.primary, 
        color: 'white',
        py: 2,
        px: 3,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <DomainIcon />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Estadísticas de {instance.name}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Código: {instance.code}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Estado de la instancia */}
        <Box sx={{ mb: 3 }}>
          <Chip
            icon={stats.activa ? <CheckCircleIcon /> : <CancelIcon />}
            label={stats.activa ? "Instancia Activa" : "Instancia Inactiva"}
            sx={{
              bgcolor: stats.activa 
                ? `${institutionalColors.success}15` 
                : `${institutionalColors.error}15`,
              color: stats.activa 
                ? institutionalColors.success 
                : institutionalColors.error,
              fontWeight: 'bold',
              px: 1,
            }}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Tarjetas de estadísticas */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', bgcolor: alpha(institutionalColors.info, 0.05) }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <PeopleIcon sx={{ color: institutionalColors.info }} />
                  <Typography variant="subtitle1" sx={{ color: institutionalColors.info, fontWeight: 'bold' }}>
                    Usuarios
                  </Typography>
                </Stack>
                <Typography variant="h3" sx={{ color: institutionalColors.info, fontWeight: 'bold', textAlign: 'center' }}>
                  {stats.totalUsuariosReal || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, display: 'block', textAlign: 'center', mt: 1 }}>
                  Usuarios activos en la instancia
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', bgcolor: alpha(institutionalColors.success, 0.05) }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <VerifiedIcon sx={{ color: institutionalColors.success }} />
                  <Typography variant="subtitle1" sx={{ color: institutionalColors.success, fontWeight: 'bold' }}>
                    Certificaciones
                  </Typography>
                </Stack>
                <Typography variant="h3" sx={{ color: institutionalColors.success, fontWeight: 'bold', textAlign: 'center' }}>
                  {stats.totalCertificacionesReal || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, display: 'block', textAlign: 'center', mt: 1 }}>
                  Certificaciones registradas
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', bgcolor: alpha(institutionalColors.warning, 0.05) }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <DescriptionIcon sx={{ color: institutionalColors.warning }} />
                  <Typography variant="subtitle1" sx={{ color: institutionalColors.warning, fontWeight: 'bold' }}>
                    Documentos
                  </Typography>
                </Stack>
                <Typography variant="h3" sx={{ color: institutionalColors.warning, fontWeight: 'bold', textAlign: 'center' }}>
                  {stats.totalDocumentosReal || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, display: 'block', textAlign: 'center', mt: 1 }}>
                  Documentos cargados
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Información adicional */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ color: institutionalColors.primary, mb: 2, fontWeight: 'bold' }}>
              Información de la Instancia
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, display: 'block' }}>
                    Fecha de Creación
                  </Typography>
                  <Typography variant="body2" sx={{ color: institutionalColors.textPrimary, fontWeight: 500 }}>
                    {new Date(stats.fechaCreacion).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, display: 'block' }}>
                    Última Actualización
                  </Typography>
                  <Typography variant="body2" sx={{ color: institutionalColors.textPrimary, fontWeight: 500 }}>
                    {stats.fechaActualizacion 
                      ? new Date(stats.fechaActualizacion).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'No registrada'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <AdminIcon sx={{ color: institutionalColors.primary, fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: institutionalColors.textPrimary, fontWeight: 500 }}>
                      Administrador: {stats.adminNombre || 'No asignado'}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: institutionalColors.textPrimary, ml: 4 }}>
                    Email: {stats.adminEmail || 'Sin email'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Comparativa con datos de tabla */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ color: institutionalColors.textSecondary, mb: 2 }}>
              Comparativa (Datos de tabla vs Tiempo real)
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, display: 'block' }}>
                    Usuarios (tabla)
                  </Typography>
                  <Typography variant="body2" sx={{ color: stats.totalUsuarios !== stats.totalUsuariosReal ? institutionalColors.warning : institutionalColors.textPrimary }}>
                    {stats.totalUsuarios || 0}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, display: 'block' }}>
                    Usuarios (real)
                  </Typography>
                  <Typography variant="body2" sx={{ color: institutionalColors.success, fontWeight: 'bold' }}>
                    {stats.totalUsuariosReal || 0}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, display: 'block' }}>
                    Certificaciones (tabla)
                  </Typography>
                  <Typography variant="body2" sx={{ color: stats.totalCertificaciones !== stats.totalCertificacionesReal ? institutionalColors.warning : institutionalColors.textPrimary }}>
                    {stats.totalCertificaciones || 0}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, display: 'block' }}>
                    Certificaciones (real)
                  </Typography>
                  <Typography variant="body2" sx={{ color: institutionalColors.success, fontWeight: 'bold' }}>
                    {stats.totalCertificacionesReal || 0}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #e5e7eb' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: institutionalColors.primary,
            '&:hover': { bgcolor: institutionalColors.secondary },
            px: 3,
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Función auxiliar para alpha
const alpha = (color, opacity) => {
  // Implementación simple - en producción usar una librería
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

export default InstanceStatsDialog;