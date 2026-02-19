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
  Stack,
  InputAdornment,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

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
              <EmailIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
              Recuperar Contraseña
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            {success ? (
              <Box sx={{ textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  ¡Solicitud enviada!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Si el email existe en nuestro sistema, recibirás instrucciones para recuperar tu contraseña.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                  startIcon={<ArrowBackIcon />}
                >
                  Volver al login
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
                  Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
                </Typography>

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: "#7f8c8d" }} />,
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
                    startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                    fullWidth
                    sx={{
                      bgcolor: "#133B6B",
                      "&:hover": { bgcolor: "#0D2A4D" },
                    }}
                  >
                    {loading ? 'Enviando...' : 'Enviar'}
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RecuperarPassword;