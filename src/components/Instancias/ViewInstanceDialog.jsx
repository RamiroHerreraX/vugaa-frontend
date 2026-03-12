// src/pages/superadmin/components/ViewInstanceDialog.jsx
import React, { useState } from "react";
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
  Card,
  CardContent,
  Tabs,
  Tab,
  LinearProgress,
} from "@mui/material";
import {
  Domain as DomainIcon,
  Person as PersonIcon,
  Verified as VerifiedIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  AdminPanelSettings as AdminIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

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

const alpha = (color, opacity) => {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

const ViewInstanceDialog = ({ 
  open, 
  onClose, 
  instance, 
  statsData, // Nuevo prop para estadísticas
  onRefreshStats, // Función para refrescar estadísticas
}) => {
  const [tabValue, setTabValue] = useState(0);
  
  if (!instance) return null;

  // Determinar si estamos usando el objeto mapeado o el rawData
  const isMapped = instance.name !== undefined;
  
  // Obtener valores según el tipo de objeto
  const nombre = isMapped ? instance.name : instance.nombre;
  const codigo = isMapped ? instance.code : instance.codigo;
  const descripcion = isMapped ? instance.description : instance.descripcion;
  const activa = isMapped ? instance.status === 'active' : instance.activa;
  const adminNombre = isMapped ? instance.admin : instance.adminNombre;
  const adminEmail = isMapped ? instance.email : instance.adminEmail;
  const fechaCreacion = isMapped ? instance.created : instance.fechaCreacion;
  const fechaActualizacion = isMapped ? null : instance.fechaActualizacion;
  
  // Datos de la tabla (pueden estar desactualizados)
  const totalUsuariosTabla = isMapped ? instance.users : instance.totalUsuarios;
  const totalCertificacionesTabla = isMapped ? instance.certifications : instance.totalCertificaciones;
  const totalCursosTabla = isMapped ? instance.courses : instance.totalCursos;
  const totalDocumentosTabla = isMapped ? instance.documents : 0;
  
  // Datos en tiempo real (de statsData)
  const stats = statsData || {};
  const totalUsuariosReal = stats.totalUsuariosReal || totalUsuariosTabla;
  const totalCertificacionesReal = stats.totalCertificacionesReal || totalCertificacionesTabla;
  const totalDocumentosReal = stats.totalDocumentosReal || totalDocumentosTabla;
  
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

  // Verificar si hay diferencias entre datos de tabla y tiempo real
  const hasDifferences = 
    totalUsuariosReal !== totalUsuariosTabla ||
    totalCertificacionesReal !== totalCertificacionesTabla ||
    totalDocumentosReal !== totalDocumentosTabla;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
          minHeight: "80vh",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle sx={{ bgcolor: institutionalColors.background, borderBottom: `1px solid ${institutionalColors.lightBlue}` }}>
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

          <Stack direction="row" spacing={1}>
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
            {onRefreshStats && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => onRefreshStats(instance.id)}
                sx={{
                  color: institutionalColors.primary,
                  borderColor: institutionalColors.primary,
                }}
              >
                Actualizar
              </Button>
            )}
          </Stack>
        </Stack>
      </DialogTitle>

      {/* TABS */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: institutionalColors.background }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root.Mui-selected': { color: institutionalColors.primary },
            '& .MuiTabs-indicator': { backgroundColor: institutionalColors.primary }
          }}
        >
          <Tab icon={<InfoIcon />} label="Información General" iconPosition="start" />
          <Tab icon={<TimelineIcon />} label="Estadísticas" iconPosition="start" />
        </Tabs>
      </Box>

      <DialogContent dividers sx={{ p: 3 }}>
        {tabValue === 0 ? (
          /* ========== TAB 1: INFORMACIÓN GENERAL ========== */
          <Grid container spacing={3}>
            {/* DESCRIPCIÓN */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Descripción
              </Typography>
              <Typography variant="body2">
                {descripcion || "Sin descripción"}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ borderColor: institutionalColors.lightBlue }} />
            </Grid>

            {/* ADMIN */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Administrador
              </Typography>
              <Typography variant="body2">
                {adminNombre || "No asignado"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Email Administrador
              </Typography>
              <Typography variant="body2">
                {adminEmail || "No asignado"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Fecha de creación
              </Typography>
              <Typography variant="body2">
                {fechaCreacion
                  ? isMapped 
                    ? fechaCreacion
                    : new Date(fechaCreacion).toLocaleString()
                  : "No disponible"}
              </Typography>
            </Grid>

            {!isMapped && (
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Última actualización
                </Typography>
                <Typography variant="body2">
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
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Colores del Sistema
              </Typography>
              <Grid container spacing={3}>
                <Grid item>
                  <Typography variant="caption" display="block">Primario</Typography>
                  <Box sx={{
                    width: 60,
                    height: 25,
                    bgcolor: colorPrimario,
                    borderRadius: 1,
                    border: '1px solid rgba(0,0,0,0.1)'
                  }} />
                </Grid>

                <Grid item>
                  <Typography variant="caption" display="block">Secundario</Typography>
                  <Box sx={{
                    width: 60,
                    height: 25,
                    bgcolor: colorSecundario,
                    borderRadius: 1,
                    border: '1px solid rgba(0,0,0,0.1)'
                  }} />
                </Grid>

                <Grid item>
                  <Typography variant="caption" display="block">Acento</Typography>
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

            {/* ESTADÍSTICAS BÁSICAS */}
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: alpha(institutionalColors.info, 0.05) }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <PeopleIcon sx={{ color: institutionalColors.info }} />
                    <Typography variant="subtitle2" sx={{ color: institutionalColors.info }}>
                      Usuarios
                    </Typography>
                  </Stack>
                  <Typography variant="h4" sx={{ color: institutionalColors.info, fontWeight: 'bold' }}>
                    {totalUsuariosReal}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: alpha(institutionalColors.success, 0.05) }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <VerifiedIcon sx={{ color: institutionalColors.success }} />
                    <Typography variant="subtitle2" sx={{ color: institutionalColors.success }}>
                      Certificaciones
                    </Typography>
                  </Stack>
                  <Typography variant="h4" sx={{ color: institutionalColors.success, fontWeight: 'bold' }}>
                    {totalCertificacionesReal}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: alpha(institutionalColors.warning, 0.05) }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <DescriptionIcon sx={{ color: institutionalColors.warning }} />
                    <Typography variant="subtitle2" sx={{ color: institutionalColors.warning }}>
                      Documentos
                    </Typography>
                  </Stack>
                  <Typography variant="h4" sx={{ color: institutionalColors.warning, fontWeight: 'bold' }}>
                    {totalDocumentosReal}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          /* ========== TAB 2: ESTADÍSTICAS DETALLADAS ========== */
          <Grid container spacing={3}>
            {/* Banner de advertencia si hay diferencias */}
            {hasDifferences && (
              <Grid item xs={12}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: alpha(institutionalColors.warning, 0.1), 
                  borderRadius: 1,
                  border: `1px solid ${alpha(institutionalColors.warning, 0.3)}`
                }}>
                  <Typography variant="body2" sx={{ color: institutionalColors.warning }}>
                    ⚡ Los datos mostrados son en tiempo real. Hay diferencias con los datos almacenados en la tabla.
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* Tarjetas principales */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <PeopleIcon sx={{ color: institutionalColors.primary }} />
                    <Typography variant="h6" sx={{ color: institutionalColors.primary }}>
                      Usuarios
                    </Typography>
                  </Stack>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Tiempo real:</Typography>
                    <Typography variant="h4" sx={{ color: institutionalColors.info, fontWeight: 'bold' }}>
                      {totalUsuariosReal}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Typography variant="body2" color="text.secondary">Tabla:</Typography>
                    <Typography variant="body1" sx={{ 
                      color: totalUsuariosReal !== totalUsuariosTabla ? institutionalColors.warning : 'text.primary'
                    }}>
                      {totalUsuariosTabla}
                    </Typography>
                  </Box>

                  {totalUsuariosReal !== totalUsuariosTabla && (
                    <LinearProgress 
                      variant="determinate" 
                      value={(totalUsuariosTabla / totalUsuariosReal) * 100} 
                      sx={{ mt: 1, height: 4, borderRadius: 2 }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <VerifiedIcon sx={{ color: institutionalColors.success }} />
                    <Typography variant="h6" sx={{ color: institutionalColors.success }}>
                      Certificaciones
                    </Typography>
                  </Stack>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Tiempo real:</Typography>
                    <Typography variant="h4" sx={{ color: institutionalColors.success, fontWeight: 'bold' }}>
                      {totalCertificacionesReal}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Typography variant="body2" color="text.secondary">Tabla:</Typography>
                    <Typography variant="body1" sx={{ 
                      color: totalCertificacionesReal !== totalCertificacionesTabla ? institutionalColors.warning : 'text.primary'
                    }}>
                      {totalCertificacionesTabla}
                    </Typography>
                  </Box>

                  {totalCertificacionesReal !== totalCertificacionesTabla && (
                    <LinearProgress 
                      variant="determinate" 
                      value={(totalCertificacionesTabla / totalCertificacionesReal) * 100} 
                      sx={{ mt: 1, height: 4, borderRadius: 2 }}
                      color="success"
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <DescriptionIcon sx={{ color: institutionalColors.warning }} />
                    <Typography variant="h6" sx={{ color: institutionalColors.warning }}>
                      Documentos
                    </Typography>
                  </Stack>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Tiempo real:</Typography>
                    <Typography variant="h4" sx={{ color: institutionalColors.warning, fontWeight: 'bold' }}>
                      {totalDocumentosReal}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Typography variant="body2" color="text.secondary">Tabla:</Typography>
                    <Typography variant="body1" sx={{ 
                      color: totalDocumentosReal !== totalDocumentosTabla ? institutionalColors.warning : 'text.primary'
                    }}>
                      {totalDocumentosTabla}
                    </Typography>
                  </Box>

                  {totalDocumentosReal !== totalDocumentosTabla && (
                    <LinearProgress 
                      variant="determinate" 
                      value={totalDocumentosTabla > 0 ? (totalDocumentosTabla / totalDocumentosReal) * 100 : 0} 
                      sx={{ mt: 1, height: 4, borderRadius: 2 }}
                      color="warning"
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Información de fechas */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ color: institutionalColors.primary, mb: 2 }}>
                Información de la Instancia
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, display: 'block' }}>
                      <CalendarIcon sx={{ fontSize: '0.8rem', verticalAlign: 'middle', mr: 0.5 }} />
                      Fecha de Creación
                    </Typography>
                    <Typography variant="body2" sx={{ color: institutionalColors.textPrimary, fontWeight: 500 }}>
                      {fechaCreacion
                        ? isMapped 
                          ? fechaCreacion
                          : new Date(fechaCreacion).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                        : 'No disponible'}
                    </Typography>
                  </Box>
                </Grid>

                {stats.fechaActualizacion && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ color: institutionalColors.textSecondary, display: 'block' }}>
                        <RefreshIcon sx={{ fontSize: '0.8rem', verticalAlign: 'middle', mr: 0.5 }} />
                        Última Actualización de Estadísticas
                      </Typography>
                      <Typography variant="body2" sx={{ color: institutionalColors.textPrimary, fontWeight: 500 }}>
                        {new Date(stats.fechaActualizacion).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* Administrador */}
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <AdminIcon sx={{ color: institutionalColors.primary }} />
                  <Typography variant="body2" sx={{ color: institutionalColors.textPrimary, fontWeight: 500 }}>
                    Administrador: {adminNombre || 'No asignado'}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: institutionalColors.textPrimary, ml: 4 }}>
                  Email: {adminEmail || 'Sin email'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: institutionalColors.background, borderTop: `1px solid ${institutionalColors.lightBlue}` }}>
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