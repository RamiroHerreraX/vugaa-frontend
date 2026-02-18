// src/pages/committee/Dashboard.jsx
import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Assignment as AssignmentIcon, CheckCircle as CheckCircleIcon, Schedule as ScheduleIcon, Warning as WarningIcon } from '@mui/icons-material';

const CommitteeDashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Comité de Cumplimiento
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Revisa y valida las certificaciones pendientes de los asociados.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Pendientes
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="#E74C3C">
                    12
                  </Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 48, color: '#E74C3C', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    En Revisión
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="#F39C12">
                    5
                  </Typography>
                </Box>
                <ScheduleIcon sx={{ fontSize: 48, color: '#F39C12', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Aprobadas Hoy
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="#27AE60">
                    8
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 48, color: '#27AE60', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Por Vencer
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="#E67E22">
                    15
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 48, color: '#E67E22', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Certificaciones Pendientes de Revisión
              </Typography>
              <List>
                {[1, 2, 3, 4, 5].map((item) => (
                  <React.Fragment key={item}>
                    <ListItem>
                      <ListItemText
                        primary={`Certificación #${item} - Juan Pérez`}
                        secondary="Tipo: Certificación Profesional | Fecha: 15/02/2026"
                      />
                      <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                        Revisar
                      </Typography>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CommitteeDashboard;