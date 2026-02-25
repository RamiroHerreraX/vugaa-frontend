import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  Paper,
  TextField,
} from "@mui/material";

import {
  Edit as EditIcon,
  Save as SaveIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

// Colores institucionales oficiales
const institutionalColors = {
  primary: "#133B6B",
  secondary: "#3A6EA5",
  background: "#f4f6f8",
  textPrimary: "#111827",
  textSecondary: "#6b7280",
  success: "#059669",
};

const AssociationProfile = () => {
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "Carlos Alberto Hernández López",
    usuario: "superadmin",
    rol: "Super Administrador",
    email: "carlos.hernandez@sistema.com",
    telefono: "+52 55 9876 5432",
    fechaRegistro: "10/03/2023",
    ultimoAcceso: "23/02/2026 09:15 AM",
    estado: "Activo",
    departamento: "Administración General",
    numeroEmpleado: "SA-0001",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setEditMode(false);
    console.log("Datos guardados:", formData);
  };

  const cardStyle = {
    height: "100%",
    borderRadius: 3,
    bgcolor: "#ffffff",
    border: "1px solid #e5e7eb",
    transition: "0.2s",
    "&:hover": {
      borderColor: institutionalColors.secondary,
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    },
  };

  const renderTextField = (name, label, value) =>
    editMode ? (
      <TextField
        fullWidth
        size="small"
        name={name}
        label={label}
        value={value}
        onChange={handleChange}
      />
    ) : (
      <Typography sx={{ color: institutionalColors.textPrimary }}>
        {value}
      </Typography>
    );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: institutionalColors.background }}>
      {/* HEADER */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderBottom: "1px solid #e5e7eb",
          bgcolor: "#ffffff",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <BusinessIcon
              sx={{
                fontSize: 32,
                color: institutionalColors.primary,
              }}
            />

            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: institutionalColors.primary }}
              >
                Perfil del Super Administrador
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: institutionalColors.textSecondary }}
              >
                Información general del sistema
              </Typography>
            </Box>
          </Stack>

          <Button
            startIcon={editMode ? <SaveIcon /> : <EditIcon />}
            variant="contained"
            onClick={editMode ? handleSave : () => setEditMode(true)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              bgcolor: editMode
                ? institutionalColors.success
                : institutionalColors.primary,

              "&:hover": {
                bgcolor: editMode
                  ? institutionalColors.success
                  : institutionalColors.secondary,
              },
            }}
          >
            {editMode ? "Guardar Cambios" : "Editar Perfil"}
          </Button>
        </Box>
      </Paper>

      {/* CONTENIDO */}
      <Box sx={{ maxWidth: 1400, mx: "auto", p: 3 }}>
        <Card sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            {/* CABECERA */}
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: 90,
                    height: 90,
                    bgcolor: institutionalColors.primary,
                  }}
                >
                  <PersonIcon sx={{ fontSize: 50 }} />
                </Avatar>
              </Grid>

              <Grid item xs>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ color: institutionalColors.primary }}
                >
                  {formData.nombre}
                </Typography>

                <Stack direction="row" spacing={2} mt={1}>
                  <Chip
                    label={formData.rol}
                    sx={{
                      bgcolor: institutionalColors.primary,
                      color: "#fff",
                      fontWeight: 500,
                    }}
                  />

                  <Chip
                    label={formData.estado}
                    sx={{
                      bgcolor: institutionalColors.secondary,
                      color: "#fff",
                      fontWeight: 500,
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* GRID PRINCIPAL */}
            <Grid container spacing={3} columns={12} wrap="nowrap">
              {/* PERSONAL */}
              <Grid item xs={3}>
                <Card sx={cardStyle}>
                  <CardContent>
                    <Stack direction="row" spacing={1} mb={2}>
                      <PersonIcon sx={{ color: institutionalColors.primary }} />

                      <Typography
                        fontWeight="bold"
                        sx={{ color: institutionalColors.primary }}
                      >
                        Información Personal
                      </Typography>
                    </Stack>

                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Nombre
                        </Typography>
                        {renderTextField("nombre", "Nombre", formData.nombre)}
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Usuario
                        </Typography>
                        {renderTextField(
                          "usuario",
                          "Usuario",
                          formData.usuario,
                        )}
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Número de empleado
                        </Typography>
                        {renderTextField(
                          "numeroEmpleado",
                          "Número",
                          formData.numeroEmpleado,
                        )}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* SISTEMA */}
              <Grid item xs={3}>
                <Card sx={cardStyle}>
                  <CardContent>
                    <Stack direction="row" spacing={1} mb={2}>
                      <BadgeIcon sx={{ color: institutionalColors.primary }} />

                      <Typography
                        fontWeight="bold"
                        sx={{ color: institutionalColors.primary }}
                      >
                        Sistema
                      </Typography>
                    </Stack>

                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Rol
                        </Typography>
                        {renderTextField("rol", "Rol", formData.rol)}
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Departamento
                        </Typography>
                        {renderTextField(
                          "departamento",
                          "Departamento",
                          formData.departamento,
                        )}
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Estado
                        </Typography>
                        {renderTextField("estado", "Estado", formData.estado)}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* ACTIVIDAD */}
              <Grid item xs={3}>
                <Card sx={cardStyle}>
                  <CardContent>
                    <Stack direction="row" spacing={1} mb={2}>
                      <CalendarIcon
                        sx={{ color: institutionalColors.primary }}
                      />

                      <Typography
                        fontWeight="bold"
                        sx={{ color: institutionalColors.primary }}
                      >
                        Actividad
                      </Typography>
                    </Stack>

                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Fecha registro
                        </Typography>
                        {renderTextField(
                          "fechaRegistro",
                          "Fecha",
                          formData.fechaRegistro,
                        )}
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Último acceso
                        </Typography>
                        {renderTextField(
                          "ultimoAcceso",
                          "Último acceso",
                          formData.ultimoAcceso,
                        )}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* CONTACTO */}
              <Grid item xs={3}>
                <Card sx={cardStyle}>
                  <CardContent>
                    <Stack direction="row" spacing={1} mb={2}>
                      <PhoneIcon sx={{ color: institutionalColors.primary }} />

                      <Typography
                        fontWeight="bold"
                        sx={{ color: institutionalColors.primary }}
                      >
                        Contacto
                      </Typography>
                    </Stack>

                    <Stack spacing={2}>
                      <Stack direction="row" spacing={1}>
                        <PhoneIcon fontSize="small" />
                        {renderTextField(
                          "telefono",
                          "Teléfono",
                          formData.telefono,
                        )}
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <EmailIcon fontSize="small" />
                        {renderTextField("email", "Email", formData.email)}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AssociationProfile;
