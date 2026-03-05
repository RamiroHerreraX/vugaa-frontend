import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Grid,
  Divider,
  IconButton,
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Security as SecurityIcon,
  Badge as BadgeIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const colors = {
  primary: { dark: "#0D2A4D", main: "#133B6B", light: "#3A6EA5" },
  secondary: { main: "#00A8A8", light: "#00C2D1" },
  accents: { blue: "#0099FF", purple: "#6C5CE7" },
  text: { primary: "#0D2A4D", secondary: "#3A6EA5" },
};

// Función para normalizar y comparar si es rol comité
const esRolComite = (rolNombre) => {
  if (!rolNombre) return false;
  const normalizado = rolNombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
  return normalizado === "COMITE";
};

const getRoleColor = (rolNombre) => {
  if (!rolNombre) return colors.text.secondary;
  if (esRolComite(rolNombre)) return colors.accents.purple;
  switch (rolNombre?.toLowerCase()) {
    case "administrador":
      return colors.primary.dark;
    case "agente aduanal":
      return colors.primary.main;
    case "profesionista":
      return colors.accents.blue;
    case "empresario":
      return colors.secondary.main;
    default:
      return colors.accents.blue;
  }
};

// Función para formatear fecha
const formatFecha = (fecha) => {
  if (!fecha) return 'No registrado';
  try {
    return new Date(fecha).toLocaleString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Fecha inválida';
  }
};

const UserViewModal = ({ open, onClose, user }) => {
  if (!user) return null;

  const roleColor = getRoleColor(user.rolNombre);
  const isActive = user.estado === 'ACTIVO';

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: `1px solid #e0e0e0`,
        bgcolor: '#f8f9fa'
      }}>
        <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: 'bold' }}>
          Detalles del Usuario
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Header con avatar y nombre */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: roleColor,
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            {user.nombre?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ color: colors.primary.dark, fontWeight: 'bold' }}>
              {user.nombre || 'Sin nombre'}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip 
                label={user.rolNombre || 'Sin rol'} 
                size="small"
                sx={{
                  bgcolor: `${roleColor}15`,
                  color: roleColor,
                  fontWeight: 600,
                  border: `1px solid ${roleColor}30`
                }}
              />
              <Chip
                icon={isActive ? <CheckCircleIcon /> : <CancelIcon />}
                label={isActive ? 'Activo' : 'Inactivo'}
                size="small"
                sx={{
                  bgcolor: isActive ? colors.secondary.main + '20' : colors.primary.light + '20',
                  color: isActive ? colors.secondary.main : colors.primary.dark,
                  '& .MuiChip-icon': {
                    color: isActive ? colors.secondary.main : colors.primary.dark
                  }
                }}
              />
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Información detallada */}
        <Grid container spacing={2}>
          {/* Email */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <EmailIcon sx={{ color: colors.primary.main }} />
              <Box>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  Correo electrónico
                </Typography>
                <Typography variant="body2" sx={{ color: colors.primary.dark, fontWeight: 500 }}>
                  {user.email || 'No registrado'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Región */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <LocationIcon sx={{ color: colors.primary.main }} />
              <Box>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  Región
                </Typography>
                <Typography variant="body2" sx={{ color: colors.primary.dark, fontWeight: 500 }}>
                  {user.regionNombre || 'No asignada'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Instancia */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <SecurityIcon sx={{ color: colors.primary.main }} />
              <Box>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  Instancia
                </Typography>
                <Typography variant="body2" sx={{ color: colors.primary.dark, fontWeight: 500 }}>
                  {user.instanciaNombre || 'No asignada'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Rol específico (solo para comité) */}
          {user.rolEspecifico && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <BadgeIcon sx={{ color: colors.accents.purple }} />
                <Box>
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                    Cargo específico (Comité)
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.accents.purple, fontWeight: 500 }}>
                    {user.rolEspecifico}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {/* Último acceso */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <AccessTimeIcon sx={{ color: colors.text.secondary }} />
              <Box>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  Último acceso
                </Typography>
                <Typography variant="body2" sx={{ color: colors.primary.dark }}>
                  {formatFecha(user.ultimoAcceso)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* ID del usuario (info adicional) */}
          <Grid item xs={12}>
            <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', textAlign: 'right' }}>
              ID: {user.id}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: '#f8f9fa' }}>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: colors.primary.main,
            '&:hover': { bgcolor: colors.primary.dark }
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserViewModal;