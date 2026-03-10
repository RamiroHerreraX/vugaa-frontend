// src/components/declaracionesAdmin/ViewDeclaracionDialog.jsx
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Grid, Typography, Chip, Divider, Paper,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
  Timer as TimerIcon,
  Article as ArticleIcon,
  Gavel as GavelIcon,
  AccessTime as AccessTimeIcon,
  Update as UpdateIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { institutionalColors } from "../../utils/iconosUtils";

// FIX #2: El tipo es texto libre, no hay mapa fijo.
// Generamos el color dinámicamente igual que en ConfigDeclaraciones.
const colorPalette = [
  "#133B6B", "#00A8A8", "#E67E22", "#2980B9",
  "#8E44AD", "#27AE60", "#C0392B", "#16A085",
];
const hashColor = (str) => {
  if (!str) return colorPalette[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colorPalette[Math.abs(hash) % colorPalette.length];
};

const parseConfigJson = (jsonString) => {
  if (!jsonString) return null;
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.puntos && Array.isArray(parsed.puntos)) return parsed;
  } catch { /* noop */ }
  return null;
};

const formatDate = (d) => {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString("es-MX", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return d; }
};

const InfoCard = ({ icon, label, value, color = institutionalColors.primary }) => (
  <Grid item xs={12} md={4}>
    <Paper sx={{
      p: 1.75, height: "100%",
      bgcolor: alpha(color, 0.04),
      border: `1px solid ${alpha(color, 0.12)}`,
      borderRadius: 2,
    }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
        <Box sx={{ color, display: "flex" }}>{icon}</Box>
        <Typography variant="caption" color="textSecondary" fontWeight="medium">{label}</Typography>
      </Box>
      <Typography variant="body2" fontWeight="medium">{value}</Typography>
    </Paper>
  </Grid>
);

const ViewDeclaracionDialog = ({ open, onClose, declaracion, onEdit }) => {
  if (!declaracion) return null;

  const tipoColor = declaracion.color || hashColor(declaracion.tipo);
  const tipoLabel = declaracion.tipo  || "Sin tipo";

  const config = parseConfigJson(declaracion.configuracionJson);
  const puntos = config?.puntos || [];

  return (
    <Dialog
      open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      {/* ── Título ── */}
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: "50%",
            bgcolor: alpha(tipoColor, 0.1), color: tipoColor,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <AssignmentIcon />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold">{declaracion.nombre}</Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
              <Chip
                size="small" label={tipoLabel}
                sx={{ bgcolor: alpha(tipoColor, 0.1), color: tipoColor }}
              />
              <Chip
                size="small"
                icon={declaracion.activa !== false ? <CheckCircleIcon /> : <CancelIcon />}
                label={declaracion.activa !== false ? "Activa" : "Inactiva"}
                color={declaracion.activa !== false ? "success" : "error"}
              />
            </Box>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2.5}>

          {/* Descripción */}
          {declaracion.descripcion && (
            <Grid item xs={12}>
              <Typography
                variant="subtitle2" color="textSecondary" gutterBottom
                sx={{ textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: 0.5 }}
              >
                Descripción
              </Typography>
              <Typography variant="body1">{declaracion.descripcion}</Typography>
            </Grid>
          )}

          <Grid item xs={12}><Divider /></Grid>

          {/* Detalles */}
          <Grid item xs={12}>
            <Typography
              variant="subtitle2" color="textSecondary" gutterBottom
              sx={{ textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: 0.5 }}
            >
              Detalles
            </Typography>
          </Grid>

          <InfoCard
            icon={<ArticleIcon fontSize="small" />}
            label="Artículo de referencia"
            value={declaracion.articuloReferencia || "No especificado"}
            color={institutionalColors.primary}
          />
          <InfoCard
            icon={<TimerIcon fontSize="small" />}
            label="Vigencia"
            value={declaracion.vigenciaDias ? `${declaracion.vigenciaDias} días` : "No definida"}
            color={institutionalColors.info}
          />
          <InfoCard
            icon={<BusinessIcon fontSize="small" />}
            label="ID Instancia"
            value={`#${declaracion.idInstancia}`}
            color={institutionalColors.secondary}
          />

          {/* Fechas de auditoría */}
          {(declaracion.fechaCreacion || declaracion.fechaActualizacion) && (
            <>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2" color="textSecondary" gutterBottom
                  sx={{ textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: 0.5 }}
                >
                  Auditoría
                </Typography>
              </Grid>
              {declaracion.fechaCreacion && (
                <InfoCard
                  icon={<AccessTimeIcon fontSize="small" />}
                  label="Fecha de creación"
                  value={formatDate(declaracion.fechaCreacion)}
                  color={institutionalColors.success}
                />
              )}
              {declaracion.fechaActualizacion && (
                <InfoCard
                  icon={<UpdateIcon fontSize="small" />}
                  label="Última actualización"
                  value={formatDate(declaracion.fechaActualizacion)}
                  color={institutionalColors.info}
                />
              )}
            </>
          )}

          {/* ── Puntos de declaración ── */}
          {puntos.length > 0 && (
            <>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2" color="textSecondary" gutterBottom
                  sx={{ textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: 0.5, mb: 1.5 }}
                >
                  Puntos que el usuario declara ({puntos.length})
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {puntos.map((punto, index) => (
                    <Paper
                      key={index} variant="outlined"
                      sx={{
                        p: 2, borderRadius: 2,
                        borderColor: alpha(institutionalColors.primary, 0.15),
                        bgcolor: "#fff",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                        <Box sx={{
                          minWidth: 32, height: 32, borderRadius: "50%",
                          bgcolor: institutionalColors.primary, color: "white",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, mt: 0.25,
                        }}>
                          <Typography variant="body2" fontWeight="bold">{index + 1}</Typography>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ lineHeight: 1.6, mb: punto.articulo ? 1 : 0 }}>
                            {punto.texto}
                          </Typography>
                          {punto.articulo && (
                            <Box sx={{
                              display: "inline-flex", alignItems: "center", gap: 0.5,
                              bgcolor: alpha(institutionalColors.primary, 0.07),
                              border: `1px solid ${alpha(institutionalColors.primary, 0.2)}`,
                              borderRadius: 1, px: 1, py: 0.25,
                            }}>
                              <GavelIcon sx={{ fontSize: 12, color: institutionalColors.primary }} />
                              <Typography variant="caption"
                                sx={{ color: institutionalColors.primary, fontWeight: "medium" }}>
                                {punto.articulo}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Grid>
            </>
          )}

          {/* Sin puntos configurados */}
          {puntos.length === 0 && (
            <>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{
                  p: 3, borderRadius: 2, textAlign: "center",
                  borderColor: alpha(institutionalColors.primary, 0.15),
                  bgcolor: alpha(institutionalColors.primary, 0.02),
                }}>
                  <Typography variant="body2" color="textSecondary">
                    Esta declaración aún no tiene puntos configurados.
                  </Typography>
                </Paper>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Cerrar</Button>
        {onEdit && (
          <Button
            onClick={() => { onClose(); onEdit(); }}
            variant="contained"
            sx={{
              bgcolor: institutionalColors.primary,
              "&:hover": { bgcolor: institutionalColors.secondary },
            }}
          >
            Editar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ViewDeclaracionDialog;