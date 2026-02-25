// src/pages/auth/RestablecerPassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const RestablecerPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [tokenValido, setTokenValido] = useState(true);

  const { restablecerPassword } = useAuth();
  const navigate = useNavigate();

  // Validar que exista el token
  useEffect(() => {
    if (!token) {
      setTokenValido(false);
      setError('Token de recuperación no proporcionado');
    }
  }, [token]);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordError('');
    setConfirmError('');

    // Validaciones
    let isValid = true;
    
    const passwordValidation = validatePassword(nuevaPassword);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      isValid = false;
    }

    if (nuevaPassword !== confirmarPassword) {
      setConfirmError('Las contraseñas no coinciden');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);

    try {
      const result = await restablecerPassword(token, nuevaPassword, confirmarPassword);
      
      if (result.success) {
        setSuccess(true);
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.mensaje || 'Error al restablecer la contraseña');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValido) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}>
        <Container maxWidth="sm">
          <Paper elevation={6} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Box sx={{ 
              bgcolor: '#133B6B', 
              p: 3, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #133B6B 0%, #1E4A7A 100%)'
            }}>
              <Avatar sx={{ 
                width: 60, 
                height: 60, 
                mx: 'auto', 
                mb: 2,
                bgcolor: '#f44336'
              }}>
                <LockIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                Token Inválido
              </Typography>
            </Box>
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              <Button
                variant="contained"
                onClick={() => navigate('/recuperar-password')}
                startIcon={<ArrowBackIcon />}
              >
                Solicitar nuevo token
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: '#133B6B', 
            p: 3, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #133B6B 0%, #1E4A7A 100%)'
          }}>
            <Avatar sx={{ 
              width: 60, 
              height: 60, 
              mx: 'auto', 
              mb: 2,
              bgcolor: '#00C2D1'
            }}>
              <LockIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
              Restablecer Contraseña
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            {success ? (
              <Box sx={{ textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  ¡Contraseña actualizada!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Tu contraseña ha sido restablecida exitosamente. Serás redirigido al login en unos segundos.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                  startIcon={<ArrowBackIcon />}
                >
                  Ir al login ahora
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres.
                </Typography>

                <Stack spacing={3}>
                  {/* Nueva contraseña */}
                  <TextField
                    fullWidth
                    label="Nueva contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)}
                    error={!!passwordError}
                    helperText={passwordError}
                    required
                    InputProps={{
                      startAdornment: <LockIcon sx={{ mr: 1, color: "#7f8c8d" }} />,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />

                  {/* Confirmar contraseña */}
                  <TextField
                    fullWidth
                    label="Confirmar contraseña"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    error={!!confirmError}
                    helperText={confirmError}
                    required
                    InputProps={{
                      startAdornment: <LockIcon sx={{ mr: 1, color: "#7f8c8d" }} />,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/login')}
                      startIcon={<ArrowBackIcon />}
                      fullWidth
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                      fullWidth
                      sx={{
                        bgcolor: "#133B6B",
                        "&:hover": { bgcolor: "#0D2A4D" },
                      }}
                    >
                      {loading ? 'Guardando...' : 'Guardar contraseña'}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RestablecerPassword;