// src/components/declaracionesAdmin/CreateDeclaracionDialog.jsx
import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, Typography,
  Alert, CircularProgress, Box, Divider, Paper, IconButton, Tooltip,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { institutionalColors } from "../../utils/iconosUtils";
import declaracionesService from "../../services/declaracion";

// FIX #2: No hay arreglo fijo de tipos — el usuario escribe libremente el tipo.

const PUNTO_VACIO = { texto: "", articulo: "" };

/** Construye el JSON desde la lista visual de puntos */
const buildConfigJson = (puntos) => {
  const items = puntos
    .filter(p => p.texto.trim())
    .map((p, i) => ({
      orden:    i + 1,
      texto:    p.texto.trim(),
      articulo: p.articulo.trim() || null,
    }));
  return items.length ? JSON.stringify({ puntos: items }) : null;
};

const FORM_INICIAL = {
  nombre:             "",
  articuloReferencia: "",
  tipo:               "",        // texto libre
  descripcion:        "",
  vigenciaDias:       365,
};

const CreateDeclaracionDialog = ({ open, onClose, onSuccess, instanciaId }) => {
  const [formData, setFormData] = useState(FORM_INICIAL);
  const [puntos,   setPuntos]   = useState([{ ...PUNTO_VACIO }]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePuntoChange = (index, field, value) =>
    setPuntos(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));

  const addPunto    = () => setPuntos(prev => [...prev, { ...PUNTO_VACIO }]);
  const removePunto = (index) =>
    puntos.length > 1 && setPuntos(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!formData.nombre.trim())           { setError("El nombre es requerido"); return; }
    if (!formData.tipo.trim())             { setError("El tipo es requerido"); return; }
    if (!instanciaId)                      { setError("ID de instancia no proporcionado"); return; }
    const vigencia = parseInt(formData.vigenciaDias);
    if (isNaN(vigencia) || vigencia < 1)   { setError("La vigencia debe ser un número mayor a 0"); return; }
    if (!puntos.some(p => p.texto.trim())) { setError("Agrega al menos un punto de declaración"); return; }

    try {
      setLoading(true);
      setError(null);
      const payload = {
        idInstancia:        Number(instanciaId),
        nombre:             formData.nombre.trim(),
        articuloReferencia: formData.articuloReferencia.trim() || null,
        descripcion:        formData.descripcion.trim()        || null,
        tipo:               formData.tipo.trim(),
        vigenciaDias:       vigencia,
        activa:             true,
        configuracionJson:  buildConfigJson(puntos),
      };
      const nueva = await declaracionesService.create(payload);
      onSuccess(nueva);
      handleClose();
    } catch (err) {
      setError(err?.message || err?.error || "Error al crear la declaración");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(FORM_INICIAL);
    setPuntos([{ ...PUNTO_VACIO }]);
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open} onClose={handleClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: "50%",
            bgcolor: alpha(institutionalColors.primary, 0.1),
            color: institutionalColors.primary,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <AssignmentIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">Crear Nueva Declaración</Typography>
            <Typography variant="caption" color="textSecondary">
              Complete los datos y defina los puntos que el usuario deberá declarar
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2.5 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={2.5}>

          {/* ── Datos generales ── */}
          <Grid item xs={12}>
            <Typography
              variant="subtitle2" fontWeight="bold" color="textSecondary"
              sx={{ textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: 0.5, mb: 0.5 }}
            >
              Datos generales
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="nombre" label="Nombre de la declaración *"
              value={formData.nombre} onChange={handleChange}
              fullWidth size="small"
              placeholder="Ej: Declaración de Intereses 2024"
              inputProps={{ maxLength: 200 }}
              helperText={`${formData.nombre.length}/200`}
            />
          </Grid>

          {/* FIX #2: tipo como TextField libre (no select) */}
          <Grid item xs={12} md={5}>
            <TextField
              name="tipo" label="Tipo de declaración *"
              value={formData.tipo} onChange={handleChange}
              fullWidth size="small"
              placeholder="Ej: PATRIMONIAL, INTERESES, FISCAL..."
              inputProps={{ maxLength: 100 }}
              helperText="Escribe el tipo libremente"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              name="articuloReferencia" label="Artículo de referencia"
              value={formData.articuloReferencia} onChange={handleChange}
              fullWidth size="small" placeholder="Ej: Art. 92"
              inputProps={{ maxLength: 50 }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              name="vigenciaDias" label="Vigencia (días)"
              type="number" value={formData.vigenciaDias} onChange={handleChange}
              fullWidth size="small" inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="descripcion" label="Descripción (opcional)"
              value={formData.descripcion} onChange={handleChange}
              fullWidth multiline rows={2} size="small"
              placeholder="Descripción general de esta declaración"
            />
          </Grid>

          {/* ── Puntos de declaración ── */}
          <Grid item xs={12}>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{
              display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", mb: 2,
            }}>
              <Box>
                <Typography
                  variant="subtitle2" fontWeight="bold" color="textSecondary"
                  sx={{ textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: 0.5 }}
                >
                  Puntos de declaración
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Cada punto es una afirmación que el usuario leerá y marcará al declarar
                </Typography>
              </Box>
              <Button
                size="small" variant="outlined" startIcon={<AddIcon />} onClick={addPunto}
                sx={{ borderColor: institutionalColors.primary, color: institutionalColors.primary, flexShrink: 0 }}
              >
                Agregar punto
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {puntos.map((punto, index) => (
                <Paper
                  key={index} variant="outlined"
                  sx={{
                    p: 2, borderRadius: 2,
                    borderColor: punto.texto.trim()
                      ? alpha(institutionalColors.primary, 0.25)
                      : alpha(institutionalColors.primary, 0.12),
                    bgcolor: alpha(institutionalColors.primary, 0.015),
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                    {/* Número */}
                    <Box sx={{
                      minWidth: 28, height: 28, borderRadius: "50%",
                      bgcolor: institutionalColors.primary, color: "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, mt: 0.5,
                    }}>
                      <Typography variant="caption" fontWeight="bold">{index + 1}</Typography>
                    </Box>

                    {/* Campos */}
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                      <TextField
                        label="Texto del punto *"
                        value={punto.texto}
                        onChange={e => handlePuntoChange(index, "texto", e.target.value)}
                        fullWidth multiline minRows={2} size="small"
                        placeholder="Ej: Declaro que no tengo intereses personales o de negocios que puedan afectar el desempeño imparcial..."
                      />
                      <TextField
                        label="Artículo de referencia del punto (opcional)"
                        value={punto.articulo}
                        onChange={e => handlePuntoChange(index, "articulo", e.target.value)}
                        fullWidth size="small"
                        placeholder="Ej: Art. 92, fracción I"
                        inputProps={{ maxLength: 200 }}
                      />
                    </Box>

                    {/* Eliminar */}
                    <Tooltip
                      title={puntos.length === 1 ? "Debe haber al menos un punto" : "Eliminar punto"}
                      arrow
                    >
                      <span>
                        <IconButton
                          size="small" onClick={() => removePunto(index)}
                          disabled={puntos.length === 1}
                          sx={{
                            color: institutionalColors.error, mt: 0.5,
                            "&:hover": { bgcolor: alpha(institutionalColors.error, 0.08) },
                            "&.Mui-disabled": { opacity: 0.3 },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </Paper>
              ))}
            </Box>

            {/* Botón añadir al fondo */}
            <Button
              fullWidth size="small" startIcon={<AddIcon />} onClick={addPunto}
              sx={{
                mt: 1.5, py: 1,
                border: `1.5px dashed ${alpha(institutionalColors.primary, 0.3)}`,
                color: alpha(institutionalColors.primary, 0.7),
                borderRadius: 2,
                "&:hover": {
                  bgcolor: alpha(institutionalColors.primary, 0.04),
                  borderColor: institutionalColors.primary,
                  color: institutionalColors.primary,
                },
              }}
            >
              + Agregar otro punto
            </Button>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={loading} color="inherit">Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.nombre.trim() || !formData.tipo.trim()}
          startIcon={loading ? <CircularProgress size={18} /> : null}
          sx={{
            bgcolor: institutionalColors.primary,
            "&:hover": { bgcolor: institutionalColors.secondary },
          }}
        >
          {loading ? "Creando..." : "Crear Declaración"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDeclaracionDialog; 