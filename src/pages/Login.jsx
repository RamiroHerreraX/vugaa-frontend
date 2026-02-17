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
} from "@mui/material";
import { Lock as LockIcon, Email as EmailIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
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
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demos = {
      agente: "agente@vugaa.com",
      comite: "comite@vugaa.com",
      admin: "admin@vugaa.com",
      asociacion: "asociacion@vugaa.com",
      supera: "supera@vugaa.com"
    };
    setEmail(demos[role]);
    setPassword("123456");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h2"
          sx={{ color: "#2c3e50", fontWeight: "bold", mb: 1 }}
        >
          VUGAA
        </Typography>
        <Typography variant="h6" sx={{ color: "#7f8c8d" }}>
          Sistema de Gestión de Cumplimiento
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ color: "#2c3e50", mb: 3 }}
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
              sx={{ py: 1.5 }}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </Stack>
        </Box>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Link
            to="/forgot-password"
            style={{ textDecoration: "none", color: "#3498db" }}
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
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleDemoLogin("agente")}
              size="small"
            >
              Agente
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleDemoLogin("comite")}
              size="small"
            >
              Comité
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => handleDemoLogin("admin")}
              size="small"
            >
              Admin
            </Button>
            <Button
              variant="outlined"
              color="info"
              onClick={() => handleDemoLogin("asociacion")}
              size="small"
            >
              Asociación
            </Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={() => handleDemoLogin("supera")}
              size="small"
            >
              Supera
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;