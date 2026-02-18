// src/pages/user/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import {
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Description as DescriptionIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { getMiExpediente, getCertificaciones } from '../../services/expediente';

const UserDashboard = () => {
  const { user } = useAuth();
  const [expediente, setExpediente] = useState(null);
  const [certificaciones, setCertificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Cargar expediente
        const expData = await getMiExpediente();
        setExpediente(expData);
        
        // Cargar certificaciones
        if (expData?.id) {
          const certData = await getCertificaciones(expData.id);
          setCertificaciones(certData);
        }
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calcular estadísticas
  const stats = {
    vigentes: certificaciones.filter(c => c.estatus === 'VIGENTE').length,
    porVencer: certificaciones.filter(c => c.estatus === 'POR_VENCER').length,
    vencidas: certificaciones.filter(c => c.estatus === 'VENCIDA').length,
    revision: certificaciones.filter(c => c.estatus === 'EN_REVISION').length,
  };

  const cumplimientoPorcentaje = certificaciones.length > 0
    ? Math.round((stats.vigentes / certificaciones.length) * 100)
    : 0;

  const getSemaforoColor = () => {
    if (stats.vencidas > 0) return '#E74C3C'; // Rojo
    if (stats.porVencer > 0 || stats.revision > 0) return '#F39C12'; // Amarillo
    if (stats.vigentes === certificaciones.length && certificaciones.length > 0) return '#27AE60'; // Verde
    return '#95A5A6'; // Gris
  };

  const getNivelReconocimiento = () => {
    if (cumplimientoPorcentaje >= 90) return 'Avanzado';
    if (cumplimientoPorcentaje >= 70) return 'Intermedio';
    if (cumplimientoPorcentaje >= 50) return 'Básico';
    return 'Sin reconocimiento';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Cargando tu expediente...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            ¡Hola, {user?.nombre}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bienvenido a tu portal de cumplimiento. Aquí puedes gestionar tus certificaciones y documentos.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: '#2874A6', '&:hover': { bgcolor: '#1B4D72' } }}
        >
          Nueva Certificación
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Semáforo de Cumplimiento */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estado de Cumplimiento
              </Typography>
              <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', my: 2 }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    bgcolor: getSemaforoColor(),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 3,
                  }}
                >
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {cumplimientoPorcentaje}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h6" align="center" gutterBottom>
                Nivel: {getNivelReconocimiento()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen de Certificaciones
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <CheckCircleIcon sx={{ color: '#27AE60', fontSize: 32 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {stats.vigentes}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Vigentes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <WarningIcon sx={{ color: '#F39C12', fontSize: 32 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {stats.porVencer}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Por Vencer
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <ErrorIcon sx={{ color: '#E74C3C', fontSize: 32 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {stats.vencidas}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Vencidas
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <SchoolIcon sx={{ color: '#3498DB', fontSize: 32 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {stats.revision}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      En Revisión
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Progreso general: {cumplimientoPorcentaje}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={cumplimientoPorcentaje}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#E0E0E0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getSemaforoColor(),
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Últimas Certificaciones */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Últimas Certificaciones
          </Typography>
          {certificaciones.length === 0 ? (
            <Alert severity="info">
              No tienes certificaciones registradas. Comienza agregando una nueva certificación.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {certificaciones.slice(0, 3).map((cert, index) => (
                <Grid item xs={12} key={index}>
                  <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {cert.nombre || `Certificación ${index + 1}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Folio: {cert.folio || 'N/A'} | Vigencia: {cert.fechaVencimiento || 'No definida'}
                      </Typography>
                    </Box>
                    <Chip
                      label={cert.estatus || 'Pendiente'}
                      size="small"
                      sx={{
                        bgcolor: cert.estatus === 'VIGENTE' ? '#27AE6020' :
                                cert.estatus === 'POR_VENCER' ? '#F39C1220' :
                                cert.estatus === 'VENCIDA' ? '#E74C3C20' : '#95A5A620',
                        color: cert.estatus === 'VIGENTE' ? '#27AE60' :
                               cert.estatus === 'POR_VENCER' ? '#F39C12' :
                               cert.estatus === 'VENCIDA' ? '#E74C3C' : '#7F8C8D',
                        fontWeight: 'bold',
                      }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDashboard;