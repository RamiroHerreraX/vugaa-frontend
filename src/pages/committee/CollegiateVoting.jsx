// src/pages/committee/CollegiateVoting.jsx
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
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  IconButton,
  Drawer,
  Badge,
  Tooltip
} from '@mui/material';
import {
  HowToVote as HowToVoteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';

const colors = {
  primary: { main: '#133B6B', dark: '#0D2A4D', light: '#3A6EA5' },
  status: { success: '#00A8A8', error: '#0099FF', warning: '#00C2D1' }
};

// Miembros del comité
const committeeMembers = [
  { id: 1, name: 'María González', role: 'Presidente', avatar: 'MG', color: '#133B6B' },
  { id: 2, name: 'Juan Pérez', role: 'Vocal', avatar: 'JP', color: '#00A8A8' },
  { id: 3, name: 'Laura Sánchez', role: 'Vocal', avatar: 'LS', color: '#6C5CE7' }
];

// Función para convertir enlaces de Google Drive a formato de vista previa
const getGoogleDrivePreviewUrl = (url) => {
  const fileIdMatch = url.match(/\/d\/(.+?)\/view/);
  if (fileIdMatch && fileIdMatch[1]) {
    const fileId = fileIdMatch[1];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url;
};

const CollegiateVoting = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [voteDialog, setVoteDialog] = useState(false);
  const [voteValue, setVoteValue] = useState('');
  const [voteComment, setVoteComment] = useState('');
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Datos mock de certificaciones para votar - ACTUALIZADO con el nuevo curso
  const [votingItems, setVotingItems] = useState([
    {
      id: 1,
      certification: 'CUR-ET-2026-001',
      type: 'CURSO DE ÉTICA PROFESIONAL',
      displayName: 'CURSO DE ÉTICA PROFESIONAL Y CÓDIGO DE CONDUCTA',
      applicant: 'Luis Rodríguez',
      pdfPath: 'https://drive.google.com/file/d/1Pocj7S4sMPGJuE8_pzVUELsYetlfmEB5/view?usp=sharing',
      technicalReview: 'Documentación completa, autenticidad verificada',
      votes: [
        { memberId: 1, status: null },
        { memberId: 2, status: null },
        { memberId: 3, status: null }
      ],
      status: 'pending'
    },
    {
      id: 2,
      certification: 'DIP-CE-2026-001',
      type: 'DIPLOMADO COMERCIO EXTERIOR',
      displayName: 'DIPLOMADO EN COMERCIO EXTERIOR Y LEGISLACIÓN ADUANERA',
      applicant: 'Luis Rodríguez',
      pdfPath: 'https://drive.google.com/file/d/1_LeeJr9dDka0hTRdDXJItZdduuHip8XT/view?usp=sharing',
      technicalReview: 'Documentos verificados, pendiente validación',
      votes: [
        { memberId: 1, status: 'approve' },
        { memberId: 2, status: null },
        { memberId: 3, status: 'reject' }
      ],
      status: 'voting'
    },
    {
      id: 3,
      certification: 'CUR-IVA-2026-001',
      type: 'MATERIA DEL IVA',
      displayName: 'MATERIA DEL IVA',
      applicant: 'Luis Rodríguez',
      pdfPath: 'https://drive.google.com/file/d/1iRDbcm_fvo02szzzrt8JCKPmkzg2IOn5/view?usp=sharing',
      technicalReview: 'Documento cargado el 12/02/2026, Universidad de Guanajuato',
      votes: [
        { memberId: 1, status: null },
        { memberId: 2, status: null },
        { memberId: 3, status: null }
      ],
      status: 'pending'
    }
  ]);

  const handleVote = () => {
    if (!voteValue || !selectedItem) return;

    const updatedItems = votingItems.map(item => {
      if (item.id === selectedItem.id) {
        const updatedVotes = item.votes.map(vote => 
          vote.memberId === 1 
            ? { ...vote, status: voteValue }
            : vote
        );

        const allVoted = updatedVotes.every(v => v.status !== null);

        return {
          ...item,
          votes: updatedVotes,
          status: allVoted ? 'completed' : 'voting'
        };
      }
      return item;
    });

    setVotingItems(updatedItems);
    setVoteDialog(false);
    setVoteValue('');
    setVoteComment('');
    setNotification({ show: true, type: 'success', message: 'Voto registrado' });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
  };

  const getVoteStatus = (status) => {
    if (status === 'approve') return { label: 'Aprobado', color: 'success', icon: <CheckCircleIcon fontSize="small" /> };
    if (status === 'reject') return { label: 'Rechazado', color: 'error', icon: <CancelIcon fontSize="small" /> };
    return { label: 'Pendiente', color: 'default', icon: null };
  };

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', bgcolor: '#f0f2f5' }}>
      {/* Header simplificado */}
      <Paper sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 0, bgcolor: colors.primary.main, color: 'white' }}>
        <IconButton 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          sx={{ color: 'white', display: { xs: 'flex', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <IconButton 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
          sx={{ color: 'white', display: { xs: 'none', md: 'flex' } }}
        >
          {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
        <HowToVoteIcon />
        <Typography variant="h6" fontWeight="bold">Votación Colegiada</Typography>
        {selectedItem && (
          <Chip 
            label={selectedItem.certification}
            size="small"
            sx={{ ml: 'auto', bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
        )}
      </Paper>

      {notification.show && (
        <Alert severity={notification.type} sx={{ m: 2 }}>{notification.message}</Alert>
      )}

      {/* Sidebar móvil */}
      <Drawer
        anchor="left"
        open={sidebarOpen && window.innerWidth < 900}
        onClose={() => setSidebarOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Certificaciones</Typography>
            <IconButton onClick={() => setSidebarOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <CertificationList items={votingItems} selectedItem={selectedItem} onSelect={setSelectedItem} />
        </Box>
      </Drawer>

      {/* Contenido principal */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar desktop - colapsable */}
        <Box sx={{ 
          width: sidebarCollapsed ? 80 : 280, 
          transition: 'width 0.2s',
          borderRight: 1, 
          borderColor: 'divider', 
          bgcolor: 'white',
          display: { xs: 'none', md: 'block' },
          overflow: 'hidden'
        }}>
          {sidebarCollapsed ? (
            <Box sx={{ p: 1 }}>
              {votingItems.map(item => (
                <Tooltip key={item.id} title={item.type} placement="right">
                  <Card 
                    sx={{ 
                      mb: 1, 
                      cursor: 'pointer',
                      bgcolor: selectedItem?.id === item.id ? 'rgba(19,59,107,0.08)' : 'transparent',
                      border: selectedItem?.id === item.id ? 1 : 0,
                      borderColor: colors.primary.main
                    }}
                    onClick={() => setSelectedItem(item)}
                  >
                    <CardContent sx={{ p: 1, textAlign: 'center' }}>
                      <Avatar sx={{ width: 40, height: 40, mx: 'auto', bgcolor: colors.primary.light, fontSize: '0.8rem' }}>
                        {item.type.substring(0, 3)}
                      </Avatar>
                      <Badge 
                        badgeContent={item.votes.filter(v => v.status !== null).length} 
                        color="primary"
                        sx={{ mt: 1 }}
                      >
                        <HowToVoteIcon fontSize="small" sx={{ color: colors.primary.main }} />
                      </Badge>
                    </CardContent>
                  </Card>
                </Tooltip>
              ))}
            </Box>
          ) : (
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Certificaciones</Typography>
              <CertificationList items={votingItems} selectedItem={selectedItem} onSelect={setSelectedItem} />
            </Box>
          )}
        </Box>

        {/* Visor PDF - Ocupa el máximo espacio */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {selectedItem ? (
            <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', m: 2, borderRadius: 2 }}>
              {/* Título compacto */}
              <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: '#f8f9fa' }}>
                <Typography variant="subtitle1" fontWeight="bold" noWrap>{selectedItem.displayName}</Typography>
                {selectedItem.id === 3 && (
                  <Typography variant="caption" color="text.secondary">
                    
                  </Typography>
                )}
              </Box>

              {/* Visor PDF - Tamaño completo */}
              <Box sx={{ flex: 1, overflow: 'auto', bgcolor: '#525659' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, minHeight: '100%' }}>
                  <iframe
                    src={getGoogleDrivePreviewUrl(selectedItem.pdfPath)}
                    title={selectedItem.displayName}
                    width="100%"
                    height="900px"
                    style={{ border: 'none', maxWidth: '1200px' }}
                  />
                </Box>
              </Box>

              {/* Panel de votación compacto */}
              <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: 'white' }}>
                <Grid container spacing={2} alignItems="center">
                  {/* Avatares de votación */}
                  <Grid item xs={12} md={5}>
                    <Stack direction="row" spacing={2} justifyContent="center">
                      {selectedItem.votes.map((vote, idx) => {
                        const member = committeeMembers[idx];
                        const status = getVoteStatus(vote.status);
                        return (
                          <Box key={idx} sx={{ textAlign: 'center' }}>
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              badgeContent={
                                status.icon ? (
                                  <Avatar sx={{ width: 20, height: 20, bgcolor: status.color === 'success' ? colors.status.success : colors.status.error }}>
                                    {status.icon}
                                  </Avatar>
                                ) : null
                              }
                            >
                              <Avatar sx={{ bgcolor: member.color, width: 48, height: 48 }}>
                                {member.avatar}
                              </Avatar>
                            </Badge>
                            <Typography variant="caption" display="block" fontWeight="bold">{member.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{member.role}</Typography>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Grid>

                  {/* Información y botón */}
                  <Grid item xs={12} md={7}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
                      <Box sx={{ maxWidth: 300 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          <strong>Revisión:</strong> {selectedItem.technicalReview}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<HowToVoteIcon />}
                        onClick={() => setVoteDialog(true)}
                        disabled={selectedItem.votes[0]?.status !== null}
                        sx={{ 
                          bgcolor: colors.primary.main,
                          '&:hover': { bgcolor: colors.primary.dark },
                          '&.Mui-disabled': { bgcolor: colors.primary.light },
                          minWidth: 150
                        }}
                      >
                        {selectedItem.votes[0]?.status ? 'Ya votaste' : 'Votar'}
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          ) : (
            <Paper sx={{ height: '100%', m: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Selecciona una certificación para votar</Typography>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Diálogo de votación simplificado */}
      <Dialog open={voteDialog} onClose={() => setVoteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: colors.primary.main, color: 'white' }}>
          Votar como Presidente
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <FormControl component="fieldset" sx={{ width: '100%', mb: 2 }}>
            <RadioGroup value={voteValue} onChange={(e) => setVoteValue(e.target.value)}>
              <Paper variant="outlined" sx={{ p: 1.5, mb: 1, cursor: 'pointer' }} onClick={() => setVoteValue('approve')}>
                <FormControlLabel 
                  value="approve" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ThumbUpIcon sx={{ color: colors.status.success }} /> A FAVOR
                    </Box>
                  } 
                  sx={{ width: '100%' }}
                />
              </Paper>
              <Paper variant="outlined" sx={{ p: 1.5, cursor: 'pointer' }} onClick={() => setVoteValue('reject')}>
                <FormControlLabel 
                  value="reject" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ThumbDownIcon sx={{ color: colors.status.error }} /> EN CONTRA
                    </Box>
                  } 
                  sx={{ width: '100%' }}
                />
              </Paper>
            </RadioGroup>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Comentario (opcional)"
            value={voteComment}
            onChange={(e) => setVoteComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVoteDialog(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleVote}
            disabled={!voteValue}
            sx={{ bgcolor: colors.primary.main }}
          >
            Confirmar Voto
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Componente de lista de certificaciones
const CertificationList = ({ items, selectedItem, onSelect }) => (
  <Stack spacing={1.5}>
    {items.map(item => (
      <Card 
        key={item.id} 
        variant="outlined"
        sx={{ 
          cursor: 'pointer',
          borderColor: selectedItem?.id === item.id ? colors.primary.main : 'divider',
          borderWidth: selectedItem?.id === item.id ? 2 : 1,
          bgcolor: selectedItem?.id === item.id ? 'rgba(19,59,107,0.04)' : 'white'
        }}
        onClick={() => onSelect(item)}
      >
        <CardContent sx={{ p: 1.5 }}>
          <Typography variant="subtitle2" fontWeight="bold" noWrap>{item.type}</Typography>
          <Typography variant="caption" display="block" color="text.secondary" noWrap>
            {item.certification}
          </Typography>
          {item.id === 3 && (
            <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
              Universidad de Guanajuato • 60h
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Stack direction="row" spacing={0.5}>
              {item.votes.map((vote, idx) => {
                const member = committeeMembers[idx];
                const status = vote.status === 'approve' ? 'success' : vote.status === 'reject' ? 'error' : 'default';
                return (
                  <Tooltip key={idx} title={`${member.name}: ${vote.status || 'Pendiente'}`}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: status === 'success' ? colors.status.success : status === 'error' ? colors.status.error : colors.primary.light }}>
                      {member.avatar}
                    </Avatar>
                  </Tooltip>
                );
              })}
            </Stack>
            <Chip 
              label={`${item.votes.filter(v => v.status !== null).length}/3`}
              size="small"
              color={item.votes.filter(v => v.status !== null).length === 3 ? 'success' : 'default'}
            />
          </Box>
        </CardContent>
      </Card>
    ))}
  </Stack>
);

export default CollegiateVoting;