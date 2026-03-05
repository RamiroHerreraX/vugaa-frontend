// src/pages/auth/RecuperarPassword.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Importar el logo
import vugaaLogo from "../../assets/Vugaa_logo.jpeg";

const RecuperarPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const { recuperarPassword } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    if (!email) {
      setEmailError('El email es obligatorio');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Formato de email inválido');
      return;
    }

    setLoading(true);

    try {
      const result = await recuperarPassword(email);
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.mensaje || 'Error al procesar la solicitud');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

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
          {/* Header con logo grande */}
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
              RECUPERACIÓN DE CONTRASEÑA
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 4, sm: 5 } }}>
            {success ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#133B6B', mb: 2 }}>
                  ¡Solicitud enviada!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, px: 2 }}>
                  Si el email existe en nuestro sistema, recibirás instrucciones para recuperar tu contraseña.
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
                  Volver al inicio de sesión
                </Button>
              </Box>
            ) : (
              <Box>
                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                <Typography variant="body1" sx={{ mb: 4, color: '#4a5568', textAlign: 'center', fontSize: '1.1rem' }}>
                  Ingresa tu correo electrónico y recibirás instrucciones para restablecer tu contraseña.
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Correo electrónico *"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!emailError}
                    helperText={emailError}
                    variant="outlined"
                    sx={{
                      mb: 4,
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "#64748b" }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    fullWidth
                    sx={{
                      py: 1.8,
                      bgcolor: "#133B6B",
                      "&:hover": { bgcolor: "#0D2A4D" },
                      textTransform: "none",
                      fontSize: "1.1rem",
                      fontWeight: 500,
                      borderRadius: 2,
                      mb: 2
                    }}
                  >
                    {loading ? <CircularProgress size={26} color="inherit" /> : 'Enviar instrucciones'}
                  </Button>

                  <Button
                    variant="text"
                    onClick={() => navigate('/login')}
                    fullWidth
                    sx={{
                      textTransform: "none",
                      color: "#00C2D1",
                      fontSize: "1rem",
                      fontWeight: 500,
                      py: 1,
                      "&:hover": {
                        backgroundColor: "rgba(0,194,209,0.04)",
                      },
                    }}
                  >
                    Volver al inicio de sesión
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RecuperarPassword;