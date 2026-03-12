// src/pages/committee/CommitteeMinutes.jsx
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
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Gavel as GavelIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HowToVote as HowToVoteIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Archive as ArchiveIcon,
  Visibility as VisibilityIcon,
  DateRange as DateRangeIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

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

const CommitteeMinutes = () => {
  const [selectedMinute, setSelectedMinute] = useState(null);
  const [dateRange, setDateRange] = useState('week');
  const [signDialog, setSignDialog] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Datos mock de minutas
  const minutes = [
    {
      id: 1,
      date: '15/01/2026',
      time: '10:30 - 12:45',
      title: 'Sesión Ordinaria - Validaciones del Comité',
      type: 'Ordinaria',
      status: 'Pendiente de firma',
      signedBy: [],
      totalValidations: 8,
      approved: 6,
      rejected: 2,
      participants: [
        { name: 'María González', role: 'Presidenta', avatar: 'MG', signed: false },
        { name: 'Juan Pérez', role: 'Vocal', avatar: 'JP', signed: false },
        { name: 'Laura Sánchez', role: 'Vocal', avatar: 'LS', signed: false },
        { name: 'Carlos Ruiz', role: 'Secretario Técnico', avatar: 'CR', signed: true }
      ],
      validations: [
        { id: 101, certification: 'PA-2026-00145', type: 'Patente Aduanal', result: 'Aprobada', votes: { mg: 'approve', jp: 'approve', ls: 'approve' } },
        { id: 102, certification: 'OS-2025-03421', type: 'Opinión SAT', result: 'Rechazada', votes: { mg: 'reject', jp: 'approve', ls: 'reject' } },
        { id: 103, certification: 'CP-2024-56789', type: 'Cédula Profesional', result: 'Aprobada', votes: { mg: 'approve', jp: 'approve', ls: 'approve' } },
      ]
    },
    {
      id: 2,
      date: '14/01/2026',
      time: '09:00 - 11:15',
      title: 'Sesión Extraordinaria - Revisión de Casos Urgentes',
      type: 'Extraordinaria',
      status: 'Firmada',
      signedBy: ['María González', 'Juan Pérez', 'Laura Sánchez', 'Carlos Ruiz'],
      totalValidations: 5,
      approved: 4,
      rejected: 1,
      participants: [
        { name: 'María González', role: 'Presidenta', avatar: 'MG', signed: true },
        { name: 'Juan Pérez', role: 'Vocal', avatar: 'JP', signed: true },
        { name: 'Laura Sánchez', role: 'Vocal', avatar: 'LS', signed: true },
        { name: 'Carlos Ruiz', role: 'Secretario Técnico', avatar: 'CR', signed: true }
      ],
      validations: [
        { id: 104, certification: 'PN-2025-12345', type: 'Poder Notarial', result: 'Aprobada', votes: { mg: 'approve', jp: 'approve', ls: 'approve' } },
        { id: 105, certification: 'CF-2025-78901', type: 'Constancia Fiscal', result: 'Aprobada', votes: { mg: 'approve', jp: 'approve', ls: 'approve' } },
        { id: 106, certification: 'PA-2026-00146', type: 'Patente Aduanal', result: 'Rechazada', votes: { mg: 'reject', jp: 'reject', ls: 'approve' } },
      ]
    },
    {
      id: 3,
      date: '13/01/2026',
      time: '15:00 - 17:30',
      title: 'Sesión Ordinaria - Validaciones y Seguimiento',
      type: 'Ordinaria',
      status: 'Firmada',
      signedBy: ['María González', 'Juan Pérez', 'Laura Sánchez', 'Carlos Ruiz'],
      totalValidations: 12,
      approved: 10,
      rejected: 2,
      participants: [
        { name: 'María González', role: 'Presidenta', avatar: 'MG', signed: true },
        { name: 'Juan Pérez', role: 'Vocal', avatar: 'JP', signed: true },
        { name: 'Laura Sánchez', role: 'Vocal', avatar: 'LS', signed: true },
        { name: 'Carlos Ruiz', role: 'Secretario Técnico', avatar: 'CR', signed: true }
      ],
      validations: [
        { id: 107, certification: 'OS-2025-03422', type: 'Opinión SAT', result: 'Aprobada', votes: { mg: 'approve', jp: 'approve', ls: 'approve' } },
        { id: 108, certification: 'CP-2024-56790', type: 'Cédula Profesional', result: 'Aprobada', votes: { mg: 'approve', jp: 'approve', ls: 'approve' } },
      ]
    }
  ];

  const handleSign = () => {
    setSignDialog(false);
    setNotification({
      show: true,
      type: 'success',
      message: 'Acta firmada electrónicamente. Se ha generado el PDF oficial.'
    });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
  };

  const handleDownload = (minute) => {
    setNotification({
      show: true,
      type: 'info',
      message: `Descargando acta del ${minute.date}...`
    });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 2000);
  };

  const filteredMinutes = minutes.filter(minute => {
    if (dateRange === 'week') {
      // Simulación: últimos 7 días
      return true;
    }
    return true;
  });

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
          <DescriptionIcon sx={{ color: colors.primary.main }} />
          Minutas y Actas del Comité
        </Typography>
        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
          Registro oficial de sesiones y validaciones colegiadas
        </Typography>
      </Box>

      {/* Filtros y acciones */}
      <Paper elevation={1} sx={{ p: 2, mb: 2, border: `1px solid ${colors.primary.light}20` }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Período</InputLabel>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                label="Período"
              >
                <MenuItem value="day">Hoy</MenuItem>
                <MenuItem value="week">Última semana</MenuItem>
                <MenuItem value="month">Último mes</MenuItem>
                <MenuItem value="quarter">Último trimestre</MenuItem>
                <MenuItem value="year">Último año</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<DescriptionIcon />}
                onClick={() => {}}
                sx={{ bgcolor: colors.primary.main }}
              >
                Generar Minuta
              </Button>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                sx={{ borderColor: colors.primary.light, color: colors.primary.main }}
              >
                Imprimir
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Notificación */}
      {notification.show && (
        <Alert severity={notification.type} sx={{ mb: 2 }}>
          {notification.message}
        </Alert>
      )}

      {/* Lista de minutas */}
      <Paper elevation={1} sx={{ 
        flex: 1, 
        overflow: 'auto',
        p: 2,
        border: `1px solid ${colors.primary.light}20`
      }}>
        <Grid container spacing={2}>
          {filteredMinutes.map((minute) => (
            <Grid item xs={12} key={minute.id}>
              <Card 
                variant="outlined"
                sx={{ 
                  borderColor: selectedMinute?.id === minute.id ? colors.primary.main : colors.primary.light,
                  bgcolor: selectedMinute?.id === minute.id ? 'rgba(19, 59, 107, 0.04)' : 'transparent',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedMinute(minute)}
              >
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Avatar sx={{ bgcolor: colors.primary.main, width: 40, height: 40 }}>
                          <EventIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: colors.primary.dark }}>
                            {minute.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <DateRangeIcon sx={{ fontSize: 14, color: colors.text.secondary }} />
                              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                {minute.date}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTimeIcon sx={{ fontSize: 14, color: colors.text.secondary }} />
                              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                {minute.time}
                              </Typography>
                            </Box>
                            <Chip 
                              label={minute.type}
                              size="small"
                              sx={{ 
                                bgcolor: minute.type === 'Extraordinaria' ? colors.status.warning : colors.status.info,
                                color: 'white',
                                fontSize: '0.7rem',
                                height: 20
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>

                      <Stack direction="row" spacing={3} sx={{ ml: 7 }}>
                        <Box>
                          <Typography variant="h6" sx={{ color: colors.status.success, fontWeight: 'bold' }}>
                            {minute.approved}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            Aprobadas
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ color: colors.status.error, fontWeight: 'bold' }}>
                            {minute.rejected}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            Rechazadas
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ color: colors.primary.main, fontWeight: 'bold' }}>
                            {minute.totalValidations}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            Total
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip 
                          label={minute.status}
                          size="small"
                          sx={{ 
                            mb: 1,
                            bgcolor: minute.status === 'Firmada' ? colors.status.success : colors.status.warning,
                            color: 'white'
                          }}
                        />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mb: 1 }}>
                          {minute.participants.map((p, idx) => (
                            <Tooltip key={idx} title={`${p.name} (${p.role})${p.signed ? ' - Firmado' : ' - Pendiente'}`}>
                              <Avatar 
                                sx={{ 
                                  width: 28, 
                                  height: 28, 
                                  bgcolor: p.signed ? colors.status.success : colors.primary.light,
                                  border: p.signed ? `2px solid ${colors.status.success}` : 'none'
                                }}
                              >
                                {p.avatar}
                              </Avatar>
                            </Tooltip>
                          ))}
                        </Box>
                        
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Ver detalles">
                            <IconButton size="small" sx={{ color: colors.primary.main }}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Descargar PDF">
                            <IconButton size="small" onClick={() => handleDownload(minute)} sx={{ color: colors.primary.main }}>
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {minute.status === 'Pendiente de firma' && (
                            <Tooltip title="Firmar acta">
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSignDialog(true);
                                }}
                                sx={{ color: colors.status.success }}
                              >
                                <HowToVoteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </Box>
                    </Grid>

                    {/* Validaciones (expandible) */}
                    {selectedMinute?.id === minute.id && (
                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 2, borderColor: colors.primary.light }} />
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: colors.primary.dark }}>
                          Validaciones realizadas:
                        </Typography>
                        
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Certificación</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Resultado</TableCell>
                                <TableCell>Votación</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {minute.validations.map((val) => (
                                <TableRow key={val.id}>
                                  <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: colors.primary.dark }}>
                                      {val.certification}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip 
                                      label={val.type}
                                      size="small"
                                      sx={{ fontSize: '0.7rem', height: 20 }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Chip 
                                      label={val.result}
                                      size="small"
                                      sx={{ 
                                        bgcolor: val.result === 'Aprobada' ? colors.status.success : colors.status.error,
                                        color: 'white',
                                        fontWeight: 600
                                      }}
                                      icon={val.result === 'Aprobada' ? <CheckCircleIcon /> : <CancelIcon />}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                      <Tooltip title="Presidenta: A favor">
                                        <Avatar sx={{ width: 20, height: 20, bgcolor: colors.status.success, fontSize: '0.7rem' }}>MG</Avatar>
                                      </Tooltip>
                                      <Tooltip title="Vocal: A favor">
                                        <Avatar sx={{ width: 20, height: 20, bgcolor: colors.status.success, fontSize: '0.7rem' }}>JP</Avatar>
                                      </Tooltip>
                                      <Tooltip title="Vocal: A favor">
                                        <Avatar sx={{ width: 20, height: 20, bgcolor: colors.status.success, fontSize: '0.7rem' }}>LS</Avatar>
                                      </Tooltip>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Diálogo de firma */}
      <Dialog open={signDialog} onClose={() => setSignDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: colors.primary.dark }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HowToVoteIcon sx={{ color: colors.primary.main }} />
            Firmar Acta Electrónicamente
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3, color: colors.text.secondary }}>
            Al firmar esta acta, certificas que has revisado y estás de acuerdo con las validaciones realizadas en la sesión.
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            Esta firma tiene validez oficial y quedará registrada en el historial de auditoría.
          </Alert>
          
          <TextField
            fullWidth
            label="Contraseña de firma electrónica"
            type="password"
            size="small"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSignDialog(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleSign}
            sx={{ bgcolor: colors.primary.main }}
          >
            Firmar Acta
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommitteeMinutes;