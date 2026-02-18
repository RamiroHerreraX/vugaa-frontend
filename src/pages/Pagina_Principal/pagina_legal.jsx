import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  alpha,
  Tabs,
  Tab,
  Divider,
  Grid,
  Switch,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SecurityIcon from '@mui/icons-material/Security';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import CookieIcon from '@mui/icons-material/Cookie';

// Paleta de colores - consistente con el sistema
const colors = {
  primary: {
    main: '#133B6B',
    light: '#E8F0FE',
    medium: '#2A5A8C',
    dark: '#0D2A4D',
    gradient: 'linear-gradient(135deg, #133B6B 0%, #1E4A7A 100%)',
  },
  secondary: {
    main: '#00C2D1',
    light: '#E0F7FA',
    medium: '#35D0FF',
    dark: '#0099AA',
  },
  background: {
    default: '#F8FAFE',
    paper: '#FFFFFF',
    dark: '#132E4F',
  },
  text: {
    primary: '#1E293B',
    secondary: '#475569',
    tertiary: '#64748B',
    light: '#F8FAFC',
  },
  border: {
    light: '#E2E8F0',
    main: '#CBD5E1',
  },
  white: '#FFFFFF',
  status: {
    success: '#00C2D1',
  },
};

// Componente de pestañas
const TabPanel = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`legal-tabpanel-${index}`}
      aria-labelledby={`legal-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ py: 4 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const PaginaLegalCompleta = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  
  // Estado para preferencias de cookies
  const [cookiePreferences, setCookiePreferences] = useState({
    necesarias: true,
    rendimiento: false,
    funcionalidad: false,
    publicidad: false,
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCookieChange = (tipo) => {
    if (tipo !== 'necesarias') {
      setCookiePreferences({
        ...cookiePreferences,
        [tipo]: !cookiePreferences[tipo],
      });
    }
  };

  return (
    <Box sx={{ 
      bgcolor: colors.background.default, 
      minHeight: '100vh',
      width: '100%',
    }}>
      {/* Barra de navegación superior */}
      <Box
        sx={{
          bgcolor: colors.white,
          borderBottom: `1px solid ${colors.border.light}`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="span"
              onClick={() => navigate(-1)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: colors.primary.main,
                cursor: 'pointer',
                fontWeight: 500,
                '&:hover': {
                  color: colors.secondary.main,
                },
              }}
            >
              <ArrowBackIcon fontSize="small" />
              <Typography variant="body2">Volver</Typography>
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                flexGrow: 1, 
                textAlign: 'center',
                fontWeight: 700,
                color: colors.primary.main,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
              }}
            >
              Información Legal
            </Typography>
            <Box sx={{ width: 80 }} />
          </Box>
        </Container>
      </Box>

      {/* Contenido principal */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Paper
          elevation={0}
          sx={{
            bgcolor: colors.white,
            border: `1px solid ${colors.border.light}`,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {/* Pestañas de navegación */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: `1px solid ${colors.border.light}`,
              '& .MuiTab-root': {
                py: 3,
                fontWeight: 600,
                color: colors.text.secondary,
                '&.Mui-selected': {
                  color: colors.primary.main,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: colors.secondary.main,
                height: 3,
              },
            }}
          >
            <Tab 
              icon={<SecurityIcon />} 
              label="TÉRMINOS Y CONDICIONES" 
              iconPosition="start"
              sx={{ fontSize: { xs: '0.7rem', md: '0.9rem' } }}
            />
            <Tab 
              icon={<PrivacyTipIcon />} 
              label="AVISO DE PRIVACIDAD" 
              iconPosition="start"
              sx={{ fontSize: { xs: '0.7rem', md: '0.9rem' } }}
            />
            <Tab 
              icon={<CookieIcon />} 
              label="POLÍTICA DE COOKIES" 
              iconPosition="start"
              sx={{ fontSize: { xs: '0.7rem', md: '0.9rem' } }}
            />
          </Tabs>

          {/* Contenido de Términos y Condiciones */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: { xs: 3, md: 5 } }}>
              <Typography
                variant="body2"
                sx={{
                  color: colors.text.tertiary,
                  mb: 4,
                  pb: 2,
                  borderBottom: `1px solid ${colors.border.light}`,
                  fontStyle: 'italic',
                }}
              >
                Última actualización: 18 de febrero de 2026
              </Typography>

              <Box sx={{ '& > *': { mb: 3 } }}>
                {/* 1. Aceptación */}
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary.main, mb: 2, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                    1. Aceptación de los Términos
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.text.secondary, lineHeight: 1.8 }}>
                    Al acceder y utilizar la plataforma VUGAA (Ventanilla Única de Gestión de Agentes Aduanales), usted acepta cumplir con estos Términos y Condiciones, todas las leyes y regulaciones aplicables, y reconoce que es responsable del cumplimiento de cualquier ley local aplicable. Si no está de acuerdo con alguno de estos términos, no está autorizado para usar ni acceder a este sitio.
                  </Typography>
                </Box>

                <Divider sx={{ my: 4, borderColor: alpha(colors.primary.main, 0.1) }} />

                {/* 2. Descripción del servicio */}
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary.main, mb: 2, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                    2. Descripción del Servicio
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.text.secondary, lineHeight: 1.8, mb: 2 }}>
                    VUGAA proporciona una plataforma tecnológica integral que permite a los agentes aduanales gestionar sus operaciones, certificaciones, cumplimiento normativo y trámites relacionados con el comercio exterior mexicano.
                  </Typography>
                </Box>

                <Divider sx={{ my: 4, borderColor: alpha(colors.primary.main, 0.1) }} />

                {/* 3. Registro y seguridad */}
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary.main, mb: 2, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                    3. Registro y Seguridad de Cuenta
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.text.secondary, lineHeight: 1.8 }}>
                    Para utilizar ciertos servicios de VUGAA, deberá registrarse y crear una cuenta. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña. Acepta asumir la responsabilidad por todas las actividades que ocurran bajo su cuenta.
                  </Typography>
                </Box>

                <Divider sx={{ my: 4, borderColor: alpha(colors.primary.main, 0.1) }} />

                {/* 4. Propiedad intelectual */}
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary.main, mb: 2, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                    4. Propiedad Intelectual
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.text.secondary, lineHeight: 1.8 }}>
                    El contenido, organización, gráficos, diseño, y todos los demás asuntos relacionados con el sitio VUGAA son propiedad exclusiva de VUGAA o sus licenciantes. Queda estrictamente prohibida la reproducción, distribución o modificación sin autorización.
                  </Typography>
                </Box>

                <Divider sx={{ my: 4, borderColor: alpha(colors.primary.main, 0.1) }} />

                {/* 5. Limitación de responsabilidad */}
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary.main, mb: 2, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                    5. Limitación de Responsabilidad
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.text.secondary, lineHeight: 1.8 }}>
                    VUGAA no será responsable por daños directos, indirectos, incidentales, consecuentes o punitivos que surjan del uso o la imposibilidad de usar nuestros servicios.
                  </Typography>
                </Box>

                <Divider sx={{ my: 4, borderColor: alpha(colors.primary.main, 0.1) }} />

                {/* Contacto */}
                <Box sx={{ p: 3, bgcolor: colors.primary.light, borderRadius: 2, border: `1px solid ${alpha(colors.primary.main, 0.2)}` }}>
                  <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: 600, mb: 1 }}>
                    ¿Tienes preguntas?
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Contáctanos en: <Box component="span" sx={{ color: colors.secondary.main, fontWeight: 600 }}>legal@vugaa.mx</Box>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </TabPanel>

          {/* Contenido de Aviso de Privacidad */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ px: { xs: 3, md: 5 } }}>
              <Typography
                variant="body2"
                sx={{
                  color: colors.text.tertiary,
                  mb: 4,
                  pb: 2,
                  borderBottom: `1px solid ${colors.border.light}`,
                  fontStyle: 'italic',
                }}
              >
                Última actualización: 18 de febrero de 2026
              </Typography>

              <Box sx={{ '& > *': { mb: 3 } }}>
                {/* Introducción */}
                <Typography variant="body1" sx={{ color: colors.text.secondary, lineHeight: 1.8, mb: 3, fontWeight: 500 }}>
                  En VUGAA, nos comprometemos a proteger tu privacidad y tus datos personales. Este Aviso de Privacidad describe cómo recopilamos, usamos y protegemos tu información.
                </Typography>

                <Divider sx={{ my: 4, borderColor: alpha(colors.primary.main, 0.1) }} />

                {/* Responsable */}
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary.main, mb: 2, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                    1. Responsable
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.text.secondary, lineHeight: 1.8 }}>
                    <strong>VUGAA México</strong><br />
                    Av. Paseo de la Reforma 123, Piso 15, Col. Juárez, Cuauhtémoc, C.P. 06600, CDMX<br />
                    privacidad@vugaa.mx
                  </Typography>
                </Box>

                <Divider sx={{ my: 4, borderColor: alpha(colors.primary.main, 0.1) }} />

                {/* Datos recopilados */}
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary.main, mb: 3, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                    2. Datos Recopilados
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, bgcolor: colors.primary.light, borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.primary.main }}>Identificación</Typography>
                        <Typography variant="body2">Nombre, RFC, CURP, domicilio, correo</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, bgcolor: colors.primary.light, borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.primary.main }}>Profesionales</Typography>
                        <Typography variant="body2">Patente, certificaciones, operaciones</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 4, borderColor: alpha(colors.primary.main, 0.1) }} />

                {/* Derechos ARCO */}
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary.main, mb: 2, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                    3. Derechos ARCO
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.text.secondary, lineHeight: 1.8, mb: 2 }}>
                    Puedes ejercer tus derechos de Acceso, Rectificación, Cancelación y Oposición enviando un correo a <strong style={{ color: colors.secondary.main }}>arco@vugaa.mx</strong>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </TabPanel>

          {/* Contenido de Política de Cookies */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ px: { xs: 3, md: 5 } }}>
              <Typography
                variant="body2"
                sx={{
                  color: colors.text.tertiary,
                  mb: 4,
                  pb: 2,
                  borderBottom: `1px solid ${colors.border.light}`,
                  fontStyle: 'italic',
                }}
              >
                Última actualización: 18 de febrero de 2026
              </Typography>

              <Box sx={{ '& > *': { mb: 3 } }}>
                {/* Introducción */}
                <Typography variant="body1" sx={{ color: colors.text.secondary, lineHeight: 1.8 }}>
                  Utilizamos cookies para mejorar tu experiencia. Esta política explica qué son y cómo puedes gestionarlas.
                </Typography>

                <Divider sx={{ my: 4, borderColor: alpha(colors.primary.main, 0.1) }} />

                {/* Gestión de cookies */}
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary.main, mb: 3, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                    Preferencias de Cookies
                  </Typography>

                  {/* Necesarias */}
                  <Paper sx={{ p: 3, mb: 2, bgcolor: colors.primary.light, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: colors.primary.main }}>Necesarias</Typography>
                        <Typography variant="body2">Esenciales para el funcionamiento del sitio</Typography>
                      </Box>
                      <Switch checked={cookiePreferences.necesarias} disabled />
                    </Box>
                  </Paper>

                  {/* Rendimiento */}
                  <Paper sx={{ p: 3, mb: 2, border: `1px solid ${colors.border.light}`, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text.primary }}>Rendimiento</Typography>
                        <Typography variant="body2">Análisis de tráfico y comportamiento</Typography>
                      </Box>
                      <Switch checked={cookiePreferences.rendimiento} onChange={() => handleCookieChange('rendimiento')} />
                    </Box>
                  </Paper>

                  {/* Funcionalidad */}
                  <Paper sx={{ p: 3, mb: 2, border: `1px solid ${colors.border.light}`, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text.primary }}>Funcionalidad</Typography>
                        <Typography variant="body2">Recordar preferencias y configuraciones</Typography>
                      </Box>
                      <Switch checked={cookiePreferences.funcionalidad} onChange={() => handleCookieChange('funcionalidad')} />
                    </Box>
                  </Paper>

                  {/* Publicidad */}
                  <Paper sx={{ p: 3, mb: 3, border: `1px solid ${colors.border.light}`, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text.primary }}>Publicidad</Typography>
                        <Typography variant="body2">Anuncios personalizados</Typography>
                      </Box>
                      <Switch checked={cookiePreferences.publicidad} onChange={() => handleCookieChange('publicidad')} />
                    </Box>
                  </Paper>

                  <Button variant="contained" sx={{ bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.medium } }}>
                    Guardar Preferencias
                  </Button>
                </Box>
              </Box>
            </Box>
          </TabPanel>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: colors.background.dark, py: 4, mt: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center" sx={{ color: alpha(colors.white, 0.7) }}>
            © {new Date().getFullYear()} VUGAA - Ventanilla Única de Gestión de Agentes Aduanales
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default PaginaLegalCompleta;