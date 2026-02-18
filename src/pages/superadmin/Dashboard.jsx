// src/pages/superadmin/Dashboard.jsx
import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { Layers as LayersIcon, People as PeopleIcon } from '@mui/icons-material';

const SuperAdminDashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard Super Admin
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Panel de control multi-sistema. Aquí puedes ver el estado de todas las instancias.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Instancias Activas
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    8
                  </Typography>
                </Box>
                <LayersIcon sx={{ fontSize: 48, color: '#133B6B', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Usuarios Totales
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    1,420
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 48, color: '#00C2D1', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SuperAdminDashboard;