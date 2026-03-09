// src/components/audit/ActivityDetailModal.jsx
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, Chip, Paper, Divider, Avatar,
  Button, Stack, Grid,
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
  DevicesOther as DevicesIcon,
} from "@mui/icons-material";

const institutionalColors = {
  primary: '#133B6B',
  secondary: '#1a4c7a',
  background: '#f8fafc',
  lightBlue: 'rgba(19, 59, 107, 0.08)',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  success: '#27ae60',
  warning: '#f39c12',
  error: '#e74c3c',
  info: '#3498db',
};

// Mapea accion del DTO a severity visual
const severityFromAccion = (accion = '') => {
  const a = accion.toUpperCase();
  if (a.includes('ELIMINAD') || a.includes('ERROR') || a.includes('RECHAZ')) return 'error';
  if (a.includes('DESACTIVAD') || a.includes('VENCIM') || a.includes('ALERTA'))  return 'warning';
  if (a.includes('CREAD') || a.includes('APROBAD') || a.includes('COMPLETAD'))   return 'success';
  return 'info';
};

const getSeverityColor = (severity) => ({
  success: institutionalColors.success,
  warning: institutionalColors.warning,
  error:   institutionalColors.error,
  info:    institutionalColors.info,
}[severity] || institutionalColors.textSecondary);

const getSeverityIcon = (severity) => {
  const color = getSeverityColor(severity);
  if (severity === 'success') return <CheckCircleIcon sx={{ color }} />;
  if (severity === 'warning') return <WarningIcon     sx={{ color }} />;
  if (severity === 'error')   return <ErrorIcon       sx={{ color }} />;
  return                             <InfoIcon         sx={{ color }} />;
};

const Item = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1} alignItems="flex-start">
    <Box sx={{ color: institutionalColors.primary, minWidth: 24, mt: 0.3 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
        {label}
      </Typography>
      <Typography fontWeight={500} sx={{ color: institutionalColors.textPrimary, wordBreak: 'break-all' }}>
        {value || '—'}
      </Typography>
    </Box>
  </Stack>
);

export default function ActivityDetailModal({ open, onClose, activity }) {
  if (!activity) return null;

  // ── mapeo DTO → campos visuales ──────────────────────────────────────────
  // activity es un AuditoriaDTO:
  // idAuditoria, idUsuario, nombreUsuario, idInstancia, nombreInstancia,
  // accion, entidadTipo, idEntidad, valorAnterior, valorNuevo,
  // ipOrigen, userAgent, fecha

  const severity      = severityFromAccion(activity.accion);
  const severityColor = getSeverityColor(severity);

  const fechaFormateada = activity.fecha
    ? new Date(activity.fecha).toLocaleString('es-MX', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      })
    : '—';

  const iniciales = activity.nombreUsuario
    ? activity.nombreUsuario.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  // valorAnterior / valorNuevo pueden ser objetos JSON
  const renderJson = (val) => {
    if (!val) return '—';
    if (typeof val === 'object') return JSON.stringify(val, null, 2);
    return String(val);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 3, border: `1px solid ${institutionalColors.lightBlue}` } }}>

      {/* HEADER */}
      <DialogTitle sx={{ borderBottom: `1px solid ${institutionalColors.lightBlue}`, bgcolor: institutionalColors.background }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.5} alignItems="center">
            {getSeverityIcon(severity)}
            <Box>
              <Typography fontWeight={700} sx={{ color: institutionalColors.primary }}>
                Detalles de la Actividad
              </Typography>
              <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                Registro #{activity.idAuditoria}
              </Typography>
            </Box>
          </Stack>

          <Chip label={activity.accion} size="small"
            sx={{ bgcolor: severityColor + '20', color: severityColor,
                  fontWeight: 600, border: `1px solid ${severityColor}`, maxWidth: 220 }} />
        </Stack>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ py: 3 }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, borderColor: institutionalColors.lightBlue }}>

          {/* Información de la Acción */}
          <Typography fontWeight={700} mb={2} sx={{ color: institutionalColors.primary }}>
            Información de la Acción
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Item icon={<HistoryIcon fontSize="small" />}
                label="Fecha y Hora" value={fechaFormateada} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Item icon={<InfoIcon fontSize="small" />}
                label="Acción" value={activity.accion} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Item icon={<BusinessIcon fontSize="small" />}
                label="Instancia" value={activity.nombreInstancia || `ID ${activity.idInstancia}`} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Item icon={<DescriptionIcon fontSize="small" />}
                label="Entidad" value={activity.entidadTipo} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Item icon={<FingerprintIcon fontSize="small" />}
                label="ID Entidad" value={activity.idEntidad} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Item icon={<ComputerIcon fontSize="small" />}
                label="IP Origen" value={activity.ipOrigen} />
            </Grid>

            {activity.userAgent && (
              <Grid item xs={12}>
                <Item icon={<DevicesIcon fontSize="small" />}
                  label="User Agent" value={activity.userAgent} />
              </Grid>
            )}
          </Grid>

          {/* Valores anterior / nuevo */}
          {(activity.valorAnterior || activity.valorNuevo) && (
            <>
              <Divider sx={{ my: 3, borderColor: institutionalColors.lightBlue }} />
              <Typography fontWeight={700} mb={2} sx={{ color: institutionalColors.primary }}>
                Cambios Registrados
              </Typography>
              <Grid container spacing={2}>
                {activity.valorAnterior && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                      VALOR ANTERIOR
                    </Typography>
                    <Box component="pre" sx={{
                      mt: 0.5, p: 1.5, borderRadius: 1, fontSize: '0.75rem',
                      bgcolor: '#fff3f3', border: `1px solid ${institutionalColors.error}30`,
                      color: institutionalColors.textPrimary, overflowX: 'auto', whiteSpace: 'pre-wrap'
                    }}>
                      {renderJson(activity.valorAnterior)}
                    </Box>
                  </Grid>
                )}
                {activity.valorNuevo && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                      VALOR NUEVO
                    </Typography>
                    <Box component="pre" sx={{
                      mt: 0.5, p: 1.5, borderRadius: 1, fontSize: '0.75rem',
                      bgcolor: '#f3fff6', border: `1px solid ${institutionalColors.success}30`,
                      color: institutionalColors.textPrimary, overflowX: 'auto', whiteSpace: 'pre-wrap'
                    }}>
                      {renderJson(activity.valorNuevo)}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </>
          )}

          <Divider sx={{ my: 3, borderColor: institutionalColors.lightBlue }} />

          {/* Usuario */}
          <Typography fontWeight={700} mb={2} sx={{ color: institutionalColors.primary }}>
            Usuario
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{
              width: 48, height: 48, fontWeight: 700, fontSize: 16,
              bgcolor: institutionalColors.primary,
              border: `2px solid ${institutionalColors.lightBlue}`,
            }}>
              {iniciales}
            </Avatar>

            <Box>
              <Typography fontWeight={700} sx={{ color: institutionalColors.textPrimary }}>
                {activity.nombreUsuario || '—'}
              </Typography>

              <Typography variant="body2" sx={{ color: institutionalColors.textSecondary, mt: 0.3 }}>
                ID Usuario: {activity.idUsuario}
              </Typography>

              <Typography variant="caption" sx={{ color: institutionalColors.textSecondary }}>
                ID Instancia: {activity.idInstancia}
              </Typography>
            </Box>
          </Box>

        </Paper>
      </DialogContent>

      {/* FOOTER */}
      <DialogActions sx={{ p: 2, borderTop: `1px solid ${institutionalColors.lightBlue}`, bgcolor: institutionalColors.background }}>
        <Button onClick={onClose} variant="contained" sx={{
          borderRadius: 2, px: 4,
          bgcolor: institutionalColors.primary,
          '&:hover': { bgcolor: institutionalColors.secondary }
        }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}