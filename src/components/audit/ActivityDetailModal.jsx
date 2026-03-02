// src/components/audit/ActivityDetailModal.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  Paper,
  Divider,
  Avatar,
  Button,
  Stack,
  Grid,
} from "@mui/material";

import {
  History as HistoryIcon,
  Info as InfoIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Fingerprint as FingerprintIcon,
  Computer as ComputerIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

// Colores institucionales
const institutionalColors = {
  primary: '#133B6B',      // Azul oscuro principal
  secondary: '#1a4c7a',    // Azul medio
  accent: '#e9e9e9',       // Color para acentos (gris claro)
  background: '#f8fafc',   // Fondo claro
  lightBlue: 'rgba(19, 59, 107, 0.08)',  // Azul transparente para hover
  darkBlue: '#0D2A4D',     // Azul más oscuro
  textPrimary: '#2c3e50',  // Texto principal
  textSecondary: '#7f8c8d', // Texto secundario
  success: '#27ae60',      // Verde para éxito
  warning: '#f39c12',      // Naranja para advertencias
  error: '#e74c3c',        // Rojo para errores
  info: '#3498db',         // Azul para información
};

/* helpers */
const getSeverityColor = (severity) => {
  switch (severity) {
    case "success":
      return institutionalColors.success;
    case "info":
      return institutionalColors.info;
    case "warning":
      return institutionalColors.warning;
    case "error":
      return institutionalColors.error;
    default:
      return institutionalColors.textSecondary;
  }
};

const getSeverityIcon = (severity) => {
  const color = getSeverityColor(severity);
  switch (severity) {
    case "success":
      return <CheckCircleIcon sx={{ color }} />;
    case "warning":
      return <WarningIcon sx={{ color }} />;
    case "error":
      return <ErrorIcon sx={{ color }} />;
    default:
      return <InfoIcon sx={{ color }} />;
  }
};

const getRoleColor = (role) => {
  switch (role) {
    case "admin":
      return institutionalColors.success;
    case "comite":
      return institutionalColors.primary;
    case "agente":
      return "#526F78";
    case "profesionista":
      return "#2ecc71";
    case "empresario":
      return "#ed6c02";
    default:
      return institutionalColors.textSecondary;
  }
};

export default function ActivityDetailModal({ open, onClose, activity }) {
  if (!activity) return null;

  const severityColor = getSeverityColor(activity.severity);
  const roleColor = getRoleColor(activity.user.role);

  const Item = ({ icon, label, value }) => (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ color: institutionalColors.primary, minWidth: 24 }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
          {label}
        </Typography>
        <Typography fontWeight={500} sx={{ color: institutionalColors.textPrimary }}>{value}</Typography>
      </Box>
    </Stack>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ 
        sx: { 
          borderRadius: 3,
          border: `1px solid ${institutionalColors.lightBlue}`,
        } 
      }}
    >
      {/* HEADER */}
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${institutionalColors.lightBlue}`, 
        bgcolor: institutionalColors.background,
      }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            {getSeverityIcon(activity.severity)}

            <Box>
              <Typography fontWeight={700} sx={{ color: institutionalColors.primary }}>
                Detalles de la Actividad
              </Typography>

              <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                Evento #{activity.id}
              </Typography>
            </Box>
          </Stack>

          <Chip
            label={activity.severity}
            size="small"
            sx={{
              bgcolor: severityColor + "20",
              color: severityColor,
              fontWeight: 600,
              border: `1px solid ${severityColor}`,
            }}
          />
        </Stack>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ py: 3 }}>
        <Paper variant="outlined" sx={{ 
          p: 3, 
          borderRadius: 2,
          borderColor: institutionalColors.lightBlue,
        }}>
          {/* INFO ACCION */}
          <Typography fontWeight={700} mb={2} sx={{ color: institutionalColors.primary }}>
            Información de la Acción
          </Typography>

          {/* GRID EN COLUMNAS */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Item
                icon={<HistoryIcon fontSize="small" />}
                label="Fecha y Hora"
                value={activity.timestamp}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Item
                icon={<InfoIcon fontSize="small" />}
                label="Acción"
                value={activity.actionName}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Item
                icon={<BusinessIcon fontSize="small" />}
                label="Instancia"
                value={activity.instanceName}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Item
                icon={<DescriptionIcon fontSize="small" />}
                label="Entidad"
                value={activity.entity}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Item
                icon={<FingerprintIcon fontSize="small" />}
                label="ID Entidad"
                value={activity.entityId}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Item
                icon={<ComputerIcon fontSize="small" />}
                label="IP"
                value={activity.ip}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3, borderColor: institutionalColors.lightBlue }} />

          {/* Información del Usuario */}
          <Typography fontWeight={700} mb={2} sx={{ color: institutionalColors.primary }}>
            Usuario
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: roleColor,
                fontWeight: 700,
                fontSize: 16,
                border: `2px solid ${institutionalColors.lightBlue}`,
              }}
            >
              {activity.user.avatar}
            </Avatar>

            <Box>
              <Typography fontWeight={700} sx={{ color: institutionalColors.textPrimary }}>
                {activity.user.name}
              </Typography>

              <Chip
                label={activity.user.role}
                size="small"
                sx={{
                  bgcolor: roleColor + "20",
                  color: roleColor,
                  mt: 0.5,
                  border: `1px solid ${roleColor}`,
                }}
              />

              <Typography variant="body2" sx={{ color: institutionalColors.textSecondary, mt: 0.5 }}>
                {activity.user.email}
              </Typography>

              <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                ID: USR-{activity.id}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </DialogContent>

      {/* FOOTER */}
      <DialogActions sx={{ 
        p: 2, 
        borderTop: `1px solid ${institutionalColors.lightBlue}`,
        bgcolor: institutionalColors.background,
      }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ 
            borderRadius: 2, 
            px: 4,
            bgcolor: institutionalColors.primary,
            '&:hover': {
              bgcolor: institutionalColors.secondary,
            }
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}