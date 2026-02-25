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
  AccountBalance as BalanceIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

// Colores institucionales
const institutionalColors = {
  primary: '#133B6B',      // Azul oscuro principal
  secondary: '#1a4c7a',    // Azul medio
  accent: '#e9e9e9',       // Color para acentos (gris claro)
  background: '#f4f6f8',   // Fondo claro
  lightBlue: 'rgba(19, 59, 107, 0.08)',  // Azul transparente para hover
  darkBlue: '#0D2A4D',     // Azul más oscuro
  textPrimary: '#111827',  // Texto principal
  textSecondary: '#6b7280', // Texto secundario
  success: '#059669',      // Verde para éxito
  warning: '#d97706',      // Naranja para advertencias
  error: '#dc2626',        // Rojo para errores
  info: '#1976d2',         // Azul para información
};

const AssociationProfile = () => {
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: "Asociación Aduanal del Norte, S.A. de C.V.",
    rfc: "AAN240101XYZ",
    regimenFiscal: "Personas Morales con Fines No Lucrativos",
    fechaConstitucion: "15/01/2020",
    representanteLegal: "Luis Rodríguez Martínez",
    telefono: "+52 55 1234 5678",
    email: "contacto@asociacionnorte.com",
    paginaWeb: "www.asociacionnorte.com",
    numeroCertificacionSAT: "SAT-2020-001234",
    vigenciaCertificacionSAT: "15/01/2026",
    domicilioFiscalLinea1: "Av. Industrial 1234, Parque Industrial del Norte",
    domicilioFiscalLinea2: "Monterrey, Nuevo León, CP 66470",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setEditMode(false);
    // Aquí puedes agregar la lógica para guardar los datos en tu backend
    console.log("Datos guardados:", formData);
  };

  const cardStyle = {
    height: "100%",
    borderRadius: 3,
    bgcolor: "#f9fafb",
    border: `1px solid #e5e7eb`,
  };

  const renderTextField = (name, label, value, multiline = false, rows = 1) => (
    editMode ? (
      <TextField
        fullWidth
        size="small"
        name={name}
        label={label}
        value={value}
        onChange={handleChange}
        variant="outlined"
        multiline={multiline}
        rows={rows}
        sx={{ mt: 0.5 }}
      />
    ) : (
      <Typography sx={{ color: institutionalColors.textPrimary }}>{value || "No especificado"}</Typography>
    )
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: institutionalColors.background }}>
      {/* HEADER */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderBottom: `1px solid #e5e7eb`,
          bgcolor: "#fff",
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <BusinessIcon sx={{ fontSize: 32, color: institutionalColors.primary }} />

            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ color: institutionalColors.textPrimary }}>
                Perfil de la Asociación
              </Typography>

              <Typography variant="body2" sx={{ color: institutionalColors.textSecondary }}>
                Datos fiscales y legales
              </Typography>
            </Box>
          </Box>

          <Button
            startIcon={editMode ? <SaveIcon /> : <EditIcon />}
            variant="contained"
            color={editMode ? "success" : "primary"}
            onClick={editMode ? handleSave : () => setEditMode(true)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              bgcolor: editMode ? institutionalColors.success : institutionalColors.primary,
              '&:hover': {
                bgcolor: editMode ? institutionalColors.success : institutionalColors.secondary,
              }
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
            {/* CABECERA SUPERIOR */}
            <Grid container spacing={3} alignItems="center">
              {/* Avatar */}
              <Grid item xs={12} md="auto">
                <Avatar
                  sx={{
                    width: 90,
                    height: 90,
                    bgcolor: institutionalColors.primary,
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 50 }} />
                </Avatar>
              </Grid>

              {/* Info principal */}
              <Grid item xs>
                {editMode ? (
                  <TextField
                    fullWidth
                    name="nombre"
                    label="Nombre de la Asociación"
                    value={formData.nombre}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                ) : (
                  <Typography variant="h5" fontWeight="bold" sx={{ color: institutionalColors.textPrimary }} gutterBottom>
                    {formData.nombre}
                  </Typography>
                )}

                <Stack direction="row" spacing={1} mb={2}>
                  <Chip
                    label={`RFC: ${formData.rfc}`}
                    variant="outlined"
                    sx={{ 
                      borderColor: institutionalColors.primary,
                      color: institutionalColors.primary,
                    }}
                  />

                  <Chip
                    label="Certificada SAT"
                    sx={{ 
                      bgcolor: '#d1fae5',
                      color: institutionalColors.success,
                    }}
                    icon={<BadgeIcon />}
                  />
                </Stack>

                <Stack direction="row" spacing={3} flexWrap="wrap">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                    <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                      <b>Representante:</b> {formData.representanteLegal}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                    <Typography variant="body2" sx={{ color: institutionalColors.textPrimary }}>
                      <b>Constitución:</b> {formData.fechaConstitucion}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4, borderColor: '#e5e7eb' }} />

            {/* GRID PRINCIPAL */}
            <Grid container spacing={3} columns={12} wrap="nowrap">
              {/* Fiscal */}
              <Grid item xs={3}>
                <Card sx={cardStyle}>
                  <CardContent>
                    <Stack direction="row" spacing={1} mb={2}>
                      <BalanceIcon sx={{ color: institutionalColors.primary }} />
                      <Typography fontWeight="bold" sx={{ color: institutionalColors.textPrimary }}>
                        Información Fiscal
                      </Typography>
                    </Stack>

                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                          RFC
                        </Typography>
                        {renderTextField("rfc", "RFC", formData.rfc)}
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                          Régimen
                        </Typography>
                        {renderTextField("regimenFiscal", "Régimen Fiscal", formData.regimenFiscal)}
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                          Certificación SAT
                        </Typography>
                        {renderTextField("numeroCertificacionSAT", "Número de Certificación", formData.numeroCertificacionSAT)}
                        
                        <Box sx={{ mt: 1 }}>
                          {renderTextField("vigenciaCertificacionSAT", "Vigencia", formData.vigenciaCertificacionSAT)}
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Representante */}
              <Grid item xs={3}>
                <Card sx={cardStyle}>
                  <CardContent>
                    <Stack direction="row" spacing={1} mb={2}>
                      <PersonIcon sx={{ color: institutionalColors.primary }} />
                      <Typography fontWeight="bold" sx={{ color: institutionalColors.textPrimary }}>
                        Representante Legal
                      </Typography>
                    </Stack>

                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>Nombre</Typography>
                        {renderTextField("representanteLegal", "Representante Legal", formData.representanteLegal)}
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                          Fecha designación
                        </Typography>
                        {renderTextField("fechaConstitucion", "Fecha de Constitución", formData.fechaConstitucion)}
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>Vigencia</Typography>
                        {renderTextField("vigenciaCertificacionSAT", "Vigencia", formData.vigenciaCertificacionSAT)}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Domicilio */}
              <Grid item xs={3}>
                <Card sx={cardStyle}>
                  <CardContent>
                    <Stack direction="row" spacing={1} mb={2}>
                      <LocationIcon sx={{ color: institutionalColors.primary }} />
                      <Typography fontWeight="bold" sx={{ color: institutionalColors.textPrimary }}>
                        Domicilio Fiscal
                      </Typography>
                    </Stack>
                    
                    <Box mb={1}>
                      {renderTextField("domicilioFiscalLinea1", "Línea 1", formData.domicilioFiscalLinea1)}
                    </Box>
                    
                    <Box>
                      {renderTextField("domicilioFiscalLinea2", "Línea 2", formData.domicilioFiscalLinea2)}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Contacto */}
              <Grid item xs={3}>
                <Card sx={cardStyle}>
                  <CardContent>
                    <Stack direction="row" spacing={1} mb={2}>
                      <PhoneIcon sx={{ color: institutionalColors.primary }} />
                      <Typography fontWeight="bold" sx={{ color: institutionalColors.textPrimary }}>Contacto</Typography>
                    </Stack>

                    <Stack spacing={2}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                        {editMode ? (
                          <TextField
                            fullWidth
                            size="small"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                          />
                        ) : (
                          <Typography sx={{ color: institutionalColors.textPrimary }}>{formData.telefono}</Typography>
                        )}
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <EmailIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                        {editMode ? (
                          <TextField
                            fullWidth
                            size="small"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        ) : (
                          <Typography sx={{ color: institutionalColors.textPrimary }}>{formData.email}</Typography>
                        )}
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <LanguageIcon fontSize="small" sx={{ color: institutionalColors.textSecondary }} />
                        {editMode ? (
                          <TextField
                            fullWidth
                            size="small"
                            name="paginaWeb"
                            value={formData.paginaWeb}
                            onChange={handleChange}
                          />
                        ) : (
                          <Typography sx={{ color: institutionalColors.textPrimary }}>{formData.paginaWeb}</Typography>
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* CERTIFICACION */}
            <Card
              sx={{
                mt: 3,
                borderRadius: 3,
                bgcolor: institutionalColors.lightBlue,
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>Certificación SAT</Typography>
                  <Typography fontWeight="bold" sx={{ color: institutionalColors.primary }}>
                    {formData.numeroCertificacionSAT}
                  </Typography>
                </Box>

                <Chip
                  sx={{ 
                    bgcolor: '#d1fae5',
                    color: institutionalColors.success,
                  }}
                  label={`Vigente hasta ${formData.vigenciaCertificacionSAT}`}
                />
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AssociationProfile;