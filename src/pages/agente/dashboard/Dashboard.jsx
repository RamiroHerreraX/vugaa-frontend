import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Divider,
  LinearProgress,
  Chip,
  Button
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Insights as InsightsIcon,
  Done as DoneIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// Paleta corporativa del UserManagement
const colors = {
  primary: {
    dark: '#0D2A4D',
    main: '#133B6B',
    light: '#3A6EA5'
  },
  secondary: {
    main: '#00A8A8',
    light: '#00C2D1',
    lighter: '#35D0FF'
  },
  accents: {
    blue: '#0099FF',
    purple: '#6C5CE7'
  },
  status: {
    success: '#00A8A8',
    warning: '#00C2D1',
    error: '#0099FF',
    info: '#3A6EA5'
  },
  text: {
    primary: '#0D2A4D',
    secondary: '#3A6EA5',
    light: '#6C5CE7'
  }
};

const UserDashboard = () => {
  // Datos mock para el dashboard - AHORA VACÍOS
  const stats = [
    { title: 'Certificaciones Vigentes', value: '0', color: colors.status.success, icon: <CheckCircleIcon /> },
    { title: 'Certificaciones por Vencer', value: '0', color: colors.status.warning, icon: <WarningIcon /> },
    { title: 'Certificaciones Rechazadas', value: '0', color: colors.status.error, icon: <ErrorIcon /> },
    { title: 'Nivel de Cumplimiento', value: '0%', color: colors.primary.main, icon: <TrendingUpIcon /> },
  ];

  const alerts = [];

  const recentCertifications = [];

  return (
    <Box sx={{ maxWidth: '1300px', px: { xs: 2, sm: 3 } }}>
      {/* Header */}
       <Box sx={{ paddingLeft: 8 }}>
  <Typography variant="h5" sx={{ 
    color: colors.primary.dark, 
    fontWeight: 'bold', 
    display: 'flex', 
    alignItems: 'center', 
    gap: 1 
  }}>
    <InsightsIcon sx={{ color: colors.primary.main }} />
    Panel de Control del Agente
  </Typography>
  <Typography variant="caption" sx={{ color: colors.text.secondary }}>
    Gestión integral de expedientes
  </Typography>
</Box>

      {/* Estatus Global - AUMENTADO EL ESPACIO ABAJO */}
      <Card sx={{ 
        mb: 8,
        bgcolor: '#d4e3fd',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(19, 59, 107, 0.1)',
        border: `1px solid ${colors.primary.main}20`,
        maxWidth: '1050px',
        margin: '20px auto',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 3
          }}>
            {/* Primer elemento: Estatus Global */}
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'flex-start', sm: 'flex-start' }
            }}>
              <Typography variant="h6" sx={{ 
                color: colors.primary.dark, 
                fontWeight: '700',
                fontSize: '1.1rem',
                mb: 1
              }}>
                ESTATUS GLOBAL
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip 
                  label="SIN CERTIFICACIONES" 
                  color="default" 
                  size="medium"
                  sx={{ 
                    fontWeight: '600',
                    fontSize: '0.75rem',
                    alignSelf: 'flex-start',
                    bgcolor: '#e0e0e0',
                    color: '#666'
                  }}
                />
                <Typography variant="body2" sx={{ 
                  color: colors.text.secondary,
                  fontWeight: '500',
                  mt: 0.5
                }}>
                  Comienza agregando tu primera certificación
                </Typography>
              </Box>
            </Box>

            {/* Segundo elemento: Tres aspectos con iconos de aprobación - VACÍO */}
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              borderLeft: { sm: `1px solid ${colors.primary.main}20` },
              borderRight: { sm: `1px solid ${colors.primary.main}20` },
              pl: { sm: 3 },
              pr: { sm: 3 }
            }}>
              {/* Aspecto 1 - Vacío */}
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              }}>
                <Typography 
                  sx={{ 
                    color: colors.text.secondary,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    fontFamily: 'monospace'
                  }}
                >
                  0/20
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: colors.text.secondary,
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Formación ética y cumplimiento
                </Typography>
              </Box>
              
              {/* Aspecto 2 - Vacío */}
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              }}>
                <Typography 
                  sx={{ 
                    color: colors.text.secondary,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    fontFamily: 'monospace'
                  }}
                >
                  0/80
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: colors.text.secondary,
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Actualización técnica aduanera
                </Typography>
              </Box>
              
              {/* Aspecto 3 - Vacío */}
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              }}>
                <Typography 
                  sx={{ 
                    color: colors.text.secondary,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    fontFamily: 'monospace'
                  }}
                >
                  0/2
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: colors.text.secondary,
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Antisobornos y cadena de suministros
                </Typography>
              </Box>
            </Box>

            {/* Tercer elemento: Nivel 0 */}
            <Box sx={{ 
              flex: 1,
              textAlign: { xs: 'left', sm: 'center' }
            }}>
              <Typography variant="h4" sx={{ 
                color: colors.text.secondary, 
                fontWeight: '800',
                fontSize: { xs: '2rem', sm: '2.5rem' }
              }}>
                NIVEL 0
              </Typography>
              <Typography variant="subtitle2" sx={{ 
                color: colors.text.secondary,
                fontWeight: '600',
                fontSize: '0.95rem',
                mb: 1
              }}>
                Sin certificaciones
              </Typography>
              <Button 
                component={Link}
                to="/expediente"
                sx={{ 
                  color: colors.text.secondary,
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  textTransform: 'none',
                  textDecoration: 'underline',
                  '&:hover': {
                    color: colors.primary.main,
                    textDecoration: 'underline'
                  }
                }}
              >
                Comienza tu progreso
              </Button>
            </Box>
            
          </Box>
        </CardContent>
      </Card>

      {/* Estadísticas - Expandidas al ancho del Estatus Global */}
      <Box sx={{ 
        mb: 8,
        maxWidth: '1050px',
        width: '100%',
        margin: '20px auto'
      }}>
        <Grid container spacing={2} justifyContent="space-between">
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={5.8} md={2.8} key={index}>
              <Card sx={{ 
                height: '100%',
                borderRadius: 2,
                boxShadow: `0 4px 12px ${colors.primary.main}15`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 20px ${colors.primary.main}25`
                },
                width: '100%'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mb: 1
                  }}>
                    <Box>
                      <Typography variant="h3" sx={{ 
                        color: stat.color, 
                        fontWeight: '800',
                        fontSize: { xs: '2.5rem', sm: '3rem' },
                        lineHeight: 1
                      }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      color: stat.color,
                      fontSize: { xs: '2rem', sm: '2.5rem' }
                    }}>
                      {stat.icon}
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ 
                    color: colors.text.secondary,
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    mt: 2
                  }}>
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Contenedor para las dos secciones inferiores - Mismo ancho que Estatus Global */}
      <Box sx={{ 
        maxWidth: '1050px',
        margin: '0 auto',
        width: '100%',
        position: 'relative' // Añadido para posicionamiento relativo
      }}>
        <Grid container spacing={4}>
          
          {/* Resumen de Certificaciones - SIN CAMBIOS */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: 2,
              boxShadow: `0 4px 12px ${colors.primary.main}15`,
              height: '100%',
              width: '570px',
              maxWidth: '800px auto'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 3,
                  pb: 2,
                  borderBottom: `1px solid ${colors.primary.main}20`,
                  maxWidth: '800px '
                }}>
                  <Typography variant="h6" sx={{ 
                    color: colors.primary.dark, 
                    fontWeight: '700',
                    fontSize: '1.1rem'
                  }}>
                    RESUMEN DE CERTIFICACIONES
                  </Typography>
                  <Chip 
                    label="0 certificaciones"
                    size="small"
                    sx={{ 
                      backgroundColor: `${colors.primary.main}15`,
                      color: colors.primary.main,
                      fontWeight: '500'
                    }}
                  />
                </Box>
                
                <Stack spacing={2.5}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 4,
                      borderRadius: 1.5,
                      border: `1px solid ${colors.primary.main}20`,
                      textAlign: 'center',
                      bgcolor: '#f9f9f9'
                    }}
                  >
                    <Typography variant="body2" sx={{ 
                      color: colors.text.secondary,
                      mb: 2,
                      fontWeight: '500'
                    }}>
                      No hay certificaciones registradas
                    </Typography>
                    <Button 
                      variant="outlined" 
                      component={Link}
                      to="/certifications/new"
                      size="small"
                      sx={{ 
                        fontWeight: '600',
                        textTransform: 'none',
                        color: colors.primary.main,
                        borderColor: colors.primary.main,
                        '&:hover': {
                          borderColor: colors.primary.dark,
                          backgroundColor: `${colors.primary.main}10`
                        }
                      }}
                    >
                      Agregar certificación
                    </Button>
                  </Paper>
                </Stack>
                
                <Box sx={{ 
                  mt: 4, 
                  textAlign: 'center',
                  pt: 3,
                  borderTop: `1px solid ${colors.primary.main}20`
                }}>
                  <Button 
                    variant="outlined" 
                    component={Link}
                    to="/certifications"
                    sx={{ 
                      fontWeight: '600',
                      textTransform: 'none',
                      px: 4,
                      py: 1,
                      color: colors.primary.main,
                      borderColor: colors.primary.main,
                      '&:hover': {
                        borderColor: colors.primary.dark,
                        backgroundColor: `${colors.primary.main}10`
                      }
                    }}
                  >
                    Ver todas las certificaciones
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Alertas y Notificaciones - MODIFICADO CON CSS PARA SER MÁS ANCHO */}
          <Grid item xs={12} md={5} sx={{
            // Hacemos que este Grid item ocupe más espacio proporcional
            flexBasis: '42.6%', // Aumentamos el ancho base
            maxWidth: '42.6%',   // Aumentamos el ancho máximo
            flexGrow: 1,
            paddingLeft: '16px',
            paddingRight: '0px'
          }}>
            <Card sx={{ 
              borderRadius: 2,
              boxShadow: `0 4px 12px ${colors.primary.main}15`,
              height: '100%',
              width: '100%',
              // Hacemos el card más ancho expandiéndolo
              minWidth: '100%',
              transform: 'scale(1)', // Sin escala
              '& .MuiCardContent-root': {
                p: 3,
                width: '100%'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  pb: 2,
                  borderBottom: `1px solid ${colors.primary.main}20`,
                  width: '100%'
                }}>
                  <NotificationsIcon sx={{ 
                    mr: 1.5, 
                    color: colors.status.warning,
                    fontSize: '1.5rem'
                  }} />
                  <Typography variant="h6" sx={{ 
                    color: colors.primary.dark, 
                    fontWeight: '700',
                    fontSize: '1.1rem'
                  }}>
                    Alertas y Notificaciones
                  </Typography>
                  <Chip 
                    label="0 nuevas" 
                    color="default" 
                    size="small"
                    sx={{ 
                      ml: 'auto',
                      fontWeight: '600',
                      bgcolor: '#e0e0e0',
                      color: '#666'
                    }}
                  />
                </Box>

                <Stack spacing={3} sx={{ width: '100%' }}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2" sx={{ 
                      color: colors.primary.dark, 
                      mb: 1.5, 
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}>
                      <WarningIcon sx={{ fontSize: '1rem', color: colors.status.warning }} />
                      Vencimientos Próximos
                    </Typography>
                    <Paper variant="outlined" sx={{ 
                      p: 2.5, 
                      bgcolor: '#fffde7',
                      borderRadius: 1.5,
                      border: '1px solid #fff3e0',
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="body2" sx={{ 
                        color: colors.text.secondary,
                        fontWeight: '500',
                        fontSize: '0.9rem'
                      }}>
                        No hay vencimientos próximos
                      </Typography>
                    </Paper>
                  </Box>

                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2" sx={{ 
                      color: colors.primary.dark, 
                      mb: 1.5, 
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}>
                      <ErrorIcon sx={{ fontSize: '1rem', color: colors.status.error }} />
                      Observaciones Pendientes
                    </Typography>
                    <Paper variant="outlined" sx={{ 
                      p: 2.5, 
                      bgcolor: '#fffde7',
                      borderRadius: 1.5,
                      border: '1px solid #fff3e0',
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="body2" sx={{ 
                        color: colors.text.secondary,
                        fontWeight: '500',
                        fontSize: '0.9rem'
                      }}>
                        No hay observaciones pendientes
                      </Typography>
                    </Paper>
                  </Box>

                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2" sx={{ 
                      color: colors.primary.dark, 
                      mb: 1.5, 
                      fontWeight: '600',
                      fontSize: '0.95rem'
                    }}>
                      Historial de Alertas
                    </Typography>
                    <Paper variant="outlined" sx={{ 
                      p: 2.5, 
                      borderRadius: 1.5,
                      border: `1px solid ${colors.primary.main}20`,
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <Typography variant="body2" sx={{ 
                        color: colors.text.secondary,
                        fontWeight: '500',
                        mb: 1,
                        fontSize: '0.9rem'
                      }}>
                        No hay alertas en el historial
                      </Typography>
                    </Paper>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UserDashboard;