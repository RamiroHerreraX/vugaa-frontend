// src/pages/committee/CommitteeAssignments.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  TextField,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  HowToVote as HowToVoteIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Autorenew as AutorenewIcon,
  Send as SendIcon,
  Replay as ReplayIcon,
  Gavel as GavelIcon,
  Description as DescriptionIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  DragIndicator as DragIndicatorIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  AssignmentLate as AssignmentLateIcon,
  SupervisorAccount as SupervisorAccountIcon,
  SwapHoriz as SwapHorizIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const colors = {
  primary: {
    dark: '#0D2A4D',
    main: '#133B6B',
    light: '#3A6EA5'
  },
  secondary: {
    main: '#00A8A8',
    light: '#00C2D1'
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
    secondary: '#3A6EA5'
  }
};

const CommitteeAssignments = () => {
  const { user, canAssignReviews } = useAuth();
  const [selectedCert, setSelectedCert] = useState(null);
  const [assignDialog, setAssignDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Lista de miembros del comité
  const committeeMembers = [
    { id: 1, name: 'María González', role: 'Presidenta', avatar: 'MG', load: 3, specialization: 'Patentes Aduanales' },
    { id: 2, name: 'Juan Pérez', role: 'Vocal', avatar: 'JP', load: 2, specialization: 'Opiniones SAT' },
    { id: 3, name: 'Laura Sánchez', role: 'Vocal', avatar: 'LS', load: 4, specialization: 'Cédulas Profesionales' },
    { id: 4, name: 'Carlos Ruiz', role: 'Secretario Técnico', avatar: 'CR', load: 1, specialization: 'General' }
  ];

  // Certificaciones pendientes de asignar
  const [pendingCertifications, setPendingCertifications] = useState([
    {
      id: 1,
      type: 'PATENTE ADUANAL',
      code: 'PA-2026-00145',
      applicant: 'Luis Rodríguez',
      region: 'Norte',
      priority: 'ALTA',
      uploadDate: '15/01/2026',
      daysWaiting: 1,
      documents: 5,
      complexity: 'Alta',
      assignedTo: null
    },
    {
      id: 2,
      type: 'OPINIÓN SAT',
      code: 'OS-2025-03421',
      applicant: 'Carlos Martínez',
      region: 'Sur',
      priority: 'ALTA',
      uploadDate: '14/01/2026',
      daysWaiting: 2,
      documents: 3,
      complexity: 'Media',
      assignedTo: null
    },
    {
      id: 3,
      type: 'CÉDULA PROFESIONAL',
      code: 'CP-2024-56789',
      applicant: 'Ana López',
      region: 'Centro',
      priority: 'MEDIA',
      uploadDate: '13/01/2026',
      daysWaiting: 3,
      documents: 4,
      complexity: 'Baja',
      assignedTo: 'Juan Pérez'
    },
    {
      id: 4,
      type: 'PODER NOTARIAL',
      code: 'PN-2025-12345',
      applicant: 'Pedro Sánchez',
      region: 'Metropolitana',
      priority: 'ALTA',
      uploadDate: '12/01/2026',
      daysWaiting: 4,
      documents: 2,
      complexity: 'Alta',
      assignedTo: null
    },
    {
      id: 5,
      type: 'CONSTANCIA FISCAL',
      code: 'CF-2025-78901',
      applicant: 'Laura Díaz',
      region: 'Norte',
      priority: 'MEDIA',
      uploadDate: '11/01/2026',
      daysWaiting: 5,
      documents: 6,
      complexity: 'Media',
      assignedTo: 'María González'
    }
  ]);

  const handleAssign = () => {
    if (!selectedMember || !selectedCert) return;

    setPendingCertifications(prev => prev.map(cert => 
      cert.id === selectedCert.id 
        ? { ...cert, assignedTo: committeeMembers.find(m => m.id === selectedMember).name }
        : cert
    ));

    setAssignDialog(false);
    setSelectedMember('');
    setSelectedCert(null);
    setNotification({
      show: true,
      type: 'success',
      message: `Certificación asignada a ${committeeMembers.find(m => m.id === selectedMember).name}`
    });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
  };

  const handleReassign = (cert) => {
    setSelectedCert(cert);
    setAssignDialog(true);
  };

  // Si no tiene permisos de asignación, mostrar mensaje
  if (!canAssignReviews()) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <SupervisorAccountIcon sx={{ fontSize: 60, color: colors.primary.light, mb: 2 }} />
        <Typography variant="h6" sx={{ color: colors.text.secondary, mb: 1 }}>
          Acceso restringido
        </Typography>
        <Typography variant="body2" sx={{ color: colors.primary.light }}>
          Solo el Secretario Técnico puede realizar asignaciones de revisiones.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      bgcolor: '#f8fafc'
    }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ color: colors.primary.dark, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon sx={{ color: colors.primary.main }} />
          Asignación de Revisiones
        </Typography>
        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
          Distribuye las certificaciones entre los miembros del Comité
        </Typography>
      </Box>

      {/* Notificación */}
      {notification.show && (
        <Alert severity={notification.type} sx={{ mb: 2 }}>
          {notification.message}
        </Alert>
      )}

      {/* Grid de dos columnas */}
      <Grid container spacing={2} sx={{ flex: 1, overflow: 'hidden' }}>
        {/* Columna izquierda - Pendientes */}
        <Grid item xs={12} md={5} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={1} sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            border: `1px solid ${colors.primary.light}20`
          }}>
            <Box sx={{ 
              p: 2, 
              borderBottom: `1px solid ${colors.primary.light}`,
              bgcolor: colors.background.subtle,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: colors.primary.dark, display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon sx={{ color: colors.status.warning }} />
                Pendientes de Asignación ({pendingCertifications.filter(c => !c.assignedTo).length})
              </Typography>
              <Tooltip title="Actualizar">
                <IconButton size="small" sx={{ color: colors.text.secondary }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <Stack spacing={1.5}>
                {pendingCertifications
                  .filter(c => !c.assignedTo)
                  .map((cert) => (
                    <Card 
                      key={cert.id}
                      variant="outlined"
                      sx={{ 
                        cursor: 'pointer',
                        borderColor: selectedCert?.id === cert.id ? colors.primary.main : colors.primary.light,
                        bgcolor: selectedCert?.id === cert.id ? 'rgba(19, 59, 107, 0.04)' : 'transparent',
                        '&:hover': { borderColor: colors.primary.main }
                      }}
                      onClick={() => setSelectedCert(cert)}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                              {cert.type}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.text.secondary, fontFamily: 'monospace' }}>
                              {cert.code}
                            </Typography>
                          </Box>
                          <Chip 
                            label={`${cert.daysWaiting}d`}
                            size="small"
                            sx={{ 
                              bgcolor: cert.daysWaiting > 3 ? colors.status.error : 
                                      cert.daysWaiting > 2 ? colors.status.warning : 
                                      colors.status.success,
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </Box>

                        <Grid container spacing={1} sx={{ mb: 1.5 }}>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                              Solicitante
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                              {cert.applicant}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                              Región
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                              {cert.region}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Stack direction="row" spacing={0.5}>
                            <Chip 
                              label={cert.priority}
                              size="small"
                              sx={{ 
                                bgcolor: cert.priority === 'ALTA' ? colors.status.error : colors.status.warning,
                                color: 'white',
                                height: 20,
                                fontSize: '0.7rem'
                              }}
                            />
                            <Chip 
                              label={cert.complexity}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          </Stack>
                          
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<SendIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCert(cert);
                              setAssignDialog(true);
                            }}
                            sx={{ 
                              bgcolor: colors.primary.main,
                              '&:hover': { bgcolor: colors.primary.dark }
                            }}
                          >
                            Asignar
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
              </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* Columna derecha - Distribución */}
        <Grid item xs={12} md={7} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={1} sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            border: `1px solid ${colors.primary.light}20`
          }}>
            <Box sx={{ 
              p: 2, 
              borderBottom: `1px solid ${colors.primary.light}`,
              bgcolor: colors.background.subtle
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: colors.primary.dark, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SupervisorAccountIcon sx={{ color: colors.primary.main }} />
                Carga de Trabajo por Miembro
              </Typography>
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <Grid container spacing={2}>
                {committeeMembers.map((member) => {
                  const assignedCount = pendingCertifications.filter(c => c.assignedTo === member.name).length;
                  const totalLoad = member.load + assignedCount;
                  
                  return (
                    <Grid item xs={12} key={member.id}>
                      <Card variant="outlined" sx={{ borderColor: colors.primary.light }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar sx={{ bgcolor: colors.primary.main, width: 48, height: 48 }}>
                              {member.avatar}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                                {member.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                {member.role} • Especialidad: {member.specialization}
                              </Typography>
                            </Box>
                            <Badge badgeContent={totalLoad} color="primary" max={9} />
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                Carga actual
                              </Typography>
                              <Typography variant="caption" sx={{ fontWeight: 'bold', color: colors.primary.main }}>
                                {totalLoad} certificaciones
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={(totalLoad / 8) * 100}
                              sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                bgcolor: colors.primary.light,
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: totalLoad > 6 ? colors.status.error : 
                                          totalLoad > 4 ? colors.status.warning : 
                                          colors.status.success
                                }
                              }}
                            />
                          </Box>

                          {/* Certificaciones asignadas */}
                          {assignedCount > 0 && (
                            <>
                              <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 1 }}>
                                Asignadas actualmente:
                              </Typography>
                              <Stack spacing={0.5}>
                                {pendingCertifications
                                  .filter(c => c.assignedTo === member.name)
                                  .map(cert => (
                                    <Box 
                                      key={cert.id}
                                      sx={{ 
                                        p: 1,
                                        bgcolor: colors.background.subtle,
                                        borderRadius: 1,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                      }}
                                    >
                                      <Box>
                                        <Typography variant="caption" sx={{ fontWeight: 600, color: colors.primary.dark }}>
                                          {cert.code}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                                          {cert.type}
                                        </Typography>
                                      </Box>
                                      <Tooltip title="Reasignar">
                                        <IconButton 
                                          size="small" 
                                          onClick={() => handleReassign(cert)}
                                          sx={{ color: colors.text.secondary }}
                                        >
                                          <SwapHorizIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  ))}
                              </Stack>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Diálogo de asignación */}
      <Dialog open={assignDialog} onClose={() => setAssignDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: colors.primary.dark }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon sx={{ color: colors.primary.main }} />
            Asignar Revisión
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCert && (
            <>
              <Card variant="outlined" sx={{ p: 2, mb: 3, borderColor: colors.primary.light }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: colors.primary.dark, mb: 1 }}>
                  Certificación a asignar:
                </Typography>
                <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                  {selectedCert.type} - {selectedCert.code}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>
                  Solicitante: {selectedCert.applicant} • Prioridad: {selectedCert.priority}
                </Typography>
              </Card>

              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Asignar a</InputLabel>
                <Select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  label="Asignar a"
                >
                  {committeeMembers.map(member => (
                    <MenuItem key={member.id} value={member.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                          {member.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{member.name}</Typography>
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            {member.role} • Carga actual: {member.load + (member.assignedCount || 0)}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Alert severity="info">
                La asignación quedará registrada en el historial de auditoría y el miembro recibirá una notificación.
              </Alert>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialog(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleAssign}
            disabled={!selectedMember}
            sx={{ bgcolor: colors.primary.main }}
          >
            Confirmar Asignación
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommitteeAssignments;