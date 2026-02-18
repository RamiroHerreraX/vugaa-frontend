// src/pages/admin/Dashboard.jsx
import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { People as PeopleIcon, Folder as FolderIcon, School as SchoolIcon, Assignment as AssignmentIcon } from '@mui/icons-material';

const AdminDashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Panel de Administración
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Bienvenido al panel de administración. Aquí puedes gestionar usuarios, expedientes y certificaciones.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Usuarios Totales
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    156
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 48, color: '#2C3E50', opacity: 0.3 }} />
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
                    Expedientes
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    142
                  </Typography>
                </Box>
                <FolderIcon sx={{ fontSize: 48, color: '#3498DB', opacity: 0.3 }} />
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
                    Certificaciones
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    328
                  </Typography>
                </Box>
                <SchoolIcon sx={{ fontSize: 48, color: '#9B59B6', opacity: 0.3 }} />
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
                    Pendientes
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    23
                  </Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 48, color: '#E67E22', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;