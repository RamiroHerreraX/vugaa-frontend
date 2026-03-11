import React from 'react'; 
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Avatar,
  Stack,
  Alert
} from '@mui/material';
import {
  Warning as WarningIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  AdminPanelSettings as AdminIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const colors = {
  primary: '#133B6B',
  secondary: '#1a4c7a',
  warning: '#d97706',
  error: '#dc2626',
  textSecondary: '#6b7280',
};

// Mapeo de rutas por rol
const RUTAS_PERFIL = {
  supera: '/supera/profileI',
  admin: '/admin/profile',
  comite: '/committee/profile',
  asociacion: '/association/profileI',
  agente: '/dashboard/completar-perfil',
  profesionista: '/dashboard/completar-perfil',
  empresario: '/dashboard/completar-perfil'
};

// Iconos por rol
const ICONOS_ROL = {
  supera: <AdminIcon sx={{ fontSize: 48 }} />,
  admin: <AdminIcon sx={{ fontSize: 48 }} />,
  comite: <GroupIcon sx={{ fontSize: 48 }} />,
  asociacion: <BusinessIcon sx={{ fontSize: 48 }} />,
  agente: <PersonIcon sx={{ fontSize: 48 }} />,
  profesionista: <PersonIcon sx={{ fontSize: 48 }} />,
  empresario: <BusinessIcon sx={{ fontSize: 48 }} />
};

// Nombres amigables por rol
const NOMBRES_ROL = {
  supera: 'Super Administrador',
  admin: 'Administrador',
  comite: 'Comité',
  asociacion: 'Asociación',
  agente: 'Agente Aduanal',
  profesionista: 'Profesionista',
  empresario: 'Empresario'
};

const PerfilIncompletoModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCompletarPerfil = () => {
    onClose();
    
    if (user?.rol) {
      const ruta = RUTAS_PERFIL[user.rol] || '/profile';
      navigate(ruta);
    } else {
      navigate('/profile');
    }
  };

  // Obtener el icono según el rol
  const getIcono = () => {
    if (user?.rol && ICONOS_ROL[user.rol]) {
      return ICONOS_ROL[user.rol];
    }
    return <WarningIcon sx={{ fontSize: 48 }} />;
  };

  // Obtener el nombre amigable del rol
  const getNombreRol = () => {
    if (user?.rol && NOMBRES_ROL[user.rol]) {
      return NOMBRES_ROL[user.rol];
    }
    return 'usuario';
  };

  // Mensaje personalizado según el rol
  const getMensajePersonalizado = () => {
    const rol = user?.rol;
    
    if (rol === 'supera' || rol === 'admin') {
      return "Como administrador, necesitas completar tu perfil para gestionar correctamente el sistema y tener acceso a todas las herramientas de administración.";
    } else if (rol === 'comite') {
      return "Como miembro del comité, es importante que completes tu perfil para participar en las evaluaciones y revisiones de los expedientes.";
    } else if (rol === 'asociacion') {
      return "Como asociación, completar tu perfil te permitirá gestionar mejor a tus agentes y acceder a todos los reportes y estadísticas.";
    } else if (rol === 'agente') {
      return "Como agente aduanal, necesitas completar tu perfil para poder gestionar tus expedientes y documentos correctamente.";
    } else {
      return "Para poder acceder a todas las funcionalidades del sistema, necesitas completar la información de tu perfil.";
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: colors.primary, 
        color: 'white',
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Perfil Incompleto
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Stack spacing={3} alignItems="center">
          {/* Icono según el rol */}
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: '#FEF3C7',
              color: colors.warning,
              mb: 1
            }}
          >
            {getIcono()}
          </Avatar>

          {/* Mensaje principal con el rol */}
          <Typography 
            variant="h5" 
            align="center" 
            sx={{ 
              fontWeight: 600, 
              color: colors.primary,
              mb: 1
            }}
          >
            ¡Hola {getNombreRol()}!
          </Typography>

          <Typography 
            variant="h6" 
            align="center" 
            sx={{ 
              fontWeight: 500, 
              color: colors.warning,
              mb: 1
            }}
          >
            Tu perfil está incompleto
          </Typography>

          <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
              color: colors.textSecondary,
              maxWidth: 400,
              mb: 2
            }}
          >
            {getMensajePersonalizado()}
          </Typography>

          {/* Alerta informativa */}
          <Alert 
            severity="info" 
            sx={{ 
              width: '100%',
              bgcolor: '#EFF6FF',
              '& .MuiAlert-icon': { color: colors.primary }
            }}
          >
            <Typography variant="body2">
              <strong>Campos pendientes por completar:</strong>
            </Typography>
            <Stack component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
              <li>Información personal</li>
              <li>Datos de contacto</li>
              {user?.rol === 'agente' && <li>Documentos de identificación</li>}
              {user?.rol === 'asociacion' && <li>Información de la asociación</li>}
              {user?.rol === 'comite' && <li>Datos del cargo</li>}
              <li>Configuración de cuenta</li>
            </Stack>
          </Alert>

          {/* Mostrar ruta de destino (solo para debug, opcional) */}
          {process.env.NODE_ENV === 'development' && user?.rol && (
            <Typography variant="caption" sx={{ color: colors.textSecondary, mt: 1 }}>
              Redirigiendo a: {RUTAS_PERFIL[user.rol] || '/profile'}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#F9FAFB', borderTop: '1px solid #E5E7EB' }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          startIcon={<CloseIcon />}
          sx={{ 
            borderColor: colors.textSecondary,
            color: colors.textSecondary,
            '&:hover': {
              borderColor: colors.primary,
              color: colors.primary
            }
          }}
        >
          Ahora no
        </Button>
        <Button
          onClick={handleCompletarPerfil}
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            bgcolor: colors.primary,
            '&:hover': { 
              bgcolor: colors.secondary,
              transform: 'translateX(2px)'
            },
            transition: 'all 0.2s'
          }}
        >
          Completar Perfil
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PerfilIncompletoModal;