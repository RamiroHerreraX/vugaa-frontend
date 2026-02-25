// src/pages/auth/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Input,
  FilledInput,
  OutlinedInput,
  FormHelperText,
  CircularProgress,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  Snackbar,
} from "@mui/material";
import {
  Lock as LockIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  Security as SecurityIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenant, setTenant] = useState("caaarem");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Opciones de instancias
  const tenantOptions = [
    { value: "caaarem", label: "CAAAREM (Principal)", color: "#133B6B" },
    { value: "test", label: "Instancia de Pruebas", color: "#00C2D1" },
    { value: "ingenieria", label: "Facultad de Ingeniería", color: "#0099FF" },
    { value: "medicina", label: "Facultad de Medicina", color: "#6C5CE7" },
  ];

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");

    // Validaciones
    let isValid = true;
    
    if (!email) {
      setEmailError("El email es obligatorio");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Formato de email inválido");
      isValid = false;
    }

    if (!password) {
      setPasswordError("La contraseña es obligatoria");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      isValid = false;
    }

    if (!tenant) {
      setError("Debes seleccionar una instancia");
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);

    try {
      const result = await login(email, password, tenant);
      
      if (result.success) {
        setOpenSnackbar(true);
        
        // Redireccionar según el rol después de un pequeño delay
        setTimeout(() => {
          const role = result.user.rol;
          switch (role) {
            case "supera":
              navigate("/supera/dashboard");
              break;
            case "comite":
              navigate("/committee/dashboard");
              break;
            case "admin":
              navigate("/admin/dashboard");
              break;
            case "asociacion":
              navigate("/association/dashboard");
              break;
            default: // agente, profesionista, empresario
              navigate("/dashboard");
          }
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demos = {
      supera: { email: "superadmin@vugaa.com", tenant: "caaarem", label: "Super Admin" },
      admin: { email: "admin@caaarem.com", tenant: "caaarem", label: "Admin" },
      comite: { email: "comite@caaarem.com", tenant: "caaarem", label: "Comité" },
      asociacion: { email: "asociacion@caaarem.com", tenant: "caaarem", label: "Asociación" },
      agente: { email: "agente@caaarem.com", tenant: "caaarem", label: "Agente" },
      profesionista: { email: "profesionista@caaarem.com", tenant: "caaarem", label: "Profesionista" },
      empresario: { email: "empresario@caaarem.com", tenant: "caaarem", label: "Empresario" }
    };
    
    if (demos[role]) {
      setEmail(demos[role].email);
      setTenant(demos[role].tenant);
      setPassword("123456");
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
        <Paper 
          elevation={6} 
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden'
          }}
        >
          {/* Header con gradiente */}
          <Box sx={{ 
            bgcolor: '#133B6B', 
            p: 3, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #133B6B 0%, #1E4A7A 100%)'
          }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              mx: 'auto', 
              mb: 2,
              bgcolor: '#00C2D1'
            }}>
              <SecurityIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
              VUGAA
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Ventanilla Única de Gestión de Agentes Aduanales
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Instancia */}
                <FormControl fullWidth required error={!!error && !tenant}>
                  <InputLabel id="tenant-label">Instancia</InputLabel>
                  <Select
                    labelId="tenant-label"
                    value={tenant}
                    label="Instancia"
                    onChange={(e) => setTenant(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <BusinessIcon sx={{ color: "#7f8c8d" }} />
                      </InputAdornment>
                    }
                  >
                    {tenantOptions.map((option) => (
                      <MenuItem 
                        key={option.value} 
                        value={option.value}
                        sx={{
                          '&:hover': {
                            bgcolor: `${option.color}10`
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            bgcolor: option.color 
                          }} />
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Email */}
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  required
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: "#7f8c8d" }} />,
                  }}
                />

                {/* Password */}
                <TextField
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                  sx={{
                    py: 1.5,
                    bgcolor: "#133B6B",
                    "&:hover": { bgcolor: "#0D2A4D" },
                  }}
                >
                  {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>
              </Stack>
            </Box>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Link
                to="/recuperar-password"
                style={{ textDecoration: "none", color: "#00C2D1" }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>

            <Divider sx={{ my: 3 }}>Acceso rápido</Divider>

            {/* Demo Login Buttons */}
            <Box>
              <Typography
                variant="subtitle2"
                align="center"
                sx={{ color: "#7f8c8d", mb: 2 }}
              >
                Cuentas de demostración:
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                flexWrap="wrap"
                useFlexGap
                sx={{ gap: 1 }}
              >
                {['supera', 'admin', 'comite', 'asociacion', 'agente'].map((role) => (
                  <Button
                    key={role}
                    variant="outlined"
                    size="small"
                    onClick={() => handleDemoLogin(role)}
                    sx={{ 
                      textTransform: 'capitalize',
                      borderColor: '#133B6B',
                      color: '#133B6B',
                      '&:hover': {
                        borderColor: '#00C2D1',
                        bgcolor: 'rgba(0,194,209,0.04)'
                      }
                    }}
                  >
                    {role}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Box>
        </Paper>

        {/* Snackbar de éxito */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            ¡Login exitoso! Redirigiendo...
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Login;