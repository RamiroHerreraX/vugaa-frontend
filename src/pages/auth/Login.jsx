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
} from "@mui/material";
import {
  Lock as LockIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenant, setTenant] = useState("caaarem"); // Valor por defecto
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Opciones de instancias para demostración
  const tenantOptions = [
    { value: "caaarem", label: "CAAAREM (Principal)" },
    { value: "test", label: "Instancia de Pruebas" },
    { value: "ingenieria", label: "Facultad de Ingeniería" },
    { value: "medicina", label: "Facultad de Medicina" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password, tenant);
      
      if (result.success) {
        const role = result.user.rol;
        // Redireccionar según el rol
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
      supera: { email: "superadmin@vugaa.com", tenant: "caaarem" },
      admin: { email: "admin@caaarem.com", tenant: "caaarem" },
      comite: { email: "comite@caaarem.com", tenant: "caaarem" },
      asociacion: { email: "asociacion@caaarem.com", tenant: "caaarem" },
      agente: { email: "agente@caaarem.com", tenant: "caaarem" },
      profesionista: { email: "profesionista@caaarem.com", tenant: "caaarem" },
      empresario: { email: "empresario@caaarem.com", tenant: "caaarem" }
    };
    
    if (demos[role]) {
      setEmail(demos[role].email);
      setTenant(demos[role].tenant);
      setPassword("123456");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h2"
          sx={{ color: "#133B6B", fontWeight: "bold", mb: 1 }}
        >
          VUGAA
        </Typography>
        <Typography variant="h6" sx={{ color: "#7f8c8d" }}>
          Ventanilla Única de Gestión de Agentes Aduanales
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ color: "#133B6B", mb: 3, fontWeight: 600 }}
        >
          Iniciar Sesión
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Campo de Instancia/Tenant */}
            <FormControl fullWidth required>
              <InputLabel id="tenant-label">Instancia</InputLabel>
              <Select
                labelId="tenant-label"
                value={tenant}
                label="Instancia"
                onChange={(e) => setTenant(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <BusinessIcon sx={{ color: "#7f8c8d", ml: 1 }} />
                  </InputAdornment>
                }
              >
                {tenantOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: "#7f8c8d" }} />,
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: "#7f8c8d" }} />,
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
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

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Link
            to="/forgot-password"
            style={{ textDecoration: "none", color: "#00C2D1" }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </Box>

        {/* Demo Login Buttons */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="subtitle2"
            align="center"
            sx={{ color: "#7f8c8d", mb: 2 }}
          >
            Acceso rápido para demostración:
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
          >
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleDemoLogin("supera")}
              sx={{ color: "#133B6B", borderColor: "#133B6B" }}
            >
              Super Admin
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleDemoLogin("admin")}
              sx={{ color: "#2C3E50", borderColor: "#2C3E50" }}
            >
              Admin
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleDemoLogin("comite")}
              sx={{ color: "#8E44AD", borderColor: "#8E44AD" }}
            >
              Comité
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleDemoLogin("asociacion")}
              sx={{ color: "#16A085", borderColor: "#16A085" }}
            >
              Asociación
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleDemoLogin("agente")}
              sx={{ color: "#2874A6", borderColor: "#2874A6" }}
            >
              Agente
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;