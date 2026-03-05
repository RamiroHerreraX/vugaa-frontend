// src/pages/auth/Login.jsx
import React, { useState } from "react";
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
  CircularProgress,
  Divider,
  Snackbar,
} from "@mui/material";
import {
  Lock as LockIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

// Importar el logo
import vugaaLogo from "../../assets/Vugaa_logo.jpeg";

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
            default:
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
      agente: { email: "agente@caaarem.com", tenant: "caaarem", label: "Agente" }
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
            position: 'relative'
          }}
        >
          {/* Header con gradiente institucional, logo y título */}
          <Box sx={{ 
            bgcolor: '#133B6B', 
            p: { xs: 3, sm: 4 }, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #0D2A4D 0%, #133B6B 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: 280, sm: 320 },
            position: 'relative'
          }}>
            {/* Botón de regresar */}
            <Box
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                zIndex: 20
              }}
            >
              <Button
                component={Link}
                to="/inicio"
                startIcon={<ArrowBackIcon />}
                size="small"
                sx={{
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                  },
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 3,
                  px: { xs: 2, sm: 3 },
                  py: 0.75,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                Regresar
              </Button>
            </Box>

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
              variant="h4" 
              sx={{ 
                color: 'white', 
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
                borderTop: '2px solid rgba(255,255,255,0.3)',
                paddingTop: 2,
                width: '80%',
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}
            >
              INICIAR SESIÓN
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 3, sm: 4 } }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
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
                        <BusinessIcon sx={{ color: "#64748b" }} />
                      </InputAdornment>
                    }
                    sx={{
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#00C2D1",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#00C2D1",
                      },
                    }}
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
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "#64748b" }} />
                      </InputAdornment>
                    ),
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
                    textTransform: "none",
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    fontWeight: 500,
                  }}
                >
                  {loading ? "Iniciando sesión..." : "Ingresar al sistema"}
                </Button>
              </Stack>
            </Box>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Link
                to="/recuperar-password"
                style={{ textDecoration: "none", color: "#00C2D1", fontWeight: 500 }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" sx={{ color: "#94a3b8", px: 2 }}>
                Acceso rápido
              </Typography>
            </Divider>

            {/* Demo Login Buttons */}
            <Box>
              <Typography
                variant="subtitle2"
                align="center"
                sx={{ color: "#64748b", mb: 2 }}
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
                {[
                  { role: 'supera', label: 'Super' },
                  { role: 'admin', label: 'Admin' },
                  { role: 'comite', label: 'Comité' },
                  { role: 'asociacion', label: 'Asociación' },
                  { role: 'agente', label: 'Agente' }
                ].map((item) => (
                  <Button
                    key={item.role}
                    variant="outlined"
                    size="small"
                    onClick={() => handleDemoLogin(item.role)}
                    sx={{ 
                      textTransform: 'capitalize',
                      borderColor: '#133B6B',
                      color: '#133B6B',
                      fontSize: { xs: '0.7rem', sm: '0.8125rem' },
                      '&:hover': {
                        borderColor: '#00C2D1',
                        bgcolor: 'rgba(0,194,209,0.04)'
                      }
                    }}
                  >
                    {item.label}
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