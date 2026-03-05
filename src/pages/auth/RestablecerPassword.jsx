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
} from '@mui/material';
import {
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Importar el logo
import vugaaLogo from "../../assets/Vugaa_logo.jpeg";

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
        background: "linear-gradient(135deg, #ffffff 0%, #133B6B 50%, #1E4A7A 100%)",
        py: { xs: 2, sm: 4 }
      }}>
        <Container maxWidth="sm" sx={{ my: { xs: 2, sm: 4 } }}>
          <Paper 
            elevation={6} 
            sx={{ 
              borderRadius: 4,
              overflow: 'hidden',
              backdropFilter: "blur(10px)",
              bgcolor: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <Box sx={{ 
              bgcolor: '#133B6B', 
              p: { xs: 4, sm: 5 }, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #0D2A4D 0%, #133B6B 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: 240, sm: 280 }
            }}>
              <Box
                component="img"
                src={vugaaLogo}
                alt="VUGAA Logo"
                sx={{
                  width: { xs: '60%', sm: '55%' },
                  maxWidth: 240,
                  height: 'auto',
                  mx: 'auto',
                  mb: 2,
                  borderRadius: 4,
                  boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
                }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 500,
                  letterSpacing: 1,
                  borderTop: '2px solid rgba(255,255,255,0.3)',
                  paddingTop: 2,
                  width: '80%'
                }}
              >
                TOKEN INVÁLIDO
              </Typography>
            </Box>
            <Box sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
              <Button
                variant="contained"
                onClick={() => navigate('/recuperar-password')}
                startIcon={<ArrowBackIcon />}
                sx={{
                  py: 1.2,
                  px: 3,
                  bgcolor: "#133B6B",
                  "&:hover": { bgcolor: "#0D2A4D" },
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  borderRadius: 2,
                }}
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
      background: "linear-gradient(135deg, #ffffff 0%, #133B6B 50%, #1E4A7A 100%)",
      py: { xs: 2, sm: 4 }
    }}>
      <Container maxWidth="sm" sx={{ my: { xs: 2, sm: 4 } }}>
        <Paper 
          elevation={6} 
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            backdropFilter: "blur(10px)",
            bgcolor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          {/* Header con logo y título */}
          <Box sx={{ 
            bgcolor: '#133B6B', 
            p: { xs: 4, sm: 5 }, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #0D2A4D 0%, #133B6B 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: 280, sm: 320 }
          }}>
            <Box
              component="img"
              src={vugaaLogo}
              alt="VUGAA Logo"
              sx={{
                width: { xs: '70%', sm: '65%' },
                maxWidth: 320,
                height: 'auto',
                mx: 'auto',
                mb: 2,
                borderRadius: 4,
                boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
              }}
            />
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'white', 
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: 'uppercase',
                borderTop: '2px solid rgba(255,255,255,0.3)',
                paddingTop: 2,
                width: '80%'
              }}
            >
              RESTABLECER CONTRASEÑA
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 3, sm: 4 } }}>
            {success ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#133B6B', mb: 2 }}>
                  ¡Contraseña actualizada!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, px: 2 }}>
                  Tu contraseña ha sido restablecida exitosamente. Serás redirigido al login en unos segundos.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{
                    py: 1.2,
                    px: 4,
                    bgcolor: "#133B6B",
                    "&:hover": { bgcolor: "#0D2A4D" },
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 500,
                    borderRadius: 2,
                  }}
                >
                  Ir al login ahora
                </Button>
              </Box>
            ) : (
              <Box>
                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                <Typography variant="body1" sx={{ mb: 4, color: '#4a5568', textAlign: 'center', fontSize: '1rem' }}>
                  Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres.
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
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
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "#00C2D1",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#00C2D1",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#00C2D1",
                        },
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
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "#00C2D1",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#00C2D1",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#00C2D1",
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      fullWidth
                      sx={{
                        py: 1.5,
                        bgcolor: "#133B6B",
                        "&:hover": { bgcolor: "#0D2A4D" },
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: 500,
                        borderRadius: 2,
                        mt: 2
                      }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar contraseña'}
                    </Button>

                    <Button
                      variant="text"
                      onClick={() => navigate('/login')}
                      fullWidth
                      sx={{
                        textTransform: "none",
                        color: "#00C2D1",
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        py: 1,
                        "&:hover": {
                          backgroundColor: "rgba(0,194,209,0.04)",
                        },
                      }}
                    >
                      Volver al inicio de sesión
                    </Button>
                  </Stack>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RestablecerPassword;