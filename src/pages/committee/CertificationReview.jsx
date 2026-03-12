// src/pages/committee/CertificationReview.jsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Alert,
  LinearProgress,
  Avatar,
  Card,
  CardContent,
  Tooltip,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Description as DescriptionIcon,
  History as HistoryIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, TimelineOppositeContent } from '@mui/lab';

const CertificationReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  
  // Datos de la certificación ACTUALIZADOS con los 3 documentos reales
  const certification = {
    id: id || '1',
    type: 'PATENTE ADUANAL',
    title: 'Certificación de Patente Aduanal',
    description: 'La patente aduanal autoriza a una persona física o moral para promover el despacho de las mercancías...',
    status: 'EN REVISIÓN TÉCNICA',
    statusColor: 'warning',
    issueDate: '11/01/2026',
    expirationDate: '11/01/2029',
    applicant: {
      name: 'Luis Rodríguez Martínez',
      type: 'Agente Aduanal',
      avatar: 'LR',
      curp: 'RODL800101HDFXYZ01',
      rfc: 'RODL800101ABC',
      region: 'Norte',
      email: 'luis.rodriguez@ejemplo.com',
      phone: '+52 55 1234 5678',
      complianceScore: 85,
      level: 'Avanzado'
    },
    certificationNumber: 'PA-2026-00145',
    // ACTUALIZADO: Solo los 3 documentos que tienen PDF real
    documents: [
      { 
        id: 1, 
        name: 'CURSO DE ÉTICA PROFESIONAL Y CÓDIGO DE CONDUCTA', 
        displayName: 'Curso de Ética Profesional',
        type: 'PDF', 
        size: '1.2 MB', 
        status: 'completo', 
        uploadDate: '20/02/2026',
        dueDate: '15/06/2028'
      },
      { 
        id: 2, 
        name: 'DIPLOMADO EN COMERCIO EXTERIOR Y LEGISLACIÓN ADUANERA', 
        displayName: 'Diplomado en Comercio Exterior',
        type: 'PDF', 
        size: '2.4 MB', 
        status: 'completo', 
        uploadDate: '15/02/2026',
        dueDate: '10/02/2028'
      },
      { 
        id: 3, 
        name: 'MATERIA DEL IVA - 60 HORAS', 
        displayName: 'Materia del IVA',
        type: 'PDF', 
        size: '2.1 MB', 
        status: 'completo', 
        uploadDate: '12/02/2026',
        dueDate: '12/02/2028',
        institution: 'Universidad de Guanajuato',
        location: 'Calle Abasolo 235'
      }
    ],
    validationHistory: [
      { 
        date: '12/02/2026 15:45', 
        action: 'Documento "Materia del IVA" cargado', 
        user: 'Luis Rodríguez',
        role: 'Agente Aduanal',
        type: 'submission'
      },
      { 
        date: '15/02/2026 14:30', 
        action: 'Documento "Diplomado Comercio Exterior" cargado', 
        user: 'Luis Rodríguez',
        role: 'Agente Aduanal',
        type: 'submission'
      },
      { 
        date: '20/02/2026 10:30', 
        action: 'Documento "Curso de Ética" cargado', 
        user: 'Luis Rodríguez',
        role: 'Agente Aduanal',
        type: 'submission'
      },
      { 
        date: '24/02/2026 09:15', 
        action: 'Certificación asignada para revisión técnica', 
        user: 'Sistema',
        role: 'Automático',
        type: 'assignment'
      }
    ]
  };

  const steps = [
    {
      label: 'Revisión Técnica',
      description: 'El Comité evalúa la documentación',
      status: 'in_progress',
      icon: <DescriptionIcon />
    },
    {
      label: 'Validación Colegiada',
      description: 'El pleno del Comité emite su voto',
      status: 'pending',
      icon: <AssessmentIcon />
    },
    {
      label: 'Dictamen Final',
      description: 'Resultado de la certificación',
      status: 'pending',
      icon: <CheckCircleIcon />
    }
  ];

  const getProgressPercentage = () => {
    return 33; // Progreso en revisión técnica
  };

  return (
    <Box sx={{ 
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#f8fafc'
    }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 2.5, borderBottom: '1px solid #e0e0e0', bgcolor: 'white' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                component={Link}
                to="/committee/review"
                size="small"
                sx={{ bgcolor: '#f0f4f8', '&:hover': { bgcolor: '#e3e8f0' } }}
              >
                <ArrowBackIcon />
              </IconButton>
              
              <Box>
                <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 700, mb: 0.5 }}>
                  Validación de Certificación
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                  <Chip 
                    label={certification.type}
                    size="small"
                    sx={{ bgcolor: '#e8eaf6', color: '#1a237e', fontWeight: 600 }}
                  />
                  <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace' }}>
                    {certification.certificationNumber}
                  </Typography>
                  <Chip 
                    label={certification.status}
                    size="small"
                    color={certification.statusColor}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1.5} justifyContent="flex-end" alignItems="center">
              <Box sx={{ textAlign: 'right', mr: 2 }}>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                  Progreso General
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 200 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={getProgressPercentage()} 
                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#1a237e' }}>
                    {getProgressPercentage()}%
                  </Typography>
                </Box>
              </Box>
              
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                sx={{ minWidth: 'auto' }}
              >
                Exportar
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Stepper */}
        <Stepper activeStep={0} sx={{ mt: 3 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel 
                StepIconComponent={() => (
                  <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: index === 0 ? '#1a237e' : '#e0e0e0',
                    color: index === 0 ? 'white' : '#9e9e9e'
                  }}>
                    {step.icon}
                  </Box>
                )}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {step.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    {step.description}
                  </Typography>
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {notification.show && (
        <Alert 
          severity={notification.type} 
          sx={{ m: 2 }}
          onClose={() => setNotification({ show: false, type: '', message: '' })}
        >
          {notification.message}
        </Alert>
      )}

      {/* Contenido Principal - Documentación */}
      <Box sx={{ flex: 1, overflow: 'hidden', p: 2 }}>
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Tabs de contenido */}
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)}
            sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: '#f8fafc' }}
          >
            <Tab icon={<DescriptionIcon />} iconPosition="start" label="Documentación" />
            <Tab icon={<HistoryIcon />} iconPosition="start" label="Historial" />
            <Tab icon={<AssessmentIcon />} iconPosition="start" label="Detalles" />
          </Tabs>

          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {tabValue === 0 && (
              <Grid container spacing={1.5}>
                {certification.documents.map((doc) => (
                  <Grid item xs={12} key={doc.id}>
                    <Card variant="outlined" sx={{ 
                      '&:hover': { bgcolor: '#f8f9fa' },
                      borderLeft: '4px solid #4caf50'
                    }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {doc.displayName || doc.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              {doc.type} • {doc.size} • Subido: {doc.uploadDate} • Vence: {doc.dueDate}
                            </Typography>
                            {doc.id === 3 && (
                              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                                {doc.institution} • {doc.location}
                              </Typography>
                            )}
                          </Box>
                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title="Ver documento">
                              <IconButton 
                                size="small"
                                onClick={() => navigate(`/committee/document/${certification.id}/${doc.id}`)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Descargar">
                              <IconButton size="small">
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {tabValue === 1 && (
              <Timeline position="right" sx={{ m: 0, p: 0 }}>
                {certification.validationHistory.map((item, index) => (
                  <TimelineItem key={index}>
                    <TimelineOppositeContent sx={{ flex: 0.2, color: '#64748b' }}>
                      {item.date}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot sx={{ 
                        bgcolor: 
                          item.type === 'submission' ? '#4caf50' :
                          item.type === 'assignment' ? '#ff9800' : '#2196f3'
                      }} />
                      {index < certification.validationHistory.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.action}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Por: {item.user} • {item.role}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            )}

            {tabValue === 2 && (
              <Stack spacing={2}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#1a237e' }}>
                    Información General
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                        Tipo
                      </Typography>
                      <Typography variant="body2">{certification.type}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                        Número
                      </Typography>
                      <Typography variant="body2">{certification.certificationNumber}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                        Emisión
                      </Typography>
                      <Typography variant="body2">{certification.issueDate}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: '#e74c3c', display: 'block', fontWeight: 600 }}>
                        Vencimiento
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#e74c3c', fontWeight: 600 }}>
                        {certification.expirationDate}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>

                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#1a237e' }}>
                    Solicitante
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 48, height: 48, bgcolor: '#1a237e' }}>
                      {certification.applicant.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {certification.applicant.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {certification.applicant.type} • {certification.applicant.region}
                      </Typography>
                    </Box>
                  </Box>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                        CURP
                      </Typography>
                      <Typography variant="body2">{certification.applicant.curp}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                        RFC
                      </Typography>
                      <Typography variant="body2">{certification.applicant.rfc}</Typography>
                    </Grid>
                  </Grid>
                </Card>
                
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#1a237e' }}>
                    Documentos Adjuntos
                  </Typography>
                  <Typography variant="body2">
                    {certification.documents.length} documentos • Todos en formato PDF
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {certification.documents.map(doc => (
                      <Chip 
                        key={doc.id}
                        label={`Doc ${doc.id}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Card>
              </Stack>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default CertificationReview;